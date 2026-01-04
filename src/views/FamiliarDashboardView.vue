<!-- src/views/FamiliarDashboardView.vue -->
<template>
  <div class="familiar-dashboard-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <div class="familiar-dashboard-view">
            <!-- Welcome Section -->
            <div class="welcome-section">
              <div class="welcome-content">
                <div class="welcome-avatar">
                  {{ userInitials }}
                </div>
                <div>
                  <h1 class="welcome-title">¡Hola {{ userName }}! 👋</h1>
                  <p class="welcome-subtitle">Bienvenido a tu menú familiar</p>
                </div>
              </div>
            </div>

            <!-- Weekly Planner Preview -->
            <section class="dashboard-card">
              <div class="card-header">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:calendar"></span>
                </div>
                <div>
                  <h2 class="card-title">Menú de la Semana</h2>
                  <p class="card-subtitle">Planificado por tu familia</p>
                </div>
              </div>

              <!-- Compact Week View -->
              <div class="week-view-container">
                <div class="days-grid">
                  <div v-for="day in days" :key="day" class="day-column">
                    <div class="day-header">
                      <p class="day-name">{{ day }}</p>
                    </div>
                    <div class="meals-container">
                      <div v-for="mealType in mealTypes" :key="mealType.key" class="meal-slot">
                        <p class="meal-label">
                          {{ mealType.icon }} {{ mealType.label }}
                        </p>
                        <div v-if="getMealForSlot(day, mealType.key)" class="meal-card-small">
                          <div class="meal-image-small">
                            <img 
                              :src="getMealForSlot(day, mealType.key)?.image" 
                              :alt="getMealForSlot(day, mealType.key)?.name"
                              @error="handleImageError"
                            />
                          </div>
                          <p class="meal-name-small">
                            {{ getMealForSlot(day, mealType.key)?.name }}
                          </p>
                        </div>
                        <div v-else class="empty-meal-slot">
                          <p class="empty-text">-</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Voting Section -->
            <section class="dashboard-card">
              <div class="card-header">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:trending-up"></span>
                </div>
                <div>
                  <h2 class="card-title">Vota por tus favoritas</h2>
                  <p class="card-subtitle">Ayuda a planificar el próximo menú</p>
                </div>
              </div>

              <div class="voting-grid">
                <div 
                  v-for="recipe in recipesForVoting" 
                  :key="recipe.id"
                  class="voting-card"
                >
                  <div class="voting-image">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      @error="handleImageError"
                    />
                    <div class="recipe-type-badge">
                      {{ recipe.type }}
                    </div>
                  </div>
                  <div class="voting-content">
                    <h4 class="recipe-name">{{ recipe.name }}</h4>
                    <div class="recipe-info">
                      <div class="info-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{ recipe.time }}</span>
                      </div>
                      <div class="info-divider">•</div>
                      <div class="info-item">
                        <span>👥 {{ getRecipeLikes(recipe.id) }} votos</span>
                      </div>
                    </div>
                    <div class="voting-actions">
                      <button
                        @click="handleVote(recipe.id)"
                        class="vote-btn"
                        :class="{ 'voted': hasVoted(recipe.id) }"
                      >
                        {{ hasVoted(recipe.id) ? '✓ Votado' : '👍 Votar' }}
                      </button>
                      <button
                        @click="toggleFavorite(recipe)"
                        class="favorite-btn"
                      >
                        <span 
                          class="iconify" 
                          data-icon="mdi:heart"
                          :class="{ 'favorited': isFavorite(recipe.id) }"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- My Favorites -->
            <section v-if="favorites.length > 0" class="dashboard-card">
              <div class="card-header">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:heart"></span>
                </div>
                <div>
                  <h2 class="card-title">Mis Favoritas</h2>
                  <p class="card-subtitle">{{ favorites.length }} recetas guardadas</p>
                </div>
              </div>

              <div class="favorites-grid">
                <div 
                  v-for="recipe in favorites" 
                  :key="recipe.id"
                  class="favorite-card"
                  @click="toggleFavorite(recipe)"
                >
                  <div class="favorite-image">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      @error="handleImageError"
                    />
                    <div class="favorite-badge">
                      <span class="iconify" data-icon="mdi:heart"></span>
                    </div>
                  </div>
                  <div class="favorite-content">
                    <p class="favorite-name">{{ recipe.name }}</p>
                    <p class="favorite-time">{{ recipe.time }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Family Members -->
            <section class="dashboard-card">
              <div class="card-header">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:account-group"></span>
                </div>
                <div>
                  <h2 class="card-title">Miembros de la Familia</h2>
                  <p class="card-subtitle">{{ familyMembers.length }} miembros</p>
                </div>
              </div>

              <div class="family-members-grid">
                <div 
                  v-for="member in familyMembers" 
                  :key="member.id"
                  class="family-member"
                >
                  <div class="member-avatar" :class="member.color">
                    {{ member.initials }}
                  </div>
                  <span class="member-name">{{ member.name }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

export default {
  name: 'FamiliarDashboardView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // Days of week
    const days = ref(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'])
    
    // Meal types
    const mealTypes = ref([
      { key: 'breakfast', label: 'Desayuno', icon: '🌅' },
      { key: 'lunch', label: 'Almuerzo', icon: '🍽️' },
      { key: 'snack', label: 'Merienda', icon: '🍪' },
      { key: 'dinner', label: 'Cena', icon: '🌙' }
    ])
    
    // User data
    const userName = ref('Ana')
    const userInitials = ref('AN')
    
    // Voting state
    const votes = ref({})
    
    // Favorites state
    const favorites = ref([
      {
        id: '1',
        name: 'Bowl de Avena con Frutas',
        type: 'Desayuno',
        time: '15 min',
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '2',
        name: 'Ensalada de Pollo a la Parrilla',
        type: 'Almuerzo',
        time: '30 min',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      }
    ])
    
    // Recipes for voting
    const recipesForVoting = ref([
      {
        id: '3',
        name: 'Pasta Primavera',
        type: 'Cena',
        time: '25 min',
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '4',
        name: 'Smoothie de Plátano y Espinaca',
        type: 'Desayuno',
        time: '10 min',
        image: 'https://images.unsplash.com/photo-1577450680941-2011043c55f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '5',
        name: 'Sopa de Verduras Nutritiva',
        type: 'Almuerzo',
        time: '35 min',
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '6',
        name: 'Tacos Mexicanos Caseros',
        type: 'Cena',
        time: '25 min',
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '7',
        name: 'Pollo al Curry',
        type: 'Almuerzo',
        time: '40 min',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      },
      {
        id: '8',
        name: 'Quinoa con Verduras',
        type: 'Cena',
        time: '30 min',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
      }
    ])
    
    // Week meals data
    const weekMeals = ref([
      { day: 'Lunes', meal: 'breakfast', recipe: recipesForVoting.value[3] },
      { day: 'Lunes', meal: 'lunch', recipe: recipesForVoting.value[4] },
      { day: 'Lunes', meal: 'dinner', recipe: recipesForVoting.value[5] },
      { day: 'Martes', meal: 'breakfast', recipe: recipesForVoting.value[0] },
      { day: 'Martes', meal: 'lunch', recipe: recipesForVoting.value[1] },
      { day: 'Miércoles', meal: 'breakfast', recipe: recipesForVoting.value[2] },
      { day: 'Jueves', meal: 'lunch', recipe: recipesForVoting.value[3] },
      { day: 'Viernes', meal: 'dinner', recipe: recipesForVoting.value[4] },
      { day: 'Sábado', meal: 'breakfast', recipe: recipesForVoting.value[5] },
      { day: 'Domingo', meal: 'lunch', recipe: recipesForVoting.value[0] }
    ])
    
    // Family members
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
      },
      {
        id: '4',
        name: 'Carlos',
        initials: 'CA',
        color: 'avatar-muted'
      }
    ])
    
    // Computed properties
    const getMealForSlot = (day, mealType) => {
      const fullDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      const fullDay = fullDays[days.value.indexOf(day)]
      const meal = weekMeals.value.find(m => m.day === fullDay && m.meal === mealType)
      return meal ? meal.recipe : null
    }
    
    const hasVoted = (recipeId) => {
      return votes.value[recipeId] || false
    }
    
    const getRecipeLikes = (recipeId) => {
      // Simular likes aleatorios
      return Math.floor(Math.random() * familyMembers.value.length) + 1
    }
    
    const isFavorite = (recipeId) => {
      return favorites.value.some(f => f.id === recipeId)
    }
    
    // Methods
    const handleVote = (recipeId) => {
      votes.value = {
        ...votes.value,
        [recipeId]: !votes.value[recipeId]
      }
      
      const message = votes.value[recipeId] ? '¡Voto registrado! 👍' : 'Voto removido'
      alert(message)
    }
    
    const toggleFavorite = (recipe) => {
      const isCurrentlyFavorite = isFavorite(recipe.id)
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        favorites.value = favorites.value.filter(f => f.id !== recipe.id)
        alert('Removido de favoritos')
      } else {
        // Add to favorites
        favorites.value.push(recipe)
        alert('Agregado a favoritos ❤️')
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
      days,
      mealTypes,
      userName,
      userInitials,
      votes,
      favorites,
      recipesForVoting,
      familyMembers,
      getMealForSlot,
      hasVoted,
      getRecipeLikes,
      isFavorite,
      handleVote,
      toggleFavorite,
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
.familiar-dashboard-container {
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

/* Familiar Dashboard View Styles */
.familiar-dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, rgba(93, 162, 113, 0.2), rgba(168, 213, 186, 0.2));
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 32px;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.welcome-subtitle {
  font-size: 16px;
  color: var(--muted-foreground);
}

/* Dashboard Cards */
.dashboard-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon .iconify {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 2px;
}

.card-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Week View */
.week-view-container {
  overflow-x: auto;
  padding-bottom: 8px;
}

.days-grid {
  display: inline-flex;
  gap: 16px;
  min-width: 100%;
}

.day-column {
  width: 160px;
  flex-shrink: 0;
}

.day-header {
  margin-bottom: 16px;
}

.day-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  text-align: center;
}

.meals-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meal-slot {
  text-align: center;
}

.meal-label {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-bottom: 8px;
}

.meal-card-small {
  background-color: var(--card);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid var(--border);
}

.meal-image-small {
  width: 100%;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.meal-image-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-name-small {
  font-size: 11px;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-meal-slot {
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  padding: 8px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(168, 213, 186, 0.3);
}

.empty-text {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Voting Section */
.voting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.voting-card {
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(168, 213, 186, 0.3);
  transition: all 0.3s ease;
}

.voting-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.voting-image {
  position: relative;
  height: 128px;
  overflow: hidden;
}

.voting-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  border: none;
}

.voting-content {
  padding: 16px;
}

.recipe-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 12px;
  line-height: 1.3;
}

.recipe-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item .iconify {
  width: 12px;
  height: 12px;
}

.info-divider {
  opacity: 0.5;
}

.voting-actions {
  display: flex;
  gap: 8px;
}

.vote-btn {
  flex: 1;
  padding: 10px 16px;
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

.favorite-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background-color: var(--muted);
}

.favorite-btn .iconify {
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
  transition: all 0.2s;
}

.favorite-btn .iconify.favorited {
  color: #ef4444;
  fill: #ef4444;
}

/* Favorites Section */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.favorite-card {
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(168, 213, 186, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.favorite-image {
  position: relative;
  height: 96px;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-badge .iconify {
  width: 16px;
  height: 16px;
  color: #ef4444;
  fill: #ef4444;
}

.favorite-content {
  padding: 12px;
}

.favorite-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-time {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Family Members */
.family-members-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.family-member {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(168, 213, 186, 0.3);
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

.avatar-muted {
  background-color: var(--muted);
}

.member-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--foreground);
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
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .welcome-avatar {
    width: 56px;
    height: 56px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .voting-grid {
    grid-template-columns: 1fr;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .family-members-grid {
    justify-content: center;
  }
  
  .day-column {
    width: 140px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .family-member {
    flex: 1;
    min-width: calc(50% - 8px);
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .member-avatar {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }
  
  .days-grid {
    gap: 12px;
  }
  
  .day-column {
    width: 120px;
  }
}

@media (min-width: 1024px) {
  .voting-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .favorites-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>