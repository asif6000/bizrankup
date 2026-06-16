import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as api from '../api/client'

const STORAGE_PREFIX = 'shajgoj_admin_'

const entityConfig = {
  products: { list: () => api.products.list({ limit: 1000 }), create: api.products.create, update: api.products.update, del: api.products.delete, mapFromApi: mapProductFromApi, mapToApi: mapProductToApi },
  categories: { list: api.categories.list, create: api.categories.create, update: api.categories.update, del: api.categories.delete, mapFromApi: mapCategoryFromApi, mapToApi: mapCategoryToApi },
  brands: { list: api.brands.list, create: api.brands.create, update: api.brands.update, del: api.brands.delete, mapFromApi: (b) => b, mapToApi: (d) => d },
  orders: { list: () => api.orders.list({ limit: 1000 }), updateStatus: api.orders.updateStatus, mapFromApi: mapOrderFromApi },
  blogPosts: { list: api.blog.list, create: api.blog.create, update: api.blog.update, del: api.blog.delete, mapFromApi: mapBlogFromApi, mapToApi: (d) => d },
  offers: { list: api.offers.list, create: api.offers.create, update: api.offers.update, del: api.offers.delete, mapFromApi: mapOfferFromApi, mapToApi: mapOfferToApi },
  heroSlides: { list: api.slides.list, create: api.slides.create, update: api.slides.update, del: api.slides.delete, mapFromApi: mapSlideFromApi, mapToApi: mapSlideToApi },
  notifications: { list: api.notifications.list, create: api.notifications.create, del: api.notifications.delete, mapFromApi: mapNotificationFromApi, mapToApi: mapNotificationToApi },
  faqData: { list: api.faq.list, create: api.faq.create, update: api.faq.update, del: api.faq.delete, mapFromApi: (f) => f, mapToApi: (d) => d },
  users: { list: api.users.list, del: api.users.delete, mapFromApi: mapUserFromApi },
  orderStatuses: { list: api.orderStatuses.list, create: api.orderStatuses.create, update: api.orderStatuses.update, del: api.orderStatuses.delete, mapFromApi: mapStatusFromApi, mapToApi: mapStatusToApi },
  addresses: { list: api.addresses.list, create: api.addresses.create, update: api.addresses.update, del: api.addresses.delete, mapFromApi: mapAddressFromApi, mapToApi: mapAddressToApi },
  events: { list: api.events.list, create: api.events.create, update: api.events.update, del: api.events.delete, mapFromApi: mapEventFromApi, mapToApi: mapEventToApi },
}

function mapProductFromApi(p, catNameMap, brandNameMap) {
  const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || [])
  const catName = catNameMap[p.category_id] || ''
  const brandName = brandNameMap[p.brand_id] || ''
  const fallbackImg = 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: { id: p.category_id, name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') },
    brand: { id: p.brand_id, name: brandName, slug: brandName.toLowerCase().replace(/\s+/g, '-') },
    price: Number(p.price),
    originalPrice: p.sale_price ? Number(p.sale_price) : undefined,
    image: Array.isArray(images) ? (images[0] || fallbackImg) : (images || fallbackImg),
    images: Array.isArray(images) ? images : [],
    rating: Number(p.rating || 0),
    reviewCount: p.reviews_count || 0,
    inStock: (p.stock || 0) > 0,
    badge: p.featured ? 'Featured' : '',
    description: p.description || '',
    meta_title: '',
    meta_description: '',
  }
}

function mapProductToApi(data, catIdMap, brandIdMap) {
  const images = Array.isArray(data.images) ? data.images : (data.images ? data.images.split(',').map(s => s.trim()).filter(Boolean) : [])
  if (data.image && !images.includes(data.image)) images.unshift(data.image)
  return {
    name: data.name,
    slug: data.slug,
    description: data.description || '',
    price: Number(data.price),
    sale_price: data.originalPrice ? Number(data.originalPrice) : null,
    images,
    category_id: catIdMap[data.category] || null,
    brand_id: brandIdMap[data.brand] || null,
    stock: data.inStock ? 50 : 0,
    featured: data.badge === 'Featured',
    rating: Number(data.rating || 4.5),
    reviews_count: Number(data.reviewCount || 0),
  }
}

function mapCategoryFromApi(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || '',
    subcategories: c.subcategories || [],
  }
}

function mapCategoryToApi(data) {
  return { name: data.name, slug: data.slug, image: data.image || '', parent_id: null }
}

function mapOrderFromApi(o) {
  const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
  const shipping = typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : (o.shipping_address || {})
  return {
    id: o.id,
    orderNumber: o.order_number,
    customer: o.customer_name || o.user?.name || 'Customer',
    date: o.created_at ? o.created_at.split('T')[0] : '',
    total: Number(o.total),
    subtotal: Number(o.subtotal || o.total),
    shipping: Number(o.shipping || 0),
    discount: Number(o.discount || 0),
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    items: items.map(item => ({
      name: item.name || item.product_name,
      price: Number(item.price),
      quantity: item.quantity || 1,
    })),
    payment_method: o.payment_method,
    payment_status: o.payment_status,
    shipping_address: shipping,
  }
}

function mapBlogFromApi(p) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: p.content || '',
    author: p.author || 'Admin',
    date: p.created_at ? p.created_at.split('T')[0] : '',
    image: p.image || '',
    category: p.category || '',
    readTime: '',
    tags: [],
  }
}

function mapOfferFromApi(o) {
  const expires = o.expires_at ? o.expires_at.split('T')[0] : ''
  return {
    id: o.id,
    title: o.code,
    code: o.code,
    discount: Number(o.value),
    type: o.type,
    validUntil: expires,
    minPurchase: o.min_order ? Number(o.min_order) : '',
    description: '',
    active: o.active !== false,
  }
}

function mapOfferToApi(data) {
  return {
    code: data.code,
    type: data.type,
    value: Number(data.discount),
    min_order: data.minPurchase ? Number(data.minPurchase) : null,
    expires_at: data.validUntil ? data.validUntil : null,
    active: data.active !== false,
  }
}

function mapSlideFromApi(s) {
  return {
    id: s.id,
    title: s.title || '',
    subtitle: s.subtitle || '',
    image: s.image || '',
    link: s.link || '',
    bg: 'from-pink-500 to-rose-400',
    cta: 'Shop Now',
    active: s.active !== false,
    order_index: s.order_index || 0,
  }
}

function mapSlideToApi(data) {
  return { title: data.title, subtitle: data.subtitle, image: data.image, link: data.link, active: data.active !== false }
}

function mapNotificationFromApi(n) {
  return {
    id: n.id,
    title: n.title,
    message: n.message || '',
    type: n.type || 'info',
    read: n.is_read || false,
    date: n.created_at ? n.created_at.split('T')[0] : '',
  }
}

function mapNotificationToApi(data) {
  return { title: data.title, message: data.message || '', type: data.type || 'info', for_role: 'all' }
}

function mapUserFromApi(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    avatar: u.avatar || `https://i.pravatar.cc/80?u=${u.id}`,
    joinDate: u.created_at ? u.created_at.split('T')[0] : '',
    tier: u.role === 'admin' ? 'Gold' : 'Silver',
    orders: u.order_count || 0,
    role: u.role,
  }
}

function mapStatusFromApi(s) {
  return {
    id: s.id,
    label: s.name,
    order: s.order_index || s.id,
    completed: false,
    date: null,
  }
}

function mapStatusToApi(data) {
  return { name: data.label, color: '#6B7280', icon: 'FiCircle', order_index: Number(data.order) || 1 }
}

function mapAddressFromApi(a) {
  return {
    id: a.id,
    label: a.label || 'Home',
    street: a.street || '',
    city: a.city || '',
    state: a.state || '',
    zip: a.zip || '',
    default: a.is_default || false,
  }
}

function mapAddressToApi(data) {
  return { label: data.label, street: data.street, city: data.city, state: data.state, zip: data.zip, is_default: data.default || false }
}

function mapEventFromApi(e) {
  return {
    id: e.id,
    title: e.title,
    description: e.description || '',
    image: e.image || '',
    startDate: e.start_date ? e.start_date.slice(0, 16).replace('T', ' ') : '',
    endDate: e.end_date ? e.end_date.slice(0, 16).replace('T', ' ') : '',
    location: e.location || '',
    organizer: e.organizer || '',
    status: e.status || 'upcoming',
    type: e.type || 'promotion',
    link: e.link || '',
  }
}

function mapEventToApi(data) {
  return {
    title: data.title,
    description: data.description || null,
    image: data.image || null,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    location: data.location || null,
    organizer: data.organizer || null,
    status: data.status || 'upcoming',
    type: data.type || 'promotion',
    link: data.link || null,
  }
}

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [orders, setOrders] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [offers, setOffers] = useState([])
  const [heroSlides, setHeroSlides] = useState([])
  const [promoBanners, setPromoBanners] = useState([])
  const [notifications, setNotifications] = useState([])
  const [faqData, setFaqData] = useState([])
  const [flashSales, setFlashSales] = useState([])
  const [bundles, setBundles] = useState([])
  const [users, setUsers] = useState([])
  const [orderStatuses, setOrderStatuses] = useState([])
  const [trendingStats, setTrendingStats] = useState([])
  const [events, setEvents] = useState([])
  const [trackingEvents, setTrackingEvents] = useState([])
  const [addresses, setAddresses] = useState([])
  const [headerSettings, setHeaderSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'headerSettings')) || {} } catch { return {} }
  })
  const [footerSettings, setFooterSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'footerSettings')) || {} } catch { return {} }
  })

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_PREFIX + 'auth')
    if (token) {
      try {
        JSON.parse(token)
        api.auth.me().then(userData => {
          setUser(userData)
          setAuthLoading(false)
        }).catch(() => {
          localStorage.removeItem(STORAGE_PREFIX + 'auth')
          setAuthLoading(false)
        })
      } catch {
        Promise.resolve().then(() => {
          localStorage.removeItem(STORAGE_PREFIX + 'auth')
          setAuthLoading(false)
        })
      }
    } else {
      Promise.resolve().then(() => setAuthLoading(false))
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled([
        entityConfig.categories.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.categories.mapFromApi)
          setCategories(mapped)
          return mapped
        }),
        entityConfig.brands.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.brands.mapFromApi)
          setBrands(mapped)
          return mapped
        }),
        entityConfig.orders.list().then(data => {
          const mapped = (Array.isArray(data) ? data : (data.orders || [])).map(entityConfig.orders.mapFromApi)
          setOrders(mapped)
          return mapped
        }),
        entityConfig.blogPosts.list().then(data => {
          const mapped = (Array.isArray(data) ? data : (data.posts || [])).map(entityConfig.blogPosts.mapFromApi)
          setBlogPosts(mapped)
          return mapped
        }),
        entityConfig.offers.list().then(data => {
          const mapped = (Array.isArray(data) ? data : (data.offers || [])).map(entityConfig.offers.mapFromApi)
          setOffers(mapped)
          return mapped
        }),
        entityConfig.heroSlides.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.heroSlides.mapFromApi)
          setHeroSlides(mapped)
          return mapped
        }),
        entityConfig.notifications.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.notifications.mapFromApi)
          setNotifications(mapped)
          return mapped
        }),
        entityConfig.faqData.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.faqData.mapFromApi)
          setFaqData(mapped)
          return mapped
        }),
        entityConfig.users.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.users.mapFromApi)
          setUsers(mapped)
          return mapped
        }),
        entityConfig.orderStatuses.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.orderStatuses.mapFromApi)
          setOrderStatuses(mapped)
          return mapped
        }),
        entityConfig.addresses.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.addresses.mapFromApi)
          setAddresses(mapped)
          return mapped
        }),
        entityConfig.events.list().then(data => {
          const mapped = (Array.isArray(data) ? data : []).map(entityConfig.events.mapFromApi)
          setEvents(mapped)
          return mapped
        }),
      ])

      const CAT_NAME_MAP = {}
      const BRAND_NAME_MAP = {}
      if (results[0].status === 'fulfilled' && results[0].value) results[0].value.forEach(c => { CAT_NAME_MAP[c.id] = c.name })
      if (results[1].status === 'fulfilled' && results[1].value) results[1].value.forEach(b => { BRAND_NAME_MAP[b.id] = b.name })

      try {
        const productData = await entityConfig.products.list()
        const items = Array.isArray(productData) ? productData : (productData.products || [])
        const mapped = items.map(p => mapProductFromApi(p, CAT_NAME_MAP, BRAND_NAME_MAP))
        setProducts(mapped)
      } catch (err) {
        console.error('[AdminContext] Failed to load products:', err)
        setError('Failed to load products. Check console for details.')
      }
    } catch (err) {
      console.error('[AdminContext] fetchAll error:', err)
      setError('Failed to load data. Please check your connection.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    fetchAll()

    const es = new EventSource('/api/events/stream')
    es.addEventListener('data:change', () => fetchAll())
    es.onerror = () => {}

    const interval = setInterval(fetchAll, 30000)
    return () => { es.close(); clearInterval(interval) }
  }, [authLoading, user, fetchAll])

  useEffect(() => {
    if (!authLoading && user) {
      const es = new EventSource('/api/tracking/stream')
      es.addEventListener('tracking:event', (event) => {
        try {
          const data = JSON.parse(event.data)
          setTrackingEvents(prev => [{ ...data, event_data: typeof data.event_data === 'string' ? JSON.parse(data.event_data) : data.event_data }, ...prev].slice(0, 500))
        } catch { /* ignore */ }
      })
      es.onerror = () => {}
      return () => es.close()
    }
  }, [authLoading, user])

  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'headerSettings', JSON.stringify(headerSettings)) }, [headerSettings])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'footerSettings', JSON.stringify(footerSettings)) }, [footerSettings])

  const login = async (email, password) => {
    const res = await api.auth.login(email, password)
    localStorage.setItem(STORAGE_PREFIX + 'auth', JSON.stringify({ token: res.token, user: res.user }))
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_PREFIX + 'auth')
    setUser(null)
  }

  const addItem = useCallback(async (key, setter, item) => {
    try {
      const cfg = entityConfig[key]
      if (cfg && cfg.create) {
        const catNameMap = Object.fromEntries((categories || []).map(c => [c.name, c.id]))
        const brandNameMap = Object.fromEntries((brands || []).map(b => [b.name, b.id]))
        const data = cfg.mapToApi ? cfg.mapToApi(item, catNameMap, brandNameMap) : item
        const created = await cfg.create(data)
        const mapped = cfg.mapFromApi ? (cfg.key === 'products' ? mapProductFromApi(created, {}, {}) : cfg.mapFromApi(created)) : created
        setter(prev => [{ ...mapped, id: created.id }, ...prev])
      } else {
        setter(prev => [{ id: Date.now(), ...item }, ...prev])
      }
    } catch { /* ignore */ }
  }, [categories, brands])

  const updateItem = useCallback(async (key, setter, id, updates) => {
    try {
      const cfg = entityConfig[key]
      if (cfg && cfg.update) {
        const catNameMap = Object.fromEntries((categories || []).map(c => [c.name, c.id]))
        const brandNameMap = Object.fromEntries((brands || []).map(b => [b.name, b.id]))
        const data = cfg.mapToApi ? cfg.mapToApi(updates, catNameMap, brandNameMap) : updates
        await cfg.update(id, data)
        setter(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
      } else {
        setter(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
      }
    } catch { /* ignore */ }
  }, [categories, brands])

  const deleteItem = useCallback(async (key, setter, id) => {
    try {
      const cfg = entityConfig[key]
      if (cfg && cfg.del) await cfg.del(id)
      setter(prev => prev.filter(item => item.id !== id))
    } catch { /* ignore */ }
  }, [])

  const updateProfile = useCallback(async (data) => {
    setUser(prev => ({ ...prev, ...data }))
    const stored = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'auth') || '{}')
    const token = stored?.token
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw result
    if (stored) {
      stored.user = { ...stored.user, ...data }
      localStorage.setItem(STORAGE_PREFIX + 'auth', JSON.stringify(stored))
    }
    return result
  }, [user])

  const ctx = {
    user, authLoading, loading, error, login, logout, isAuthenticated: !!user,
    categories, setCategories,
    products, setProducts,
    brands, setBrands,
    orders, setOrders,
    blogPosts, setBlogPosts,
    offers, setOffers,
    heroSlides, setHeroSlides,
    promoBanners, setPromoBanners,
    notifications, setNotifications,
    faqData, setFaqData,
    flashSales, setFlashSales,
    bundles, setBundles,
    users, setUsers,
    orderStatuses, setOrderStatuses,
    trendingStats, setTrendingStats,
    addresses, setAddresses,
    events, setEvents,
    trackingEvents, setTrackingEvents,
    headerSettings, setHeaderSettings,
    footerSettings, setFooterSettings,
    addItem, updateItem, deleteItem, updateProfile,
  }

  return <AdminContext.Provider value={ctx}>{children}</AdminContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => useContext(AdminContext)
