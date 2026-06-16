const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM offers WHERE active = TRUE AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM offers ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:code/validate', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM offers WHERE code = ? AND active = TRUE AND (expires_at IS NULL OR expires_at > NOW()) AND (usage_limit IS NULL OR used_count < usage_limit)',
      [req.params.code]
    )
    if (!rows.length) return res.status(404).json({ valid: false, error: 'Invalid or expired coupon' })
    res.json({ valid: true, offer: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, type, value, min_order, usage_limit, expires_at } = req.body
    const [result] = await pool.query(
      'INSERT INTO offers (code, type, value, min_order, usage_limit, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [code, type, value, min_order || 0, usage_limit || null, expires_at || null]
    )
    res.status(201).json({ id: result.insertId, code })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { code, type, value, min_order, usage_limit, expires_at, active } = req.body
    await pool.query(
      'UPDATE offers SET code=?, type=?, value=?, min_order=?, usage_limit=?, expires_at=?, active=? WHERE id=?',
      [code, type, value, min_order, usage_limit, expires_at, active, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM offers WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
