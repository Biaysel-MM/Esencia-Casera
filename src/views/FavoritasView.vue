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
                <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Favoritas</h1>
                <p class="text-sm text-[#6C7A6C]">{{ favorites.length }} recetas guardadas</p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <!-- Grid de recetas favoritas -->
            <div v-else-if="favorites.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div 
                v-for="recipe in favorites" 
                :key="recipe.id"
                class="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
              >
                <div class="cursor-pointer" @click="openRecipeDetail(recipe)">
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
                    <div class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(93,162,113,0.9)] backdrop-blur-sm">
                      <span class="iconify h-5 w-5 text-white" data-icon="mdi:heart"></span>
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
                    
                    <div class="mb-2 flex items-center justify-between">
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
                    <div class="absolute right-5 top-5 flex h-12.5 w-12.5 items-center justify-center rounded-full bg-[rgba(93,162,113,0.9)] backdrop-blur-sm">
                      <span class="iconify h-6 w-6 text-white" data-icon="mdi:heart"></span>
                    </div>
                  </div>

                  <div class="p-8">
                    <div class="mb-8 flex flex-wrap items-start justify-between gap-5">
                      <h2 class="min-w-75 flex-1 text-[28px] font-bold text-[#2C2C2C] leading-tight">{{ selectedRecipe.title }}</h2>
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
      :style="{ background: toastType === 'success' ? 'linear-gradient(135deg, #5DA271 0%, #8BB174 100%)' : 'linear-gradient(135deg, #d4183d 0%, #b31534 100%)' }">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

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
    const loading = ref(true)
    const favorites = ref([])
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)
    const recipeIngredients = ref([])
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
    
    // Toast notification
    const showToast = ref(false)
    const toastType = ref('success')
    const toastTitle = ref('')
    const toastMessage = ref('')
    const toastIcon = ref('mdi:check-circle')

    const showNotification = (type, title, message, icon = null) => {
      toastType.value = type
      toastTitle.value = title
      toastMessage.value = message
      toastIcon.value = icon || (type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle')
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

    const loadFavorites = async () => {
      try {
        loading.value = true
        
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            recipe:recipes (
              id,
              title,
              description,
              category,
              total_time,
              servings,
              calories_per_serving,
              image_url,
              rating,
              tags,
              steps
            )
          `)
          .eq('user_id', authStore.user?.id)
          .order('added_at', { ascending: false })

        if (error) throw error

        favorites.value = data.map(item => ({
          ...item.recipe,
          favorite_id: item.id
        }))

      } catch (error) {
        console.error('Error cargando favoritos:', error)
        showNotification('error', 'Error', 'No se pudieron cargar tus recetas favoritas')
      } finally {
        loading.value = false
      }
    }

    const loadRecipeIngredients = async (recipeId) => {
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

      } catch (error) {
        console.error('Error cargando ingredientes:', error)
        recipeIngredients.value = []
      }
    }

    const openRecipeDetail = async (recipe) => {
      selectedRecipe.value = recipe
      showRecipeModal.value = true
      await loadRecipeIngredients(recipe.id)
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
      recipeIngredients.value = []
    }

    const removeFromFavorites = async (recipeId) => {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', authStore.user?.id)
          .eq('recipe_id', recipeId)

        if (error) throw error

        favorites.value = favorites.value.filter(r => r.id !== recipeId)
        showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')

      } catch (error) {
        console.error('Error eliminando de favoritos:', error)
        showNotification('error', 'Error', 'No se pudo eliminar de favoritos')
      }
    }

    const addToShoppingList = async () => {
      try {
        if (!selectedRecipe.value) return

        // Buscar lista activa o crear una nueva
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

        // Obtener ingredientes de la receta
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

    const goToRecetas = () => {
      router.push('/recetas')
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
        await loadFavorites()
      }
    })

    return {
      isMobileMenuOpen,
      loading,
      favorites,
      showRecipeModal,
      selectedRecipe,
      recipeIngredients,
      defaultImage,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      getCategoryLabel,
      openRecipeDetail,
      closeRecipeModal,
      removeFromFavorites,
      addToShoppingList,
      goToRecetas,
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
