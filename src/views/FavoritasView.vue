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
            <!-- Header mejorado -->
            <div class="mb-8 flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Mis Favoritas</h1>
                <p class="text-sm text-[#6C7A6C]">{{ favorites.length }} recetas guardadas</p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <!-- Grid de recetas favoritas (mismo diseño que RecetasView) -->
            <div v-else-if="favorites.length > 0"
              class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div v-for="recipe in favorites" :key="recipe.id"
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

                  <!-- Badge de favorito -->
                  <div class="absolute right-3 top-3">
                    <div class="flex items-center gap-1 rounded-lg bg-[rgba(93,162,113,0.9)] px-2 py-1 text-white text-xs backdrop-blur-sm">
                      <span class="iconify w-3 h-3" data-icon="mdi:heart"></span>
                      <span>Favorita</span>
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
                      <span>{{ recipe.total_time }} min</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                      <span>{{ recipe.servings }} porciones</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:fire"></span>
                      <span>{{ recipe.calories_per_serving || '--' }} kcal</span>
                    </div>
                  </div>

                  <!-- Barra de progreso de ingredientes (opcional) -->
                  <div v-if="recipe.available_ingredients !== undefined" class="mb-4">
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-[#6C7A6C]">Ingredientes disponibles</span>
                      <span class="font-medium text-[#5DA271]">
                        {{ recipe.available_ingredients || 0 }}/{{ recipe.total_ingredients || 0 }}
                      </span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#E8F0E8]">
                      <div class="h-full rounded-full transition-all duration-300" :style="{
                        width: ((recipe.available_ingredients || 0) / (recipe.total_ingredients || 1) * 100) + '%',
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
                    <button @click.stop="removeFromFavorites(recipe.id)"
                      class="rounded-xl border border-red-200 bg-white px-3 py-2.5 transition-all duration-200 hover:bg-red-50 hover:border-red-400"
                      title="Eliminar de favoritos">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:heart-broken"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío mejorado -->
            <div v-else
              class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mx-auto mb-5 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:heart-outline"></span>
              </div>
              <h3 class="mb-2 text-xl font-semibold text-[#2C2C2C]">No tienes recetas favoritas aún</h3>
              <p class="mx-auto max-w-md text-[15px] text-[#6C7A6C]">
                Explora recetas y haz clic en el corazón para guardar tus favoritas
              </p>
              <button @click="goToRecetas"
                class="mt-4 cursor-pointer rounded-xl bg-[#5DA271] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)] hover:-translate-y-px hover:shadow-lg">
                Explorar recetas
              </button>
            </div>

            <!-- Modal de detalle de receta (mismo diseño que RecetasView) -->
            <div v-if="showRecipeModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 backdrop-blur-sm"
              @click="closeRecipeModal">
              <div class="rounded-2xl max-w-225 w-full max-h-[90vh] overflow-y-auto relative bg-white shadow-2xl"
                @click.stop>
                <button @click="closeRecipeModal"
                  class="absolute top-4 right-4 w-10 h-10 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white flex items-center justify-center z-10 transition-all duration-200 hover:bg-[#D8EBD0]">
                  <span class="iconify w-5 h-5 text-[#2C2C2C]" data-icon="mdi:close"></span>
                </button>

                <div v-if="loadingRecipe" class="flex flex-col items-center justify-center min-h-75">
                  <div class="w-10 h-10 border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271] rounded-full animate-spin mb-4"></div>
                  <p class="text-[#6C7A6C]">Cargando receta...</p>
                </div>

                <div v-else-if="selectedRecipe">
                  <div class="relative h-75 overflow-hidden rounded-t-2xl">
                    <img :src="selectedRecipe.image_url || defaultImage" :alt="selectedRecipe.title"
                      class="w-full h-full object-cover" @error="handleImageError">
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                    <div class="absolute left-5 top-5 rounded-xl bg-[#5DA271] px-4 py-2 text-sm font-semibold text-white">
                      {{ getCategoryLabel(selectedRecipe.category) }}
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 class="text-3xl font-bold mb-2">{{ selectedRecipe.title }}</h2>
                    </div>
                  </div>

                  <div class="p-8">
                    <!-- Métricas de la receta -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-[rgba(168,213,186,0.1)]">
                      <div class="text-center">
                        <span class="block text-lg font-semibold text-[#2C2C2C]">{{ selectedRecipe.total_time }} min</span>
                        <span class="text-xs text-[#6C7A6C]">Tiempo</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold text-[#2C2C2C]">{{ selectedRecipe.servings }}</span>
                        <span class="text-xs text-[#6C7A6C]">Porciones</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold text-[#2C2C2C]">{{ selectedRecipe.calories_per_serving || '--' }} kcal</span>
                        <span class="text-xs text-[#6C7A6C]">Calorías</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-lg font-semibold text-[#2C2C2C]">{{ selectedRecipe.rating || 'Nuevo' }}</span>
                        <span class="text-xs text-[#6C7A6C]">Calificación</span>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex gap-4 mb-8">
                      <button @click="toggleFavorite"
                        class="flex-1 py-3 rounded-xl border border-[rgba(0,0,0,0.08)] font-medium transition-all duration-200 bg-white text-[#2C2C2C] hover:bg-[#D8EBD0] hover:border-[#5DA271]">
                        <span class="iconify w-5 h-5 inline mr-2" :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                        {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
                      </button>
                      <button @click="addToShoppingList"
                        class="flex-1 py-3 rounded-xl bg-[#5DA271] text-white font-medium transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
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
                            <span class="iconify w-4 h-4 text-[#5DA271]" data-icon="mdi:checkbox-blank-circle-outline"></span>
                            <span>{{ ing.ingredient_name }}</span>
                          </span>
                          <span class="font-medium text-[#5DA271]">{{ ing.quantity }} {{ ing.unit }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Instrucciones -->
                    <div v-if="selectedRecipe.steps && selectedRecipe.steps.length > 0" class="mb-8">
                      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-[#2C2C2C]">
                        <span class="iconify w-5 h-5 text-[#5DA271]" data-icon="mdi:format-list-numbered"></span>
                        Instrucciones
                      </h3>
                      <div class="flex flex-col gap-4">
                        <div v-for="(step, idx) in selectedRecipe.steps" :key="idx" class="flex gap-3">
                          <div class="w-8 h-8 rounded-full bg-[#5DA271] flex items-center justify-center font-semibold text-white shrink-0">
                            {{ idx + 1 }}
                          </div>
                          <p class="text-sm leading-relaxed text-[#2C2C2C]">{{ step.step || step.description || step }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Tags -->
                    <div v-if="selectedRecipe.tags && selectedRecipe.tags.length > 0">
                      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-[#2C2C2C]">
                        <span class="iconify w-5 h-5 text-[#5DA271]" data-icon="mdi:tag-multiple-outline"></span>
                        Etiquetas
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="tag in selectedRecipe.tags" :key="tag"
                          class="rounded-full border border-[rgba(93,162,113,0.3)] bg-[rgba(168,213,186,0.2)] px-3.5 py-1.5 text-[13px] font-medium text-[#5DA271]">
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
    const loadingRecipe = ref(false)
    const favorites = ref([])
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)
    const recipeIngredients = ref([])
    const isFavorite = ref(false)
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
              steps,
              is_public
            )
          `)
          .eq('user_id', authStore.user?.id)
          .order('added_at', { ascending: false })

        if (error) throw error

        // Filtrar solo recetas públicas
        favorites.value = data
          .filter(item => item.recipe && item.recipe.is_public !== false)
          .map(item => ({
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
      isFavorite.value = true // Ya que viene de favoritos
      loadingRecipe.value = true
      showRecipeModal.value = true
      await loadRecipeIngredients(recipe.id)
      loadingRecipe.value = false
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

    const toggleFavorite = async () => {
      if (!selectedRecipe.value) return

      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', authStore.user?.id)
          .eq('recipe_id', selectedRecipe.value.id)

        if (error) throw error

        isFavorite.value = false
        
        // Actualizar la lista de favoritos local
        favorites.value = favorites.value.filter(r => r.id !== selectedRecipe.value.id)
        
        showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')
        
        // Si la receta que estamos viendo ya no está en favoritos, cerrar modal
        closeRecipeModal()

      } catch (error) {
        console.error('Error eliminando de favoritos:', error)
        showNotification('error', 'Error', 'No se pudo eliminar de favoritos')
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
      loadingRecipe,
      favorites,
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
      openRecipeDetail,
      closeRecipeModal,
      removeFromFavorites,
      toggleFavorite,
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
</style>