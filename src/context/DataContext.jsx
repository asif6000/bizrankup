import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { products as productsApi, categories as categoriesApi, brands as brandsApi, blog as blogApi, offers as offersApi, slides as slidesApi, faq as faqApi, orderStatuses as orderStatusesApi } from '../api/client'
import * as fallback from '../data'

const DataContext = createContext()

function mapProduct(p) {
  const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || [])
  const price = Number(p.price)
  const originalPrice = p.sale_price ? Number(p.sale_price) : undefined
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: { id: p.category_id, name: p.category_name || '', slug: (p.category_name || '').toLowerCase().replace(/\s+/g, '-') },
    brand: { id: p.brand_id, name: p.brand_name || '', slug: (p.brand_name || '').toLowerCase().replace(/\s+/g, '-') },
    price,
    originalPrice,
    image: Array.isArray(images) ? (images[0] || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600') : (images || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'),
    images: Array.isArray(images) ? images : [],
    rating: Number(p.rating || 0),
    reviewCount: p.reviews_count || 0,
    inStock: (p.stock || 0) > 0,
    description: p.description || '',
    isNew: p.featured || false,
    isTrending: p.rating >= 4.3,
    isBestSeller: p.reviews_count > 0 && p.reviews_count >= 50,
    discount: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    variants: [],
    ingredients: undefined,
    howToUse: undefined,
    tags: [],
  }
}

function mapBrand(b) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    image: b.logo || b.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
    productCount: b.product_count || 0,
    rating: b.rating || 4.5,
  }
}

function mapCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || '',
    subcategories: c.subcategories || [],
    productCount: c.product_count || 0,
  }
}

function mapBlogPost(p) {
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

function mapSlide(s) {
  return {
    id: s.id,
    title: s.title || '',
    subtitle: s.subtitle || '',
    image: s.image || '',
    link: s.link || '',
    bg: 'from-pink-500 to-rose-400',
    cta: 'Shop Now',
    active: s.active !== false,
  }
}

function mapOffer(o) {
  return {
    id: o.id,
    code: o.code,
    discount: Number(o.value),
    type: o.type,
    validUntil: o.expires_at ? o.expires_at.split('T')[0] : '',
    description: '',
    active: o.active !== false,
  }
}

function mapFaq(f) {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
  }
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState(fallback.products)
  const [categories, setCategories] = useState(fallback.categories)
  const [brands, setBrands] = useState(fallback.brands)
  const [blogPosts, setBlogPosts] = useState(fallback.blogPosts)
  const [heroSlides, setHeroSlides] = useState(fallback.heroSlides)
  const [offers, setOffers] = useState(fallback.offers)
  const [faqData, setFaqData] = useState(fallback.faqData)
  const [orderStatuses, setOrderStatuses] = useState(fallback.orderStatuses)
  const [promoBanners] = useState(fallback.promoBanners)
  const [loading, setLoading] = useState(true)
  const [now] = useState(() => Date.now())
  const fetchAllRef = useRef(null)

  const fetchAll = useCallback(async () => {
    try {
      const [catData, brandData, blogData, slideData, offerData, faqDataResult, orderStatusData] = await Promise.allSettled([
        categoriesApi.list().then(d => d.map(mapCategory)),
        brandsApi.list().then(d => (Array.isArray(d) ? d : []).map(mapBrand)),
        blogApi.list().then(d => Array.isArray(d) ? d.map(mapBlogPost) : (d.posts || []).map(mapBlogPost)),
        slidesApi.list().then(d => Array.isArray(d) ? d.map(mapSlide) : []),
        offersApi.list().then(d => Array.isArray(d) ? d.map(mapOffer) : (d.offers || []).map(mapOffer)),
        faqApi.list().then(d => Array.isArray(d) ? d.map(mapFaq) : []),
        orderStatusesApi.list().then(d => (Array.isArray(d) ? d : []).map(s => ({ label: s.name, order: s.order_index, completed: false, date: null }))),
      ])

      if (catData.status === 'fulfilled' && catData.value.length > 0) setCategories(catData.value)
      if (brandData.status === 'fulfilled' && brandData.value.length > 0) setBrands(brandData.value)
      if (blogData.status === 'fulfilled' && blogData.value.length > 0) setBlogPosts(blogData.value)
      if (slideData.status === 'fulfilled' && slideData.value.length > 0) setHeroSlides(slideData.value)
      if (offerData.status === 'fulfilled' && offerData.value.length > 0) setOffers(offerData.value)
      if (faqDataResult.status === 'fulfilled' && faqDataResult.value.length > 0) setFaqData(faqDataResult.value)
      if (orderStatusData.status === 'fulfilled' && orderStatusData.value.length > 0) setOrderStatuses(orderStatusData.value)

      try {
        const prodData = await productsApi.list({ limit: 100 })
        const mapped = (prodData.products || prodData || []).map(mapProduct)
        if (mapped.length > 0) setProducts(mapped)
      } catch { /* keep demo products */ }
    } catch { /* keep demo data */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAllRef.current = fetchAll
    fetchAllRef.current()

    const es = new EventSource('/api/events/stream')
    es.addEventListener('data:change', () => { fetchAllRef.current() })
    es.onerror = () => {}

    const interval = setInterval(() => fetchAllRef.current(), 30000)
    return () => { es.close(); clearInterval(interval) }
  }, [fetchAll])

  const flashSales = useMemo(() => {
    if (!products || products.length === 0) return fallback.flashSales || []
    return products.slice(0, 12).map((p, i) => ({
      ...p,
      discount: [30, 40, 25, 50, 35, 45, 20, 55, 30, 40, 60, 25][i % 12],
      originalPrice: p.price,
      price: +(p.price * (1 - [0.3, 0.4, 0.25, 0.5, 0.35, 0.45, 0.2, 0.55, 0.3, 0.4, 0.6, 0.25][i % 12])).toFixed(2),
      endsAt: new Date(now + (i + 1) * 3600000).toISOString(),
    }))
  }, [products, now])

  const getProduct = useCallback((id) => products.find(p => p.id === Number(id)) || null, [products])
  const getCategory = useCallback((slug) => categories.find(c => c.slug === slug) || null, [categories])
  const getBrand = useCallback((slug) => brands.find(b => b.slug === slug) || null, [brands])

  return (
    <DataContext.Provider value={{
      products, categories, brands, blogPosts, heroSlides, offers, faqData, orderStatuses,
      flashSales, promoBanners, loading,
      getProduct, getCategory, getBrand,
    }}>
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext)
