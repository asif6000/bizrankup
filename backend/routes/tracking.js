const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')
const eventEmitter = require('../events')

const router = express.Router()

const trackingProviders = ['facebook', 'ga4', 'gtm', 'tiktok']

router.get('/', adminAuth, async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM payment_gateways WHERE provider LIKE ?', ['tracking_%'])
    const configs = {}
    trackingProviders.forEach(p => { configs[p] = {} })
    existing[0].forEach(row => {
      const provider = row.provider.replace('tracking_', '')
      configs[provider] = {
        ...(typeof row.credentials === 'string' ? JSON.parse(row.credentials) : row.credentials),
        active: row.active,
      }
    })
    res.json(configs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:provider', adminAuth, async (req, res) => {
  try {
    const { credentials, active } = req.body
    const providerKey = `tracking_${req.params.provider}`
    const [existing] = await pool.query('SELECT id FROM payment_gateways WHERE provider = ?', [providerKey])
    if (existing.length) {
      await pool.query('UPDATE payment_gateways SET credentials = ?, active = ? WHERE provider = ?',
        [JSON.stringify(credentials || {}), active !== undefined ? active : false, providerKey])
    } else {
      await pool.query('INSERT INTO payment_gateways (provider, credentials, active) VALUES (?, ?, ?)',
        [providerKey, JSON.stringify(credentials || {}), active || false])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Log a tracking event (public - used by storefront)
router.post('/events', async (req, res) => {
  try {
    const { source, event_name, event_data, page_url, session_id, user_id } = req.body
    if (!source || !event_name) return res.status(400).json({ error: 'source and event_name are required' })
    if (!['facebook', 'ga4', 'tiktok'].includes(source)) return res.status(400).json({ error: 'Invalid source' })

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
    const ua = req.headers['user-agent'] || null

    const [result] = await pool.query(
      'INSERT INTO tracking_events (source, event_name, event_data, page_url, ip_address, user_agent, session_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [source, event_name, JSON.stringify(event_data || {}), page_url || null, ip, ua, session_id || null, user_id || null]
    )

    eventEmitter.emit('data:change', { table: 'tracking_events', type: 'insert', id: result.insertId })

    // Also emit tracking-specific event for real-time display
    eventEmitter.emit('tracking:event', {
      id: result.insertId,
      source,
      event_name,
      event_data: event_data || {},
      page_url: page_url || null,
      session_id: session_id || null,
      created_at: new Date().toISOString(),
    })

    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Fetch tracking events (admin auth)
router.get('/events', adminAuth, async (req, res) => {
  try {
    const { source, limit, offset } = req.query
    let sql = 'SELECT * FROM tracking_events'
    const params = []
    const conditions = []

    if (source) {
      conditions.push('source = ?')
      params.push(source)
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
    sql += ' ORDER BY created_at DESC'
    sql += ' LIMIT ? OFFSET ?'
    params.push(parseInt(limit) || 100, parseInt(offset) || 0)

    const [rows] = await pool.query(sql, params)

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM tracking_events' + (conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''), source ? [source] : [])
    const total = countResult[0]?.total || 0

    res.json({ events: rows, total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Clear tracking events (admin auth)
router.delete('/events', adminAuth, async (req, res) => {
  try {
    const { source } = req.query
    if (source) {
      await pool.query('DELETE FROM tracking_events WHERE source = ?', [source])
    } else {
      await pool.query('DELETE FROM tracking_events')
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send event to Facebook CAPI (admin auth)
router.post('/send/facebook', adminAuth, async (req, res) => {
  try {
    const { event_name, event_data, user_data } = req.body
    const [configs] = await pool.query('SELECT credentials FROM payment_gateways WHERE provider = ?', ['tracking_facebook'])
    if (!configs.length) return res.status(400).json({ error: 'Facebook not configured' })

    const creds = typeof configs[0].credentials === 'string' ? JSON.parse(configs[0].credentials) : configs[0].credentials
    if (!creds.pixelId || !creds.accessToken) return res.status(400).json({ error: 'Facebook credentials incomplete' })

    const payload = {
      data: [{
        event_name: event_name || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          client_ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
          client_user_agent: req.headers['user-agent'] || '',
          ...(user_data || {}),
        },
        custom_data: event_data || {},
        event_source_url: req.headers['referer'] || '',
      }],
      access_token: creds.accessToken,
    }

    const fbRes = await fetch(`https://graph.facebook.com/${creds.apiVersion || 'v18.0'}/${creds.pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const fbData = await fbRes.json()
    res.json(fbData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send event to GA4 Measurement Protocol (admin auth)
router.post('/send/ga4', adminAuth, async (req, res) => {
  try {
    const { event_name, event_data } = req.body
    const [configs] = await pool.query('SELECT credentials FROM payment_gateways WHERE provider = ?', ['tracking_ga4'])
    if (!configs.length) return res.status(400).json({ error: 'GA4 not configured' })

    const creds = typeof configs[0].credentials === 'string' ? JSON.parse(configs[0].credentials) : configs[0].credentials
    if (!creds.measurementId || !creds.apiSecret) return res.status(400).json({ error: 'GA4 credentials incomplete' })

    const payload = {
      client_id: creds.clientId || 'bizrankup_' + Date.now(),
      events: [{
        name: event_name || 'page_view',
        params: event_data || {},
      }],
    }

    const gaRes = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${creds.measurementId}&api_secret=${creds.apiSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    res.json({ success: gaRes.ok, status: gaRes.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send event to TikTok Events API (admin auth)
router.post('/send/tiktok', adminAuth, async (req, res) => {
  try {
    const { event_name, event_data } = req.body
    const [configs] = await pool.query('SELECT credentials FROM payment_gateways WHERE provider = ?', ['tracking_tiktok'])
    if (!configs.length) return res.status(400).json({ error: 'TikTok not configured' })

    const creds = typeof configs[0].credentials === 'string' ? JSON.parse(configs[0].credentials) : configs[0].credentials
    if (!creds.pixelCode || !creds.accessToken) return res.status(400).json({ error: 'TikTok credentials incomplete' })

    const payload = {
      pixel_code: creds.pixelCode,
      event: event_name || 'ViewContent',
      event_id: 'bizrankup_' + Date.now(),
      timestamp: Math.floor(Date.now() / 1000),
      context: {
        ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
        user_agent: req.headers['user-agent'] || '',
      },
      properties: event_data || {},
    }

    const tkRes = await fetch(`https://business-api.tiktok.com/open_api/${creds.apiVersion || 'v1.0'}/pixel/track/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': creds.accessToken,
      },
      body: JSON.stringify(payload),
    })
    const tkData = await tkRes.json()
    res.json(tkData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
