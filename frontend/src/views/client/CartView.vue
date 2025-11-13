<template>
  <div class="container py-4">
    <h2 class="mb-4">Tu Carrito</h2>

    <div class="row">
      <div class="col-lg-8">
        <div v-if="cartStore.items.length > 0">
          <div class="card mb-3" v-for="item in cartStore.items" :key="item.id">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img 
                    :src="item.imagen || 'https://via.placeholder.com/100'" 
                    class="img-fluid rounded"
                    :alt="item.nombre"
                  >
                </div>
                <div class="col-md-4">
                  <h5 class="mb-1">{{ item.nombre }}</h5>
                  <small class="text-muted">{{ item.vendorNombre }}</small>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <button 
                      class="btn btn-outline-secondary"
                      @click="cartStore.decrementItem(item.id)"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <input 
                      type="text" 
                      class="form-control text-center" 
                      :value="item.cantidad"
                      readonly
                    >
                    <button 
                      class="btn btn-outline-secondary"
                      @click="cartStore.incrementItem(item.id)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-2 text-end">
                  <strong class="text-success">
                    ${{ (item.precio * item.cantidad).toFixed(2) }}
                  </strong>
                </div>
                <div class="col-md-1 text-end">
                  <button 
                    class="btn btn-link text-danger"
                    @click="cartStore.removeItem(item.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3">Dirección de Entrega</h5>
              <input 
                type="text" 
                class="form-control mb-3" 
                placeholder="Dirección completa"
                v-model="deliveryAddress"
              >
              <textarea 
                class="form-control" 
                rows="2" 
                placeholder="Instrucciones adicionales (opcional)"
                v-model="deliveryNotes"
              ></textarea>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3">Método de Pago</h5>
              <div class="form-check mb-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="paymentMethod" 
                  id="cash"
                  value="efectivo"
                  v-model="paymentMethod"
                >
                <label class="form-check-label" for="cash">
                  <i class="bi bi-cash"></i> Efectivo
                </label>
              </div>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="paymentMethod" 
                  id="card"
                  value="tarjeta"
                  v-model="paymentMethod"
                >
                <label class="form-check-label" for="card">
                  <i class="bi bi-credit-card"></i> Tarjeta
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h4 class="text-muted">Tu carrito está vacío</h4>
          <p class="text-muted">Agrega productos para continuar</p>
          <button class="btn btn-primary" @click="router.push({ name: 'home' })">
            Explorar Restaurantes
          </button>
        </div>
      </div>

      <div class="col-lg-4" v-if="cartStore.items.length > 0">
        <div class="card sticky-top" style="top: 20px;">
          <div class="card-body">
            <h5 class="card-title mb-3">Resumen del Pedido</h5>

            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Envío:</span>
              <span>${{ cartStore.deliveryFee.toFixed(2) }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label small">Propina para el repartidor:</label>
              <div class="btn-group w-100 mb-2" role="group">
                <button 
                  v-for="tip in [0, 1, 2, 3]" 
                  :key="tip"
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  :class="{ active: cartStore.tip === tip }"
                  @click="cartStore.setTip(tip)"
                >
                  {{ tip === 0 ? 'Sin propina' : `$${tip}` }}
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span>Propina:</span>
              <span>${{ cartStore.tip.toFixed(2) }}</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong class="text-success fs-4">
                ${{ cartStore.total.toFixed(2) }}
              </strong>
            </div>

            <button 
              class="btn btn-success w-100 mb-2"
              @click="placeOrder"
              :disabled="!deliveryAddress || !paymentMethod || loading"
            >
              <span v-if="loading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </span>
              <span v-else>Realizar Pedido</span>
            </button>

            <button 
              class="btn btn-outline-secondary w-100"
              @click="router.push({ name: 'home' })"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { orderAPI } from '@/helpers/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const deliveryAddress = ref('')
const deliveryNotes = ref('')
const paymentMethod = ref('efectivo')
const loading = ref(false)

const placeOrder = async () => {
  if (!deliveryAddress.value || !paymentMethod.value) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  loading.value = true
  try {
    const orderData = {
      vendorId: cartStore.items[0].vendorId,
      clientId: authStore.user.id,
      estado: 'pendiente',
      direccionEntrega: deliveryAddress.value,
      notas: deliveryNotes.value,
      metodoPago: paymentMethod.value,
      subtotal: cartStore.subtotal,
      costoEnvio: cartStore.deliveryFee,
      propina: cartStore.tip,
      total: cartStore.total,
      details: cartStore.items.map(item => ({
        productId: item.id,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
        impuestos: 0,
        propina: cartStore.tip,
        costo_envio: cartStore.deliveryFee,
        metodo_pago: paymentMethod.value
      }))
    }

    console.log('📦 Enviando pedido:', orderData)
    const response = await orderAPI.create(orderData)
    const orderId = response.data.id

    await orderAPI.pay(orderId, {
      monto: cartStore.total,
      metodo: paymentMethod.value
    })

    cartStore.clearCart()
    alert('✅ Pedido realizado y pagado con éxito!')
    router.push({ name: 'order-detail', params: { id: orderId } })
  } catch (error) {
    console.error('❌ Error al realizar el pedido:', error)
    alert('❌ Error al procesar el pago. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>
