const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shipping_rates WHERE active = TRUE ORDER BY amount ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shipping_rates ORDER BY amount ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, amount, min_delivery_days, max_delivery_days } = req.body
    const [result] = await pool.query(
      'INSERT INTO shipping_rates (name, amount, min_delivery_days, max_delivery_days) VALUES (?, ?, ?, ?)',
      [name, amount, min_delivery_days || 3, max_delivery_days || 7]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, amount, min_delivery_days, max_delivery_days, active } = req.body
    await pool.query(
      'UPDATE shipping_rates SET name=?, amount=?, min_delivery_days=?, max_delivery_days=?, active=? WHERE id=?',
      [name, amount, min_delivery_days, max_delivery_days, active !== undefined ? active : true, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM shipping_rates WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
