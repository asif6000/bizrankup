import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  categories as seedCategories, brands as seedBrands, products as seedProducts,
  orders as seedOrders, blogPosts as seedBlog, offers as seedOffers,
  heroSlides as seedSlides, promoBanners as seedPromos, notifications as seedNotifications,
  faqData as seedFaq, flashSales as seedFlashSales, bundles as seedBundles,
  users as seedUsers, orderStatuses as seedOrderStatuses, trendingStats as seedTrendingStats,
  addresses as seedAddresses,
  headerSettings as seedHeader, footerSettings as seedFooter,
} from '../data'

const STORAGE_PREFIX = 'shajgoj_admin_'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [categories, setCategories] = useState(() => load('categories', seedCategories))
  const [products, setProducts] = useState(() => load('products', seedProducts))
  const [brands, setBrands] = useState(() => load('brands', seedBrands))
  const [orders, setOrders] = useState(() => load('orders', seedOrders))
  const [blogPosts, setBlogPosts] = useState(() => load('blogPosts', seedBlog))
  const [offers, setOffers] = useState(() => load('offers', seedOffers))
  const [heroSlides, setHeroSlides] = useState(() => load('heroSlides', seedSlides))
  const [promoBanners, setPromoBanners] = useState(() => load('promoBanners', seedPromos))
  const [notifications, setNotifications] = useState(() => load('notifications', seedNotifications))
  const [faqData, setFaqData] = useState(() => load('faq', seedFaq))
  const [flashSales, setFlashSales] = useState(() => load('flashSales', seedFlashSales))
  const [bundles, setBundles] = useState(() => load('bundles', seedBundles))
  const [users, setUsers] = useState(() => load('users', seedUsers))
  const [orderStatuses, setOrderStatuses] = useState(() => load('orderStatuses', seedOrderStatuses))
  const [trendingStats, setTrendingStats] = useState(() => load('trendingStats', seedTrendingStats))
  const [addresses, setAddresses] = useState(() => load('addresses', seedAddresses))
  const [headerSettings, setHeaderSettings] = useState(() => load('headerSettings', seedHeader))
  const [footerSettings, setFooterSettings] = useState(() => load('footerSettings', seedFooter))

  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'categories', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'brands', JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'blogPosts', JSON.stringify(blogPosts)) }, [blogPosts])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'offers', JSON.stringify(offers)) }, [offers])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'heroSlides', JSON.stringify(heroSlides)) }, [heroSlides])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'promoBanners', JSON.stringify(promoBanners)) }, [promoBanners])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications)) }, [notifications])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'faq', JSON.stringify(faqData)) }, [faqData])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'flashSales', JSON.stringify(flashSales)) }, [flashSales])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'bundles', JSON.stringify(bundles)) }, [bundles])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users)) }, [users])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'orderStatuses', JSON.stringify(orderStatuses)) }, [orderStatuses])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'trendingStats', JSON.stringify(trendingStats)) }, [trendingStats])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'addresses', JSON.stringify(addresses)) }, [addresses])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'headerSettings', JSON.stringify(headerSettings)) }, [headerSettings])
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'footerSettings', JSON.stringify(footerSettings)) }, [footerSettings])

  const addItem = useCallback((_key, setter, item) => {
    setter(prev => [{ id: Date.now(), ...item }, ...prev])
  }, [])

  const updateItem = useCallback((_key, setter, id, updates) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }, [])

  const deleteItem = useCallback((_key, setter, id) => {
    setter(prev => prev.filter(item => item.id !== id))
  }, [])

  const ctx = {
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
    headerSettings, setHeaderSettings,
    footerSettings, setFooterSettings,
    addItem, updateItem, deleteItem,
  }

  return <AdminContext.Provider value={ctx}>{children}</AdminContext.Provider>
}

export const useAdmin = () => useContext(AdminContext)
