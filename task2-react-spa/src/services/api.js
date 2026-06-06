import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor — unwrap data & normalise errors ──────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Products ───────────────────────────────────────────────────────────
export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id)          => api.get(`/products/${id}`),
  create:  (data)        => api.post('/products', data),
  update:  (id, data)    => api.patch(`/products/${id}`, data),
  remove:  (id)          => api.delete(`/products/${id}`),
};

export default api;
