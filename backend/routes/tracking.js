const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

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

module.exports = router
