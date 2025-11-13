import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
}

export const userAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

export const vendorAPI = {
  getAll: (params) => api.get("/vendors", { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post("/vendors", data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
  getProducts: (vendorId) => api.get(`/vendors/${vendorId}/products`),
  getSchedules: (vendorId) => api.get(`/vendors/${vendorId}/schedules`),
  updateSchedule: (vendorId, data) => api.put(`/vendors/${vendorId}/schedules`, data),
}

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get("/products/search", { params: { q: query } }),
  getByVendor: (vendorId) => {
    if (!vendorId) {
      console.warn("⚠️ No se puede obtener productos: vendorId no definido");
      return Promise.resolve({ data: [] });
    }
    return api.get(`/products/vendor/${vendorId}`);
  },
}

export const orderAPI = {
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, estado) => api.patch(`/orders/${id}/status`, { estado }),
   getByDriver: (driverId) => api.get(`/drivers/${driverId}/orders`), 
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getMyOrders: () => api.get("/orders/my-orders"),
  getVendorOrders: () => api.get("/orders/vendor-orders"),
  getDriverOrders: () => api.get("/orders/driver-orders"),
  assignDriver: (orderId, driverId) => api.post(`/orders/${orderId}/assign`, { driverId }),
  acceptOrder: (orderId) => api.post(`/orders/${orderId}/accept`),
  completeOrder: (orderId) => api.post(`/orders/${orderId}/complete`),

  getAvailableForDrivers: () => api.get("/orders/available"),
  getByDriver: (driverId) => api.get(`/orders/driver/${driverId}`),
  getByVendor: (vendorId) => api.get(`/orders/vendor/${vendorId}`),
  getByClient: (clientId) => api.get(`/orders/client/${clientId}`),
  pay: (id, data) => api.post(`/orders/${id}/pay`, data),
}

export const driverAPI = {
  getAll: (params) => api.get("/drivers", { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post("/drivers", data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
  getAvailableOrders: () => api.get("/drivers/available-orders"),
  acceptOrder: (driverId, orderId) => api.post(`/drivers/${driverId}/accept/${orderId}`),
  
}

export const vehiclesAPI = {
  getAll: (params) => api.get("/vehicles", { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post("/vehicles", data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  getMyVehicles: () => api.get("/vehicles/my-vehicles"),
  getByDriver: (driverId) => api.get(`/driver/${driverId}/vehicles`),
  createForDriver: (driverId, data) => api.post(`/driver/${driverId}/vehicles`, data),
}

export const paymentAPI = {
  getAll: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments", data),
  getMyPayments: () => api.get("/payments/my-payments"),
}

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (filters) => api.get("/admin/users", { params: filters }),
  createUser: (data) => api.post("/admin/users", data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getVendors: () => api.get("/admin/vendors"),
  updateVendor: (id, data) => api.put(`/admin/vendors/${id}`, data),
  getDrivers: () => api.get("/admin/drivers"),
  getOrders: (filters) => api.get("/admin/orders", { params: filters }),
}

export default api
