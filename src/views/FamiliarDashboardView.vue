<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'overflow-hidden': isMobileMenuOpen }">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Welcome Section -->
          <div class="bg-lienar-to-br from-emerald-50 to-emerald-100/30 rounded-2xl p-6 mb-8">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-semibold">
                {{ userInitials }}
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">¡Hola {{ userName }}!</h1>
                <p class="text-gray-500">Bienvenido a tu espacio familiar</p>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
              <span class="iconify w-8 h-8 text-emerald-600 mx-auto mb-2" data-icon="mdi:account-group"></span>
              <p class="text-2xl font-bold text-gray-900">{{ familyMembers.length }}</p>
              <p class="text-xs text-gray-500">Miembros</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
              <span class="iconify w-8 h-8 text-emerald-600 mx-auto mb-2" data-icon="mdi:vote"></span>
              <p class="text-2xl font-bold text-gray-900">{{ totalVotes }}</p>
              <p class="text-xs text-gray-500">Votos emitidos</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
              <span class="iconify w-8 h-8 text-emerald-600 mx-auto mb-2" data-icon="mdi:food"></span>
              <p class="text-2xl font-bold text-gray-900">{{ votedRecipesCount }}</p>
              <p class="text-xs text-gray-500">Recetas votadas</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
              <span class="iconify w-8 h-8 text-emerald-600 mx-auto mb-2" data-icon="mdi:star"></span>
              <p class="text-2xl font-bold text-gray-900">{{ participationPercentage }}%</p>
              <p class="text-xs text-gray-500">Participación</p>
            </div>
          </div>

          <!-- Weekly Planner Preview -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:calendar"></span>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Menú de la Semana</h2>
                <p class="text-sm text-gray-500">{{ weekRange }}</p>
              </div>
            </div>

            <div class="overflow-x-auto pb-2">
              <div class="flex gap-4 min-w-max">
                <div v-for="day in weekDays" :key="day.name" class="w-36">
                  <div class="text-center mb-3">
                    <p class="font-semibold text-gray-900">{{ day.name }}</p>
                    <p class="text-xs text-gray-400">{{ day.date }}</p>
                  </div>
                  <div class="space-y-2">
                    <div v-for="meal in mealTypes" :key="meal.key" class="bg-gray-50 rounded-xl p-2 text-center">
                      <div class="flex items-center justify-center gap-1 mb-1">
                        <span class="iconify w-3 h-3 text-emerald-600" :data-icon="meal.icon"></span>
                        <p class="text-xs text-gray-500">{{ meal.label }}</p>
                      </div>
                      <div v-if="getMealForDay(day.name, meal.key)" class="mt-1">
                        <img :src="getMealForDay(day.name, meal.key).image_url || defaultImage" 
                             class="w-full h-16 object-cover rounded-lg mb-1">
                        <p class="text-xs font-medium text-gray-700 truncate">{{ getMealForDay(day.name, meal.key).title }}</p>
                      </div>
                      <div v-else class="h-20 flex items-center justify-center">
                        <span class="text-xs text-gray-400">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Voting Section -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:vote"></span>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Votación Semanal</h2>
                  <p class="text-sm text-gray-500">Vota por tus recetas favoritas</p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-sm bg-gray-100 rounded-xl px-3 py-1">
                <span class="iconify w-4 h-4 text-emerald-600" data-icon="mdi:calendar-week"></span>
                <span>{{ weekRange }}</span>
              </div>
            </div>

            <!-- Voting Stats per member -->
            <div class="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Estado de votación por miembro</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div v-for="member in familyMembers" :key="member.id" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" :class="member.color">
                    {{ member.initials }}
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-medium">{{ member.name }}</p>
                    <p class="text-xs" :class="member.hasVoted ? 'text-emerald-600' : 'text-gray-400'">
                      {{ member.hasVoted ? `${member.votesCount} votos` : 'Sin votar' }}
                    </p>
                  </div>
                  <span class="iconify w-4 h-4" :class="member.hasVoted ? 'text-emerald-500' : 'text-gray-300'" 
                        :data-icon="member.hasVoted ? 'mdi:check-circle' : 'mdi:clock-outline'"></span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div v-for="recipe in availableRecipes" :key="recipe.id" 
                   class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div class="relative h-36 overflow-hidden">
                  <img :src="recipe.image_url || defaultImage" :alt="recipe.title" class="w-full h-full object-cover">
                  <div class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs">
                    {{ getCategoryLabel(recipe.category) }}
                  </div>
                  <div class="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5 text-white text-xs flex items-center gap-1">
                    <span class="iconify w-3 h-3" data-icon="mdi:thumb-up"></span>
                    {{ getVoteCount(recipe.id) }}
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1">{{ recipe.title }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span class="iconify w-3 h-3" data-icon="mdi:clock-outline"></span>
                    <span>{{ recipe.total_time }} min</span>
                    <span class="iconify w-3 h-3 ml-1" data-icon="mdi:account-group-outline"></span>
                    <span>{{ recipe.servings }} porc.</span>
                  </div>
                  
                  <!-- Who voted for this recipe -->
                  <div class="flex flex-wrap gap-1 mb-3">
                    <div v-for="member in familyMembers" :key="member.id"
                         @click="toggleVote(recipe.id, member.id)"
                         class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-all"
                         :class="[member.color, hasVoted(recipe.id, member.id) ? 'ring-2 ring-offset-1 ring-emerald-500 scale-110' : 'opacity-50']"
                         :title="member.name">
                      {{ member.initials }}
                    </div>
                  </div>

                  <button @click="toggleCurrentUserVote(recipe.id)"
                    class="w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                    :class="hasVoted(recipe.id, currentUserId) 
                      ? 'bg-emerald-600 text-white' 
                      : 'border border-gray-200 text-gray-700 hover:bg-emerald-50'">
                    <span class="iconify w-4 h-4" :data-icon="hasVoted(recipe.id, currentUserId) ? 'mdi:check' : 'mdi:thumb-up'"></span>
                    {{ hasVoted(recipe.id, currentUserId) ? 'Ya votaste' : 'Votar' }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="availableRecipes.length === 0" class="text-center py-8 text-gray-400">
              <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:food-off"></span>
              <p>No hay recetas disponibles para votar</p>
            </div>
          </div>

          <!-- Favorites Section -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Recetas Favoritas de la Familia</h2>
                <p class="text-sm text-gray-500">Recetas más votadas esta semana</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="recipe in topVotedRecipes" :key="recipe.id"
                   class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                   @click="goToRecipe(recipe.id)">
                <div class="relative h-28 overflow-hidden">
                  <img :src="recipe.image_url || defaultImage" class="w-full h-full object-cover">
                  <div class="absolute bottom-1 right-1 bg-black/60 rounded-full px-2 py-0.5 text-white text-xs flex items-center gap-1">
                    <span class="iconify w-3 h-3" data-icon="mdi:thumb-up"></span>
                    {{ recipe.voteCount }}
                  </div>
                </div>
                <div class="p-3">
                  <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ recipe.title }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <div v-for="voter in recipe.voters" :key="voter.id" 
                         class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                         :class="voter.color" :title="voter.name">
                      {{ voter.initials }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="topVotedRecipes.length === 0" class="text-center py-8 text-gray-400">
              <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:heart-outline"></span>
              <p>Aún no hay recetas votadas esta semana</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
      <span class="iconify w-5 h-5" :data-icon="toastIcon"></span>
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

// Layout
const isMobileMenuOpen = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'

// Data
const loading = ref(true)
const weekMeals = ref([])
const availableRecipes = ref([])
const familyMembers = ref([])
const votes = ref({})
const currentUserId = ref(null)
const weekStart = ref('')
const weekEnd = ref('')

// Colors
const colors = ['bg-emerald-600', 'bg-emerald-500', 'bg-teal-600', 'bg-green-600', 'bg-emerald-700', 'bg-teal-500']

// Meal types with icons
const mealTypes = [
  { key: 'desayuno', label: 'Desayuno', icon: 'mdi:weather-sunset-up' },
  { key: 'almuerzo', label: 'Almuerzo', icon: 'mdi:food' },
  { key: 'cena', label: 'Cena', icon: 'mdi:weather-night' }
]

// Week days
const weekDays = ref([
  { name: 'Lun', fullName: 'Lunes', date: '' },
  { name: 'Mar', fullName: 'Martes', date: '' },
  { name: 'Mié', fullName: 'Miércoles', date: '' },
  { name: 'Jue', fullName: 'Jueves', date: '' },
  { name: 'Vie', fullName: 'Viernes', date: '' },
  { name: 'Sáb', fullName: 'Sábado', date: '' },
  { name: 'Dom', fullName: 'Domingo', date: '' }
])

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('mdi:check-circle')
const showNotification = (msg, icon = 'mdi:check-circle') => {
  toastMessage.value = msg
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// Computed
const userName = computed(() => authStore.userName)
const userInitials = computed(() => {
  const name = userName.value || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const weekRange = computed(() => {
  if (!weekStart.value || !weekEnd.value) return 'Cargando...'
  const start = new Date(weekStart.value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const end = new Date(weekEnd.value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  return `${start} - ${end}`
})

const totalVotes = computed(() => Object.values(votes.value).reduce((acc, arr) => acc + arr.length, 0))
const votedRecipesCount = computed(() => Object.keys(votes.value).length)

const participationPercentage = computed(() => {
  const totalPossible = availableRecipes.value.length * familyMembers.value.length
  if (totalPossible === 0) return 0
  return Math.round((totalVotes.value / totalPossible) * 100)
})

const topVotedRecipes = computed(() => {
  return [...availableRecipes.value]
    .map(recipe => ({
      ...recipe,
      voteCount: getVoteCount(recipe.id),
      voters: getVotersForRecipe(recipe.id)
    }))
    .filter(r => r.voteCount > 0)
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 8)
})

// Methods
const getCategoryLabel = (cat) => {
  const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', postre: 'Postre', snack: 'Snack' }
  return labels[cat] || cat
}

const getWeekDates = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(today.setDate(diff))
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

const getMealForDay = (dayName, mealType) => {
  const dayMap = { Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles', Jue: 'Jueves', Vie: 'Viernes', Sáb: 'Sábado', Dom: 'Domingo' }
  const fullDay = dayMap[dayName]
  return weekMeals.value.find(m => m.day === fullDay && m.meal_type === mealType)
}

const getVoteCount = (recipeId) => votes.value[recipeId]?.length || 0
const hasVoted = (recipeId, memberId) => votes.value[recipeId]?.includes(memberId) || false

const getVotersForRecipe = (recipeId) => {
  const voterIds = votes.value[recipeId] || []
  return familyMembers.value
    .filter(m => voterIds.includes(m.id))
    .map(m => ({ id: m.id, name: m.name, initials: m.initials, color: m.color }))
}

const toggleVote = async (recipeId, memberId) => {
  const currentVotes = votes.value[recipeId] || []
  
  let newVotes
  if (currentVotes.includes(memberId)) {
    newVotes = currentVotes.filter(id => id !== memberId)
  } else {
    newVotes = [...currentVotes, memberId]
  }
  
  votes.value = { ...votes.value, [recipeId]: newVotes }
  
  // Actualizar estado de votación de miembros
  updateMemberVoteStatus()
  
  // Guardar en Supabase
  try {
    const { error } = await supabase
      .from('family_votes')
      .upsert({
        family_id: authStore.user?.id,
        recipe_id: recipeId,
        week_start: weekStart.value,
        votes: newVotes,
        created_by: currentUserId.value
      }, { onConflict: 'family_id,recipe_id,week_start' })
    
    if (error) throw error
    
    const action = currentVotes.includes(memberId) ? 'eliminado' : 'registrado'
    showNotification(`Voto ${action} correctamente`)
  } catch (error) {
    console.error('Error guardando voto:', error)
    showNotification('Error al guardar el voto', 'mdi:alert-circle')
  }
}

const toggleCurrentUserVote = (recipeId) => {
  toggleVote(recipeId, currentUserId.value)
}

const updateMemberVoteStatus = () => {
  familyMembers.value = familyMembers.value.map(member => {
    let votesCount = 0
    Object.values(votes.value).forEach(recipeVotes => {
      if (recipeVotes.includes(member.id)) votesCount++
    })
    return {
      ...member,
      hasVoted: votesCount > 0,
      votesCount
    }
  })
}

const goToRecipe = (recipeId) => {
  router.push(`/receta/${recipeId}`)
}

// Load data
const loadFamilyData = async () => {
  try {
    // Obtener fechas de la semana
    const dates = getWeekDates()
    weekStart.value = dates.start
    weekEnd.value = dates.end
    
    // Actualizar fechas en weekDays
    const startDate = new Date(weekStart.value)
    weekDays.value.forEach((day, idx) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + idx)
      day.date = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    })
    
    // Obtener familia del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_code')
      .eq('id', authStore.user?.id)
      .single()

    if (profile?.family_code) {
      // Obtener miembros de la familia
      const { data: members } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('family_code', profile.family_code)

      if (members) {
        familyMembers.value = members.map((m, idx) => ({
          id: m.id,
          name: m.full_name,
          initials: m.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          role: m.role,
          color: colors[idx % colors.length],
          hasVoted: false,
          votesCount: 0
        }))
        
        currentUserId.value = authStore.user?.id
      }
    } else {
      // Usuario sin familia, solo él mismo
      familyMembers.value = [{
        id: authStore.user?.id,
        name: userName.value,
        initials: userInitials.value,
        role: 'admin',
        color: colors[0],
        hasVoted: false,
        votesCount: 0
      }]
      currentUserId.value = authStore.user?.id
    }

    // Cargar recetas disponibles
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, title, category, total_time, servings, image_url')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(12)

    availableRecipes.value = recipes || []

    // Cargar votos existentes
    const { data: existingVotes } = await supabase
      .from('family_votes')
      .select('recipe_id, votes')
      .eq('week_start', weekStart.value)

    if (existingVotes) {
      const votesMap = {}
      existingVotes.forEach(v => {
        votesMap[v.recipe_id] = v.votes || []
      })
      votes.value = votesMap
    }

    // Actualizar estado de votación de miembros
    updateMemberVoteStatus()

    // Cargar planner semanal
    const { data: planner } = await supabase
      .from('weekly_planner')
      .select(`
        id,
        planned_meals (
          day_of_week,
          meal_type,
          recipe:recipes (id, title, image_url)
        )
      `)
      .eq('user_id', authStore.user?.id)
      .eq('week_start', weekStart.value)
      .maybeSingle()

    if (planner?.planned_meals) {
      const dayMap = { 0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo' }
      weekMeals.value = planner.planned_meals.map(meal => ({
        day: dayMap[meal.day_of_week],
        meal_type: meal.meal_type,
        title: meal.recipe?.title,
        image_url: meal.recipe?.image_url
      }))
    }

  } catch (error) {
    console.error('Error cargando datos familiares:', error)
    showNotification('Error al cargar datos', 'mdi:alert-circle')
  } finally {
    loading.value = false
  }
}

// Layout
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const handleLogout = async () => { await authStore.logout(); router.push('/login') }

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadFamilyData()
  }
})
</script>