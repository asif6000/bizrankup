const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { category, brand, search, featured, page = 1, limit = 20 } = req.query
    let sql = `SELECT p.*, c.name as category_name, b.name as brand_name
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id
               LEFT JOIN brands b ON p.brand_id = b.id WHERE 1=1`
    const params = []

    if (category) { sql += ' AND c.slug = ?'; params.push(category) }
    if (brand) { sql += ' AND b.slug = ?'; params.push(brand) }
    if (search) { sql += ' AND p.name LIKE ?'; params.push(`%${search}%`) }
    if (featured === 'true') { sql += ' AND p.featured = TRUE' }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    const offset = (parseInt(page) - 1) * parseInt(limit)
    params.push(parseInt(limit), offset)

    const [rows] = await pool.query(sql, params)
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM products')
    res.json({ products: rows, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, b.name as brand_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Product not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug, description, price, sale_price, images, category_id, brand_id, stock, featured } = req.body
    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, price, sale_price, images, category_id, brand_id, stock, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, price, sale_price || null, JSON.stringify(images || []), category_id || null, brand_id || null, stock || 0, featured || false]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, slug, description, price, sale_price, images, category_id, brand_id, stock, featured } = req.body
    await pool.query(
      `UPDATE products SET name=?, slug=?, description=?, price=?, sale_price=?, images=?, category_id=?, brand_id=?, stock=?, featured=? WHERE id=?`,
      [name, slug, description, price, sale_price || null, JSON.stringify(images || []), category_id || null, brand_id || null, stock || 0, featured || false, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
