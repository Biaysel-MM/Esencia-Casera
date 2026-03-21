<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen" 
      @close="closeMobileMenu" 
      class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full"
      :class="{ 'max-md:translate-x-0': isMobileMenuOpen }"
    />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header 
        @toggle-mobile-menu="toggleMobileMenu" 
        @logout="handleLogout" 
        class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16"
      />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5 md:p-6">
          <!-- Contenido de la lista de compras -->
          <div>
            <!-- Header de la lista -->
            <div class="mb-6">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:cart"></span>
                </div>
                <div>
                  <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Lista de Compras</h1>
                  <p class="text-sm text-[#6C7A6C]">{{ checkedCount }} de {{ totalCount }} completados</p>
                </div>
              </div>
            </div>

            <!-- Barra de progreso -->
            <div v-if="totalCount > 0" class="mb-6 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-sm">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm text-[#2C2C2C]">Progreso</span>
                <span class="text-sm font-semibold text-[#5DA271]">{{ Math.round(progress) }}%</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-[rgba(93,162,113,0.2)]">
                <div class="h-full rounded-full bg-linear-to-r from-[#5DA271] to-[#8BB174] transition-all duration-300" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Grid principal -->
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <!-- Lista de compras - Ocupa 2 columnas en lg -->
              <div class="lg:col-span-2">
                <div v-if="Object.keys(groupedItems).length > 0" class="space-y-4">
                  <div v-for="(items, category) in groupedItems" :key="category" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-sm">
                    <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">{{ category }}</h3>
                    <div class="space-y-3">
                      <div v-for="item in items" :key="item.id" 
                        class="flex items-center gap-3 rounded-xl border border-transparent bg-[rgba(93,162,113,0.05)] p-3 transition-all duration-200 hover:-translate-y-px hover:border-[#5DA271] hover:bg-[rgba(93,162,113,0.1)] hover:shadow-md">
                        <label class="relative flex cursor-pointer items-center" @click.stop>
                          <input 
                            type="checkbox" 
                            :checked="item.checked"
                            @change="toggleShoppingItem(item.id)"
                            class="absolute h-0 w-0 cursor-pointer opacity-0"
                          >
                          <span v-if="item.checked" class="flex h-5 w-5 items-center justify-center rounded-md border-[#5DA271] bg-[#5DA271] transition-all duration-200">✓</span>
                          <span v-else class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.2)] bg-white transition-all duration-200">
                          </span>
                        </label>
                        <div class="min-w-0 flex-1" @click="toggleShoppingItem(item.id)">
                          <p :class="['mb-0.5 cursor-pointer text-sm font-medium text-[#2C2C2C] transition-all duration-200', { 'text-[#6C7A6C] line-through': item.checked }]">
                            {{ item.name }}
                          </p>
                          <p class="text-xs text-[#6C7A6C]">{{ item.quantity }}</p>
                        </div>
                        <button 
                          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[rgba(212,24,61,0.2)] bg-white text-[#6C7A6C] transition-all duration-200 hover:border-[#d4183d] hover:bg-[rgba(212,24,61,0.05)] hover:text-[#d4183d]"
                          @click="removeFromShoppingList(item.id)"
                        >
                          <span class="iconify h-4 w-4" data-icon="mdi:trash-can-outline"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-12 text-center shadow-sm">
                  <div class="mx-auto mb-4 text-[#6C7A6C]">
                    <span class="iconify h-16 w-16" data-icon="mdi:cart-outline"></span>
                  </div>
                  <h3 class="mb-2 text-lg font-semibold text-[#2C2C2C]">Tu lista está vacía</h3>
                  <p class="mx-auto mb-6 max-w-md text-sm text-[#6C7A6C]">
                    Comienza agregando productos que necesitas comprar
                  </p>
                  <button 
                    class="cursor-pointer rounded-xl border-none bg-[#5DA271] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Agregar productos
                  </button>
                </div>
              </div>

              <!-- Panel lateral para agregar artículos -->
              <div class="lg:sticky lg:top-22 h-fit">
                <div class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-sm">
                  <h3 class="mb-5 text-lg font-semibold text-[#2C2C2C]">Agregar artículo</h3>
                  <button 
                    class="mb-4 w-full cursor-pointer rounded-xl border-none bg-[#5DA271] py-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Buscar productos
                  </button>
                  <p class="text-center text-xs leading-relaxed text-[#6C7A6C]">
                    Usa el buscador visual para agregar productos a tu lista
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal para agregar productos -->
            <div v-if="showAddItemModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeAddItemModal">
              <div class="flex max-h-[80vh] w-full max-w-200 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
                <div class="relative border-b border-[rgba(0,0,0,0.08)] bg-white p-6">
                  <h3 class="mb-1 text-lg font-semibold text-[#2C2C2C]">Buscar productos</h3>
                  <p class="text-sm text-[#6C7A6C]">Agrega productos a tu lista de compras</p>
                  <button class="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#6C7A6C] transition-all duration-200 hover:bg-[#D8EBD0]" @click="closeAddItemModal">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="px-6 pb-0 pt-5">
                  <div class="relative">
                    <span class="iconify absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6C7A6C]" data-icon="mdi:magnify"></span>
                    <input 
                      type="text" 
                      v-model="searchQuery"
                      placeholder="Buscar productos..."
                      class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-3.5 pl-12 pr-5 text-sm text-[#2C2C2C] transition-all duration-200 focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                      @input="filterProducts"
                    >
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
                  <div class="mb-5 flex flex-wrap gap-2">
                    <button 
                      v-for="category in productCategories" 
                      :key="category.key"
                      :class="[
                        'cursor-pointer whitespace-nowrap rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2 text-xs font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:text-[#5DA271]',
                        { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': activeCategory === category.key }
                      ]"
                      @click="setActiveCategory(category.key)"
                    >
                      {{ category.name }}
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div 
                      v-for="product in filteredProducts" 
                      :key="product.id"
                      class="cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-lg"
                      @click="addProductToList(product)"
                    >
                      <div class="relative h-28 overflow-hidden">
                        <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute left-2 top-2 rounded bg-[#5DA271] px-2 py-1 text-[10px] font-medium text-white">
                          {{ product.category }}
                        </div>
                      </div>
                      <div class="p-3">
                        <h4 class="mb-1 text-sm font-medium text-[#2C2C2C]">{{ product.name }}</h4>
                        <p class="text-xs font-semibold text-[#5DA271]">{{ product.price }}</p>
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