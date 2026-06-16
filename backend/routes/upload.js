const express = require('express')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'images'
const MAX_SIZE = 10 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, WebP, GIF, and AVIF images are allowed'), false)
    }
  },
})

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find(b => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    })
    if (error) {
      console.error(`[Upload] Failed to create bucket "${BUCKET}":`, error.message)
      console.error(`[Upload] Create the bucket manually in Supabase Dashboard > Storage`)
    } else {
      console.log(`[Upload] Created storage bucket "${BUCKET}"`)
    }
  }
}

ensureBucket()

router.post('/', adminAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max 10MB.' })
      }
      return res.status(400).json({ error: err.message })
    }
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    next()
  })
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg'
    const fileName = `${crypto.randomUUID()}${ext}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      })

    if (error) {
      console.error('[Upload] Supabase storage error:', error)
      return res.status(500).json({ error: 'Failed to upload file to storage' })
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    res.json({ url: urlData.publicUrl, path: filePath })
  } catch (err) {
    console.error('[Upload] Error:', err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

router.delete('/:path(*)', adminAuth, async (req, res) => {
  try {
    const filePath = req.params.path
    const { error } = await supabase.storage.from(BUCKET).remove([filePath])
    if (error) {
      return res.status(500).json({ error: 'Failed to delete file' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' })
  }
})

module.exports = router
