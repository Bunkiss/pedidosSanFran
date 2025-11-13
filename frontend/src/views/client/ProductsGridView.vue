<template>
  <div class="container py-5">
    <div class="row mb-4">
      <div class="col">
        <h1 class="display-5 fw-bold mb-3">Productos Destacados</h1>
        <p class="text-muted">Descubre los mejores productos de nuestros vendors</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control" 
          placeholder="Buscar productos..."
        >
      </div>
      <div class="col-md-3">
        <select v-model="selectedCategory" class="form-select">
          <option value="">Todas las categorías</option>
          <option value="comida">Comida</option>
          <option value="bebidas">Bebidas</option>
          <option value="postres">Postres</option>
          <option value="snacks">Snacks</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="sortBy" class="form-select">
          <option value="name">Nombre</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="col-md-6 col-lg-4 col-xl-3"
      >
        <div class="card product-card h-100 border-0 shadow-sm">
          <img 
            :src="product.imagen || 'https://via.placeholder.com/300x200'" 
            class="card-img-top" 
            :alt="product.nombre"
            style="height: 200px; object-fit: cover;"
          >
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.nombre }}</h5>
            <p class="card-text text-muted small flex-grow-1">
              {{ product.descripcion }}
            </p>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="h5 mb-0 text-primary">${{ product.precio }}</span>
              <span class="badge bg-secondary">{{ product.categoria }}</span>
            </div>
            <div class="d-flex gap-2">
              <button 
                @click="addToCart(product)" 
                class="btn btn-primary flex-grow-1"
                :disabled="!product.disponible"
              >
                <i class="bi bi-cart-plus me-2"></i>
                {{ product.disponible ? 'Agregar' : 'No disponible' }}
              </button>
              <button 
                @click="viewProduct(product)" 
                class="btn btn-outline-primary"
              >
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredProducts.length === 0" class="text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted"></i>
      <p class="text-muted mt-3">No se encontraron productos</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { productosAPI } from '@/helpers/api'

const router = useRouter()
const cartStore = useCartStore()

const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')

const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(p => 
      p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.categoria === selectedCategory.value)
  }

  if (sortBy.value === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.precio - b.precio)
  } else if (sortBy.value === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.precio - a.precio)
  } else {
    filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  return filtered
})

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await productosAPI.getAll()
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    imagen: product.imagen,
    vendorId: product.vendorId
  })
}

const viewProduct = (product) => {
  router.push(`/products/${product.id}`)
}

onMounted(() => {
  fetchProducts()
})
</script>
