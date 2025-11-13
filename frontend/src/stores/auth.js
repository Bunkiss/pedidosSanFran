import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { authAPI } from "@/helpers/api"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || null)
  const isClient = computed(() => userRole.value === "cliente")
  const isVendor = computed(() => userRole.value === "vendor")
  const isDriver = computed(() => userRole.value === "driver")
  const isAdmin = computed(() => userRole.value === "admin")

  const initialize = () => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null

      const response = await authAPI.login(credentials)
      const { token: newToken, user: newUser } = response.data

      token.value = newToken
      user.value = newUser
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      return { success: true }
    } catch (err) {
      console.error("Error en login:", err)
      error.value = err.response?.data?.message || "Error al iniciar sesión"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null

      const response = await authAPI.register(userData)
      const { token: newToken, user: newUser } = response.data

      if (!newUser || !newToken) {
        throw new Error("La API no devolvió usuario o token")
      }

      token.value = newToken
      user.value = newUser

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      return { success: true }
    } catch (err) {
      console.error("Error en register:", err)
      error.value = err.response?.data?.message || "Error al registrarse"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      console.log("Cerrando sesión...")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  const updateProfile = async (data) => {
    try {
      loading.value = true
      error.value = null

      const response = await authAPI.updateProfile(data)
      user.value = response.data
      localStorage.setItem("user", JSON.stringify(response.data))

      return { success: true }
    } catch (err) {
      console.error("Error en updateProfile:", err)
      error.value = err.response?.data?.message || "Error al actualizar perfil"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    isClient,
    isVendor,
    isDriver,
    isAdmin,
    initialize,
    login,
    register,
    logout,
    updateProfile,
  }
})
