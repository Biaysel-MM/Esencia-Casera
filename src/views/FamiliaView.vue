<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-25 p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="flex justify-between items-center flex-wrap gap-4 mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:account-group"></span>
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Gestión Familiar</h1>
                <p class="text-sm text-gray-500">Administra tu grupo familiar y las votaciones</p>
              </div>
            </div>
            <button @click="openCreateSurveyModal"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 cursor-pointer transition-all">
              <span class="iconify w-5 h-5" data-icon="mdi:plus-circle"></span>
              Nueva votación
            </button>
          </div>

          <!-- Family Code Card -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:pound"></span>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Código de Familia</h2>
                  <p class="text-sm text-gray-500">Comparte este código con tus familiares para que se unan</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="px-4 py-2 bg-gray-100 rounded-xl font-mono text-lg font-bold text-emerald-600">
                  {{ familyCode }}
                </div>
                <button @click="copyFamilyCode"
                  class="px-4 py-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer transition-all">
                  <span class="iconify w-5 h-5" data-icon="mdi:content-copy"></span>
                  Copiar
                </button>
                <button @click="regenerateFamilyCode"
                  class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-all">
                  <span class="iconify w-5 h-5" data-icon="mdi:refresh"></span>
                  Regenerar
                </button>
              </div>
            </div>
          </div>

          <!-- Family Members -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-5">Miembros de la familia</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="member in familyMembers" :key="member.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  :class="member.color">
                  {{ member.initials }}
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-400">{{ member.role === 'admin' ? 'Administrador' : 'Familiar' }}</p>
                </div>
                <button v-if="member.id !== currentUserId && familyMembers.length > 1"
                  @click="removeMember(member.id, member.name)"
                  class="text-red-400 hover:text-red-600 cursor-pointer transition-all">
                  <span class="iconify w-5 h-5" data-icon="mdi:delete-outline"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Active Surveys -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:vote"></span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Votaciones Activas</h2>
            </div>

            <div v-if="loadingSurveys" class="flex justify-center py-8">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>

            <div v-else-if="activeSurveys.length === 0" class="text-center py-8 text-gray-400">
              <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:vote-outline"></span>
              <p>No hay votaciones activas</p>
              <button @click="openCreateSurveyModal" class="mt-2 text-emerald-600 hover:underline cursor-pointer">Crear una nueva</button>
            </div>

            <div v-for="survey in activeSurveys" :key="survey.id" class="border border-gray-200 rounded-xl p-5 mb-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ survey.title }}</h3>
                  <p class="text-sm text-gray-500">{{ survey.description }}</p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <span class="iconify w-3 h-3" data-icon="mdi:food"></span>
                      {{ getMealLabel(survey.meal_type) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="iconify w-3 h-3" data-icon="mdi:calendar"></span>
                      {{ formatDate(survey.start_date) }} - {{ formatDate(survey.end_date) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="iconify w-3 h-3" data-icon="mdi:account-group"></span>
                      {{ survey.totalVotes || 0 }}/{{ familyMembers.length }} votos
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="editSurvey(survey)"
                    class="text-gray-400 hover:text-emerald-600 cursor-pointer transition-all">
                    <span class="iconify w-5 h-5" data-icon="mdi:pencil"></span>
                  </button>
                  <button @click="deleteSurvey(survey.id)"
                    class="text-gray-400 hover:text-red-500 cursor-pointer transition-all">
                    <span class="iconify w-5 h-5" data-icon="mdi:delete"></span>
                  </button>
                </div>
              </div>

              <!-- Options / Recipes -->
              <div class="mt-4 space-y-3">
                <div v-for="option in survey.options" :key="option.id" class="flex items-center justify-between">
                  <div class="flex items-center gap-3 flex-1">
                    <img :src="option.image_url || defaultImage" class="w-10 h-10 rounded-lg object-cover">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ option.title }}</p>
                      <p class="text-xs text-gray-400">{{ option.total_time }} min · {{ option.servings }} porc.</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full"
                        :style="{ width: getOptionPercentage(option.votes, familyMembers.length) + '%' }"></div>
                    </div>
                    <span class="text-sm font-medium w-12">{{ option.votes || 0 }} votos</span>
                    <button @click="removeOption(option.id)" class="text-gray-400 hover:text-red-500">
                      <span class="iconify w-4 h-4" data-icon="mdi:close"></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Participación familiar -->
              <div class="mt-4 pt-3 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-500 mb-2">👥 Participación familiar:</p>
                <div class="flex flex-wrap gap-2">
                  <div v-for="member in familyMembers" :key="member.id"
                    class="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                    :class="hasMemberVoted(survey.id, member.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'">
                    <span class="iconify w-3 h-3"
                      :data-icon="hasMemberVoted(survey.id, member.id) ? 'mdi:check-circle' : 'mdi:clock-outline'"></span>
                    <span>{{ member.initials }}</span>
                  </div>
                </div>
              </div>

              <button @click="openAddOptionModal(survey.id)"
                class="mt-3 text-sm text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
                <span class="iconify w-4 h-4" data-icon="mdi:plus"></span>
                Agregar receta
              </button>
            </div>
          </div>

          <!-- Past Surveys -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-gray-500" data-icon="mdi:history"></span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Votaciones Pasadas</h2>
            </div>

            <div v-if="loadingPast" class="flex justify-center py-6">
              <div class="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>

            <div v-else-if="pastSurveys.length === 0" class="text-center py-6 text-gray-400">
              <p>No hay votaciones pasadas</p>
            </div>

            <div v-for="survey in pastSurveys" :key="survey.id" class="border border-gray-200 rounded-xl p-4 mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ survey.title }}</h3>
                  <p class="text-sm text-gray-500">{{ survey.description }}</p>
                  <div class="text-xs text-gray-400 mt-1">
                    Finalizó el {{ formatDate(survey.end_date) }}
                  </div>
                </div>
                <div v-if="survey.winner"
                  class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  Ganador: {{ survey.winner.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Survey Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4"
      @click="closeCreateModal">
      <div class="bg-white rounded-2xl max-w-md w-full" @click.stop>
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Nueva Votación</h3>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input v-model="newSurvey.title"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="newSurvey.description" rows="2"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de comida</label>
            <select v-model="newSurvey.meal_type"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
              <option value="any">Cualquiera</option>
              <option value="desayuno">Desayuno</option>
              <option value="almuerzo">Almuerzo</option>
              <option value="cena">Cena</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input type="date" v-model="newSurvey.start_date"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input type="date" v-model="newSurvey.end_date"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            </div>
          </div>
          <div class="flex gap-3 pt-3">
            <button @click="closeCreateModal"
              class="flex-1 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">Cancelar</button>
            <button @click="createSurvey"
              class="flex-1 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-all">Crear</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Option Modal -->
    <div v-if="showAddOptionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4"
      @click="closeAddOptionModal">
      <div class="bg-white rounded-2xl max-w-md w-full" @click.stop>
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Agregar receta</h3>
        </div>
        <div class="p-5">
          <div class="relative mb-4">
            <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" data-icon="mdi:magnify"></span>
            <input v-model="recipeSearch" placeholder="Buscar receta..."
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          </div>
          <div class="max-h-64 overflow-y-auto space-y-2">
            <div v-for="recipe in filteredRecipes" :key="recipe.id" @click="addOption(recipe)"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <img :src="recipe.image_url || defaultImage" class="w-10 h-10 rounded-lg object-cover">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ recipe.title }}</p>
                <p class="text-xs text-gray-400">{{ recipe.total_time }} min · {{ recipe.servings }} porc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast"
      class="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in-right">
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
const familyMembers = ref([])
const familyCode = ref('')
const currentUserId = ref(null)
const activeSurveys = ref([])
const pastSurveys = ref([])
const allRecipes = ref([])
const loadingSurveys = ref(true)
const loadingPast = ref(true)
const surveyVotes = ref({}) // Mapa de votos por encuesta

// Modals
const showCreateModal = ref(false)
const showAddOptionModal = ref(false)
const currentSurveyId = ref(null)
const recipeSearch = ref('')
const editingSurvey = ref(null)

// New survey form
const newSurvey = ref({
  title: '',
  description: '',
  meal_type: 'any',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
})

// Colors
const colors = ['bg-emerald-600', 'bg-emerald-500', 'bg-teal-600', 'bg-green-600', 'bg-emerald-700']

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
const filteredRecipes = computed(() => {
  if (!recipeSearch.value) return allRecipes.value
  return allRecipes.value.filter(r => r.title.toLowerCase().includes(recipeSearch.value.toLowerCase()))
})

// Verificar si un miembro ha votado
const hasMemberVoted = (surveyId, memberId) => {
  // Por ahora retorna false, se puede implementar después
  return false
}

// Methods
const generateFamilyCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

const getMealLabel = (type) => {
  const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', any: 'Cualquiera' }
  return labels[type] || type
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const getOptionPercentage = (votes, total) => {
  if (total === 0) return 0
  return Math.round((votes / total) * 100)
}

const copyFamilyCode = async () => {
  try {
    await navigator.clipboard.writeText(familyCode.value)
    showNotification('Código copiado al portapapeles')
  } catch (err) {
    showNotification('Error al copiar', 'mdi:alert-circle')
  }
}

const regenerateFamilyCode = async () => {
  if (!confirm('¿Estás seguro? Los familiares necesitarán el nuevo código para unirse.')) return

  const newCode = generateFamilyCode()
  const { error } = await supabase
    .from('profiles')
    .update({ family_code: newCode })
    .eq('family_code', familyCode.value)

  if (error) {
    showNotification('Error al regenerar código', 'mdi:alert-circle')
  } else {
    familyCode.value = newCode
    showNotification('Código regenerado exitosamente')
  }
}

// Load data
const loadFamilyData = async () => {
  try {
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
    }

    // Load recipes
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, title, total_time, servings, image_url, category')
      .eq('is_public', true)
      .limit(50)
    allRecipes.value = recipes || []

    await loadSurveys()

  } catch (error) {
    console.error('Error:', error)
    showNotification('Error al cargar datos', 'mdi:alert-circle')
  }
}

const loadSurveys = async () => {
  try {
    loadingSurveys.value = true
    loadingPast.value = true

    const today = new Date().toISOString().split('T')[0]

    // Active surveys
    const { data: active, error: activeError } = await supabase
      .from('family_surveys')
      .select('*')
      .eq('family_code', familyCode.value)
      .eq('is_active', true)
      .gte('end_date', today)
      .order('created_at', { ascending: false })

    if (activeError) throw activeError

    if (active) {
      for (const survey of active) {
        const { data: options, error: optionsError } = await supabase
          .from('survey_options')
          .select(`
            id,
            votes,
            recipe:recipes (id, title, total_time, servings, image_url)
          `)
          .eq('survey_id', survey.id)

        if (optionsError) throw optionsError

        survey.options = options?.map(o => ({
          id: o.id,
          votes: o.votes || 0,
          ...o.recipe
        })) || []

        const { count, error: countError } = await supabase
          .from('survey_votes')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id)

        if (countError) throw countError

        survey.totalVotes = count || 0
      }
      activeSurveys.value = active
    }
    loadingSurveys.value = false

    // Past surveys
    const { data: past, error: pastError } = await supabase
      .from('family_surveys')
      .select('*')
      .eq('family_code', familyCode.value)
      .lt('end_date', today)
      .order('end_date', { ascending: false })
      .limit(10)

    if (pastError) throw pastError

    if (past) {
      for (const survey of past) {
        const { data: options, error: optionsError } = await supabase
          .from('survey_options')
          .select(`
            id,
            votes,
            recipe:recipes (id, title, total_time, servings, image_url)
          `)
          .eq('survey_id', survey.id)
          .order('votes', { ascending: false })
          .limit(1)

        if (optionsError) throw optionsError

        if (options && options.length > 0) {
          survey.winner = options[0].recipe
        }
      }
      pastSurveys.value = past
    }
    loadingPast.value = false

  } catch (error) {
    console.error('Error loading surveys:', error)
    loadingSurveys.value = false
    loadingPast.value = false
  }
}

// Survey CRUD
const openCreateSurveyModal = () => {
  editingSurvey.value = null
  newSurvey.value = {
    title: '',
    description: '',
    meal_type: 'any',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  }
  showCreateModal.value = true
}

const editSurvey = (survey) => {
  editingSurvey.value = survey
  newSurvey.value = {
    title: survey.title,
    description: survey.description || '',
    meal_type: survey.meal_type || 'any',
    start_date: survey.start_date,
    end_date: survey.end_date
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingSurvey.value = null
}

const createSurvey = async () => {
  if (!newSurvey.value.title) {
    showNotification('El título es requerido', 'mdi:alert-circle')
    return
  }

  let result
  if (editingSurvey.value) {
    const { data, error } = await supabase
      .from('family_surveys')
      .update({
        title: newSurvey.value.title,
        description: newSurvey.value.description,
        meal_type: newSurvey.value.meal_type,
        start_date: newSurvey.value.start_date,
        end_date: newSurvey.value.end_date
      })
      .eq('id', editingSurvey.value.id)
      .select()
      .single()

    result = { data, error }
  } else {
    const { data, error } = await supabase
      .from('family_surveys')
      .insert({
        family_code: familyCode.value,
        title: newSurvey.value.title,
        description: newSurvey.value.description,
        meal_type: newSurvey.value.meal_type,
        start_date: newSurvey.value.start_date,
        end_date: newSurvey.value.end_date,
        created_by: currentUserId.value
      })
      .select()
      .single()

    result = { data, error }
  }

  if (result.error) {
    showNotification('Error al guardar', 'mdi:alert-circle')
  } else {
    showNotification(editingSurvey.value ? 'Votación actualizada' : 'Votación creada')
    closeCreateModal()
    await loadSurveys()
  }
}

const deleteSurvey = async (surveyId) => {
  if (!confirm('¿Eliminar esta votación?')) return

  const { error } = await supabase
    .from('family_surveys')
    .delete()
    .eq('id', surveyId)

  if (error) {
    showNotification('Error al eliminar', 'mdi:alert-circle')
  } else {
    showNotification('Votación eliminada')
    await loadSurveys()
  }
}

// Options
const openAddOptionModal = (surveyId) => {
  currentSurveyId.value = surveyId
  recipeSearch.value = ''
  showAddOptionModal.value = true
}

const closeAddOptionModal = () => {
  showAddOptionModal.value = false
  currentSurveyId.value = null
}

const addOption = async (recipe) => {
  const { error } = await supabase
    .from('survey_options')
    .insert({
      survey_id: currentSurveyId.value,
      recipe_id: recipe.id,
      votes: 0
    })

  if (error) {
    showNotification('Error al agregar', 'mdi:alert-circle')
  } else {
    showNotification('Receta agregada')
    closeAddOptionModal()
    await loadSurveys()
  }
}

const removeOption = async (optionId) => {
  const { error } = await supabase
    .from('survey_options')
    .delete()
    .eq('id', optionId)

  if (error) {
    showNotification('Error al eliminar', 'mdi:alert-circle')
  } else {
    showNotification('Opción eliminada')
    await loadSurveys()
  }
}

const removeMember = async (memberId, memberName) => {
  if (!confirm(`¿Eliminar a ${memberName} de la familia?`)) return

  const { error } = await supabase
    .from('profiles')
    .update({ family_code: null })
    .eq('id', memberId)

  if (error) {
    showNotification('Error al eliminar miembro', 'mdi:alert-circle')
  } else {
    await loadFamilyData()
    showNotification(`${memberName} eliminado de la familia`)
  }
}

// Layout
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