const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payment_gateways WHERE provider LIKE 'courier_%'")
    const configs = {}
    rows.forEach(r => {
      const name = r.provider.replace('courier_', '')
      configs[name] = {
        ...(typeof r.credentials === 'string' ? JSON.parse(r.credentials) : r.credentials),
        active: r.active,
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
    const key = `courier_${req.params.provider}`
    const [existing] = await pool.query('SELECT id FROM payment_gateways WHERE provider = ?', [key])
    if (existing.length) {
      await pool.query('UPDATE payment_gateways SET credentials = ?, active = ? WHERE provider = ?',
        [JSON.stringify(credentials || {}), active !== undefined ? active : false, key])
    } else {
      await pool.query('INSERT INTO payment_gateways (provider, credentials, active) VALUES (?, ?, ?)',
        [key, JSON.stringify(credentials || {}), active || false])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
