<!-- src/views/RecetasView.vue -->
<template>
  <div class="recetas-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <!-- Contenido de recetas -->
          <div class="recetas-view">
            <!-- Header de recetas -->
            <div class="recetas-header">
              <div class="header-icon-container">
                <span class="iconify" data-icon="mdi:book-open"></span>
              </div>
              <div>
                <h1 class="recetas-title">Recetas</h1>
                <p class="recetas-subtitle">Explora nuestra colección de recetas saludables</p>
              </div>
            </div>

            <!-- Buscador y Filtros -->
            <div class="filters-container">
              <div class="search-row">
                <div class="search-wrapper">
                  <span class="iconify search-icon" data-icon="mdi:magnify"></span>
                  <input 
                    type="text" 
                    placeholder="Buscar recetas..."
                    v-model="searchQuery"
                    class="search-input"
                    @input="filterRecipes"
                  />
                </div>
              </div>

              <div class="filters-row">
                <button 
                  v-if="availableRecipes.length > 0"
                  @click="toggleAvailableRecipes"
                  :class="['filter-btn', { 'active': showOnlyAvailable }]"
                >
                  <span class="iconify" data-icon="mdi:leaf"></span>
                  Con tus ingredientes ({{ availableRecipes.length }})
                </button>
                
                <button 
                  v-for="category in categories" 
                  :key="category"
                  @click="setSelectedCategory(category)"
                  :class="['filter-btn', { 'active': selectedCategory === category }]"
                >
                  {{ category }}
                </button>
              </div>
            </div>

            <!-- Grid de recetas -->
            <div class="recipes-grid">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id"
                class="recipe-card"
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
            </div>

            <!-- Estado vacío -->
            <div v-if="filteredRecipes.length === 0" class="empty-state">
              <div class="empty-icon">
                <span class="iconify" data-icon="mdi:book-open"></span>
              </div>
              <h3 class="empty-title">No se encontraron recetas</h3>
              <p class="empty-description">
                Intenta ajustar los filtros o la búsqueda
              </p>
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
                  </div>

                  <div class="recipe-detail-content">
                    <div class="recipe-detail-header">
                      <h2 class="recipe-detail-title">{{ selectedRecipe?.name }}</h2>
                      <div class="recipe-actions">
                        <button class="action-btn" @click="addToFavorites">
                          <span class="iconify" data-icon="mdi:heart-outline"></span>
                          Favorita
                        </button>
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
  name: 'RecetasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)

    // Categorías
    const categories = ['Todas', 'Desayuno', 'Almuerzo', 'Cena']
    const selectedCategory = ref('Todas')
    const searchQuery = ref('')
    const showOnlyAvailable = ref(false)
    
    // Estado del modal
    const showRecipeModal = ref(false)
    const selectedRecipe = ref(null)

    // Recetas de ejemplo
    const allRecipes = ref([
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
      },
      {
        id: 4,
        name: 'Smoothie de Plátano y Espinaca',
        type: 'Desayuno',
        time: '10 min',
        servings: 2,
        rating: '4.6',
        calories: '210 cal',
        tags: ['Rápido', 'Energético', 'Vegano'],
        image: 'https://images.unsplash.com/photo-1577450680941-2011043c55f8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Plátano', amount: '2 unidades' },
          { name: 'Espinaca fresca', amount: '2 tazas' },
          { name: 'Leche de almendras', amount: '1 taza' },
          { name: 'Miel', amount: '1 cucharada' },
          { name: 'Hielo', amount: '1 taza' }
        ],
        instructions: [
          'Pelar y cortar los plátanos.',
          'Lavar bien las hojas de espinaca.',
          'Agregar todos los ingredientes a la licuadora.',
          'Licuar hasta obtener una mezcla suave.',
          'Servir inmediatamente.'
        ]
      },
      {
        id: 5,
        name: 'Sopa de Verduras Nutritiva',
        type: 'Almuerzo',
        time: '35 min',
        servings: 6,
        rating: '4.9',
        calories: '280 cal',
        tags: ['Saludable', 'Caliente', 'Confortante'],
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Zanahoria', amount: '3 unidades' },
          { name: 'Apio', amount: '2 tallos' },
          { name: 'Cebolla', amount: '1 unidad' },
          { name: 'Papa', amount: '2 unidades' },
          { name: 'Caldo de verduras', amount: '1.5 litros' },
          { name: 'Aceite de oliva', amount: '2 cucharadas' },
          { name: 'Hierbas frescas', amount: 'al gusto' }
        ],
        instructions: [
          'Picar todas las verduras en cubos pequeños.',
          'Sofreír la cebolla en aceite de oliva hasta que esté transparente.',
          'Agregar el resto de verduras y cocinar por 5 minutos.',
          'Verter el caldo y llevar a ebullición.',
          'Cocinar a fuego lento por 25 minutos.',
          'Triturar ligeramente y agregar hierbas frescas.'
        ]
      },
      {
        id: 6,
        name: 'Tacos Mexicanos Caseros',
        type: 'Cena',
        time: '25 min',
        servings: 4,
        rating: '4.8',
        calories: '450 cal',
        tags: ['Mexicano', 'Picante', 'Fiesta'],
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
        ingredients: [
          { name: 'Tortillas de maíz', amount: '12 unidades' },
          { name: 'Carne molida', amount: '500g' },
          { name: 'Cebolla', amount: '1 unidad' },
          { name: 'Tomate', amount: '2 unidades' },
          { name: 'Lechuga', amount: '1/2 cabeza' },
          { name: 'Queso rallado', amount: '200g' },
          { name: 'Salsa', amount: 'al gusto' }
        ],
        instructions: [
          'Cocinar la carne molida con cebolla picada.',
          'Calentar las tortillas en un comal.',
          'Picar el tomate y la lechuga.',
          'Armar los tacos con carne, verduras y queso.',
          'Servir con salsa al gusto.'
        ]
      }
    ])

    // Simular recetas disponibles (esto vendría de una API/store)
    const availableRecipes = computed(() => {
      return allRecipes.value.filter(recipe => 
        recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes('avena') || 
          ing.name.toLowerCase().includes('pollo')
        )
      )
    })

    // Recetas filtradas
    const filteredRecipes = computed(() => {
      const recipes = showOnlyAvailable.value ? availableRecipes.value : allRecipes.value
      
      return recipes.filter(recipe => {
        // Filtro por búsqueda
        const matchesSearch = searchQuery.value === '' || 
          recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
        
        // Filtro por categoría
        const matchesCategory = selectedCategory.value === 'Todas' || 
          recipe.type === selectedCategory.value
        
        return matchesSearch && matchesCategory
      })
    })

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

    // Funciones de recetas
    const filterRecipes = () => {
      // La lógica está en la computed property filteredRecipes
    }

    const toggleAvailableRecipes = () => {
      showOnlyAvailable.value = !showOnlyAvailable.value
    }

    const setSelectedCategory = (category) => {
      selectedCategory.value = category
    }

    const openRecipeDetail = (recipe) => {
      selectedRecipe.value = recipe
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
    }

    const addToFavorites = () => {
      if (selectedRecipe.value) {
        console.log('Añadido a favoritos:', selectedRecipe.value.name)
        // Aquí podrías mostrar un toast
        alert(`✅ "${selectedRecipe.value.name}" agregada a favoritos`)
      }
    }

    const addToShoppingList = () => {
      if (selectedRecipe.value) {
        console.log('Ingredientes añadidos a lista de compras:', selectedRecipe.value.ingredients)
        // Aquí podrías mostrar un toast
        alert(`✅ Ingredientes de "${selectedRecipe.value.name}" agregados a la lista de compras`)
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAyNTBIMzAwVjIwMEgzNTBWMjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      categories,
      selectedCategory,
      searchQuery,
      showOnlyAvailable,
      availableRecipes,
      filteredRecipes,
      showRecipeModal,
      selectedRecipe,
      filterRecipes,
      toggleAvailableRecipes,
      setSelectedCategory,
      openRecipeDetail,
      closeRecipeModal,
      addToFavorites,
      addToShoppingList,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que las otras vistas */
.recetas-container {
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

/* Header de recetas */
.recetas-header {
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

.recetas-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.recetas-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Buscador y Filtros */
.filters-container {
  margin-bottom: 32px;
}

.search-row {
  margin-bottom: 16px;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.search-input::placeholder {
  color: var(--muted-foreground);
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background-color: rgba(168, 213, 186, 0.5);
  border-color: var(--primary);
}

.filter-btn.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.filter-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Grid de recetas */
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
  cursor: pointer;
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
  height: 224px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.recipe-card:hover .recipe-image {
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
  margin: 0 auto;
  line-height: 1.5;
}

/* Modal de detalle de receta */
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
  .recetas-title {
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
    gap: 20px;
  }
  
  .search-wrapper {
    max-width: 100%;
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
  
  .filter-btn {
    padding: 8px 14px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }
  
  .recipe-detail-stats {
    grid-template-columns: 1fr;
  }
  
  .filters-row {
    justify-content: center;
  }
  
  .filter-btn {
    flex: 1;
    min-width: calc(50% - 6px);
    justify-content: center;
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

@media (min-width: 1200px) {
  .recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>