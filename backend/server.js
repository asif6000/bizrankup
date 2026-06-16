require('dotenv').config()
const express = require('express')
const cors = require('cors')
const eventEmitter = require('./events')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const brandRoutes = require('./routes/brands')
const orderRoutes = require('./routes/orders')
const reviewRoutes = require('./routes/reviews')
const blogRoutes = require('./routes/blog')
const offerRoutes = require('./routes/offers')
const userRoutes = require('./routes/users')
const addressRoutes = require('./routes/addresses')
const expenseRoutes = require('./routes/expenses')
const slideRoutes = require('./routes/slides')
const notificationRoutes = require('./routes/notifications')
const faqRoutes = require('./routes/faq')
const orderStatusRoutes = require('./routes/orderStatuses')
const shippingRoutes = require('./routes/shipping')
const paymentRoutes = require('./routes/paymentGateways')
const socialLoginRoutes = require('./routes/socialLogin')
const trackingRoutes = require('./routes/tracking')
const courierRoutes = require('./routes/couriers')
const eventRoutes = require('./routes/events')
const uploadRoutes = require('./routes/upload')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/users', userRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/slides', slideRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/order-statuses', orderStatusRoutes)
app.use('/api/shipping-rates', shippingRoutes)
app.use('/api/payment-gateways', paymentRoutes)
app.use('/api/social-login', socialLoginRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/couriers', courierRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })

  res.write('event: connected\ndata: {"type":"connected"}\n\n')

  const handler = (data) => {
    res.write(`event: data:change\ndata: ${JSON.stringify(data)}\n\n`)
  }

  eventEmitter.on('data:change', handler)

  const keepAlive = setInterval(() => {
    res.write(':keepalive\n\n')
  }, 15000)

  req.on('close', () => {
    eventEmitter.off('data:change', handler)
    clearInterval(keepAlive)
  })
})

app.get('/api/tracking/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })

  res.write('event: connected\ndata: {"type":"connected"}\n\n')

  const handler = (data) => {
    res.write(`event: tracking:event\ndata: ${JSON.stringify(data)}\n\n`)
  }

  eventEmitter.on('tracking:event', handler)

  const keepAlive = setInterval(() => {
    res.write(':keepalive\n\n')
  }, 15000)

  req.on('close', () => {
    eventEmitter.off('tracking:event', handler)
    clearInterval(keepAlive)
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/config/supabase', (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
