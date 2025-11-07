<!-- biome-ignore lint/correctness/useHookAtTopLevel: Vue 3 Composition API file -->
<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
    <div class="w-100" style="max-width: 500px;">
      <div class="card shadow-lg border-0">
        <div class="card-body p-4 p-md-5">
          <div class="text-center mb-4">
            <h1 class="h2 fw-bold text-primary mb-2">Pedidos Rappi</h1>
            <p class="text-muted">Crea tu cuenta</p>
          </div>

          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="nombre" class="form-label fw-medium">Nombre completo</label>
              <input
                id="nombre"
                v-model="nombre"
                type="text"
                placeholder="Juan Pérez"
                class="form-control"
                :class="{ 'is-invalid': errors.nombre }"
              />
              <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label fw-medium">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
              />
              <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <div class="mb-3">
              <label for="telefono" class="form-label fw-medium">Teléfono</label>
              <input
                id="telefono"
                v-model="telefono"
                type="tel"
                placeholder="+54 11 1234-5678"
                class="form-control"
                :class="{ 'is-invalid': errors.telefono }"
              />
              <div v-if="errors.telefono" class="invalid-feedback">{{ errors.telefono }}</div>
              <small class="form-text text-muted">Opcional. Formato: +54 11 1234-5678</small>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label fw-medium">Contraseña</label>
              <input
                id="password"
                v-model="contraseña"
                type="password"
                placeholder="••••••••"
                class="form-control"
                :class="{ 'is-invalid': errors.contraseña }"
              />
              <div v-if="errors.contraseña" class="invalid-feedback">{{ errors.contraseña }}</div>
            </div>

            <div class="mb-4">
              <label for="rol" class="form-label fw-medium">Tipo de cuenta</label>
              <select
                id="rol"
                v-model="rol"
                class="form-select"
                :class="{ 'is-invalid': errors.rol }"
              >
                <option value="">Selecciona un tipo</option>
                <option value="cliente">Cliente</option>
                <option value="vendor">Vendedor/Restaurante</option>
                <option value="driver">Conductor</option>
              </select>
              <div v-if="errors.rol" class="invalid-feedback">{{ errors.rol }}</div>
            </div>

            <div v-if="authStore.error" class="alert alert-danger" role="alert">
              {{ authStore.error }}
            </div>

            <button
              type="submit"
              :disabled="authStore.loading"
              class="btn btn-primary w-100 py-2"
            >
              <span v-if="authStore.loading">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registrando...
              </span>
              <span v-else>Crear Cuenta</span>
            </button>
          </form>

          <div class="mt-4 text-center">
            <p class="text-muted mb-0">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="text-primary text-decoration-none fw-medium">
                Inicia sesión aquí
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useValidation, registerSchema } from '@/composables/useValidation'

// ✅ Extraemos campos individuales con useField
const { handleSubmit, errors, useField } = useValidation(registerSchema)
const { value: nombre } = useField('nombre')
const { value: email } = useField('email')
const { value: telefono } = useField('telefono')
const { value: contraseña } = useField('contraseña')
const { value: rol } = useField('rol')

const router = useRouter()
const authStore = useAuthStore()

const onSubmit = handleSubmit(async (values) => {
  console.log("🟢 onSubmit ejecutado correctamente")
  console.log("🔹 Valores enviados:", values)

  const result = await authStore.register(values)

  if (result.success) {
    const roleRedirects = {
      cliente: '/',
      vendor: '/vendor/dashboard',
      driver: '/driver/dashboard',
      admin: '/admin/dashboard',
    }
    router.push(roleRedirects[values.rol] || '/')
  } else {
    console.error("❌ Error al registrar:", result.error)
  }
})
</script>
