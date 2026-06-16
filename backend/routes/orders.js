const express = require('express')
const pool = require('../config/db')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    let sql = 'SELECT * FROM orders WHERE 1=1'
    const params = []

    if (req.user.role !== 'admin') {
      sql += ' AND user_id = ?'
      params.push(req.user.id)
    }
    if (status) { sql += ' AND status = ?'; params.push(status) }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    const offset = (parseInt(page) - 1) * parseInt(limit)
    params.push(parseInt(limit), offset)

    const [rows] = await pool.query(sql, params)
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM orders')
    res.json({ orders: rows, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Order not found' })
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { items, total, subtotal, shipping, discount, payment_method, shipping_address, billing_address, notes } = req.body
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, order_number, items, total, subtotal, shipping, discount, payment_method, shipping_address, billing_address, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, orderNumber, JSON.stringify(items), total, subtotal, shipping || 0, discount || 0, payment_method || null,
       JSON.stringify(shipping_address || {}), JSON.stringify(billing_address || {}), notes || null]
    )
    res.status(201).json({ id: result.insertId, order_number: orderNumber })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, payment_status } = req.body
    await pool.query('UPDATE orders SET status=?, payment_status=? WHERE id=?', [status || 'pending', payment_status || 'pending', req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
