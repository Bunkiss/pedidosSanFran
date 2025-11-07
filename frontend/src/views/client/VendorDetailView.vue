<template>
  <div class="container py-4">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="vendor">
      <!-- Vendor Header -->
      <div class="card mb-4">
        <img 
          :src="getVendorImage(vendor)"
          class="card-img-top"
          :alt="vendor.nombre"
          style="height: 250px; object-fit: cover;"
          @error="handleImageError"
        >
        <div class="card-body">
          <h2 class="card-title">{{ vendor.nombre }}</h2>
          <p class="text-muted">{{ vendor.descripcion }}</p>
          <div class="d-flex gap-3 flex-wrap">
            <span class="badge bg-success fs-6">
              <i class="bi bi-star-fill"></i> {{ vendor.calificacion || '4.5' }}
            </span>
            <span class="text-muted">
              <i class="bi bi-clock"></i> {{ vendor.tiempoEntrega || '30-40' }} min
            </span>
            <span class="text-muted">
              <i class="bi bi-geo-alt"></i> {{ vendor.direccion || 'Dirección no disponible' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="row mb-4">
        <div class="col-md-8">
          <h4 class="mb-3">Menú</h4>

          <!-- Search Products -->
          <div class="mb-3">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar productos..."
              v-model="searchQuery"
            >
          </div>

          <!-- Products List -->
          <div v-if="filteredProducts.length > 0" class="row g-3">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="col-12"
            >
              <div class="card product-card">
                <div class="row g-0">
                  <div class="col-md-3">
                    <img 
                      :src="getProductImage(product)"
                      class="img-fluid rounded-start"
                      :alt="product.nombre"
                      style="height: 150px; width: 100%; object-fit: cover;"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="col-md-9">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 class="card-title">{{ product.nombre }}</h5>
                          <p class="card-text text-muted small">{{ product.descripcion }}</p>
                          <p class="card-text">
                            <strong class="text-success fs-5">${{ product.precio }}</strong>
                          </p>
                        </div>
                        <button 
                          class="btn btn-primary"
                          @click="addToCart(product)"
                        >
                          <i class="bi bi-plus-lg"></i> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted mb-3"></i>
            <p class="text-muted">No se encontraron productos</p>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="col-md-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title">Tu Pedido</h5>

              <div v-if="cartStore.items.length > 0">
                <div 
                  v-for="item in cartStore.items" 
                  :key="item.id"
                  class="d-flex justify-content-between align-items-center mb-2"
                >
                  <div class="flex-grow-1">
                    <small>{{ item.nombre }}</small>
                    <div class="text-muted small">x{{ item.cantidad }}</div>
                  </div>
                  <div class="text-end">
                    <div>${{ (item.precio * item.cantidad).toFixed(2) }}</div>
                    <button 
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="cartStore.removeItem(item.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <hr>

                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${{ cartStore.subtotal.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <strong>${{ cartStore.deliveryFee.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong class="text-success">${{ cartStore.total.toFixed(2) }}</strong>
                </div>

                <button 
                  class="btn btn-success w-100"
                  @click="goToCart"
                >
                  Ir al Carrito
                </button>
              </div>

              <div v-else class="text-center text-muted py-4">
                <i class="bi bi-cart fs-1 mb-2"></i>
                <p class="small">Tu carrito está vacío</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { vendorAPI, productAPI } from '@/helpers/api'
import defaultImage from '@/assets/default-product.jpg'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const vendor = ref(null)
const products = ref([])
const loading = ref(false)
const searchQuery = ref('')

// ✅ Imagen segura para vendor
const getVendorImage = (vendor) => {
  if (!vendor.imagen || !vendor.imagen.startsWith('http')) {
    return defaultImage
  }
  return vendor.imagen
}

// ✅ Imagen segura para producto
const getProductImage = (product) => {
  if (!product.imagen || !product.imagen.startsWith('http')) {
    return defaultImage
  }
  return product.imagen
}

const handleImageError = (event) => {
  event.target.src = defaultImage
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p => 
    p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchVendor = async () => {
  loading.value = true
  try {
    const response = await vendorAPI.getById(route.params.id)
    vendor.value = response.data
  } catch (error) {
    console.error('Error fetching vendor:', error)
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  try {
    const response = await productAPI.getByVendor(route.params.id)
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    imagen: getProductImage(product),
    vendorId: vendor.value.id,
    vendorNombre: vendor.value.nombre
  })
}

const goToCart = () => {
  router.push({ name: 'cart' })
}

onMounted(() => {

  cartStore.loadFromLocalStorage()
  fetchVendor()
  fetchProducts()
})
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
