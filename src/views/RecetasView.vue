<!-- src/views/RecetasView.vue - VERSIÓN CORREGIDA -->
<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu"
      class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full"
      :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout"
        class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

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
                <p class="text-sm text-[#6C7A6C]">
                  Explora nuestra colección de recetas saludables
                  <span v-if="externalCount > 0"
                    class="ml-2 text-xs bg-[rgba(93,162,113,0.1)] px-2 py-0.5 rounded-full">
                    +{{ externalCount }} externas
                  </span>
                </p>
              </div>
            </div>

            <!-- Buscador y Filtros -->
            <div class="mb-8 space-y-5">
              <!-- Buscador mejorado -->
              <div class="relative max-w-150 group">
                <span
                  class="iconify absolute left-4 top-1/2 z-2 h-5 w-5 -translate-y-1/2 text-[#6C7A6C] transition-all duration-300 group-focus-within:text-[#5DA271] group-focus-within:scale-110"
                  data-icon="mdi:magnify"></span>
                <input type="text" placeholder="Buscar recetas (locales + externas)..." v-model="searchQuery"
                  @input="debouncedSearch" @keyup.enter="debouncedSearch"
                  class="w-full rounded-2xl border-2 border-[rgba(0,0,0,0.06)] bg-white/80 py-4 pl-12 pr-5 text-[15px] text-[#2C2C2C] transition-all duration-300 placeholder:text-[#6C7A6C]/60 backdrop-blur-sm focus:border-[#5DA271] focus:outline-none focus:ring-4 focus:ring-[rgba(93,162,113,0.15)] focus:bg-white hover:border-[rgba(93,162,113,0.3)] hover:shadow-md" />
                <div
                  class="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
                  style="background: radial-gradient(circle at 30% 50%, rgba(93,162,113,0.08) 0%, transparent 70%);">
                </div>
              </div>

              <!-- Filtros mejorados -->
              <div class="flex flex-wrap gap-2.5">
                <!-- Botón de ingredientes disponibles (destacado) -->
                <button v-if="availableCount > 0" @click="toggleAvailableRecipes" :class="[
                  'relative group flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden',
                  showOnlyAvailable
                    ? 'bg-linear-to-r from-[#5DA271] to-[#4A8B5C] text-white shadow-lg shadow-[#5DA271]/30'
                    : 'bg-white/80 backdrop-blur-sm border-2 border-[rgba(0,0,0,0.06)] text-[#2C2C2C] hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.15)] hover:shadow-md hover:-translate-y-0.5'
                ]">
                  <span
                    class="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  <span class="iconify h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110"
                    :class="showOnlyAvailable ? 'text-white' : 'text-[#5DA271]'" data-icon="mdi:leaf"></span>
                  <span class="relative z-10">Con tus ingredientes</span>
                  <span class="relative z-10 ml-1 rounded-full px-2 py-0.5 text-xs font-bold"
                    :class="showOnlyAvailable ? 'bg-white/20 text-white' : 'bg-[rgba(93,162,113,0.15)] text-[#5DA271]'">
                    {{ availableCount }}
                  </span>
                </button>

                <!-- Botones de categorías -->
                <button v-for="category in categories" :key="category.value"
                  @click="setSelectedCategory(category.value)" :class="[
                    'relative group cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden',
                    selectedCategory === category.value
                      ? 'bg-linear-to-r from-[#5DA271] to-[#4A8B5C] text-white shadow-lg shadow-[#5DA271]/30'
                      : 'bg-white/80 backdrop-blur-sm border-2 border-[rgba(0,0,0,0.06)] text-[#2C2C2C] hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.15)] hover:shadow-md hover:-translate-y-0.5'
                  ]">
                  <span
                    class="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  <span class="relative z-10">{{ category.label }}</span>
                  <span v-if="selectedCategory === category.value"
                    class="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white/60 rounded-full animate-pulse">
                  </span>
                </button>
              </div>

              <!-- Indicador de búsqueda externa -->
              <div v-if="searchingExternal" class="flex items-center gap-2 text-xs text-[#5DA271]">
                <div class="w-3 h-3 rounded-full border-2 border-[#5DA271] border-t-transparent animate-spin"></div>
                <span>Buscando recetas externas...</span>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div
                class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]">
              </div>
            </div>

            <!-- Grid de recetas -->
            <div v-else-if="displayedRecipes.length > 0"
              class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div v-for="recipe in displayedRecipes" :key="recipe.id"
                class="group cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                @click="openRecipeDetail(recipe)">
                <div class="relative h-56 overflow-hidden">
                  <img :src="recipe.image_url || defaultImage" :alt="recipe.title"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="handleImageError" />
                  <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                  <!-- Badge de categoría -->
                  <div class="absolute left-3 top-3">
                    <span class="rounded-lg bg-[#5DA271] px-3 py-1.5 text-xs font-medium text-white">
                      {{ getCategoryLabel(recipe.category) }}
                    </span>
                  </div>

                  <!-- Badge de fuente (local/externa) -->
                  <div class="absolute right-3 top-3">
                    <div class="flex items-center gap-1 rounded-lg px-2 py-1 text-white text-xs backdrop-blur-sm"
                      :class="recipe.isExternal ? 'bg-purple-600/90' : 'bg-[#5DA271]/90'">
                      <span class="iconify w-3 h-3" :data-icon="recipe.isExternal ? 'mdi:api' : 'mdi:database'"></span>
                      <span>{{ recipe.isExternal ? 'Spoonacular' : 'Local' }}</span>
                    </div>
                  </div>

                  <!-- Badge de compatibilidad -->
                  <div v-if="recipe.match_percentage !== undefined && recipe.total_ingredients > 0"
                    class="absolute bottom-3 right-3">
                    <div class="flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-white text-xs">
                      <span class="iconify w-3 h-3" data-icon="mdi:check-circle"></span>
                      <span>{{ recipe.match_percentage }}% compatible</span>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div class="absolute bottom-3 left-3 flex gap-1">
                    <span v-for="(tag, idx) in (recipe.tags || []).slice(0, 2)" :key="idx"
                      class="rounded px-2 py-0.5 text-[10px] font-medium bg-white/90 text-[#2C2C2C]">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <h3 class="mb-3 text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.title }}</h3>

                  <!-- Métricas -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                      <span>{{ recipe.total_time || '--' }} min</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                      <span>{{ recipe.servings || '--' }} porc.</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:fire"></span>
                      <span>{{ recipe.calories_per_serving || '--' }}</span>
                    </div>
                  </div>

                  <!-- Barra de progreso de ingredientes (SOLO si hay ingredientes) -->
                  <div v-if="recipe.total_ingredients && recipe.total_ingredients > 0" class="mb-4">
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-[#6C7A6C]">Ingredientes disponibles</span>
                      <span class="font-medium text-[#5DA271]">
                        {{ recipe.available_ingredients || 0 }}/{{ recipe.total_ingredients }}
                      </span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#E8F0E8]">
                      <div class="h-full rounded-full transition-all duration-300" :style="{
                        width: ((recipe.available_ingredients || 0) / recipe.total_ingredients * 100) + '%',
                        backgroundColor: '#5DA271'
                      }"></div>
                    </div>
                  </div>

                  <!-- Botones de acción -->
                  <div class="flex gap-2">
                    <button @click.stop="openRecipeDetail(recipe)"
                      class="flex-1 rounded-xl bg-[#5DA271] py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                      Ver receta
                    </button>
                    <button @click.stop="addToShoppingListFromRecipe(recipe)"
                      class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2.5 transition-all duration-200 hover:bg-[#D8EBD0]"
                      title="Agregar a lista de compras">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:cart-plus"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paginación -->
            <div v-if="totalPages > 1 && !searchQuery && !showOnlyAvailable && selectedCategory === 'all'"
              class="mt-8 flex justify-center gap-2">
              <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5DA271]">
                Anterior
              </button>
              <span class="px-4 py-2 text-gray-700">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5DA271]">
                Siguiente
              </button>
            </div>

            <!-- Estado vacío -->
            <div v-else-if="!loading && displayedRecipes.length === 0"
              class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mx-auto mb-5 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:food-off"></span>
              </div>
              <h3 class="mb-2 text-xl font-semibold text-[#2C2C2C]">No se encontraron recetas</h3>
              <p class="mx-auto max-w-md text-[15px] text-[#6C7A6C]">Intenta ajustar los filtros o la búsqueda</p>
              <button v-if="showOnlyAvailable" @click="showOnlyAvailable = false"
                class="mt-4 rounded-xl bg-[#5DA271] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                Mostrar todas las recetas
              </button>
            </div>

            <!-- Modal de detalle de receta (con diseño original) -->
            <div v-if="showRecipeModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
              @click="closeRecipeModal">
              <div class="rounded-2xl max-w-225 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in"
                @click.stop style="background-color: var(--card);">
                <button @click="closeRecipeModal"
                  class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center z-10"
                  style="background-color: var(--background); border-color: var(--border);">
                  <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
                </button>

                <div v-if="loadingRecipe" class="flex flex-col items-center justify-center min-h-75"
                  style="color: var(--muted-foreground);">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4"
                    style="border-color: var(--border); border-top-color: var(--primary);"></div>
                  <p>Cargando receta...</p>
                </div>

                <div v-else-if="selectedRecipe">
                  <div class="relative h-75 overflow-hidden rounded-t-2xl">
                    <img :src="selectedRecipe.image_url || defaultImage" :alt="selectedRecipe.title"
                      class="w-full h-full object-cover" @error="handleImageError">
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                    <div class="absolute left-5 top-5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                      :style="{ backgroundColor: 'var(--primary)' }">
                      {{ getCategoryLabel(selectedRecipe.category) }}
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 class="text-3xl font-bold mb-2">{{ selectedRecipe.title }}</h2>
                      <div v-if="selectedRecipe.isExternal" class="flex items-center gap-2 mt-1">
                        <span class="text-xs bg-purple-600/80 px-2 py-0.5 rounded-full">Spoonacular</span>
                      </div>
                    </div>
                  </div>

                  <div class="p-8">
                    <!-- Métricas de la receta -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl"
                      style="background-color: var(--muted);">
                      <div class="text-center">
                        <span class="block text-lg font-semibold">{{ selectedRecipe.total_time || '--' }} min</span>
                        <span class="text-xs">Tiempo</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold">{{ selectedRecipe.servings || '--' }}</span>
                        <span class="text-xs">Porciones</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold">{{ selectedRecipe.calories_per_serving || '--' }}
                          kcal</span>
                        <span class="text-xs">Calorías</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold">{{ selectedRecipe.rating || 'Nuevo' }}</span>
                        <span class="text-xs">Calificación</span>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex gap-4 mb-8">
                      <button @click="toggleFavorite"
                        class="flex-1 py-3 rounded-xl border font-medium transition-all duration-200"
                        :style="{ borderColor: 'var(--border)', backgroundColor: 'transparent', color: 'var(--foreground)' }">
                        <span class="iconify w-5 h-5 inline mr-2"
                          :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                        {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
                      </button>
                      <button @click="addToShoppingList"
                        class="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-200"
                        :style="{ backgroundColor: 'var(--primary)' }">
                        <span class="iconify w-5 h-5 inline mr-2" data-icon="mdi:cart-plus"></span>
                        Lista de compras
                      </button>
                    </div>

                    <!-- Ingredientes -->
                    <div class="mb-8">
                      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-[#2C2C2C]">
                        <span class="iconify w-5 h-5 text-[#5DA271]" data-icon="mdi:food-apple"></span>
                        Ingredientes
                      </h3>
                      <div class="p-4 rounded-xl bg-[rgba(168,213,186,0.1)]">
                        <div v-for="ing in recipeIngredients" :key="ing.ingredient_name"
                          class="py-2 last:border-0 flex justify-between items-center border-b border-[rgba(0,0,0,0.05)]">
                          <span class="flex items-center gap-2 text-[#2C2C2C]">
                            <span class="iconify w-4 h-4 text-[#5DA271]"
                              data-icon="mdi:checkbox-blank-circle-outline"></span>
                            <span>{{ ing.ingredient_name || ing.name }}</span> <!-- Mostrar nombre -->
                          </span>
                          <span class="font-medium text-[#5DA271]">{{ ing.quantity }} {{ ing.unit }}</span>
                        </div>
                        <div v-if="recipeIngredients.length === 0" class="py-4 text-center text-[#6C7A6C]">
                          <span class="iconify w-8 h-8 mx-auto mb-1 opacity-50" data-icon="mdi:food-off"></span>
                          <p class="text-sm">No hay ingredientes registrados</p>
                        </div>
                      </div>
                    </div>

                    <!-- Instrucciones -->
                    <div v-if="selectedRecipe.steps && selectedRecipe.steps.length > 0" class="mb-8">
                      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span class="iconify w-5 h-5" :style="{ color: 'var(--primary)' }"
                          data-icon="mdi:format-list-numbered"></span>
                        Instrucciones
                      </h3>
                      <div class="flex flex-col gap-4">
                        <div v-for="(step, idx) in selectedRecipe.steps" :key="idx" class="flex gap-3">
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
                            :style="{ backgroundColor: 'var(--primary)' }">{{ idx + 1 }}</div>
                          <p class="text-sm leading-relaxed" style="color: var(--foreground);">{{
                            translateInstructions(step) }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Tags -->
                    <div v-if="selectedRecipe.tags && selectedRecipe.tags.length > 0">
                      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span class="iconify w-5 h-5" :style="{ color: 'var(--primary)' }"
                          data-icon="mdi:tag-multiple-outline"></span>
                        Etiquetas
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="tag in selectedRecipe.tags" :key="tag"
                          class="rounded-full border px-3.5 py-1.5 text-[13px] font-medium"
                          :style="{ borderColor: 'rgba(93,162,113,0.3)', backgroundColor: 'rgba(168,213,186,0.2)', color: 'var(--primary)' }">
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
      </main>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-5 right-5 z-9999 max-w-100 min-w-75 animate-slide-in-right text-white"
      :style="{ background: toastType === 'success' ? 'linear-gradient(135deg, #5DA271 0%, #8BB174 100%)' : toastType === 'error' ? 'linear-gradient(135deg, #d4183d 0%, #b31534 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }">
      <div class="flex items-start gap-3 p-4">
        <span class="iconify w-6 h-6 shrink-0" :data-icon="toastIcon"></span>
        <div>
          <p class="font-semibold text-sm mb-1">{{ toastTitle }}</p>
          <p class="text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false"
          class="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-4 h-4 text-white" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRecipesStore } from '@/stores/recipes'
import { supabase } from '@/supabase'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { translateInstructions as translateInstructionsService, translateIngredient } from '@/services/translations'

export default {
  name: 'RecetasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const recipesStore = useRecipesStore()

    // Layout
    const isMobileMenuOpen = ref(false)
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'

    // Paginación
    const ITEMS_PER_PAGE = 10
    const currentPage = ref(1)

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
    const searchingExternal = ref(false)
    let searchTimeout = null

    // Modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)
    const recipeIngredients = ref([])
    const isFavorite = ref(false)
    const loadingRecipe = ref(false)

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

    // Traducción básica de instrucciones (CORREGIDA)
    const translateInstructions = (step) => {
      if (!step) return ''
      // Asegurar que step es string
      let text = String(step)

      const translations = {
        'Heat your oven': 'Precalienta el horno',
        'Place your': 'Coloca tus',
        'Add your': 'Agrega tus',
        'Mix thoroughly': 'Mezcla bien',
        'Bake for': 'Hornea por',
        'minutes': 'minutos',
        'until': 'hasta que',
        'browned': 'esté dorado',
        'oven': 'horno',
        'sweet potatoes': 'batatas',
        'butter': 'mantequilla',
        'eggs': 'huevos',
        'vanilla extract': 'extracto de vainilla',
        'cinnamon': 'canela',
        'sugar': 'azúcar',
        'cream': 'crema',
        'melt': 'derrite',
        'skillet': 'sartén',
        'olive oil': 'aceite de oliva',
        'pork chops': 'chuletas de cerdo',
        'medium high': 'fuego medio-alto',
        'lower the heat': 'baja el fuego',
        'salt and pepper': 'sal y pimienta',
        'meanwhile': 'mientras tanto',
        'broil': 'gratinar',
        'mix together': 'mezcla',
        'heavy cream': 'crema de leche',
        'mustard': 'mostaza',
        'cheese': 'queso',
        'remove from': 'retira del',
        'stove': 'fogón',
        'oven proof dish': 'fuente para horno',
        'spread': 'extiende',
        'mixture': 'mezcla',
        'minutes': 'minutos',
        'side': 'lado',
        'taste': 'gusto'
      }

      for (const [eng, esp] of Object.entries(translations)) {
        const regex = new RegExp(eng, 'gi')
        text = text.replace(regex, esp)
      }

      return text
    }

    // Cargar despensa del usuario
    const loadUserPantry = async () => {
      try {
        const { data, error } = await supabase
          .from('user_pantry')
          .select('ingredient_id, ingredient:ingredients(name)')
          .eq('user_id', authStore.user?.id)

        if (error) throw error
        return (data || []).map(item => ({
          id: item.ingredient_id,
          name: item.ingredient?.name?.toLowerCase()
        })).filter(i => i.name)
      } catch (error) {
        console.error('Error cargando despensa:', error)
        return []
      }
    }

    // Cargar ingredientes de una receta local
    const loadLocalRecipeIngredients = async (recipeId) => {
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

        return (data || []).map(item => ({
          ingredient_name: item.ingredient?.name || 'Ingrediente',
          quantity: item.quantity,
          unit: item.unit
        }))
      } catch (error) {
        console.error('Error cargando ingredientes locales:', error)
        return []
      }
    }

    // Calcular compatibilidad de una receta
    const calculateAvailability = async (recipe, pantry) => {
      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return { available_ingredients: 0, total_ingredients: 0, match_percentage: 0 }
      }

      const totalIngredients = recipe.ingredients.length
      const availableIngredients = recipe.ingredients.filter(ing => {
        const ingName = ing.name?.toLowerCase() || ing.ingredient_name?.toLowerCase()
        return pantry.some(p => p.name?.includes(ingName) || ingName?.includes(p.name))
      }).length

      const matchPercentage = totalIngredients > 0 ? Math.round((availableIngredients / totalIngredients) * 100) : 0

      return {
        available_ingredients: availableIngredients,
        total_ingredients: totalIngredients,
        match_percentage: matchPercentage
      }
    }

    // Cargar recetas locales
    const loadLocalRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Cargar ingredientes para cada receta local
      const recipesWithIngredients = []
      for (const recipe of (data || [])) {
        const ingredients = await loadLocalRecipeIngredients(recipe.id)
        recipesWithIngredients.push({
          ...recipe,
          ingredients,
          isExternal: false,
          source: 'local'
        })
      }

      return recipesWithIngredients
    }

    // Cargar todas las recetas con paginación
    const loadAllRecipes = async () => {
      searchingExternal.value = true
      try {
        // Cargar locales
        const localRecipes = await loadLocalRecipes()

        // Cargar externas de Spoonacular (paginadas)
        const offset = (currentPage.value - 1) * ITEMS_PER_PAGE
        const externalRecipes = await recipesStore.loadExternalRecipesPaginated(offset, ITEMS_PER_PAGE)

        // Combinar
        const allRecipes = [...localRecipes, ...externalRecipes]

        // Calcular disponibilidad con despensa
        const pantry = await loadUserPantry()
        for (const recipe of allRecipes) {
          const availability = await calculateAvailability(recipe, pantry)
          Object.assign(recipe, availability)
        }

        recipesStore.allRecipes = allRecipes
      } catch (error) {
        console.error('Error cargando recetas:', error)
      } finally {
        searchingExternal.value = false
      }
    }

    // Búsqueda con debounce
    const debouncedSearch = () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(async () => {
        if (searchQuery.value.length >= 2) {
          searchingExternal.value = true
          try {
            const results = await recipesStore.searchRecipes(searchQuery.value)
            const pantry = await loadUserPantry()
            for (const recipe of results) {
              const availability = await calculateAvailability(recipe, pantry)
              Object.assign(recipe, availability)
            }
            recipesStore.allRecipes = results
            currentPage.value = 1
          } catch (error) {
            console.error('Error en búsqueda:', error)
          } finally {
            searchingExternal.value = false
          }
        } else if (searchQuery.value === '') {
          await loadAllRecipes()
        }
      }, 500)
    }

    // Computed properties
    const displayedRecipes = computed(() => {
      let recipes = [...recipesStore.allRecipes]

      if (selectedCategory.value !== 'all') {
        recipes = recipes.filter(r => r.category === selectedCategory.value)
      }

      if (showOnlyAvailable.value) {
        recipes = recipes.filter(r => (r.match_percentage || 0) === 100)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        recipes = recipes.filter(r => r.title?.toLowerCase().includes(query))
      }

      return recipes
    })

    const totalRecetas = computed(() => recipesStore.allRecipes.length)
    const totalPages = computed(() => Math.ceil(recipesStore.allRecipes.length / ITEMS_PER_PAGE))
    const availableCount = computed(() => recipesStore.allRecipes.filter(r => (r.match_percentage || 0) === 100).length)
    const externalCount = computed(() => recipesStore.externalRecipes.length)
    const loading = computed(() => recipesStore.loading.combined || searchingExternal.value)

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        loadAllRecipes()
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        loadAllRecipes()
      }
    }

    const toggleAvailableRecipes = () => {
      showOnlyAvailable.value = !showOnlyAvailable.value
      if (showOnlyAvailable.value) {
        recipesStore.allRecipes = recipesStore.allRecipes.filter(r => (r.match_percentage || 0) === 100)
      } else {
        loadAllRecipes()
      }
    }

    const setSelectedCategory = async (category) => {
      selectedCategory.value = category
      if (category === 'all') {
        await loadAllRecipes()
      } else {
        searchingExternal.value = true
        try {
          const results = await recipesStore.getRecipesByCategory(category)
          const pantry = await loadUserPantry()
          for (const recipe of results) {
            const availability = await calculateAvailability(recipe, pantry)
            Object.assign(recipe, availability)
          }
          recipesStore.allRecipes = results
        } catch (error) {
          console.error('Error filtrando:', error)
        } finally {
          searchingExternal.value = false
        }
      }
    }

    const openRecipeDetail = async (recipe) => {
      loadingRecipe.value = true
      showRecipeModal.value = true

      try {
        selectedRecipe.value = recipe

        // Cargar ingredientes si no los tiene
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
          if (recipe.isExternal) {
            const fullRecipe = await recipesStore.getRecipeDetails(recipe.id)
            if (fullRecipe && fullRecipe.ingredients) {
              selectedRecipe.value = fullRecipe
              recipeIngredients.value = fullRecipe.ingredients.map(ing => ({
                ingredient_name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit
              }))
            } else {
              recipeIngredients.value = []
            }
          } else {
            // Receta local - cargar ingredientes
            const ingredients = await loadLocalRecipeIngredients(recipe.id)
            recipeIngredients.value = ingredients
            selectedRecipe.value.ingredients = ingredients
          }
        } else {
          recipeIngredients.value = recipe.ingredients
        }

        // Verificar favorito
        if (!recipe.isExternal) {
          const { data } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', authStore.user?.id)
            .eq('recipe_id', recipe.id)
            .maybeSingle()
          isFavorite.value = !!data
        } else {
          try {
            const { data } = await supabase
              .from('favorite_external_recipes')
              .select('id')
              .eq('user_id', authStore.user?.id)
              .eq('spoonacular_id', recipe.spoonacular_id || recipe.id.replace('spoon_', ''))
              .maybeSingle()
            isFavorite.value = !!data
          } catch (error) {
            console.warn('Error verificando favorito externo:', error)
            isFavorite.value = false
          }
        }

      } catch (error) {
        console.error('Error cargando detalle:', error)
      } finally {
        loadingRecipe.value = false
      }
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
      recipeIngredients.value = []
    }

    const toggleFavorite = async () => {
      if (!selectedRecipe.value) return

      try {
        if (selectedRecipe.value.isExternal) {
          const spoonacularId = selectedRecipe.value.spoonacular_id || selectedRecipe.value.id.replace('spoon_', '')

          if (isFavorite.value) {
            const { error } = await supabase
              .from('favorite_external_recipes')
              .delete()
              .eq('user_id', authStore.user?.id)
              .eq('spoonacular_id', spoonacularId)

            if (error) throw error
            showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')
          } else {
            const { error } = await supabase
              .from('favorite_external_recipes')
              .insert({
                user_id: authStore.user?.id,
                spoonacular_id: spoonacularId,
                recipe_data: {
                  title: selectedRecipe.value.title,
                  image_url: selectedRecipe.value.image_url,
                  total_time: selectedRecipe.value.total_time,
                  servings: selectedRecipe.value.servings,
                  category: selectedRecipe.value.category,
                  tags: selectedRecipe.value.tags
                }
              })

            if (error) throw error
            showNotification('success', 'Agregado', 'Receta agregada a favoritos')
          }
        } else {
          if (isFavorite.value) {
            const { error } = await supabase
              .from('favorites')
              .delete()
              .eq('user_id', authStore.user?.id)
              .eq('recipe_id', selectedRecipe.value.id)

            if (error) throw error
            showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')
          } else {
            const { error } = await supabase
              .from('favorites')
              .insert({
                user_id: authStore.user?.id,
                recipe_id: selectedRecipe.value.id
              })

            if (error) throw error
            showNotification('success', 'Agregado', 'Receta agregada a favoritos')
          }
        }

        isFavorite.value = !isFavorite.value

      } catch (error) {
        console.error('Error actualizando favoritos:', error)
        showNotification('error', 'Error', 'No se pudo actualizar favoritos')
      }
    }

    const addToShoppingList = async () => {
      if (!selectedRecipe.value) return

      try {
        let { data: lists } = await supabase
          .from('shopping_lists')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('status', 'active')
          .limit(1)

        let listId = lists?.[0]?.id
        if (!listId) {
          const { data: newList } = await supabase
            .from('shopping_lists')
            .insert({ user_id: authStore.user?.id, name: 'Lista de Compras', status: 'active' })
            .select()
            .single()
          listId = newList.id
        }

        const ingredients = selectedRecipe.value.ingredients || recipeIngredients.value

        if (ingredients.length > 0) {
          for (const ing of ingredients) {
            const { data: existingIng } = await supabase
              .from('ingredients')
              .select('id')
              .ilike('name', `%${ing.ingredient_name || ing.name}%`)
              .limit(1)
              .maybeSingle()

            if (existingIng) {
              await supabase
                .from('shopping_list_items')
                .upsert({
                  list_id: listId,
                  ingredient_id: existingIng.id,
                  quantity: ing.quantity || 1,
                  unit: ing.unit || 'unidades',
                  notes: `De receta: ${selectedRecipe.value.title}`
                }, { onConflict: 'list_id,ingredient_id' })
            }
          }
          showNotification('success', 'Éxito', 'Ingredientes agregados a la lista')
        } else {
          showNotification('info', 'Información', 'Esta receta no tiene ingredientes registrados')
        }

      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudieron agregar los ingredientes')
      }
    }

    const addToShoppingListFromRecipe = async (recipe) => {
      const original = selectedRecipe.value
      selectedRecipe.value = recipe
      recipeIngredients.value = recipe.ingredients || []
      await addToShoppingList()
      selectedRecipe.value = original
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
        await loadAllRecipes()
      }
    })

    return {
      isMobileMenuOpen,
      categories,
      selectedCategory,
      searchQuery,
      showOnlyAvailable,
      availableCount,
      externalCount,
      totalRecetas,
      displayedRecipes,
      currentPage,
      totalPages,
      loading,
      searchingExternal,
      showRecipeModal,
      selectedRecipe,
      recipeIngredients,
      isFavorite,
      loadingRecipe,
      defaultImage,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      getCategoryLabel,
      translateInstructions,
      debouncedSearch,
      prevPage,
      nextPage,
      toggleAvailableRecipes,
      setSelectedCategory,
      openRecipeDetail,
      closeRecipeModal,
      toggleFavorite,
      addToShoppingList,
      addToShoppingListFromRecipe,
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
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}

.animate-slide-in {
  animation: slide-in 0.3s ease;
}
</style>