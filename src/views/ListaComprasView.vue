<!-- src/views/ListaComprasView.vue -->
<template>
  <div class="lista-compras-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <!-- Contenido de la lista de compras -->
          <div class="lista-compras-view">
            <!-- Header de la lista -->
            <div class="lista-header">
              <div class="header-left">
                <div class="header-icon-container">
                  <span class="iconify" data-icon="mdi:cart"></span>
                </div>
                <div>
                  <h1 class="lista-title">Lista de Compras</h1>
                  <p class="lista-subtitle">{{ checkedCount }} de {{ totalCount }} completados</p>
                </div>
              </div>
            </div>

            <!-- Barra de progreso -->
            <div v-if="totalCount > 0" class="progress-card">
              <div class="progress-header">
                <span class="progress-label">Progreso</span>
                <span class="progress-percentage">{{ Math.round(progress) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Grid principal -->
            <div class="compras-grid">
              <!-- Lista de compras -->
              <div class="shopping-list-section">
                <div v-if="Object.keys(groupedItems).length > 0" class="categories-container">
                  <div v-for="(items, category) in groupedItems" :key="category" class="category-card">
                    <h3 class="category-title">{{ category }}</h3>
                    <div class="items-list">
                      <div v-for="item in items" :key="item.id" class="item-card">
                        <label class="item-checkbox">
                          <input 
                            type="checkbox" 
                            :checked="item.checked"
                            @change="toggleShoppingItem(item.id)"
                            class="checkbox-input"
                          >
                          <span class="checkmark"></span>
                        </label>
                        <div class="item-info">
                          <p :class="['item-name', { 'checked': item.checked }]">
                            {{ item.name }}
                          </p>
                          <p class="item-quantity">{{ item.quantity }}</p>
                        </div>
                        <button 
                          class="delete-btn"
                          @click="removeFromShoppingList(item.id)"
                        >
                          <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-state">
                  <div class="empty-icon">
                    <span class="iconify" data-icon="mdi:cart-outline"></span>
                  </div>
                  <h3 class="empty-title">Tu lista está vacía</h3>
                  <p class="empty-description">
                    Comienza agregando productos que necesitas comprar
                  </p>
                  <button 
                    class="empty-action-btn"
                    @click="openAddItemModal"
                  >
                    Agregar productos
                  </button>
                </div>
              </div>

              <!-- Panel lateral para agregar artículos -->
              <div class="add-item-section">
                <div class="add-item-card">
                  <h3 class="add-item-title">Agregar artículo</h3>
                  <button 
                    class="search-btn"
                    @click="openAddItemModal"
                  >
                    Buscar productos
                  </button>
                  <p class="add-item-hint">
                    Usa el buscador visual para agregar productos a tu lista
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal para agregar productos -->
            <div v-if="showAddItemModal" class="add-item-modal-overlay" @click="closeAddItemModal">
              <div class="add-item-modal" @click.stop>
                <div class="modal-header">
                  <h3 class="modal-title">Buscar productos</h3>
                  <p class="modal-description">Agrega productos a tu lista de compras</p>
                  <button class="modal-close" @click="closeAddItemModal">
                    <span class="iconify" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="search-container">
                  <div class="search-input-wrapper">
                    <span class="iconify search-icon" data-icon="mdi:magnify"></span>
                    <input 
                      type="text" 
                      v-model="searchQuery"
                      placeholder="Buscar productos..."
                      class="search-input"
                      @input="filterProducts"
                    >
                  </div>
                </div>

                <div class="products-scroll-container">
                  <div class="categories-tabs">
                    <button 
                      v-for="category in productCategories" 
                      :key="category.key"
                      :class="['category-tab', { 'active': activeCategory === category.key }]"
                      @click="setActiveCategory(category.key)"
                    >
                      {{ category.name }}
                    </button>
                  </div>

                  <div class="products-grid">
                    <div 
                      v-for="product in filteredProducts" 
                      :key="product.id"
                      class="product-card"
                      @click="addProductToList(product)"
                    >
                      <div class="product-image">
                        <img :src="product.image" :alt="product.name" @error="handleImageError">
                        <div class="product-category">{{ product.category }}</div>
                      </div>
                      <div class="product-info">
                        <h4>{{ product.name }}</h4>
                        <p class="product-price">{{ product.price }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'ListaComprasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)

    // Datos de ejemplo para la lista de compras
    const shoppingList = ref([
      { id: '1', name: 'Tomate', category: 'Verduras', quantity: '5 unidades', checked: false },
      { id: '2', name: 'Cebolla', category: 'Verduras', quantity: '3 unidades', checked: true },
      { id: '3', name: 'Pollo', category: 'Carnes', quantity: '500 g', checked: false },
      { id: '4', name: 'Arroz', category: 'Granos', quantity: '1 kg', checked: false },
      { id: '5', name: 'Leche', category: 'Lácteos', quantity: '1 litro', checked: true },
      { id: '6', name: 'Huevos', category: 'Lácteos', quantity: '12 unidades', checked: false },
      { id: '7', name: 'Manzanas', category: 'Frutas', quantity: '6 unidades', checked: false },
      { id: '8', name: 'Pan integral', category: 'Panadería', quantity: '1 unidad', checked: true }
    ])

    // Datos de ejemplo para productos
    const allProducts = ref([
      { id: 'p1', name: 'Tomate', category: 'Verduras', price: '$2.99/kg', image: 'https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p2', name: 'Cebolla', category: 'Verduras', price: '$1.49/kg', image: 'https://images.unsplash.com/photo-1597937081593-0ddc5f66deb0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p3', name: 'Pollo', category: 'Carnes', price: '$6.99/kg', image: 'https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p4', name: 'Arroz', category: 'Granos', price: '$3.49/kg', image: 'https://images.unsplash.com/photo-1651793371427-ad065df0d208?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p5', name: 'Leche', category: 'Lácteos', price: '$1.29/litro', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p6', name: 'Huevos', category: 'Lácteos', price: '$3.99/docena', image: 'https://images.unsplash.com/photo-1566489564591-4d4c09ea90b7?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p7', name: 'Manzanas', category: 'Frutas', price: '$4.99/kg', image: 'https://images.unsplash.com/photo-1570913199992-91d07c140e7a?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p8', name: 'Plátanos', category: 'Frutas', price: '$2.49/kg', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p9', name: 'Pan integral', category: 'Panadería', price: '$2.99/unidad', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p10', name: 'Aceite de oliva', category: 'Aceites', price: '$8.99/litro', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p11', name: 'Pasta', category: 'Granos', price: '$2.29/500g', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 'p12', name: 'Queso', category: 'Lácteos', price: '$5.99/250g', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' }
    ])

    const productCategories = [
      { key: 'all', name: 'Todos' },
      { key: 'Verduras', name: 'Verduras' },
      { key: 'Frutas', name: 'Frutas' },
      { key: 'Carnes', name: 'Carnes' },
      { key: 'Lácteos', name: 'Lácteos' },
      { key: 'Granos', name: 'Granos' },
      { key: 'Panadería', name: 'Panadería' },
      { key: 'Aceites', name: 'Aceites' }
    ]

    const showAddItemModal = ref(false)
    const searchQuery = ref('')
    const activeCategory = ref('all')
    const filteredProducts = ref([...allProducts.value])

    // Layout functions
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    // Shopping list functions
    const addToShoppingList = (item) => {
      shoppingList.value.push({
        ...item,
        id: `${Date.now()}`,
        checked: false
      })
    }

    const removeFromShoppingList = (id) => {
      shoppingList.value = shoppingList.value.filter(item => item.id !== id)
    }

    const toggleShoppingItem = (id) => {
      const item = shoppingList.value.find(item => item.id === id)
      if (item) {
        item.checked = !item.checked
      }
    }

    // Computed properties
    const checkedCount = computed(() => {
      return shoppingList.value.filter(item => item.checked).length
    })

    const totalCount = computed(() => {
      return shoppingList.value.length
    })

    const progress = computed(() => {
      return totalCount.value > 0 ? (checkedCount.value / totalCount.value) * 100 : 0
    })

    const groupedItems = computed(() => {
      const groups = {}
      shoppingList.value.forEach(item => {
        if (!groups[item.category]) {
          groups[item.category] = []
        }
        groups[item.category].push(item)
      })
      return groups
    })

    // Modal functions
    const openAddItemModal = () => {
      showAddItemModal.value = true
      searchQuery.value = ''
      activeCategory.value = 'all'
      filteredProducts.value = [...allProducts.value]
    }

    const closeAddItemModal = () => {
      showAddItemModal.value = false
    }

    const setActiveCategory = (category) => {
      activeCategory.value = category
      filterProducts()
    }

    const filterProducts = () => {
      let filtered = [...allProducts.value]

      // Filtrar por categoría
      if (activeCategory.value !== 'all') {
        filtered = filtered.filter(product => product.category === activeCategory.value)
      }

      // Filtrar por búsqueda
      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      filteredProducts.value = filtered
    }

    const addProductToList = (product) => {
      // Verificar si el producto ya está en la lista
      const exists = shoppingList.value.some(item => 
        item.name.toLowerCase() === product.name.toLowerCase()
      )

      if (!exists) {
        addToShoppingList({
          name: product.name,
          category: product.category,
          quantity: '1 unidad',
          checked: false
        })
        
        // Mostrar feedback visual (aquí podrías usar un toast)
        closeAddItemModal()
      } else {
        // Producto ya existe en la lista
        alert(`${product.name} ya está en tu lista de compras`)
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      shoppingList,
      checkedCount,
      totalCount,
      progress,
      groupedItems,
      showAddItemModal,
      searchQuery,
      activeCategory,
      filteredProducts,
      productCategories,
      addToShoppingList,
      removeFromShoppingList,
      toggleShoppingItem,
      openAddItemModal,
      closeAddItemModal,
      setActiveCategory,
      filterProducts,
      addProductToList,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que HomeView y PlanificadorView */
.lista-compras-container {
  min-height: 100vh;
  background-color: var(--background);
}

.sidebar-fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  z-index: 1000;
  background-color: var(--card);
  border-right: 1px solid var(--border);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 70px;
  z-index: 900;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: left 0.3s ease-in-out;
}

.main-content-wrapper {
  margin-left: 260px;
  min-height: 100vh;
  background-color: var(--background);
  transition: margin-left 0.3s ease;
}

.content-main {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  overflow-y: auto;
  background-color: var(--background);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* Header de la lista */
.lista-header {
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon-container .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.lista-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.lista-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Barra de progreso */
.progress-card {
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: var(--foreground);
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgba(168, 213, 186, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Grid principal */
.compras-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* Lista de compras */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.item-card:hover {
  background-color: rgba(168, 213, 186, 0.3);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Checkbox personalizado */
.item-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  background-color: white;
  border: 2px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-input:checked ~ .checkmark {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkbox-input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 2px;
  transition: all 0.2s;
}

.item-name.checked {
  text-decoration: line-through;
  color: var(--muted-foreground);
}

.item-quantity {
  font-size: 12px;
  color: var(--muted-foreground);
}

.delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(212, 24, 61, 0.2);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--muted-foreground);
}

.delete-btn:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
  color: var(--destructive);
}

.delete-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Estado vacío */
.empty-state {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 48px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: var(--muted-foreground);
}

.empty-icon .iconify {
  width: 64px;
  height: 64px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-action-btn {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 162, 113, 0.2);
}

/* Panel lateral para agregar artículos */
.add-item-section {
  position: sticky;
  top: 90px;
  height: fit-content;
}

.add-item-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.add-item-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 20px;
}

.search-btn {
  width: 100%;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.search-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 162, 113, 0.2);
}

.add-item-hint {
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
  line-height: 1.5;
}

/* Modal para agregar productos */
.add-item-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.add-item-modal {
  background-color: var(--card);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  position: relative;
  background-color: var(--card);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.modal-description {
  font-size: 14px;
  color: var(--muted-foreground);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted-foreground);
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--muted);
}

.modal-close .iconify {
  width: 20px;
  height: 20px;
}

/* Buscador del modal */
.search-container {
  padding: 20px 24px 0;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

/* Lista de productos */
.products-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
}

.categories-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-tab.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.product-card {
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.product-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-category {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.product-info {
  padding: 12px;
}

.product-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
}

.product-price {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .compras-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .add-item-section {
    position: static;
  }
}

@media (max-width: 768px) {
  /* Layout responsive igual que otras vistas */
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s ease;
  }
  
  .mobile-menu-open .sidebar-fixed {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }
  
  .header-fixed {
    left: 0;
    right: 0;
  }
  
  .main-content-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .content-container {
    padding: 16px;
  }
  
  /* Responsive específico */
  .lista-title {
    font-size: 20px;
  }
  
  .header-icon-container {
    width: 40px;
    height: 40px;
  }
  
  .header-icon-container .iconify {
    width: 20px;
    height: 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .category-card {
    padding: 16px;
  }
  
  .add-item-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-tabs {
    justify-content: center;
  }
  
  .category-tab {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .item-card {
    padding: 10px;
    gap: 10px;
  }
}
</style>