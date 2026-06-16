const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM order_statuses ORDER BY order_index ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, color, icon, order_index } = req.body
    const [result] = await pool.query(
      'INSERT INTO order_statuses (name, color, icon, order_index) VALUES (?, ?, ?, ?)',
      [name, color || '#6B7280', icon || 'FiCircle', order_index || 0]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, color, icon, order_index } = req.body
    await pool.query(
      'UPDATE order_statuses SET name=?, color=?, icon=?, order_index=? WHERE id=?',
      [name, color, icon, order_index, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM order_statuses WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
