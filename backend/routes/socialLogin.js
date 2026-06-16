const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM social_login_providers')
    const safe = rows.map(r => ({ ...r, credentials: typeof r.credentials === 'string' ? JSON.parse(r.credentials) : r.credentials }))
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT provider FROM social_login_providers WHERE active = TRUE')
    res.json(rows.map(r => r.provider))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:provider', adminAuth, async (req, res) => {
  try {
    const { credentials, active } = req.body
    const [existing] = await pool.query('SELECT id FROM social_login_providers WHERE provider = ?', [req.params.provider])
    if (existing.length) {
      await pool.query('UPDATE social_login_providers SET credentials = ?, active = ? WHERE provider = ?',
        [JSON.stringify(credentials || {}), active !== undefined ? active : false, req.params.provider])
    } else {
      await pool.query('INSERT INTO social_login_providers (provider, credentials, active) VALUES (?, ?, ?)',
        [req.params.provider, JSON.stringify(credentials || {}), active || false])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
