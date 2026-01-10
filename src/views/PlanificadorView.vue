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
              <div class="header-left">
                <div class="header-icon-container">
                  <span class="iconify" data-icon="mdi:calendar"></span>
                </div>
                <div>
                  <h1 class="planificador-title">Planificador Semanal</h1>
                  <p class="planificador-subtitle">Organiza tus comidas de la semana</p>
                </div>
              </div>

              <div class="header-actions">
                <button class="generate-week-btn" @click="generateWeeklyMenu">
                  <span class="iconify" data-icon="mdi:sparkles"></span>
                  Generar semana
                </button>
                <button class="shopping-list-btn" @click="generateShoppingList">
                  <span class="iconify" data-icon="mdi:cart"></span>
                  Lista de compras
                </button>
                <div class="week-navigation">
                  <button @click="previousWeek" class="nav-btn">
                    <span class="iconify" data-icon="mdi:chevron-left"></span>
                  </button>
                  <span class="current-week">{{ formatWeekRange() }}</span>
                  <button @click="nextWeek" class="nav-btn">
                    <span class="iconify" data-icon="mdi:chevron-right"></span>
                  </button>
                  <button @click="goToCurrentWeek" class="today-btn">Esta semana</button>
                </div>
              </div>
            </div>

            <!-- Grid del planificador responsive -->
            <div class="planificador-grid-responsive">
              <div v-for="(day, index) in weekDays" :key="day.date" class="day-card">
                <div class="day-header">
                  <div class="day-info">
                    <span class="day-name">{{ day.name }}</span>
                    <span class="day-date">{{ formatDate(day.date) }}</span>
                  </div>
                  <button class="generate-day-btn" @click="generateDayMenu(day.date)"
                    title="Generar menú para este día">
                    <span class="iconify" data-icon="mdi:auto-fix"></span>
                  </button>
                </div>

                <div class="meals-container">
                  <div v-for="mealType in mealTypes" :key="`${day.date}-${mealType.key}`" class="meal-slot"
                    @click="openRecipeSelection(day.name, mealType.key)">
                    <div class="meal-slot-header">
                      <div class="meal-type">
                        <span class="iconify" :data-icon="mealType.icon"></span>
                        <span>{{ mealType.label }}</span>
                        <span class="meal-time">{{ mealType.time }}</span>
                      </div>
                      <button class="add-meal-btn-small" @click.stop="openRecipeSelection(day.name, mealType.key)"
                        title="Agregar comida">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                    </div>

                    <div v-if="getMealForSlot(day.name, mealType.key)" class="meal-content-responsive"
                      @click.stop="openRecipeSelection(day.name, mealType.key)">
                      <button class="remove-btn-small" @click.stop="removeMeal(day.name, mealType.key)"
                        title="Eliminar">
                        <span class="iconify" data-icon="mdi:close"></span>
                      </button>

                      <div class="meal-preview">
                        <div v-if="getMealForSlot(day.name, mealType.key)?.isOutside" class="outside-content">
                          <span class="iconify" data-icon="mdi:map-marker"></span>
                          <p>Salida / Fuera de casa</p>
                        </div>
                        <div v-else-if="getMealForSlot(day.name, mealType.key)?.recipe" class="meal-preview-content">
                          <div class="meal-preview-image">
                            <img :src="getMealForSlot(day.name, mealType.key)?.recipe?.image" 
                                 :alt="getMealForSlot(day.name, mealType.key)?.recipe?.name"
                                 @error="handleImageError">
                          </div>
                          <div class="meal-preview-info">
                            <p class="meal-preview-name">
                              {{ getMealForSlot(day.name, mealType.key)?.recipe?.name || 'Comida rápida' }}
                            </p>
                            <div v-if="getMealForSlot(day.name, mealType.key)?.recipe" class="meal-preview-details">
                              <span>⏱️ {{ getMealForSlot(day.name, mealType.key)?.recipe?.time || '--' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="empty-slot">
                      <span class="iconify" data-icon="mdi:plus-circle-outline"></span>
                      <p>Agregar {{ mealType.label.toLowerCase() }}</p>
                    </div>
                  </div>
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

            <!-- Modal de generación de menú semanal -->
            <div v-if="showGenerateWeeklyModal" class="modal-overlay" @click="closeGenerateWeeklyModal">
              <div class="modal-content generate-weekly-modal" @click.stop>
                <button class="modal-close" @click="closeGenerateWeeklyModal">
                  <span class="iconify" data-icon="mdi:close"></span>
                </button>

                <h2 class="modal-title">Generar Menú Semanal</h2>

                <div class="preferences-section">
                  <h3>Preferencias de generación</h3>
                  <div class="preferences-grid">
                    <div class="preference-item">
                      <label class="preference-label">
                        <input type="checkbox" v-model="generationPreferences.variety">
                        <span class="checkbox-custom"></span>
                        <span class="preference-text">Maximizar variedad</span>
                      </label>
                    </div>
                    <div class="preference-item">
                      <label class="preference-label">
                        <input type="checkbox" v-model="generationPreferences.quick">
                        <span class="checkbox-custom"></span>
                        <span class="preference-text">Incluir comidas rápidas</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="weekdays-section">
                  <h3>Días a planificar</h3>
                  <div class="weekdays-grid">
                    <div v-for="day in weekDays" :key="day.date" class="weekday-item">
                      <label class="weekday-label">
                        <input type="checkbox" v-model="generationPreferences.selectedDays[day.name.toLowerCase()]" :checked="true">
                        <span class="checkbox-custom"></span>
                        <span class="weekday-text">{{ day.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="generated-preview">
                  <h3>Vista previa del menú</h3>
                  <div v-if="generatedWeeklyMenu.length === 0" class="empty-state">
                    <p>Selecciona preferencias y genera el menú</p>
                  </div>
                  <div v-else class="preview-grid">
                    <div v-for="meal in generatedWeeklyMenu" :key="`${meal.day}-${meal.meal}`" class="preview-meal">
                      <div class="preview-meal-header">
                        <h4>{{ meal.day }}</h4>
                        <span class="meal-type-badge">{{ getMealTypeLabel(meal.meal) }}</span>
                      </div>
                      <div class="preview-meal-content">
                        <img
                          :src="meal.recipe?.image || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'"
                          :alt="meal.recipe?.name || 'Comida rápida'" @error="handleImageError">
                        <div class="preview-meal-info">
                          <h5>{{ meal.recipe?.name || 'Sin asignar' }}</h5>
                          <div v-if="meal.recipe" class="preview-meal-details">
                            <span>⏱️ {{ meal.recipe.time }}</span>
                            <span>👥 {{ meal.recipe.servings }} porciones</span>
                          </div>
                          <div v-if="meal.isOutside" class="outside-badge-small">
                            <span class="iconify" data-icon="mdi:map-marker"></span>
                            Fuera
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-actions">
                  <button class="modal-btn cancel-btn" @click="closeGenerateWeeklyModal">Cancelar</button>
                  <button class="modal-btn generate-btn" @click="generateWeekPreview">
                    <span class="iconify" data-icon="mdi:sparkles"></span>
                    Generar Vista Previa
                  </button>
                  <button class="modal-btn confirm-btn" @click="applyGeneratedWeeklyMenu"
                    :disabled="generatedWeeklyMenu.length === 0">
                    Aplicar Menú Semanal
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal de lista de compras -->
            <div v-if="showShoppingListModal" class="modal-overlay" @click="closeShoppingListModal">
              <div class="modal-content shopping-list-modal" @click.stop>
                <button class="modal-close" @click="closeShoppingListModal">
                  <span class="iconify" data-icon="mdi:close"></span>
                </button>

                <h2 class="modal-title">Lista de Compras Semanal</h2>
                <p class="modal-subtitle">Ingredientes necesarios para la semana</p>

                <div class="shopping-list-content">
                  <div class="shopping-list-stats">
                    <div class="stat-item">
                      <span class="stat-label">Total ingredientes</span>
                      <span class="stat-value">{{ shoppingList.length }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Recetas incluidas</span>
                      <span class="stat-value">{{ shoppingListStats.recipes }}</span>
                    </div>
                  </div>

                  <div class="shopping-list-items">
                    <div v-if="shoppingList.length === 0" class="empty-state">
                      <p>No hay ingredientes en la lista de compras</p>
                    </div>
                    <div v-else v-for="category in groupedShoppingList" :key="category.name" class="category-section">
                      <h4 class="category-title">{{ category.name }}</h4>
                      <div class="category-items">
                        <div v-for="item in category.items" :key="item.id" class="shopping-item">
                          <label class="item-label">
                            <input type="checkbox" v-model="item.purchased">
                            <span class="checkbox-custom"></span>
                            <span class="item-name" :class="{ purchased: item.purchased }">{{ item.name }}</span>
                          </label>
                          <div class="item-quantity">
                            <span class="quantity-value">{{ item.quantity }}</span>
                            <span class="quantity-unit">{{ item.unit }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-actions">
                  <button class="modal-btn cancel-btn" @click="closeShoppingListModal">Cerrar</button>
                  <button class="modal-btn export-btn" @click="exportShoppingList">
                    <span class="iconify" data-icon="mdi:export"></span>
                    Exportar Lista
                  </button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '@/supabase'

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
    
    // Tipos de comidas con correspondencia a base de datos
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless', dbType: 'desayuno' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food', dbType: 'almuerzo' },
      { key: 'snack', label: 'Merienda', time: '4:00 PM', icon: 'mdi:coffee', dbType: 'merienda' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent', dbType: 'cena' }
    ]

    // Estados del componente
    const weekMeals = ref([])
    const isSelectingRecipe = ref(false)
    const selectedDay = ref('')
    const selectedMeal = ref('')
    const showGenerateWeeklyModal = ref(false)
    const showShoppingListModal = ref(false)
    const generatedWeeklyMenu = ref([])
    const shoppingList = ref([])
    const allRecipes = ref([])
    const loading = reactive({
      initial: true,
      recipes: false,
      shoppingList: false
    })

    // Navegación semanal
    const currentWeekStart = ref(null)
    const weekDays = ref([])

    // Preferencias de generación
    const generationPreferences = reactive({
      variety: true,
      quick: true,
      selectedDays: {
        lunes: true,
        martes: true,
        miércoles: true,
        jueves: true,
        viernes: true,
        sábado: true,
        domingo: true
      }
    })

    // Sistema de notificaciones
    const showToast = ref(false)
    const toastConfig = reactive({
      type: 'info',
      title: '',
      message: '',
      icon: 'mdi:information'
    })

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    // Obtener lunes de una semana
    const getWeekStart = (date = new Date()) => {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(date.setDate(diff))
      weekStart.setHours(0, 0, 0, 0)
      return weekStart
    }

    // Obtener domingo de una semana
    const getWeekEnd = (weekStart) => {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      return weekEnd
    }

    // Formatear fecha en español
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    // Formatear rango semanal
    const formatWeekRange = () => {
      if (weekDays.value.length === 0) return 'Cargando...'
      
      const firstDay = weekDays.value[0]
      const lastDay = weekDays.value[6]
      
      const firstFormatted = formatDate(firstDay.date)
      const lastFormatted = formatDate(lastDay.date)
      
      return `Semana del ${firstFormatted} al ${lastFormatted}`
    }

    // Mostrar notificación
    const showNotification = (type, title, message, icon = null) => {
      toastConfig.type = type
      toastConfig.title = title
      toastConfig.message = message
      
      if (icon) {
        toastConfig.icon = icon
      } else {
        switch (type) {
          case 'success':
            toastConfig.icon = 'mdi:check-circle'
            break
          case 'error':
            toastConfig.icon = 'mdi:alert-circle'
            break
          case 'warning':
            toastConfig.icon = 'mdi:alert'
            break
          default:
            toastConfig.icon = 'mdi:information'
        }
      }
      
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }

    // Manejador de errores de imágenes
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAxNTBIMzAwVjEwMEgzNTBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    // ============================================
    // GESTIÓN DE SEMANAS
    // ============================================

    // Generar array de días de la semana
    const generateWeekDays = (weekStart) => {
      const daysArray = []
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        
        daysArray.push({
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          dayOfWeek: i // 0=lunes, 6=domingo
        })
      }
      
      return daysArray
    }

    // Navegar a semana anterior
    const previousWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() - 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    // Navegar a semana siguiente
    const nextWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() + 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    // Ir a semana actual
    const goToCurrentWeek = () => {
      const today = new Date()
      currentWeekStart.value = getWeekStart(today)
      weekDays.value = generateWeekDays(currentWeekStart.value)
      loadWeekData()
    }

    // ============================================
    // CARGA DE DATOS
    // ============================================

    // Cargar datos de la semana actual
    const loadWeekData = async () => {
      try {
        loading.initial = true
        
        if (!authStore.user?.id) {
          showNotification('error', 'Error', 'Usuario no autenticado')
          return
        }

        const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
        
        // 1. Buscar o crear planificador semanal
        const { data: plannerData, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id, week_start, preferences')
          .eq('user_id', authStore.user.id)
          .eq('week_start', weekStartStr)
          .single()

        let plannerId = null
        
        if (plannerError || !plannerData) {
          // Crear nuevo planificador
          const weekEnd = getWeekEnd(new Date(currentWeekStart.value))
          
          const { data: newPlanner, error: createError } = await supabase
            .from('weekly_planner')
            .insert({
              user_id: authStore.user.id,
              week_start: weekStartStr,
              week_end: weekEnd.toISOString().split('T')[0],
              preferences: { dietary: [], variety: true }
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creando planificador:', createError)
            showNotification('error', 'Error', 'No se pudo crear el planificador semanal')
            return
          }
          
          plannerId = newPlanner.id
        } else {
          plannerId = plannerData.id
        }

        // 2. Cargar comidas planificadas
        const { data: plannedMeals, error: mealsError } = await supabase
          .from('planned_meals')
          .select(`
            id,
            day_of_week,
            meal_type,
            recipe:recipes (
              id,
              title,
              description,
              total_time,
              servings,
              image_url,
              calories_per_serving
            )
          `)
          .eq('planner_id', plannerId)

        if (mealsError) {
          console.error('Error cargando comidas:', mealsError)
          showNotification('error', 'Error', 'No se pudieron cargar las comidas planificadas')
        } else {
          // Transformar datos para la vista
          weekMeals.value = plannedMeals.map(meal => {
            const dayName = weekDays.value.find(d => d.dayOfWeek === meal.day_of_week)?.name || ''
            const mealType = mealTypes.find(m => m.dbType === meal.meal_type)?.key || ''
            
            return {
              id: meal.id,
              day: dayName,
              dayOfWeek: meal.day_of_week,
              meal: mealType,
              mealDbType: meal.meal_type,
              recipe: meal.recipe ? {
                id: meal.recipe.id,
                name: meal.recipe.title,
                time: `${meal.recipe.total_time} min`,
                servings: meal.recipe.servings,
                image: meal.recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120',
                calories: meal.recipe.calories_per_serving
              } : null,
              isOutside: !meal.recipe
            }
          })
        }

        // 3. Cargar recetas para el modal
        await loadAllRecipes()

      } catch (error) {
        console.error('Error cargando datos:', error)
        showNotification('error', 'Error', 'Error al cargar los datos del planificador')
      } finally {
        loading.initial = false
      }
    }

    // Cargar todas las recetas
    const loadAllRecipes = async () => {
      try {
        loading.recipes = true
        
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, total_time, servings, image_url, tags')
          .eq('is_public', true)
          .order('title')

        if (error) throw error

        allRecipes.value = data.map(recipe => {
          // Determinar tipo basado en tags
          let type = 'General'
          if (recipe.tags?.includes('desayuno')) type = 'Desayuno'
          else if (recipe.tags?.includes('almuerzo')) type = 'Almuerzo'
          else if (recipe.tags?.includes('cena')) type = 'Cena'
          else if (recipe.tags?.includes('merienda')) type = 'Merienda'

          return {
            id: recipe.id,
            name: recipe.title,
            time: `${recipe.total_time} min`,
            servings: recipe.servings,
            type: type,
            image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120',
            tags: recipe.tags || []
          }
        })

      } catch (error) {
        console.error('Error cargando recetas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las recetas')
        allRecipes.value = []
      } finally {
        loading.recipes = false
      }
    }

    // ============================================
    // GESTIÓN DE COMIDAS POR SLOT
    // ============================================

    // Obtener comida para un slot específico
    const getMealForSlot = (day, mealKey) => {
      return weekMeals.value.find(m => m.day === day && m.meal === mealKey)
    }

    // Abrir modal de selección
    const openRecipeSelection = (day, mealKey) => {
      selectedDay.value = day
      selectedMeal.value = mealKey
      isSelectingRecipe.value = true
    }

    // Cerrar modal
    const closeRecipeSelection = () => {
      isSelectingRecipe.value = false
      selectedDay.value = ''
      selectedMeal.value = ''
    }

    // Obtener planificador ID para la semana actual
    const getCurrentPlannerId = async () => {
      const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('weekly_planner')
        .select('id')
        .eq('user_id', authStore.user.id)
        .eq('week_start', weekStartStr)
        .single()

      if (error) {
        console.error('Error obteniendo planificador:', error)
        return null
      }
      
      return data.id
    }

    // Seleccionar receta
    const selectRecipe = async (recipe) => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        const dayOfWeek = weekDays.value.find(d => d.name === selectedDay.value)?.dayOfWeek
        const mealDbType = mealTypes.find(m => m.key === selectedMeal.value)?.dbType

        if (dayOfWeek === undefined || !mealDbType) {
          showNotification('error', 'Error', 'Datos inválidos')
          return
        }

        // Eliminar comida existente si existe
        const existingMeal = weekMeals.value.find(
          m => m.day === selectedDay.value && m.meal === selectedMeal.value
        )
        
        if (existingMeal?.id) {
          const { error: deleteError } = await supabase
            .from('planned_meals')
            .delete()
            .eq('id', existingMeal.id)

          if (deleteError) throw deleteError
        }

        // Insertar nueva comida
        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert({
            planner_id: plannerId,
            day_of_week: dayOfWeek,
            meal_type: mealDbType,
            recipe_id: recipe.id
          })

        if (insertError) throw insertError

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
        )
        
        weekMeals.value.push({
          day: selectedDay.value,
          dayOfWeek: dayOfWeek,
          meal: selectedMeal.value,
          mealDbType: mealDbType,
          recipe: recipe,
          isOutside: false
        })

        showNotification('success', 'Éxito', `${recipe.name} agregado al planificador`)
        closeRecipeSelection()

      } catch (error) {
        console.error('Error seleccionando receta:', error)
        showNotification('error', 'Error', 'No se pudo agregar la receta')
      }
    }

    // Marcar como salida/fuera
    const setOutsideMeal = async () => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        const dayOfWeek = weekDays.value.find(d => d.name === selectedDay.value)?.dayOfWeek
        const mealDbType = mealTypes.find(m => m.key === selectedMeal.value)?.dbType

        if (dayOfWeek === undefined || !mealDbType) {
          showNotification('error', 'Error', 'Datos inválidos')
          return
        }

        // Eliminar comida existente si existe
        const existingMeal = weekMeals.value.find(
          m => m.day === selectedDay.value && m.meal === selectedMeal.value
        )
        
        if (existingMeal?.id) {
          const { error: deleteError } = await supabase
            .from('planned_meals')
            .delete()
            .eq('id', existingMeal.id)

          if (deleteError) throw deleteError
        }

        // Insertar marcador de "fuera"
        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert({
            planner_id: plannerId,
            day_of_week: dayOfWeek,
            meal_type: mealDbType,
            recipe_id: null // null indica "fuera"
          })

        if (insertError) throw insertError

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
        )
        
        weekMeals.value.push({
          day: selectedDay.value,
          dayOfWeek: dayOfWeek,
          meal: selectedMeal.value,
          mealDbType: mealDbType,
          recipe: null,
          isOutside: true
        })

        showNotification('success', 'Éxito', 'Marcado como salida/fuera de casa')
        closeRecipeSelection()

      } catch (error) {
        console.error('Error marcando como fuera:', error)
        showNotification('error', 'Error', 'No se pudo actualizar')
      }
    }

    // Eliminar comida
    const removeMeal = async (day, mealKey) => {
      try {
        const meal = weekMeals.value.find(m => m.day === day && m.meal === mealKey)
        
        if (!meal?.id) {
          showNotification('warning', 'Advertencia', 'No hay comida para eliminar')
          return
        }

        const { error } = await supabase
          .from('planned_meals')
          .delete()
          .eq('id', meal.id)

        if (error) throw error

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === day && m.meal === mealKey)
        )

        showNotification('success', 'Éxito', 'Comida eliminada del planificador')

      } catch (error) {
        console.error('Error eliminando comida:', error)
        showNotification('error', 'Error', 'No se pudo eliminar la comida')
      }
    }

    // ============================================
    // GENERACIÓN DE MENÚ SEMANAL
    // ============================================

    // Abrir modal de generación
    const generateWeeklyMenu = () => {
      showGenerateWeeklyModal.value = true
      generatedWeeklyMenu.value = []
    }

    // Cerrar modal
    const closeGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = false
      generationPreferences.selectedDays = {
        lunes: true,
        martes: true,
        miércoles: true,
        jueves: true,
        viernes: true,
        sábado: true,
        domingo: true
      }
    }

    // Generar menú para un día
    const generateDayMenu = async (date) => {
      try {
        const dayName = weekDays.value.find(d => d.date === date)?.name
        if (!dayName) return
        
        const dayOfWeek = weekDays.value.find(d => d.name === dayName)?.dayOfWeek
        const plannerId = await getCurrentPlannerId()
        
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        // Eliminar comidas existentes para este día
        const dayMeals = weekMeals.value.filter(m => m.day === dayName)
        for (const meal of dayMeals) {
          if (meal.id) {
            await supabase
              .from('planned_meals')
              .delete()
              .eq('id', meal.id)
          }
        }

        // Generar nuevas comidas
        const newMeals = []
        
        for (const mealType of mealTypes) {
          // Filtrar recetas por tipo
          const suitableRecipes = allRecipes.value.filter(recipe => 
            recipe.tags?.includes(mealType.dbType) || recipe.type === mealType.label
          )
          
          if (suitableRecipes.length > 0) {
            const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
            
            // Insertar en base de datos
            const { error } = await supabase
              .from('planned_meals')
              .insert({
                planner_id: plannerId,
                day_of_week: dayOfWeek,
                meal_type: mealType.dbType,
                recipe_id: randomRecipe.id
              })

            if (!error) {
              newMeals.push({
                day: dayName,
                dayOfWeek: dayOfWeek,
                meal: mealType.key,
                mealDbType: mealType.dbType,
                recipe: randomRecipe,
                isOutside: false
              })
            }
          }
        }

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(m => m.day !== dayName)
        weekMeals.value.push(...newMeals)

        showNotification('success', 'Éxito', `Menú generado para ${dayName}`)

      } catch (error) {
        console.error('Error generando menú diario:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    // Generar vista previa del menú semanal
    const generateWeekPreview = async () => {
      try {
        // Obtener recetas filtradas por preferencias
        let filteredRecipes = [...allRecipes.value]
        
        if (generationPreferences.quick) {
          filteredRecipes = filteredRecipes.filter(r => 
            parseInt(r.time) <= 30 // Recetas rápidas (30 min o menos)
          )
        }

        // Generar menú basado en días seleccionados
        const preview = []
        
        for (const day of weekDays.value) {
          const dayLower = day.name.toLowerCase()
          
          if (generationPreferences.selectedDays[dayLower]) {
            for (const mealType of mealTypes) {
              // Verificar si ya hay comida planificada
              const existing = weekMeals.value.find(
                m => m.day === day.name && m.meal === mealType.key
              )
              
              if (existing) {
                preview.push(existing)
              } else {
                // Generar nueva comida
                const suitableRecipes = filteredRecipes.filter(recipe => 
                  recipe.tags?.includes(mealType.dbType) || recipe.type === mealType.label
                )
                
                if (suitableRecipes.length > 0) {
                  const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
                  
                  preview.push({
                    day: day.name,
                    dayOfWeek: day.dayOfWeek,
                    meal: mealType.key,
                    mealDbType: mealType.dbType,
                    recipe: randomRecipe,
                    isOutside: false
                  })
                }
              }
            }
          }
        }

        generatedWeeklyMenu.value = preview
        showNotification('success', 'Éxito', 'Vista previa generada')

      } catch (error) {
        console.error('Error generando vista previa:', error)
        showNotification('error', 'Error', 'No se pudo generar la vista previa')
      }
    }

    // Aplicar menú generado
    const applyGeneratedWeeklyMenu = async () => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        // Eliminar todas las comidas de la semana actual
        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', plannerId)

        if (deleteError) throw deleteError

        // Insertar nuevas comidas
        const mealsToInsert = generatedWeeklyMenu.value.map(meal => ({
          planner_id: plannerId,
          day_of_week: meal.dayOfWeek,
          meal_type: meal.mealDbType,
          recipe_id: meal.isOutside ? null : meal.recipe?.id
        }))

        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert(mealsToInsert)

        if (insertError) throw insertError

        // Actualizar estado local
        weekMeals.value = generatedWeeklyMenu.value

        showNotification('success', 'Éxito', 'Menú semanal aplicado exitosamente')
        closeGenerateWeeklyModal()

      } catch (error) {
        console.error('Error aplicando menú:', error)
        showNotification('error', 'Error', 'No se pudo aplicar el menú')
      }
    }

    // ============================================
    // LISTA DE COMPRAS
    // ============================================

    // Abrir modal de lista de compras
    const generateShoppingList = async () => {
      try {
        loading.shoppingList = true
        await generateShoppingListData()
        showShoppingListModal.value = true
      } catch (error) {
        console.error('Error generando lista:', error)
        showNotification('error', 'Error', 'No se pudo generar la lista')
      } finally {
        loading.shoppingList = false
      }
    }

    // Cerrar modal
    const closeShoppingListModal = () => {
      showShoppingListModal.value = false
    }

    // Generar datos de lista de compras
    const generateShoppingListData = async () => {
      try {
        // Obtener recetas planificadas
        const recipeIds = weekMeals.value
          .filter(meal => !meal.isOutside && meal.recipe?.id)
          .map(meal => meal.recipe.id)
        
        if (recipeIds.length === 0) {
          shoppingList.value = []
          showNotification('info', 'Información', 'No hay recetas planificadas')
          return
        }

        // Obtener ingredientes de todas las recetas
        const { data: ingredientsData, error } = await supabase
          .from('recipe_ingredients')
          .select(`
            quantity,
            unit,
            ingredient:ingredients (
              id,
              name,
              category
            )
          `)
          .in('recipe_id', recipeIds)

        if (error) throw error

        // Consolidar ingredientes
        const consolidated = {}
        
        ingredientsData.forEach(item => {
          const ingredient = item.ingredient
          if (!ingredient) return
          
          const key = `${ingredient.id}-${item.unit}`
          
          if (!consolidated[key]) {
            consolidated[key] = {
              id: ingredient.id,
              name: ingredient.name,
              category: ingredient.category || 'otros',
              quantity: 0,
              unit: item.unit,
              purchased: false
            }
          }
          
          consolidated[key].quantity += parseFloat(item.quantity)
        })

        // Convertir a array y formatear cantidades
        shoppingList.value = Object.values(consolidated).map(item => ({
          ...item,
          quantity: `${Math.ceil(item.quantity * 100) / 100}`, // Redondear a 2 decimales
          purchased: false
        }))

      } catch (error) {
        console.error('Error generando lista de compras:', error)
        throw error
      }
    }

    // Agrupar lista de compras por categoría
    const groupedShoppingList = computed(() => {
      const groups = {}
      
      shoppingList.value.forEach(item => {
        const category = item.category || 'otros'
        
        if (!groups[category]) {
          groups[category] = {
            name: formatCategory(category),
            items: []
          }
        }
        groups[category].items.push(item)
      })
      
      return Object.values(groups)
    })

    // Formatear categoría
    const formatCategory = (category) => {
      const categories = {
        'verduras': 'Verduras',
        'frutas': 'Frutas',
        'proteínas': 'Proteínas',
        'granos': 'Granos',
        'lácteos': 'Lácteos',
        'condimentos': 'Condimentos',
        'aceites': 'Aceites',
        'otros': 'Otros'
      }
      return categories[category] || category
    }

    // Estadísticas de lista de compras
    const shoppingListStats = computed(() => {
      const recipes = new Set(
        weekMeals.value
          .filter(meal => !meal.isOutside && meal.recipe)
          .map(meal => meal.recipe.id)
      )
      
      return {
        recipes: recipes.size,
        total: shoppingList.value.length,
        purchased: shoppingList.value.filter(item => item.purchased).length
      }
    })

    // Exportar lista de compras
    const exportShoppingList = () => {
      try {
        const listText = `LISTA DE COMPRAS - ${formatWeekRange()}\n\n`
        
        groupedShoppingList.value.forEach(category => {
          listText += `=== ${category.name.toUpperCase()} ===\n`
          
          category.items.forEach(item => {
            const purchased = item.purchased ? '[✓]' : '[ ]'
            listText += `${purchased} ${item.name} - ${item.quantity} ${item.unit}\n`
          })
          
          listText += '\n'
        })
        
        const blob = new Blob([listText], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        showNotification('success', 'Éxito', 'Lista exportada')

      } catch (error) {
        console.error('Error exportando lista:', error)
        showNotification('error', 'Error', 'No se pudo exportar la lista')
      }
    }

    // ============================================
    // FUNCIONES DEL LAYOUT
    // ============================================

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const handleLogout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('❌ Error cerrando sesión:', error)
        showNotification('error', 'Error', 'No se pudo cerrar sesión')
      }
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    onMounted(async () => {
      // Verificar autenticación
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }

      // Inicializar semana actual
      const today = new Date()
      currentWeekStart.value = getWeekStart(today)
      weekDays.value = generateWeekDays(currentWeekStart.value)
      
      // Cargar datos
      await loadWeekData()
      
      showNotification('success', 'Bienvenido', 'Planificador semanal cargado')
    })

    return {
      // Estados
      isMobileMenuOpen,
      mealTypes,
      weekMeals,
      allRecipes,
      isSelectingRecipe,
      selectedDay,
      selectedMeal,
      weekDays,
      showGenerateWeeklyModal,
      showShoppingListModal,
      generatedWeeklyMenu,
      shoppingList,
      generationPreferences,
      groupedShoppingList,
      shoppingListStats,
      loading,
      showToast,
      toastConfig,
      
      // Layout
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      
      // Planificador
      getMealForSlot,
      openRecipeSelection,
      closeRecipeSelection,
      selectRecipe,
      setOutsideMeal,
      removeMeal,
      
      // Navegación
      previousWeek,
      nextWeek,
      goToCurrentWeek,
      
      // Helper functions
      formatDate,
      formatWeekRange,
      
      // Generación de menú
      generateWeeklyMenu,
      closeGenerateWeeklyModal,
      generateDayMenu,
      generateWeekPreview,
      applyGeneratedWeeklyMenu,
      
      // Lista de compras
      generateShoppingList,
      closeShoppingListModal,
      exportShoppingList,
      
      // Utils
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
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.generate-week-btn,
.shopping-list-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: background-color 0.2s;
}

.generate-week-btn:hover,
.shopping-list-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.shopping-list-btn {
  background-color: rgba(139, 177, 116, 0.9);
}

.shopping-list-btn:hover {
  background-color: rgba(139, 177, 116, 1);
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.current-week {
  font-weight: 500;
  color: var(--foreground);
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

.nav-btn .iconify {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--foreground);
}

.today-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--foreground);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.today-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

/* ============================================
   NUEVO DISEÑO RESPONSIVE DEL CALENDARIO
   ============================================ */

/* Grid responsive */
.planificador-grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.day-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.day-info {
  display: flex;
  flex-direction: column;
}

.day-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.day-date {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.generate-day-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-day-btn:hover {
  background-color: rgba(93, 162, 113, 0.2);
  border-color: var(--primary);
}

.generate-day-btn .iconify {
  width: 18px;
  height: 18px;
}

.meals-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meal-slot {
  background-color: rgba(168, 213, 186, 0.05);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  transition: all 0.2s;
  cursor: pointer;
}

.meal-slot:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.meal-slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meal-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.meal-type .iconify {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.meal-time {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-left: 8px;
  font-weight: normal;
}

.add-meal-btn-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-meal-btn-small:hover {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

.add-meal-btn-small .iconify {
  width: 16px;
  height: 16px;
}

.meal-content-responsive {
  position: relative;
  background-color: white;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(93, 162, 113, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.meal-content-responsive:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.remove-btn-small {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--destructive);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.meal-content-responsive:hover .remove-btn-small {
  opacity: 1;
}

.remove-btn-small .iconify {
  width: 12px;
  height: 12px;
}

.meal-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.outside-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  width: 100%;
}

.outside-content .iconify {
  width: 24px;
  height: 24px;
  color: var(--secondary);
}

.outside-content p {
  font-size: 12px;
  font-weight: 500;
  color: var(--secondary);
  text-align: center;
}

.meal-preview-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.meal-preview-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.meal-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-preview-info {
  flex: 1;
  min-width: 0;
}

.meal-preview-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-preview-details {
  font-size: 11px;
  color: var(--muted-foreground);
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  border: 2px dashed var(--border);
  border-radius: 10px;
  background-color: rgba(168, 213, 186, 0.05);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.empty-slot:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: rgba(168, 213, 186, 0.1);
}

.empty-slot .iconify {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
}

.empty-slot p {
  font-size: 12px;
  font-weight: 500;
}

/* ============================================
   ESTILOS EXISTENTES DEL MODAL (mantenidos)
   ============================================ */

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

/* ============================================
   NUEVOS MODALES (de ejemplo)
   ============================================ */

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
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: var(--card);
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.generate-weekly-modal {
  max-width: 900px;
  padding: 2rem;
}

.generate-weekly-modal .modal-close {
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--border);
}

.generate-weekly-modal .modal-close:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
}

.generate-weekly-modal .modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 1rem;
}

.preferences-section {
  margin-bottom: 2rem;
}

.preferences-section h3,
.weekdays-section h3,
.generated-preview h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 1rem;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.preference-item {
  display: flex;
  align-items: center;
}

.preference-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  width: 100%;
  transition: all 0.2s;
}

.preference-label:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.preference-label input {
  display: none;
}

.checkbox-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.preference-label input:checked+.checkbox-custom {
  background-color: var(--primary);
  border-color: var(--primary);
}

.preference-label input:checked+.checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 0.875rem;
}

.preference-text {
  font-weight: 500;
}

.weekdays-section {
  margin-bottom: 2rem;
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.weekday-item {
  display: flex;
  align-items: center;
}

.weekday-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  width: 100%;
  transition: all 0.2s;
}

.weekday-label:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.weekday-text {
  font-weight: 500;
}

.generated-preview {
  margin-bottom: 2rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 1rem;
}

.preview-meal {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
}

.preview-meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: rgba(93, 162, 113, 0.1);
  border-bottom: 1px solid var(--border);
}

.preview-meal-header h4 {
  font-weight: 600;
  color: var(--primary);
  font-size: 0.875rem;
}

.meal-type-badge {
  background-color: var(--primary);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.preview-meal-content {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
}

.preview-meal-content img {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.preview-meal-info {
  flex: 1;
}

.preview-meal-info h5 {
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.preview-meal-details {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.outside-badge-small {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.625rem;
  color: var(--secondary);
  background-color: rgba(139, 177, 116, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.outside-badge-small .iconify {
  width: 8px;
  height: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--muted-foreground);
}

/* Modal de lista de compras */
.shopping-list-modal {
  max-width: 800px;
  padding: 2rem;
}

.shopping-list-modal .modal-subtitle {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

.shopping-list-content {
  margin: 2rem 0;
}

.shopping-list-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: rgba(168, 213, 186, 0.1);
  padding: 1rem;
  border-radius: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--foreground);
}

.shopping-list-items {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 1rem;
}

.category-section {
  margin-bottom: 1.5rem;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shopping-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.item-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.item-name {
  font-weight: 500;
  color: var(--foreground);
}

.item-name.purchased {
  text-decoration: line-through;
  color: var(--muted-foreground);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-value {
  font-weight: 600;
  color: var(--primary);
}

.quantity-unit {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

/* Acciones de modal */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.cancel-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.confirm-btn {
  background-color: var(--primary);
  color: white;
}

.confirm-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.generate-btn {
  background-color: #8b5cf6;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generate-btn:hover {
  background-color: #7c3aed;
}

.export-btn {
  background-color: rgba(139, 177, 116, 0.9);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-btn:hover {
  background-color: rgba(139, 177, 116, 1);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Ajustes para móvil */
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

  /* Header responsive */
  .planificador-header {
    gap: 16px;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .week-navigation {
    margin-left: 0;
    justify-content: center;
  }

  /* Grid responsive en móvil */
  .planificador-grid-responsive {
    grid-template-columns: 1fr;
  }

  /* Modal responsive */
  .modal-content {
    margin: 1rem;
    max-height: 85vh;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .preferences-grid,
  .weekdays-grid {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
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

  .meal-type {
    font-size: 12px;
  }

  .meal-time {
    display: none;
  }
}

/* Media queries para tamaños de pantalla más grandes */
@media (min-width: 1400px) {
  .content-container {
    max-width: 1600px;
  }

  .planificador-grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1399px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>