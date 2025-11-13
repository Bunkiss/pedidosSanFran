import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

import ClientLayout from "@/layouts/ClientLayout.vue"
import VendorLayout from "@/layouts/VendorLayout.vue"
import DriverLayout from "@/layouts/DriverLayout.vue"
import AdminLayout from "@/layouts/AdminLayout.vue"

import LoginView from "@/views/LoginView.vue"
import RegisterView from "@/views/RegisterView.vue"

import HomeView from "@/views/client/HomeView.vue"
import VendorsView from "@/views/client/VendorsView.vue"
import VendorDetailView from "@/views/client/VendorDetailView.vue"
import CartView from "@/views/client/CartView.vue"
import OrdersView from "@/views/client/OrdersView.vue"
import OrderDetailView from "@/views/client/OrderDetailView.vue"

import VendorDashboardView from "@/views/vendor/DashboardView.vue"
import VendorProductsView from "@/views/vendor/ProductsView.vue"
import VendorOrdersView from "@/views/vendor/OrdersView.vue"

import DriverDashboardView from "@/views/driver/DashboardView.vue"
import DriverOrdersView from "@/views/driver/OrdersView.vue"
import DriverVehiclesView from "@/views/driver/VehiclesView.vue"

import AdminDashboardView from "@/views/admin/DashboardView.vue"
import AdminUsersView from "@/views/admin/UsersView.vue"
import AdminVendorsView from "@/views/admin/VendorsManagementView.vue"
import AdminDriversView from "@/views/admin/DriversManagementView.vue"
import AdminOrdersView from "@/views/admin/OrdersManagementView.vue"

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { requiresGuest: true },
  },

  {
    path: "/",
    component: ClientLayout,
    meta: { requiresAuth: true, role: "cliente" },
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "vendors",
        name: "vendors",
        component: VendorsView,
      },
      {
        path: "vendors/:id",
        name: "vendor-detail",
        component: VendorDetailView,
      },
      {
        path: "cart",
        name: "cart",
        component: CartView,
      },
      {
        path: "orders",
        name: "orders",
        component: OrdersView,
      },
      {
        path: "orders/:id",
        name: "order-detail",
        component: OrderDetailView,
      },
    ],
  },

  {
    path: "/vendor",
    component: VendorLayout,
    meta: { requiresAuth: true, role: "vendor" },
    children: [
      {
        path: "dashboard",
        name: "vendor-dashboard",
        component: VendorDashboardView,
      },
      {
        path: "products",
        name: "vendor-products",
        component: VendorProductsView,
      },
      {
        path: "orders",
        name: "vendor-orders",
        component: VendorOrdersView,
      },
      {
       path: "orders/:id",
      name: "VendorOrderDetails",
       component: () => import("@/views/client/OrderDetailView.vue"),
      meta: { requiresAuth: true, role: "vendor" },
    },
    ],
  },

  {
    path: "/driver",
    component: DriverLayout,
    meta: { requiresAuth: true, role: "driver" },
    children: [
      {
        path: "dashboard",
        name: "driver-dashboard",
        component: DriverDashboardView,
      },
      {
        path: "orders",
        name: "driver-orders",
        component: DriverOrdersView,
      },
      {
        path: "vehicles",
        name: "driver-vehicles",
        component: DriverVehiclesView,
      },
    ],
  },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: AdminDashboardView,
      },
      {
        path: "users",
        name: "admin-users",
        component: AdminUsersView,
      },
      {
        path: "vendors",
        name: "admin-vendors",
        component: AdminVendorsView,
      },
      {
        path: "drivers",
        name: "admin-drivers",
        component: AdminDriversView,
      },
      {
        path: "orders",
        name: "admin-orders",
        component: AdminOrdersView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
  const requiredRole = to.meta.role

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login")
    return
  }

  if (requiresGuest && authStore.isAuthenticated) {
    const roleRedirects = {
      cliente: "/",
      vendor: "/vendor/dashboard",
      driver: "/driver/dashboard",
      admin: "/admin/dashboard",
    }
    next(roleRedirects[authStore.user?.rol] || "/")
    return
  }

  if (requiredRole && authStore.user?.rol !== requiredRole) {
    const roleRedirects = {
      cliente: "/",
      vendor: "/vendor/dashboard",
      driver: "/driver/dashboard",
      admin: "/admin/dashboard",
    }
    next(roleRedirects[authStore.user?.rol] || "/login")
    return
  }

  next()
})

export default router
