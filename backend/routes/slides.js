const express = require('express')
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hero_slides WHERE active = TRUE ORDER BY order_index ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY order_index ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, subtitle, image, link, order_index } = req.body
    const [result] = await pool.query(
      'INSERT INTO hero_slides (title, subtitle, image, link, order_index) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle || null, image, link || null, order_index || 0]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, subtitle, image, link, order_index, active } = req.body
    await pool.query(
      'UPDATE hero_slides SET title=?, subtitle=?, image=?, link=?, order_index=?, active=? WHERE id=?',
      [title, subtitle, image, link, order_index, active !== undefined ? active : true, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
