<template>
  <div class="d-flex min-vh-100">
    <aside class="bg-dark text-white" style="width: 250px;">
      <div class="p-4">
        <h4 class="mb-4">Panel Driver</h4>
        
        <div class="mb-4">
          <div class="form-check form-switch">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="activeSwitch"
              v-model="isActive"
              @change="toggleActive"
            >
            <label class="form-check-label" for="activeSwitch">
              {{ isActive ? 'Activo' : 'Inactivo' }}
            </label>
          </div>
        </div>
        
        <nav class="nav flex-column">
          <router-link to="/driver/dashboard" class="nav-link text-white">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </router-link>
          <router-link to="/driver/orders" class="nav-link text-white">
            <i class="bi bi-truck me-2"></i>
            Entregas
          </router-link>
          <router-link to="/driver/vehicles" class="nav-link text-white">
            <i class="bi bi-car-front me-2"></i>
            Vehículos
          </router-link>
        </nav>
      </div>
      
      <div class="mt-auto p-4 border-top border-secondary">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-person-circle fs-4"></i>
          <div class="small">
            <div class="fw-bold">{{ authStore.user?.nombre }}</div>
            <div class="text-muted">Driver</div>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-outline-light btn-sm w-100">
          <i class="bi bi-box-arrow-right me-2"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <main class="flex-grow-1 bg-light">
      <div class="container-fluid p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isActive = ref(false)

const toggleActive = () => {
  console.log('[v0] Driver status:', isActive.value ? 'Active' : 'Inactive')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: var(--color-primary);
}
</style>
