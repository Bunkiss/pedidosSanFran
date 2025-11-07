<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="mb-3">Todos los Restaurantes</h2>
        
        <!-- Filters -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar restaurantes..."
              v-model="filters.search"
              @input="applyFilters"
            >
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filters.category" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option value="restaurante">Restaurantes</option>
              <option value="mercado">Mercado</option>
              <option value="farmacia">Farmacia</option>
              <option value="licores">Licores</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filters.sort" @change="applyFilters">
              <option value="popular">Más populares</option>
              <option value="rating">Mejor calificados</option>
              <option value="delivery">Tiempo de entrega</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              <i class="bi bi-arrow-clockwise"></i> Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Vendors List -->
    <div v-else-if="filteredVendors.length > 0" class="row g-4">
      <div 
        v-for="vendor in filteredVendors" 
        :key="vendor.id"
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 vendor-card" @click="goToVendor(vendor.id)">
          <img 
            :src="vendor.imagen || 'https://via.placeholder.com/400x200'" 
            class="card-img-top"
            :alt="vendor.nombre"
            style="height: 200px; object-fit: cover;"
          >
          <div class="card-body">
            <h5 class="card-title">{{ vendor.nombre }}</h5>
            <p class="card-text text-muted small">{{ vendor.descripcion }}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-success">
                <i class="bi bi-star-fill"></i> {{ vendor.calificacion || '4.5' }}
              </span>
              <span class="text-muted small">
                <i class="bi bi-clock"></i> {{ vendor.tiempoEntrega || '30-40' }} min
              </span>
            </div>
            <div class="d-flex gap-1">
              <span class="badge bg-light text-dark">{{ vendor.categoria || 'Restaurante' }}</span>
              <span v-if="vendor.envioGratis" class="badge bg-primary">Envío gratis</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="bi bi-search fs-1 text-muted mb-3"></i>
      <p class="text-muted">No se encontraron restaurantes con estos filtros</p>
      <button class="btn btn-primary" @click="resetFilters">Ver todos</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { vendorAPI } from '@/helpers/api'

const router = useRouter()
const route = useRoute()
const vendors = ref([])
const loading = ref(false)

const filters = ref({
  search: '',
  category: route.query.category || '',
  sort: 'popular'
})

const filteredVendors = computed(() => {
  let result = [...vendors.value]

  // Filter by search
  if (filters.value.search) {
    result = result.filter(v => 
      v.nombre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      v.descripcion?.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  // Filter by category
  if (filters.value.category) {
    result = result.filter(v => v.categoria === filters.value.category)
  }

  // Sort
  if (filters.value.sort === 'rating') {
    result.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
  } else if (filters.value.sort === 'delivery') {
    result.sort((a, b) => (a.tiempoEntrega || 0) - (b.tiempoEntrega || 0))
  }

  return result
})

const fetchVendors = async () => {
  loading.value = true
  try {
    const response = await api.get("/vendors/public")
    vendors.value = response.data
  } catch (error) {
    console.error('Error fetching vendors:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  // Update URL query params
  router.push({ query: { ...filters.value } })
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    sort: 'popular'
  }
  router.push({ query: {} })
}

const goToVendor = (vendorId) => {
  router.push({ name: 'vendor-detail', params: { id: vendorId } })
}

onMounted(() => {
  fetchVendors()
})
</script>

<style scoped>
.vendor-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.vendor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
</style>
