<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="order">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Pedido #{{ order.id }}</h2>
          <p class="text-muted mb-0">
            {{ new Date(order.createdAt).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}
          </p>
        </div>
        <span class="badge fs-5" :class="getStatusClass(order.estado)">
          {{ getStatusText(order.estado) }}
        </span>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-4">Estado del Pedido</h5>
              <div class="timeline">
                <div 
                  class="timeline-item"
                  :class="{ active: isStatusActive('pendiente') }"
                >
                  <div class="timeline-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>Pedido Recibido</h6>
                    <small class="text-muted">Tu pedido ha sido recibido</small>
                  </div>
                </div>
                <div 
                  class="timeline-item"
                  :class="{ active: isStatusActive('confirmado') }"
                >
                  <div class="timeline-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>Confirmado</h6>
                    <small class="text-muted">El restaurante confirmó tu pedido</small>
                  </div>
                </div>
                <div 
                  class="timeline-item"
                  :class="{ active: isStatusActive('en_preparacion') }"
                >
                  <div class="timeline-icon">
                    <i class="bi bi-fire"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>En Preparación</h6>
                    <small class="text-muted">Tu pedido se está preparando</small>
                  </div>
                </div>
                <div 
                  class="timeline-item"
                  :class="{ active: isStatusActive('en_camino') }"
                >
                  <div class="timeline-icon">
                    <i class="bi bi-truck"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>En Camino</h6>
                    <small class="text-muted">Tu pedido está en camino</small>
                  </div>
                </div>
                <div 
                  class="timeline-item"
                  :class="{ active: isStatusActive('entregado') }"
                >
                  <div class="timeline-icon">
                    <i class="bi bi-check2-all"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>Entregado</h6>
                    <small class="text-muted">Tu pedido ha sido entregado</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-3">Productos</h5>
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
              >
                <div class="d-flex align-items-center">
                  <img 
                    :src="item.producto?.imagen || 'https://via.placeholder.com/60'" 
                    class="rounded me-3"
                    style="width: 60px; height: 60px; object-fit: cover;"
                    :alt="item.producto?.nombre"
                  >
                  <div>
                    <h6 class="mb-0">{{ item.producto?.nombre || 'Producto' }}</h6>
                    <small class="text-muted">Cantidad: {{ item.cantidad }}</small>
                  </div>
                </div>
                <strong>${{ (item.precio * item.cantidad).toFixed(2) }}</strong>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-3">Información de Entrega</h5>
              <div class="mb-2">
                <i class="bi bi-geo-alt text-primary me-2"></i>
                <strong>Dirección:</strong> {{ order.direccionEntrega }}
              </div>
              <div v-if="order.notas" class="mb-2">
                <i class="bi bi-chat-left-text text-primary me-2"></i>
                <strong>Notas:</strong> {{ order.notas }}
              </div>
              <div v-if="order.driver">
                <i class="bi bi-person text-primary me-2"></i>
                <strong>Repartidor:</strong> {{ order.driver.nombre }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">Resumen</h5>
              
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${{ order.subtotal?.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>${{ order.costoEnvio?.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Propina:</span>
                <span>${{ order.propina?.toFixed(2) }}</span>
              </div>
              
              <hr>
              
              <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong class="text-success fs-4">${{ order.total?.toFixed(2) }}</strong>
              </div>
              
              <div class="mb-3">
                <small class="text-muted">
                  <i class="bi bi-credit-card me-1"></i>
                  Método de pago: {{ order.metodoPago || 'Efectivo' }}
                </small>
              </div>
              
              <button 
                class="btn btn-outline-primary w-100 mb-2"
                @click="router.push({ name: 'orders' })"
              >
                Ver Todos los Pedidos
              </button>
              
              <button 
                v-if="order.estado === 'entregado'"
                class="btn btn-success w-100"
              >
                Calificar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { orderAPI } from '@/helpers/api'

const router = useRouter()
const route = useRoute()
const order = ref(null)
const loading = ref(false)

const statusOrder = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado']

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

const isStatusActive = (status) => {
  if (!order.value) return false
  const currentIndex = statusOrder.indexOf(order.value.estado)
  const checkIndex = statusOrder.indexOf(status)
  return checkIndex <= currentIndex
}

const fetchOrder = async () => {
  loading.value = true
  try {
    const response = await orderAPI.getById(route.params.id)
    order.value = response.data
  } catch (error) {
    console.error('Error fetching order:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  padding-bottom: 30px;
  opacity: 0.5;
}

.timeline-item.active {
  opacity: 1;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -25px;
  top: 30px;
  width: 2px;
  height: calc(100% - 10px);
  background: #dee2e6;
}

.timeline-item.active:not(:last-child)::before {
  background: var(--bs-primary);
}

.timeline-icon {
  position: absolute;
  left: -35px;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6c757d;
}

.timeline-item.active .timeline-icon {
  border-color: var(--bs-primary);
  background: var(--bs-primary);
  color: white;
}
</style>
