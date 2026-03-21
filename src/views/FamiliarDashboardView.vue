<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full" :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5 md:p-6">
          <div class="flex flex-col gap-6">
            <!-- Welcome Section -->
            <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-linear-to-br from-[rgba(93,162,113,0.2)] to-[rgba(168,213,186,0.2)] p-8">
              <div class="flex items-center gap-5 max-md:flex-col max-md:text-center">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#5DA271] text-xl font-semibold text-white">
                  {{ userInitials }}
                </div>
                <div>
                  <h1 class="mb-1 text-[28px] font-semibold text-[#2C2C2C] max-md:text-2xl">¡Hola {{ userName }}! 👋</h1>
                  <p class="text-base text-[#6C7A6C]">Bienvenido a tu menú familiar</p>
                </div>
              </div>
            </div>

            <!-- Weekly Planner Preview -->
            <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:calendar"></span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-[#2C2C2C]">Menú de la Semana</h2>
                  <p class="text-sm text-[#6C7A6C]">Planificado por tu familia</p>
                </div>
              </div>

              <!-- Compact Week View -->
              <div class="overflow-x-auto pb-2">
                <div class="inline-flex min-w-full gap-4">
                  <div v-for="day in days" :key="day" class="w-40 shrink-0">
                    <div class="mb-4 text-center">
                      <p class="text-base font-semibold text-[#2C2C2C]">{{ day }}</p>
                    </div>
                    <div class="flex flex-col gap-3">
                      <div v-for="mealType in mealTypes" :key="mealType.key" class="text-center">
                        <p class="mb-2 text-xs text-[#6C7A6C]">{{ mealType.icon }} {{ mealType.label }}</p>
                        <div v-if="getMealForSlot(day, mealType.key)" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-2">
                          <div class="mb-2 h-16 w-full overflow-hidden rounded-lg">
                            <img 
                              :src="getMealForSlot(day, mealType.key)?.image" 
                              :alt="getMealForSlot(day, mealType.key)?.name"
                              class="h-full w-full object-cover"
                              @error="handleImageError"
                            />
                          </div>
                          <p class="truncate text-[11px] font-medium text-[#2C2C2C]">
                            {{ getMealForSlot(day, mealType.key)?.name }}
                          </p>
                        </div>
                        <div v-else class="flex h-22 items-center justify-center rounded-xl border border-[rgba(168,213,186,0.3)] bg-[rgba(168,213,186,0.2)]">
                          <p class="text-sm text-[#6C7A6C]">-</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voting Section -->
            <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:trending-up"></span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-[#2C2C2C]">Vota por tus favoritas</h2>
                  <p class="text-sm text-[#6C7A6C]">Ayuda a planificar el próximo menú</p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div 
                  v-for="recipe in recipesForVoting" 
                  :key="recipe.id"
                  class="overflow-hidden rounded-xl border border-[rgba(168,213,186,0.3)] bg-[rgba(168,213,186,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                >
                  <div class="relative h-32 overflow-hidden">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute left-3 top-3 rounded-lg bg-[#5DA271] px-2.5 py-1 text-[11px] font-medium text-white">
                      {{ recipe.type }}
                    </div>
                  </div>
                  <div class="p-4">
                    <h4 class="mb-3 text-base font-semibold text-[#2C2C2C] leading-tight">{{ recipe.name }}</h4>
                    <div class="mb-4 flex items-center gap-2 text-xs text-[#6C7A6C]">
                      <div class="flex items-center gap-1">
                        <span class="iconify h-3 w-3" data-icon="mdi:clock-outline"></span>
                        <span>{{ recipe.time }}</span>
                      </div>
                      <div class="opacity-50">•</div>
                      <div>👥 {{ getRecipeLikes(recipe.id) }} votos</div>
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="handleVote(recipe.id)"
                        class="flex-1 cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-4 py-2.5 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:bg-[#D8EBD0]"
                        :class="{ 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': hasVoted(recipe.id) }"
                      >
                        {{ hasVoted(recipe.id) ? '✓ Votado' : '👍 Votar' }}
                      </button>
                      <button
                        @click="toggleFavorite(recipe)"
                        class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent transition-all duration-200 hover:bg-[#D8EBD0]"
                      >
                        <span 
                          class="iconify h-5 w-5 transition-all"
                          :class="isFavorite(recipe.id) ? 'text-red-500' : 'text-[#6C7A6C]'"
                          data-icon="mdi:heart"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- My Favorites -->
            <div v-if="favorites.length > 0" class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:heart"></span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-[#2C2C2C]">Mis Favoritas</h2>
                  <p class="text-sm text-[#6C7A6C]">{{ favorites.length }} recetas guardadas</p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div 
                  v-for="recipe in favorites" 
                  :key="recipe.id"
                  class="cursor-pointer overflow-hidden rounded-xl border border-[rgba(168,213,186,0.3)] bg-[rgba(168,213,186,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                  @click="toggleFavorite(recipe)"
                >
                  <div class="relative h-24 overflow-hidden">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                      <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:heart"></span>
                    </div>
                  </div>
                  <div class="p-3">
                    <p class="mb-1 truncate text-sm font-medium text-[#2C2C2C]">{{ recipe.name }}</p>
                    <p class="text-xs text-[#6C7A6C]">{{ recipe.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Family Members -->
            <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-5 w-5 text-[#5DA271]" data-icon="mdi:account-group"></span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-[#2C2C2C]">Miembros de la Familia</h2>
                  <p class="text-sm text-[#6C7A6C]">{{ familyMembers.length }} miembros</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-4">
                <div 
                  v-for="member in familyMembers" 
                  :key="member.id"
                  class="flex items-center gap-3 rounded-xl border border-[rgba(168,213,186,0.3)] bg-[rgba(168,213,186,0.2)] px-4 py-3"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white" :class="member.color">
                    {{ member.initials }}
                  </div>
                  <span class="text-[15px] font-medium text-[#2C2C2C]">{{ member.name }}</span>
                </div>
              </div>
            </div>
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
      },
      {
        id: '4',
        name: 'Carlos',
        initials: 'CA',
        color: 'bg-[#D8EBD0] text-[#2C2C2C]'
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
        favorites.value = favorites.value.filter(f => f.id !== recipe.id)
        alert('Removido de favoritos')
      } else {
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