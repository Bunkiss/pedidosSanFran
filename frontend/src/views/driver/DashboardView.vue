<template>
  <div class="container-fluid py-4">
    <h2 class="fw-bold mb-4">Pedidos Disponibles</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando pedidos...</p>
    </div>

    <div v-else-if="availableOrders.length === 0" class="text-center py-5">
      <p class="text-muted">No hay pedidos disponibles en este momento</p>
    </div>

    <div v-else class="row g-3">
      <div v-for="order in availableOrders" :key="order.id" class="col-md-6">
        <div class="card shadow-sm p-3">
          <h5>Pedido #{{ order.id }}</h5>
          <p><strong>Cliente:</strong> {{ order.client?.nombre || 'Sin cliente' }}</p>
          <p><strong>Total:</strong> ${{ order.total }}</p>
          <button class="btn btn-success w-100" @click="acceptOrder(order.id)">
            Aceptar Pedido #{{ order.id }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { driverAPI } from '@/helpers/api'

const authStore = useAuthStore()
const availableOrders = ref([])
const loading = ref(false)

const orders = availableOrders

const fetchAvailableOrders = async () => {
  loading.value = true
  try {
    const response = await driverAPI.getAvailableOrders()
    availableOrders.value = response.data
  } catch (error) {
    console.error('Error fetching available orders:', error)
  } finally {
    loading.value = false
  }
}

const acceptOrder = async (orderId) => {
  try {
    const driverId = authStore.user?.driverId
    if (!driverId) {
      alert('No se pudo determinar el driverId. Inicia sesión como repartidor.')
      return
    }

    await driverAPI.acceptOrder(driverId, orderId)
    alert(`Pedido #${orderId} aceptado con éxito ✅`)
    await fetchAvailableOrders()
  } catch (error) {
    console.error('Error al aceptar pedido:', error)
    alert('Error al aceptar el pedido')
  }
}

onMounted(() => {
  fetchAvailableOrders()
})
</script>
