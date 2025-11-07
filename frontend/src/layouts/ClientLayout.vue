<template>
  <div class="min-vh-100 bg-light">
    <!-- Converted to Bootstrap navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div class="container">
        <router-link to="/" class="navbar-brand text-primary">
          Rappi Clone
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/vendors" class="nav-link">Restaurantes</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/orders" class="nav-link">Mis Pedidos</router-link>
            </li>
          </ul>
          
          <div class="d-flex align-items-center gap-3">
            <router-link to="/cart" class="btn btn-link position-relative">
              <i class="bi bi-cart3 fs-4"></i>
              <span v-if="cartStore.itemCount > 0" class="badge bg-primary badge-cart">
                {{ cartStore.itemCount }}
              </span>
            </router-link>
            
            <span class="text-muted small">{{ authStore.user?.nombre }}</span>
            <button @click="handleLogout" class="btn btn-link text-primary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
