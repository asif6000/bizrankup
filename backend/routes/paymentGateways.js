const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payment_gateways')
    const safe = rows.map(r => ({ ...r, credentials: typeof r.credentials === 'string' ? JSON.parse(r.credentials) : r.credentials }))
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT provider FROM payment_gateways WHERE active = TRUE')
    res.json(rows.map(r => r.provider))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:provider', adminAuth, async (req, res) => {
  try {
    const { credentials, active } = req.body
    const [existing] = await pool.query('SELECT id FROM payment_gateways WHERE provider = ?', [req.params.provider])
    if (existing.length) {
      await pool.query('UPDATE payment_gateways SET credentials = ?, active = ? WHERE provider = ?',
        [JSON.stringify(credentials || {}), active !== undefined ? active : false, req.params.provider])
    } else {
      await pool.query('INSERT INTO payment_gateways (provider, credentials, active) VALUES (?, ?, ?)',
        [req.params.provider, JSON.stringify(credentials || {}), active || false])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
