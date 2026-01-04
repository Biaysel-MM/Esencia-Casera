<!-- src/views/FavoritasView.vue -->
<template>
  <div class="favoritas-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <!-- Contenido de favoritas -->
          <div class="favoritas-view">
            <!-- Header de favoritas -->
            <div class="favoritas-header">
              <div class="header-icon-container">
                <span class="iconify" data-icon="mdi:heart"></span>
              </div>
              <div>
                <h1 class="favoritas-title">Favoritas</h1>
                <p class="favoritas-subtitle">{{ favorites.length }} recetas guardadas</p>
              </div>
            </div>

            <!-- Grid de recetas favoritas -->
            <div v-if="favorites.length > 0" class="favorites-grid">
              <div 
                v-for="recipe in favorites" 
                :key="recipe.id"
                class="favorite-card"
              >
                <div 
                  class="card-top"
                  @click="openRecipeDetail(recipe)"
                >
                  <div class="recipe-image-container">
                    <img 
                      :src="recipe.image" 
                      :alt="recipe.name"
                      class="recipe-image"
                      @error="handleImageError"
                    />
                    <div class="image-gradient"></div>
                    <div class="recipe-badge">{{ recipe.type }}</div>
                    <div class="favorite-badge">
                      <span class="iconify" data-icon="mdi:heart"></span>
                    </div>
                    <div class="recipe-tags">
                      <span 
                        v-for="(tag, index) in recipe.tags.slice(0, 2)" 
                        :key="index"
                        class="tag-badge"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <div class="recipe-content">
                    <h3 class="recipe-name">{{ recipe.name }}</h3>
                    
                    <div class="recipe-stats">
                      <div class="stat-item">
                        <span class="iconify" data-icon="mdi:star"></span>
                        <span>{{ recipe.rating }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{ recipe.time }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="iconify" data-icon="mdi:fire"></span>
                        <span>{{ recipe.calories }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-actions">
                  <button 
                    class="remove-btn"
                    @click="removeFromFavorites(recipe.id)"
                  >
                    <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                    Eliminar de favoritos
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="empty-state">
              <div class="empty-icon">
                <span class="iconify" data-icon="mdi:heart-outline"></span>
              </div>
              <h3 class="empty-title">No tienes recetas favoritas aún</h3>
              <p class="empty-description">
                Explora recetas y agrégalas a favoritos para encontrarlas fácilmente
              </p>
              <button 
                class="explore-btn"
                @click="goToRecetas"
              >
                Explorar recetas
              </button>
            </div>

            <!-- Modal de detalle de receta -->
            <div v-if="showRecipeModal" class="recipe-modal-overlay" @click="closeRecipeModal">
              <div class="recipe-modal" @click.stop>
                <div class="modal-header">
                  <button class="modal-close" @click="closeRecipeModal">
                    <span class="iconify" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="modal-scroll-container">
                  <div class="recipe-detail-image">
                    <img 
                      :src="selectedRecipe?.image" 
                      :alt="selectedRecipe?.name"
                      @error="handleImageError"
                    />
                    <div class="image-overlay"></div>
                    <div class="recipe-type-badge">{{ selectedRecipe?.type }}</div>
                    <div class="favorite-overlay-badge">
                      <span class="iconify" data-icon="mdi:heart"></span>
                    </div>
                  </div>

                  <div class="recipe-detail-content">
                    <div class="recipe-detail-header">
                      <h2 class="recipe-detail-title">{{ selectedRecipe?.name }}</h2>
                      <div class="recipe-actions">
                        <button class="action-btn primary" @click="addToShoppingList">
                          <span class="iconify" data-icon="mdi:cart-plus"></span>
                          Lista de compras
                        </button>
                      </div>
                    </div>

                    <div class="recipe-detail-stats">
                      <div class="detail-stat">
                        <div class="stat-icon">
                          <span class="iconify" data-icon="mdi:star"></span>
                        </div>
                        <div>
                          <p class="stat-value">{{ selectedRecipe?.rating }}</p>
                          <p class="stat-label">Calificación</p>
                        </div>
                      </div>
                      <div class="detail-stat">
                        <div class="stat-icon">
                          <span class="iconify" data-icon="mdi:clock-outline"></span>
                        </div>
                        <div>
                          <p class="stat-value">{{ selectedRecipe?.time }}</p>
                          <p class="stat-label">Tiempo</p>
                        </div>
                      </div>
                      <div class="detail-stat">
                        <div class="stat-icon">
                          <span class="iconify" data-icon="mdi:fire"></span>
                        </div>
                        <div>
                          <p class="stat-value">{{ selectedRecipe?.calories }}</p>
                          <p class="stat-label">Calorías</p>
                        </div>
                      </div>
                      <div class="detail-stat">
                        <div class="stat-icon">
                          <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        </div>
                        <div>
                          <p class="stat-value">{{ selectedRecipe?.servings }}</p>
                          <p class="stat-label">Porciones</p>
                        </div>
                      </div>
                    </div>

                    <div class="recipe-sections">
                      <!-- Ingredientes -->
                      <div class="recipe-section">
                        <h3 class="section-title">
                          <span class="iconify" data-icon="mdi:food-apple"></span>
                          Ingredientes
                        </h3>
                        <div class="ingredients-list">
                          <div 
                            v-for="(ingredient, index) in selectedRecipe?.ingredients" 
                            :key="index"
                            class="ingredient-item"
                          >
                            <span class="iconify" data-icon="mdi:checkbox-blank-circle-outline"></span>
                            <span>{{ ingredient.amount }} {{ ingredient.name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Instrucciones -->
                      <div class="recipe-section">
                        <h3 class="section-title">
                          <span class="iconify" data-icon="mdi:format-list-numbered"></span>
                          Instrucciones
                        </h3>
                        <div class="instructions-list">
                          <div 
                            v-for="(step, index) in selectedRecipe?.instructions" 
                            :key="index"
                            class="instruction-step"
                          >
                            <div class="step-number">{{ index + 1 }}</div>
                            <p>{{ step }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div v-if="selectedRecipe?.tags?.length" class="recipe-section">
                        <h3 class="section-title">
                          <span class="iconify" data-icon="mdi:tag-multiple-outline"></span>
                          Etiquetas
                        </h3>
                        <div class="tags-container">
                          <span 
                            v-for="tag in selectedRecipe?.tags" 
                            :key="tag"
                            class="detail-tag"
                          >
                            {{ tag }}
                          </span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'FavoritasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)

    // Estado del modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)

    // Recetas favoritas de ejemplo
    const favorites = ref([
      {
        id: 1,
        name: 'Bowl de Avena con Frutas',
        type: 'Desayuno',
        time: '15 min',
        servings: 2,
        rating: '4.8',
        calories: '350 cal',
        tags: ['Saludable', 'Rápido', 'Vegano'],
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Avena', amount: '1 taza' },
          { name: 'Leche de almendras', amount: '2 tazas' },
          { name: 'Plátano', amount: '1 unidad' },
          { name: 'Fresas', amount: '10 unidades' },
          { name: 'Miel', amount: '1 cucharada' },
          { name: 'Nueces', amount: '2 cucharadas' }
        ],
        instructions: [
          'Cocinar la avena con la leche de almendras durante 10 minutos.',
          'Mientras tanto, cortar el plátano y las fresas en rodajas.',
          'Servir la avena en un bowl y decorar con las frutas.',
          'Agregar nueces y miel al gusto.'
        ]
      },
      {
        id: 2,
        name: 'Ensalada de Pollo a la Parrilla',
        type: 'Almuerzo',
        time: '30 min',
        servings: 4,
        rating: '4.5',
        calories: '420 cal',
        tags: ['Proteico', 'Fresco', 'Fácil'],
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Pechuga de pollo', amount: '2 unidades' },
          { name: 'Lechuga', amount: '1 cabeza' },
          { name: 'Tomate', amount: '2 unidades' },
          { name: 'Aguacate', amount: '1 unidad' },
          { name: 'Cebolla morada', amount: '1/2 unidad' },
          { name: 'Aceite de oliva', amount: '3 cucharadas' },
          { name: 'Limón', amount: '1 unidad' }
        ],
        instructions: [
          'Marinar el pollo con aceite de oliva, sal y pimienta.',
          'Cocinar el pollo en la parrilla por 6-8 minutos por lado.',
          'Lavar y cortar todas las verduras.',
          'Mezclar las verduras en un bowl grande.',
          'Cortar el pollo en tiras y añadirlo a la ensalada.',
          'Aliñar con aceite de oliva y jugo de limón.'
        ]
      },
      {
        id: 3,
        name: 'Pasta Primavera',
        type: 'Cena',
        time: '25 min',
        servings: 4,
        rating: '4.7',
        calories: '380 cal',
        tags: ['Vegetariano', 'Italiano', 'Completo'],
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Pasta integral', amount: '400g' },
          { name: 'Brócoli', amount: '1 cabeza' },
          { name: 'Zanahoria', amount: '2 unidades' },
          { name: 'Champiñones', amount: '200g' },
          { name: 'Crema para cocinar', amount: '200ml' },
          { name: 'Queso parmesano', amount: '50g' },
          { name: 'Ajo', amount: '2 dientes' }
        ],
        instructions: [
          'Cocinar la pasta según las instrucciones del paquete.',
          'Saltear las verduras en aceite de oliva con ajo.',
          'Agregar la crema y cocinar por 5 minutos.',
          'Mezclar la pasta con la salsa de verduras.',
          'Servir con queso parmesano rallado por encima.'
        ]
      }
    ])

    // Layout functions
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

    // Funciones de favoritas
    const openRecipeDetail = (recipe) => {
      selectedRecipe.value = recipe
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
    }

    const removeFromFavorites = (recipeId) => {
      favorites.value = favorites.value.filter(recipe => recipe.id !== recipeId)
      // Aquí podrías mostrar un toast
      alert('❌ Receta eliminada de favoritos')
    }

    const addToShoppingList = () => {
      if (selectedRecipe.value) {
        console.log('Ingredientes añadidos a lista de compras:', selectedRecipe.value.ingredients)
        // Aquí podrías mostrar un toast
        alert(`✅ Ingredientes de "${selectedRecipe.value.name}" agregados a la lista de compras`)
      }
    }

    const goToRecetas = () => {
      router.push('/recetas')
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAyNTBIMzAwVjIwMEgzNTBWMjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      favorites,
      showRecipeModal,
      selectedRecipe,
      openRecipeDetail,
      closeRecipeModal,
      removeFromFavorites,
      addToShoppingList,
      goToRecetas,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que las otras vistas */
.favoritas-container {
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

/* Header de favoritas */
.favoritas-header {
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

.favoritas-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.favoritas-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Grid de favoritas */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.favorite-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.card-top {
  cursor: pointer;
}

.recipe-image-container {
  position: relative;
  height: 224px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.favorite-card:hover .recipe-image {
  transform: scale(1.05);
}

.image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 50%);
}

.recipe-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: var(--card);
  color: var(--foreground);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.favorite-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(93, 162, 113, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.favorite-badge .iconify {
  width: 20px;
  height: 20px;
  color: white;
}

.recipe-tags {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.recipe-content {
  padding: 20px;
}

.recipe-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
  line-height: 1.4;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--muted-foreground);
}

.stat-item .iconify {
  width: 16px;
  height: 16px;
}

.stat-item:first-child .iconify {
  color: #fbbf24; /* Color amarillo para estrellas */
}

.stat-item:nth-child(2) .iconify {
  color: var(--primary);
}

.stat-item:last-child .iconify {
  color: #ef4444; /* Color rojo para fuego */
}

.card-actions {
  padding: 0 20px 20px;
}

.remove-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--destructive);
  background-color: transparent;
  color: var(--destructive);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.remove-btn:hover {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 24, 61, 0.2);
}

.remove-btn .iconify {
  width: 18px;
  height: 18px;
}

/* Estado vacío */
.empty-state {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 40px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  color: var(--muted-foreground);
}

.empty-icon .iconify {
  width: 64px;
  height: 64px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 15px;
  color: var(--muted-foreground);
  max-width: 400px;
  margin: 0 auto 24px;
  line-height: 1.5;
}

.explore-btn {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.explore-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 162, 113, 0.2);
}

/* Modal de detalle de receta (Similar a RecetasView pero con badge de favorito) */
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
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  background-color: var(--card);
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 10px;
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

.modal-scroll-container {
  flex: 1;
  overflow-y: auto;
}

.recipe-detail-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.recipe-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 70%);
}

.recipe-type-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.favorite-overlay-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(93, 162, 113, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.favorite-overlay-badge .iconify {
  width: 24px;
  height: 24px;
  color: white;
}

.recipe-detail-content {
  padding: 32px;
}

.recipe-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.recipe-detail-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  flex: 1;
  min-width: 300px;
  line-height: 1.3;
}

.recipe-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  background-color: var(--muted);
}

.action-btn.primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.action-btn.primary:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.action-btn .iconify {
  width: 18px;
  height: 18px;
}

.recipe-detail-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  padding: 24px;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.detail-stat {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.stat-icon .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.recipe-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.recipe-section {
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 20px;
}

.section-title .iconify {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--foreground);
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-item .iconify {
  width: 16px;
  height: 16px;
  color: var(--primary);
  flex-shrink: 0;
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.instruction-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.instruction-step p {
  flex: 1;
  font-size: 15px;
  color: var(--foreground);
  line-height: 1.6;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-tag {
  background-color: rgba(168, 213, 186, 0.2);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(93, 162, 113, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  /* Layout responsive igual que otras vistas */
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
  .favoritas-title {
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
  
  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .recipe-detail-header {
    flex-direction: column;
  }
  
  .recipe-detail-title {
    min-width: 100%;
    font-size: 24px;
  }
  
  .recipe-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .recipe-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recipe-image-container {
    height: 200px;
  }
  
  .recipe-detail-content {
    padding: 20px;
  }
  
  .recipe-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .recipe-detail-stats {
    grid-template-columns: 1fr;
  }
  
  .favorite-badge {
    width: 36px;
    height: 36px;
  }
  
  .favorite-badge .iconify {
    width: 18px;
    height: 18px;
  }
  
  .remove-btn {
    padding: 12px;
    font-size: 13px;
  }
  
  .empty-state {
    padding: 40px 16px;
  }
}

@media (min-width: 1200px) {
  .favorites-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>