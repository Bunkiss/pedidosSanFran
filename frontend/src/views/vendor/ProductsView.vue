<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Mis Productos</h2>
      <button class="btn btn-primary" @click="openProductModal()">
        <i class="bi bi-plus-lg"></i> Agregar Producto
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else-if="products.length > 0" class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <img 
                    :src="product.imagen || 'https://via.placeholder.com/50'" 
                    class="rounded"
                    style="width: 50px; height: 50px; object-fit: cover;"
                    :alt="product.nombre"
                  >
                </td>
                <td>{{ product.nombre }}</td>
                <td>{{ product.descripcion }}</td>
                <td class="fw-bold text-success">${{ product.precio }}</td>
                <td>{{ product.categoria }}</td>
                <td>
                  <span class="badge" :class="product.estado === 1 ? 'bg-success' : 'bg-danger'">
                    {{ product.estado === 1 ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="openProductModal(product)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteProduct(product.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="bi bi-box-seam fs-1 text-muted mb-3"></i>
      <h4 class="text-muted">No tienes productos</h4>
      <p class="text-muted">Agrega tu primer producto para empezar a vender</p>
      <button class="btn btn-primary" @click="openProductModal()">
        <i class="bi bi-plus-lg"></i> Agregar Producto
      </button>
    </div>

    <!-- Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingProduct ? 'Editar' : 'Agregar' }} Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="productForm.nombre"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="productForm.descripcion"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input 
                  type="number" 
                  step="0.01"
                  class="form-control" 
                  v-model="productForm.precio"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="productForm.categoria"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">URL de Imagen</label>
                <input 
                  type="url" 
                  class="form-control" 
                  v-model="productForm.imagen"
                >
              </div>
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="disponible"
                  v-model="productForm.disponible"
                >
                <label class="form-check-label" for="disponible">
                  Disponible
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="saveProduct"
              :disabled="saving"
            >
              <span v-if="saving">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Guardando...
              </span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { productAPI } from '@/helpers/api'
import { Modal } from 'bootstrap'

const authStore = useAuthStore()
const products = ref([])
const loading = ref(false)
const saving = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  categoria: '',
  imagen: '',
  disponible: true
})

let modalInstance = null

const fetchProducts = async () => {
  loading.value = true;
  try {
    const vendorId = authStore.user?.vendorId;
    if (!vendorId) {
      console.warn("⚠️ No hay vendorId definido, se omite fetchProducts");
      return;
    }

    console.log("🔹 Obteniendo productos del vendor:", vendorId);
    const response = await productAPI.getByVendor(vendorId);
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

const openProductModal = (product = null) => {
  editingProduct.value = product;
  
  if (product) {
    productForm.value = { 
      ...product,
      disponible: product.estado === 1
    };
  } else {
    productForm.value = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      imagen: '',
      disponible: true
    };
  }
  
  const modalEl = document.getElementById('productModal')
  modalInstance = new Modal(modalEl)
  modalInstance.show()
}

const saveProduct = async () => {
  saving.value = true;
  try {
    console.log("🧩 authStore.user:", authStore.user);

    // 🔄 Mapeo disponible ↔ estado
    const data = {
      ...productForm.value,
      estado: productForm.value.disponible ? 1 : 0,
      vendorId: authStore.user.vendorId || 6
    };
    delete data.disponible; // quitar campo extra

    if (editingProduct.value) {
      await productAPI.update(editingProduct.value.id, data);
    } else {
      await productAPI.create(data);
    }

    console.log('🔹 vendorId enviado:', authStore.user?.vendorId);
    await fetchProducts();
    modalInstance.hide();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error al guardar el producto');
  } finally {
    saving.value = false;
  }
};

const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  
  try {
    await productAPI.delete(id);
    await fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error al eliminar el producto');
  }
};

onMounted(async () => {
  while (!authStore.user || !authStore.user.vendorId) {
    console.log('⏳ Esperando que se cargue el usuario con vendorId...');
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('✅ Usuario listo:', authStore.user);
  await fetchProducts();
});
</script>
