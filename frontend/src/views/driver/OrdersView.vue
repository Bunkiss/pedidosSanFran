<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4">Mis Entregas</h2>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">Todos los estados</option>
              <option value="en_camino">En Camino</option>
              <option value="completado">Entregado</option>
            </select>
          </div>
          <div class="col-md-3">
            <input 
              type="date" 
              class="form-control"
              v-model="filterDate"
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="filteredOrders.length > 0">
      <div class="card mb-3" v-for="order in filteredOrders" :key="order.id">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-2">
              <h5 class="mb-0">Pedido #{{ order.id }}</h5>
              <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
            </div>
            <div class="col-md-3">
              <strong>Restaurante:</strong> {{ order.vendor?.nombre }}<br>
              <small class="text-muted">{{ order.vendor?.direccion }}</small>
            </div>
            <div class="col-md-3">
              <strong>Cliente:</strong> {{ order.client?.nombre || 'Sin datos' }}<br>
              <small class="text-muted">{{ order.direccionEntrega || 'Sin dirección' }}</small>
            </div>
            <div class="col-md-2">
              <span class="badge" :class="getStatusClass(order.estado)">
                {{ getStatusText(order.estado) }}
              </span><br>
              <strong class="text-success">${{ Number(order.total).toFixed(2) }}</strong>
            </div>
            <div class="col-md-2 text-end">
              <button 
                v-if="order.estado === 'en_camino'"
                class="btn btn-success btn-sm"
                @click="completeDelivery(order.id)"
              >
                Marcar Entregado
              </button>
              <button 
                v-else
                class="btn btn-outline-primary btn-sm"
                @click="viewDetails(order)"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
      <h4 class="text-muted">No hay entregas</h4>
      <p class="text-muted">Tus entregas aparecerán aquí</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { orderAPI } from '@/helpers/api'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(false)
const filterStatus = ref('')
const filterDate = ref('')

const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  if (filterStatus.value) {
    result = result.filter(o => o.estado === filterStatus.value)
  }
  
  if (filterDate.value) {
    result = result.filter(o => {
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0]
      return orderDate === filterDate.value
    })
  }
  
  return result
})

const getStatusClass = (status) => {
  const classes = {
    'en_camino': 'bg-primary',
    'completado': 'bg-success'
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'en_camino': 'En Camino',
    'completado': 'Entregado'
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

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderAPI.getByDriver(authStore.user.driverId)
    console.log('🟢 Órdenes del driver:', response.data)
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const completeDelivery = async (orderId) => {
  try {
    await orderAPI.updateStatus(orderId, 'completado')
    await fetchOrders()
  } catch (error) {
    console.error('Error completing delivery:', error)
    alert('Error al completar la entrega')
  }
}

const viewDetails = (order) => {
  console.log('🟠 Detalles del pedido:', order)
}

onMounted(() => {
  fetchOrders()
})
</script>
