<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen" 
      @close="closeMobileMenu" 
      class="fixed left-0 top-0 w-65 h-screen z-1000 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="{ '-translate-x-full': !isMobileMenuOpen, 'translate-x-0': isMobileMenuOpen }"
    />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-gray-50 transition-all duration-300 md:ml-65">
      <Header 
        @toggle-mobile-menu="toggleMobileMenu" 
        @logout="handleLogout" 
        class="fixed top-0 right-0 left-0 md:left-65 h-17.5 z-900 bg-white border-b border-gray-200 shadow-sm"
      />

      <!-- Scrollable Content -->
      <main class="pt-17.5 min-h-[calc(100vh-70px)] overflow-y-auto bg-gray-50">
        <div class="max-w-350 mx-auto w-full p-5 md:p-6">
          <!-- Contenido de la lista de compras -->
          <div>
            <!-- Header de la lista -->
            <div class="mb-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:cart"></span>
                </div>
                <div>
                  <h1 class="text-2xl font-semibold text-gray-900 mb-1">Lista de Compras</h1>
                  <p class="text-sm text-gray-500">{{ checkedCount }} de {{ totalCount }} completados</p>
                </div>
              </div>
            </div>

            <!-- Barra de progreso -->
            <div v-if="totalCount > 0" class="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-900">Progreso</span>
                <span class="text-sm font-semibold text-emerald-600">{{ Math.round(progress) }}%</span>
              </div>
              <div class="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Grid principal -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Lista de compras - Ocupa 2 columnas en lg -->
              <div class="lg:col-span-2">
                <div v-if="Object.keys(groupedItems).length > 0" class="space-y-4">
                  <div v-for="(items, category) in groupedItems" :key="category" class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ category }}</h3>
                    <div class="space-y-3">
                      <div v-for="item in items" :key="item.id" 
                        class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-500 hover:-translate-y-px hover:shadow-md border border-transparent">
                        <label class="relative flex items-center cursor-pointer" @click.stop>
                          <input 
                            type="checkbox" 
                            :checked="item.checked"
                            @change="toggleShoppingItem(item.id)"
                            class="absolute opacity-0 cursor-pointer h-0 w-0"
                          >
                          <span v-if="item.checked" class="w-5 h-5 rounded-md transition-all duration-200 flex items-center justify-center bg-emerald-600 border-emerald-600">✓</span>
                          <span v-else class="w-5 h-5 bg-white border-2 border-gray-300 rounded-md transition-all duration-200 flex items-center justify-center">
                          </span>
                        </label>
                        <div class="flex-1 min-w-0" @click="toggleShoppingItem(item.id)">
                          <p :class="['text-sm font-medium text-gray-900 mb-0.5 transition-all duration-200 cursor-pointer', { 'line-through text-gray-400': item.checked }]">
                            {{ item.name }}
                          </p>
                          <p class="text-xs text-gray-500">{{ item.quantity }}</p>
                        </div>
                        <button 
                          class="w-8 h-8 rounded-lg border border-red-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-400 hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                          @click="removeFromShoppingList(item.id)"
                        >
                          <span class="iconify w-4 h-4" data-icon="mdi:trash-can-outline"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                  <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <span class="iconify w-16 h-16" data-icon="mdi:cart-outline"></span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Tu lista está vacía</h3>
                  <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    Comienza agregando productos que necesitas comprar
                  </p>
                  <button 
                    class="bg-emerald-600 text-white border-none px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Agregar productos
                  </button>
                </div>
              </div>

              <!-- Panel lateral para agregar artículos -->
              <div class="lg:sticky lg:top-22.5 h-fit">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-5">Agregar artículo</h3>
                  <button 
                    class="w-full bg-emerald-600 text-white border-none py-4 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 mb-4 hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Buscar productos
                  </button>
                  <p class="text-xs text-gray-500 text-center leading-relaxed">
                    Usa el buscador visual para agregar productos a tu lista
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal para agregar productos -->
            <div v-if="showAddItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-5 backdrop-blur-sm" @click="closeAddItemModal">
              <div class="bg-white rounded-xl w-full max-w-200 max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200" @click.stop>
                <div class="p-6 border-b border-gray-200 relative bg-white">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Buscar productos</h3>
                  <p class="text-sm text-gray-500">Agrega productos a tu lista de compras</p>
                  <button class="absolute top-5 right-5 w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-gray-400 transition-all duration-200 hover:bg-gray-100" @click="closeAddItemModal">
                    <span class="iconify w-5 h-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="pt-5 px-6 pb-0">
                  <div class="relative">
                    <span class="iconify absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" data-icon="mdi:magnify"></span>
                    <input 
                      type="text" 
                      v-model="searchQuery"
                      placeholder="Buscar productos..."
                      class="w-full py-3.5 pl-12 pr-5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm transition-all duration-200 focus:outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"
                      @input="filterProducts"
                    >
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
                  <div class="flex gap-2 mb-5 flex-wrap">
                    <button 
                      v-for="category in productCategories" 
                      :key="category.key"
                      :class="[
                        'px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap hover:border-emerald-600 hover:text-emerald-600',
                        { 'bg-emerald-600 text-white border-emerald-600': activeCategory === category.key }
                      ]"
                      @click="setActiveCategory(category.key)"
                    >
                      {{ category.name }}
                    </button>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div 
                      v-for="product in filteredProducts" 
                      :key="product.id"
                      class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-600"
                      @click="addProductToList(product)"
                    >
                      <div class="relative h-28 overflow-hidden">
                        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium">
                          {{ product.category }}
                        </div>
                      </div>
                      <div class="p-3">
                        <h4 class="text-sm font-medium text-gray-900 mb-1">{{ product.name }}</h4>
                        <p class="text-xs text-emerald-600 font-semibold">{{ product.price }}</p>
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

      if (activeCategory.value !== 'all') {
        filtered = filtered.filter(product => product.category === activeCategory.value)
      }

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
        
        closeAddItemModal()
      } else {
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