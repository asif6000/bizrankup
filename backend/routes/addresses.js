const express = require('express')
const pool = require('../config/db')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', require('../middleware/auth').adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM addresses ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { label, name, phone, street, city, state, zip, country, is_default } = req.body
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id])
    }
    const [result] = await pool.query(
      'INSERT INTO addresses (user_id, label, name, phone, street, city, state, zip, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, label || null, name, phone, street, city, state || null, zip || null, country || 'Bangladesh', is_default || false]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!existing.length) return res.status(404).json({ error: 'Address not found' })
    const { label, name, phone, street, city, state, zip, country, is_default } = req.body
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id])
    }
    await pool.query(
      'UPDATE addresses SET label=?, name=?, phone=?, street=?, city=?, state=?, zip=?, country=?, is_default=? WHERE id=?',
      [label, name, phone, street, city, state, zip, country || 'Bangladesh', is_default || false, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
