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
          <!-- Contenido de favoritas -->
          <div>
            <!-- Header de favoritas -->
            <div class="mb-8 flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Favoritas</h1>
                <p class="text-sm text-[#6C7A6C]">{{ favorites.length }} recetas guardadas</p>
              </div>
            </div>

            <!-- Grid de recetas favoritas -->
            <div v-if="favorites.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div 
                v-for="recipe in favorites" 
                :key="recipe.id"
                class="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
              >
                <div 
                  class="cursor-pointer"
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
                    <div class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(93,162,113,0.9)] backdrop-blur-sm">
                      <span class="iconify h-5 w-5 text-white" data-icon="mdi:heart"></span>
                    </div>
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
                    
                    <div class="mb-2 flex items-center justify-between">
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

                <div class="px-5 pb-5 pt-0">
                  <button 
                    class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#d4183d] bg-transparent px-4 py-3.5 text-sm font-medium text-[#d4183d] transition-all duration-200 hover:-translate-y-px hover:bg-[#d4183d] hover:text-white hover:shadow-[0_4px_12px_rgba(212,24,61,0.2)]"
                    @click="removeFromFavorites(recipe.id)"
                  >
                    <span class="iconify h-4.5 w-4.5" data-icon="mdi:trash-can-outline"></span>
                    Eliminar de favoritos
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mx-auto mb-5 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:heart-outline"></span>
              </div>
              <h3 class="mb-2 text-xl font-semibold text-[#2C2C2C]">No tienes recetas favoritas aún</h3>
              <p class="mx-auto mb-6 max-w-md text-[15px] text-[#6C7A6C]">
                Explora recetas y agrégalas a favoritos para encontrarlas fácilmente
              </p>
              <button 
                class="cursor-pointer rounded-xl bg-[#5DA271] px-7 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-[0_4px_12px_rgba(93,162,113,0.2)]"
                @click="goToRecetas"
              >
                Explorar recetas
              </button>
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
                    <div class="absolute right-5 top-5 flex h-12.5 w-12.5 items-center justify-center rounded-full bg-[rgba(93,162,113,0.9)] backdrop-blur-sm">
                      <span class="iconify h-6 w-6 text-white" data-icon="mdi:heart"></span>
                    </div>
                  </div>

                  <div class="p-8">
                    <div class="mb-8 flex flex-wrap items-start justify-between gap-5">
                      <h2 class="min-w-75 flex-1 text-[28px] font-bold text-[#2C2C2C] leading-tight">{{ selectedRecipe?.name }}</h2>
                      <div class="flex flex-wrap gap-3">
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
  name: 'FavoritasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)

    // Estado del modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)

    // Recetas favoritas de ejemplo
    const favorites = ref([
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
      }
    ])

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

    // Funciones de favoritas
    const openRecipeDetail = (recipe) => {
      selectedRecipe.value = recipe
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
    }

    const removeFromFavorites = (recipeId) => {
      favorites.value = favorites.value.filter(recipe => recipe.id !== recipeId)
      alert('❌ Receta eliminada de favoritos')
    }

    const addToShoppingList = () => {
      if (selectedRecipe.value) {
        alert(`✅ Ingredientes de "${selectedRecipe.value.name}" agregados a la lista de compras`)
      }
    }

    const goToRecetas = () => {
      router.push('/recetas')
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAyNTBIMzAwVjIwMEgzNTBWMjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      favorites,
      showRecipeModal,
      selectedRecipe,
      openRecipeDetail,
      closeRecipeModal,
      removeFromFavorites,
      addToShoppingList,
      goToRecetas,
      handleImageError
    }
  }
}
</script>