<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`">
            <svg :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="stat.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path v-else-if="stat.icon === 'store'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              <path v-else-if="stat.icon === 'truck'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              <path v-else-if="stat.icon === 'shopping'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span :class="`text-sm font-medium ${stat.changeColor}`">
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</h3>
        <p class="text-sm text-gray-600">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h2>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(value, index) in revenueData"
            :key="index"
            class="flex-1 bg-orange-500 rounded-t-lg hover:bg-orange-600 transition-colors cursor-pointer"
            :style="{ height: `${(value / Math.max(...revenueData)) * 100}%` }"
            :title="`$${value.toLocaleString()}`"
          ></div>
        </div>
        <div class="flex justify-between mt-4 text-xs text-gray-600">
          <span v-for="month in months" :key="month">{{ month }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Pedidos por Estado</h2>
        <div class="space-y-4">
          <div
            v-for="status in ordersByStatus"
            :key="status.label"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3 flex-1">
              <div :class="`w-3 h-3 rounded-full ${status.color}`"></div>
              <span class="text-sm text-gray-700">{{ status.label }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                <div
                  :class="`h-full ${status.color}`"
                  :style="{ width: `${status.percentage}%` }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-900 w-12 text-right">
                {{ status.count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div :class="`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`">
              <svg :class="`w-5 h-5 ${activity.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/helpers/api'

const stats = ref([
  {
    label: 'Total Usuarios',
    value: '0',
    change: '+12%',
    changeColor: 'text-green-600',
    icon: 'users',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    label: 'Vendors Activos',
    value: '0',
    change: '+8%',
    changeColor: 'text-green-600',
    icon: 'store',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    label: 'Drivers Activos',
    value: '0',
    change: '+5%',
    changeColor: 'text-green-600',
    icon: 'truck',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    label: 'Pedidos Hoy',
    value: '0',
    change: '+23%',
    changeColor: 'text-green-600',
    icon: 'shopping',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100'
  }
])

const revenueData = ref([45000, 52000, 48000, 61000, 55000, 67000])
const months = ref(['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'])

const ordersByStatus = ref([
  { label: 'Pendientes', count: 0, percentage: 0, color: 'bg-yellow-500' },
  { label: 'En Preparación', count: 0, percentage: 0, color: 'bg-blue-500' },
  { label: 'En Camino', count: 0, percentage: 0, color: 'bg-purple-500' },
  { label: 'Entregados', count: 0, percentage: 0, color: 'bg-green-500' },
  { label: 'Cancelados', count: 0, percentage: 0, color: 'bg-red-500' }
])

const recentActivity = ref([])

onMounted(async () => {
  try {
    const response = await adminAPI.getStats()
    
    stats.value[0].value = response.data.totalUsers.toString()
    stats.value[1].value = response.data.activeVendors.toString()
    stats.value[2].value = response.data.activeDrivers.toString()
    stats.value[3].value = response.data.todayOrders.toString()

    const totalOrders = response.data.ordersByStatus.reduce((sum, s) => sum + s.count, 0)
    ordersByStatus.value = response.data.ordersByStatus.map(status => ({
      ...status,
      percentage: totalOrders > 0 ? (status.count / totalOrders) * 100 : 0
    }))

    recentActivity.value = response.data.recentActivity
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
})
</script>
