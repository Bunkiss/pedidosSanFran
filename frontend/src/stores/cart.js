import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useCartStore = defineStore("cart", () => {
  // 📦 STATE
  const items = ref([])
  const vendor = ref(null)
  const deliveryFee = ref(200) // 💰 costo de envío
  const tip = ref(0) // 💸 propina

  // 💡 GETTERS
  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.cantidad, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.precio * item.cantidad, 0)
  )

  const total = computed(() => subtotal.value + deliveryFee.value + tip.value)

  const isEmpty = computed(() => items.value.length === 0)

  // 🧩 ACTIONS
  const addItem = (product, quantity = 1) => {
    // ⚠️ Evitar mezclar vendors
    if (vendor.value && vendor.value.id !== product.vendorId) {
      if (
        !confirm(
          "Tu carrito tiene productos de otro restaurante. ¿Deseas vaciarlo?"
        )
      ) {
        return false
      }
      clearCart()
    }

    // Establecer vendor si es el primero
    if (!vendor.value) {
      vendor.value = {
        id: product.vendorId,
        nombre: product.vendorNombre,
      }
    }

    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.cantidad += quantity
    } else {
      items.value.push({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: Number(product.precio),
        imagen: product.imagen,
        cantidad: quantity,
        vendorId: product.vendorId,
        vendorNombre: product.vendorNombre,
      })
    }

    persist()
    return true
  }

  const removeItem = (productId) => {
    items.value = items.value.filter((i) => i.id !== productId)
    if (items.value.length === 0) vendor.value = null
    persist()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (quantity <= 0) removeItem(productId)
    else {
      item.cantidad = quantity
      persist()
    }
  }

  // 🔼 Incrementar / 🔽 Decrementar
  const incrementItem = (productId) => {
    const item = items.value.find((i) => i.id === productId)
    if (item) {
      item.cantidad++
      persist()
    }
  }

  const decrementItem = (productId) => {
    const item = items.value.find((i) => i.id === productId)
    if (item) {
      item.cantidad--
      if (item.cantidad <= 0) removeItem(productId)
      else persist()
    }
  }

  const clearCart = () => {
    items.value = []
    vendor.value = null
    tip.value = 0
    persist()
  }

  // 💸 Propina
  const setTip = (amount) => {
    tip.value = amount
    persist()
  }

  // 💾 Persistencia
  const persist = () => {
    localStorage.setItem(
      "cart",
      JSON.stringify({
        items: items.value,
        vendor: vendor.value,
        tip: tip.value,
      })
    )
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      const data = JSON.parse(saved)
      items.value = data.items || []
      vendor.value = data.vendor || null
      tip.value = data.tip || 0
    }
  }

  // 🧭 Retorno
  return {
    items,
    vendor,
    itemCount,
    subtotal,
    total,
    deliveryFee,
    tip,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    setTip,
    loadFromLocalStorage,
  }
})
