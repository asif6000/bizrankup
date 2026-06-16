require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const bcrypt = require('bcryptjs')
const pool = require('./db')

const seed = async () => {
  try {
    // Admin user
    const adminPass = await bcrypt.hash('admin123', 10)
    await pool.query(
      "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
      ['Admin', 'admin@bizrankup.com', adminPass]
    )

    // Customer user
    const userPass = await bcrypt.hash('user123', 10)
    await pool.query(
      "INSERT IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'customer')",
      ['Test User', 'user@bizrankup.com', userPass, '01700000000']
    )

    // Categories
    const categories = [
      { name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
      { name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348' },
      { name: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f' },
      { name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3' },
      { name: 'Body Care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571' },
      { name: 'Men\'s Grooming', slug: 'mens-grooming', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e' },
      { name: 'Natural & Organic', slug: 'natural-organic', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35' },
      { name: 'Tools & Accessories', slug: 'tools-accessories', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348' },
    ]
    for (const cat of categories) {
      await pool.query('INSERT IGNORE INTO categories (name, slug, image) VALUES (?, ?, ?)', [cat.name, cat.slug, cat.image])
    }

    // Brands
    const brands = [
      { name: 'L\'Oreal Paris', slug: 'loreal-paris', logo: '' },
      { name: 'Maybelline', slug: 'maybelline', logo: '' },
      { name: 'Garnier', slug: 'garnier', logo: '' },
      { name: 'Nivea', slug: 'nivea', logo: '' },
      { name: 'Ponds', slug: 'ponds', logo: '' },
      { name: 'Fair & Lovely', slug: 'fair-lovely', logo: '' },
      { name: 'Lakme', slug: 'lakme', logo: '' },
      { name: 'The Body Shop', slug: 'the-body-shop', logo: '' },
    ]
    for (const brand of brands) {
      await pool.query('INSERT IGNORE INTO brands (name, slug, logo) VALUES (?, ?, ?)', [brand.name, brand.slug, brand.logo])
    }

    // Products (sample)
    const catRows = await pool.query('SELECT id, slug FROM categories')
    const brandRows = await pool.query('SELECT id, slug FROM brands')
    const catMap = {}
    catRows[0].forEach(c => { catMap[c.slug] = c.id })
    const brandMap = {}
    brandRows[0].forEach(b => { brandMap[b.slug] = b.id })

    const products = [
      { name: 'Vitamin C Brightening Serum', slug: 'vitamin-c-serum', price: 850, sale_price: 650, category: 'skincare', brand: 'garnier', rating: 4.5 },
      { name: 'Hyaluronic Acid Moisturizer', slug: 'hyaluronic-moisturizer', price: 950, sale_price: 750, category: 'skincare', brand: 'loreal-paris', rating: 4.7 },
      { name: 'Retinol Anti-Aging Cream', slug: 'retinol-cream', price: 1200, sale_price: 990, category: 'skincare', brand: 'ponds', rating: 4.3 },
      { name: 'Matte Liquid Lipstick', slug: 'matte-lipstick', price: 550, sale_price: 420, category: 'makeup', brand: 'maybelline', rating: 4.6 },
      { name: 'Full Coverage Foundation', slug: 'full-coverage-foundation', price: 1100, sale_price: 890, category: 'makeup', brand: 'lakme', rating: 4.4 },
      { name: 'Volumizing Mascara', slug: 'volumizing-mascara', price: 650, sale_price: 0, category: 'makeup', brand: 'loreal-paris', rating: 4.2 },
      { name: 'Argan Oil Hair Mask', slug: 'argan-oil-hair-mask', price: 780, sale_price: 590, category: 'hair-care', brand: 'garnier', rating: 4.8 },
      { name: 'Coconut Shampoo', slug: 'coconut-shampoo', price: 450, sale_price: 350, category: 'hair-care', brand: 'the-body-shop', rating: 4.1 },
      { name: 'Eau de Parfum', slug: 'eau-de-parfum', price: 1500, sale_price: 1200, category: 'fragrance', brand: 'loreal-paris', rating: 4.9 },
      { name: 'Body Lotion with SPF', slug: 'body-lotion-spf', price: 680, sale_price: 520, category: 'body-care', brand: 'nivea', rating: 4.0 },
      { name: 'Beard Oil Premium', slug: 'beard-oil', price: 550, sale_price: 0, category: 'mens-grooming', brand: 'the-body-shop', rating: 4.5 },
      { name: 'Organic Face Wash', slug: 'organic-face-wash', price: 380, sale_price: 290, category: 'natural-organic', brand: 'garnier', rating: 4.6 },
    ]
    for (const p of products) {
      const existing = await pool.query('SELECT id FROM products WHERE slug = ?', [p.slug])
      if (!existing[0].length) {
        await pool.query(
          'INSERT INTO products (name, slug, price, sale_price, category_id, brand_id, rating, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.slug, p.price, p.sale_price || null, catMap[p.category] || null, brandMap[p.brand] || null, p.rating || 0, 50, JSON.stringify([])]
        )
      }
    }

    // Order statuses
    const statuses = [
      { name: 'Pending', color: '#F59E0B', icon: 'FiClock', order_index: 1 },
      { name: 'Processing', color: '#3B82F6', icon: 'FiPackage', order_index: 2 },
      { name: 'Shipped', color: '#8B5CF6', icon: 'FiTruck', order_index: 3 },
      { name: 'Delivered', color: '#10B981', icon: 'FiCheckCircle', order_index: 4 },
      { name: 'Cancelled', color: '#EF4444', icon: 'FiXCircle', order_index: 5 },
    ]
    for (const s of statuses) {
      await pool.query('INSERT IGNORE INTO order_statuses (name, color, icon, order_index) VALUES (?, ?, ?, ?)',
        [s.name, s.color, s.icon, s.order_index])
    }

    // Shipping rates
    const rates = [
      { name: 'Standard Shipping', amount: 60, min_days: 5, max_days: 8 },
      { name: 'Express Shipping', amount: 120, min_days: 2, max_days: 4 },
      { name: 'Free Shipping', amount: 0, min_days: 7, max_days: 12 },
    ]
    for (const r of rates) {
      await pool.query('INSERT IGNORE INTO shipping_rates (name, amount, min_delivery_days, max_delivery_days) VALUES (?, ?, ?, ?)',
        [r.name, r.amount, r.min_days, r.max_days])
    }

    // FAQ
    const faqs = [
      { question: 'What payment methods do you accept?', answer: 'We accept bKash, Nagad, Rocket, Visa/Mastercard, and Cash on Delivery.', category: 'payment', order: 1 },
      { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-8 business days. Express shipping takes 2-4 business days.', category: 'shipping', order: 2 },
      { question: 'What is your return policy?', answer: 'You can return unused items within 7 days of delivery for a full refund.', category: 'returns', order: 3 },
      { question: 'How can I track my order?', answer: 'You can track your order from the Order History section in your dashboard.', category: 'orders', order: 4 },
    ]
    for (const f of faqs) {
      await pool.query('INSERT IGNORE INTO faq (question, answer, category, order_index) VALUES (?, ?, ?, ?)',
        [f.question, f.answer, f.category, f.order])
    }

    // Hero slides
    const slides = [
      { title: 'Summer Beauty Sale', subtitle: 'Up to 50% off on skincare essentials', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', order: 1 },
      { title: 'New Makeup Collection', subtitle: 'Discover the latest trends in beauty', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881', order: 2 },
      { title: 'Natural & Organic', subtitle: 'Pure beauty from nature', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', order: 3 },
    ]
    for (const s of slides) {
      await pool.query('INSERT IGNORE INTO hero_slides (title, subtitle, image, order_index) VALUES (?, ?, ?, ?)',
        [s.title, s.subtitle, s.image, s.order])
    }

    // Notifications
    const notifs = [
      { type: 'info', title: 'Welcome to SHAJGOJ', message: 'Thank you for choosing us!', for_role: 'all' },
      { type: 'promo', title: 'Flash Sale Tonight!', message: '50% off on selected items at midnight.', for_role: 'all' },
      { type: 'warning', title: 'System Update', message: 'Scheduled maintenance at 2 AM.', for_role: 'admin' },
    ]
    for (const n of notifs) {
      await pool.query('INSERT IGNORE INTO notifications (type, title, message, for_role) VALUES (?, ?, ?, ?)',
        [n.type, n.title, n.message, n.for_role])
    }

    console.log('Seed data inserted successfully!')
    console.log('Admin login: admin@bizrankup.com / admin123')
    console.log('User login: user@bizrankup.com / user123')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()
