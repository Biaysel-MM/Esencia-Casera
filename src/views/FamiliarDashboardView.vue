<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />
    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />
      <main class="pt-20 sm:pt-22 md:pt-25 p-3 sm:p-4 md:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Welcome Section -->
          <div class="bg-linear-to-br from-emerald-50 to-emerald-100/30 rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div class="flex items-center gap-3 sm:gap-5">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-base sm:text-xl font-semibold">
                {{ userInitials }}
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">¡Hola {{ userName }}!</h1>
                <p class="text-xs sm:text-sm text-gray-500">Bienvenido a tu espacio familiar</p>
              </div>
            </div>
          </div>

          <!-- Weekly Menu Section -->
          <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span class="iconify w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" data-icon="mdi:calendar"></span>
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-semibold text-gray-900">Menú de la Semana</h2>
                  <p class="text-xs sm:text-sm text-gray-500">{{ weekRange }}</p>
                </div>
              </div>
              <button @click="refreshWeek" 
                class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm hover:bg-emerald-700 w-full sm:w-auto">
                Refrescar
              </button>
            </div>

            <div v-if="loading" class="flex justify-center py-8 sm:py-12">
              <div class="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>

            <div v-else class="overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
              <div class="flex gap-3 sm:gap-4 min-w-max justify-center">
                <div v-for="day in weekDays" :key="day.name" class="w-28 sm:w-32 md:w-36">
                  <div class="text-center mb-2 sm:mb-3">
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ day.name }}</p>
                    <p class="text-[10px] sm:text-xs text-gray-400">{{ day.date }}</p>
                  </div>
                  <div class="space-y-2">
                    <div v-for="meal in mealTypes" :key="meal.key" class="bg-gray-50 rounded-xl p-2 text-center">
                      <div class="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                        <span class="iconify w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" :data-icon="meal.icon"></span>
                        <p class="text-[10px] sm:text-xs text-gray-500">{{ meal.label }}</p>
                      </div>
                      <div v-if="getMealForDay(day.fullName, meal.key)" class="mt-1">
                        <img :src="getMealForDay(day.fullName, meal.key).image_url || defaultImage" 
                          class="w-full h-12 sm:h-14 md:h-16 object-cover rounded-lg mb-0.5 sm:mb-1">
                        <p class="text-[10px] sm:text-xs font-medium text-gray-700 truncate">{{ getMealForDay(day.fullName, meal.key).title }}</p>
                      </div>
                      <div v-else class="h-14 sm:h-16 md:h-20 flex items-center justify-center">
                        <span class="text-[10px] sm:text-xs text-gray-400">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Surveys Section -->
          <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div class="flex items-center gap-3 mb-4 sm:mb-6">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" data-icon="mdi:vote"></span>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900">Votaciones Activas</h2>
                <p class="text-xs sm:text-sm text-gray-500">Participa para decidir el menú</p>
              </div>
            </div>

            <div v-if="loadingSurveys" class="flex justify-center py-8">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>

            <div v-else-if="activeSurveys.length === 0" class="text-center py-8 text-gray-400">
              <span class="iconify w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" data-icon="mdi:vote-outline"></span>
              <p class="text-sm sm:text-base">No hay votaciones activas</p>
            </div>

            <div v-for="survey in activeSurveys" :key="survey.id" class="border border-gray-200 rounded-xl p-4 sm:p-5 mb-4">
              <div class="mb-3 sm:mb-4">
                <h3 class="text-sm sm:text-base font-semibold text-gray-900">{{ survey.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-500">{{ survey.description }}</p>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[11px] sm:text-xs text-gray-400">
                  <span class="flex items-center gap-1">
                    <span class="iconify w-2.5 h-2.5 sm:w-3 sm:h-3" data-icon="mdi:calendar"></span>
                    Finaliza: {{ formatDate(survey.end_date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="iconify w-2.5 h-2.5 sm:w-3 sm:h-3" data-icon="mdi:account-group"></span>
                    {{ survey.totalVotes }}/{{ familyMembers.length }} participantes
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div v-for="option in survey.options" :key="option.id"
                  @click="vote(survey.id, option.id)"
                  class="bg-white border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
                  :class="hasVoted(survey.id, option.id) ? 'border-emerald-300 bg-emerald-50/30 opacity-75' : 'border-gray-200 hover:border-emerald-200'">
                  <div class="flex gap-2 sm:gap-3 p-2 sm:p-3">
                    <img :src="option.image_url || defaultImage" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm sm:text-base font-medium text-gray-900 line-clamp-1">{{ option.title }}</p>
                      <p class="text-[10px] sm:text-xs text-gray-400">{{ option.total_time }} min · {{ option.servings }} porc.</p>
                      <div class="flex items-center gap-2 mt-1.5 sm:mt-2">
                        <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full transition-all" :style="{ width: getOptionPercentage(option.votes, familyMembers.length) + '%' }"></div>
                        </div>
                        <span class="text-[10px] sm:text-xs font-medium text-gray-600">{{ option.votes }} votos</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="hasVoted(survey.id, option.id)" class="px-2 sm:px-3 pb-2 text-right">
                    <span class="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1 justify-end">
                      <span class="iconify w-2.5 h-2.5 sm:w-3 sm:h-3" data-icon="mdi:check-circle"></span>
                      Tu voto
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Favorites Section -->
          <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
            <div class="flex items-center gap-3 mb-4 sm:mb-6">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900">Mis Recetas Favoritas</h2>
                <p class="text-xs sm:text-sm text-gray-500">{{ myFavorites.length }} recetas guardadas</p>
              </div>
            </div>

            <div v-if="loadingFavorites" class="flex justify-center py-8">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>

            <div v-else-if="myFavorites.length === 0" class="text-center py-8 text-gray-400">
              <span class="iconify w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" data-icon="mdi:heart-outline"></span>
              <p class="text-sm sm:text-base">No tienes recetas favoritas</p>
              <button @click="goToRecipes" class="mt-2 text-emerald-600 hover:underline cursor-pointer text-sm">Explorar recetas</button>
            </div>

            <div v-else class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              <div v-for="recipe in myFavorites" :key="recipe.id"
                @click="goToRecipe(recipe.id)"
                class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
                <div class="relative h-24 sm:h-28 overflow-hidden">
                  <img :src="recipe.image_url || defaultImage" class="w-full h-full object-cover">
                  <div class="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-white/90 rounded-full p-0.5 sm:p-1">
                    <span class="iconify w-3 h-3 sm:w-4 sm:h-4 text-red-500" data-icon="mdi:heart"></span>
                  </div>
                </div>
                <div class="p-2 sm:p-3">
                  <p class="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{{ recipe.title }}</p>
                  <p class="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{{ recipe.total_time }} min · {{ recipe.servings }} porc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" 
      class="fixed top-5 right-3 sm:right-5 z-50 bg-emerald-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in-right text-sm sm:text-base">
      <span class="iconify w-4 h-4 sm:w-5 sm:h-5" :data-icon="toastIcon"></span>
      <span>{{ toastMessage }}</span>
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

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'

const loading = ref(true)
const loadingSurveys = ref(true)
const loadingFavorites = ref(true)
const weekMeals = ref([])
const familyMembers = ref([])
const activeSurveys = ref([])
const myFavorites = ref([])
const userVotes = ref({})
const currentUserId = ref(null)
const familyCode = ref('')
const weekStartDate = ref('')
const weekEndDate = ref('')

const colors = ['bg-emerald-600', 'bg-emerald-500', 'bg-teal-600', 'bg-green-600', 'bg-emerald-700']

const mealTypes = [
  { key: 'desayuno', label: 'Desayuno', icon: 'mdi:weather-sunset-up' },
  { key: 'almuerzo', label: 'Almuerzo', icon: 'mdi:food' },
  { key: 'cena', label: 'Cena', icon: 'mdi:weather-night' }
]

const weekDays = ref([
  { name: 'Lun', fullName: 'Lunes', date: '' },
  { name: 'Mar', fullName: 'Martes', date: '' },
  { name: 'Mié', fullName: 'Miércoles', date: '' },
  { name: 'Jue', fullName: 'Jueves', date: '' },
  { name: 'Vie', fullName: 'Viernes', date: '' },
  { name: 'Sáb', fullName: 'Sábado', date: '' },
  { name: 'Dom', fullName: 'Domingo', date: '' }
])

const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('mdi:check-circle')
const showNotification = (msg, icon = 'mdi:check-circle') => {
  toastMessage.value = msg
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const userName = computed(() => authStore.userName)
const userInitials = computed(() => {
  const name = userName.value || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const weekRange = computed(() => {
  if (!weekStartDate.value || !weekEndDate.value) return 'Cargando...'
  const start = new Date(weekStartDate.value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const end = new Date(weekEndDate.value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  return `${start} - ${end}`
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const getOptionPercentage = (votes, total) => {
  if (total === 0) return 0
  return Math.round((votes / total) * 100)
}

const hasVoted = (surveyId, optionId) => {
  return userVotes.value[surveyId] === optionId
}

const getMealForDay = (dayName, mealType) => {
  return weekMeals.value.find(m => m.day === dayName && m.meal_type === mealType)
}

const vote = async (surveyId, optionId) => {
  if (userVotes.value[surveyId]) {
    const { error: deleteError } = await supabase
      .from('survey_votes')
      .delete()
      .eq('survey_id', surveyId)
      .eq('user_id', currentUserId.value)

    if (deleteError) {
      showNotification('Error al eliminar voto', 'mdi:alert-circle')
      return
    }

    const { error: updateError } = await supabase.rpc('decrement_votes', { option_id: optionId })
    if (updateError) console.error('Error decrementing votes:', updateError)

    delete userVotes.value[surveyId]
    showNotification('Voto eliminado', 'mdi:close-circle')
    await loadSurveys()
    await loadUserVotes()
    return
  }

  const { error } = await supabase
    .from('survey_votes')
    .insert({
      survey_id: surveyId,
      option_id: optionId,
      user_id: currentUserId.value
    })

  if (error) {
    console.error('Error voting:', error)
    showNotification('Error al votar', 'mdi:alert-circle')
    return
  }

  const { error: updateError } = await supabase.rpc('increment_votes', { option_id: optionId })
  if (updateError) console.error('Error updating votes:', updateError)

  userVotes.value[surveyId] = optionId
  showNotification('¡Voto registrado!')
  await loadSurveys()
  await loadUserVotes()
}

const loadFamilyData = async () => {
  try {
    loading.value = true
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_code')
      .eq('id', authStore.user?.id)
      .single()

    if (profileError) throw profileError
    
    if (profile?.family_code) {
      familyCode.value = profile.family_code
      currentUserId.value = authStore.user?.id

      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('family_code', familyCode.value)

      if (membersError) throw membersError

      if (members) {
        familyMembers.value = members.map((m, idx) => ({
          id: m.id,
          name: m.full_name,
          initials: m.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          role: m.role,
          color: colors[idx % colors.length]
        }))
      }

      await loadWeeklyPlanner()
      await loadSurveys()
      await loadUserVotes()
      await loadFavorites()
    }
  } catch (error) {
    console.error('Error loading family data:', error)
    showNotification('Error al cargar datos', 'mdi:alert-circle')
  } finally {
    loading.value = false
  }
}

const loadWeeklyPlanner = async () => {
  try {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : -(day - 1)
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)
    monday.setHours(0, 0, 0, 0)
    
    const weekStartStr = monday.toISOString().split('T')[0]
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    weekStartDate.value = weekStartStr
    weekEndDate.value = sunday.toISOString().split('T')[0]
    
    weekDays.value.forEach((day, idx) => {
      const dateObj = new Date(monday)
      dateObj.setDate(monday.getDate() + idx)
      day.date = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    })
    
    console.log('🔍 Buscando planner para semana:', weekStartStr)

    // BUSCAR TODOS LOS PLANNERS DE LA SEMANA (sin filtrar por usuario)
    const { data: planners, error: plannerError } = await supabase
      .from('weekly_planner')
      .select(`
        id,
        user_id,
        planned_meals (
          id,
          day_of_week,
          meal_type,
          recipe:recipes (
            id,
            title,
            image_url,
            total_time,
            servings
          )
        )
      `)
      .eq('week_start', weekStartStr)

    if (plannerError) {
      console.error('Error buscando planner:', plannerError)
      weekMeals.value = []
      return
    }

    console.log('📊 Planners encontrados:', planners?.length || 0)

    if (!planners || planners.length === 0) {
      console.log('❌ No hay planner para la semana:', weekStartStr)
      weekMeals.value = []
      return
    }

    // Usar el primer planner que tenga comidas
    let selectedPlanner = planners.find(p => p.planned_meals && p.planned_meals.length > 0)
    if (!selectedPlanner && planners.length > 0) {
      selectedPlanner = planners[0]
    }
    
    if (!selectedPlanner) {
      console.log('❌ No se encontró planner con comidas')
      weekMeals.value = []
      return
    }

    console.log('✅ Usando planner ID:', selectedPlanner.id)
    console.log('📋 Comidas en planner:', selectedPlanner.planned_meals?.length || 0)

    if (selectedPlanner.planned_meals && selectedPlanner.planned_meals.length > 0) {
      const dayMap = { 0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo' }
      weekMeals.value = selectedPlanner.planned_meals.map(meal => ({
        id: meal.id,
        day: dayMap[meal.day_of_week],
        day_of_week: meal.day_of_week,
        meal_type: meal.meal_type,
        title: meal.recipe?.title,
        image_url: meal.recipe?.image_url,
        total_time: meal.recipe?.total_time,
        servings: meal.recipe?.servings,
        recipe_id: meal.recipe?.id
      }))
      console.log('🍽️ Comidas cargadas:', weekMeals.value.length)
    } else {
      weekMeals.value = []
    }
  } catch (error) {
    console.error('Error en loadWeeklyPlanner:', error)
    weekMeals.value = []
  }
}

const refreshWeek = () => {
  loadWeeklyPlanner()
  showNotification('Menú actualizado', 'mdi:refresh')
}

const loadUserVotes = async () => {
  try {
    if (!currentUserId.value) return
    
    const { data: votes, error } = await supabase
      .from('survey_votes')
      .select('survey_id, option_id')
      .eq('user_id', currentUserId.value)

    if (error) throw error

    if (votes) {
      const votesMap = {}
      votes.forEach(v => { votesMap[v.survey_id] = v.option_id })
      userVotes.value = votesMap
      console.log('Votos cargados:', votesMap)
    }
  } catch (error) {
    console.error('Error loading user votes:', error)
  }
}

const loadSurveys = async () => {
  try {
    loadingSurveys.value = true
    const today = new Date().toISOString().split('T')[0]

    const { data: surveys, error } = await supabase
      .from('family_surveys')
      .select('*')
      .eq('family_code', familyCode.value)
      .eq('is_active', true)
      .gte('end_date', today)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (surveys) {
      for (const survey of surveys) {
        const { data: options, error: optionsError } = await supabase
          .from('survey_options')
          .select(`
            id,
            votes,
            recipe:recipes (
              id,
              title,
              image_url,
              total_time,
              servings
            )
          `)
          .eq('survey_id', survey.id)

        if (optionsError) throw optionsError

        survey.options = options?.map(o => ({
          id: o.id,
          votes: o.votes || 0,
          title: o.recipe?.title || 'Receta',
          image_url: o.recipe?.image_url,
          total_time: o.recipe?.total_time,
          servings: o.recipe?.servings
        })) || []

        const { count, error: countError } = await supabase
          .from('survey_votes')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id)

        if (countError) throw countError

        survey.totalVotes = count || 0
      }
      activeSurveys.value = surveys
    }
  } catch (error) {
    console.error('Error loading surveys:', error)
  } finally {
    loadingSurveys.value = false
  }
}

const loadFavorites = async () => {
  try {
    loadingFavorites.value = true

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        id,
        recipe:recipes (
          id,
          title,
          total_time,
          servings,
          image_url
        )
      `)
      .eq('user_id', currentUserId.value)
      .order('added_at', { ascending: false })

    if (error) throw error

    myFavorites.value = favorites
      .filter(f => f.recipe)
      .map(f => ({
        id: f.recipe.id,
        title: f.recipe.title,
        total_time: f.recipe.total_time,
        servings: f.recipe.servings,
        image_url: f.recipe.image_url,
        favorite_id: f.id
      }))

  } catch (error) {
    console.error('Error loading favorites:', error)
  } finally {
    loadingFavorites.value = false
  }
}

const goToRecipe = (id) => router.push(`/receta/${id}`)
const goToRecipes = () => router.push('/recetas')

const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const handleLogout = async () => { 
  await authStore.logout() 
  router.push('/login') 
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadFamilyData()
  }
})
</script>

<style scoped>
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-right { animation: slide-in-right 0.3s ease; }
</style>