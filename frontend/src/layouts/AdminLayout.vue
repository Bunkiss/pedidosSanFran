<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-white border-r border-gray-200 fixed h-full">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-orange-600">Admin Panel</h1>
      </div>
      
      <nav class="p-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="item.icon === 'dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            <path v-else-if="item.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <path v-else-if="item.icon === 'store'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            <path v-else-if="item.icon === 'truck'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            <path v-else-if="item.icon === 'shopping'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64">
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'AdminLayout',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const menuItems = [
      {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: 'dashboard'
      },
      {
        path: '/admin/users',
        label: 'Usuarios',
        icon: 'users'
      },
      {
        path: '/admin/vendors',
        label: 'Vendors',
        icon: 'store'
      },
      {
        path: '/admin/drivers',
        label: 'Drivers',
        icon: 'truck'
      },
      {
        path: '/admin/orders',
        label: 'Pedidos',
        icon: 'shopping'
      }
    ]

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    return {
      menuItems,
      handleLogout
    }
  }
})
</script>
