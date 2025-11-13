<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-lg-8 mx-auto text-center">
        <h1 class="display-4 fw-bold mb-3">Bienvenido a Rappi Clone</h1>
        <p class="lead text-muted mb-4">
          Descubre los mejores restaurantes y tiendas cerca de ti. Ordena lo que quieras, cuando quieras.
        </p>
        <div class="input-group input-group-lg mb-4">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Buscar restaurantes, productos..."
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12">
        <h3 class="mb-4">Categorías</h3>
        <div class="row g-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="col-6 col-md-3 col-lg-2"
          >
            <div
              class="card text-center h-100 category-card"
              @click="filterByCategory(category.name)"
              role="button"
            >
              <div class="card-body">
                <i :class="`bi ${category.icon} fs-1 text-primary mb-2`"></i>
                <p class="card-text small mb-0">{{ category.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <h3 class="mb-4">Restaurantes Destacados</h3>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="vendors.length > 0" class="row g-4">
      <div
        v-for="vendor in vendors"
        :key="vendor.id"
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 vendor-card" @click="goToVendor(vendor.id)">
          <img
            :src="getVendorImage(vendor)"
            class="card-img-top"
            :alt="vendor.nombre"
            @error="handleImageError"
            style="height: 200px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ vendor.nombre }}</h5>
            <p class="card-text text-muted small">
              {{ vendor.descripcion || 'Deliciosas opciones para vos' }}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-success">
                <i class="bi bi-star-fill"></i> {{ vendor.calificacion || '4.5' }}
              </span>
              <span class="text-muted small">
                <i class="bi bi-clock"></i> {{ vendor.tiempoEntrega || '30-40' }} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-shop fs-1 text-muted mb-3"></i>
      <p class="text-muted">No se encontraron restaurantes</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api, { vendorAPI } from "@/helpers/api"
import defaultRestaurant from "@/assets/default-restaurant.jpg" 

const router = useRouter()
const vendors = ref([])
const loading = ref(false)
const searchQuery = ref("")

const categories = [
  { id: 1, name: "Restaurantes", icon: "bi-shop" },
  { id: 2, name: "Mercado", icon: "bi-cart" },
  { id: 3, name: "Farmacia", icon: "bi-heart-pulse" },
  { id: 4, name: "Mascotas", icon: "bi-heart" },
  { id: 5, name: "Licores", icon: "bi-cup-straw" },
  { id: 6, name: "Flores", icon: "bi-flower1" },
]

const getVendorImage = (vendor) => {
  return vendor.imagen && vendor.imagen.startsWith("http")
    ? vendor.imagen
    : defaultRestaurant
}

const handleImageError = (event) => {
  event.target.src = defaultRestaurant
}

const fetchVendors = async () => {
  loading.value = true
  try {
    const response = await api.get('/vendors/public')
    vendors.value = response.data
  } catch (error) {
    console.error("❌ Error al cargar vendors:", error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  console.log("🔍 Buscando:", searchQuery.value)
}

const filterByCategory = (category) => {
  router.push({ name: "vendors", query: { category } })
}

const goToVendor = (vendorId) => {
  router.push({ name: "vendor-detail", params: { id: vendorId } })
}

onMounted(fetchVendors)
</script>

<style scoped>
.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--bs-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.vendor-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
.vendor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
