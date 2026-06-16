const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug, image, parent_id } = req.body
    const [result] = await pool.query('INSERT INTO categories (name, slug, image, parent_id) VALUES (?, ?, ?, ?)', [name, slug, image || null, parent_id || null])
    res.status(201).json({ id: result.insertId, name, slug, image, parent_id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, slug, image, parent_id } = req.body
    await pool.query('UPDATE categories SET name=?, slug=?, image=?, parent_id=? WHERE id=?', [name, slug, image || null, parent_id || null, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
