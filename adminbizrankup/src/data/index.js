const productImages = [
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
  'https://images.unsplash.com/photo-1599733589046-10c6f0f1b7c8?w=600',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
]

export const categories = [
  { id: 1, name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', subcategories: [{ id: 101, name: 'Face', slug: 'face', productCount: 89 }, { id: 102, name: 'Eyes', slug: 'eyes', productCount: 76 }, { id: 103, name: 'Lips', slug: 'lips', productCount: 54 }, { id: 104, name: 'Nails', slug: 'nails', productCount: 26 }] },
  { id: 2, name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=400', subcategories: [{ id: 201, name: 'Moisturizers', slug: 'moisturizers', productCount: 78 }, { id: 202, name: 'Serums', slug: 'serums', productCount: 65 }, { id: 203, name: 'Cleansers', slug: 'cleansers', productCount: 54 }, { id: 204, name: 'Sunscreen', slug: 'sunscreen', productCount: 34 }] },
  { id: 3, name: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400', subcategories: [{ id: 301, name: 'Shampoo', slug: 'shampoo', productCount: 45 }, { id: 302, name: 'Conditioner', slug: 'conditioner', productCount: 38 }, { id: 303, name: 'Styling', slug: 'styling', productCount: 52 }, { id: 304, name: 'Treatments', slug: 'treatments', productCount: 54 }] },
  { id: 4, name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', subcategories: [{ id: 401, name: 'Women', slug: 'women', productCount: 67 }, { id: 402, name: 'Men', slug: 'men', productCount: 54 }, { id: 403, name: 'Unisex', slug: 'unisex', productCount: 35 }] },
  { id: 5, name: 'Bath & Body', slug: 'bath-body', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', subcategories: [{ id: 501, name: 'Body Wash', slug: 'body-wash', productCount: 43 }, { id: 502, name: 'Lotion', slug: 'lotion', productCount: 56 }, { id: 503, name: 'Scrubs', slug: 'scrubs', productCount: 38 }, { id: 504, name: 'Deodorant', slug: 'deodorant', productCount: 41 }] },
  { id: 6, name: 'Tools & Brushes', slug: 'tools-brushes', image: 'https://images.unsplash.com/photo-1597225244660-1af0e07cba0f?w=400', subcategories: [{ id: 601, name: 'Brushes', slug: 'brushes', productCount: 67 }, { id: 602, name: 'Sponges', slug: 'sponges', productCount: 23 }, { id: 603, name: 'Mirrors', slug: 'mirrors', productCount: 19 }] },
]

export const brands = [
  { id: 1, name: 'Luminous Beauty', slug: 'luminous-beauty', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
  { id: 2, name: 'Velvet Touch', slug: 'velvet-touch', logo: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=200' },
  { id: 3, name: 'Pure Glow', slug: 'pure-glow', logo: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200' },
  { id: 4, name: 'Rose Allure', slug: 'rose-allure', logo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200' },
  { id: 5, name: 'Golden Hour', slug: 'golden-hour', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200' },
]

export const products = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: [
    'Radiance Renewal Serum', 'Velvet Matte Foundation', 'Silk Finish Lipstick', 'Luminous Setting Powder',
    'Hydra Glow Moisturizer', 'Perfecting Face Primer', 'Crystal Eye Palette', 'Rose Petal Blush',
    'Golden Highlighting Drops', 'Plumping Lip Gloss', 'Charcoal Detox Mask', 'Vitamin C Brightening Cream',
    'Micro-Fine Eyeliner', 'Volume Boost Mascara', 'Sheer Tint Lip Balm', 'Matte Finishing Spray',
    'Nourishing Night Cream', 'Exfoliating Face Scrub', 'Longwear Concealer', 'Brow Defining Gel',
  ][i % 20],
  brand: brands[i % brands.length],
  category: categories[i % categories.length],
  price: [29.99, 49.99, 19.99, 39.99, 59.99, 24.99, 44.99, 34.99, 54.99, 14.99, 64.99, 79.99][i % 12],
  originalPrice: [null, 69.99, null, 54.99, 79.99, null, 59.99, null, 74.99, 19.99, 89.99, null][i % 12],
  rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  reviewCount: Math.floor(Math.random() * 500) + 10,
  image: productImages[i % productImages.length],
  inStock: i % 7 !== 0,
  badge: ['Sale', '', 'New', '', '', 'Best', '', '', 'Trending', '', '', ''][i % 12],
  description: 'Premium beauty product crafted with the finest ingredients for radiant, glowing skin.',
}))

export const orders = [
  { id: 1001, customer: 'Sarah Johnson', date: '2026-06-01', total: 89.97, status: 'Delivered', items: [{ name: 'Radiance Renewal Serum', price: 29.99, quantity: 1 }, { name: 'Silk Finish Lipstick', price: 19.99, quantity: 2 }] },
  { id: 1002, customer: 'Emily Davis', date: '2026-06-03', total: 149.50, status: 'Shipped', items: [{ name: 'Crystal Eye Palette', price: 44.99, quantity: 1 }, { name: 'Hydra Glow Moisturizer', price: 59.99, quantity: 1 }] },
  { id: 1003, customer: 'Michael Brown', date: '2026-06-05', total: 39.99, status: 'Processing', items: [{ name: 'Silk Finish Lipstick', price: 19.99, quantity: 2 }] },
  { id: 1004, customer: 'Jessica Williams', date: '2026-06-07', total: 210.00, status: 'Pending', items: [{ name: 'Luminous Setting Powder', price: 39.99, quantity: 2 }, { name: 'Vitamin C Brightening Cream', price: 64.99, quantity: 1 }] },
  { id: 1005, customer: 'David Martinez', date: '2026-06-10', total: 54.99, status: 'Delivered', items: [{ name: 'Golden Highlighting Drops', price: 54.99, quantity: 1 }] },
]

export const blogPosts = [
  { id: 1, title: '10 Skincare Tips for Glowing Skin', excerpt: 'Discover the secrets to radiant, healthy-looking skin with our expert-approved skincare routine.', content: 'Full content here...', author: 'Sophie M.', date: '2026-05-28', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800', category: 'Skincare', readTime: '5 min read', tags: ['skincare', 'tips', 'glow'] },
  { id: 2, title: 'Spring Makeup Trends 2026', excerpt: 'From bold lips to dewy skin, here are the top makeup trends to try this spring.', content: 'Full content here...', author: 'Emma L.', date: '2026-05-25', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', category: 'Makeup', readTime: '4 min read', tags: ['makeup', 'trends', 'spring'] },
]

export const offers = [
  { id: 1, title: 'Welcome Discount', code: 'WELCOME20', discount: 20, type: 'percentage', validUntil: '2026-12-31', description: '20% off your first order' },
  { id: 2, title: 'Free Shipping', code: 'FREESHIP', discount: 100, type: 'fixed', validUntil: '2026-12-31', minPurchase: 50, description: 'Free shipping on orders over $50' },
]

export const heroSlides = [
  { id: 1, title: 'New Spring Collection', subtitle: 'Discover the latest trends in beauty', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1200', link: '/shop', active: true },
  { id: 2, title: 'Skincare Essentials', subtitle: 'Glow from within with our natural products', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=1200', link: '/category/skincare', active: true },
  { id: 3, title: 'Up to 40% Off', subtitle: 'Limited time flash sale on premium brands', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', link: '/shop', active: true },
]

export const promoBanners = [
  { id: 1, title: 'Free Shipping Over $50', subtitle: 'Use code: FREESHIP', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', link: '/shop', active: true },
  { id: 2, title: 'New Arrivals', subtitle: 'Check out the latest products', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800', link: '/shop', active: true },
]

export const notifications = [
  { id: 1, title: 'Order Shipped!', message: 'Your order #1002 has been shipped and is on its way.', type: 'order', read: false, date: '2026-06-04' },
  { id: 2, title: 'Flash Sale Alert', message: 'Up to 40% off on skincare products. Limited time only!', type: 'offer', read: false, date: '2026-06-03' },
  { id: 3, title: 'Welcome to SHAJGOJ', message: 'Thanks for joining! Use code WELCOME20 for 20% off.', type: 'order', read: true, date: '2026-06-01' },
]

export const faqData = [
  { id: 1, question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all unused and unopened products.' },
  { id: 2, question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days within the US.' },
  { id: 3, question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide.' },
  { id: 4, question: 'Are your products cruelty-free?', answer: 'Yes, we are committed to cruelty-free beauty.' },
  { id: 5, question: 'How can I track my order?', answer: 'Once your order is shipped, you will receive a tracking number via email.' },
  { id: 6, question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, PayPal, Apple Pay, and Google Pay.' },
  { id: 7, question: 'Can I cancel my order?', answer: 'You can cancel your order within 24 hours of placement.' },
  { id: 8, question: 'Do you have a loyalty program?', answer: 'Yes! Join our Glow Rewards program to earn points on every purchase.' },
]

export const flashSales = products.slice(0, 8).map((p, i) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  price: +(p.price * (1 - [0.3, 0.4, 0.25, 0.5, 0.35, 0.45, 0.2, 0.55][i])).toFixed(2),
  originalPrice: p.price,
  discount: [30, 40, 25, 50, 35, 45, 20, 55][i],
  endsAt: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
  active: true,
}))

export const bundles = [
  { id: 1, name: 'The Glow Starter', desc: 'Perfect for beginners starting their skincare journey', discount: 20, productIds: [1, 5, 8], gradient: 'from-rose-100 via-pink-50 to-purple-50 dark:from-rose-900/20 dark:via-pink-900/10 dark:to-purple-900/20', badge: 'Best Value', badgeColor: 'bg-rose-500', decor: 'from-rose-200/50 to-purple-200/50', accent: '#FF4F8B' },
  { id: 2, name: 'Makeup Must-Haves', desc: 'Essential makeup items for a complete look', discount: 15, productIds: [2, 6, 10], gradient: 'from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-orange-900/20', badge: 'Most Popular', badgeColor: 'bg-amber-500', decor: 'from-amber-200/50 to-orange-200/50', accent: '#F59E0B' },
  { id: 3, name: 'Luxury Hair Set', desc: 'Premium hair care products for salon-quality results', discount: 25, productIds: [3, 7, 11], gradient: 'from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-green-900/20', badge: 'Biggest Saving', badgeColor: 'bg-emerald-500', decor: 'from-emerald-200/50 to-teal-200/50', accent: '#10B981' },
]

export const users = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 (555) 123-4567', avatar: 'https://i.pravatar.cc/80?u=1', joinDate: '2025-01-15', tier: 'Gold', orders: 12 },
  { id: 2, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 234-5678', avatar: 'https://i.pravatar.cc/80?u=2', joinDate: '2025-03-20', tier: 'Silver', orders: 8 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1 (555) 345-6789', avatar: 'https://i.pravatar.cc/80?u=3', joinDate: '2025-06-10', tier: 'Gold', orders: 15 },
  { id: 4, name: 'Jessica Williams', email: 'jessica@example.com', phone: '+1 (555) 456-7890', avatar: 'https://i.pravatar.cc/80?u=4', joinDate: '2025-08-05', tier: 'Silver', orders: 5 },
  { id: 5, name: 'David Martinez', email: 'david@example.com', phone: '+1 (555) 567-8901', avatar: 'https://i.pravatar.cc/80?u=5', joinDate: '2026-01-02', tier: 'Silver', orders: 3 },
]

export const orderStatuses = [
  { id: 1, label: 'Order Placed', date: null, completed: false, order: 1 },
  { id: 2, label: 'Order Confirmed', date: null, completed: false, order: 2 },
  { id: 3, label: 'Processing', date: null, completed: false, order: 3 },
  { id: 4, label: 'Shipped', date: null, completed: false, order: 4 },
  { id: 5, label: 'Out for Delivery', date: null, completed: false, order: 5 },
  { id: 6, label: 'Delivered', date: null, completed: false, order: 6 },
]

export const trendingStats = [
  { id: 1, label: 'Happy Customers', value: 500, suffix: '+', icon: 'FiHeart', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { id: 2, label: 'Orders Delivered', value: 10, suffix: 'K+', icon: 'FiPackage', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 3, label: 'Premium Brands', value: 50, suffix: '+', icon: 'FiAward', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 4, label: 'Avg Rating', value: 48, suffix: '', icon: 'FiStar', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
]

export const addresses = [
  { id: 1, label: 'Home', street: '123 Beauty Avenue', city: 'New York', state: 'NY', zip: '10001', default: true },
  { id: 2, label: 'Office', street: '456 Business Blvd', city: 'New York', state: 'NY', zip: '10002', default: false },
]

export const headerSettings = {
  logoText: 'SHAJGOJ',
  promoBar: 'Free shipping over $50 • 30-day returns • Code: WELCOME20',
  promoCode: 'WELCOME20',
  searchPlaceholder: 'Search products...',
  cartLabel: 'Cart',
  navItems: [
    { label: 'Collection', slug: 'collection' },
    { label: 'Makeup', slug: 'makeup' },
    { label: 'Skin', slug: 'skincare' },
    { label: 'Hair', slug: 'hair-care' },
    { label: 'Body', slug: 'bath-body' },
    { label: 'Fragrance', slug: 'fragrance' },
  ],
  collectionSubs: [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Best Sellers', slug: 'best-sellers' },
    { name: 'Limited Edition', slug: 'limited-edition' },
    { name: 'Gift Sets', slug: 'gift-sets' },
    { name: 'Travel Size', slug: 'travel-size' },
    { name: 'Value Packs', slug: 'value-packs' },
  ],
}

export const footerSettings = {
  brandName: 'BizRank',
  brandTagline: 'Your premium destination for luxury beauty and cosmetics.',
  address: '123 Beauty Avenue, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'hello@bizrankup.com',
  newsletterHeading: 'Subscribe to our newsletter',
  newsletterSubtext: 'Get 10% off your first order + weekly beauty tips.',
  newsletterPlaceholder: 'your@email.com',
  copyright: 'BizRank. All rights reserved.',
  socialLinks: [
    { platform: 'Facebook', icon: 'FaFacebookF', url: '#' },
    { platform: 'Instagram', icon: 'FaInstagram', url: '#' },
    { platform: 'Twitter', icon: 'FaTwitter', url: '#' },
    { platform: 'Pinterest', icon: 'FaPinterestP', url: '#' },
    { platform: 'TikTok', icon: 'FaTiktok', url: '#' },
  ],
  shopLinks: [
    { label: 'Makeup', href: '/category/makeup' },
    { label: 'Skincare', href: '/category/skincare' },
    { label: 'Hair Care', href: '/category/hair-care' },
    { label: 'Fragrance', href: '/category/fragrance' },
    { label: 'Bath & Body', href: '/category/bath-body' },
    { label: 'Natural & Organic', href: '/category/natural-organic' },
  ],
  supportLinks: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Order Tracking', href: '/order-tracking' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
  ],
  companyLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  bottomLinks: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Shipping', href: '/shipping' },
  ],
}
