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
          <!-- Contenido de recetas -->
          <div>
            <!-- Header de recetas -->
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
                  v-if="availableRecipes.length > 0"
                  @click="toggleAvailableRecipes"
                  :class="['flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.5)]', { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': showOnlyAvailable }]"
                >
                  <span class="iconify h-4 w-4" data-icon="mdi:leaf"></span>
                  Con tus ingredientes ({{ availableRecipes.length }})
                </button>
                
                <button 
                  v-for="category in categories" 
                  :key="category"
                  @click="setSelectedCategory(category)"
                  :class="['cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.5)]', { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': selectedCategory === category }]"
                >
                  {{ category }}
                </button>
              </div>
            </div>

            <!-- Grid de recetas -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id"
                class="cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                @click="openRecipeDetail(recipe)"
              >
                <div class="relative h-56 overflow-hidden">
                  <img 
                    :src="recipe.image" 
                    :alt="recipe.name"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="handleImageError"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                  <div class="absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#2C2C2C] backdrop-blur-sm">{{ recipe.type }}</div>
                  <div class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span 
                      v-for="(tag, index) in recipe.tags.slice(0, 2)" 
                      :key="index"
                      class="rounded-md bg-[#5DA271] px-2 py-1 text-[11px] font-medium text-white"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.name }}</h3>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-yellow-500" data-icon="mdi:star"></span>
                      <span>{{ recipe.rating }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                      <span>{{ recipe.time }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:fire"></span>
                      <span>{{ recipe.calories }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="filteredRecipes.length === 0" class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
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

                <div class="flex-1 overflow-y-auto">
                  <div class="relative h-72 overflow-hidden">
                    <img 
                      :src="selectedRecipe?.image" 
                      :alt="selectedRecipe?.name"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                    <div class="absolute left-5 top-5 rounded-xl bg-[#5DA271] px-4 py-2 text-sm font-semibold text-white">{{ selectedRecipe?.type }}</div>
                  </div>

                  <div class="p-8">
                    <div class="mb-8 flex flex-wrap items-start justify-between gap-5">
                      <h2 class="min-w-75 flex-1 text-[28px] font-bold text-[#2C2C2C] leading-tight">{{ selectedRecipe?.name }}</h2>
                      <div class="flex flex-wrap gap-3">
                        <button class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 py-3 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:bg-[#D8EBD0]" @click="addToFavorites">
                          <span class="iconify h-4.5 w-4.5" data-icon="mdi:heart-outline"></span>
                          Favorita
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
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe?.rating }}</p>
                          <p class="text-xs text-[#6C7A6C]">Calificación</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe?.time }}</p>
                          <p class="text-xs text-[#6C7A6C]">Tiempo</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:fire"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe?.calories }}</p>
                          <p class="text-xs text-[#6C7A6C]">Calorías</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                          <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-[#2C2C2C]">{{ selectedRecipe?.servings }}</p>
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
                        <div class="flex flex-col gap-3">
                          <div 
                            v-for="(ingredient, index) in selectedRecipe?.ingredients" 
                            :key="index"
                            class="flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] pb-2 last:border-none"
                          >
                            <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:checkbox-blank-circle-outline"></span>
                            <span class="text-[15px] text-[#2C2C2C]">{{ ingredient.amount }} {{ ingredient.name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Instrucciones -->
                      <div class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6">
                        <h3 class="mb-5 flex items-center gap-2.5 text-lg font-semibold text-[#2C2C2C]">
                          <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:format-list-numbered"></span>
                          Instrucciones
                        </h3>
                        <div class="flex flex-col gap-5">
                          <div 
                            v-for="(step, index) in selectedRecipe?.instructions" 
                            :key="index"
                            class="flex gap-4"
                          >
                            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5DA271] text-sm font-semibold text-white">{{ index + 1 }}</div>
                            <p class="flex-1 text-[15px] text-[#2C2C2C] leading-relaxed">{{ step }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div v-if="selectedRecipe?.tags?.length" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6">
                        <h3 class="mb-5 flex items-center gap-2.5 text-lg font-semibold text-[#2C2C2C]">
                          <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:tag-multiple-outline"></span>
                          Etiquetas
                        </h3>
                        <div class="flex flex-wrap gap-2.5">
                          <span 
                            v-for="tag in selectedRecipe?.tags" 
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'

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

    // Categorías
    const categories = ['Todas', 'Desayuno', 'Almuerzo', 'Cena']
    const selectedCategory = ref('Todas')
    const searchQuery = ref('')
    const showOnlyAvailable = ref(false)
    
    // Estado del modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)

    // Recetas de ejemplo
    const allRecipes = ref([
      {
        id: 1,
        name: 'Bowl de Avena con Frutas',
        type: 'Desayuno',
        time: '15 min',
        servings: 2,
        rating: '4.8',
        calories: '350 cal',
        tags: ['Saludable', 'Rápido', 'Vegano'],
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Avena', amount: '1 taza' },
          { name: 'Leche de almendras', amount: '2 tazas' },
          { name: 'Plátano', amount: '1 unidad' },
          { name: 'Fresas', amount: '10 unidades' },
          { name: 'Miel', amount: '1 cucharada' },
          { name: 'Nueces', amount: '2 cucharadas' }
        ],
        instructions: [
          'Cocinar la avena con la leche de almendras durante 10 minutos.',
          'Mientras tanto, cortar el plátano y las fresas en rodajas.',
          'Servir la avena en un bowl y decorar con las frutas.',
          'Agregar nueces y miel al gusto.'
        ]
      },
      {
        id: 2,
        name: 'Ensalada de Pollo a la Parrilla',
        type: 'Almuerzo',
        time: '30 min',
        servings: 4,
        rating: '4.5',
        calories: '420 cal',
        tags: ['Proteico', 'Fresco', 'Fácil'],
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Pechuga de pollo', amount: '2 unidades' },
          { name: 'Lechuga', amount: '1 cabeza' },
          { name: 'Tomate', amount: '2 unidades' },
          { name: 'Aguacate', amount: '1 unidad' },
          { name: 'Cebolla morada', amount: '1/2 unidad' },
          { name: 'Aceite de oliva', amount: '3 cucharadas' },
          { name: 'Limón', amount: '1 unidad' }
        ],
        instructions: [
          'Marinar el pollo con aceite de oliva, sal y pimienta.',
          'Cocinar el pollo en la parrilla por 6-8 minutos por lado.',
          'Lavar y cortar todas las verduras.',
          'Mezclar las verduras en un bowl grande.',
          'Cortar el pollo en tiras y añadirlo a la ensalada.',
          'Aliñar con aceite de oliva y jugo de limón.'
        ]
      },
      {
        id: 3,
        name: 'Pasta Primavera',
        type: 'Cena',
        time: '25 min',
        servings: 4,
        rating: '4.7',
        calories: '380 cal',
        tags: ['Vegetariano', 'Italiano', 'Completo'],
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Pasta integral', amount: '400g' },
          { name: 'Brócoli', amount: '1 cabeza' },
          { name: 'Zanahoria', amount: '2 unidades' },
          { name: 'Champiñones', amount: '200g' },
          { name: 'Crema para cocinar', amount: '200ml' },
          { name: 'Queso parmesano', amount: '50g' },
          { name: 'Ajo', amount: '2 dientes' }
        ],
        instructions: [
          'Cocinar la pasta según las instrucciones del paquete.',
          'Saltear las verduras en aceite de oliva con ajo.',
          'Agregar la crema y cocinar por 5 minutos.',
          'Mezclar la pasta con la salsa de verduras.',
          'Servir con queso parmesano rallado por encima.'
        ]
      },
      {
        id: 4,
        name: 'Smoothie de Plátano y Espinaca',
        type: 'Desayuno',
        time: '10 min',
        servings: 2,
        rating: '4.6',
        calories: '210 cal',
        tags: ['Rápido', 'Energético', 'Vegano'],
        image: 'https://images.unsplash.com/photo-1577450680941-2011043c55f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Plátano', amount: '2 unidades' },
          { name: 'Espinaca fresca', amount: '2 tazas' },
          { name: 'Leche de almendras', amount: '1 taza' },
          { name: 'Miel', amount: '1 cucharada' },
          { name: 'Hielo', amount: '1 taza' }
        ],
        instructions: [
          'Pelar y cortar los plátanos.',
          'Lavar bien las hojas de espinaca.',
          'Agregar todos los ingredientes a la licuadora.',
          'Licuar hasta obtener una mezcla suave.',
          'Servir inmediatamente.'
        ]
      },
      {
        id: 5,
        name: 'Sopa de Verduras Nutritiva',
        type: 'Almuerzo',
        time: '35 min',
        servings: 6,
        rating: '4.9',
        calories: '280 cal',
        tags: ['Saludable', 'Caliente', 'Confortante'],
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Zanahoria', amount: '3 unidades' },
          { name: 'Apio', amount: '2 tallos' },
          { name: 'Cebolla', amount: '1 unidad' },
          { name: 'Papa', amount: '2 unidades' },
          { name: 'Caldo de verduras', amount: '1.5 litros' },
          { name: 'Aceite de oliva', amount: '2 cucharadas' },
          { name: 'Hierbas frescas', amount: 'al gusto' }
        ],
        instructions: [
          'Picar todas las verduras en cubos pequeños.',
          'Sofreír la cebolla en aceite de oliva hasta que esté transparente.',
          'Agregar el resto de verduras y cocinar por 5 minutos.',
          'Verter el caldo y llevar a ebullición.',
          'Cocinar a fuego lento por 25 minutos.',
          'Triturar ligeramente y agregar hierbas frescas.'
        ]
      },
      {
        id: 6,
        name: 'Tacos Mexicanos Caseros',
        type: 'Cena',
        time: '25 min',
        servings: 4,
        rating: '4.8',
        calories: '450 cal',
        tags: ['Mexicano', 'Picante', 'Fiesta'],
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Tortillas de maíz', amount: '12 unidades' },
          { name: 'Carne molida', amount: '500g' },
          { name: 'Cebolla', amount: '1 unidad' },
          { name: 'Tomate', amount: '2 unidades' },
          { name: 'Lechuga', amount: '1/2 cabeza' },
          { name: 'Queso rallado', amount: '200g' },
          { name: 'Salsa', amount: 'al gusto' }
        ],
        instructions: [
          'Cocinar la carne molida con cebolla picada.',
          'Calentar las tortillas en un comal.',
          'Picar el tomate y la lechuga.',
          'Armar los tacos con carne, verduras y queso.',
          'Servir con salsa al gusto.'
        ]
      }
    ])

    // Simular recetas disponibles
    const availableRecipes = computed(() => {
      return allRecipes.value.filter(recipe => 
        recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes('avena') || 
          ing.name.toLowerCase().includes('pollo')
        )
      )
    })

    // Recetas filtradas
    const filteredRecipes = computed(() => {
      const recipes = showOnlyAvailable.value ? availableRecipes.value : allRecipes.value
      
      return recipes.filter(recipe => {
        const matchesSearch = searchQuery.value === '' || 
          recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
        
        const matchesCategory = selectedCategory.value === 'Todas' || 
          recipe.type === selectedCategory.value
        
        return matchesSearch && matchesCategory
      })
    })

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

    // Funciones de recetas
    const filterRecipes = () => {}

    const toggleAvailableRecipes = () => {
      showOnlyAvailable.value = !showOnlyAvailable.value
    }

    const setSelectedCategory = (category) => {
      selectedCategory.value = category
    }

    const openRecipeDetail = (recipe) => {
      selectedRecipe.value = recipe
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
    }

    const addToFavorites = () => {
      if (selectedRecipe.value) {
        alert(`✅ "${selectedRecipe.value.name}" agregada a favoritos`)
      }
    }

    const addToShoppingList = () => {
      if (selectedRecipe.value) {
        alert(`✅ Ingredientes de "${selectedRecipe.value.name}" agregados a la lista de compras`)
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAyNTBIMzAwVjIwMEgzNTBWMjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      categories,
      selectedCategory,
      searchQuery,
      showOnlyAvailable,
      availableRecipes,
      filteredRecipes,
      showRecipeModal,
      selectedRecipe,
      filterRecipes,
      toggleAvailableRecipes,
      setSelectedCategory,
      openRecipeDetail,
      closeRecipeModal,
      addToFavorites,
      addToShoppingList,
      handleImageError
    }
  }
}
</script>