const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, avatar, role, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, avatar, role, created_at FROM users WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    const { name, phone, avatar } = req.body
    await pool.query('UPDATE users SET name=?, phone=?, avatar=? WHERE id=?', [name, phone || null, avatar || null, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/password', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) return res.status(403).json({ error: 'Access denied' })
    const { currentPassword, newPassword } = req.body
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.params.id])
    const valid = await bcrypt.compare(currentPassword, users[0].password)
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' })
    const hashed = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
