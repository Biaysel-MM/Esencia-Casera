<!-- src/views/FamiliaView.vue -->
<template>
  <div class="familia-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <div class="familia-view">
            <!-- Header -->
            <div class="mb-8">
              <div class="header-section">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:account-group"></span>
                </div>
                <div>
                  <h1 class="section-title">Modo Familia</h1>
                  <p class="section-subtitle">Vota por tus recetas favoritas esta semana</p>
                </div>
              </div>

              <!-- Family Members -->
              <div class="family-members-section">
                <div class="section-header">
                  <h3>Miembros de la familia</h3>
                  <button 
                    @click="openAddMemberModal"
                    class="add-member-btn"
                  >
                    <span class="iconify" data-icon="mdi:plus"></span>
                    <span>Agregar</span>
                  </button>
                </div>
                <div class="members-grid">
                  <div 
                    v-for="member in familyMembers" 
                    :key="member.id"
                    class="member-item"
                  >
                    <div class="member-avatar" :class="member.color">
                      {{ member.initials }}
                    </div>
                    <span class="member-name">{{ member.name }}</span>
                    <button
                      v-if="familyMembers.length > 1"
                      @click="removeMember(member.id, member.name)"
                      class="remove-member-btn"
                    >
                      <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Voting Stats -->
              <div class="stats-grid">
                <div class="stat-card primary-stat">
                  <div class="stat-icon">
                    <span class="iconify" data-icon="mdi:trophy"></span>
                  </div>
                  <div>
                    <p class="stat-label">Recetas votadas</p>
                    <p class="stat-value">{{ votedRecipesCount }}</p>
                  </div>
                </div>

                <div class="stat-card secondary-stat">
                  <div class="stat-icon">
                    <span class="iconify" data-icon="mdi:thumb-up"></span>
                  </div>
                  <div>
                    <p class="stat-label">Total de votos</p>
                    <p class="stat-value">{{ totalVotes }}</p>
                  </div>
                </div>

                <div class="stat-card accent-stat">
                  <div class="stat-icon">
                    <span class="iconify" data-icon="mdi:star"></span>
                  </div>
                  <div>
                    <p class="stat-label">Participación</p>
                    <p class="stat-value">{{ participationPercentage }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voting Section -->
            <div>
              <h2 class="voting-title">Vota por las recetas de esta semana</h2>
              <div class="recipes-grid">
                <div 
                  v-for="recipe in allRecipes" 
                  :key="recipe.id"
                  class="recipe-card"
                >
                  <div class="recipe-image-container">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      class="recipe-image"
                      @error="handleImageError"
                    />
                    <div class="image-overlay"></div>
                    <div class="recipe-type-badge">{{ recipe.type }}</div>
                    <div class="recipe-vote-count">
                      <span class="iconify" data-icon="mdi:thumb-up"></span>
                      <span>{{ getVoteCount(recipe.id) }}</span>
                    </div>
                  </div>

                  <div class="recipe-content">
                    <h3 class="recipe-name">{{ recipe.name }}</h3>

                    <!-- Vote Progress -->
                    <div class="progress-section">
                      <div class="progress-header">
                        <span class="progress-label">Popularidad</span>
                        <span class="progress-percentage">{{ getVotePercentage(recipe.id) }}%</span>
                      </div>
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ width: getVotePercentage(recipe.id) + '%' }"
                        ></div>
                      </div>
                    </div>

                    <!-- Family Votes -->
                    <div class="family-votes-section">
                      <p class="votes-label">Votos de la familia</p>
                      <div class="family-avatars">
                        <button
                          v-for="member in familyMembers"
                          :key="member.id"
                          @click="handleVote(recipe.id, member.id)"
                          class="avatar-btn"
                          :class="{ 'voted': hasVoted(recipe.id, member.id) }"
                        >
                          <div class="avatar-small" :class="member.color">
                            {{ member.initials }}
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      @click="toggleCurrentUserVote(recipe.id)"
                      class="vote-btn"
                      :class="{ 'voted': hasVoted(recipe.id, currentUserId) }"
                    >
                      <span class="iconify" data-icon="mdi:thumb-up"></span>
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
    <div v-if="showAddMemberModal" class="modal-overlay" @click="closeAddMemberModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Agregar miembro de la familia</h3>
          <p class="modal-subtitle">Ingresa el nombre del nuevo miembro de la familia</p>
          <button @click="closeAddMemberModal" class="modal-close">
            <span class="iconify" data-icon="mdi:close"></span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="input-group">
            <label class="input-label">Nombre</label>
            <input
              type="text"
              v-model="newMemberName"
              placeholder="Ej: Ana García"
              class="member-input"
              @keyup.enter="addFamilyMember"
              ref="memberInput"
            />
          </div>
          
          <div class="modal-actions">
            <button @click="closeAddMemberModal" class="cancel-btn">
              Cancelar
            </button>
            <button @click="addFamilyMember" class="confirm-btn">
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
    const colors = ['avatar-primary', 'avatar-secondary', 'avatar-accent', 'avatar-destructive', 'avatar-muted']
    
    // State for votes
    const votes = ref({})
    
    // Family members data
    const familyMembers = ref([
      {
        id: '1',
        name: 'María',
        initials: 'MA',
        color: 'avatar-primary'
      },
      {
        id: '2',
        name: 'Juan',
        initials: 'JU',
        color: 'avatar-secondary'
      },
      {
        id: '3',
        name: 'Ana',
        initials: 'AN',
        color: 'avatar-accent'
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
      
      // Show success message
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
        
        // Show success message
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
      // Aquí iría la lógica de logout
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

<style scoped>
/* Layout - Igual que las otras vistas */
.familia-container {
  min-height: 100vh;
  background-color: var(--background);
}

.sidebar-fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  z-index: 1000;
  background-color: var(--card);
  border-right: 1px solid var(--border);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 70px;
  z-index: 900;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: left 0.3s ease-in-out;
}

.main-content-wrapper {
  margin-left: 260px;
  min-height: 100vh;
  background-color: var(--background);
  transition: margin-left 0.3s ease;
}

.content-main {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  overflow-y: auto;
  background-color: var(--background);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* Familia View Styles */
.familia-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Family Members Section */
.family-members-section {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.add-member-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-member-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.add-member-btn .iconify {
  width: 16px;
  height: 16px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: rgba(168, 213, 186, 0.3);
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.avatar-primary {
  background-color: var(--primary);
}

.avatar-secondary {
  background-color: var(--secondary);
}

.avatar-accent {
  background-color: var(--accent);
}

.avatar-destructive {
  background-color: var(--destructive);
}

.avatar-muted {
  background-color: var(--muted);
}

.member-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--foreground);
  flex: 1;
}

.remove-member-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--destructive);
  color: var(--destructive-foreground);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.member-item:hover .remove-member-btn {
  opacity: 1;
}

.remove-member-btn .iconify {
  width: 12px;
  height: 12px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.primary-stat {
  background: linear-gradient(135deg, rgba(93, 162, 113, 0.2), rgba(93, 162, 113, 0.05));
}

.secondary-stat {
  background: linear-gradient(135deg, rgba(139, 177, 116, 0.2), rgba(139, 177, 116, 0.05));
}

.accent-stat {
  background: linear-gradient(135deg, rgba(168, 213, 186, 0.4), rgba(168, 213, 186, 0.1));
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.primary-stat .stat-icon {
  background-color: rgba(93, 162, 113, 0.2);
}

.secondary-stat .stat-icon {
  background-color: rgba(139, 177, 116, 0.2);
}

.accent-stat .stat-icon {
  background-color: rgba(168, 213, 186, 0.4);
}

.stat-icon .iconify {
  width: 20px;
  height: 20px;
}

.primary-stat .stat-icon .iconify {
  color: var(--primary);
}

.secondary-stat .stat-icon .iconify {
  color: var(--secondary);
}

.accent-stat .stat-icon .iconify {
  color: var(--accent-foreground);
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--foreground);
}

/* Voting Section */
.voting-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 32px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.recipe-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.recipe-image-container {
  position: relative;
  height: 192px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
}

.recipe-type-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.recipe-vote-count {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.recipe-vote-count .iconify {
  width: 16px;
  height: 16px;
}

.recipe-content {
  padding: 20px;
}

.recipe-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 20px;
  line-height: 1.4;
}

/* Progress Section */
.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.progress-bar {
  height: 8px;
  background-color: var(--muted);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Family Votes Section */
.family-votes-section {
  margin-bottom: 20px;
}

.votes-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 12px;
}

.family-avatars {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-btn:hover {
  transform: scale(1.1);
}

.avatar-btn.voted {
  transform: scale(1.1);
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

/* Vote Button */
.vote-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.vote-btn:hover {
  background-color: var(--muted);
}

.vote-btn.voted {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.vote-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: var(--card);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.modal-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted-foreground);
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--muted);
}

.modal-close .iconify {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: var(--foreground);
  margin-bottom: 8px;
}

.member-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  transition: all 0.2s;
}

.member-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.member-input::placeholder {
  color: var(--muted-foreground);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
}

.cancel-btn:hover {
  background-color: var(--muted);
}

.confirm-btn {
  border: none;
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.confirm-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Responsive Styles */
@media (max-width: 768px) {
  /* Layout responsive */
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s ease;
  }
  
  .mobile-menu-open .sidebar-fixed {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }
  
  .header-fixed {
    left: 0;
    right: 0;
  }
  
  .main-content-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .content-container {
    padding: 16px;
  }
  
  /* Responsive específico */
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .add-member-btn {
    width: 100%;
    justify-content: center;
  }
  
  .members-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-item {
    padding: 12px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (min-width: 1200px) {
  .recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>