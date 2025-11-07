<template>
  <div class="d-flex min-vh-100">
    <!-- Created vendor sidebar with Bootstrap -->
    <aside class="bg-dark text-white" style="width: 250px;">
      <div class="p-4">
        <h4 class="mb-4">Panel Vendor</h4>
        <nav class="nav flex-column">
          <router-link to="/vendor/dashboard" class="nav-link text-white">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </router-link>
          <router-link to="/vendor/products" class="nav-link text-white">
            <i class="bi bi-box-seam me-2"></i>
            Productos
          </router-link>
          <router-link to="/vendor/orders" class="nav-link text-white">
            <i class="bi bi-receipt me-2"></i>
            Pedidos
          </router-link>
        </nav>
      </div>
      
      <div class="mt-auto p-4 border-top border-secondary">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-person-circle fs-4"></i>
          <div class="small">
            <div class="fw-bold">{{ authStore.user?.nombre }}</div>
            <div class="text-muted">Vendor</div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

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
