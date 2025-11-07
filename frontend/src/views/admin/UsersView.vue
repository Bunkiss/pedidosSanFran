<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          v-model="filters.rol"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Todos los roles</option>
          <option value="cliente">Cliente</option>
          <option value="vendor">Vendor</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
        <select
          v-model="filters.status"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <button
          @click="loadUsers"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span class="text-orange-600 font-semibold">{{ user.nombre.charAt(0).toUpperCase() }}</span>
                </div>
                <span class="font-medium text-gray-900">{{ user.nombre }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getRoleBadgeClass(user.rol)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ user.rol }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ user.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ new Date(user.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openEditModal(user)"
                class="text-orange-600 hover:text-orange-900 mr-4"
              >
                Editar
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              v-model="formData.nombre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              v-model="formData.contraseña"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              v-model="formData.rol"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="cliente">Cliente</option>
              <option value="vendor">Vendor</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="formData.activo"
              type="checkbox"
              id="activo"
              class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label for="activo" class="text-sm font-medium text-gray-700">Usuario Activo</label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {{ editingUser ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/helpers/api'

const users = ref([])
const showModal = ref(false)
const editingUser = ref(null)
const filters = ref({
  search: '',
  rol: '',
  status: ''
})

const formData = ref({
  nombre: '',
  email: '',
  contraseña: '',
  rol: 'cliente',
  activo: true
})

const loadUsers = async () => {
  try {
    const response = await adminAPI.getUsers(filters.value)
    users.value = response.data
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const openCreateModal = () => {
  editingUser.value = null
  formData.value = {
    nombre: '',
    email: '',
    contraseña: '',
    rol: 'cliente',
    activo: true
  }
  showModal.value = true
}

const openEditModal = (user) => {
  editingUser.value = user
  formData.value = {
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const saveUser = async () => {
  try {
    if (editingUser.value) {
      await adminAPI.updateUser(editingUser.value.id, formData.value)
    } else {
      await adminAPI.createUser(formData.value)
    }
    closeModal()
    loadUsers()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await adminAPI.deleteUser(id)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const getRoleBadgeClass = (rol) => {
  const classes = {
    cliente: 'bg-blue-100 text-blue-800',
    vendor: 'bg-purple-100 text-purple-800',
    driver: 'bg-orange-100 text-orange-800',
    admin: 'bg-red-100 text-red-800'
  }
  return classes[rol] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadUsers()
})
</script>
