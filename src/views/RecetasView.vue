<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full" :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5 md:p-6">
          <div>
            <!-- Header -->
            <div class="mb-8 flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:book-open"></span>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Recetas</h1>
                <p class="text-sm text-[#6C7A6C]">Explora nuestra colección de recetas saludables</p>
              </div>
            </div>

            <!-- Buscador y Filtros -->
            <div class="mb-8">
              <div class="mb-4">
                <div class="relative max-w-150">
                  <span class="iconify absolute left-4 top-1/2 z-2 h-5 w-5 -translate-y-1/2 text-[#6C7A6C]" data-icon="mdi:magnify"></span>
                  <input 
                    type="text" 
                    placeholder="Buscar recetas..."
                    v-model="searchQuery"
                    class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-3.5 pl-12 pr-5 text-[15px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#6C7A6C] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                    @input="filterRecipes"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button 
                  v-if="availableCount > 0"
                  @click="toggleAvailableRecipes"
                  :class="['flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.5)]', { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': showOnlyAvailable }]"
                >
                  <span class="iconify h-4 w-4" data-icon="mdi:leaf"></span>
                  Con tus ingredientes ({{ availableCount }})
                </button>
                
                <button 
                  v-for="category in categories" 
                  :key="category.value"
                  @click="setSelectedCategory(category.value)"
                  :class="['cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.5)]', { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': selectedCategory === category.value }]"
                >
                  {{ category.label }}
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <!-- Grid de recetas -->
            <div v-else-if="filteredRecipes.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id"
                class="cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                @click="openRecipeDetail(recipe)"
              >
                <div class="relative h-56 overflow-hidden">
                  <img 
                    :src="recipe.image_url || defaultImage" 
                    :alt="recipe.title"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="handleImageError"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                  <div class="absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#2C2C2C] backdrop-blur-sm">
                    {{ getCategoryLabel(recipe.category) }}
                  </div>
                  <div class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span 
                      v-for="(tag, index) in (recipe.tags || []).slice(0, 2)" 
                      :key="index"
                      class="rounded-md bg-[#5DA271] px-2 py-1 text-[11px] font-medium text-white"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.title }}</h3>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-yellow-500" data-icon="mdi:star"></span>
                      <span>{{ recipe.rating || 'Nuevo' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                      <span>{{ recipe.total_time }} min</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:fire"></span>
                      <span>{{ recipe.calories_per_serving || '--' }} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mx-auto mb-5 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:book-open"></span>
              </div>
              <h3 class="mb-2 text-xl font-semibold text-[#2C2C2C]">No se encontraron recetas</h3>
              <p class="mx-auto max-w-md text-[15px] text-[#6C7A6C]">Intenta ajustar los filtros o la búsqueda</p>
            </div>

            <!-- Modal de detalle de receta -->
            <div v-if="showRecipeModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeRecipeModal">
              <div class="flex max-h-[90vh] w-full max-w-225 flex-col overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
                <div class="flex justify-end border-b border-[rgba(0,0,0,0.08)] bg-white p-4">
                  <button class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-none bg-transparent text-[#6C7A6C] transition-all duration-200 hover:bg-[#D8EBD0]" @click="closeRecipeModal">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto" v-if="selectedRecipe">
                  <div class="relative h-72 overflow-hidden">
                    <img 
                      :src="selectedRecipe.image_url || defaultImage" 
                      :alt="selectedRecipe.title"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                    <div class="absolute left-5 top-5 rounded-xl bg-[#5DA271] px-4 py-2 text-sm font-semibold text-white">
                      {{ getCategoryLabel(selectedRecipe.category) }}
                    </div>
                  </div>

                  <div class="p-8">
                    <div class="mb-8 flex flex-wrap items-start justify-between gap-5">
                      <h2 class="min-w-75 flex-1 text-[28px] font-bold text-[#2C2C2C] leading-tight">{{ selectedRecipe.title }}</h2>
                      <div class="flex flex-wrap gap-3">
                        <button 
                          @click="toggleFavorite" 
                          :class="['flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border px-5 py-3 text-sm font-medium transition-all duration-200', 
                            isFavorite ? 'border-[#d4183d] bg-[#d4183d] text-white hover:bg-[rgba(212,24,61,0.9)]' : 'border-[rgba(0,0,0,0.08)] bg-white text-[#2C2C2C] hover:bg-[#D8EBD0]']"
                        >
                          <span class="iconify h-4.5 w-4.5" :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                          {{ isFavorite ? 'En favoritos' : 'Favorita' }}
                        </button>
                        <button class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-[#5DA271] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]" @click="addToShoppingList">
                          <span class="iconify h-4.5 w-4.5" data-icon="mdi:cart-plus"></span>
                          Lista de compras
                        </button>
                      </div>
                    </div>

                    <div class="mb-10 grid grid-cols-1 gap-5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(168,213,186,0.1)] p-6 sm:grid-cols-2 md:grid-cols-4">
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:star"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe.rating || 'Nuevo' }}</p>
                          <p class="text-xs text-[#6C7A6C]">Calificación</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe.total_time }} min</p>
                          <p class="text-xs text-[#6C7A6C]">Tiempo</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:fire"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe.calories_per_serving || '--' }} kcal</p>
                          <p class="text-xs text-[#6C7A6C]">Calorías</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe.servings }} porciones</p>
                          <p class="text-xs text-[#6C7A6C]">Porciones</p>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-8">
                      <!-- Ingredientes -->
                      <div class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6">
                        <h3 class="mb-5 flex items-center gap-2.5 text-lg font-semibold text-[#2C2C2C]">
                          <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:food-apple"></span>
                          Ingredientes
                        </h3>
                        <div v-if="recipeIngredients.length === 0" class="text-center text-[#6C7A6C] py-4">
                          Cargando ingredientes...
                        </div>
                        <div v-else class="flex flex-col gap-3">
                          <div 
                            v-for="(ingredient, index) in recipeIngredients" 
                            :key="index"
                            class="flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] pb-2 last:border-none"
                          >
                            <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:checkbox-blank-circle-outline"></span>
                            <span class="text-[15px] text-[#2C2C2C]">{{ ingredient.quantity }} {{ ingredient.unit }} - {{ ingredient.ingredient_name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Instrucciones -->
                      <div class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6">
                        <h3 class="mb-5 flex items-center gap-2.5 text-lg font-semibold text-[#2C2C2C]">
                          <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:format-list-numbered"></span>
                          Instrucciones
                        </h3>
                        <div v-if="!selectedRecipe.steps || selectedRecipe.steps.length === 0" class="text-center text-[#6C7A6C] py-4">
                          Instrucciones no disponibles
                        </div>
                        <div v-else class="flex flex-col gap-5">
                          <div 
                            v-for="(step, index) in selectedRecipe.steps" 
                            :key="index"
                            class="flex gap-4"
                          >
                            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5DA271] text-sm font-semibold text-white">{{ index + 1 }}</div>
                            <p class="flex-1 text-[15px] text-[#2C2C2C] leading-relaxed">{{ step.description || step }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div v-if="selectedRecipe.tags?.length" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6">
                        <h3 class="mb-5 flex items-center gap-2.5 text-lg font-semibold text-[#2C2C2C]">
                          <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:tag-multiple-outline"></span>
                          Etiquetas
                        </h3>
                        <div class="flex flex-wrap gap-2.5">
                          <span 
                            v-for="tag in selectedRecipe.tags" 
                            :key="tag"
                            class="rounded-full border border-[rgba(93,162,113,0.3)] bg-[rgba(168,213,186,0.2)] px-3.5 py-1.5 text-[13px] font-medium text-[#5DA271]"
                          >
                            {{ tag }}
                          </span>
                        </div>
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

    <!-- Toast Notification -->
    <div v-if="showToast" 
      class="fixed top-5 right-5 z-9999 max-w-100 min-w-75 animate-slide-in-right text-white"
      :style="{ background: toastType === 'success' ? 'linear-gradient(135deg, #5DA271 0%, #8BB174 100%)' : toastType === 'error' ? 'linear-gradient(135deg, #d4183d 0%, #b31534 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }">
      <div class="flex items-start gap-3 p-4">
        <span class="iconify w-6 h-6 shrink-0" :data-icon="toastIcon"></span>
        <div>
          <p class="font-semibold text-sm mb-1">{{ toastTitle }}</p>
          <p class="text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false" class="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-4 h-4 text-white" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
  name: 'RecetasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)
    const loading = ref(true)
    const allRecipes = ref([])
    const userPantryIngredients = ref([])
    const recipeIngredientsCache = ref({})
    const favoritesSet = ref(new Set())
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
    
    // Filtros
    const categories = [
      { value: 'all', label: 'Todas' },
      { value: 'desayuno', label: 'Desayuno' },
      { value: 'almuerzo', label: 'Almuerzo' },
      { value: 'cena', label: 'Cena' },
      { value: 'postre', label: 'Postre' },
      { value: 'snack', label: 'Snack' }
    ]
    const selectedCategory = ref('all')
    const searchQuery = ref('')
    const showOnlyAvailable = ref(false)
    
    // Modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)
    const recipeIngredients = ref([])
    const isFavorite = ref(false)
    
    // Toast
    const showToast = ref(false)
    const toastType = ref('success')
    const toastTitle = ref('')
    const toastMessage = ref('')
    const toastIcon = ref('mdi:check-circle')

    const showNotification = (type, title, message, icon = null) => {
      toastType.value = type
      toastTitle.value = title
      toastMessage.value = message
      toastIcon.value = icon || (type === 'success' ? 'mdi:check-circle' : type === 'error' ? 'mdi:alert-circle' : 'mdi:alert')
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3000)
    }

    const getCategoryLabel = (category) => {
      const labels = {
        'desayuno': 'Desayuno',
        'almuerzo': 'Almuerzo',
        'cena': 'Cena',
        'postre': 'Postre',
        'snack': 'Snack'
      }
      return labels[category] || category || 'Receta'
    }

    const loadRecipes = async () => {
      try {
        loading.value = true
        
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        allRecipes.value = data || []
        
      } catch (error) {
        console.error('Error cargando recetas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las recetas')
      } finally {
        loading.value = false
      }
    }

    const loadUserPantry = async () => {
      try {
        const { data, error } = await supabase
          .from('user_pantry')
          .select('ingredient_id, quantity')
          .eq('user_id', authStore.user?.id)

        if (error) throw error
        
        userPantryIngredients.value = data.map(item => item.ingredient_id)
        
      } catch (error) {
        console.error('Error cargando despensa:', error)
        userPantryIngredients.value = []
      }
    }

    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('recipe_id')
          .eq('user_id', authStore.user?.id)

        if (error) throw error
        
        favoritesSet.value = new Set(data.map(fav => fav.recipe_id))
        
      } catch (error) {
        console.error('Error cargando favoritos:', error)
        favoritesSet.value = new Set()
      }
    }

    const checkRecipeAvailability = async (recipeId) => {
      if (userPantryIngredients.value.length === 0) return false
      
      try {
        const { data, error } = await supabase
          .from('recipe_ingredients')
          .select('ingredient_id')
          .eq('recipe_id', recipeId)

        if (error) throw error
        
        if (data.length === 0) return false
        
        const requiredIngredients = data.map(item => item.ingredient_id)
        const hasAllIngredients = requiredIngredients.every(ingId => 
          userPantryIngredients.value.includes(ingId)
        )
        
        return hasAllIngredients
        
      } catch (error) {
        console.error('Error verificando disponibilidad:', error)
        return false
      }
    }

    const loadRecipeIngredients = async (recipeId) => {
      if (recipeIngredientsCache.value[recipeId]) {
        recipeIngredients.value = recipeIngredientsCache.value[recipeId]
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('recipe_ingredients')
          .select(`
            quantity,
            unit,
            ingredient:ingredients (name)
          `)
          .eq('recipe_id', recipeId)

        if (error) throw error

        recipeIngredients.value = data.map(item => ({
          quantity: item.quantity,
          unit: item.unit,
          ingredient_name: item.ingredient?.name || 'Ingrediente'
        }))
        
        recipeIngredientsCache.value[recipeId] = recipeIngredients.value
        
      } catch (error) {
        console.error('Error cargando ingredientes:', error)
        recipeIngredients.value = []
      }
    }

    const checkIsFavorite = (recipeId) => {
      return favoritesSet.value.has(recipeId)
    }

    const toggleFavorite = async () => {
      if (!selectedRecipe.value) return
      
      try {
        if (isFavorite.value) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', authStore.user?.id)
            .eq('recipe_id', selectedRecipe.value.id)

          if (error) throw error
          
          favoritesSet.value.delete(selectedRecipe.value.id)
          isFavorite.value = false
          showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')
          
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: authStore.user?.id,
              recipe_id: selectedRecipe.value.id
            })

          if (error) throw error
          
          favoritesSet.value.add(selectedRecipe.value.id)
          isFavorite.value = true
          showNotification('success', 'Agregado', 'Receta agregada a favoritos')
        }
        
      } catch (error) {
        console.error('Error actualizando favoritos:', error)
        showNotification('error', 'Error', 'No se pudo actualizar favoritos')
      }
    }

    const addToShoppingList = async () => {
      try {
        if (!selectedRecipe.value) return

        let { data: lists, error: listsError } = await supabase
          .from('shopping_lists')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('status', 'active')
          .limit(1)

        if (listsError) throw listsError

        let listId = null
        if (lists && lists.length > 0) {
          listId = lists[0].id
        } else {
          const { data: newList, error: createError } = await supabase
            .from('shopping_lists')
            .insert({ user_id: authStore.user?.id, name: 'Lista de Compras', status: 'active' })
            .select()
            .single()
          if (createError) throw createError
          listId = newList.id
        }

        const { data: ingredients, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select('ingredient_id, quantity, unit')
          .eq('recipe_id', selectedRecipe.value.id)

        if (ingredientsError) throw ingredientsError

        if (ingredients && ingredients.length > 0) {
          const itemsToAdd = ingredients.map(ing => ({
            list_id: listId,
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: `Para receta: ${selectedRecipe.value.title}`
          }))

          const { error: insertError } = await supabase
            .from('shopping_list_items')
            .upsert(itemsToAdd, { onConflict: 'list_id,ingredient_id' })

          if (insertError) throw insertError
          showNotification('success', 'Éxito', 'Ingredientes agregados a la lista de compras')
        } else {
          showNotification('info', 'Información', 'Esta receta no tiene ingredientes registrados')
        }

      } catch (error) {
        console.error('Error agregando a lista de compras:', error)
        showNotification('error', 'Error', 'No se pudieron agregar los ingredientes')
      }
    }

    const openRecipeDetail = async (recipe) => {
      selectedRecipe.value = recipe
      isFavorite.value = checkIsFavorite(recipe.id)
      await loadRecipeIngredients(recipe.id)
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
      recipeIngredients.value = []
    }

    // Filtros computados
    const availableCount = ref(0)
    
    const filteredRecipes = computed(() => {
      let recipes = [...allRecipes.value]
      
      // Filtro por categoría
      if (selectedCategory.value !== 'all') {
        recipes = recipes.filter(r => r.category === selectedCategory.value)
      }
      
      // Filtro por búsqueda
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        recipes = recipes.filter(r => 
          r.title.toLowerCase().includes(query) ||
          (r.tags && r.tags.some(tag => tag.toLowerCase().includes(query))) ||
          (r.description && r.description.toLowerCase().includes(query))
        )
      }
      
      return recipes
    })

    const filterRecipes = () => {
      // El filtro es automático por computed
    }

    const toggleAvailableRecipes = () => {
      showOnlyAvailable.value = !showOnlyAvailable.value
      if (showOnlyAvailable.value) {
        // Filtrar solo recetas disponibles
        const filtered = filteredRecipes.value.filter(r => r.available)
        // actualizar visualización
      }
    }

    const setSelectedCategory = (category) => {
      selectedCategory.value = category
    }

    const handleImageError = (event) => {
      event.target.src = defaultImage
    }

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

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await Promise.all([
          loadRecipes(),
          loadUserPantry(),
          loadFavorites()
        ])
        
        // Calcular disponibilidad para cada receta
        for (const recipe of filteredRecipes.value) {
          recipe.available = await checkRecipeAvailability(recipe.id)
          if (recipe.available) availableCount.value++
        }
      }
    })

    return {
      isMobileMenuOpen,
      loading,
      categories,
      selectedCategory,
      searchQuery,
      showOnlyAvailable,
      availableCount,
      filteredRecipes,
      showRecipeModal,
      selectedRecipe,
      recipeIngredients,
      isFavorite,
      defaultImage,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      getCategoryLabel,
      filterRecipes,
      toggleAvailableRecipes,
      setSelectedCategory,
      openRecipeDetail,
      closeRecipeModal,
      toggleFavorite,
      addToShoppingList,
      handleImageError,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s ease;
}
</style>