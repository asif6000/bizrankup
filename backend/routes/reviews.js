const express = require('express')
const pool = require('../config/db')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { product_id } = req.query
    let sql = `SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id`
    const params = []
    if (product_id) { sql += ' WHERE r.product_id = ?'; params.push(product_id) }
    sql += ' ORDER BY r.created_at DESC'
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body
    if (!product_id || !rating) return res.status(400).json({ error: 'Product ID and rating are required' })
    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, req.user.id, rating, comment || null]
    )
    const [[{ avg }]] = await pool.query('SELECT AVG(rating) as avg FROM reviews WHERE product_id = ?', [product_id])
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) as cnt FROM reviews WHERE product_id = ?', [product_id])
    await pool.query('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?', [Math.round(avg * 10) / 10, cnt, product_id])
    res.status(201).json({ id: result.insertId, product_id, rating, comment })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
