<!-- src/views/ListaComprasView.vue - Versión Corregida y Optimizada -->
<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'overflow-hidden': isMobileMenuOpen }">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-25 p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:cart"></span>
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Lista de Compras</h1>
                <p class="text-sm text-gray-500" v-if="currentListId && totalCount > 0">
                  {{ checkedCount }} de {{ totalCount }} completados
                </p>
                <p class="text-sm text-gray-500" v-else-if="currentListId && totalCount === 0">
                  Lista vacía
                </p>
                <p class="text-sm text-gray-500" v-else>
                  Selecciona o crea una lista
                </p>
              </div>
            </div>
            
            <div v-if="currentListId && totalCount > 0" class="flex gap-3">
              <button @click="completeList" 
                class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-all">
                <span class="iconify inline mr-1" data-icon="mdi:check-all"></span>
                Completar lista
              </button>
              <button @click="clearPurchased" 
                class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-all">
                <span class="iconify inline mr-1" data-icon="mdi:delete-sweep"></span>
                Limpiar completados
              </button>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div v-if="currentListId && totalCount > 0" class="bg-white rounded-2xl shadow-sm p-5 mb-8">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600">Progreso de compras</span>
              <span class="text-sm font-semibold text-emerald-600">{{ Math.round(progress) }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-600 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Lista de compras -->
            <div class="lg:col-span-2">
              <!-- Selector de listas -->
              <div v-if="shoppingLists.length > 0 && !currentListId" class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Seleccionar lista</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button v-for="list in shoppingLists" :key="list.id" @click="selectList(list.id)"
                    class="text-left p-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all">
                    <p class="font-medium text-gray-900">{{ list.name }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(list.created_at) }}</p>
                  </button>
                </div>
                <button @click="createNewList" class="mt-4 text-emerald-600 text-sm flex items-center gap-1">
                  <span class="iconify" data-icon="mdi:plus"></span>
                  Crear nueva lista
                </button>
              </div>

              <!-- Lista seleccionada -->
              <div v-if="currentListId" class="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div class="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h2 class="font-semibold text-gray-900">{{ currentListName }}</h2>
                      <p class="text-xs text-gray-400 mt-0.5">Creada: {{ formatDate(currentListCreatedAt) }}</p>
                    </div>
                    <button @click="resetListSelection" class="text-sm text-emerald-600 hover:text-emerald-700">
                      Cambiar lista
                    </button>
                  </div>
                </div>

                <div v-if="Object.keys(groupedItems).length > 0" class="divide-y divide-gray-100">
                  <div v-for="(items, category) in groupedItems" :key="category">
                    <div class="px-6 py-3 bg-gray-50/30">
                      <h3 class="font-semibold text-gray-700 text-sm">{{ category }}</h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                      <div v-for="item in items" :key="item.id" class="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all">
                        <button @click="togglePurchased(item.id)" class="shrink-0">
                          <div v-if="item.is_purchased" class="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                            <span class="iconify w-3.5 h-3.5" data-icon="mdi:check"></span>
                          </div>
                          <div v-else class="w-5 h-5 rounded-md border-2 border-gray-300"></div>
                        </button>
                        <div class="flex-1 min-w-0">
                          <p :class="['text-gray-900 font-medium', { 'line-through text-gray-400': item.is_purchased }]">
                            {{ item.ingredient_name }}
                          </p>
                          <p class="text-sm text-gray-500">{{ formatQuantity(item.quantity, item.unit) }}</p>
                        </div>
                        <button @click="removeFromShoppingList(item.id)" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <span class="iconify w-5 h-5" data-icon="mdi:trash-can-outline"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="p-12 text-center">
                  <span class="iconify w-16 h-16 text-gray-300 mx-auto mb-4" data-icon="mdi:cart-outline"></span>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Tu lista está vacía</h3>
                  <p class="text-gray-500 mb-6">Agrega productos que necesitas comprar</p>
                  <button @click="openAddItemModal" class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                    Agregar productos
                  </button>
                </div>
              </div>

              <!-- Sin listas -->
              <div v-if="shoppingLists.length === 0 && !currentListId" class="bg-white rounded-2xl shadow-sm p-12 text-center">
                <span class="iconify w-16 h-16 text-gray-300 mx-auto mb-4" data-icon="mdi:cart-off"></span>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No tienes listas de compras</h3>
                <p class="text-gray-500 mb-6">Crea tu primera lista para comenzar</p>
                <button @click="createNewList" class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                  Crear primera lista
                </button>
              </div>
            </div>

            <!-- Panel lateral -->
            <div class="lg:sticky lg:top-24 h-fit">
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Agregar productos</h3>
                <button @click="openAddItemModal" class="w-full py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  <span class="iconify w-5 h-5" data-icon="mdi:plus-circle"></span>
                  Buscar productos
                </button>
              </div>

              <div v-if="currentListId && totalCount > 0" class="bg-white rounded-2xl shadow-sm p-6 mt-4">
                <h3 class="font-semibold text-gray-900 mb-3">Resumen</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Total productos:</span>
                    <span class="font-medium">{{ totalCount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Completados:</span>
                    <span class="font-medium text-emerald-600">{{ checkedCount }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-100">
                    <span class="text-gray-500">Pendientes:</span>
                    <span class="font-medium">{{ totalCount - checkedCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal para agregar productos -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4" @click="closeAddItemModal">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl" @click.stop>
        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Agregar productos</h3>
            <p class="text-sm text-gray-500">Selecciona los ingredientes que necesitas comprar</p>
          </div>
          <button @click="closeAddItemModal" class="text-gray-400 hover:text-gray-600">
            <span class="iconify w-6 h-6" data-icon="mdi:close"></span>
          </button>
        </div>

        <div class="p-5 border-b border-gray-100">
          <div class="relative">
            <span class="iconify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" data-icon="mdi:magnify"></span>
            <input type="text" v-model="searchQuery" @input="filterIngredients" placeholder="Buscar productos..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-5">
          <div class="flex gap-2 mb-5 overflow-x-auto pb-2">
            <button v-for="cat in ingredientCategories" :key="cat.key" @click="activeCategory = cat.key"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                activeCategory === cat.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]">
              {{ cat.name }}
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="product in filteredProducts" :key="product.id" @click="openQuantityModal(product)"
              class="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-emerald-600 bg-white">
              <div class="relative h-28 overflow-hidden bg-gray-100">
                <img :src="product.image_url || defaultImage" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" @error="handleImageError">
                <div class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-medium">
                  {{ getCategoryName(product.category) }}
                </div>
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium text-gray-900 line-clamp-1">{{ product.name }}</h4>
                <p class="text-xs text-emerald-600 mt-1">Agregar</p>
              </div>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center py-8 text-gray-400">
            <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:food-off"></span>
            <p>No se encontraron productos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cantidad -->
    <div v-if="showQuantityModal && selectedIngredient" class="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4" @click="closeQuantityModal">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl" @click.stop>
        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Agregar {{ selectedIngredient.name }}</h3>
            <p class="text-sm text-gray-500">Especifica la cantidad</p>
          </div>
          <button @click="closeQuantityModal" class="text-gray-400 hover:text-gray-600">
            <span class="iconify w-5 h-5" data-icon="mdi:close"></span>
          </button>
        </div>

        <div class="p-5">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <div class="flex gap-3">
              <input type="number" v-model="itemQuantity" step="0.5" min="0.5"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
              <select v-model="itemUnit" class="w-28 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600">
                <option value="unidades">unidades</option>
                <option value="gramos">gramos</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="litros">litros</option>
                <option value="tazas">tazas</option>
                <option value="cucharadas">cucharadas</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="closeQuantityModal" class="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button @click="addToList" class="flex-1 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
              Agregar a la lista
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="fixed top-5 right-5 z-1000 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
      <span class="iconify w-5 h-5" :data-icon="toastIcon"></span>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const router = useRouter()
const authStore = useAuthStore()

// Layout
const isMobileMenuOpen = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'

// Listas de compras
const shoppingLists = ref([])
const currentListId = ref('')
const currentListName = ref('')
const currentListCreatedAt = ref('')
const shoppingItems = ref([])
const loading = ref(true)

// Ingredientes disponibles
const allIngredients = ref([])
const filteredProducts = ref([])
const searchQuery = ref('')
const activeCategory = ref('all')

const ingredientCategories = [
  { key: 'all', name: 'Todos' },
  { key: 'verduras', name: 'Verduras' },
  { key: 'frutas', name: 'Frutas' },
  { key: 'proteinas', name: 'Proteínas' },
  { key: 'granos', name: 'Granos' },
  { key: 'lacteos', name: 'Lácteos' },
  { key: 'condimentos', name: 'Condimentos' },
  { key: 'bebidas', name: 'Bebidas' },
  { key: 'otros', name: 'Otros' }
]

// Modales
const showAddItemModal = ref(false)
const showQuantityModal = ref(false)
const selectedIngredient = ref(null)
const itemQuantity = ref(1)
const itemUnit = ref('unidades')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('mdi:check-circle')
let toastTimeout = null

const showNotification = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = message
  toastIcon.value = type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'
  showToast.value = true
  toastTimeout = setTimeout(() => { showToast.value = false }, 3000)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

const getCategoryName = (category) => {
  const cat = ingredientCategories.find(c => c.key === category)
  return cat ? cat.name : (category || 'Otros')
}

const formatQuantity = (quantity, unit) => {
  const qty = parseFloat(quantity)
  if (isNaN(qty)) return `${quantity} ${unit}`
  if (Number.isInteger(qty)) return `${qty} ${unit}`
  return `${qty.toFixed(1)} ${unit}`
}

// Resetear selección de lista
const resetListSelection = () => {
  currentListId.value = ''
  currentListName.value = ''
  currentListCreatedAt.value = ''
  shoppingItems.value = []
  loadShoppingLists()
}

// Cargar listas de compras
const loadShoppingLists = async () => {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', authStore.user?.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    shoppingLists.value = data || []
  } catch (error) {
    console.error('Error cargando listas:', error)
  }
}

// Cargar items de la lista actual
const loadShoppingList = async () => {
  if (!currentListId.value) return

  try {
    const { data: listInfo, error: listError } = await supabase
      .from('shopping_lists')
      .select('name, created_at')
      .eq('id', currentListId.value)
      .single()

    if (listError) throw listError
    currentListName.value = listInfo?.name || 'Lista de compras'
    currentListCreatedAt.value = listInfo?.created_at

    const { data, error } = await supabase
      .from('shopping_list_items')
      .select(`
        id,
        quantity,
        unit,
        is_purchased,
        ingredient_id,
        ingredient:ingredients (
          id,
          name,
          category,
          image_url
        )
      `)
      .eq('list_id', currentListId.value)
      .order('added_at', { ascending: true })

    if (error) throw error

    shoppingItems.value = (data || []).map(item => ({
      id: item.id,
      quantity: item.quantity || 1,
      unit: item.unit || 'unidades',
      is_purchased: item.is_purchased || false,
      ingredient_id: item.ingredient_id,
      ingredient_name: item.ingredient?.name || 'Producto',
      ingredient_category: item.ingredient?.category || 'otros',
      ingredient_image: item.ingredient?.image_url || defaultImage
    }))
  } catch (error) {
    console.error('Error cargando lista:', error)
    shoppingItems.value = []
  }
}

// Cargar catálogo de ingredientes
const loadIngredients = async () => {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name')

    if (error) throw error
    allIngredients.value = data || []
    filterIngredients()
  } catch (error) {
    console.error('Error cargando ingredientes:', error)
  }
}

// Filtrar productos
const filterIngredients = () => {
  let filtered = [...allIngredients.value]

  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(ing => ing.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ing => ing.name.toLowerCase().includes(query))
  }

  filteredProducts.value = filtered
}

// Crear nueva lista
const createNewList = async () => {
  try {
    const listName = `Lista ${new Date().toLocaleDateString()}`
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: authStore.user?.id,
        name: listName,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    shoppingLists.value.unshift(data)
    currentListId.value = data.id
    await loadShoppingList()
    showNotification('Lista creada exitosamente')
  } catch (error) {
    console.error('Error creando lista:', error)
    showNotification('Error al crear lista', 'error')
  }
}

// Seleccionar lista
const selectList = async (listId) => {
  currentListId.value = listId
  await loadShoppingList()
  showNotification('Lista seleccionada')
}

// Marcar/desmarcar item
const togglePurchased = async (itemId) => {
  const item = shoppingItems.value.find(i => i.id === itemId)
  if (!item) return

  const newStatus = !item.is_purchased

  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({
        is_purchased: newStatus,
        purchased_at: newStatus ? new Date().toISOString() : null
      })
      .eq('id', itemId)

    if (error) throw error
    item.is_purchased = newStatus
  } catch (error) {
    console.error('Error actualizando:', error)
    showNotification('Error al actualizar', 'error')
  }
}

// Eliminar item
const removeFromShoppingList = async (itemId) => {
  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error

    shoppingItems.value = shoppingItems.value.filter(item => item.id !== itemId)
    showNotification('Producto eliminado')
  } catch (error) {
    console.error('Error eliminando:', error)
    showNotification('Error al eliminar', 'error')
  }
}

// Limpiar completados
const clearPurchased = async () => {
  const purchasedItems = shoppingItems.value.filter(item => item.is_purchased)
  if (purchasedItems.length === 0) {
    showNotification('No hay productos completados', 'error')
    return
  }

  try {
    for (const item of purchasedItems) {
      await supabase.from('shopping_list_items').delete().eq('id', item.id)
    }
    shoppingItems.value = shoppingItems.value.filter(item => !item.is_purchased)
    showNotification(`${purchasedItems.length} productos eliminados`)
  } catch (error) {
    console.error('Error limpiando:', error)
    showNotification('Error al limpiar', 'error')
  }
}

// Completar lista
const completeList = async () => {
  try {
    await supabase
      .from('shopping_lists')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', currentListId.value)

    resetListSelection()
    showNotification('Lista completada')
  } catch (error) {
    console.error('Error completando lista:', error)
    showNotification('Error al completar lista', 'error')
  }
}

// Abrir modal agregar producto
const openAddItemModal = () => {
  if (!currentListId.value && shoppingLists.value.length === 0) {
    showNotification('Primero crea una lista', 'error')
    return
  }
  if (!currentListId.value && shoppingLists.value.length > 0) {
    showNotification('Selecciona una lista primero', 'error')
    return
  }
  searchQuery.value = ''
  activeCategory.value = 'all'
  filterIngredients()
  showAddItemModal.value = true
}

const closeAddItemModal = () => {
  showAddItemModal.value = false
}

// Abrir modal cantidad
const openQuantityModal = (ingredient) => {
  if (!ingredient || !ingredient.id) {
    showNotification('Error al seleccionar producto', 'error')
    return
  }
  selectedIngredient.value = ingredient
  itemQuantity.value = 1
  itemUnit.value = ingredient.default_unit || 'unidades'
  showAddItemModal.value = false
  showQuantityModal.value = true
}

const closeQuantityModal = () => {
  showQuantityModal.value = false
  selectedIngredient.value = null
}

// Agregar a la lista (evitando duplicados)
const addToList = async () => {
  if (!selectedIngredient.value || !selectedIngredient.value.id) {
    showNotification('Error al identificar producto', 'error')
    closeQuantityModal()
    return
  }

  if (!currentListId.value) {
    showNotification('Primero selecciona una lista', 'error')
    closeQuantityModal()
    return
  }

  try {
    // Verificar si el producto ya existe en la lista
    const existingItem = shoppingItems.value.find(
      item => item.ingredient_id === selectedIngredient.value.id
    )

    if (existingItem) {
      // Actualizar cantidad en lugar de duplicar
      const newQuantity = existingItem.quantity + parseFloat(itemQuantity.value)
      const { error: updateError } = await supabase
        .from('shopping_list_items')
        .update({ 
          quantity: newQuantity,
          unit: itemUnit.value
        })
        .eq('id', existingItem.id)

      if (updateError) throw updateError
      showNotification(`${selectedIngredient.value.name} actualizado (${newQuantity} ${itemUnit.value})`)
    } else {
      // Insertar nuevo item
      const { error: insertError } = await supabase
        .from('shopping_list_items')
        .insert({
          list_id: currentListId.value,
          ingredient_id: selectedIngredient.value.id,
          quantity: parseFloat(itemQuantity.value),
          unit: itemUnit.value,
          is_purchased: false
        })

      if (insertError) throw insertError
      showNotification(`${selectedIngredient.value.name} agregado a la lista`)
    }

    await loadShoppingList()
    closeQuantityModal()
  } catch (error) {
    console.error('Error agregando:', error)
    if (error.code === '23505') {
      showNotification('El producto ya existe en la lista', 'error')
    } else {
      showNotification('Error al agregar producto', 'error')
    }
  }
}

// Computed
const checkedCount = computed(() => shoppingItems.value.filter(i => i.is_purchased).length)
const totalCount = computed(() => shoppingItems.value.length)
const progress = computed(() => totalCount.value > 0 ? (checkedCount.value / totalCount.value) * 100 : 0)

const groupedItems = computed(() => {
  const groups = {}
  shoppingItems.value.forEach(item => {
    const category = item.ingredient_category || 'otros'
    const categoryName = getCategoryName(category)
    if (!groups[categoryName]) groups[categoryName] = []
    groups[categoryName].push(item)
  })
  return groups
})

// Layout
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const handleLogout = async () => { await authStore.logout(); router.push('/login') }
const handleImageError = (event) => { event.target.src = defaultImage }

// Init - Cargar datos en paralelo para mejor performance
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      loadShoppingLists(),
      loadIngredients()
    ])
    loading.value = false
  }
})
</script>