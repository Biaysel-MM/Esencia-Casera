<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
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
            <button @click="openAddMemberModal"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
              <span class="iconify w-5 h-5" data-icon="mdi:plus"></span>
              Invitar miembro
            </button>
          </div>

          <!-- Family Members -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-5">Miembros de la familia</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="member in familyMembers" :key="member.id"
                class="relative flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold" :class="member.color">
                  {{ member.initials }}
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-400">{{ member.role === 'admin' ? 'Administrador' : 'Familiar' }}</p>
                </div>
                <span class="iconify w-5 h-5" :class="member.isOnline ? 'text-emerald-500' : 'text-gray-300'" 
                      :data-icon="member.isOnline ? 'mdi:check-circle' : 'mdi:clock-outline'"></span>
                <button v-if="member.id !== currentUserId && familyMembers.length > 1"
                  @click="removeMember(member.id, member.name)"
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span class="iconify w-3 h-3" data-icon="mdi:close"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Voting Statistics -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:chart-bar"></span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Estadísticas de votación</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Participantes que han votado -->
              <div class="border border-gray-200 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span class="iconify w-4 h-4 text-emerald-600" data-icon="mdi:check-circle"></span>
                  Han votado ({{ votedMembers.length }})
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div v-for="member in votedMembers" :key="member.id" 
                       class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" :class="member.color">
                      {{ member.initials }}
                    </div>
                    <span class="text-sm text-gray-700">{{ member.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Participantes que NO han votado -->
              <div class="border border-gray-200 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span class="iconify w-4 h-4 text-gray-400" data-icon="mdi:clock-outline"></span>
                  Pendientes por votar ({{ pendingMembers.length }})
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div v-for="member in pendingMembers" :key="member.id" 
                       class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" :class="member.color">
                      {{ member.initials }}
                    </div>
                    <span class="text-sm text-gray-500">{{ member.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalle de votos por receta -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Votos por receta</h3>
              <div class="space-y-3 max-h-80 overflow-y-auto">
                <div v-for="recipe in recipesWithVotes" :key="recipe.id" 
                     class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div class="flex items-center gap-3">
                    <img :src="recipe.image_url || defaultImage" class="w-10 h-10 rounded-lg object-cover">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ recipe.title }}</p>
                      <div class="flex items-center gap-1 mt-1">
                        <div v-for="voter in recipe.voters" :key="voter.id" 
                             class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                             :class="voter.color" :title="voter.name">
                          {{ voter.initials }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="iconify w-4 h-4 text-emerald-600" data-icon="mdi:thumb-up"></span>
                    <span class="font-semibold">{{ recipe.voteCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Family Code -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:qrcode"></span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Código de familia</h2>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <code class="px-4 py-2 rounded-lg bg-gray-100 font-mono text-lg">{{ familyCode }}</code>
              <button @click="copyFamilyCode" class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
                <span class="iconify w-4 h-4" data-icon="mdi:content-copy"></span>
                Copiar
              </button>
              <button @click="regenerateFamilyCode" class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-red-500 flex items-center gap-1">
                <span class="iconify w-4 h-4" data-icon="mdi:refresh"></span>
                Regenerar
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-3">Comparte este código para que otros miembros se unan a tu familia</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeAddMemberModal">
      <div class="bg-white rounded-2xl max-w-md w-full" @click.stop>
        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Invitar miembro</h3>
          <button @click="closeAddMemberModal" class="text-gray-400 hover:text-gray-600">
            <span class="iconify w-5 h-5" data-icon="mdi:close"></span>
          </button>
        </div>
        <div class="p-5">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email del usuario</label>
          <input v-model="memberEmail" type="email" placeholder="correo@ejemplo.com"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          <div class="flex gap-3 mt-5">
            <button @click="closeAddMemberModal" class="flex-1 py-3 rounded-xl border border-gray-200">Cancelar</button>
            <button @click="addFamilyMember" class="flex-1 py-3 rounded-xl bg-emerald-600 text-white">Enviar invitación</button>
          </div>
        </div>
      </div>
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
const showAddMemberModal = ref(false)
const memberEmail = ref('')
const familyMembers = ref([])
const familyCode = ref('')
const currentUserId = ref(null)
const votesData = ref({})
const allRecipes = ref([])
const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'

// Colors
const colors = ['bg-emerald-600', 'bg-emerald-500', 'bg-teal-600', 'bg-green-600', 'bg-emerald-700', 'bg-teal-500']

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
const getWeekStart = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(today.setDate(diff)).toISOString().split('T')[0]
}

const votedMembers = computed(() => familyMembers.value.filter(m => m.hasVoted))
const pendingMembers = computed(() => familyMembers.value.filter(m => !m.hasVoted))

const recipesWithVotes = computed(() => {
  return allRecipes.value.map(recipe => ({
    ...recipe,
    voteCount: votesData.value[recipe.id]?.length || 0,
    voters: getVotersForRecipe(recipe.id)
  })).filter(r => r.voteCount > 0).sort((a, b) => b.voteCount - a.voteCount)
})

const getVotersForRecipe = (recipeId) => {
  const voterIds = votesData.value[recipeId] || []
  return familyMembers.value
    .filter(m => voterIds.includes(m.id))
    .map(m => ({ id: m.id, name: m.name, initials: m.initials, color: m.color }))
}

// Load data
const loadFamilyData = async () => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('family_code, full_name')
      .eq('id', authStore.user?.id)
      .single()

    if (error) throw error

    currentUserId.value = authStore.user?.id
    familyCode.value = profile.family_code || ''

    if (familyCode.value) {
      const { data: members } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('family_code', familyCode.value)

      if (members) {
        familyMembers.value = members.map((m, idx) => ({
          id: m.id,
          name: m.full_name,
          initials: m.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          role: m.role,
          color: colors[idx % colors.length],
          isOnline: true,
          hasVoted: false,
          votesCount: 0
        }))
      }
    } else {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      await supabase
        .from('profiles')
        .update({ family_code: newCode })
        .eq('id', authStore.user?.id)

      familyCode.value = newCode
      familyMembers.value = [{
        id: authStore.user?.id,
        name: profile.full_name,
        initials: profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
        role: 'admin',
        color: colors[0],
        isOnline: true,
        hasVoted: false,
        votesCount: 0
      }]
    }

    // Cargar recetas
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, title, image_url')
      .eq('is_public', true)
      .limit(20)
    allRecipes.value = recipes || []

    // Cargar votos
    const weekStart = getWeekStart()
    const { data: votes } = await supabase
      .from('family_votes')
      .select('recipe_id, votes')
      .eq('week_start', weekStart)

    if (votes) {
      const votesMap = {}
      votes.forEach(v => {
        votesMap[v.recipe_id] = v.votes || []
      })
      votesData.value = votesMap
    }

    // Actualizar estado de votación de miembros
    familyMembers.value = familyMembers.value.map(member => {
      let votesCount = 0
      Object.values(votesData.value).forEach(recipeVotes => {
        if (recipeVotes.includes(member.id)) votesCount++
      })
      return { ...member, hasVoted: votesCount > 0, votesCount }
    })

  } catch (error) {
    console.error('Error cargando familia:', error)
    showNotification('Error al cargar datos', 'mdi:alert-circle')
  }
}

// Add family member
const addFamilyMember = async () => {
  if (!memberEmail.value) return

  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', memberEmail.value)
      .single()

    if (error || !user) {
      showNotification('Usuario no encontrado', 'mdi:alert-circle')
      return
    }

    await supabase
      .from('profiles')
      .update({ family_code: familyCode.value })
      .eq('id', user.id)

    await loadFamilyData()
    closeAddMemberModal()
    showNotification('Miembro invitado exitosamente')
  } catch (error) {
    showNotification('Error al invitar miembro', 'mdi:alert-circle')
  }
}

// Remove member
const removeMember = async (memberId, memberName) => {
  if (!confirm(`¿Eliminar a ${memberName} de la familia?`)) return

  try {
    await supabase
      .from('profiles')
      .update({ family_code: null })
      .eq('id', memberId)

    await loadFamilyData()
    showNotification(`${memberName} ha sido eliminado`)
  } catch (error) {
    showNotification('Error al eliminar miembro', 'mdi:alert-circle')
  }
}

// Copy family code
const copyFamilyCode = () => {
  navigator.clipboard.writeText(familyCode.value)
  showNotification('Código copiado al portapapeles')
}

// Regenerate family code
const regenerateFamilyCode = async () => {
  if (!confirm('¿Cambiar el código de familia? Los miembros actuales seguirán en el grupo.')) return

  const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
  
  try {
    await supabase
      .from('profiles')
      .update({ family_code: newCode })
      .eq('family_code', familyCode.value)

    familyCode.value = newCode
    showNotification('Código regenerado')
  } catch (error) {
    showNotification('Error al regenerar código', 'mdi:alert-circle')
  }
}

// Modal
const openAddMemberModal = () => {
  memberEmail.value = ''
  showAddMemberModal.value = true
}
const closeAddMemberModal = () => { showAddMemberModal.value = false }

// Layout
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const handleLogout = async () => { await authStore.logout(); router.push('/login') }

onMounted(() => {
  if (authStore.isAuthenticated) loadFamilyData()
})
</script>