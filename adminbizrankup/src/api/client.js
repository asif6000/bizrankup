const API_BASE = '/api'

function getToken() {
  try {
    const auth = localStorage.getItem('shajgoj_admin_auth')
    return auth ? JSON.parse(auth).token : null
  } catch { return null }
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),
}

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
}

export const products = {
  list: (params) => api.get(`/products?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

export const categories = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

export const brands = {
  list: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
}

export const orders = {
  list: (params) => api.get(`/orders?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/orders/${id}`),
  incomplete: () => api.get('/orders/incomplete'),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
}

export const users = {
  list: () => api.get('/users'),
  get: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
}

export const expenses = {
  list: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
}

export const blog = {
  list: () => api.get('/blog/all'),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.put(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`),
}

export const offers = {
  list: () => api.get('/offers/all'),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
}

export const slides = {
  list: () => api.get('/slides/all'),
  create: (data) => api.post('/slides', data),
  update: (id, data) => api.put(`/slides/${id}`, data),
  delete: (id) => api.delete(`/slides/${id}`),
}

export const notifications = {
  list: () => api.get('/notifications'),
  create: (data) => api.post('/notifications', data),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`),
}

export const faq = {
  list: () => api.get('/faq/all'),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  delete: (id) => api.delete(`/faq/${id}`),
}

export const addresses = {
  list: () => api.get('/addresses/all'),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
}

export const shippingRates = {
  list: () => api.get('/shipping-rates/all'),
  create: (data) => api.post('/shipping-rates', data),
  update: (id, data) => api.put(`/shipping-rates/${id}`, data),
  delete: (id) => api.delete(`/shipping-rates/${id}`),
}

export const orderStatuses = {
  list: () => api.get('/order-statuses'),
  create: (data) => api.post('/order-statuses', data),
  update: (id, data) => api.put(`/order-statuses/${id}`, data),
  delete: (id) => api.delete(`/order-statuses/${id}`),
}

export const paymentGateways = {
  list: () => api.get('/payment-gateways'),
  update: (provider, data) => api.put(`/payment-gateways/${provider}`, data),
}

export const socialLogin = {
  list: () => api.get('/social-login'),
  update: (provider, data) => api.put(`/social-login/${provider}`, data),
}

export const tracking = {
  list: () => api.get('/tracking'),
  update: (provider, data) => api.put(`/tracking/${provider}`, data),
}

export const trackingEvents = {
  list: (params) => api.get(`/tracking/events?${new URLSearchParams(params || {})}`),
  log: (data) => api.post('/tracking/events', data),
  clear: (source) => api.delete(`/tracking/events${source ? `?source=${source}` : ''}`),
  sendToFacebook: (data) => api.post('/tracking/send/facebook', data),
  sendToGA4: (data) => api.post('/tracking/send/ga4', data),
  sendToTikTok: (data) => api.post('/tracking/send/tiktok', data),
}

export const couriers = {
  list: () => api.get('/couriers'),
  update: (provider, data) => api.put(`/couriers/${provider}`, data),
}

export const reviews = {
  list: () => api.get('/reviews'),
  delete: (id) => api.delete(`/reviews/${id}`),
}

export const events = {
  list: () => api.get('/events/all'),
  get: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

export const advancePayment = {
  get: () => api.get('/payment-gateways').then(list => {
    const found = (list || []).find(p => p.provider === 'advance_payment')
    return found || { provider: 'advance_payment', active: false, credentials: { threshold: 1000 } }
  }),
  update: (data) => api.put('/payment-gateways/advance_payment', data),
}

export const upload = {
  file: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const token = getToken()
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw { status: res.status, ...data }
    return data
  },
  delete: (path) => api.delete(`/upload/${encodeURIComponent(path)}`),
}
