const express = require('express')
const pool = require('../config/db')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const role = req.user.role
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE for_role IN (?, ?) ORDER BY created_at DESC LIMIT 50',
      ['all', role]
    )
    const enriched = rows.map(n => ({
      ...n,
      read_by: typeof n.read_by === 'string' ? JSON.parse(n.read_by) : n.read_by,
      is_read: n.read_by.includes(req.user.id),
    }))
    res.json(enriched)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { type, title, message, for_role } = req.body
    const [result] = await pool.query(
      'INSERT INTO notifications (type, title, message, for_role) VALUES (?, ?, ?, ?)',
      [type || 'info', title, message || null, for_role || 'all']
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/read', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT read_by FROM notifications WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Notification not found' })
    const readBy = typeof rows[0].read_by === 'string' ? JSON.parse(rows[0].read_by) : rows[0].read_by
    if (!readBy.includes(req.user.id)) {
      readBy.push(req.user.id)
      await pool.query('UPDATE notifications SET read_by = ? WHERE id = ?', [JSON.stringify(readBy), req.params.id])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
