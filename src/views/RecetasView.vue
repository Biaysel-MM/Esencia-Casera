<!-- src/views/RecetasView.vue - VERSIÓN SIN SPOONACULAR -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-25 p-6">
        <div class="max-w-350 mx-auto">
          <!-- Header con botón Crear Receta -->
          <div class="flex justify-between items-start mb-8 flex-col lg:flex-row gap-4 ">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:book-open"></span>
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Recetas Dominicanas</h1>
                <p class="text-sm text-gray-500">{{ totalRecetas }} recetas compartidas por la comunidad</p>
              </div>
            </div>
            <button @click="goToCreateRecipe"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
              <span class="iconify w-5 h-5" data-icon="mdi:plus-circle"></span>
              Crear receta
            </button>
          </div>

          <!-- Buscador y filtros -->
          <div class="mb-8 space-y-5">
            <div class="relative">
              <span class="iconify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                data-icon="mdi:magnify"></span>
              <input type="text" v-model="searchQuery" @input="debouncedSearch"
                placeholder="Buscar recetas por nombre, ingrediente o tag..."
                class="w-full py-4 pl-12 pr-5 rounded-2xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
            </div>

            <div class="flex flex-wrap gap-2">
              <button v-for="cat in categories" :key="cat.value" @click="selectedCategory = cat.value" :class="[
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-600'
              ]">
                {{ cat.label }}
              </button>
              <button v-if="availableCount > 0" @click="showOnlyAvailable = !showOnlyAvailable" :class="[
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                showOnlyAvailable ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200'
              ]">
                <span class="iconify w-4 h-4 inline mr-1" data-icon="mdi:leaf"></span>
                Con tus ingredientes ({{ availableCount }})
              </button>
            </div>
          </div>

          <!-- Grid de recetas -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>

          <div v-else-if="displayedRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="recipe in displayedRecipes" :key="recipe.id" @click="goToRecipeDetail(recipe.id)"
              class="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all hover:-translate-y-1">
              <div class="relative h-48 overflow-hidden">
                <img :src="getOptimizedImageUrl(recipe.image_url, 'small')" :srcset="getSrcSet(recipe.image_url)"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px" :alt="recipe.title" loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="e => e.target.src = defaultImage">
                <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                <div class="absolute left-3 top-3">
                  <span class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium">
                    {{ getCategoryLabel(recipe.category) }}
                  </span>
                </div>
                <div class="absolute bottom-3 left-3 flex gap-1">
                  <span v-for="tag in (recipe.tags || []).slice(0, 2)" :key="tag"
                    class="px-2 py-0.5 rounded text-[10px] font-medium bg-white/90">
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1">{{ recipe.title }}</h3>
                <p class="text-xs text-gray-400 mb-2">
                  👨‍🍳 Por: {{ recipe.author_name || 'Chef Comunidad' }}
                </p>

                <div class="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>⏱️ {{ recipe.total_time }} min</span>
                  <span>👥 {{ recipe.servings }} porc.</span>
                  <span>⭐ {{ recipe.rating || 'Nueva' }}</span>
                </div>
                <div v-if="recipe.match_percentage !== undefined" class="mb-3">
                  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-600 rounded-full" :style="{ width: recipe.match_percentage + '%' }">
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ recipe.match_percentage }}% de ingredientes disponibles</p>
                </div>
                <div class="flex gap-2 mt-3" v-if="recipe.created_by === authStore.user?.id">
                  <button @click.stop="goToEditRecipe(recipe.id)"
                    class="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                    Editar
                  </button>
                  <button @click.stop="deleteRecipeFromList(recipe.id, recipe.title)"
                    class="py-2 px-3 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700">
                    <Icon icon="mdi:delete" class="w-4 h-4" />
                  </button>
                </div>
                <button v-else @click.stop="goToRecipeDetail(recipe.id)"
                  class="w-full py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  Ver receta
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <span class="iconify w-16 h-16 text-gray-300 mx-auto mb-4" data-icon="mdi:food-off"></span>
            <h3 class="text-xl font-semibold text-gray-900">No se encontraron recetas</h3>
            <p class="text-gray-500 mt-2">Intenta con otros filtros o <button @click="goToCreateRecipe"
                class="text-emerald-600">crea tu propia receta</button></p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { Icon } from '@iconify/vue'
import { getOptimizedImageUrl, getSrcSet } from '@/utils/imageHelper'

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)
const loading = ref(true)
const allRecipes = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const showOnlyAvailable = ref(false)
const defaultImage = 'https://www.canadianturkey.ca/wp-content/uploads/2025/06/banner-recipe-default.jpg'
let searchTimeout = null

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena' },
  { value: 'postre', label: 'Postre' },
  { value: 'snack', label: 'Snack' }
]

const getCategoryLabel = (cat) => {
  const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', postre: 'Postre', snack: 'Snack' }
  return labels[cat] || cat
}

const loadRecipes = async () => {
  loading.value = true
  try {
    // Cargar recetas públicas
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Cargar despensa del usuario para calcular disponibilidad
    const { data: pantry } = await supabase
      .from('user_pantry')
      .select('ingredient_id')
      .eq('user_id', authStore.user?.id)

    const pantryIngredientIds = new Set(pantry?.map(p => p.ingredient_id) || [])

    // Calcular disponibilidad para cada receta
    const recipesWithAvailability = []
    for (const recipe of recipes) {
      const { data: ingredients } = await supabase
        .from('recipe_ingredients')
        .select('ingredient_id')
        .eq('recipe_id', recipe.id)

      const total = ingredients?.length || 0
      const available = ingredients?.filter(ing => pantryIngredientIds.has(ing.ingredient_id)).length || 0
      const matchPercentage = total > 0 ? Math.round((available / total) * 100) : 0

      recipesWithAvailability.push({
        ...recipe,
        total_ingredients: total,
        available_ingredients: available,
        match_percentage: matchPercentage
      })
    }

    allRecipes.value = recipesWithAvailability
  } catch (error) {
    console.error('Error cargando recetas:', error)
  } finally {
    loading.value = false
  }
}

const displayedRecipes = computed(() => {
  let filtered = [...allRecipes.value]

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(r => r.category === selectedCategory.value)
  }

  if (showOnlyAvailable.value) {
    filtered = filtered.filter(r => r.match_percentage === 100)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    )
  }

  return filtered
})

// ✅ Métodos adicionales
const goToEditRecipe = (id) => {
  router.push(`/recetas/editar/${id}`)
}

const deleteRecipeFromList = async (id, title) => {
  if (confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
    try {
      // Verificar que sea el creador
      const recipe = allRecipes.value.find(r => r.id === id)
      if (recipe.created_by !== authStore.user?.id) {
        alert('No tienes permiso para eliminar esta receta')
        return
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('created_by', authStore.user?.id)

      if (error) throw error

      // Recargar lista
      await loadRecipes()

      alert('✅ Receta eliminada')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar')
    }
  }
}

const availableCount = computed(() => allRecipes.value.filter(r => r.match_percentage === 100).length)
const totalRecetas = computed(() => allRecipes.value.length)

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // ya se actualiza por computed
  }, 300)
}

const goToRecipeDetail = (id) => {
  router.push(`/recetas/${id}`)  // ✅ CORRECTO (con S)
}

const goToCreateRecipe = () => {
  router.push('/recetas/crear')
}

const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const handleLogout = async () => { await authStore.logout(); router.push('/login') }

onMounted(() => {
  if (authStore.isAuthenticated) loadRecipes()
})
</script>