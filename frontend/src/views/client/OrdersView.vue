<template>
  <div class="container py-4">
    <h2 class="mb-4">Mis Pedidos</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="orders.length > 0">
      <div class="card mb-3" v-for="order in orders" :key="order.id">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-2">
              <div class="text-center">
                <i class="bi bi-receipt fs-1 text-primary"></i>
                <div class="small text-muted">Pedido #{{ order.id }}</div>
              </div>
            </div>

            <div class="col-md-4">
              <h5 class="mb-1">
                {{ order.vendor?.nombre || order.vendorNombre || 'Restaurante' }}
              </h5>
              <p class="text-muted small mb-1">
                {{ formatDate(order.createdAt) }}
              </p>
              <p class="mb-0">
                <span class="badge" :class="getStatusClass(order.estado)">
                  {{ getStatusText(order.estado) }}
                </span>
              </p>
            </div>

            <div class="col-md-3">
              <div class="small text-muted">Total</div>
              <div class="fs-5 fw-bold text-success">
                ${{ formatPrice(order.total) }}
              </div>
            </div>

            <div class="col-md-3 text-end">
              <button 
                class="btn btn-primary"
                @click="viewOrder(order.id)"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-bag-x fs-1 text-muted mb-3"></i>
      <h4 class="text-muted">No tienes pedidos</h4>
      <p class="text-muted">Realiza tu primer pedido y aparecerá aquí</p>
      <button class="btn btn-primary" @click="router.push({ name: 'home' })">
        Explorar Restaurantes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { orderAPI } from '@/helpers/api'

const router = useRouter()
const authStore = useAuthStore()
const orders = ref([])
const loading = ref(false)

const getStatusClass = (status) => {
  const classes = {
    pendiente: 'bg-warning',
    confirmado: 'bg-info',
    en_preparacion: 'bg-primary',
    en_camino: 'bg-primary',
    entregado: 'bg-success',
    cancelado: 'bg-danger',
    preparado: 'bg-info',
    completado: 'bg-success'
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    en_camino: 'En Camino',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
    preparado: 'Preparado',
    completado: 'Completado'
  }
  return texts[status] || status
}

const formatPrice = (value) => {
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Fecha no disponible'
  const date = new Date(dateStr)
  return date.toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderAPI.getByClient(authStore.user.id)
    orders.value = response.data || []
  } catch (error) {
    console.error('❌ Error al cargar pedidos:', error)
  } finally {
    loading.value = false
  }
}

const viewOrder = (orderId) => {
  router.push({ name: 'order-detail', params: { id: orderId } })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.card-title {
  font-weight: 600;
}
</style>
