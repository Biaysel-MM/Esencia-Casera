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
              <button class="add-recipe-btn" @click="openCreateRecipeModal">
                <span class="iconify" data-icon="mdi:plus"></span>
                Nueva receta
              </button>
            </div>

            <!-- Buscador y Filtros Avanzados -->
            <div class="filters-container">
              <div class="search-row">
                <div class="search-wrapper">
                  <span class="iconify search-icon" data-icon="mdi:magnify"></span>
                  <input 
                    type="text" 
                    placeholder="Buscar recetas, ingredientes..."
                    v-model="searchQuery"
                    class="search-input"
                    @input="handleSearch"
                  />
                  <button class="filter-toggle" @click="showAdvancedFilters = !showAdvancedFilters">
                    <span class="iconify" data-icon="mdi:filter-variant"></span>
                    Filtros
                    <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
                  </button>
                </div>
              </div>

              <!-- Filtros Avanzados -->
              <div v-if="showAdvancedFilters" class="advanced-filters">
                <div class="filters-grid">
                  <!-- Categorías -->
                  <div class="filter-group">
                    <label class="filter-label">Categoría</label>
                    <div class="filter-options">
                      <button 
                        v-for="category in categoryOptions" 
                        :key="category.value"
                        @click="toggleCategory(category.value)"
                        :class="['filter-chip', { 'active': selectedCategories.includes(category.value) }]"
                      >
                        <span class="iconify" :data-icon="category.icon"></span>
                        {{ category.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Dificultad -->
                  <div class="filter-group">
                    <label class="filter-label">Dificultad</label>
                    <div class="filter-options">
                      <button 
                        v-for="difficulty in difficultyOptions" 
                        :key="difficulty.value"
                        @click="toggleDifficulty(difficulty.value)"
                        :class="['filter-chip', { 'active': selectedDifficulties.includes(difficulty.value) }]"
                      >
                        <span class="iconify" :data-icon="difficulty.icon"></span>
                        {{ difficulty.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Tiempo -->
                  <div class="filter-group">
                    <label class="filter-label">Tiempo máximo</label>
                    <div class="time-filter">
                      <select v-model="maxTime" class="time-select">
                        <option value="">Sin límite</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                      </select>
                    </div>
                  </div>

                  <!-- Etiquetas -->
                  <div class="filter-group">
                    <label class="filter-label">Etiquetas</label>
                    <div class="filter-options">
                      <button 
                        v-for="tag in tagOptions" 
                        :key="tag.value"
                        @click="toggleTag(tag.value)"
                        :class="['filter-chip', { 'active': selectedTags.includes(tag.value) }]"
                      >
                        <span class="iconify" :data-icon="tag.icon"></span>
                        {{ tag.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Ordenar por -->
                  <div class="filter-group">
                    <label class="filter-label">Ordenar por</label>
                    <div class="sort-options">
                      <select v-model="sortBy" class="sort-select">
                        <option value="created_at">Más recientes</option>
                        <option value="prep_time">Tiempo de preparación</option>
                        <option value="popularity">Más populares</option>
                        <option value="difficulty">Dificultad</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Acciones de filtros -->
                <div class="filter-actions">
                  <button class="clear-filters-btn" @click="clearFilters">
                    <span class="iconify" data-icon="mdi:filter-remove"></span>
                    Limpiar filtros
                  </button>
                  <button class="apply-filters-btn" @click="applyFilters">
                    <span class="iconify" data-icon="mdi:check"></span>
                    Aplicar
                  </button>
                </div>
              </div>

              <!-- Filtros rápidos -->
              <div class="quick-filters-row">
                <button 
                  v-if="availableRecipes.length > 0"
                  @click="toggleAvailableRecipes"
                  :class="['quick-filter-btn', { 'active': showOnlyAvailable }]"
                >
                  <span class="iconify" data-icon="mdi:leaf"></span>
                  Con tus ingredientes ({{ availableRecipes.length }})
                </button>
                
                <button 
                  @click="showFavoritesOnly = !showFavoritesOnly"
                  :class="['quick-filter-btn', { 'active': showFavoritesOnly }]"
                >
                  <span class="iconify" :data-icon="showFavoritesOnly ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                  Favoritas
                </button>
              </div>
            </div>

            <!-- Estadísticas y resultados -->
            <div class="results-header">
              <div class="results-stats">
                <span class="stat-item">
                  <span class="iconify" data-icon="mdi:book-open-page-variant"></span>
                  {{ filteredRecipes.length }} recetas
                </span>
                <span v-if="availableRecipesCount > 0" class="stat-item success">
                  <span class="iconify" data-icon="mdi:check-circle"></span>
                  {{ availableRecipesCount }} con ingredientes disponibles
                </span>
              </div>
              <div class="view-toggle">
                <button 
                  class="view-toggle-btn" 
                  :class="{ 'active': viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <span class="iconify" data-icon="mdi:view-grid"></span>
                </button>
                <button 
                  class="view-toggle-btn" 
                  :class="{ 'active': viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <span class="iconify" data-icon="mdi:view-list"></span>
                </button>
              </div>
            </div>

            <!-- Grid de recetas -->
            <div v-if="viewMode === 'grid'" class="recipes-grid">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id"
                class="recipe-card"
                @click="openRecipeDetail(recipe)"
              >
                <div class="recipe-image-container">
                  <img 
                    :src="recipe.image_url || getRecipeImage(recipe.title)" 
                    :alt="recipe.title"
                    class="recipe-image"
                    @error="handleImageError"
                  />
                  <div class="image-gradient"></div>
                  <div class="recipe-badge">{{ formatCategory(recipe.category) }}</div>
                  <div class="recipe-tags">
                    <span 
                      v-if="recipe.is_vegetarian"
                      class="tag-badge vegetarian"
                    >
                      <span class="iconify" data-icon="mdi:leaf"></span>
                      Veg
                    </span>
                    <span 
                      v-if="recipe.is_healthy"
                      class="tag-badge healthy"
                    >
                      <span class="iconify" data-icon="mdi:heart"></span>
                      Salud
                    </span>
                    <span 
                      v-if="recipe.is_quick"
                      class="tag-badge quick"
                    >
                      <span class="iconify" data-icon="mdi:lightning-bolt"></span>
                      Ráp
                    </span>
                  </div>
                  <button 
                    class="favorite-btn"
                    @click.stop="toggleFavorite(recipe)"
                  >
                    <span 
                      class="iconify" 
                      :data-icon="recipe.is_favorite ? 'mdi:heart' : 'mdi:heart-outline'"
                    ></span>
                  </button>
                </div>

                <div class="recipe-content">
                  <div class="recipe-header">
                    <h3 class="recipe-title">{{ recipe.title }}</h3>
                    <div class="recipe-difficulty">
                      <span class="difficulty-dot" :class="recipe.difficulty"></span>
                      {{ formatDifficulty(recipe.difficulty) }}
                    </div>
                  </div>
                  
                  <p class="recipe-description" v-if="recipe.description">
                    {{ truncateText(recipe.description, 80) }}
                  </p>

                  <div class="recipe-stats">
                    <div class="stat-item">
                      <span class="iconify" data-icon="mdi:clock-outline"></span>
                      <span>{{ recipe.prep_time + recipe.cook_time }} min</span>
                    </div>
                    <div class="stat-item">
                      <span class="iconify" data-icon="mdi:account-group-outline"></span>
                      <span>{{ recipe.servings }} porciones</span>
                    </div>
                    <div v-if="recipe.calories" class="stat-item">
                      <span class="iconify" data-icon="mdi:fire"></span>
                      <span>{{ recipe.calories }} cal</span>
                    </div>
                  </div>

                  <div class="recipe-availability">
                    <div 
                      v-if="recipe.availability_percentage > 0"
                      class="availability-bar"
                      :class="getAvailabilityClass(recipe.availability_percentage)"
                    >
                      <div 
                        class="availability-fill"
                        :style="{ width: recipe.availability_percentage + '%' }"
                      ></div>
                      <span class="availability-text">
                        {{ Math.round(recipe.availability_percentage) }}% ingredientes disponibles
                      </span>
                    </div>
                  </div>

                  <div class="recipe-actions">
                    <button class="action-btn view-btn" @click.stop="openRecipeDetail(recipe)">
                      <span class="iconify" data-icon="mdi:eye"></span>
                      Ver
                    </button>
                    <button class="action-btn plan-btn" @click.stop="openAddToPlannerModal(recipe)">
                      <span class="iconify" data-icon="mdi:calendar-plus"></span>
                      Planificar
                    </button>
                    <button class="action-btn shop-btn" @click.stop="addToShoppingList(recipe)">
                      <span class="iconify" data-icon="mdi:cart-plus"></span>
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista de lista -->
            <div v-else class="recipes-list">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id"
                class="recipe-list-item"
                @click="openRecipeDetail(recipe)"
              >
                <div class="list-item-image">
                  <img 
                    :src="recipe.image_url || getRecipeImage(recipe.title)" 
                    :alt="recipe.title"
                    @error="handleImageError"
                  />
                </div>
                <div class="list-item-content">
                  <div class="list-item-header">
                    <h3 class="list-item-title">{{ recipe.title }}</h3>
                    <div class="list-item-meta">
                      <span class="meta-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        {{ recipe.prep_time + recipe.cook_time }} min
                      </span>
                      <span class="meta-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        {{ recipe.servings }} porciones
                      </span>
                      <span class="meta-item category-badge">
                        {{ formatCategory(recipe.category) }}
                      </span>
                    </div>
                  </div>
                  <p class="list-item-description" v-if="recipe.description">
                    {{ truncateText(recipe.description, 120) }}
                  </p>
                  <div class="list-item-tags">
                    <span v-if="recipe.is_vegetarian" class="tag vegetarian">🌿 Vegetariano</span>
                    <span v-if="recipe.is_healthy" class="tag healthy">🥗 Saludable</span>
                    <span v-if="recipe.is_quick" class="tag quick">⚡ Rápido</span>
                  </div>
                  <div class="list-item-actions">
                    <button 
                      class="favorite-btn"
                      @click.stop="toggleFavorite(recipe)"
                    >
                      <span 
                        class="iconify" 
                        :data-icon="recipe.is_favorite ? 'mdi:heart' : 'mdi:heart-outline'"
                      ></span>
                    </button>
                    <button class="action-btn" @click.stop="openAddToPlannerModal(recipe)">
                      <span class="iconify" data-icon="mdi:calendar-plus"></span>
                      Planificar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado de carga -->
            <div v-if="loading" class="loading-state">
              <span class="iconify loading-icon" data-icon="mdi:loading"></span>
              <p>Cargando recetas...</p>
            </div>

            <!-- Estado vacío -->
            <div v-if="!loading && filteredRecipes.length === 0" class="empty-state">
              <div class="empty-icon">
                <span class="iconify" data-icon="mdi:book-open"></span>
              </div>
              <h3 class="empty-title">No se encontraron recetas</h3>
              <p class="empty-description">
                {{ searchQuery || activeFilterCount > 0 ? 
                  'Intenta ajustar los filtros o la búsqueda' : 
                  'No hay recetas disponibles. ¡Crea tu primera receta!' }}
              </p>
              <button class="empty-state-btn" @click="openCreateRecipeModal">
                <span class="iconify" data-icon="mdi:plus"></span>
                Crear receta
              </button>
            </div>

            <!-- Paginación -->
            <div v-if="filteredRecipes.length > 0 && totalPages > 1" class="pagination">
              <button 
                class="pagination-btn" 
                @click="previousPage"
                :disabled="currentPage === 1"
              >
                <span class="iconify" data-icon="mdi:chevron-left"></span>
                Anterior
              </button>
              <div class="pagination-pages">
                <span class="pagination-info">
                  Página {{ currentPage }} de {{ totalPages }}
                </span>
              </div>
              <button 
                class="pagination-btn" 
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Siguiente
                <span class="iconify" data-icon="mdi:chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODALES -->

    <!-- Modal de detalle de receta -->
    <div v-if="showRecipeModal" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content recipe-detail-modal" @click.stop>
        <button class="modal-close" @click="closeRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <div class="recipe-detail-image">
          <img 
            :src="selectedRecipe?.image_url || getRecipeImage(selectedRecipe?.title)" 
            :alt="selectedRecipe?.title"
            @error="handleImageError"
          />
          <div class="image-overlay"></div>
          <div class="recipe-type-badge">{{ formatCategory(selectedRecipe?.category) }}</div>
          <button 
            class="detail-favorite-btn"
            @click="toggleFavorite(selectedRecipe)"
          >
            <span 
              class="iconify" 
              :data-icon="selectedRecipe?.is_favorite ? 'mdi:heart' : 'mdi:heart-outline'"
            ></span>
          </button>
        </div>

        <div class="recipe-detail-content">
          <div class="recipe-detail-header">
            <h2 class="recipe-detail-title">{{ selectedRecipe?.title }}</h2>
            <div class="recipe-actions">
              <button class="action-btn" @click="openEditRecipeModal(selectedRecipe)">
                <span class="iconify" data-icon="mdi:pencil"></span>
                Editar
              </button>
              <button class="action-btn" @click="shareRecipe(selectedRecipe)">
                <span class="iconify" data-icon="mdi:share-variant"></span>
                Compartir
              </button>
              <button class="action-btn primary" @click="openAddToPlannerModal(selectedRecipe)">
                <span class="iconify" data-icon="mdi:calendar-plus"></span>
                Planificar
              </button>
            </div>
          </div>

          <div class="recipe-detail-description">
            <p>{{ selectedRecipe?.description }}</p>
          </div>

          <div class="recipe-detail-stats">
            <div class="detail-stat">
              <div class="stat-icon">
                <span class="iconify" data-icon="mdi:clock-outline"></span>
              </div>
              <div>
                <p class="stat-label">Tiempo total</p>
                <p class="stat-value">{{ selectedRecipe?.prep_time + selectedRecipe?.cook_time }} min</p>
              </div>
            </div>
            <div class="detail-stat">
              <div class="stat-icon">
                <span class="iconify" data-icon="mdi:account-group-outline"></span>
              </div>
              <div>
                <p class="stat-label">Porciones</p>
                <p class="stat-value">{{ selectedRecipe?.servings }}</p>
              </div>
            </div>
            <div class="detail-stat">
              <div class="stat-icon">
                <span class="iconify" data-icon="mdi:fire"></span>
              </div>
              <div>
                <p class="stat-label">Calorías</p>
                <p class="stat-value">{{ selectedRecipe?.calories || 'N/A' }}</p>
              </div>
            </div>
            <div class="detail-stat">
              <div class="stat-icon">
                <span class="iconify" data-icon="mdi:chef-hat"></span>
              </div>
              <div>
                <p class="stat-label">Dificultad</p>
                <p class="stat-value">{{ formatDifficulty(selectedRecipe?.difficulty) }}</p>
              </div>
            </div>
          </div>

          <!-- Tabs de detalles -->
          <div class="recipe-tabs">
            <div class="tabs-header">
              <button 
                class="tab-btn" 
                :class="{ 'active': activeTab === 'ingredients' }"
                @click="activeTab = 'ingredients'"
              >
                <span class="iconify" data-icon="mdi:food-apple"></span>
                Ingredientes
              </button>
              <button 
                class="tab-btn" 
                :class="{ 'active': activeTab === 'instructions' }"
                @click="activeTab = 'instructions'"
              >
                <span class="iconify" data-icon="mdi:book-open-page-variant"></span>
                Instrucciones
              </button>
              <button 
                class="tab-btn" 
                :class="{ 'active': activeTab === 'nutrition' }"
                @click="activeTab = 'nutrition'"
                v-if="selectedRecipe?.calories"
              >
                <span class="iconify" data-icon="mdi:nutrition"></span>
                Nutrición
              </button>
            </div>

            <div class="tabs-content">
              <!-- Ingredientes -->
              <div v-if="activeTab === 'ingredients'" class="tab-pane">
                <div class="servings-control">
                  <label>Porciones:</label>
                  <div class="servings-selector">
                    <button @click="decreaseServings" class="servings-btn">
                      <span class="iconify" data-icon="mdi:minus"></span>
                    </button>
                    <input 
                      type="number" 
                      v-model.number="currentServings"
                      min="1"
                      max="20"
                      class="servings-input"
                    />
                    <button @click="increaseServings" class="servings-btn">
                      <span class="iconify" data-icon="mdi:plus"></span>
                    </button>
                  </div>
                  <button class="reset-servings-btn" @click="resetServings">
                    Restablecer
                  </button>
                </div>

                <div class="ingredients-section">
                  <h3 class="section-title">Ingredientes</h3>
                  <div class="ingredients-list">
                    <div 
                      v-for="(ingredient, index) in scaledIngredients" 
                      :key="index"
                      class="ingredient-item"
                    >
                      <div class="ingredient-checkbox">
                        <input 
                          type="checkbox" 
                          :id="'ingredient-' + index"
                          v-model="checkedIngredients[index]"
                        />
                        <label :for="'ingredient-' + index"></label>
                      </div>
                      <div class="ingredient-info">
                        <span class="ingredient-name">{{ ingredient.name }}</span>
                        <span class="ingredient-quantity">
                          {{ calculateScaledQuantity(ingredient.quantity) }} {{ ingredient.unit }}
                        </span>
                      </div>
                      <div class="ingredient-actions">
                        <button 
                          class="ingredient-action-btn"
                          @click.stop="checkPantryForIngredient(ingredient)"
                          :title="ingredientInPantry(ingredient.name) ? 'En tu despensa' : 'Agregar a despensa'"
                        >
                          <span 
                            class="iconify" 
                            :data-icon="ingredientInPantry(ingredient.name) ? 'mdi:check' : 'mdi:plus'"
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="ingredients-actions">
                    <button class="btn-secondary" @click="checkAllIngredients">
                      Marcar todos
                    </button>
                    <button class="btn-secondary" @click="uncheckAllIngredients">
                      Desmarcar todos
                    </button>
                    <button class="btn-primary" @click="addMissingToShoppingList">
                      <span class="iconify" data-icon="mdi:cart-plus"></span>
                      Agregar faltantes a lista
                    </button>
                  </div>
                </div>
              </div>

              <!-- Instrucciones -->
              <div v-if="activeTab === 'instructions'" class="tab-pane">
                <div class="instructions-section">
                  <h3 class="section-title">Preparación</h3>
                  <div class="instructions-list">
                    <div 
                      v-for="(step, index) in selectedRecipeSteps" 
                      :key="index"
                      class="instruction-step"
                    >
                      <div class="step-number">{{ index + 1 }}</div>
                      <div class="step-content">
                        <p>{{ step.description }}</p>
                        <img 
                          v-if="step.image_url" 
                          :src="step.image_url" 
                          :alt="'Paso ' + (index + 1)"
                          class="step-image"
                          @error="handleImageError"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="cooking-mode">
                    <button class="cooking-mode-btn" @click="toggleCookingMode">
                      <span class="iconify" data-icon="mdi:chef-hat"></span>
                      {{ cookingMode ? 'Salir del modo cocina' : 'Modo cocina' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Nutrición -->
              <div v-if="activeTab === 'nutrition'" class="tab-pane">
                <div class="nutrition-section">
                  <h3 class="section-title">Información nutricional</h3>
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <span class="nutrition-label">Calorías</span>
                      <span class="nutrition-value">{{ selectedRecipe?.calories }} kcal</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Proteínas</span>
                      <span class="nutrition-value">{{ selectedRecipe?.protein || 'N/A' }} g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Carbohidratos</span>
                      <span class="nutrition-value">{{ selectedRecipe?.carbs || 'N/A' }} g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Grasas</span>
                      <span class="nutrition-value">{{ selectedRecipe?.fat || 'N/A' }} g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de crear/editar receta -->
    <div v-if="showCreateRecipeModal" class="modal-overlay" @click="closeCreateRecipeModal">
      <div class="modal-content create-recipe-modal" @click.stop>
        <button class="modal-close" @click="closeCreateRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <h2 class="modal-title">{{ editingRecipe ? 'Editar receta' : 'Nueva receta' }}</h2>
        
        <form @submit.prevent="saveRecipe" class="recipe-form">
          <div class="form-section">
            <h3 class="section-title">Información básica</h3>
            
            <div class="form-group">
              <label for="recipe-title">Título *</label>
              <input 
                id="recipe-title"
                type="text" 
                v-model="recipeForm.title"
                placeholder="Ej: Ensalada de pollo a la parrilla"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="recipe-description">Descripción</label>
              <textarea 
                id="recipe-description"
                v-model="recipeForm.description"
                placeholder="Describe tu receta..."
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="recipe-category">Categoría *</label>
                <select 
                  id="recipe-category"
                  v-model="recipeForm.category"
                  required
                  class="form-select"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="breakfast">Desayuno</option>
                  <option value="lunch">Almuerzo</option>
                  <option value="dinner">Cena</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Postre</option>
                  <option value="beverage">Bebida</option>
                </select>
              </div>

              <div class="form-group">
                <label for="recipe-difficulty">Dificultad *</label>
                <select 
                  id="recipe-difficulty"
                  v-model="recipeForm.difficulty"
                  required
                  class="form-select"
                >
                  <option value="">Seleccionar dificultad</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Media</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="recipe-prep-time">Tiempo preparación (min) *</label>
                <input 
                  id="recipe-prep-time"
                  type="number" 
                  v-model.number="recipeForm.prep_time"
                  min="0"
                  max="240"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="recipe-cook-time">Tiempo cocción (min)</label>
                <input 
                  id="recipe-cook-time"
                  type="number" 
                  v-model.number="recipeForm.cook_time"
                  min="0"
                  max="240"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="recipe-servings">Porciones *</label>
                <input 
                  id="recipe-servings"
                  type="number" 
                  v-model.number="recipeForm.servings"
                  min="1"
                  max="20"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="recipe-calories">Calorías (por porción)</label>
                <input 
                  id="recipe-calories"
                  type="number" 
                  v-model.number="recipeForm.calories"
                  min="0"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Etiquetas</label>
                <div class="tag-checkboxes">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="recipeForm.is_vegetarian">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">Vegetariano</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="recipeForm.is_healthy">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">Saludable</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="recipeForm.is_quick">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">Rápido</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="recipe-image">URL de la imagen</label>
              <input 
                id="recipe-image"
                type="text" 
                v-model="recipeForm.image_url"
                placeholder="https://ejemplo.com/imagen.jpg"
                class="form-input"
              />
              <p class="form-hint">O deja vacío para usar una imagen por defecto</p>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Ingredientes</h3>
            <div class="ingredients-form">
              <div 
                v-for="(ingredient, index) in recipeForm.ingredients" 
                :key="index"
                class="ingredient-form-row"
              >
                <input 
                  type="text" 
                  v-model="ingredient.name"
                  placeholder="Nombre del ingrediente"
                  class="ingredient-input"
                  required
                />
                <input 
                  type="text" 
                  v-model="ingredient.quantity"
                  placeholder="Cantidad"
                  class="quantity-input"
                  required
                />
                <select v-model="ingredient.unit" class="unit-select">
                  <option value="">Unidad</option>
                  <option value="unidades">Unidades</option>
                  <option value="gramos">Gramos</option>
                  <option value="kg">Kilogramos</option>
                  <option value="ml">Mililitros</option>
                  <option value="litros">Litros</option>
                  <option value="tazas">Tazas</option>
                  <option value="cucharadas">Cucharadas</option>
                  <option value="cucharaditas">Cucharaditas</option>
                  <option value="pizcas">Pizcas</option>
                  <option value="al gusto">Al gusto</option>
                </select>
                <button 
                  type="button" 
                  class="remove-ingredient-btn"
                  @click="removeIngredient(index)"
                >
                  <span class="iconify" data-icon="mdi:close"></span>
                </button>
              </div>
              <button 
                type="button" 
                class="add-ingredient-btn"
                @click="addIngredientField"
              >
                <span class="iconify" data-icon="mdi:plus"></span>
                Agregar ingrediente
              </button>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Instrucciones</h3>
            <div class="instructions-form">
              <div 
                v-for="(step, index) in recipeForm.instructions" 
                :key="index"
                class="instruction-form-row"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <textarea 
                  v-model="step.description"
                  placeholder="Describe este paso..."
                  rows="2"
                  class="instruction-input"
                  required
                ></textarea>
                <input 
                  type="text" 
                  v-model="step.image_url"
                  placeholder="URL de imagen (opcional)"
                  class="step-image-input"
                />
                <button 
                  type="button" 
                  class="remove-step-btn"
                  @click="removeStep(index)"
                >
                  <span class="iconify" data-icon="mdi:close"></span>
                </button>
              </div>
              <button 
                type="button" 
                class="add-step-btn"
                @click="addStepField"
              >
                <span class="iconify" data-icon="mdi:plus"></span>
                Agregar paso
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary"
              @click="closeCreateRecipeModal"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="savingRecipe"
            >
              <span v-if="savingRecipe" class="iconify loading" data-icon="mdi:loading"></span>
              {{ editingRecipe ? 'Actualizar receta' : 'Crear receta' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de agregar al planificador -->
    <div v-if="showAddToPlannerModal" class="modal-overlay" @click="closeAddToPlannerModal">
      <div class="modal-content planner-modal" @click.stop>
        <button class="modal-close" @click="closeAddToPlannerModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <h2 class="modal-title">Agregar al planificador</h2>
        <p class="modal-subtitle">{{ selectedRecipe?.title }}</p>

        <div class="planner-form">
          <div class="form-group">
            <label for="meal-type">Tipo de comida *</label>
            <select 
              id="meal-type"
              v-model="plannerData.meal_type"
              required
              class="form-select"
            >
              <option value="">Seleccionar tipo</option>
              <option value="breakfast">Desayuno</option>
              <option value="lunch">Almuerzo</option>
              <option value="dinner">Cena</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div class="form-group">
            <label for="plan-date">Fecha *</label>
            <input 
              id="plan-date"
              type="date" 
              v-model="plannerData.date"
              required
              class="form-input"
              :min="new Date().toISOString().split('T')[0]"
            />
          </div>

          <div class="form-group">
            <label for="plan-notes">Notas (opcional)</label>
            <textarea 
              id="plan-notes"
              v-model="plannerData.notes"
              placeholder="Notas adicionales..."
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-group" v-if="selectedRecipe?.servings">
            <label for="plan-servings">Porciones</label>
            <div class="servings-selector">
              <button @click="decreasePlanServings" class="servings-btn">
                <span class="iconify" data-icon="mdi:minus"></span>
              </button>
              <input 
                id="plan-servings"
                type="number" 
                v-model.number="plannerData.servings"
                min="1"
                max="20"
                class="servings-input"
              />
              <button @click="increasePlanServings" class="servings-btn">
                <span class="iconify" data-icon="mdi:plus"></span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="plannerData.add_to_shopping">
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">Agregar ingredientes faltantes a lista de compras</span>
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            class="btn-secondary"
            @click="closeAddToPlannerModal"
          >
            Cancelar
          </button>
          <button 
            class="btn-primary"
            @click="addToPlanner"
            :disabled="!plannerData.meal_type || !plannerData.date"
          >
            <span class="iconify" data-icon="mdi:calendar-plus"></span>
            Agregar al planificador
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modo cocina -->
    <div v-if="cookingMode" class="cooking-mode-overlay">
      <div class="cooking-mode-container">
        <div class="cooking-header">
          <h2 class="cooking-title">{{ selectedRecipe?.title }}</h2>
          <button class="cooking-close" @click="toggleCookingMode">
            <span class="iconify" data-icon="mdi:close"></span>
          </button>
        </div>

        <div class="cooking-content">
          <div class="cooking-timer">
            <div class="timer-display">
              <span class="timer-time">{{ formatTime(timerSeconds) }}</span>
              <div class="timer-label">Tiempo transcurrido</div>
            </div>
            <div class="timer-controls">
              <button 
                class="timer-btn" 
                @click="toggleTimer"
                :class="{ 'paused': timerPaused }"
              >
                <span class="iconify" :data-icon="timerPaused ? 'mdi:play' : 'mdi:pause'"></span>
                {{ timerPaused ? 'Reanudar' : 'Pausar' }}
              </button>
              <button class="timer-btn reset" @click="resetTimer">
                <span class="iconify" data-icon="mdi:refresh"></span>
                Reiniciar
              </button>
            </div>
          </div>

          <div class="cooking-instructions">
            <div 
              v-for="(step, index) in selectedRecipeSteps" 
              :key="index"
              class="cooking-step"
              :class="{ 'active': currentCookingStep === index }"
            >
              <div class="cooking-step-header">
                <div class="step-number">{{ index + 1 }}</div>
                <button 
                  class="step-check"
                  @click="toggleStepComplete(index)"
                >
                  <span 
                    class="iconify" 
                    :data-icon="completedSteps[index] ? 'mdi:check-circle' : 'mdi:checkbox-blank-circle-outline'"
                  ></span>
                </button>
              </div>
              <div class="cooking-step-content">
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>

          <div class="cooking-navigation">
            <button 
              class="nav-btn prev"
              @click="previousCookingStep"
              :disabled="currentCookingStep === 0"
            >
              <span class="iconify" data-icon="mdi:chevron-left"></span>
              Anterior
            </button>
            <div class="step-indicator">
              Paso {{ currentCookingStep + 1 }} de {{ selectedRecipeSteps.length }}
            </div>
            <button 
              class="nav-btn next"
              @click="nextCookingStep"
              :disabled="currentCookingStep === selectedRecipeSteps.length - 1"
            >
              Siguiente
              <span class="iconify" data-icon="mdi:chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notifications -->
    <div v-if="toastMessage" class="toast" :class="toastType">
      <span class="iconify" :data-icon="getToastIcon(toastType)"></span>
      <span class="toast-text">{{ toastMessage }}</span>
      <button class="toast-close" @click="toastMessage = ''">
        <span class="iconify" data-icon="mdi:close"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { supabase } from '../supabase'

export default {
  name: 'RecetasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // Modal states
    const showRecipeModal = ref(false)
    const showCreateRecipeModal = ref(false)
    const showAddToPlannerModal = ref(false)
    
    // Data states
    const loading = ref(false)
    const recipes = ref([])
    const selectedRecipe = ref(null)
    const editingRecipe = ref(null)
    
    // Filter states
    const searchQuery = ref('')
    const showAdvancedFilters = ref(false)
    const showOnlyAvailable = ref(false)
    const showFavoritesOnly = ref(false)
    const viewMode = ref('grid') // 'grid' or 'list'
    
    // Filter values
    const selectedCategories = ref([])
    const selectedDifficulties = ref([])
    const selectedTags = ref([])
    const maxTime = ref('')
    const sortBy = ref('created_at')
    
    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const totalRecipes = ref(0)
    
    // Recipe detail states
    const activeTab = ref('ingredients')
    const currentServings = ref(1)
    const originalServings = ref(1)
    const checkedIngredients = ref([])
    const cookingMode = ref(false)
    
    // Timer for cooking mode
    const timerSeconds = ref(0)
    const timerInterval = ref(null)
    const timerPaused = ref(false)
    const currentCookingStep = ref(0)
    const completedSteps = ref([])
    
    // Form data
    const recipeForm = reactive({
      title: '',
      description: '',
      category: '',
      difficulty: '',
      prep_time: 15,
      cook_time: 0,
      servings: 4,
      calories: null,
      image_url: '',
      is_vegetarian: false,
      is_healthy: false,
      is_quick: false,
      ingredients: [{ name: '', quantity: '', unit: '' }],
      instructions: [{ description: '', image_url: '' }]
    })
    
    const plannerData = reactive({
      meal_type: '',
      date: new Date().toISOString().split('T')[0],
      servings: 4,
      notes: '',
      add_to_shopping: true
    })
    
    const savingRecipe = ref(false)
    
    // Toast notification
    const toastMessage = ref('')
    const toastType = ref('success') // 'success', 'error', 'info'
    
    // Filter options
    const categoryOptions = [
      { value: 'breakfast', label: 'Desayuno', icon: 'mdi:sun-wireless' },
      { value: 'lunch', label: 'Almuerzo', icon: 'mdi:food' },
      { value: 'dinner', label: 'Cena', icon: 'mdi:moon-waning-crescent' },
      { value: 'snack', label: 'Snack', icon: 'mdi:food-apple' },
      { value: 'dessert', label: 'Postre', icon: 'mdi:cake' },
      { value: 'beverage', label: 'Bebida', icon: 'mdi:cup' }
    ]
    
    const difficultyOptions = [
      { value: 'easy', label: 'Fácil', icon: 'mdi:emoticon-happy' },
      { value: 'medium', label: 'Media', icon: 'mdi:emoticon-neutral' },
      { value: 'hard', label: 'Difícil', icon: 'mdi:emoticon-sad' }
    ]
    
    const tagOptions = [
      { value: 'vegetarian', label: 'Vegetariano', icon: 'mdi:leaf' },
      { value: 'healthy', label: 'Saludable', icon: 'mdi:heart' },
      { value: 'quick', label: 'Rápido', icon: 'mdi:lightning-bolt' },
      { value: 'low_cost', label: 'Económico', icon: 'mdi:cash' },
      { value: 'family', label: 'Familiar', icon: 'mdi:account-group' }
    ]
    
    // Computed properties
    const activeFilterCount = computed(() => {
      let count = 0
      if (selectedCategories.value.length > 0) count++
      if (selectedDifficulties.value.length > 0) count++
      if (selectedTags.value.length > 0) count++
      if (maxTime.value) count++
      if (showOnlyAvailable.value) count++
      if (showFavoritesOnly.value) count++
      return count
    })
    
    const filteredRecipes = computed(() => {
      return recipes.value.filter(recipe => {
        // Filtro por búsqueda
        if (searchQuery.value) {
          const search = searchQuery.value.toLowerCase()
          const matchesSearch = 
            recipe.title.toLowerCase().includes(search) ||
            recipe.description?.toLowerCase().includes(search) ||
            recipe.ingredients?.some(ing => ing.name.toLowerCase().includes(search))
          if (!matchesSearch) return false
        }
        
        // Filtro por categoría
        if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(recipe.category)) {
          return false
        }
        
        // Filtro por dificultad
        if (selectedDifficulties.value.length > 0 && !selectedDifficulties.value.includes(recipe.difficulty)) {
          return false
        }
        
        // Filtro por etiquetas
        if (selectedTags.value.length > 0) {
          const hasTag = selectedTags.value.some(tag => {
            switch (tag) {
              case 'vegetarian': return recipe.is_vegetarian
              case 'healthy': return recipe.is_healthy
              case 'quick': return recipe.is_quick
              default: return false
            }
          })
          if (!hasTag) return false
        }
        
        // Filtro por tiempo máximo
        if (maxTime.value) {
          const totalTime = recipe.prep_time + recipe.cook_time
          if (totalTime > parseInt(maxTime.value)) {
            return false
          }
        }
        
        // Filtro por ingredientes disponibles
        if (showOnlyAvailable.value && recipe.availability_percentage < 100) {
          return false
        }
        
        // Filtro por favoritos
        if (showFavoritesOnly.value && !recipe.is_favorite) {
          return false
        }
        
        return true
      })
    })
    
    const availableRecipes = computed(() => {
      return filteredRecipes.value.filter(recipe => recipe.availability_percentage === 100)
    })
    
    const availableRecipesCount = computed(() => {
      return availableRecipes.value.length
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredRecipes.value.length / itemsPerPage.value)
    })
    
    const paginatedRecipes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredRecipes.value.slice(start, end)
    })
    
    const selectedRecipeIngredients = computed(() => {
      return selectedRecipe.value?.ingredients || []
    })
    
    const selectedRecipeSteps = computed(() => {
      return selectedRecipe.value?.steps || []
    })
    
    const scaledIngredients = computed(() => {
      if (!selectedRecipe.value) return []
      const originalServings = selectedRecipe.value.servings || 1
      const scale = currentServings.value / originalServings
      
      return selectedRecipeIngredients.value.map(ing => {
        const scaled = { ...ing }
        // Parse quantity if it's a number
        const quantity = parseFloat(ing.quantity)
        if (!isNaN(quantity)) {
          scaled.quantity = (quantity * scale).toFixed(2)
        }
        return scaled
      })
    })
    
    // Helper functions
    const formatCategory = (category) => {
      const map = {
        'breakfast': 'Desayuno',
        'lunch': 'Almuerzo',
        'dinner': 'Cena',
        'snack': 'Snack',
        'dessert': 'Postre',
        'beverage': 'Bebida'
      }
      return map[category] || category
    }
    
    const formatDifficulty = (difficulty) => {
      const map = {
        'easy': 'Fácil',
        'medium': 'Media',
        'hard': 'Difícil'
      }
      return map[difficulty] || difficulty
    }
    
    const getRecipeImage = (title) => {
      // Map recipe titles to Unsplash images
      const imageMap = {
        'Bowl de Avena con Frutas': 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05',
        'Ensalada de Pollo a la Parrilla': 'https://images.unsplash.com/photo-1604909052743-94e838986d24',
        'Pasta Primavera': 'https://images.unsplash.com/photo-1704915912471-070dd75619c9',
        'Smoothie de Plátano y Espinaca': 'https://images.unsplash.com/photo-1577450680941-2011043c55f8',
        'Sopa de Verduras Nutritiva': 'https://images.unsplash.com/photo-1643786661490-966f1877effa',
        'Tacos Mexicanos Caseros': 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0'
      }
      
      for (const [key, url] of Object.entries(imageMap)) {
        if (title?.includes(key.split(' ')[0])) {
          return url + '?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
        }
      }
      
      // Default food image
      return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'
    }
    
    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
    
    const getAvailabilityClass = (percentage) => {
      if (percentage === 100) return 'full'
      if (percentage >= 70) return 'high'
      if (percentage >= 40) return 'medium'
      return 'low'
    }
    
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
    
    const getToastIcon = (type) => {
      switch (type) {
        case 'success': return 'mdi:check-circle'
        case 'error': return 'mdi:alert-circle'
        case 'info': return 'mdi:information'
        default: return 'mdi:information'
      }
    }
    
    const showToast = (message, type = 'success') => {
      toastMessage.value = message
      toastType.value = type
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    }
    
    // Database functions
    const fetchRecipes = async () => {
      loading.value = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        // Fetch recipes with ingredients and steps
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients (*),
            recipe_steps (*)
          `)
          .order('created_at', { ascending: false })
        
        if (recipesError) throw recipesError
        
        // Fetch user's favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('recipe_id')
          .eq('user_id', user.id)
        
        if (favoritesError) throw favoritesError
        
        const favoriteIds = new Set(favoritesData?.map(f => f.recipe_id) || [])
        
        // Fetch pantry to check ingredient availability
        const { data: pantryData, error: pantryError } = await supabase
          .from('pantry')
          .select('name, quantity')
          .eq('user_id', user.id)
        
        if (pantryError) throw pantryError
        
        const pantryMap = new Map()
        pantryData?.forEach(item => {
          pantryMap.set(item.name.toLowerCase(), item.quantity)
        })
        
        // Process recipes
        recipes.value = recipesData?.map(recipe => {
          // Check ingredient availability
          let availableCount = 0
          let totalIngredients = recipe.recipe_ingredients?.length || 0
          
          if (totalIngredients > 0) {
            recipe.recipe_ingredients?.forEach(ingredient => {
              if (pantryMap.has(ingredient.name.toLowerCase())) {
                availableCount++
              }
            })
          }
          
          const availability_percentage = totalIngredients > 0 
            ? Math.round((availableCount / totalIngredients) * 100) 
            : 100
          
          return {
            ...recipe,
            ingredients: recipe.recipe_ingredients || [],
            steps: recipe.recipe_steps || [],
            is_favorite: favoriteIds.has(recipe.id),
            availability_percentage
          }
        }) || []
        
        totalRecipes.value = recipes.value.length
        
      } catch (error) {
        console.error('Error fetching recipes:', error)
        showToast('Error al cargar las recetas', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const toggleFavorite = async (recipe) => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          showToast('Debes iniciar sesión para agregar favoritos', 'error')
          return
        }
        
        if (recipe.is_favorite) {
          // Remove from favorites
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('recipe_id', recipe.id)
          
          if (error) throw error
          
          recipe.is_favorite = false
          showToast('Receta eliminada de favoritos')
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              recipe_id: recipe.id
            })
          
          if (error) throw error
          
          recipe.is_favorite = true
          showToast('Receta agregada a favoritos')
        }
        
        // Update local state
        const index = recipes.value.findIndex(r => r.id === recipe.id)
        if (index !== -1) {
          recipes.value[index].is_favorite = recipe.is_favorite
        }
        
        if (selectedRecipe.value?.id === recipe.id) {
          selectedRecipe.value.is_favorite = recipe.is_favorite
        }
        
      } catch (error) {
        console.error('Error toggling favorite:', error)
        showToast('Error al actualizar favoritos', 'error')
      }
    }
    
    const saveRecipe = async () => {
      savingRecipe.value = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          showToast('Debes iniciar sesión para crear recetas', 'error')
          return
        }
        
        // Validate form
        if (!recipeForm.title || !recipeForm.category || !recipeForm.difficulty) {
          showToast('Completa los campos obligatorios', 'error')
          return
        }
        
        if (recipeForm.ingredients.length === 0) {
          showToast('Agrega al menos un ingrediente', 'error')
          return
        }
        
        if (recipeForm.instructions.length === 0) {
          showToast('Agrega al menos una instrucción', 'error')
          return
        }
        
        const recipeData = {
          title: recipeForm.title,
          description: recipeForm.description,
          category: recipeForm.category,
          difficulty: recipeForm.difficulty,
          prep_time: recipeForm.prep_time,
          cook_time: recipeForm.cook_time,
          servings: recipeForm.servings,
          calories: recipeForm.calories,
          image_url: recipeForm.image_url,
          is_vegetarian: recipeForm.is_vegetarian,
          is_healthy: recipeForm.is_healthy,
          is_quick: recipeForm.is_quick,
          created_by: user.id
        }
        
        let recipeId
        let message
        
        if (editingRecipe.value) {
          // Update existing recipe
          const { error } = await supabase
            .from('recipes')
            .update(recipeData)
            .eq('id', editingRecipe.value.id)
          
          if (error) throw error
          
          recipeId = editingRecipe.value.id
          message = 'Receta actualizada correctamente'
          
          // Delete existing ingredients and steps
          await supabase
            .from('recipe_ingredients')
            .delete()
            .eq('recipe_id', recipeId)
          
          await supabase
            .from('recipe_steps')
            .delete()
            .eq('recipe_id', recipeId)
        } else {
          // Create new recipe
          const { data, error } = await supabase
            .from('recipes')
            .insert(recipeData)
            .select()
            .single()
          
          if (error) throw error
          
          recipeId = data.id
          message = 'Receta creada correctamente'
        }
        
        // Add ingredients
        const ingredientsToInsert = recipeForm.ingredients
          .filter(ing => ing.name && ing.quantity)
          .map((ing, index) => ({
            recipe_id: recipeId,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            order_index: index
          }))
        
        if (ingredientsToInsert.length > 0) {
          const { error } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsToInsert)
          
          if (error) throw error
        }
        
        // Add steps
        const stepsToInsert = recipeForm.instructions
          .filter(step => step.description)
          .map((step, index) => ({
            recipe_id: recipeId,
            step_number: index + 1,
            description: step.description,
            image_url: step.image_url
          }))
        
        if (stepsToInsert.length > 0) {
          const { error } = await supabase
            .from('recipe_steps')
            .insert(stepsToInsert)
          
          if (error) throw error
        }
        
        showToast(message)
        closeCreateRecipeModal()
        fetchRecipes() // Refresh the list
        
      } catch (error) {
        console.error('Error saving recipe:', error)
        showToast('Error al guardar la receta', 'error')
      } finally {
        savingRecipe.value = false
      }
    }
    
    const deleteRecipe = async (recipe) => {
      if (!confirm(`¿Estás seguro de eliminar la receta "${recipe.title}"?`)) {
        return
      }
      
      try {
        const { error } = await supabase
          .from('recipes')
          .delete()
          .eq('id', recipe.id)
        
        if (error) throw error
        
        showToast('Receta eliminada correctamente')
        fetchRecipes()
        
        if (showRecipeModal.value && selectedRecipe.value?.id === recipe.id) {
          closeRecipeModal()
        }
        
      } catch (error) {
        console.error('Error deleting recipe:', error)
        showToast('Error al eliminar la receta', 'error')
      }
    }
    
    const addToPlanner = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          showToast('Debes iniciar sesión para planificar', 'error')
          return
        }
        
        if (!selectedRecipe.value || !plannerData.meal_type || !plannerData.date) {
          showToast('Completa todos los campos obligatorios', 'error')
          return
        }
        
        // Check if weekly_plan entry exists for this date and meal type
        const { data: existingPlan } = await supabase
          .from('weekly_plan')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', plannerData.date)
          .eq('meal_type', plannerData.meal_type)
          .single()
        
        const planData = {
          user_id: user.id,
          date: plannerData.date,
          meal_type: plannerData.meal_type,
          recipe_id: selectedRecipe.value.id,
          notes: plannerData.notes,
          servings: plannerData.servings
        }
        
        let planError
        if (existingPlan) {
          // Update existing plan
          const { error } = await supabase
            .from('weekly_plan')
            .update(planData)
            .eq('id', existingPlan.id)
          
          planError = error
        } else {
          // Create new plan
          const { error } = await supabase
            .from('weekly_plan')
            .insert(planData)
          
          planError = error
        }
        
        if (planError) throw planError
        
        // Add missing ingredients to shopping list if requested
        if (plannerData.add_to_shopping) {
          const missingIngredients = []
          const pantryItems = await getPantryItems()
          
          selectedRecipeIngredients.value.forEach(ingredient => {
            const inPantry = pantryItems.find(item => 
              item.name.toLowerCase() === ingredient.name.toLowerCase()
            )
            
            if (!inPantry || inPantry.quantity < ingredient.quantity) {
              missingIngredients.push({
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                recipe_id: selectedRecipe.value.id
              })
            }
          })
          
          if (missingIngredients.length > 0) {
            const shoppingItems = missingIngredients.map(item => ({
              user_id: user.id,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              category: 'compra',
              is_purchased: false,
              recipe_id: item.recipe_id
            }))
            
            const { error: shoppingError } = await supabase
              .from('shopping_list')
              .insert(shoppingItems)
            
            if (shoppingError) throw shoppingError
          }
        }
        
        showToast('Receta agregada al planificador')
        closeAddToPlannerModal()
        
      } catch (error) {
        console.error('Error adding to planner:', error)
        showToast('Error al agregar al planificador', 'error')
      }
    }
    
    const addToShoppingList = async (recipe) => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          showToast('Debes iniciar sesión para agregar a la lista de compras', 'error')
          return
        }
        
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
          showToast('Esta receta no tiene ingredientes', 'error')
          return
        }
        
        const shoppingItems = recipe.ingredients.map(ing => ({
          user_id: user.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit || 'unidades',
          category: 'compra',
          is_purchased: false,
          recipe_id: recipe.id
        }))
        
        const { error } = await supabase
          .from('shopping_list')
          .insert(shoppingItems)
        
        if (error) throw error
        
        showToast('Ingredientes agregados a la lista de compras')
        
      } catch (error) {
        console.error('Error adding to shopping list:', error)
        showToast('Error al agregar a la lista de compras', 'error')
      }
    }
    
    const shareRecipe = (recipe) => {
      const shareText = `¡Mira esta receta! ${recipe.title}\n\nIngredientes:\n${recipe.ingredients.map(ing => `- ${ing.quantity} ${ing.unit} de ${ing.name}`).join('\n')}\n\nInstrucciones:\n${recipe.steps.map((step, i) => `${i + 1}. ${step.description}`).join('\n')}`
      
      if (navigator.share) {
        navigator.share({
          title: recipe.title,
          text: shareText,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(shareText)
        showToast('Receta copiada al portapapeles')
      }
    }
    
    const getPantryItems = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []
        
        const { data, error } = await supabase
          .from('pantry')
          .select('name, quantity')
          .eq('user_id', user.id)
        
        if (error) throw error
        
        return data || []
      } catch (error) {
        console.error('Error fetching pantry:', error)
        return []
      }
    }
    
    const ingredientInPantry = (ingredientName) => {
      // This would be populated with actual pantry data
      return false
    }
    
    const checkPantryForIngredient = async (ingredient) => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          showToast('Debes iniciar sesión para usar la despensa', 'error')
          return
        }
        
        const { error } = await supabase
          .from('pantry')
          .insert({
            user_id: user.id,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: 'otros'
          })
        
        if (error) throw error
        
        showToast(`${ingredient.name} agregado a la despensa`)
        
      } catch (error) {
        console.error('Error adding to pantry:', error)
        showToast('Error al agregar a la despensa', 'error')
      }
    }
    
    // Filter functions
    const toggleCategory = (category) => {
      const index = selectedCategories.value.indexOf(category)
      if (index === -1) {
        selectedCategories.value.push(category)
      } else {
        selectedCategories.value.splice(index, 1)
      }
    }
    
    const toggleDifficulty = (difficulty) => {
      const index = selectedDifficulties.value.indexOf(difficulty)
      if (index === -1) {
        selectedDifficulties.value.push(difficulty)
      } else {
        selectedDifficulties.value.splice(index, 1)
      }
    }
    
    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag)
      if (index === -1) {
        selectedTags.value.push(tag)
      } else {
        selectedTags.value.splice(index, 1)
      }
    }
    
    const clearFilters = () => {
      selectedCategories.value = []
      selectedDifficulties.value = []
      selectedTags.value = []
      maxTime.value = ''
      showOnlyAvailable.value = false
      showFavoritesOnly.value = false
      searchQuery.value = ''
      currentPage.value = 1
    }
    
    const applyFilters = () => {
      showAdvancedFilters.value = false
      currentPage.value = 1
    }
    
    const handleSearch = () => {
      currentPage.value = 1
    }
    
    // Modal functions
    const openRecipeDetail = async (recipe) => {
      selectedRecipe.value = recipe
      originalServings.value = recipe.servings || 1
      currentServings.value = recipe.servings || 1
      activeTab.value = 'ingredients'
      checkedIngredients.value = Array(recipe.ingredients?.length || 0).fill(false)
      showRecipeModal.value = true
      
      // Reset cooking mode if active
      if (cookingMode.value) {
        toggleCookingMode()
      }
    }
    
    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedRecipe.value = null
      resetTimer()
    }
    
    const openCreateRecipeModal = () => {
      editingRecipe.value = null
      resetRecipeForm()
      showCreateRecipeModal.value = true
    }
    
    const openEditRecipeModal = (recipe) => {
      editingRecipe.value = recipe
      
      // Populate form with recipe data
      recipeForm.title = recipe.title
      recipeForm.description = recipe.description || ''
      recipeForm.category = recipe.category
      recipeForm.difficulty = recipe.difficulty
      recipeForm.prep_time = recipe.prep_time
      recipeForm.cook_time = recipe.cook_time || 0
      recipeForm.servings = recipe.servings
      recipeForm.calories = recipe.calories
      recipeForm.image_url = recipe.image_url || ''
      recipeForm.is_vegetarian = recipe.is_vegetarian
      recipeForm.is_healthy = recipe.is_healthy
      recipeForm.is_quick = recipe.is_quick
      recipeForm.ingredients = recipe.ingredients?.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit || ''
      })) || [{ name: '', quantity: '', unit: '' }]
      
      recipeForm.instructions = recipe.steps?.map(step => ({
        description: step.description,
        image_url: step.image_url || ''
      })) || [{ description: '', image_url: '' }]
      
      showRecipeModal.value = false
      showCreateRecipeModal.value = true
    }
    
    const closeCreateRecipeModal = () => {
      showCreateRecipeModal.value = false
      editingRecipe.value = null
      resetRecipeForm()
    }
    
    const openAddToPlannerModal = (recipe) => {
      selectedRecipe.value = recipe
      plannerData.servings = recipe.servings || 4
      showAddToPlannerModal.value = true
      
      if (showRecipeModal.value) {
        showRecipeModal.value = false
      }
    }
    
    const closeAddToPlannerModal = () => {
      showAddToPlannerModal.value = false
      plannerData.meal_type = ''
      plannerData.date = new Date().toISOString().split('T')[0]
      plannerData.notes = ''
      plannerData.add_to_shopping = true
    }
    
    // Form helper functions
    const resetRecipeForm = () => {
      recipeForm.title = ''
      recipeForm.description = ''
      recipeForm.category = ''
      recipeForm.difficulty = ''
      recipeForm.prep_time = 15
      recipeForm.cook_time = 0
      recipeForm.servings = 4
      recipeForm.calories = null
      recipeForm.image_url = ''
      recipeForm.is_vegetarian = false
      recipeForm.is_healthy = false
      recipeForm.is_quick = false
      recipeForm.ingredients = [{ name: '', quantity: '', unit: '' }]
      recipeForm.instructions = [{ description: '', image_url: '' }]
    }
    
    const addIngredientField = () => {
      recipeForm.ingredients.push({ name: '', quantity: '', unit: '' })
    }
    
    const removeIngredient = (index) => {
      if (recipeForm.ingredients.length > 1) {
        recipeForm.ingredients.splice(index, 1)
      }
    }
    
    const addStepField = () => {
      recipeForm.instructions.push({ description: '', image_url: '' })
    }
    
    const removeStep = (index) => {
      if (recipeForm.instructions.length > 1) {
        recipeForm.instructions.splice(index, 1)
      }
    }
    
    // Servings functions
    const increaseServings = () => {
      if (currentServings.value < 20) {
        currentServings.value++
      }
    }
    
    const decreaseServings = () => {
      if (currentServings.value > 1) {
        currentServings.value--
      }
    }
    
    const resetServings = () => {
      currentServings.value = originalServings.value
    }
    
    const calculateScaledQuantity = (quantity) => {
      const qty = parseFloat(quantity)
      if (isNaN(qty)) return quantity
      
      const scale = currentServings.value / originalServings.value
      return (qty * scale).toFixed(2)
    }
    
    // Cooking mode functions
    const toggleCookingMode = () => {
      cookingMode.value = !cookingMode.value
      
      if (cookingMode.value) {
        // Start timer
        timerInterval.value = setInterval(() => {
          if (!timerPaused.value) {
            timerSeconds.value++
          }
        }, 1000)
        
        // Reset steps
        currentCookingStep.value = 0
        completedSteps.value = Array(selectedRecipeSteps.value.length).fill(false)
      } else {
        // Stop timer
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }
        resetTimer()
      }
    }
    
    const toggleTimer = () => {
      timerPaused.value = !timerPaused.value
    }
    
    const resetTimer = () => {
      timerSeconds.value = 0
      timerPaused.value = false
    }
    
    const previousCookingStep = () => {
      if (currentCookingStep.value > 0) {
        currentCookingStep.value--
      }
    }
    
    const nextCookingStep = () => {
      if (currentCookingStep.value < selectedRecipeSteps.value.length - 1) {
        currentCookingStep.value++
      }
    }
    
    const toggleStepComplete = (index) => {
      completedSteps.value[index] = !completedSteps.value[index]
    }
    
    // Ingredients functions
    const checkAllIngredients = () => {
      checkedIngredients.value = checkedIngredients.value.map(() => true)
    }
    
    const uncheckAllIngredients = () => {
      checkedIngredients.value = checkedIngredients.value.map(() => false)
    }
    
    const addMissingToShoppingList = async () => {
      const missingIngredients = selectedRecipeIngredients.value.filter((_, index) => !checkedIngredients.value[index])
      
      if (missingIngredients.length === 0) {
        showToast('Todos los ingredientes están marcados', 'info')
        return
      }
      
      await addToShoppingList({
        ...selectedRecipe.value,
        ingredients: missingIngredients
      })
    }
    
    const increasePlanServings = () => {
      if (plannerData.servings < 20) {
        plannerData.servings++
      }
    }
    
    const decreasePlanServings = () => {
      if (plannerData.servings > 1) {
        plannerData.servings--
      }
    }
    
    // Pagination
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }
    
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }
    
    // Image error handler
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
      try {
        await supabase.auth.signOut()
        router.push('/login')
      } catch (error) {
        console.error('Error logging out:', error)
        showToast('Error al cerrar sesión', 'error')
      }
    }
    
    // Watch for filter changes
    watch([selectedCategories, selectedDifficulties, selectedTags, maxTime, showOnlyAvailable, showFavoritesOnly], () => {
      currentPage.value = 1
    })
    
    // Initialize
    onMounted(() => {
      fetchRecipes()
    })
    
    return {
      // Layout
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      
      // Data
      recipes: paginatedRecipes,
      loading,
      selectedRecipe,
      editingRecipe,
      
      // Filters
      searchQuery,
      showAdvancedFilters,
      showOnlyAvailable,
      showFavoritesOnly,
      viewMode,
      selectedCategories,
      selectedDifficulties,
      selectedTags,
      maxTime,
      sortBy,
      categoryOptions,
      difficultyOptions,
      tagOptions,
      
      // Computed
      filteredRecipes,
      availableRecipes,
      availableRecipesCount,
      activeFilterCount,
      totalPages,
      currentPage,
      selectedRecipeIngredients,
      selectedRecipeSteps,
      scaledIngredients,
      
      // Modal states
      showRecipeModal,
      showCreateRecipeModal,
      showAddToPlannerModal,
      
      // Recipe detail
      activeTab,
      currentServings,
      checkedIngredients,
      cookingMode,
      timerSeconds,
      timerPaused,
      currentCookingStep,
      completedSteps,
      
      // Forms
      recipeForm,
      plannerData,
      savingRecipe,
      
      // Toast
      toastMessage,
      toastType,
      
      // Methods
      formatCategory,
      formatDifficulty,
      getRecipeImage,
      truncateText,
      getAvailabilityClass,
      formatTime,
      
      // Filter methods
      toggleCategory,
      toggleDifficulty,
      toggleTag,
      clearFilters,
      applyFilters,
      handleSearch,
      
      // Modal methods
      openRecipeDetail,
      closeRecipeModal,
      openCreateRecipeModal,
      openEditRecipeModal,
      closeCreateRecipeModal,
      openAddToPlannerModal,
      closeAddToPlannerModal,
      
      // Recipe methods
      toggleFavorite,
      saveRecipe,
      deleteRecipe,
      addToPlanner,
      addToShoppingList,
      shareRecipe,
      checkPantryForIngredient,
      ingredientInPantry,
      
      // Form methods
      addIngredientField,
      removeIngredient,
      addStepField,
      removeStep,
      
      // Servings methods
      increaseServings,
      decreaseServings,
      resetServings,
      calculateScaledQuantity,
      increasePlanServings,
      decreasePlanServings,
      
      // Cooking mode methods
      toggleCookingMode,
      toggleTimer,
      resetTimer,
      previousCookingStep,
      nextCookingStep,
      toggleStepComplete,
      
      // Ingredients methods
      checkAllIngredients,
      uncheckAllIngredients,
      addMissingToShoppingList,
      
      // Pagination
      nextPage,
      previousPage,
      
      // Image handling
      handleImageError,
      
      // Toast
      showToast,
      getToastIcon
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
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.recetas-header > div {
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

.add-recipe-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-recipe-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.add-recipe-btn .iconify {
  width: 18px;
  height: 18px;
}

/* Buscador y Filtros */
.filters-container {
  margin-bottom: 32px;
}

.search-row {
  margin-bottom: 16px;
}

.search-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
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
  flex: 1;
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

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-toggle:hover {
  background-color: var(--muted);
}

.filter-toggle .iconify {
  width: 18px;
  height: 18px;
}

.filter-badge {
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
}

/* Filtros avanzados */
.advanced-filters {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background-color: var(--muted);
}

.filter-chip.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.filter-chip .iconify {
  width: 14px;
  height: 14px;
}

.time-select,
.sort-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  cursor: pointer;
}

.time-select:focus,
.sort-select:focus {
  outline: none;
  border-color: var(--primary);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.clear-filters-btn,
.apply-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn {
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.clear-filters-btn:hover {
  background-color: var(--muted);
}

.apply-filters-btn {
  background-color: var(--primary);
  border: 1px solid var(--primary);
  color: var(--primary-foreground);
}

.apply-filters-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Filtros rápidos */
.quick-filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-filter-btn {
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

.quick-filter-btn:hover {
  background-color: rgba(168, 213, 186, 0.5);
  border-color: var(--primary);
}

.quick-filter-btn.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.quick-filter-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Resultados */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--muted-foreground);
}

.stat-item.success {
  color: var(--primary);
}

.stat-item .iconify {
  width: 16px;
  height: 16px;
}

.view-toggle {
  display: flex;
  gap: 8px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}

.view-toggle-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle-btn:hover {
  background-color: var(--muted);
}

.view-toggle-btn.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.view-toggle-btn .iconify {
  width: 20px;
  height: 20px;
}

/* Grid de recetas */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
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
  height: 200px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.tag-badge.vegetarian {
  background-color: rgba(93, 162, 113, 0.9);
  color: var(--primary-foreground);
}

.tag-badge.healthy {
  background-color: rgba(139, 177, 116, 0.9);
  color: var(--primary-foreground);
}

.tag-badge.quick {
  background-color: rgba(168, 213, 186, 0.9);
  color: var(--primary-foreground);
}

.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background-color: white;
  transform: scale(1.1);
}

.favorite-btn .iconify {
  width: 18px;
  height: 18px;
  color: var(--destructive);
}

.recipe-content {
  padding: 20px;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.recipe-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.4;
  flex: 1;
}

.recipe-difficulty {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.difficulty-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.difficulty-dot.easy {
  background-color: #10b981;
}

.difficulty-dot.medium {
  background-color: #f59e0b;
}

.difficulty-dot.hard {
  background-color: #ef4444;
}

.recipe-description {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recipe-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.recipe-stats .stat-item .iconify {
  width: 14px;
  height: 14px;
}

.recipe-availability {
  margin-bottom: 16px;
}

.availability-bar {
  position: relative;
  height: 24px;
  background-color: var(--muted);
  border-radius: 12px;
  overflow: hidden;
}

.availability-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
}

.availability-bar.full .availability-fill {
  background-color: #10b981;
}

.availability-bar.high .availability-fill {
  background-color: #84cc16;
}

.availability-bar.medium .availability-fill {
  background-color: #f59e0b;
}

.availability-bar.low .availability-fill {
  background-color: #ef4444;
}

.availability-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  color: white;
  z-index: 1;
}

.recipe-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--foreground);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--muted);
}

.action-btn.view-btn:hover {
  background-color: rgba(93, 162, 113, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn.plan-btn:hover {
  background-color: rgba(139, 92, 246, 0.1);
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.action-btn.shop-btn:hover {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #f59e0b;
}

/* Vista de lista */
.recipes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.recipe-list-item {
  display: flex;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.recipe-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.list-item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.list-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.list-item-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  flex: 1;
}

.list-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.meta-item .iconify {
  width: 12px;
  height: 12px;
}

.category-badge {
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.list-item-description {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.list-item-tags .tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tag.vegetarian {
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
}

.tag.healthy {
  background-color: rgba(139, 177, 116, 0.1);
  color: var(--secondary);
}

.tag.quick {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.list-item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* Estados de carga y vacío */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--muted-foreground);
}

.loading-icon {
  width: 48px;
  height: 48px;
  color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.empty-state-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.empty-state-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.empty-state-btn .iconify {
  width: 18px;
  height: 18px;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--muted);
  border-color: var(--primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn .iconify {
  width: 18px;
  height: 18px;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-info {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* MODALES */
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
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--muted);
}

.modal-close .iconify {
  width: 20px;
  height: 20px;
  color: var(--foreground);
}

/* Modal de detalle de receta */
.recipe-detail-modal {
  max-width: 900px;
  width: 100%;
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

.detail-favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-favorite-btn:hover {
  background-color: white;
  transform: scale(1.1);
}

.detail-favorite-btn .iconify {
  width: 20px;
  height: 20px;
  color: var(--destructive);
}

.recipe-detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.recipe-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
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

.recipe-detail-description {
  margin-bottom: 32px;
}

.recipe-detail-description p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted-foreground);
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

/* Tabs */
.recipe-tabs {
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background-color: var(--card);
}

.tab-btn.active {
  background-color: var(--card);
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}

.tab-btn .iconify {
  width: 18px;
  height: 18px;
}

.tabs-content {
  padding: 24px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Contenido de tabs */
.servings-control {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 12px;
}

.servings-control label {
  font-weight: 500;
  color: var(--foreground);
}

.servings-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.servings-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.servings-btn:hover {
  background-color: var(--muted);
}

.servings-btn .iconify {
  width: 16px;
  height: 16px;
  color: var(--foreground);
}

.servings-input {
  width: 60px;
  padding: 8px;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 16px;
  font-weight: 500;
}

.reset-servings-btn {
  margin-left: auto;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted-foreground);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-servings-btn:hover {
  background-color: var(--muted);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: all 0.2s;
}

.ingredient-item:hover {
  background-color: var(--muted);
}

.ingredient-checkbox {
  position: relative;
}

.ingredient-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.ingredient-checkbox label {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.ingredient-checkbox input:checked + label {
  background-color: var(--primary);
  border-color: var(--primary);
}

.ingredient-checkbox input:checked + label::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.ingredient-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.ingredient-name {
  font-weight: 500;
  color: var(--foreground);
}

.ingredient-quantity {
  color: var(--primary);
  font-weight: 500;
}

.ingredient-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.ingredient-item:hover .ingredient-actions {
  opacity: 1;
}

.ingredient-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.ingredient-action-btn:hover {
  background-color: var(--muted);
  border-color: var(--primary);
}

.ingredient-action-btn .iconify {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.ingredients-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-secondary {
  padding: 10px 20px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: var(--muted);
}

.btn-primary {
  padding: 10px 20px;
  background-color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 10px;
  color: var(--primary-foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Instrucciones */
.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
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

.step-content {
  flex: 1;
}

.step-content p {
  font-size: 15px;
  color: var(--foreground);
  line-height: 1.6;
  margin-bottom: 12px;
}

.step-image {
  border-radius: 10px;
  overflow: hidden;
  max-width: 300px;
}

.step-image img {
  width: 100%;
  height: auto;
  display: block;
}

.cooking-mode {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.cooking-mode-btn {
  padding: 12px 24px;
  background-color: var(--primary);
  border: none;
  border-radius: 12px;
  color: var(--primary-foreground);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.cooking-mode-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: translateY(-2px);
}

/* Nutrición */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  background-color: rgba(168, 213, 186, 0.1);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.nutrition-item {
  text-align: center;
}

.nutrition-label {
  display: block;
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.nutrition-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
}

/* Modal de crear/editar receta */
.create-recipe-modal {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 32px;
  padding: 32px 32px 0;
}

.recipe-form {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.tag-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-label input:checked + .checkbox-custom {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
}

.checkbox-text {
  font-size: 14px;
  color: var(--foreground);
}

.form-hint {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 4px;
}

.ingredients-form,
.instructions-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ingredient-form-row,
.instruction-form-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ingredient-input,
.quantity-input,
.unit-select,
.step-image-input {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
}

.ingredient-input {
  flex: 2;
}

.quantity-input {
  width: 100px;
}

.unit-select {
  width: 120px;
}

.instruction-input {
  flex: 1;
  min-height: 60px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  resize: vertical;
}

.step-image-input {
  flex: 1;
}

.remove-ingredient-btn,
.remove-step-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(212, 24, 61, 0.2);
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-ingredient-btn:hover,
.remove-step-btn:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
}

.remove-ingredient-btn .iconify,
.remove-step-btn .iconify {
  width: 16px;
  height: 16px;
  color: var(--destructive);
}

.add-ingredient-btn,
.add-step-btn {
  padding: 12px;
  background-color: rgba(93, 162, 113, 0.1);
  border: 1px dashed var(--primary);
  border-radius: 10px;
  color: var(--primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.add-ingredient-btn:hover,
.add-step-btn:hover {
  background-color: rgba(93, 162, 113, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

/* Modal de planificador */
.planner-modal {
  max-width: 500px;
  width: 100%;
  padding: 32px;
  overflow: scroll;
}

.modal-subtitle {
  font-size: 16px;
  color: var(--muted-foreground);
  margin-bottom: 32px;
}

.planner-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

/* Modo cocina */
.cooking-mode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
  z-index: 3000;
}

.cooking-mode-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.cooking-header {
  padding: 20px;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cooking-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
}

.cooking-close {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.cooking-close:hover {
  background-color: var(--muted);
}

.cooking-close .iconify {
  width: 20px;
  height: 20px;
  color: var(--foreground);
}

.cooking-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.cooking-timer {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.timer-display {
  margin-bottom: 20px;
}

.timer-time {
  font-size: 48px;
  font-weight: 700;
  color: var(--foreground);
  font-family: 'Courier New', monospace;
}

.timer-label {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-top: 8px;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.timer-btn {
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.timer-btn:hover {
  background-color: var(--muted);
}

.timer-btn.paused {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.timer-btn.reset {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: rgba(212, 24, 61, 0.2);
  color: var(--destructive);
}

.timer-btn.reset:hover {
  background-color: rgba(212, 24, 61, 0.2);
}

.cooking-instructions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.cooking-step {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
}

.cooking-step.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.cooking-step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.cooking-step .step-number {
  width: 28px;
  height: 28px;
  font-size: 13px;
}

.step-check {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-check .iconify {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.cooking-step-content p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--foreground);
}

.cooking-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.nav-btn {
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--muted);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-indicator {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

/* Toast notifications */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 4000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.success {
  background-color: #10b981;
  color: white;
}

.toast.error {
  background-color: var(--destructive);
  color: white;
}

.toast.info {
  background-color: #3b82f6;
  color: white;
}

.toast .iconify {
  width: 20px;
  height: 20px;
}

.toast-text {
  font-size: 14px;
  font-weight: 500;
}

.toast-close {
  margin-left: 8px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Responsive */
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
  .recetas-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
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
  
  .add-recipe-btn {
    width: 100%;
    justify-content: center;
  }
  
  .search-wrapper {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-toggle {
    width: 100%;
    justify-content: center;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .recipe-list-item {
    flex-direction: column;
  }
  
  .list-item-image {
    width: 100%;
    height: 160px;
  }
  
  .results-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .results-stats {
    justify-content: space-between;
  }
  
  .view-toggle {
    align-self: center;
  }
  
  /* Modales responsive */
  .modal-content {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .recipe-detail-modal,
  .create-recipe-modal,
  .planner-modal {
    width: 100%;
    height: 100vh;
  }
  
  .recipe-detail-image {
    height: 200px;
  }
  
  .recipe-detail-content {
    padding: 20px;
  }
  
  .recipe-detail-header {
    flex-direction: column;
  }
  
  .recipe-detail-title {
    min-width: 100%;
    font-size: 24px;
  }
  
  .recipe-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tabs-header {
    flex-direction: column;
  }
  
  .tab-btn {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .tab-btn.active {
    border-bottom: 2px solid var(--primary);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .ingredient-form-row,
  .instruction-form-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ingredient-input,
  .quantity-input,
  .unit-select,
  .instruction-input,
  .step-image-input {
    width: 100%;
  }
  
  .modal-actions,
  .form-actions {
    flex-direction: column;
  }
  
  .modal-actions button,
  .form-actions button {
    width: 100%;
  }
  
  /* Cooking mode responsive */
  .cooking-timer {
    padding: 16px;
  }
  
  .timer-time {
    font-size: 36px;
  }
  
  .timer-controls {
    flex-direction: column;
  }
  
  .cooking-navigation {
    flex-direction: column;
    gap: 12px;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .quick-filters-row {
    justify-content: center;
  }
  
  .quick-filter-btn {
    flex: 1;
    min-width: calc(50% - 6px);
    justify-content: center;
  }
  
  .recipe-detail-stats {
    grid-template-columns: 1fr;
  }
  
  .servings-control {
    flex-direction: column;
    align-items: stretch;
  }
  
  .servings-selector {
    justify-content: center;
  }
  
  .reset-servings-btn {
    margin-left: 0;
    margin-top: 12px;
  }
}

@media (min-width: 1200px) {
  .recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>