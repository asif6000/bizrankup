const API_BASE = '/api'

function getToken() {
  try {
    const auth = localStorage.getItem('shajgoj_auth')
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
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

export const products = {
  list: (params) => api.get(`/products?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/products/${id}`),
}

export const categories = {
  list: () => api.get('/categories'),
}

export const brands = {
  list: () => api.get('/brands'),
}

export const orders = {
  list: (params) => api.get(`/orders?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
}

export const reviews = {
  list: (productId) => api.get(`/reviews?product_id=${productId}`),
  create: (data) => api.post('/reviews', data),
}

export const addresses = {
  list: () => api.get('/addresses'),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
}
