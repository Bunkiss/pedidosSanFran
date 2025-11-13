# Rappi Clone Frontend

Aplicación frontend tipo Rappi construida con Vue 3, Pinia, Vue Router, VeeValidate y Axios.

## Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **Pinia** - State management
- **Vue Router** - Enrutamiento
- **VeeValidate + Zod** - Validación de formularios
- **Axios** - Cliente HTTP
- **Tailwind CSS v4** - Estilos
- **Vite** - Build tool
- **Lucide Vue** - Iconos

## Estructura del Proyecto

\`\`\`
src/
├── assets/
│   └── styles/
│       └── main.css          # Estilos globales y tema
├── composables/
│   └── useValidation.js      # Composable para validaciones
├── helpers/
│   └── api.js                # Configuración de Axios y funciones API
├── layouts/
│   ├── AdminLayout.vue       # Layout para admin
│   ├── ClientLayout.vue      # Layout para clientes
│   ├── DriverLayout.vue      # Layout para conductores
│   └── VendorLayout.vue      # Layout para vendedores
├── stores/
│   ├── auth.js               # Store de autenticación
│   └── cart.js               # Store del carrito
├── views/
│   ├── admin/                # Vistas de administrador
│   ├── client/               # Vistas de cliente
│   ├── driver/               # Vistas de conductor
│   ├── vendor/               # Vistas de vendedor
│   ├── LoginView.vue         # Vista de login
│   └── RegisterView.vue      # Vista de registro
├── router/
│   └── index.js              # Configuración de rutas
├── App.vue                   # Componente raíz
└── main.js                   # Punto de entrada
\`\`\`

## Configuración

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

\`\`\`env
VITE_API_URL=http://localhost:4000/api
\`\`\`

### 3. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

### 4. Build para producción

\`\`\`bash
npm run build
\`\`\`

## Roles de Usuario

La aplicación soporta 4 tipos de roles:

1. **Cliente** - Puede buscar restaurantes, hacer pedidos y ver su historial
2. **Vendor** - Puede gestionar productos y pedidos de su restaurante
3. **Driver** - Puede ver pedidos disponibles, aceptarlos y completarlos
4. **Admin** - Puede gestionar usuarios, vendedores, conductores y ver estadísticas

## Características

### Autenticación
- Login y registro con validación
- Manejo de tokens JWT
- Guards de navegación basados en roles
- Persistencia de sesión en localStorage

### Cliente
- Búsqueda de restaurantes
- Navegación por categorías
- Carrito de compras
- Checkout con múltiples métodos de pago
- Seguimiento de pedidos en tiempo real
- Historial de pedidos

### Vendor
- Dashboard con estadísticas
- Gestión de productos (CRUD)
- Gestión de pedidos
- Actualización de estado de pedidos

### Driver
- Dashboard con pedidos disponibles
- Aceptar pedidos
- Gestión de vehículos
- Completar entregas

### Admin
- Dashboard con estadísticas generales
- Gestión de usuarios
- Gestión de vendedores
- Gestión de conductores
- Vista general de todos los pedidos

## API Endpoints

El frontend se conecta a los siguientes endpoints:

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login
- `GET /auth/profile` - Obtener perfil
- `GET /vendors` - Listar vendedores
- `GET /vendors/:id` - Detalle de vendedor
- `GET /products` - Listar productos
- `POST /orders` - Crear pedido
- `GET /orders` - Listar pedidos
- Y más...

## Validaciones

Las validaciones se manejan con VeeValidate y Zod:

\`\`\`javascript
import { useValidation, loginSchema } from '@/composables/useValidation'

const { handleSubmit, errors, useField } = useValidation(loginSchema)
\`\`\`

## State Management

### Auth Store
\`\`\`javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
authStore.login({ email, contraseña })
\`\`\`

### Cart Store
\`\`\`javascript
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
cartStore.addItem(product, quantity)
\`\`\`

## Desarrollo

### Agregar una nueva vista

1. Crear el archivo en `src/views/[role]/`
2. Agregar la ruta en `src/router/index.js`
3. Configurar el meta con `requiresAuth` y `role`

### Agregar un nuevo endpoint API

1. Abrir `src/helpers/api.js`
2. Agregar la función en el objeto correspondiente (authAPI, vendorsAPI, etc.)

## Notas

- El proyecto usa Tailwind CSS v4 con variables CSS personalizadas
- Los tokens JWT se almacenan en localStorage
- El carrito se persiste en localStorage
- Las rutas están protegidas con navigation guards basados en roles
