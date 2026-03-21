<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full" :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-300 p-5 md:p-6">
          <div class="mx-auto max-w-300">
            <!-- Header -->
            <div class="mb-10">
              <div class="mb-10 flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:account-group"></span>
                </div>
                <div>
                  <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Modo Familia</h1>
                  <p class="text-sm text-[#6C7A6C]">Vota por tus recetas favoritas esta semana</p>
                </div>
              </div>

              <!-- Family Members -->
              <div class="mb-8 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <div class="mb-5 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
                  <h3 class="text-lg font-semibold text-[#2C2C2C]">Miembros de la familia</h3>
                  <button 
                    @click="openAddMemberModal"
                    class="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5DA271] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(93,162,113,0.9)] max-md:w-full max-md:justify-center"
                  >
                    <span class="iconify h-4 w-4" data-icon="mdi:plus"></span>
                    <span>Agregar</span>
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <div 
                    v-for="member in familyMembers" 
                    :key="member.id"
                    class="relative flex items-center gap-3 rounded-xl bg-[rgba(168,213,186,0.2)] p-4 transition-colors hover:bg-[rgba(168,213,186,0.3)]"
                  >
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white" :class="member.color">
                      {{ member.initials }}
                    </div>
                    <span class="flex-1 text-[15px] font-medium text-[#2C2C2C]">{{ member.name }}</span>
                    <button
                      v-if="familyMembers.length > 1"
                      @click="removeMember(member.id, member.name)"
                      class="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#d4183d] text-white opacity-0 transition-opacity hover:bg-[rgba(212,24,61,0.9)] group-hover:opacity-100"
                    >
                      <span class="iconify h-3 w-3" data-icon="mdi:trash-can-outline"></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Voting Stats -->
              <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div class="flex items-center gap-4 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-linear-to-br from-[rgba(93,162,113,0.2)] to-[rgba(93,162,113,0.05)] p-6 max-md:flex-col max-md:text-center">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                    <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:trophy"></span>
                  </div>
                  <div>
                    <p class="mb-1 text-sm text-[#6C7A6C]">Recetas votadas</p>
                    <p class="text-[28px] font-semibold text-[#2C2C2C]">{{ votedRecipesCount }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-linear-to-br from-[rgba(139,177,116,0.2)] to-[rgba(139,177,116,0.05)] p-6 max-md:flex-col max-md:text-center">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(139,177,116,0.2)]">
                    <span class="iconify h-5 w-5 text-[#8BB174]" data-icon="mdi:thumb-up"></span>
                  </div>
                  <div>
                    <p class="mb-1 text-sm text-[#6C7A6C]">Total de votos</p>
                    <p class="text-[28px] font-semibold text-[#2C2C2C]">{{ totalVotes }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-linear-to-br from-[rgba(168,213,186,0.4)] to-[rgba(168,213,186,0.1)] p-6 max-md:flex-col max-md:text-center">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(168,213,186,0.4)]">
                    <span class="iconify h-5 w-5 text-[#2C2C2C]" data-icon="mdi:star"></span>
                  </div>
                  <div>
                    <p class="mb-1 text-sm text-[#6C7A6C]">Participación</p>
                    <p class="text-[28px] font-semibold text-[#2C2C2C]">{{ participationPercentage }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voting Section -->
            <div>
              <h2 class="mb-8 text-xl font-semibold text-[#2C2C2C]">Vota por las recetas de esta semana</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div 
                  v-for="recipe in allRecipes" 
                  :key="recipe.id"
                  class="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                >
                  <div class="relative h-48 overflow-hidden">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                    <div class="absolute left-4 top-4 rounded-lg bg-[#5DA271] px-3 py-1.5 text-xs font-medium text-white">{{ recipe.type }}</div>
                    <div class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white">
                      <span class="iconify h-4 w-4" data-icon="mdi:thumb-up"></span>
                      <span>{{ getVoteCount(recipe.id) }}</span>
                    </div>
                  </div>

                  <div class="p-5">
                    <h3 class="mb-5 text-lg font-semibold text-[#2C2C2C] leading-tight">{{ recipe.name }}</h3>

                    <!-- Vote Progress -->
                    <div class="mb-5">
                      <div class="mb-2 flex items-center justify-between">
                        <span class="text-[13px] text-[#6C7A6C]">Popularidad</span>
                        <span class="text-sm font-semibold text-[#5DA271]">{{ getVotePercentage(recipe.id) }}%</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-[#D8EBD0]">
                        <div 
                          class="h-full rounded-full bg-[#5DA271] transition-all duration-300" 
                          :style="{ width: getVotePercentage(recipe.id) + '%' }"
                        ></div>
                      </div>
                    </div>

                    <!-- Family Votes -->
                    <div class="mb-5">
                      <p class="mb-3 text-[13px] text-[#6C7A6C]">Votos de la familia</p>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="member in familyMembers"
                          :key="member.id"
                          @click="handleVote(recipe.id, member.id)"
                          class="cursor-pointer border-none bg-transparent p-0 transition-transform hover:scale-110"
                          :class="{ 'scale-110': hasVoted(recipe.id, member.id) }"
                        >
                          <div class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white" :class="member.color">
                            {{ member.initials }}
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      @click="toggleCurrentUserVote(recipe.id)"
                      class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-4 py-3 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:bg-[#D8EBD0]"
                      :class="{ 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': hasVoted(recipe.id, currentUserId) }"
                    >
                      <span class="iconify h-4 w-4" data-icon="mdi:thumb-up"></span>
                      {{ hasVoted(recipe.id, currentUserId) ? 'Ya votaste' : 'Votar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeAddMemberModal">
      <div class="w-full max-w-125 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
        <div class="relative border-b border-[rgba(0,0,0,0.08)] p-6">
          <h3 class="mb-1 text-xl font-semibold text-[#2C2C2C]">Agregar miembro de la familia</h3>
          <p class="text-sm text-[#6C7A6C]">Ingresa el nombre del nuevo miembro de la familia</p>
          <button @click="closeAddMemberModal" class="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6C7A6C] transition-colors hover:bg-[#D8EBD0]">
            <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
          </button>
        </div>
        
        <div class="p-6">
          <div class="mb-6">
            <label class="mb-2 block text-sm text-[#2C2C2C]">Nombre</label>
            <input
              type="text"
              v-model="newMemberName"
              placeholder="Ej: Ana García"
              class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3.5 text-[15px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#6C7A6C] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
              @keyup.enter="addFamilyMember"
              ref="memberInput"
            />
          </div>
          
          <div class="flex gap-3 max-md:flex-col">
            <button @click="closeAddMemberModal" class="flex-1 cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-4 py-3.5 text-sm font-medium text-[#2C2C2C] transition-colors hover:bg-[#D8EBD0]">
              Cancelar
            </button>
            <button @click="addFamilyMember" class="flex-1 cursor-pointer rounded-xl bg-[#5DA271] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(93,162,113,0.9)]">
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

export default {
  name: 'FamiliaView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // Modal state
    const showAddMemberModal = ref(false)
    const newMemberName = ref('')
    const memberInput = ref(null)
    
    // Current user ID (simulado - en una app real vendría del store de auth)
    const currentUserId = ref('1') // María
    
    // Colors for avatars
    const colors = [
      'bg-[#5DA271]', 
      'bg-[#8BB174]', 
      'bg-[#A8D5BA] text-[#2C2C2C]', 
      'bg-[#d4183d]', 
      'bg-[#D8EBD0] text-[#2C2C2C]'
    ]
    
    // State for votes
    const votes = ref({})
    
    // Family members data
    const familyMembers = ref([
      {
        id: '1',
        name: 'María',
        initials: 'MA',
        color: 'bg-[#5DA271]'
      },
      {
        id: '2',
        name: 'Juan',
        initials: 'JU',
        color: 'bg-[#8BB174]'
      },
      {
        id: '3',
        name: 'Ana',
        initials: 'AN',
        color: 'bg-[#A8D5BA] text-[#2C2C2C]'
      }
    ])
    
    // Recipes data
    const allRecipes = ref([
      {
        id: '1',
        name: 'Bowl de Avena con Frutas',
        type: 'Desayuno',
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '2',
        name: 'Ensalada de Pollo a la Parrilla',
        type: 'Almuerzo',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '3',
        name: 'Pasta Primavera',
        type: 'Cena',
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '4',
        name: 'Smoothie Energético',
        type: 'Desayuno',
        image: 'https://images.unsplash.com/photo-1577450680941-2011043c55f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '5',
        name: 'Sopa de Verduras',
        type: 'Almuerzo',
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '6',
        name: 'Tacos Mexicanos',
        type: 'Cena',
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      }
    ])
    
    // Computed properties
    const votedRecipesCount = computed(() => {
      return Object.keys(votes.value).length
    })
    
    const totalVotes = computed(() => {
      return Object.values(votes.value).reduce((acc, recipeVotes) => acc + recipeVotes.length, 0)
    })
    
    const participationPercentage = computed(() => {
      const totalPossibleVotes = allRecipes.value.length * familyMembers.value.length
      if (totalPossibleVotes === 0) return 0
      return Math.round((totalVotes.value / totalPossibleVotes) * 100)
    })
    
    // Methods
    const getVoteCount = (recipeId) => {
      return votes.value[recipeId]?.length || 0
    }
    
    const getVotePercentage = (recipeId) => {
      const count = getVoteCount(recipeId)
      if (familyMembers.value.length === 0) return 0
      return Math.round((count / familyMembers.value.length) * 100)
    }
    
    const hasVoted = (recipeId, memberId) => {
      return votes.value[recipeId]?.includes(memberId) || false
    }
    
    const handleVote = (recipeId, memberId) => {
      const currentVotes = votes.value[recipeId] || []
      
      if (currentVotes.includes(memberId)) {
        // Remove vote
        votes.value[recipeId] = currentVotes.filter(id => id !== memberId)
      } else {
        // Add vote
        votes.value[recipeId] = [...currentVotes, memberId]
      }
      
      // Force reactivity
      votes.value = { ...votes.value }
    }
    
    const toggleCurrentUserVote = (recipeId) => {
      handleVote(recipeId, currentUserId.value)
    }
    
    const openAddMemberModal = () => {
      showAddMemberModal.value = true
      newMemberName.value = ''
      nextTick(() => {
        if (memberInput.value) {
          memberInput.value.focus()
        }
      })
    }
    
    const closeAddMemberModal = () => {
      showAddMemberModal.value = false
      newMemberName.value = ''
    }
    
    const addFamilyMember = () => {
      const name = newMemberName.value.trim()
      if (!name) return
      
      const initials = name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      
      const colorIndex = familyMembers.value.length % colors.length
      const color = colors[colorIndex]
      
      const newMember = {
        id: Date.now().toString(),
        name: name,
        initials,
        color
      }
      
      familyMembers.value.push(newMember)
      closeAddMemberModal()
      
      alert(`✅ ${name} agregado a la familia`)
    }
    
    const removeMember = (id, name) => {
      if (familyMembers.value.length <= 1) return
      
      if (confirm(`¿Estás seguro de que quieres eliminar a ${name} de la familia?`)) {
        familyMembers.value = familyMembers.value.filter(member => member.id !== id)
        
        // Also remove their votes
        Object.keys(votes.value).forEach(recipeId => {
          votes.value[recipeId] = votes.value[recipeId].filter(memberId => memberId !== id)
        })
        
        // Force reactivity
        votes.value = { ...votes.value }
        
        alert(`${name} eliminado de la familia`)
      }
    }
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAyNTBIMzAwVjIwMEgzNTBWMjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }
    
    // Layout functions
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }
    
    const handleLogout = async () => {
      console.log('Logout')
      router.push('/login')
    }
    
    return {
      isMobileMenuOpen,
      showAddMemberModal,
      newMemberName,
      memberInput,
      currentUserId,
      familyMembers,
      allRecipes,
      votedRecipesCount,
      totalVotes,
      participationPercentage,
      getVoteCount,
      getVotePercentage,
      hasVoted,
      handleVote,
      toggleCurrentUserVote,
      openAddMemberModal,
      closeAddMemberModal,
      addFamilyMember,
      removeMember,
      handleImageError,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>