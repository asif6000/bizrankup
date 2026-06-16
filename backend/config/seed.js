require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const bcrypt = require('bcryptjs')
const db = require('./db')

const seed = async () => {
  try {
    const adminPass = await bcrypt.hash('admin123', 10)
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING',
      ['Admin', 'admin@bizrankup.com', adminPass, 'admin']
    )

    const userPass = await bcrypt.hash('user123', 10)
    await db.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?) ON CONFLICT (email) DO NOTHING',
      ['Test User', 'user@bizrankup.com', userPass, '01700000000', 'customer']
    )

    const categories = [
      { name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
      { name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348' },
      { name: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f' },
      { name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3' },
      { name: 'Body Care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571' },
      { name: "Men's Grooming", slug: 'mens-grooming', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e' },
      { name: 'Natural & Organic', slug: 'natural-organic', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35' },
      { name: 'Tools & Accessories', slug: 'tools-accessories', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348' },
    ]
    for (const cat of categories) {
      await db.query(
        'INSERT INTO categories (name, slug, image) VALUES (?, ?, ?) ON CONFLICT (slug) DO NOTHING',
        [cat.name, cat.slug, cat.image]
      )
    }

    const brands = [
      { name: "L'Oreal Paris", slug: 'loreal-paris', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
      { name: 'Maybelline', slug: 'maybelline', logo: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=200' },
      { name: 'Garnier', slug: 'garnier', logo: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200' },
      { name: 'Nivea', slug: 'nivea', logo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200' },
      { name: 'Ponds', slug: 'ponds', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200' },
      { name: 'Fair & Lovely', slug: 'fair-lovely', logo: 'https://images.unsplash.com/photo-1597225244660-1af0e07cba0f?w=200' },
      { name: 'Lakme', slug: 'lakme', logo: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200' },
      { name: 'The Body Shop', slug: 'the-body-shop', logo: 'https://images.unsplash.com/photo-1585747861115-7bb0d81f4c6b?w=200' },
    ]
    for (const brand of brands) {
      const [existing] = await db.query('SELECT id FROM brands WHERE slug = ?', [brand.slug])
      if (!existing.length) {
        await db.query(
          'INSERT INTO brands (name, slug, logo) VALUES (?, ?, ?) ON CONFLICT (slug) DO NOTHING',
          [brand.name, brand.slug, brand.logo]
        )
      } else {
        await db.query('UPDATE brands SET logo = ? WHERE slug = ?', [brand.logo, brand.slug])
      }
    }

    const [catRows] = await db.query('SELECT id, slug FROM categories')
    const [brandRows] = await db.query('SELECT id, slug FROM brands')
    const catMap = {}
    catRows.forEach(c => { catMap[c.slug] = c.id })
    const brandMap = {}
    brandRows.forEach(b => { brandMap[b.slug] = b.id })

    const products = [
      { name: 'Vitamin C Brightening Serum', slug: 'vitamin-c-serum', price: 650, sale_price: 850, category: 'skincare', brand: 'garnier', rating: 4.5, featured: true, stock: 50, description: 'Brighten and even your skin tone with this powerful Vitamin C serum enriched with antioxidants.', reviews_count: 128, images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600', 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=600'] },
      { name: 'Hyaluronic Acid Moisturizer', slug: 'hyaluronic-moisturizer', price: 750, sale_price: 950, category: 'skincare', brand: 'loreal-paris', rating: 4.7, featured: true, stock: 35, description: 'Deep hydration with hyaluronic acid for plump, dewy skin that lasts all day.', reviews_count: 95, images: ['https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=600', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'] },
      { name: 'Retinol Anti-Aging Cream', slug: 'retinol-cream', price: 990, sale_price: 1200, category: 'skincare', brand: 'ponds', rating: 4.3, featured: true, stock: 20, description: 'Advanced retinol formula to reduce fine lines and wrinkles for younger-looking skin.', reviews_count: 67, images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'] },
      { name: 'Matte Liquid Lipstick', slug: 'matte-lipstick', price: 420, sale_price: 550, category: 'makeup', brand: 'maybelline', rating: 4.6, featured: true, stock: 80, description: 'Long-lasting matte liquid lipstick that stays put all day without drying your lips.', reviews_count: 210, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'] },
      { name: 'Full Coverage Foundation', slug: 'full-coverage-foundation', price: 890, sale_price: 1100, category: 'makeup', brand: 'lakme', rating: 4.4, featured: true, stock: 45, description: 'Flawless full coverage foundation with a natural finish for all skin types.', reviews_count: 156, images: ['https://images.unsplash.com/photo-1590156546679-0ad96c5fa71b?w=600'] },
      { name: 'Volumizing Mascara', slug: 'volumizing-mascara', price: 650, sale_price: null, category: 'makeup', brand: 'loreal-paris', rating: 4.2, featured: false, stock: 60, description: 'Dramatic volume and length with our innovative fiber-infused mascara formula.', reviews_count: 89, images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'] },
      { name: 'Argan Oil Hair Mask', slug: 'argan-oil-hair-mask', price: 590, sale_price: 780, category: 'hair-care', brand: 'garnier', rating: 4.8, featured: true, stock: 30, description: 'Intensive hair treatment with argan oil to repair damage and restore natural shine.', reviews_count: 178, images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'] },
      { name: 'Coconut Shampoo', slug: 'coconut-shampoo', price: 350, sale_price: 450, category: 'hair-care', brand: 'the-body-shop', rating: 4.1, featured: false, stock: 90, description: 'Nourishing coconut shampoo that gently cleanses while adding moisture to your hair.', reviews_count: 45, images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600'] },
      { name: 'Eau de Parfum', slug: 'eau-de-parfum', price: 1200, sale_price: 1500, category: 'fragrance', brand: 'loreal-paris', rating: 4.9, featured: true, stock: 25, description: 'Captivating floral fragrance with notes of jasmine, rose, and sandalwood.', reviews_count: 312, images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600'] },
      { name: 'Body Lotion with SPF', slug: 'body-lotion-spf', price: 520, sale_price: 680, category: 'body-care', brand: 'nivea', rating: 4.0, featured: false, stock: 70, description: 'Hydrating body lotion with SPF 30 to protect and moisturize your skin daily.', reviews_count: 34, images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'] },
      { name: 'Beard Oil Premium', slug: 'beard-oil', price: 550, sale_price: null, category: 'mens-grooming', brand: 'the-body-shop', rating: 4.5, featured: false, stock: 40, description: 'Premium beard oil with jojoba and argan oil to soften and condition your beard.', reviews_count: 72, images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=600'] },
      { name: 'Organic Face Wash', slug: 'organic-face-wash', price: 290, sale_price: 380, category: 'natural-organic', brand: 'garnier', rating: 4.6, featured: true, stock: 100, description: 'Gentle organic face wash with green tea and aloe vera for a fresh, clean complexion.', reviews_count: 143, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] },
      { name: 'Nude Eyeshadow Palette', slug: 'nude-eyeshadow-palette', price: 780, sale_price: 950, category: 'makeup', brand: 'maybelline', rating: 4.7, featured: true, stock: 55, description: '12-shade nude eyeshadow palette with both matte and shimmer finishes.', reviews_count: 267, images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'] },
      { name: 'Sunscreen SPF 50', slug: 'sunscreen-spf-50', price: 450, sale_price: 580, category: 'skincare', brand: 'nivea', rating: 4.4, featured: false, stock: 65, description: 'Broad spectrum SPF 50 sunscreen with a lightweight, non-greasy finish.', reviews_count: 198, images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] },
      { name: 'Hair Straightening Brush', slug: 'hair-straightening-brush', price: 1200, sale_price: 1600, category: 'tools-accessories', brand: 'loreal-paris', rating: 4.3, featured: true, stock: 15, description: 'Professional hair straightening brush with ceramic technology for sleek, frizz-free hair.', reviews_count: 54, images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600'] },
      { name: 'Rosewater Toner', slug: 'rosewater-toner', price: 250, sale_price: null, category: 'natural-organic', brand: 'fair-lovely', rating: 4.2, featured: false, stock: 110, description: 'Natural rosewater toner that balances pH levels and refreshes your skin.', reviews_count: 88, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] },
      { name: 'Men\'s Face Wash', slug: 'mens-face-wash', price: 320, sale_price: 420, category: 'mens-grooming', brand: 'nivea', rating: 4.1, featured: false, stock: 85, description: 'Deep-cleansing face wash for men with activated charcoal to remove impurities.', reviews_count: 63, images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=600'] },
      { name: 'Setting Spray', slug: 'setting-spray', price: 380, sale_price: 500, category: 'makeup', brand: 'lakme', rating: 4.5, featured: false, stock: 75, description: 'Fine mist setting spray that locks in your makeup for up to 16 hours.', reviews_count: 134, images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'] },
      { name: 'Body Scrub Coffee', slug: 'body-scrub-coffee', price: 480, sale_price: 620, category: 'body-care', brand: 'the-body-shop', rating: 4.6, featured: true, stock: 40, description: 'Invigorating coffee body scrub that exfoliates and smooths your skin.', reviews_count: 91, images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'] },
      { name: 'Lip Balm Set', slug: 'lip-balm-set', price: 220, sale_price: 320, category: 'natural-organic', brand: 'fair-lovely', rating: 4.0, featured: false, stock: 120, description: 'Set of 3 nourishing lip balms with shea butter, coconut oil, and vitamin E.', reviews_count: 47, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'] },
      { name: 'Perfume Gift Set', slug: 'perfume-gift-set', price: 1800, sale_price: 2500, category: 'fragrance', brand: 'maybelline', rating: 4.8, featured: true, stock: 10, description: 'Luxury perfume gift set featuring three signature scents in elegant packaging.', reviews_count: 45, images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600'] },
      { name: 'Eye Cream Anti-Aging', slug: 'eye-cream-anti-aging', price: 680, sale_price: 850, category: 'skincare', brand: 'ponds', rating: 4.5, featured: false, stock: 30, description: 'Targeted anti-aging eye cream that reduces puffiness and dark circles.', reviews_count: 112, images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'] },
      { name: 'Makeup Brush Set', slug: 'makeup-brush-set', price: 950, sale_price: 1300, category: 'tools-accessories', brand: 'lakme', rating: 4.4, featured: true, stock: 25, description: 'Professional 12-piece makeup brush set with soft synthetic bristles.', reviews_count: 76, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'] },
      { name: 'Hair Serum Argan', slug: 'hair-serum-argan', price: 520, sale_price: 680, category: 'hair-care', brand: 'garnier', rating: 4.6, featured: false, stock: 60, description: 'Lightweight argan hair serum that tames frizz and adds brilliant shine.', reviews_count: 155, images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'] },
      { name: 'Night Cream Rich', slug: 'night-cream-rich', price: 820, sale_price: 1050, category: 'skincare', brand: 'ponds', rating: 4.3, featured: false, stock: 35, description: 'Rich night cream with collagen and elastin for overnight skin renewal.', reviews_count: 87, images: ['https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=600'] },
      { name: 'Deodorant Spray', slug: 'deodorant-spray', price: 280, sale_price: null, category: 'body-care', brand: 'nivea', rating: 3.9, featured: false, stock: 150, description: 'Long-lasting deodorant spray with a fresh, clean scent for all-day confidence.', reviews_count: 23, images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'] },
      { name: 'Shaving Cream', slug: 'shaving-cream', price: 220, sale_price: 300, category: 'mens-grooming', brand: 'fair-lovely', rating: 4.0, featured: false, stock: 95, description: 'Smooth shaving cream with aloe vera for a comfortable, irritation-free shave.', reviews_count: 38, images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=600'] },
      { name: 'Nail Polish Set', slug: 'nail-polish-set', price: 350, sale_price: 480, category: 'tools-accessories', brand: 'maybelline', rating: 4.2, featured: false, stock: 70, description: 'Set of 6 long-lasting nail polish colors with a high-gloss finish.', reviews_count: 52, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'] },
      { name: 'Face Mask Sheet Pack', slug: 'face-mask-sheet-pack', price: 320, sale_price: 450, category: 'skincare', brand: 'fair-lovely', rating: 4.1, featured: false, stock: 200, description: 'Pack of 10 hydrating sheet masks with hyaluronic acid and vitamin B5.', reviews_count: 203, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] },
      { name: 'Cologne Fresh', slug: 'cologne-fresh', price: 850, sale_price: 1100, category: 'fragrance', brand: 'ponds', rating: 4.4, featured: false, stock: 20, description: 'Fresh and invigorating cologne with citrus and aquatic notes for everyday wear.', reviews_count: 109, images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600'] },
    ]
    for (const p of products) {
      const [existing] = await db.query('SELECT id, images FROM products WHERE slug = ?', [p.slug])
      if (!existing.length) {
        await db.query(
          'INSERT INTO products (name, slug, description, price, sale_price, category_id, brand_id, rating, reviews_count, stock, featured, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.slug, p.description || '', p.price, p.sale_price || null, catMap[p.category] || null, brandMap[p.brand] || null, p.rating || 0, p.reviews_count || 0, p.stock || 0, p.featured || false, JSON.stringify(p.images)]
        )
      } else {
        const oldImages = existing[0].images
        let imgArr = []
        try { imgArr = typeof oldImages === 'string' ? JSON.parse(oldImages) : (oldImages || []) } catch { imgArr = [] }
        if (!imgArr.length) {
          await db.query('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(p.images), existing[0].id])
        }
      }
    }

    const statuses = [
      { name: 'Pending', color: '#F59E0B', icon: 'FiClock', order_index: 1 },
      { name: 'Processing', color: '#3B82F6', icon: 'FiPackage', order_index: 2 },
      { name: 'Shipped', color: '#8B5CF6', icon: 'FiTruck', order_index: 3 },
      { name: 'Delivered', color: '#10B981', icon: 'FiCheckCircle', order_index: 4 },
      { name: 'Cancelled', color: '#EF4444', icon: 'FiXCircle', order_index: 5 },
    ]
    for (const s of statuses) {
      const [existing] = await db.query('SELECT id FROM order_statuses WHERE name = ?', [s.name])
      if (!existing.length) {
        await db.query(
          'INSERT INTO order_statuses (name, color, icon, order_index) VALUES (?, ?, ?, ?)',
          [s.name, s.color, s.icon, s.order_index]
        )
      }
    }

    const rates = [
      { name: 'Standard Shipping', amount: 60, min_days: 5, max_days: 8 },
      { name: 'Express Shipping', amount: 120, min_days: 2, max_days: 4 },
      { name: 'Free Shipping', amount: 0, min_days: 7, max_days: 12 },
    ]
    for (const r of rates) {
      const [existing] = await db.query('SELECT id FROM shipping_rates WHERE name = ?', [r.name])
      if (!existing.length) {
        await db.query(
          'INSERT INTO shipping_rates (name, amount, min_delivery_days, max_delivery_days) VALUES (?, ?, ?, ?)',
          [r.name, r.amount, r.min_days, r.max_days]
        )
      }
    }

    const faqs = [
      { question: 'What payment methods do you accept?', answer: 'We accept bKash, Nagad, Rocket, Visa/Mastercard, and Cash on Delivery.', category: 'payment', order: 1 },
      { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-8 business days. Express shipping takes 2-4 business days.', category: 'shipping', order: 2 },
      { question: 'What is your return policy?', answer: 'You can return unused items within 7 days of delivery for a full refund.', category: 'returns', order: 3 },
      { question: 'How can I track my order?', answer: 'You can track your order from the Order History section in your dashboard.', category: 'orders', order: 4 },
    ]
    for (const f of faqs) {
      const [existing] = await db.query('SELECT id FROM faq WHERE question = ?', [f.question])
      if (!existing.length) {
        await db.query(
          'INSERT INTO faq (question, answer, category, order_index) VALUES (?, ?, ?, ?)',
          [f.question, f.answer, f.category, f.order]
        )
      }
    }

    const slides = [
      { title: 'Summer Beauty Sale', subtitle: 'Up to 50% off on skincare essentials', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', order: 1 },
      { title: 'New Makeup Collection', subtitle: 'Discover the latest trends in beauty', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881', order: 2 },
      { title: 'Natural & Organic', subtitle: 'Pure beauty from nature', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', order: 3 },
    ]
    for (const s of slides) {
      const [existing] = await db.query('SELECT id FROM hero_slides WHERE title = ?', [s.title])
      if (!existing.length) {
        await db.query(
          'INSERT INTO hero_slides (title, subtitle, image, order_index) VALUES (?, ?, ?, ?)',
          [s.title, s.subtitle, s.image, s.order]
        )
      }
    }

    const notifs = [
      { type: 'info', title: 'Welcome to SHAJGOJ', message: 'Thank you for choosing us!', for_role: 'all' },
      { type: 'promo', title: 'Flash Sale Tonight!', message: '50% off on selected items at midnight.', for_role: 'all' },
      { type: 'warning', title: 'System Update', message: 'Scheduled maintenance at 2 AM.', for_role: 'admin' },
    ]
    for (const n of notifs) {
      const [existing] = await db.query('SELECT id FROM notifications WHERE title = ?', [n.title])
      if (!existing.length) {
        await db.query(
          'INSERT INTO notifications (type, title, message, for_role) VALUES (?, ?, ?, ?)',
          [n.type, n.title, n.message, n.for_role]
        )
      }
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
