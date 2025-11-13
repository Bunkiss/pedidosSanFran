<template>
  <div class="container py-4">
    <h2 class="mb-4">📦 Pedidos Recientes</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else>
      <table class="table table-striped table-hover align-middle">
        <thead class="table-primary">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.client?.nombre || order.client?.email || '—' }}</td>
            <td>${{ formatPrice(order.total) }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning text-dark': order.estado === 'pendiente',
                  'bg-info': order.estado === 'preparado' || order.estado === 'en_camino',
                  'bg-success': order.estado === 'completado',
                  'bg-secondary': order.estado === 'cancelado'
                }"
              >
                {{ order.estado.toUpperCase() }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="viewOrderDetails(order)"
              >
                Ver Detalles
              </button>

              <button
                v-if="order.estado === 'pendiente'"
                class="btn btn-sm btn-success me-2"
                @click="updateOrderStatus(order.id, 'preparado')"
              >
                Aceptar
              </button>

              <button
                v-if="order.estado === 'preparado'"
                class="btn btn-sm btn-warning me-2"
                @click="updateOrderStatus(order.id, 'en_camino')"
              >
                En Camino
              </button>

              <button
                v-if="order.estado === 'en_camino'"
                class="btn btn-sm btn-success me-2"
                @click="updateOrderStatus(order.id, 'completado')"
              >
                Completar
              </button>

              <button
                v-if="order.estado !== 'completado' && order.estado !== 'cancelado'"
                class="btn btn-sm btn-outline-danger"
                @click="updateOrderStatus(order.id, 'cancelado')"
              >
                Cancelar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="orders.length === 0" class="text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
        <p class="text-muted">No hay pedidos recientes</p>
      </div>
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
const loading = ref(true)

const fetchOrders = async () => {
  loading.value = true
  try {
    console.log('🔹 Obteniendo pedidos del vendor:', authStore.user.vendorId)
    const response = await orderAPI.getByVendor(authStore.user.vendorId)
    orders.value = response.data
    console.log('🟢 Pedidos recibidos:', orders.value)
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error)
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (orderId, estado) => {
  try {
    await orderAPI.updateStatus(orderId, estado)
    alert(`✅ Pedido #${orderId} actualizado a "${estado}"`)
    await fetchOrders()
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error)
    alert('Error al actualizar el pedido')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const formatPrice = (value) => {
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const viewOrderDetails = (order) => {
  console.log('🧭 Navegando al detalle del pedido:', order.id)
  router.push({ name: 'VendorOrderDetails', params: { id: order.id } })
}

onMounted(fetchOrders)
</script>

<style scoped>
.table {
  border-radius: 10px;
  overflow: hidden;
}
.badge {
  font-size: 0.9rem;
}
</style>
