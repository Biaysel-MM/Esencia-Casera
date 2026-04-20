<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu"
      class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full"
      :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout"
        class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5 md:p-6">
          <div>
            <div class="mb-8 flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Mis Favoritas</h1>
                <p class="text-sm text-[#6C7A6C]">{{ favorites.length }} recetas guardadas</p>
              </div>
            </div>

            <div v-if="loading" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <div v-else-if="favorites.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div v-for="recipe in favorites" :key="recipe.id"
                class="group cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                @click="goToRecipeDetail(recipe.id)">
                <div class="relative h-56 overflow-hidden">
                  <img :src="recipe.image_url || defaultImage" :alt="recipe.title"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="handleImageError" />
                  <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                  <div class="absolute left-3 top-3">
                    <span class="rounded-lg bg-[#5DA271] px-3 py-1.5 text-xs font-medium text-white">
                      {{ getCategoryLabel(recipe.category) }}
                    </span>
                  </div>

                  <div class="absolute right-3 top-3">
                    <div class="flex items-center gap-1 rounded-lg bg-[rgba(93,162,113,0.9)] px-2 py-1 text-white text-xs backdrop-blur-sm">
                      <span class="iconify w-3 h-3" data-icon="mdi:heart"></span>
                      <span>Favorita</span>
                    </div>
                  </div>

                  <div class="absolute bottom-3 left-3 flex gap-1">
                    <span v-for="(tag, idx) in (recipe.tags || []).slice(0, 2)" :key="idx"
                      class="rounded px-2 py-0.5 text-[10px] font-medium bg-white/90 text-[#2C2C2C]">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <h3 class="mb-3 text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.title }}</h3>

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

                  <div class="flex gap-2">
                    <button @click.stop="goToRecipeDetail(recipe.id)"
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

            <div v-else class="mt-10 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-15 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
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
          </div>
        </div>
      </main>
    </div>

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
  components: { Sidebar, Header },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)
    const loading = ref(true)
    const favorites = ref([])
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'

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
      const labels = { 'desayuno': 'Desayuno', 'almuerzo': 'Almuerzo', 'cena': 'Cena', 'postre': 'Postre', 'snack': 'Snack' }
      return labels[category] || category || 'Receta'
    }

    const goToRecipeDetail = (id) => {
      router.push(`/recetas/${id}`)  // ✅ Ruta corregida
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

        favorites.value = data
          .filter(item => item.recipe && item.recipe.is_public !== false)
          .map(item => ({ ...item.recipe, favorite_id: item.id }))

      } catch (error) {
        console.error('Error cargando favoritos:', error)
        showNotification('error', 'Error', 'No se pudieron cargar tus recetas favoritas')
      } finally {
        loading.value = false
      }
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

    const goToRecetas = () => {
      router.push('/recetas')
    }

    const handleImageError = (event) => {
      event.target.src = defaultImage
    }

    const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
    const closeMobileMenu = () => { isMobileMenuOpen.value = false }

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
      defaultImage,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      getCategoryLabel,
      goToRecipeDetail,
      removeFromFavorites,
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
.animate-slide-in-right { animation: slide-in-right 0.3s ease; }
</style>