<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[--color-primary] to-[--color-secondary] p-4">
    <div class="w-full max-w-md">
      <div class="card">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[--color-primary] mb-2">Pedidos Rappi</h1>
          <p class="text-[--color-text-secondary]">Inicia sesión en tu cuenta</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="input-field"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="contraseña" class="block text-sm font-medium mb-2">Contraseña</label>
            <input
              id="contraseña"
              v-model="contraseña"
              type="password"
              placeholder="••••••••"
              class="input-field"
              :class="{ 'border-red-500': errors.contraseña }"
            />
            <p v-if="errors.contraseña" class="text-red-500 text-sm mt-1">{{ errors.contraseña }}</p>
          </div>

          <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-[--color-text-secondary]">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-[--color-primary] font-medium hover:underline">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useValidation, loginSchema } from '@/composables/useValidation'

const router = useRouter()
const authStore = useAuthStore()

const { handleSubmit, errors, useField } = useValidation(loginSchema)
const { value: email } = useField('email')
const { value: contraseña } = useField('contraseña')

const onSubmit = handleSubmit(async (values) => {
  console.log('🟢 Enviando login con:', values)

  const result = await authStore.login(values)
  console.log('🔹 Resultado del login:', result)

  if (result.success) {
    const redirects = {
      cliente: '/',
      vendor: '/vendor/dashboard',
      driver: '/driver/dashboard',
      admin: '/admin/dashboard',
    }
    router.push(redirects[authStore.user?.rol] || '/')
  } else {
    console.error('❌ Error de login:', result.error)
  }
})
</script>
