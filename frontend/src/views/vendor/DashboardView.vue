<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4">Dashboard del Vendedor</h2>

    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card text-white bg-primary">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2">Pedidos Hoy</h6>
                <h2 class="card-title mb-0">{{ stats.ordersToday }}</h2>
              </div>
              <i class="bi bi-receipt fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-success">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2">Ventas Hoy</h6>
                <h2 class="card-title mb-0">${{ stats.salesToday }}</h2>
              </div>
              <i class="bi bi-currency-dollar fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-warning">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2">Pendientes</h6>
                <h2 class="card-title mb-0">{{ stats.pendingOrders }}</h2>
              </div>
              <i class="bi bi-clock-history fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-info">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2">Productos</h6>
                <h2 class="card-title mb-0">{{ stats.totalProducts }}</h2>
              </div>
              <i class="bi bi-box-seam fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Pedidos Recientes</h5>
        <button class="btn btn-sm btn-primary" @click="router.push({ name: 'vendor-orders' })">
          Ver Todos
        </button>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div v-else-if="recentOrders.length > 0" class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.cliente?.nombre || 'Cliente' }}</td>
                <td>{{ order.items?.length || 0 }} items</td>
                <td class="fw-bold text-success">${{ Number(order.total || 0).toFixed(2) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(order.estado)">
                    {{ getStatusText(order.estado) }}
                  </span>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary">
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-1 mb-2"></i>
          <p>No hay pedidos recientes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { orderAPI, productAPI } from '@/helpers/api'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const recentOrders = ref([])

const stats = ref({
  ordersToday: 0,
  salesToday: 0,
  pendingOrders: 0,
  totalProducts: 0
})

const getStatusClass = (status) => {
  const classes = {
    'pendiente': 'bg-warning',
    'confirmado': 'bg-info',
    'en_preparacion': 'bg-primary',
    'en_camino': 'bg-primary',
    'entregado': 'bg-success',
    'cancelado': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En Preparación',
    'en_camino': 'En Camino',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }
  return texts[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const ordersResponse = await orderAPI.getByVendor(authStore.user.vendorId)
    recentOrders.value = ordersResponse.data.slice(0, 10)
    
    const today = new Date().toDateString()
    const todayOrders = recentOrders.value.filter(o => 
    new Date(o.createdAt).toDateString() === today
  )

    stats.value.ordersToday = todayOrders.length
    stats.value.salesToday = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)
    stats.value.pendingOrders = recentOrders.value.filter(o => 
      o.estado === 'pendiente' || o.estado === 'confirmado'
    ).length

    const productsResponse = await productAPI.getByVendor(authStore.user.vendorId)
    stats.value.totalProducts = productsResponse.data.length
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
