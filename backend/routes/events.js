const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY start_date DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, image, start_date, end_date, location, organizer, status, type, link } = req.body
    const [result] = await pool.query(
      'INSERT INTO events (title, description, image, start_date, end_date, location, organizer, status, type, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, image || null, start_date, end_date || null, location || null, organizer || null, status || 'upcoming', type || 'promotion', link || null]
    )
    res.status(201).json({ id: result.insertId, title })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, image, start_date, end_date, location, organizer, status, type, link } = req.body
    await pool.query(
      'UPDATE events SET title=?, description=?, image=?, start_date=?, end_date=?, location=?, organizer=?, status=?, type=?, link=? WHERE id=?',
      [title, description, image, start_date, end_date, location, organizer, status, type, link, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
