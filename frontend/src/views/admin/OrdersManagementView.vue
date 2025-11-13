<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestión de Pedidos</h1>

    <div class="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por ID o cliente..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          v-model="filters.estado"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="en_preparacion">En Preparación</option>
          <option value="en_camino">En Camino</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <input
          v-model="filters.fecha"
          type="date"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          @click="loadOrders"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-mono text-gray-900">#{{ order.id.slice(0, 8) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ order.cliente?.nombre }}</p>
                <p class="text-xs text-gray-500">{{ order.cliente?.email }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ order.vendor?.nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ order.driver?.usuario?.nombre || 'Sin asignar' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(order.estado)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ getStatusText(order.estado) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
              ${{ order.total.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewOrderDetails(order)"
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
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/helpers/api'

const orders = ref([])
const filters = ref({
  search: '',
  estado: '',
  fecha: ''
})

const loadOrders = async () => {
  try {
    const response = await adminAPI.getOrders(filters.value)
    orders.value = response.data
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    en_preparacion: 'bg-purple-100 text-purple-800',
    en_camino: 'bg-indigo-100 text-indigo-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (estado) => {
  const texts = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    en_camino: 'En Camino',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }
  return texts[estado] || estado
}

const viewOrderDetails = (order) => {
  console.log('View order details:', order)
}

onMounted(() => {
  loadOrders()
})
</script>
