<!-- src/views/InicioView.vue -->
<template>
  <div class="inicio-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <div class="inicio-view">
            <!-- Daily Meals -->
            <section class="section-card">
              <div class="section-header">
                <h2 class="section-title">Comidas del día</h2>
                <button class="generate-menu-btn">
                  <span class="iconify" data-icon="mdi:sparkles"></span>
                  Generar nuevo menú
                </button>
              </div>

              <div class="meals-grid">
                <!-- Breakfast -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img
                      src="https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160"
                      alt="Bowl de Avena con Frutas">
                    <div class="meal-emoji">🌅</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Desayuno</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>Bowl de Avena con Frutas</h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>15 min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>2 porciones</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn" @click="goToRecipe('breakfast')">Cocinar</button>
                      <button class="change-btn" @click="changeMeal('breakfast')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Lunch -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img
                      src="https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160"
                      alt="Ensalada de Pollo a la Parrilla">
                    <div class="meal-emoji">🍽️</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Almuerzo</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>Ensalada de Pollo a la Parrilla</h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>30 min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>4 porciones</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn" @click="goToRecipe('lunch')">Cocinar</button>
                      <button class="change-btn" @click="changeMeal('lunch')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Dinner -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img
                      src="https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160"
                      alt="Pasta Primavera">
                    <div class="meal-emoji">🌙</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Cena</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>Pasta Primavera</h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>25 min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>4 porciones</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn" @click="goToRecipe('dinner')">Cocinar</button>
                      <button class="change-btn" @click="changeMeal('dinner')">Cambiar</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- My Pantry - EN CUADRO BLANCO -->
            <section class="section-card bg-white-card">
              <div class="section-header">
                <h2 class="section-title">Mi Despensa</h2>
                <button class="add-ingredient-btn" @click="addIngredient">
                  <span class="iconify" data-icon="mdi:plus"></span>
                  Agregar ingrediente
                </button>
              </div>

              <div class="pantry-grid">
                <div class="pantry-item">
                  <div class="pantry-image">
                    <img
                      src="https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200"
                      alt="Tomate">
                    <div class="expiry-badge warning">3 días</div>
                  </div>
                  <div class="pantry-info">
                    <h4>Tomate</h4>
                    <p class="pantry-quantity">5 unidades</p>
                    <p class="pantry-category">Verduras</p>
                    <div class="pantry-actions">
                      <button class="quantity-btn minus" @click="decreaseQuantity('tomato')">
                        <span class="iconify" data-icon="mdi:minus"></span>
                      </button>
                      <button class="quantity-btn plus" @click="increaseQuantity('tomato')">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                      <button class="delete-btn" @click="removeIngredient('tomato')">
                        <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="pantry-item">
                  <div class="pantry-image">
                    <img
                      src="https://images.unsplash.com/photo-1651793371427-ad065df0d208?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200"
                      alt="Arroz">
                    <div class="expiry-badge safe">90 días</div>
                  </div>
                  <div class="pantry-info">
                    <h4>Arroz</h4>
                    <p class="pantry-quantity">1 kg</p>
                    <p class="pantry-category">Granos</p>
                    <div class="pantry-actions">
                      <button class="quantity-btn minus" @click="decreaseQuantity('rice')">
                        <span class="iconify" data-icon="mdi:minus"></span>
                      </button>
                      <button class="quantity-btn plus" @click="increaseQuantity('rice')">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                      <button class="delete-btn" @click="removeIngredient('rice')">
                        <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="pantry-item">
                  <div class="pantry-image">
                    <img
                      src="https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200"
                      alt="Pollo">
                    <div class="expiry-badge danger">2 días</div>
                  </div>
                  <div class="pantry-info">
                    <h4>Pollo</h4>
                    <p class="pantry-quantity">500 g</p>
                    <p class="pantry-category">Proteínas</p>
                    <div class="pantry-actions">
                      <button class="quantity-btn minus" @click="decreaseQuantity('chicken')">
                        <span class="iconify" data-icon="mdi:minus"></span>
                      </button>
                      <button class="quantity-btn plus" @click="increaseQuantity('chicken')">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                      <button class="delete-btn" @click="removeIngredient('chicken')">
                        <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="pantry-item">
                  <div class="pantry-image">
                    <img
                      src="https://images.unsplash.com/photo-1597937081593-0ddc5f66deb0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200"
                      alt="Cebolla">
                    <div class="expiry-badge safe">7 días</div>
                  </div>
                  <div class="pantry-info">
                    <h4>Cebolla</h4>
                    <p class="pantry-quantity">3 unidades</p>
                    <p class="pantry-category">Verduras</p>
                    <div class="pantry-actions">
                      <button class="quantity-btn minus" @click="decreaseQuantity('onion')">
                        <span class="iconify" data-icon="mdi:minus"></span>
                      </button>
                      <button class="quantity-btn plus" @click="increaseQuantity('onion')">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                      <button class="delete-btn" @click="removeIngredient('onion')">
                        <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Grid Layout for Recipes and Weather -->
            <div class="grid-layout">
              <!-- Recommended Recipes -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">Recetas Recomendadas</h2>
                  <button class="view-all-btn" @click="goToRecipes">
                    Ver todas
                    <span class="iconify" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <div class="recipes-grid">
                  <div class="recipe-card" @click="viewRecipe('tacos')">
                    <div class="recipe-image">
                      <img
                        src="https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120"
                        alt="Tacos Mexicanos">
                      <div class="recipe-badge">Usa lo que tienes 🌿</div>
                    </div>
                    <div class="recipe-content">
                      <h4>Tacos Mexicanos Caseros</h4>
                      <div class="recipe-details">
                        <span>⏱️ 25 min</span>
                        <span>👥 4 porciones</span>
                      </div>
                      <button class="recipe-view-btn">Ver receta</button>
                    </div>
                  </div>

                  <div class="recipe-card" @click="viewRecipe('soup')">
                    <div class="recipe-image">
                      <img
                        src="https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120"
                        alt="Sopa de Verduras">
                      <div class="recipe-badge">Saludable</div>
                    </div>
                    <div class="recipe-content">
                      <h4>Sopa de Verduras Nutritiva</h4>
                      <div class="recipe-details">
                        <span>⏱️ 35 min</span>
                        <span>👥 6 porciones</span>
                      </div>
                      <button class="recipe-view-btn">Ver receta</button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right Column -->
              <div class="right-column">
                <!-- Weather Suggestion - MEJORADO (Manteniendo tu diseño actual) -->
                <section class="weather-suggestion-card">
                  <div class="weather-header">
                    <div class="weather-icon-container">
                      <span class="iconify weather-icon" data-icon="mdi:weather-partly-cloudy"></span>
                    </div>
                    <div>
                      <h3 class="weather-title">Sugerencia del clima</h3>
                      <p class="weather-subtitle">18°C - Parcialmente nublado</p>
                    </div>
                  </div>
                  <div class="weather-content">
                    <p class="weather-desc">
                      <span class="iconify" data-icon="mdi:lightbulb-on-outline"></span>
                      Hoy es un día perfecto para preparar <strong>Sopa de Verduras Nutritiva</strong>.
                      El clima fresco pide algo caliente y reconfortante.
                    </p>
                    <div class="weather-stats">
                      <div class="stat-item">
                        <span class="stat-label">Temperatura</span>
                        <span class="stat-value">18°C</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Humedad</span>
                        <span class="stat-value">65%</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Viento</span>
                        <span class="stat-value">12 km/h</span>
                      </div>
                    </div>
                    <button class="weather-recipe-btn" @click="goToWeatherRecipe">
                      <span class="iconify" data-icon="mdi:food"></span>
                      Ir a receta sugerida
                    </button>
                  </div>
                </section>

                <!-- Notifications -->
                <section class="notifications-section">
                  <div class="notifications-header">
                    <h3>Notificaciones</h3>
                    <span class="notifications-badge">{{ notifications.length }}</span>
                  </div>
                  <div class="notifications-list">
                    <div 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      class="notification-item"
                      @click="handleNotification(notification)"
                    >
                      <div class="notification-icon" :class="notification.type">
                        <span class="iconify" :data-icon="notification.icon"></span>
                      </div>
                      <div class="notification-content">
                        <p class="notification-text">{{ notification.text }}</p>
                        <p class="notification-time">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

export default {
  name: 'InicioView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // Notifications data
    const notifications = ref([
      {
        id: 1,
        type: 'alert',
        icon: 'mdi:alert-circle-outline',
        text: 'El pollo caduca en 2 días',
        time: 'Hace 1 hora'
      },
      {
        id: 2,
        type: 'recipe',
        icon: 'mdi:food',
        text: 'Nueva receta sugerida para ti',
        time: 'Hace 3 horas'
      },
      {
        id: 3,
        type: 'shopping',
        icon: 'mdi:cart',
        text: 'La leche se está agotando',
        time: 'Hace 5 horas'
      }
    ])
    
    // Methods
    const goToRecipe = (mealType) => {
      console.log('Ir a receta de:', mealType)
      // En una app real, esto navegaría a la receta específica
      router.push('/recetas')
    }
    
    const changeMeal = (mealType) => {
      console.log('Cambiar comida:', mealType)
      alert(`¿Quieres cambiar la comida de ${mealType}?`)
    }
    
    const addIngredient = () => {
      console.log('Agregar ingrediente')
      alert('Funcionalidad de agregar ingrediente')
    }
    
    const decreaseQuantity = (ingredient) => {
      console.log('Disminuir cantidad de:', ingredient)
      // Lógica para disminuir cantidad
    }
    
    const increaseQuantity = (ingredient) => {
      console.log('Aumentar cantidad de:', ingredient)
      // Lógica para aumentar cantidad
    }
    
    const removeIngredient = (ingredient) => {
      console.log('Eliminar ingrediente:', ingredient)
      if (confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
        // Lógica para eliminar ingrediente
      }
    }
    
    const goToRecipes = () => {
      router.push('/recetas')
    }
    
    const viewRecipe = (recipeId) => {
      console.log('Ver receta:', recipeId)
      router.push('/recetas')
    }
    
    const goToWeatherRecipe = () => {
      console.log('Ir a receta sugerida por el clima')
      router.push('/recetas')
    }
    
    const handleNotification = (notification) => {
      console.log('Notificación clickeada:', notification)
      
      // Dependiendo del tipo de notificación, hacer algo diferente
      switch (notification.type) {
        case 'alert':
          alert('Esta notificación alerta sobre ingredientes próximos a caducar')
          break
        case 'recipe':
          router.push('/recetas')
          break
        case 'shopping':
          router.push('/lista-compras')
          break
      }
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
      notifications,
      goToRecipe,
      changeMeal,
      addIngredient,
      decreaseQuantity,
      increaseQuantity,
      removeIngredient,
      goToRecipes,
      viewRecipe,
      goToWeatherRecipe,
      handleNotification,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que las otras vistas */
.inicio-container {
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* Inicio View Styles */
.inicio-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Contenido de las secciones */
.sections-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  background-color: var(--card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border);
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.bg-white-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Botones */
.generate-menu-btn,
.add-ingredient-btn,
.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.generate-menu-btn:hover,
.add-ingredient-btn:hover,
.view-all-btn:hover {
  background-color: rgba(93, 162, 113, 0.1);
  border-color: var(--primary);
}

/* Daily Meals */
.meals-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.meal-card {
  background-color: white;
  border-radius: 1rem;
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.2s;
}

.meal-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.meal-image {
  position: relative;
  height: 10rem;
  overflow: hidden;
}

.meal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-emoji {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 1.5rem;
}

.meal-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.meal-label {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
}

.meal-label h4 {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.meal-content {
  padding: 1rem;
}

.meal-content h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.meal-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.detail-item .iconify {
  width: 0.875rem;
  height: 0.875rem;
}

.meal-actions {
  display: flex;
  gap: 0.5rem;
}

.cook-btn {
  flex: 1;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  padding: 0.625rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cook-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.change-btn {
  flex: none;
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.change-btn:hover {
  background-color: rgba(168, 213, 186, 0.3);
  border-color: var(--primary);
}

/* My Pantry */
.pantry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.pantry-item {
  background-color: white;
  border-radius: 1rem;
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.2s;
}

.pantry-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.pantry-image {
  position: relative;
  height: 8rem;
}

.pantry-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expiry-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
}

.expiry-badge.safe {
  background-color: var(--primary);
}

.expiry-badge.warning {
  background-color: #f59e0b;
}

.expiry-badge.danger {
  background-color: var(--destructive);
}

.pantry-info {
  padding: 1rem;
}

.pantry-info h4 {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
}

.pantry-quantity {
  font-size: 0.75rem;
  color: var(--foreground);
  margin-bottom: 0.25rem;
}

.pantry-category {
  font-size: 0.625rem;
  color: var(--muted-foreground);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pantry-actions {
  display: flex;
  gap: 0.5rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:hover {
  background-color: rgba(168, 213, 186, 0.3);
}

.quantity-btn .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--foreground);
}

.delete-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 24, 61, 0.2);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.delete-btn:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
}

.delete-btn .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--destructive);
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* Recommended Recipes */
.recipes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.recipe-card {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.recipe-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.recipe-image {
  position: relative;
  height: 8rem;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 500;
}

.recipe-content {
  padding: 1rem;
}

.recipe-content h4 {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.recipe-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 0.75rem;
}

.recipe-view-btn {
  width: 100%;
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.recipe-view-btn:hover {
  background-color: var(--primary);
  color: white;
}

/* Weather Suggestion - Manteniendo tu diseño actual */
.weather-suggestion-card {
  background: linear-gradient(135deg, #a8d5ba 0%, #8bb174 100%);
  border-radius: 1rem;
  border: 1px solid rgba(139, 177, 116, 0.3);
  padding: 1.5rem;
  color: white;
}

.weather-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon {
  width: 2rem;
  height: 2rem;
  color: white;
}

.weather-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
}

.weather-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
}

.weather-content {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.weather-desc {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.weather-desc .iconify {
  width: 1rem;
  height: 1rem;
  margin-right: 0.375rem;
  vertical-align: middle;
}

.weather-desc strong {
  font-weight: 600;
}

.weather-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.625rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
}

.weather-recipe-btn {
  width: 100%;
  background-color: white;
  color: var(--primary);
  border: none;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.weather-recipe-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.weather-recipe-btn .iconify {
  width: 1rem;
  height: 1rem;
}

/* Notifications */
.notifications-section {
  background-color: var(--card);
  border-radius: 1rem;
  border: 1px solid var(--border);
  padding: 1.5rem;
}

.notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 500;
}

.notifications-badge {
  background-color: var(--primary);
  color: var(--primary-foreground);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: rgba(168, 213, 186, 0.1);
  transition: background-color 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(168, 213, 186, 0.2);
}

.notification-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.alert {
  background-color: rgba(212, 24, 61, 0.1);
}

.notification-icon.alert .iconify {
  color: var(--destructive);
}

.notification-icon.recipe {
  background-color: rgba(93, 162, 113, 0.1);
}

.notification-icon.recipe .iconify {
  color: var(--primary);
}

.notification-icon.shopping {
  background-color: rgba(139, 177, 116, 0.1);
}

.notification-icon.shopping .iconify {
  color: var(--secondary);
}

.notification-icon .iconify {
  width: 1.25rem;
  height: 1.25rem;
}

.notification-content {
  flex: 1;
}

.notification-text {
  font-size: 0.875rem;
  color: var(--foreground);
  margin-bottom: 0.125rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .meals-grid {
    grid-template-columns: 1fr;
  }
  
  .pantry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
  
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 640px) {
  .content-container {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .meals-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .pantry-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .content-container {
    padding: 2rem;
  }

  .meals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .right-column {
    gap: 2rem;
  }
}
</style>