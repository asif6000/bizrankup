const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE published = TRUE ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Post not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, slug, content, excerpt, image, author } = req.body
    const [result] = await pool.query(
      'INSERT INTO blog_posts (title, slug, content, excerpt, image, author) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, content || null, excerpt || null, image || null, author || null]
    )
    res.status(201).json({ id: result.insertId, title, slug })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, slug, content, excerpt, image, author, published } = req.body
    await pool.query(
      'UPDATE blog_posts SET title=?, slug=?, content=?, excerpt=?, image=?, author=?, published=? WHERE id=?',
      [title, slug, content, excerpt, image, author, published !== undefined ? published : true, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
