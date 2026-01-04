<!-- src/views/PlanificadorView.vue -->
<template>
  <div class="planificador-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <!-- Contenido del planificador -->
          <div class="planificador-view">
            <!-- Header del planificador -->
            <div class="planificador-header">
              <div class="header-icon-container">
                <span class="iconify" data-icon="mdi:calendar"></span>
              </div>
              <div>
                <h1 class="planificador-title">Planificador Semanal</h1>
                <p class="planificador-subtitle">Organiza tus comidas de la semana</p>
              </div>
            </div>

            <!-- Grid del planificador -->
            <div class="planificador-grid">
              <div class="grid-header">
                <div class="header-cell day-header">Día</div>
                <div v-for="meal in mealTypes" :key="meal.key" class="header-cell meal-header">
                  <div>{{ meal.label }}</div>
                  <div class="meal-time">{{ meal.time }}</div>
                </div>
              </div>

              <div v-for="day in days" :key="day" class="grid-row">
                <!-- Celda del día -->
                <div class="day-cell">
                  <span class="day-name">{{ day }}</span>
                </div>

                <!-- Celdas de comidas -->
                <div v-for="mealType in mealTypes" :key="`${day}-${mealType.key}`" class="meal-cell">
                  <div v-if="getMealForSlot(day, mealType.key)?.isOutside" 
                       class="outside-meal-card"
                       @click="removeMeal(day, mealType.key)">
                    <button class="remove-btn">
                      <span class="iconify" data-icon="mdi:close"></span>
                    </button>
                    <div class="outside-content">
                      <span class="iconify" data-icon="mdi:map-marker"></span>
                      <p>Salida / Fuera de casa</p>
                    </div>
                  </div>

                  <div v-else-if="getMealForSlot(day, mealType.key)?.recipe" 
                       class="meal-card"
                       @click="openRecipeSelection(day, mealType.key)">
                    <button class="remove-btn" @click.stop="removeMeal(day, mealType.key)">
                      <span class="iconify" data-icon="mdi:close"></span>
                    </button>
                    <button class="edit-btn" @click.stop="openRecipeSelection(day, mealType.key)">
                      <span class="iconify" data-icon="mdi:pencil"></span>
                    </button>
                    <div class="meal-content">
                      <div class="meal-image">
                        <img :src="getMealForSlot(day, mealType.key)?.recipe?.image" 
                             :alt="getMealForSlot(day, mealType.key)?.recipe?.name"
                             @error="handleImageError">
                      </div>
                      <div class="meal-info">
                        <p class="meal-name">{{ getMealForSlot(day, mealType.key)?.recipe?.name }}</p>
                        <p class="meal-details">{{ getMealForSlot(day, mealType.key)?.recipe?.time }}</p>
                      </div>
                    </div>
                  </div>

                  <button v-else 
                          class="add-meal-btn"
                          @click="openRecipeSelection(day, mealType.key)">
                    <span class="iconify" data-icon="mdi:plus"></span>
                    <span>Agregar comida</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal de selección de recetas -->
            <div v-if="isSelectingRecipe" class="recipe-modal-overlay" @click="closeRecipeSelection">
              <div class="recipe-modal" @click.stop>
                <div class="modal-header">
                  <h3 class="modal-title">Seleccionar opción para {{ selectedDay }}</h3>
                  <p class="modal-description">Elige una receta o marca como salida</p>
                  <button class="modal-close" @click="closeRecipeSelection">
                    <span class="iconify" data-icon="mdi:close"></span>
                  </button>
                </div>

                <!-- Opción de salida -->
                <button class="outside-option-btn" @click="setOutsideMeal">
                  <span class="iconify" data-icon="mdi:map-marker"></span>
                  <div class="outside-option-info">
                    <p class="outside-option-title">Marcar como salida</p>
                    <p class="outside-option-desc">No comeré en casa</p>
                  </div>
                </button>

                <!-- Lista de recetas -->
                <div class="recipes-scroll-container">
                  <div class="recipes-grid">
                    <div v-for="recipe in allRecipes" 
                         :key="recipe.id" 
                         class="recipe-option-card"
                         @click="selectRecipe(recipe)">
                      <div class="recipe-option-image">
                        <img :src="recipe.image" :alt="recipe.name" @error="handleImageError">
                        <div class="recipe-badge">{{ recipe.type }}</div>
                      </div>
                      <div class="recipe-option-info">
                        <h4>{{ recipe.name }}</h4>
                        <div class="recipe-option-details">
                          <span>⏱️ {{ recipe.time }}</span>
                          <span>👥 {{ recipe.servings }} porciones</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'PlanificadorView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)

    // Datos del planificador
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM' },
      { key: 'snack', label: 'Merienda', time: '4:00 PM' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM' }
    ]

    const weekMeals = ref([])
    const isSelectingRecipe = ref(false)
    const selectedDay = ref('')
    const selectedMeal = ref('')

    // Recetas de ejemplo con imágenes fallback
    const allRecipes = ref([
      {
        id: 1,
        name: 'Bowl de Avena con Frutas',
        time: '15 min',
        servings: 2,
        type: 'Desayuno',
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 2,
        name: 'Ensalada de Pollo a la Parrilla',
        time: '30 min',
        servings: 4,
        type: 'Almuerzo',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 3,
        name: 'Pasta Primavera',
        time: '25 min',
        servings: 4,
        type: 'Cena',
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 4,
        name: 'Smoothie de Plátano y Espinaca',
        time: '10 min',
        servings: 2,
        type: 'Desayuno',
        image: 'https://images.unsplash.com/photo-1577450680941-2011043c55f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 5,
        name: 'Sopa de Verduras Nutritiva',
        time: '35 min',
        servings: 6,
        type: 'Almuerzo',
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 6,
        name: 'Tacos Mexicanos Caseros',
        time: '25 min',
        servings: 4,
        type: 'Cena',
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      }
    ])

    // Funciones del layout
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    // Funciones del planificador
    const getMealForSlot = (day, mealKey) => {
      return weekMeals.value.find(m => m.day === day && m.meal === mealKey)
    }

    const openRecipeSelection = (day, mealKey) => {
      selectedDay.value = day
      selectedMeal.value = mealKey
      isSelectingRecipe.value = true
    }

    const closeRecipeSelection = () => {
      isSelectingRecipe.value = false
      selectedDay.value = ''
      selectedMeal.value = ''
    }

    const selectRecipe = (recipe) => {
      weekMeals.value = weekMeals.value.filter(
        m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
      )
      
      weekMeals.value.push({
        day: selectedDay.value,
        meal: selectedMeal.value,
        recipe: recipe,
        isOutside: false
      })
      
      closeRecipeSelection()
    }

    const setOutsideMeal = () => {
      weekMeals.value = weekMeals.value.filter(
        m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
      )
      
      weekMeals.value.push({
        day: selectedDay.value,
        meal: selectedMeal.value,
        recipe: null,
        isOutside: true
      })
      
      closeRecipeSelection()
    }

    const removeMeal = (day, mealKey) => {
      weekMeals.value = weekMeals.value.filter(
        m => !(m.day === day && m.meal === mealKey)
      )
    }

    const handleImageError = (event) => {
      // Fallback para imágenes rotas
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAxNTBIMzAwVjEwMEgzNTBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      days,
      mealTypes,
      weekMeals,
      allRecipes,
      isSelectingRecipe,
      selectedDay,
      selectedMeal,
      getMealForSlot,
      openRecipeSelection,
      closeRecipeSelection,
      selectRecipe,
      setOutsideMeal,
      removeMeal,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* Layout - Mismo que HomeView */
.planificador-container {
  min-height: 100vh;
  background-color: var(--background);
}

/* Sidebar - Fixed position */
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

/* Header - Fixed con espacio para sidebar */
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

/* Contenedor principal que compensa sidebar y header */
.main-content-wrapper {
  margin-left: 260px;
  min-height: 100vh;
  background-color: var(--background);
  transition: margin-left 0.3s ease;
}

/* Contenido principal con espacio para el header */
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

/* Header del planificador */
.planificador-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.header-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon-container .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.planificador-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.planificador-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Grid del planificador */
.planificador-grid {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.grid-header {
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr);
  background-color: rgba(168, 213, 186, 0.2);
  border-bottom: 1px solid var(--border);
}

.header-cell {
  padding: 16px;
  text-align: left;
}

.day-header {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.meal-header {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.meal-time {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: normal;
  margin-top: 4px;
}

/* Filas del grid */
.grid-row {
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr);
  border-bottom: 1px solid var(--border);
}

.grid-row:last-child {
  border-bottom: none;
}

.day-cell {
  padding: 16px;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--border);
  background-color: rgba(168, 213, 186, 0.05);
}

.day-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.meal-cell {
  padding: 12px;
  border-right: 1px solid var(--border);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-cell:last-child {
  border-right: none;
}

/* Botón para agregar comida */
.add-meal-btn {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.2s;
  padding: 20px;
}

.add-meal-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: rgba(168, 213, 186, 0.2);
}

.add-meal-btn .iconify {
  width: 20px;
  height: 20px;
}

.add-meal-btn span {
  font-size: 12px;
}

/* Tarjeta de comida */
.meal-card {
  position: relative;
  width: 100%;
  background-color: rgba(168, 213, 186, 0.3);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(93, 162, 113, 0.2);
}

.meal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.remove-btn, .edit-btn {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-btn {
  top: 8px;
  right: 8px;
  background-color: var(--destructive);
  color: white;
}

.edit-btn {
  top: 8px;
  right: 36px;
  background-color: var(--primary);
  color: white;
}

.meal-card:hover .remove-btn,
.meal-card:hover .edit-btn {
  opacity: 1;
}

.remove-btn .iconify,
.edit-btn .iconify {
  width: 12px;
  height: 12px;
}

.meal-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meal-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.meal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-info {
  flex: 1;
  min-width: 0;
}

.meal-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.meal-details {
  font-size: 11px;
  color: var(--muted-foreground);
}

/* Tarjeta de salida */
.outside-meal-card {
  position: relative;
  width: 100%;
  background-color: rgba(139, 177, 116, 0.3);
  border-radius: 12px;
  padding: 12px;
  border: 2px dashed var(--secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.outside-meal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(139, 177, 116, 0.4);
}

.outside-meal-card .remove-btn {
  opacity: 0;
}

.outside-meal-card:hover .remove-btn {
  opacity: 1;
}

.outside-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
}

.outside-content .iconify {
  width: 20px;
  height: 20px;
  color: var(--secondary);
}

.outside-content p {
  font-size: 12px;
  font-weight: 500;
  color: var(--secondary);
  text-align: center;
}

/* Modal de selección de recetas */
.recipe-modal-overlay {
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

.recipe-modal {
  background-color: var(--card);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  position: relative;
  background-color: var(--card);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.modal-description {
  font-size: 14px;
  color: var(--muted-foreground);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
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

/* Opción de salida en modal */
.outside-option-btn {
  width: calc(100% - 48px);
  margin: 0 24px 16px 24px;
  background-color: rgba(139, 177, 116, 0.2);
  border: 2px dashed var(--secondary);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.outside-option-btn:hover {
  background-color: rgba(139, 177, 116, 0.3);
  transform: translateY(-1px);
}

.outside-option-btn .iconify {
  width: 24px;
  height: 24px;
  color: var(--secondary);
}

.outside-option-info {
  text-align: left;
}

.outside-option-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--secondary);
  margin-bottom: 2px;
}

.outside-option-desc {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Lista de recetas en modal */
.recipes-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px 24px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.recipe-option-card {
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.recipe-option-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.recipe-option-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.recipe-option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.recipe-option-card:hover .recipe-option-image img {
  transform: scale(1.05);
}

.recipe-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.recipe-option-info {
  padding: 12px;
}

.recipe-option-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
}

.recipe-option-details {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--muted-foreground);
}

/* Ajustes para móvil - Mismo que HomeView */
@media (max-width: 768px) {
  /* Sidebar se convierte en overlay en móvil */
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s ease;
  }
  
  /* Cuando el menú móvil está abierto */
  .mobile-menu-open .sidebar-fixed {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }
  
  /* Header ocupa toda la pantalla en móvil */
  .header-fixed {
    left: 0;
    right: 0;
  }
  
  /* Contenido principal ocupa toda la pantalla en móvil */
  .main-content-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .content-container {
    padding: 16px;
  }
  
  /* Responsive del planificador */
  .planificador-grid,
  .grid-header,
  .grid-row {
    display: block;
  }
  
  .grid-header {
    display: none;
  }
  
  .grid-row {
    border-bottom: 1px solid var(--border);
    padding: 16px 0;
    margin-bottom: 8px;
  }
  
  .day-cell {
    border-right: none;
    border-bottom: 1px solid var(--border);
    margin-bottom: 12px;
    padding-bottom: 12px;
    background-color: rgba(168, 213, 186, 0.1);
    border-radius: 8px;
  }
  
  .meal-cell {
    border-right: none;
    border-bottom: 1px solid var(--border);
    min-height: auto;
    padding: 12px 0;
  }
  
  .meal-cell:last-child {
    border-bottom: none;
  }
  
  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* Media queries adicionales para el planificador */
@media (max-width: 1024px) {
  .planificador-grid,
  .grid-header,
  .grid-row {
    display: block;
  }
  
  .grid-header {
    display: none;
  }
  
  .grid-row {
    border-bottom: 1px solid var(--border);
    padding: 16px 0;
  }
  
  .day-cell {
    border-right: none;
    border-bottom: 1px solid var(--border);
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
  
  .meal-cell {
    border-right: none;
    border-bottom: 1px solid var(--border);
    min-height: auto;
    padding: 12px 0;
  }
  
  .meal-cell:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .planificador-title {
    font-size: 20px;
  }
  
  .header-icon-container {
    width: 40px;
    height: 40px;
  }
  
  .header-icon-container .iconify {
    width: 20px;
    height: 20px;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
  
  .recipe-modal {
    max-height: 90vh;
  }
}

/* Media queries para tamaños de pantalla más grandes */
@media (min-width: 1400px) {
  .content-container {
    max-width: 1600px;
  }
  
  .meal-cell {
    min-height: 140px;
  }
}
</style>