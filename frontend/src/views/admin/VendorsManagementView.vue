<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Vendors</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Vendors</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Pendientes Aprobación</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar vendors..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4 flex-1">
              <img
                :src="vendor.logo || '/placeholder.svg?height=80&width=80'"
                :alt="vendor.nombre"
                class="w-20 h-20 rounded-lg object-cover"
              />
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ vendor.nombre }}</h3>
                  <span
                    :class="vendor.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ vendor.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ vendor.descripcion }}</p>
                <div class="flex items-center gap-6 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ vendor.direccion }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{{ vendor.telefono }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{{ vendor.rating || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="toggleVendorStatus(vendor)"
                :class="vendor.activo ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {{ vendor.activo ? 'Desactivar' : 'Activar' }}
              </button>
              <button
                @click="viewVendorDetails(vendor)"
                class="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminAPI } from '@/helpers/api'

const vendors = ref([])
const searchQuery = ref('')
const stats = ref({
  total: 0,
  active: 0,
  pending: 0
})

const filteredVendors = computed(() => {
  if (!searchQuery.value) return vendors.value
  
  const query = searchQuery.value.toLowerCase()
  return vendors.value.filter(vendor =>
    vendor.nombre.toLowerCase().includes(query) ||
    vendor.descripcion.toLowerCase().includes(query)
  )
})

const loadVendors = async () => {
  try {
    const response = await adminAPI.getVendors()
    vendors.value = response.data
    
    stats.value = {
      total: vendors.value.length,
      active: vendors.value.filter(v => v.activo).length,
      pending: vendors.value.filter(v => !v.activo).length
    }
  } catch (error) {
    console.error('Error loading vendors:', error)
  }
}

const toggleVendorStatus = async (vendor) => {
  try {
    await adminAPI.updateVendor(vendor.id, { activo: !vendor.activo })
    loadVendors()
  } catch (error) {
    console.error('Error updating vendor:', error)
  }
}

const viewVendorDetails = (vendor) => {
  console.log('View vendor details:', vendor)
}

onMounted(() => {
  loadVendors()
})
</script>
