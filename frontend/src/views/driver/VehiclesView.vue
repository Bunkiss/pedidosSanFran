<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Mis Vehículos</h2>
      <button @click="openCreateModal" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Agregar Vehículo
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando vehículos...</p>
    </div>

    <div v-else-if="vehicles.length === 0" class="text-center py-5">
      <div class="mb-4" style="font-size: 4rem;">🚗</div>
      <h3 class="mb-3">No tienes vehículos registrados</h3>
      <p class="text-muted mb-4">Agrega un vehículo para comenzar a realizar entregas</p>
      <button @click="openCreateModal" class="btn btn-primary">
        Agregar Primer Vehículo
      </button>
    </div>

    <div v-else class="row g-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-start gap-3">
              <div class="bg-light rounded p-3 text-center" style="min-width: 80px;">
                <div style="font-size: 2.5rem;">{{ getVehicleIcon(vehicle.tipo) }}</div>
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title fw-bold mb-1">{{ vehicle.modelo }}</h5>
                <p class="text-muted fw-semibold mb-2">{{ vehicle.placa }}</p>
                <div class="d-flex gap-2 flex-wrap">
                  <span class="badge bg-secondary">{{ getVehicleTypeLabel(vehicle.tipo) }}</span>
                  <span class="badge bg-info">{{ vehicle.color }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <div class="d-flex gap-2 justify-content-end">
              <button 
                @click="openEditModal(vehicle)" 
                class="btn btn-sm btn-outline-primary"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                @click="deleteVehicle(vehicle.id)" 
                class="btn btn-sm btn-outline-danger"
                title="Eliminar"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="showModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0,0,0,0.5);"
      @click="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="saveVehicle">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Tipo de Vehículo *</label>
                <select v-model="vehicleForm.tipo" class="form-select" required>
                  <option value="">Seleccionar...</option>
                  <option value="moto">Motocicleta</option>
                  <option value="auto">Automóvil</option>
                  <option value="bicicleta">Bicicleta</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Modelo *</label>
                <input
                  v-model="vehicleForm.modelo"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Honda CBR 250"
                  required
                />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Placa *</label>
                  <input
                    v-model="vehicleForm.placa"
                    type="text"
                    class="form-control"
                    placeholder="ABC-123"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Color *</label>
                  <input
                    v-model="vehicleForm.color"
                    type="text"
                    class="form-control"
                    placeholder="Ej: Negro"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="saving" class="btn btn-primary">
                {{ saving ? 'Guardando...' : 'Guardar Vehículo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vehiclesAPI, driverAPI } from '@/helpers/api'

const authStore = useAuthStore()
const vehicles = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingVehicle = ref(null)
const saving = ref(false)
const driverId = ref(null)

const vehicleForm = ref({
  tipo: '',
  marca: '',
  modelo: '',
  patente: ''
})

const fetchVehicles = async () => {
  if (!authStore.user?.id) {
    console.warn('⚠️ Usuario aún no disponible, se espera authStore.user...')
    return
  }

  loading.value = true
  try {
    const driverResponse = await driverAPI.getAll()
    console.log('🔍 authStore.user.id:', authStore.user.id)
    console.log('🔍 Drivers desde API:', driverResponse.data)

    const currentDriver = driverResponse.data.find(
      (d) => d.user.id === authStore.user.id
    )

    console.log('✅ currentDriver encontrado:', currentDriver)

    if (currentDriver) {
      driverId.value = currentDriver.id
      const response = await vehiclesAPI.getByDriver(currentDriver.id)
      vehicles.value = response.data
    } else {
      console.warn('⚠️ No se encontró un driver asociado a este usuario.')
    }
  } catch (err) {
    console.error('Error fetching vehicles:', err)
  } finally {
    loading.value = false
  }
}

const saveVehicle = async () => {
  if (!driverId.value) {
    alert('No se pudo determinar el driverId. Asegúrate de tener un perfil de conductor.')
    return
  }

  saving.value = true
  try {
    const vehicleData = { ...vehicleForm.value }

    if (editingVehicle.value) {
      await vehiclesAPI.update(editingVehicle.value.id, vehicleData)
    } else {
      await vehiclesAPI.createForDriver(driverId.value, vehicleData)
    }

    await fetchVehicles()
    closeModal()
  } catch (err) {
    console.error('Error saving vehicle:', err)
    alert('Error al guardar el vehículo')
  } finally {
    saving.value = false
  }
}

const openCreateModal = () => {
  editingVehicle.value = null
  vehicleForm.value = {
    tipo: '',
    marca: '',
    modelo: '',
    patente: ''
  }
  showModal.value = true
}

const openEditModal = (vehicle) => {
  editingVehicle.value = vehicle
  vehicleForm.value = {
    tipo: vehicle.tipo,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    patente: vehicle.patente
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingVehicle.value = null
}

const deleteVehicle = async (vehicleId) => {
  if (!confirm('¿Estás seguro de eliminar este vehículo?')) return

  try {
    await vehiclesAPI.delete(vehicleId)
    await fetchVehicles()
  } catch (err) {
    console.error('Error deleting vehicle:', err)
    alert('Error al eliminar el vehículo')
  }
}

const getVehicleIcon = (tipo) => {
  const icons = {
    moto: '🏍️',
    auto: '🚗',
    bicicleta: '🚲'
  }
  return icons[tipo] || '🚗'
}

const getVehicleTypeLabel = (tipo) => {
  const labels = {
    moto: 'Motocicleta',
    auto: 'Automóvil',
    bicicleta: 'Bicicleta'
  }
  return labels[tipo] || tipo
}

onMounted(() => {
  if (!authStore.user) {
    console.warn('⏳ Esperando a que se cargue el usuario...')
    const unwatch = watch(
      () => authStore.user,
      (newVal) => {
        if (newVal?.id) {
          unwatch()
          fetchVehicles()
        }
      }
    )
  } else {
    fetchVehicles()
  }
})
</script>

<style scoped>
.vehicles-view {
  max-width: 1400px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.loading-container,
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.vehicle-card {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  transition: all 0.2s ease;
}

.vehicle-card:hover {
  box-shadow: var(--shadow-lg);
}

.vehicle-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vehicle-info {
  flex: 1;
}

.vehicle-model {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.vehicle-plate {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
}

.vehicle-meta {
  display: flex;
  gap: var(--spacing-sm);
}

.meta-badge {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
}

.vehicle-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.125rem;
}

.action-btn:hover {
  transform: scale(1.1);
}

.edit-btn:hover {
  background-color: rgba(30, 144, 255, 0.1);
}

.delete-btn:hover {
  background-color: rgba(255, 71, 87, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 2px solid var(--color-border);
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: var(--color-error);
}

.modal-body {
  padding: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(46, 213, 115, 0.1);
}

select.form-input {
  cursor: pointer;
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 2px solid var(--color-border);
}

@media (max-width: 768px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
