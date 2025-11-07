<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Drivers</h1>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Drivers</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">En Línea</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.online }}</p>
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
            <p class="text-sm text-gray-600 mb-1">En Entrega</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.delivering }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Disponibles</p>
            <p class="text-2xl font-bold text-purple-600">{{ stats.available }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Drivers List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar drivers..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="online">En Línea</option>
            <option value="delivering">En Entrega</option>
            <option value="offline">Fuera de Línea</option>
          </select>
        </div>
      </div>

      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregas Hoy</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="driver in filteredDrivers" :key="driver.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span class="text-orange-600 font-semibold">
                      {{ driver.usuario?.nombre?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div
                    :class="driver.enLinea ? 'bg-green-500' : 'bg-gray-400'"
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ driver.usuario?.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ driver.usuario?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusBadgeClass(driver)"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ getStatusText(driver) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ driver.vehiculo?.marca }} {{ driver.vehiculo?.modelo }}
              <span class="text-gray-400">• {{ driver.vehiculo?.placa }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              {{ driver.deliveriesToday || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium text-gray-900">{{ driver.rating || 'N/A' }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ driver.telefono }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewDriverDetails(driver)"
                class="text-orange-600 hover:text-orange-900"
              >
                Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminAPI } from '@/helpers/api'

const drivers = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const stats = ref({
  total: 0,
  online: 0,
  delivering: 0,
  available: 0
})

const filteredDrivers = computed(() => {
  let filtered = drivers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(driver =>
      driver.usuario?.nombre?.toLowerCase().includes(query) ||
      driver.usuario?.email?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(driver => {
      if (statusFilter.value === 'online') return driver.enLinea && !driver.enEntrega
      if (statusFilter.value === 'delivering') return driver.enEntrega
      if (statusFilter.value === 'offline') return !driver.enLinea
      return true
    })
  }

  return filtered
})

const loadDrivers = async () => {
  try {
    const response = await adminAPI.getDrivers()
    drivers.value = response.data
    
    stats.value = {
      total: drivers.value.length,
      online: drivers.value.filter(d => d.enLinea).length,
      delivering: drivers.value.filter(d => d.enEntrega).length,
      available: drivers.value.filter(d => d.enLinea && !d.enEntrega).length
    }
  } catch (error) {
    console.error('Error loading drivers:', error)
  }
}

const getStatusBadgeClass = (driver) => {
  if (driver.enEntrega) return 'bg-blue-100 text-blue-800'
  if (driver.enLinea) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

const getStatusText = (driver) => {
  if (driver.enEntrega) return 'En Entrega'
  if (driver.enLinea) return 'Disponible'
  return 'Fuera de Línea'
}

const viewDriverDetails = (driver) => {
  console.log('View driver details:', driver)
}

onMounted(() => {
  loadDrivers()
})
</script>
