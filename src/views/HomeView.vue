<!-- src/views/HomeView.vue -->
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
            <!-- Daily Meals -->
            <section class="section-card">
              <div class="section-header">
                <h2 class="section-title">Comidas del día</h2>
                <button class="generate-menu-btn" @click="openGenerateMenuModal">
                  <span class="iconify" data-icon="mdi:sparkles"></span>
                  Generar nuevo menú
                </button>
              </div>

              <div class="meals-grid">
                <!-- Loading State -->
                <div v-if="loadingStates.meals" class="loading-placeholder">
                  <div class="loading-spinner"></div>
                  <p>Cargando comidas...</p>
                </div>

                <!-- Breakfast - CAMBIA v-else-if POR v-if -->
                <div v-if="todayMeals.find(m => m.type === 'desayuno')" class="meal-card">
                  <div class="meal-image">
                    <img
                      :src="todayMeals.find(m => m.type === 'desayuno')?.image || 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="todayMeals.find(m => m.type === 'desayuno')?.title">
                    <div class="meal-emoji">🌅</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Desayuno</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{todayMeals.find(m => m.type === 'desayuno')?.title || 'Bowl de Avena con Frutas'}}</h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'desayuno')?.time || '15 min'}}</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'desayuno')?.servings || '2 porciones'}}</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn"
                        @click="openRecipeModal(todayMeals.find(m => m.type === 'desayuno')?.recipeId || 'aaaaaaaa-0000-0000-0000-000000000001')">Cocinar</button>
                      <button class="change-btn" @click="openChangeMealModal('breakfast')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Lunch - CAMBIA v-else-if POR v-if -->
                <div v-if="todayMeals.find(m => m.type === 'almuerzo')" class="meal-card">
                  <div class="meal-image">
                    <img
                      :src="todayMeals.find(m => m.type === 'almuerzo')?.image || 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="todayMeals.find(m => m.type === 'almuerzo')?.title">
                    <div class="meal-emoji">🍽️</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Almuerzo</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{todayMeals.find(m => m.type === 'almuerzo')?.title || 'Ensalada de Pollo a la Parrilla'}}
                    </h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'almuerzo')?.time || '30 min'}}</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'almuerzo')?.servings || '4 porciones'}}</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn"
                        @click="openRecipeModal(todayMeals.find(m => m.type === 'almuerzo')?.recipeId || 'aaaaaaaa-0000-0000-0000-000000000002')">Cocinar</button>
                      <button class="change-btn" @click="openChangeMealModal('lunch')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Dinner - CAMBIA v-else-if POR v-if -->
                <div v-if="todayMeals.find(m => m.type === 'cena')" class="meal-card">
                  <div class="meal-image">
                    <img
                      :src="todayMeals.find(m => m.type === 'cena')?.image || 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="todayMeals.find(m => m.type === 'cena')?.title">
                    <div class="meal-emoji">🌙</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Cena</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{todayMeals.find(m => m.type === 'cena')?.title || 'Pasta Primavera'}}</h3>
                    <div class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'cena')?.time || '25 min'}}</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{todayMeals.find(m => m.type === 'cena')?.servings || '4 porciones'}}</span>
                      </div>
                    </div>
                    <div class="meal-actions">
                      <button class="cook-btn"
                        @click="openRecipeModal(todayMeals.find(m => m.type === 'cena')?.recipeId || 'aaaaaaaa-0000-0000-0000-000000000003')">Cocinar</button>
                      <button class="change-btn" @click="openChangeMealModal('dinner')">Cambiar</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- My Pantry - EN CUADRO BLANCO -->
            <section class="section-card bg-white-card">
              <div class="section-header">
                <h2 class="section-title">Mi Despensa</h2>
                <button class="add-ingredient-btn" @click="openAddIngredientModal">
                  <span class="iconify" data-icon="mdi:plus"></span>
                  Agregar ingrediente
                </button>
              </div>

              <div class="pantry-grid">
                <!-- Loading State -->
                <div v-if="loadingStates.pantry && pantryItems.length === 0" class="loading-placeholder">
                  <div class="loading-spinner"></div>
                  <p>Cargando despensa...</p>
                </div>

                <div v-else-if="pantryItems.length === 0" class="empty-state">
                  <span class="iconify" data-icon="mdi:fridge-outline" style="font-size: 48px; color: #ccc;"></span>
                  <p>Tu despensa está vacía</p>
                  <button class="add-ingredient-btn" @click="openAddIngredientModal">
                    Agregar tu primer ingrediente
                  </button>
                </div>

                <div v-else v-for="item in pantryItems" :key="item.id" class="pantry-item">
                  <div class="pantry-image">
                    <img :src="item.image" :alt="item.name">
                    <div class="expiry-badge" :class="item.expiryBadge">
                      {{ item.daysUntilExpiry !== null ? `${item.daysUntilExpiry} días` : 'Sin fecha' }}
                    </div>
                  </div>
                  <div class="pantry-info">
                    <h4>{{ item.name }}</h4>
                    <p class="pantry-quantity">{{ item.quantity }}</p>
                    <p class="pantry-category">{{ item.category }}</p>
                    <div class="pantry-actions">
                      <button class="quantity-btn minus" @click="decreaseQuantity(item)">
                        <span class="iconify" data-icon="mdi:minus"></span>
                      </button>
                      <button class="quantity-btn plus" @click="increaseQuantity(item)">
                        <span class="iconify" data-icon="mdi:plus"></span>
                      </button>
                      <button class="delete-btn" @click="removeIngredient(item)">
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
                  <!-- Loading State -->
                  <div v-if="loadingStates.recipes && recommendedRecipes.length === 0" class="loading-placeholder">
                    <div class="loading-spinner"></div>
                    <p>Cargando recetas...</p>
                  </div>

                  <div v-else v-for="recipe in recommendedRecipes.slice(0, 2)" :key="recipe.id" class="recipe-card"
                    @click="openRecipeModal(recipe.id)">
                    <div class="recipe-image">
                      <img :src="recipe.image" :alt="recipe.title">
                      <div class="recipe-badge">{{ recipe.badge }}</div>
                    </div>
                    <div class="recipe-content">
                      <h4>{{ recipe.title }}</h4>
                      <div class="recipe-details">
                        <span>⏱️ {{ recipe.time }}</span>
                        <span>👥 {{ recipe.servings }}</span>
                      </div>
                      <button class="recipe-view-btn">Ver receta</button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right Column -->
              <div class="right-column">
                <!-- Weather Suggestion -->
                <section class="weather-suggestion-card">
                  <div class="weather-header">
                    <div class="weather-icon-container">
                      <span class="iconify weather-icon" data-icon="mdi:weather-partly-cloudy"></span>
                    </div>
                    <div>
                      <h3 class="weather-title">Sugerencia del clima</h3>
                      <p class="weather-subtitle">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C -
                        ${weatherSuggestion.condition}` : '18°C - Parcialmente nublado' }}</p>
                    </div>
                  </div>
                  <div class="weather-content">
                    <p class="weather-desc">
                      <span class="iconify" data-icon="mdi:lightbulb-on-outline"></span>
                      {{ weatherSuggestion ? weatherSuggestion.suggestionText : 'Hoy es un día perfecto para preparar Sopa de Verduras Nutritiva.El clima fresco pide algo caliente y reconfortante.' }}
                    </p>
                    <div class="weather-stats">
                      <div class="stat-item">
                        <span class="stat-label">Temperatura</span>
                        <span class="stat-value">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C` : '18°C'
                          }}</span>
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
                    <button class="weather-recipe-btn" @click="openWeatherRecipeModal">
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
                    <!-- Loading State -->
                    <div v-if="loadingStates.notifications && notifications.length === 0" class="loading-placeholder">
                      <div class="loading-spinner"></div>
                      <p>Cargando notificaciones...</p>
                    </div>

                    <div v-else-if="notifications.length === 0" class="empty-state">
                      <span class="iconify" data-icon="mdi:bell-outline" style="font-size: 32px; color: #ccc;"></span>
                      <p>No tienes notificaciones</p>
                    </div>

                    <div v-else v-for="notification in notifications.slice(0, 3)" :key="notification.id"
                      class="notification-item" @click="handleNotification(notification)">
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

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      <div class="toast-content">
        <span class="toast-icon iconify" :data-icon="toastIcon || 'mdi:information'"></span>
        <div>
          <p class="toast-title">{{ toastTitle }}</p>
          <p class="toast-message">{{ toastMessage }}</p>
        </div>
        <button class="toast-close" @click="showToast = false">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>

    <!-- MODALS -->

    <!-- Recipe Modal -->
    <div v-if="showRecipeModal" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content recipe-modal" @click.stop>
        <button class="modal-close" @click="closeRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <div v-if="loadingStates.recipeModal" class="modal-loading">
          <div class="loading-spinner"></div>
          <p>Cargando receta...</p>
        </div>

        <div v-else>
          <div class="recipe-modal-image">
            <img :src="currentRecipe.image" :alt="currentRecipe.title">
            <div class="recipe-image-overlay">
              <div class="recipe-badges">
                <span v-for="badge in currentRecipe.badges" :key="badge" class="recipe-badge-item">
                  {{ badge }}
                </span>
              </div>
              <div class="recipe-title-overlay">
                <h2>{{ currentRecipe.title }}</h2>
                <div class="recipe-rating">
                  <span class="rating-stars">★★★★★</span>
                  <span class="rating-value">{{ currentRecipe.rating }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="recipe-modal-details">
            <div class="recipe-stats">
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:clock-outline"></span>
                <span class="stat-value">{{ currentRecipe.time }}</span>
                <span class="stat-label">Tiempo</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:account-group-outline"></span>
                <span class="stat-value">{{ currentRecipe.servings }}</span>
                <span class="stat-label">Porciones</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:fire"></span>
                <span class="stat-value">{{ currentRecipe.calories }}</span>
                <span class="stat-label">Calorías</span>
              </div>
            </div>

            <div class="recipe-actions">
              <button class="action-btn favorite-btn" @click="toggleFavorite">
                <span class="iconify" :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
              </button>
              <button class="action-btn shopping-btn" @click="addToShoppingList">
                <span class="iconify" data-icon="mdi:cart-plus"></span>
                Agregar a lista de compras
              </button>
            </div>

            <div class="recipe-section">
              <h3 class="section-title">
                <span class="iconify" data-icon="mdi:food-apple"></span>
                Ingredientes
              </h3>
              <div class="ingredients-list">
                <div v-for="ingredient in currentRecipe.ingredients" :key="ingredient.name" class="ingredient-item">
                  <span class="ingredient-name">{{ ingredient.name }}</span>
                  <span class="ingredient-quantity">{{ ingredient.quantity }}</span>
                </div>
              </div>
            </div>

            <div class="recipe-section">
              <h3 class="section-title">
                <span class="iconify" data-icon="mdi:book-open-page-variant"></span>
                Instrucciones paso a paso
              </h3>
              <div class="instructions-container">
                <div class="step-navigation">
                  <button class="step-btn" @click="prevStep" :disabled="currentStep === 0">
                    <span class="iconify" data-icon="mdi:chevron-left"></span>
                    Anterior
                  </button>
                  <div class="step-indicator">Paso {{ currentStep + 1 }} de {{ currentRecipe.steps?.length || 0 }}</div>
                  <button class="step-btn" @click="nextStep"
                    :disabled="currentStep === (currentRecipe.steps?.length - 1 || 0)">
                    Siguiente
                    <span class="iconify" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <div v-if="currentRecipe.steps && currentRecipe.steps[currentStep]" class="step-content">
                  <div class="step-image">
                    <img :src="currentRecipe.steps[currentStep].image_url || currentRecipe.steps[currentStep].image"
                      :alt="'Paso ' + (currentStep + 1)">
                  </div>
                  <div class="step-description">
                    <h4>Paso {{ currentStep + 1 }}</h4>
                    <p>{{ currentRecipe.steps[currentStep].description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Meal Modal -->
    <div v-if="showChangeMealModal" class="modal-overlay" @click="closeChangeMealModal">
      <div class="modal-content change-meal-modal" @click.stop>
        <button class="modal-close" @click="closeChangeMealModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Cambiar {{ currentMealType === 'breakfast' ? 'Desayuno' : currentMealType === 'lunch' ?
          'Almuerzo' : 'Cena' }}</h2>

        <div class="meal-options-grid">
          <div v-for="meal in filteredMeals" :key="meal.id" class="meal-option"
            :class="{ 'selected': selectedMeal?.id === meal.id }" @click="selectMeal(meal)">
            <div class="meal-option-image">
              <img :src="meal.image" :alt="meal.title">
              <div class="meal-option-badge">{{ getMealTypeText(meal.type) }}</div>
            </div>
            <div class="meal-option-content">
              <h4>{{ meal.title }}</h4>
              <div class="meal-option-details">
                <span>⏱️ {{ meal.time }}</span>
                <span>👥 {{ meal.servings }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeChangeMealModal">Cancelar</button>
          <button class="modal-btn confirm-btn" @click="confirmMealChange" :disabled="!selectedMeal">
            Cambiar Comida
          </button>
        </div>
      </div>
    </div>

    <!-- Generate Menu Modal -->
    <div v-if="showGenerateMenuModal" class="modal-overlay" @click="closeGenerateMenuModal">
      <div class="modal-content generate-menu-modal" @click.stop>
        <button class="modal-close" @click="closeGenerateMenuModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Generar Nuevo Menú</h2>

        <div class="preferences-section">
          <h3>Preferencias</h3>
          <div class="preferences-grid">
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.dietary" value="vegetariano">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Vegetariano</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.dietary" value="saludable">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Saludable</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.dietary" value="rapido">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Rápido</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="generatedMenu.length > 0" class="generated-menu">
          <div class="generated-meal" v-for="meal in generatedMenu" :key="meal.type">
            <div class="generated-meal-header">
              <h4>{{ getMealTypeText(meal.type) }}</h4>
            </div>
            <div class="generated-meal-content">
              <img :src="meal.image" :alt="meal.title">
              <div class="generated-meal-info">
                <h5>{{ meal.title }}</h5>
                <div class="generated-meal-details">
                  <span>⏱️ {{ meal.time }}</span>
                  <span>👥 {{ meal.servings }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-menu">
          <p>Genera un menú para ver la previsualización</p>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeGenerateMenuModal">Cancelar</button>
          <button class="modal-btn generate-btn" @click="generateNewMenu">
            <span class="iconify" data-icon="mdi:sparkles"></span>
            Generar Menú
          </button>
          <button v-if="generatedMenu.length > 0" class="modal-btn confirm-btn" @click="applyGeneratedMenu">
            Aplicar Menú
          </button>
        </div>
      </div>
    </div>

    <!-- Add Ingredient Modal -->
    <div v-if="showAddIngredientModal" class="modal-overlay" @click="closeAddIngredientModal">
      <div class="modal-content add-ingredient-modal" @click.stop>
        <button class="modal-close" @click="closeAddIngredientModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Agregar Ingrediente</h2>

        <div class="search-section">
          <div class="search-input">
            <span class="iconify" data-icon="mdi:magnify"></span>
            <input type="text" v-model="ingredientSearch" placeholder="Buscar ingrediente..."
              @input="filterIngredients">
          </div>
        </div>

        <div class="ingredients-grid">
          <div v-for="ingredient in filteredIngredientList" :key="ingredient.id" class="ingredient-option"
            @click="selectIngredient(ingredient)">
            <div class="ingredient-option-image">
              <img
                :src="ingredient.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200'"
                :alt="ingredient.name">
            </div>
            <div class="ingredient-option-name">{{ ingredient.name }}</div>
            <button class="ingredient-add-btn">
              <span class="iconify" data-icon="mdi:plus"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ingredient Details Modal -->
    <div v-if="showIngredientDetailsModal" class="modal-overlay" @click="closeIngredientDetailsModal">
      <div class="modal-content ingredient-details-modal" @click.stop>
        <button class="modal-close" @click="closeIngredientDetailsModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">{{ selectedIngredient.name }}</h2>

        <div class="ingredient-image-large">
          <img
            :src="selectedIngredient.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'"
            :alt="selectedIngredient.name">
        </div>

        <div class="ingredient-form">
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="newIngredientData.category" class="form-select">
              <option value="verduras">Verduras</option>
              <option value="frutas">Frutas</option>
              <option value="proteínas">Proteínas</option>
              <option value="granos">Granos</option>
              <option value="lácteos">Lácteos</option>
              <option value="condimentos">Condimentos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cantidad</label>
            <div class="quantity-input-group">
              <input type="number" v-model="newIngredientData.quantity" min="1" class="form-input">
              <select v-model="newIngredientData.unit" class="form-select">
                <option value="unidades">Unidades</option>
                <option value="gramos">Gramos</option>
                <option value="kg">Kilogramos</option>
                <option value="ml">Mililitros</option>
                <option value="litros">Litros</option>
                <option value="tazas">Tazas</option>
                <option value="cucharadas">Cucharadas</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Días hasta vencer (opcional)</label>
            <div class="expiry-input">
              <input type="number" v-model="newIngredientData.expiryDays" min="1" class="form-input"
                placeholder="Ej: 7">
              <span class="expiry-label">días</span>
            </div>
          </div>

          <div class="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea v-model="newIngredientData.notes" class="form-textarea"
              placeholder="Ej: Tomates orgánicos, maduros"></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeIngredientDetailsModal">Cancelar</button>
          <button class="modal-btn confirm-btn" @click="addIngredientToPantry">
            Agregar a Despensa
          </button>
        </div>
      </div>
    </div>

    <!-- Weather Recipe Modal -->
    <div v-if="showWeatherRecipeModal" class="modal-overlay" @click="closeWeatherRecipeModal">
      <div class="modal-content weather-recipe-modal" @click.stop>
        <button class="modal-close" @click="closeWeatherRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <div class="weather-recipe-header">
          <div class="weather-icon-container-large">
            <span class="iconify weather-icon-large" data-icon="mdi:weather-partly-cloudy"></span>
          </div>
          <div>
            <h2 class="weather-recipe-title">Receta Sugerida por el Clima</h2>
            <p class="weather-recipe-subtitle">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C -
              ${weatherSuggestion.condition}` : '18°C - Parcialmente nublado' }}</p>
          </div>
        </div>

        <div class="weather-recipe-content">
          <div class="weather-recipe-image">
            <img
              :src="weatherSuggestion?.recipe?.image_url || 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'"
              alt="Receta sugerida">
            <div class="weather-recipe-badge">🌤️ Perfecta para días frescos</div>
          </div>

          <div class="weather-recipe-info">
            <h3>{{ weatherSuggestion?.recipe?.title || 'Sopa de Verduras Nutritiva' }}</h3>
            <p class="weather-recipe-desc">{{ weatherSuggestion?.suggestionText || 'Esta receta caliente y reconfortante es ideal para el clima fresco de hoy.Las verduras de temporada y el caldo casero te mantendrán abrigado.'
              }}</p>

            <div class="weather-recipe-stats">
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:clock-outline"></span>
                <span class="stat-value">35 min</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:account-group-outline"></span>
                <span class="stat-value">6 porciones</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:fire"></span>
                <span class="stat-value">210 kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeWeatherRecipeModal">Cancelar</button>
          <button class="modal-btn cook-btn"
            @click="openRecipeModal(weatherSuggestion?.recipe?.id || 'aaaaaaaa-0000-0000-0000-000000000005')">
            <span class="iconify" data-icon="mdi:chef-hat"></span>
            Ver Receta Completa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { onUnmounted, onBeforeUnmount } from 'vue'

export default {
  name: 'InicioView',
  components: {
    Sidebar,
    Header
  },
  setup() {

    const router = useRouter()
    const authStore = useAuthStore()

    // Layout state
    const isMobileMenuOpen = ref(false)

    // Modal states
    const showRecipeModal = ref(false)
    const showChangeMealModal = ref(false)
    const showGenerateMenuModal = ref(false)
    const showAddIngredientModal = ref(false)
    const showIngredientDetailsModal = ref(false)
    const showWeatherRecipeModal = ref(false)

    // Toast notification
    const showToast = ref(false)
    const toastType = ref('success')
    const toastTitle = ref('')
    const toastMessage = ref('')
    const toastIcon = ref('mdi:information')

    // Current states
    const currentRecipe = ref({})
    const currentMealType = ref('')
    const currentStep = ref(0)
    const isFavorite = ref(false)
    const selectedMeal = ref(null)
    const ingredientSearch = ref('')
    const selectedIngredient = ref({})

    // Data states from database
    const notifications = ref([])
    const pantryItems = ref([])
    const todayMeals = ref([])
    const recommendedRecipes = ref([])
    const weatherSuggestion = ref(null)
    const allMeals = ref([])
    const allIngredients = ref([])

    // Menu preferences
    const menuPreferences = reactive({
      dietary: []
    })

    // Generated menu
    const generatedMenu = ref([])

    // New ingredient data
    const newIngredientData = reactive({
      category: 'verduras',
      quantity: 1,
      unit: 'unidades',
      expiryDays: null,
      notes: ''
    })

    // Loading states
    const loadingStates = reactive({
      meals: true,
      pantry: true,
      recipes: true,
      weather: true,
      notifications: true,
      recipeModal: false
    })



    // Al inicio del setup() de HomeView.vue

    onBeforeUnmount(() => {
      console.log('HomeView se desmontará')
      // Limpiar modales
      showRecipeModal.value = false
      showToast.value = false
    })

    onUnmounted(() => {
      console.log('HomeView desmontado')
    })


    // ============================================
    // TOAST NOTIFICATION SYSTEM
    // ============================================
    const showNotification = (type, title, message, icon = null) => {
      toastType.value = type
      toastTitle.value = title
      toastMessage.value = message

      if (icon) {
        toastIcon.value = icon
      } else {
        switch (type) {
          case 'success':
            toastIcon.value = 'mdi:check-circle'
            break
          case 'error':
            toastIcon.value = 'mdi:alert-circle'
            break
          case 'warning':
            toastIcon.value = 'mdi:alert'
            break
          case 'info':
            toastIcon.value = 'mdi:information'
            break
          default:
            toastIcon.value = 'mdi:information'
        }
      }

      showToast.value = true

      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }
    // ============================================
    // DATABASE FUNCTIONS - CORREGIDAS
    // ============================================

    // 1. Load today's meals from database - VERSIÓN CORREGIDA
    const loadTodayMeals = async () => {
      try {
        loadingStates.meals = true

        console.log('📅 Cargando comidas del día...')

        // Obtener la fecha actual
        const today = new Date()

        // Obtener día de la semana (0=domingo, 1=lunes, ..., 6=sábado)
        const jsDayOfWeek = today.getDay() // JavaScript: 0=domingo

        // Convertir a nuestro sistema: 0=lunes, 6=domingo
        // Mapeo: domingo(0) -> 6, lunes(1) -> 0, martes(2) -> 1, etc.
        const dayOfWeek = (jsDayOfWeek + 6) % 7

        console.log(`📅 Hoy es ${today.toLocaleDateString()}, día de la semana: JS=${jsDayOfWeek}, Nuestro=${dayOfWeek}`)

        // Obtener lunes de esta semana
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)

        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        console.log(`📅 Semana actual comienza: ${formattedWeekStart} (lunes)`)

        // Verificar si existe un planificador para esta semana
        const { data: plannerData, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('week_start', formattedWeekStart)
          .single()

        let plannerId = null

        if (plannerError || !plannerData) {
          console.log('📝 No hay planificador, creando uno nuevo...')

          try {
            // Crear nuevo planificador usando la función RPC
            const { data: plannerIdData, error: createError } = await supabase
              .rpc('generate_weekly_menu', {
                p_user_id: authStore.user.id,
                p_week_start: formattedWeekStart
              })

            if (createError) {
              console.error('Error al crear planificador con RPC:', createError)
              // Crear planificador manualmente
              const weekEnd = new Date(weekStart)
              weekEnd.setDate(weekStart.getDate() + 6)

              const { data: newPlanner, error: manualCreateError } = await supabase
                .from('weekly_planner')
                .insert({
                  user_id: authStore.user.id,
                  week_start: formattedWeekStart,
                  week_end: weekEnd.toISOString().split('T')[0],
                  preferences: { dietary: [] }
                })
                .select()
                .single()

              if (manualCreateError) {
                console.error('Error creación manual:', manualCreateError)
                throw manualCreateError
              }
              plannerId = newPlanner.id

              // Ahora crear comidas planificadas para hoy
              const mealsToInsert = [
                { day_of_week: dayOfWeek, meal_type: 'desayuno', recipe_id: 'aaaaaaaa-0000-0000-0000-000000000001' },
                { day_of_week: dayOfWeek, meal_type: 'almuerzo', recipe_id: 'aaaaaaaa-0000-0000-0000-000000000002' },
                { day_of_week: dayOfWeek, meal_type: 'cena', recipe_id: 'aaaaaaaa-0000-0000-0000-000000000003' }
              ]

              for (const meal of mealsToInsert) {
                const { error: mealError } = await supabase
                  .from('planned_meals')
                  .insert({
                    planner_id: plannerId,
                    day_of_week: meal.day_of_week,
                    meal_type: meal.meal_type,
                    recipe_id: meal.recipe_id
                  })

                if (mealError) {
                  console.error(`Error insertando ${meal.meal_type}:`, mealError)
                }
              }
            } else {
              plannerId = plannerIdData
              console.log('✅ Planificador creado con RPC:', plannerId)
            }
          } catch (error) {
            console.error('❌ Error en creación de planificador:', error)
            // Usar datos por defecto
            todayMeals.value = getDefaultMeals()
            return
          }
        } else {
          plannerId = plannerData.id
          console.log('✅ Planificador existente:', plannerId)
        }

        // Obtener comidas planificadas para hoy
        const { data: plannedMeals, error: mealsError } = await supabase
          .from('planned_meals')
          .select(`
        id,
        meal_type,
        day_of_week,
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
          .eq('day_of_week', dayOfWeek)
          .order('meal_type')

        if (mealsError) {
          console.error('Error al obtener comidas:', mealsError)
          // Usar datos por defecto si hay error
          todayMeals.value = getDefaultMeals()
        } else {
          console.log(`✅ Comidas encontradas: ${plannedMeals?.length || 0}`)

          if (plannedMeals && plannedMeals.length > 0) {
            todayMeals.value = plannedMeals.map(meal => ({
              id: meal.id,
              type: meal.meal_type,
              title: meal.recipe?.title || 'Receta no disponible',
              description: meal.recipe?.description || '',
              time: `${meal.recipe?.total_time || 15} min`,
              servings: `${meal.recipe?.servings || 2} porciones`,
              image: meal.recipe?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
              calories: meal.recipe?.calories_per_serving,
              recipeId: meal.recipe?.id
            }))
          } else {
            console.log('⚠️ No hay comidas planificadas para hoy, usando por defecto')
            todayMeals.value = getDefaultMeals()

            // Crear comidas por defecto en la base de datos
            const defaultMeals = getDefaultMeals()
            for (const meal of defaultMeals) {
              const { error: insertError } = await supabase
                .from('planned_meals')
                .insert({
                  planner_id: plannerId,
                  day_of_week: dayOfWeek,
                  meal_type: meal.type,
                  recipe_id: meal.recipeId
                })

              if (insertError) {
                console.error(`Error insertando ${meal.type}:`, insertError)
              }
            }
          }
        }

        console.log('✅ Comidas cargadas:', todayMeals.value.map(m => m.type))

      } catch (error) {
        console.error('❌ Error cargando comidas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las comidas del día')
        // Usar datos por defecto
        todayMeals.value = getDefaultMeals()
      } finally {
        loadingStates.meals = false
      }
    }

    // Función auxiliar para comidas por defecto
    const getDefaultMeals = () => {
      return [
        {
          id: '1',
          type: 'desayuno',
          title: 'Bowl de Avena con Frutas',
          time: '15 min',
          servings: '2 porciones',
          image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
          recipeId: 'aaaaaaaa-0000-0000-0000-000000000001'
        },
        {
          id: '2',
          type: 'almuerzo',
          title: 'Ensalada de Pollo a la Parrilla',
          time: '30 min',
          servings: '4 porciones',
          image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
          recipeId: 'aaaaaaaa-0000-0000-0000-000000000002'
        },
        {
          id: '3',
          type: 'cena',
          title: 'Pasta Primavera',
          time: '25 min',
          servings: '4 porciones',
          image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
          recipeId: 'aaaaaaaa-0000-0000-0000-000000000003'
        }
      ]
    }

    // 2. Load pantry items
    const loadPantryItems = async () => {
      try {
        loadingStates.pantry = true

        const { data, error } = await supabase
          .from('user_pantry')
          .select(`
            id,
            quantity,
            unit,
            expiry_date,
            ingredient:ingredients (
              id,
              name,
              category,
              image_url
            )
          `)
          .eq('user_id', authStore.user.id)
          .order('added_at', { ascending: false })

        if (error) {
          console.error('Error al cargar despensa:', error)
          pantryItems.value = []
          return
        }

        pantryItems.value = data.map(item => {
          const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null
          const today = new Date()
          let daysUntilExpiry = null
          let expiryBadge = 'safe'

          if (expiryDate) {
            daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

            if (daysUntilExpiry <= 0) expiryBadge = 'expired'
            else if (daysUntilExpiry <= 2) expiryBadge = 'danger'
            else if (daysUntilExpiry <= 5) expiryBadge = 'warning'
            else expiryBadge = 'safe'
          }

          return {
            id: item.id,
            name: item.ingredient?.name || 'Ingrediente desconocido',
            category: item.ingredient?.category || 'otros',
            image: item.ingredient?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
            quantity: `${item.quantity} ${item.unit}`,
            quantityValue: item.quantity,
            unit: item.unit,
            expiryDate: item.expiry_date,
            expiryBadge,
            daysUntilExpiry
          }
        })

      } catch (error) {
        console.error('❌ Error cargando despensa:', error)
        showNotification('error', 'Error', 'No se pudo cargar la despensa')
        pantryItems.value = []
      } finally {
        loadingStates.pantry = false
      }
    }

    // 3. Load recommended recipes
    const loadRecommendedRecipes = async () => {
      try {
        loadingStates.recipes = true

        // Primero intentar con la vista
        try {
          const { data, error } = await supabase
            .from('available_recipes_view')
            .select('*')
            .gte('match_percentage', 70)
            .order('match_percentage', { ascending: false })
            .limit(3)

          if (!error && data && data.length > 0) {
            const recipeIds = data.map(r => r.recipe_id)

            const { data: recipesData, error: recipesError } = await supabase
              .from('recipes')
              .select('*')
              .in('id', recipeIds)

            if (!recipesError && recipesData) {
              recommendedRecipes.value = recipesData.map(recipe => {
                const match = data.find(r => r.recipe_id === recipe.id)
                return {
                  id: recipe.id,
                  title: recipe.title,
                  image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120',
                  time: `${recipe.total_time} min`,
                  servings: `${recipe.servings} porciones`,
                  matchPercentage: match?.match_percentage || 0,
                  badge: match?.match_percentage > 90 ? 'Usa lo que tienes 🌿' : 'Recomendada'
                }
              })
              return
            }
          }
        } catch (viewError) {
          console.log('Vista no disponible, usando recetas por defecto')
        }

        // Si falla la vista, usar recetas por defecto
        const { data: defaultRecipes, error: defaultError } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_public', true)
          .order('rating', { ascending: false })
          .limit(2)

        if (!defaultError && defaultRecipes) {
          recommendedRecipes.value = defaultRecipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120',
            time: `${recipe.total_time} min`,
            servings: `${recipe.servings} porciones`,
            matchPercentage: 85,
            badge: 'Popular'
          }))
        }

      } catch (error) {
        console.error('❌ Error cargando recetas recomendadas:', error)
        recommendedRecipes.value = []
      } finally {
        loadingStates.recipes = false
      }
    }

    // 4. Load weather suggestion
    const loadWeatherSuggestion = async () => {
      try {
        loadingStates.weather = true

        // Verificar sugerencia reciente (últimas 24 horas)
        const twentyFourHoursAgo = new Date()
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

        const { data: existingSuggestion, error: existingError } = await supabase
          .from('weather_suggestions')
          .select(`
            *,
            recipe:recipes (
              id,
              title,
              image_url,
              total_time,
              servings
            )
          `)
          .eq('user_id', authStore.user.id)
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (!existingError && existingSuggestion) {
          weatherSuggestion.value = {
            temperature: existingSuggestion.temperature,
            condition: existingSuggestion.condition,
            suggestionText: existingSuggestion.suggestion_text,
            recipe: existingSuggestion.recipe
          }
          return
        }

        // Si no hay sugerencia reciente, usar datos por defecto
        const { data: soupRecipe, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', 'aaaaaaaa-0000-0000-0000-000000000005')
          .single()

        if (!recipeError && soupRecipe) {
          weatherSuggestion.value = {
            temperature: 18.5,
            condition: 'Parcialmente nublado',
            suggestionText: 'Hoy es un día perfecto para preparar Sopa de Verduras Nutritiva. El clima fresco pide algo caliente y reconfortante.',
            recipe: soupRecipe
          }
        } else {
          weatherSuggestion.value = {
            temperature: 18,
            condition: 'Parcialmente nublado',
            suggestionText: 'Hoy es un día perfecto para preparar una receta reconfortante. El clima fresco pide algo caliente.',
            recipe: {
              title: 'Sopa de Verduras Nutritiva',
              image_url: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'
            }
          }
        }

      } catch (error) {
        console.error('❌ Error cargando sugerencia de clima:', error)
        weatherSuggestion.value = {
          temperature: 18,
          condition: 'Parcialmente nublado',
          suggestionText: 'Hoy es un día perfecto para preparar una receta reconfortante.',
          recipe: {
            title: 'Receta sugerida',
            image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'
          }
        }
      } finally {
        loadingStates.weather = false
      }
    }

    // 5. Load notifications
    const loadNotifications = async () => {
      try {
        loadingStates.notifications = true

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', authStore.user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error al cargar notificaciones:', error)
          // Usar notificaciones por defecto
          notifications.value = [
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
          ]
          return
        }

        if (data && data.length > 0) {
          notifications.value = data.map(notif => ({
            id: notif.id,
            type: notif.type,
            icon: getNotificationIcon(notif.type),
            text: notif.message,
            time: formatTimeAgo(new Date(notif.created_at)),
            relatedId: notif.related_id,
            relatedType: notif.related_type
          }))
        } else {
          // Si no hay notificaciones en la base de datos, mostrar por defecto
          notifications.value = [
            {
              id: 1,
              type: 'alert',
              icon: 'mdi:alert-circle-outline',
              text: 'Bienvenido a Esencia Casera!',
              time: 'Recién'
            },
            {
              id: 2,
              type: 'recipe',
              icon: 'mdi:food',
              text: 'Agrega ingredientes a tu despensa para recibir recomendaciones',
              time: 'Recién'
            }
          ]
        }

      } catch (error) {
        console.error('❌ Error cargando notificaciones:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las notificaciones')
        notifications.value = []
      } finally {
        loadingStates.notifications = false
      }
    }

    // 6. Load all ingredients for search
    const loadAllIngredients = async () => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('id, name, category, image_url')
          .order('name')

        if (error) throw error

        allIngredients.value = data

      } catch (error) {
        console.error('❌ Error cargando ingredientes:', error)
        allIngredients.value = []
      }
    }

    // 7. Load all meals for change modal
    const loadAllMeals = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, category, total_time, servings, image_url')
          .eq('is_public', true)
          .order('title')

        if (error) throw error

        allMeals.value = data.map(meal => ({
          id: meal.id,
          type: meal.category,
          title: meal.title,
          time: `${meal.total_time} min`,
          servings: `${meal.servings} porciones`,
          image: meal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120'
        }))

      } catch (error) {
        console.error('❌ Error cargando todas las comidas:', error)
        allMeals.value = []
      }
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'expiry': return 'mdi:alert-circle-outline'
        case 'recipe': return 'mdi:food'
        case 'shopping': return 'mdi:cart'
        case 'family': return 'mdi:account-group'
        case 'weather': return 'mdi:weather-partly-cloudy'
        default: return 'mdi:information'
      }
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Hace un momento'
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
      if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`

      return date.toLocaleDateString('es-ES')
    }

    const getMealTypeText = (type) => {
      const typeMap = {
        'desayuno': 'Desayuno',
        'almuerzo': 'Almuerzo',
        'cena': 'Cena',
        'breakfast': 'Desayuno',
        'lunch': 'Almuerzo',
        'dinner': 'Cena'
      }
      return typeMap[type] || type
    }

    // ============================================
    // COMPUTED PROPERTIES
    // ============================================

    const filteredMeals = computed(() => {
      if (!currentMealType.value) return []

      const typeMap = {
        'breakfast': 'desayuno',
        'lunch': 'almuerzo',
        'dinner': 'cena'
      }

      const targetType = typeMap[currentMealType.value] || currentMealType.value

      return allMeals.value.filter(meal => meal.type === targetType)
    })

    const filteredIngredientList = computed(() => {
      if (!ingredientSearch.value) return allIngredients.value
      return allIngredients.value.filter(ingredient =>
        ingredient.name.toLowerCase().includes(ingredientSearch.value.toLowerCase())
      )
    })

    // ============================================
    // MODAL FUNCTIONS - CORREGIDAS
    // ============================================

    // Recipe Modal
    const openRecipeModal = async (recipeId) => {
      try {
        loadingStates.recipeModal = true

        console.log('🔍 Cargando receta ID:', recipeId)

        if (!recipeId || typeof recipeId !== 'string') {
          console.error('ID de receta inválido:', recipeId)
          showNotification('error', 'Error', 'ID de receta inválido')
          return
        }

        // 1. Cargar la receta básica
        console.log('📋 1. Cargando datos básicos de la receta...')
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single()

        if (recipeError) {
          console.error('❌ Error al cargar receta:', recipeError)
          currentRecipe.value = getDefaultRecipe()
          isFavorite.value = false
        } else {
          console.log('✅ Receta cargada:', recipeData.title)
          console.log('📊 Datos de receta:', {
            total_time: recipeData.total_time,
            servings: recipeData.servings,
            calories: recipeData.calories_per_serving,
            tags: recipeData.tags,
            rating: recipeData.rating
          })

          // 2. Cargar los ingredientes
          console.log('📋 2. Cargando ingredientes...')
          let ingredientsList = []
          try {
            const { data: ingredientsData, error: ingredientsError } = await supabase
              .from('recipe_ingredients')
              .select(`
            quantity,
            unit,
            ingredient:ingredients (
              name
            )
          `)
              .eq('recipe_id', recipeId)

            console.log('📊 Resultado de consulta de ingredientes:', {
              tieneError: !!ingredientsError,
              error: ingredientsError,
              cantidadDatos: ingredientsData?.length || 0,
              datos: ingredientsData
            })

            if (!ingredientsError && ingredientsData && ingredientsData.length > 0) {
              console.log('✅ Ingredientes encontrados:', ingredientsData.length)
              ingredientsList = ingredientsData.map(ri => ({
                name: ri.ingredient?.name || 'Ingrediente desconocido',
                quantity: `${ri.quantity} ${ri.unit}`
              }))
            } else {
              console.warn('⚠️ No se pudieron cargar ingredientes, usando por defecto')
              // Intentar consulta alternativa sin JOIN para debug
              const { data: simpleIngredients, error: simpleError } = await supabase
                .from('recipe_ingredients')
                .select('quantity, unit, ingredient_id')
                .eq('recipe_id', recipeId)

              console.log('🔍 Consulta simple de ingredientes:', {
                simpleError,
                simpleData: simpleIngredients
              })

              ingredientsList = getDefaultRecipe().ingredients
            }
          } catch (ingredientsError) {
            console.error('❌ Error cargando ingredientes:', ingredientsError)
            ingredientsList = getDefaultRecipe().ingredients
          }

          // 3. Verificar favoritos
          console.log('📋 3. Verificando favoritos...')
          try {
            const { data: favoriteData, error: favoriteError } = await supabase
              .from('favorites')
              .select('id')
              .eq('user_id', authStore.user.id)
              .eq('recipe_id', recipeId)
              .maybeSingle()

            if (favoriteError) {
              console.warn('⚠️ No se pudo verificar favoritos:', favoriteError.message)
              isFavorite.value = false
            } else {
              isFavorite.value = !!favoriteData
              console.log('✅ Estado favorito:', isFavorite.value)
            }
          } catch (favoriteCheckError) {
            console.warn('⚠️ Error verificando favoritos:', favoriteCheckError)
            isFavorite.value = false
          }

          // 4. Formatear receta para el modal
          console.log('📋 4. Formateando datos para el modal...')
          currentRecipe.value = {
            id: recipeData.id,
            title: recipeData.title,
            image: recipeData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
            badges: recipeData.tags || [],
            rating: recipeData.rating?.toString() || '4.5',
            time: `${recipeData.total_time || 15} min`,
            servings: `${recipeData.servings || 2} porciones`,
            calories: `${recipeData.calories_per_serving || 300} kcal`,
            ingredients: ingredientsList,
            steps: Array.isArray(recipeData.steps) ? recipeData.steps : []
          }

          console.log('✅ Receta formateada:', {
            title: currentRecipe.value.title,
            time: currentRecipe.value.time,
            servings: currentRecipe.value.servings,
            calories: currentRecipe.value.calories,
            ingredientesCount: currentRecipe.value.ingredients.length,
            ingredientes: currentRecipe.value.ingredients
          })
        }

        currentStep.value = 0
        showRecipeModal.value = true
        console.log('✅ Modal abierto exitosamente')

      } catch (error) {
        console.error('❌ Error cargando receta:', error)
        showNotification('error', 'Error', 'No se pudo cargar la receta')
        // Usar receta por defecto
        currentRecipe.value = getDefaultRecipe()
        isFavorite.value = false
        showRecipeModal.value = true
      } finally {
        loadingStates.recipeModal = false
      }
    }

    const getDefaultRecipe = () => {
      return {
        id: 'default',
        title: 'Bowl de Avena con Frutas',
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
        badges: ['Saludable', 'Rápido', 'Vegetariano'],
        rating: '4.9',
        time: '15 min',
        servings: '2 porciones',
        calories: '280 kcal',
        ingredients: [
          { name: 'Avena', quantity: '1 taza' },
          { name: 'Leche de almendras', quantity: '1½ tazas' },
          { name: 'Plátano', quantity: '1 unidad' },
          { name: 'Fresas', quantity: '½ taza' }
        ],
        steps: [
          {
            image_url: 'https://images.unsplash.com/photo-1622484206670-973a72bfc8a0?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'En una olla, mezcla la avena con la leche de almendras y cocina a fuego medio por 5 minutos, revolviendo constantemente.'
          },
          {
            image_url: 'https://images.unsplash.com/photo-1570196911694-76a7d48c8b23?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Mientras se cocina la avena, lava y corta las frutas: plátano en rodajas, fresas en cuartos.'
          },
          {
            image_url: 'https://images.unsplash.com/photo-1588347818036-ef26fd7a0f28?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Sirve la avena en dos bowls, decora con las frutas cortadas, arándanos, nueces y un chorrito de miel.'
          }
        ]
      }
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      currentRecipe.value = {}
    }

    const nextStep = () => {
      if (currentRecipe.value.steps && currentStep.value < currentRecipe.value.steps.length - 1) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const toggleFavorite = async () => {
      try {
        if (!currentRecipe.value.id) {
          showNotification('error', 'Error', 'No hay receta seleccionada')
          return
        }

        if (isFavorite.value) {
          // Eliminar de favoritos
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', authStore.user.id)
            .eq('recipe_id', currentRecipe.value.id)

          if (error) throw error

          isFavorite.value = false
          showNotification('success', 'Éxito', 'Receta eliminada de favoritos')
        } else {
          // Agregar a favoritos
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: authStore.user.id,
              recipe_id: currentRecipe.value.id
            })

          if (error) throw error

          isFavorite.value = true
          showNotification('success', 'Éxito', 'Receta agregada a favoritos')
        }
      } catch (error) {
        console.error('❌ Error actualizando favoritos:', error)
        showNotification('error', 'Error', 'No se pudo actualizar favoritos')
      }
    }

    const addToShoppingList = async () => {
      try {
        if (!currentRecipe.value.id || currentRecipe.value.id === 'default') {
          showNotification('warning', 'Advertencia', 'No se puede agregar una receta de ejemplo')
          return
        }

        // Obtener o crear lista de compras activa
        const { data: lists, error: listsError } = await supabase
          .from('shopping_lists')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('status', 'active')
          .limit(1)

        if (listsError) throw listsError

        let listId = null

        if (lists && lists.length > 0) {
          listId = lists[0].id
        } else {
          // Crear nueva lista de compras
          const { data: newList, error: createError } = await supabase
            .from('shopping_lists')
            .insert({
              user_id: authStore.user.id,
              name: 'Lista de Compras',
              status: 'active'
            })
            .select()
            .single()

          if (createError) throw createError
          listId = newList.id
        }

        // Obtener ingredientes de la receta
        const { data: ingredients, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(`
            ingredient_id,
            quantity,
            unit,
            ingredient:ingredients (name)
          `)
          .eq('recipe_id', currentRecipe.value.id)

        if (ingredientsError) throw ingredientsError

        // Agregar cada ingrediente a la lista de compras
        if (ingredients && ingredients.length > 0) {
          const itemsToAdd = ingredients.map(ingredient => ({
            list_id: listId,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: `Para receta: ${currentRecipe.value.title}`
          }))

          const { error: insertError } = await supabase
            .from('shopping_list_items')
            .insert(itemsToAdd)

          if (insertError) throw insertError

          showNotification('success', 'Éxito', 'Ingredientes agregados a la lista de compras')
        } else {
          showNotification('info', 'Información', 'Esta receta no tiene ingredientes registrados')
        }

      } catch (error) {
        console.error('❌ Error agregando a lista de compras:', error)
        showNotification('error', 'Error', 'No se pudieron agregar los ingredientes')
      }
    }

    // Change Meal Modal
    const openChangeMealModal = (mealType) => {
      currentMealType.value = mealType
      selectedMeal.value = null
      showChangeMealModal.value = true
    }

    const closeChangeMealModal = () => {
      showChangeMealModal.value = false
    }

    const selectMeal = (meal) => {
      selectedMeal.value = meal
    }

    const confirmMealChange = async () => {
      try {
        if (!selectedMeal.value) {
          showNotification('warning', 'Advertencia', 'Selecciona una comida primero')
          return
        }

        // Obtener día de la semana actual
        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7

        // Obtener semana actual (lunes)
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay() + 1)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        // Obtener planificador de esta semana
        const { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('week_start', formattedWeekStart)
          .single()

        if (plannerError) {
          console.error('Error obteniendo planificador:', plannerError)
          showNotification('error', 'Error', 'No se encontró el planificador semanal')
          return
        }

        // Mapear tipo de comida
        const typeMap = {
          'breakfast': 'desayuno',
          'lunch': 'almuerzo',
          'dinner': 'cena'
        }

        const targetType = typeMap[currentMealType.value] || currentMealType.value

        // Actualizar comida planificada usando upsert
        const { error: updateError } = await supabase
          .from('planned_meals')
          .upsert({
            planner_id: planner.id,
            day_of_week: dayOfWeek,
            meal_type: targetType,
            recipe_id: selectedMeal.value.id
          }, {
            onConflict: 'planner_id,day_of_week,meal_type'
          })

        if (updateError) throw updateError

        // Recargar comidas del día
        await loadTodayMeals()

        showNotification('success', 'Éxito', `Comida cambiada a: ${selectedMeal.value.title}`)
        closeChangeMealModal()

      } catch (error) {
        console.error('❌ Error cambiando comida:', error)
        showNotification('error', 'Error', 'No se pudo cambiar la comida')
      }
    }

    // Generate Menu Modal
    const openGenerateMenuModal = () => {
      showGenerateMenuModal.value = true
      menuPreferences.dietary = []
      generatedMenu.value = []
    }

    const closeGenerateMenuModal = () => {
      showGenerateMenuModal.value = false
    }

    const generateNewMenu = async () => {
      try {
        // Calcular inicio de la semana actual (lunes de esta semana)
        const today = new Date()

        // Obtener el lunes de esta semana
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)

        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        console.log('📅 Generando menú para la semana comenzando:', formattedWeekStart)

        // Generar menú usando la función RPC para ESTA semana
        const { data: plannerId, error } = await supabase
          .rpc('generate_weekly_menu', {
            p_user_id: authStore.user.id,
            p_week_start: formattedWeekStart,
            p_preferences: { dietary: menuPreferences.dietary }
          })

        if (error) {
          console.error('Error RPC:', error)
          throw error
        }

        console.log('✅ Menú generado, planner ID:', plannerId)

        if (!plannerId) {
          showNotification('warning', 'Advertencia', 'No se pudo generar el menú')
          return
        }

        // Obtener el día de hoy para mostrar previsualización
        const jsDayOfWeek = today.getDay()
        const dayOfWeek = (jsDayOfWeek + 6) % 7 // Convertir a nuestro sistema (0=lunes)

        // Cargar menú generado para previsualización (solo comidas de hoy)
        const { data: plannedMeals, error: mealsError } = await supabase
          .from('planned_meals')
          .select(`
        meal_type,
        recipe:recipes (
          title,
          image_url,
          total_time,
          servings
        )
      `)
          .eq('planner_id', plannerId)
          .eq('day_of_week', dayOfWeek) // Solo comidas de hoy
          .order('meal_type')

        if (mealsError) {
          console.error('Error cargando menú:', mealsError)
          // Usar datos de ejemplo si hay error
          generatedMenu.value = [
            {
              type: 'desayuno',
              title: 'Smoothie Bowl de Frutas Tropicales',
              time: '10 min',
              servings: '2 porciones',
              image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
            },
            {
              type: 'almuerzo',
              title: 'Quinoa con Vegetales Salteados',
              time: '25 min',
              servings: '4 porciones',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
            },
            {
              type: 'cena',
              title: 'Crema de Calabaza',
              time: '30 min',
              servings: '4 porciones',
              image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
            }
          ]
        } else {
          // Formatear las comidas generadas para hoy
          generatedMenu.value = plannedMeals.map(meal => ({
            type: meal.meal_type,
            title: meal.recipe?.title || 'Receta no disponible',
            time: `${meal.recipe?.total_time || 30} min`,
            servings: `${meal.recipe?.servings || 4} porciones`,
            image: meal.recipe?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
          }))

          console.log('✅ Comidas generadas para hoy:', generatedMenu.value)
        }

        showNotification('success', 'Éxito', 'Nuevo menú generado según tus preferencias')

      } catch (error) {
        console.error('❌ Error generando menú:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    const applyGeneratedMenu = async () => {
      try {
        // Obtener día de la semana actual
        const today = new Date()
        const jsDayOfWeek = today.getDay()
        const dayOfWeek = (jsDayOfWeek + 6) % 7 // Convertir a nuestro sistema (0=lunes)

        // Obtener semana actual (lunes)
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        console.log('📅 Aplicando menú para:', {
          fecha: today.toLocaleDateString(),
          diaSemana: dayOfWeek,
          semanaInicio: formattedWeekStart
        })

        // Obtener planificador de esta semana
        const { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('week_start', formattedWeekStart)
          .single()

        if (plannerError) {
          console.error('Error obteniendo planificador:', plannerError)
          showNotification('error', 'Error', 'No se encontró el planificador semanal')
          return
        }

        console.log('✅ Planificador encontrado:', planner.id)
        console.log('📋 Comidas generadas a aplicar:', generatedMenu.value)

        // Eliminar comidas existentes para hoy
        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', planner.id)
          .eq('day_of_week', dayOfWeek)

        if (deleteError) {
          console.error('Error eliminando comidas anteriores:', deleteError)
          showNotification('error', 'Error', 'No se pudieron eliminar las comidas anteriores')
          return
        }

        console.log('🗑️ Comidas anteriores eliminadas para hoy')

        // Preparar comidas a insertar
        const mealsToInsert = generatedMenu.value.map(meal => {
          // Obtener ID de receta por título (esto debería mejorarse)
          const recipeId = getRecipeIdByTitle(meal.title) || meal.recipeId

          return {
            planner_id: planner.id,
            day_of_week: dayOfWeek,
            meal_type: meal.type,
            recipe_id: recipeId || getDefaultRecipeIdForType(meal.type)
          }
        })

        console.log('📝 Comidas a insertar:', mealsToInsert)

        // Insertar nuevas comidas
        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert(mealsToInsert)

        if (insertError) {
          console.error('Error insertando nuevas comidas:', insertError)
          showNotification('error', 'Error', 'No se pudieron aplicar las nuevas comidas')
          return
        }

        console.log('✅ Nuevas comidas insertadas en la base de datos')

        // Recargar comidas del día para mostrar el nuevo menú
        await loadTodayMeals()

        showNotification('success', 'Éxito', 'Nuevo menú aplicado exitosamente')
        closeGenerateMenuModal()

      } catch (error) {
        console.error('❌ Error aplicando menú:', error)
        showNotification('error', 'Error', 'No se pudo aplicar el menú')
      }
    }

    // Función auxiliar para obtener ID de receta por título
    const getRecipeIdByTitle = (title) => {
      // Buscar en las recetas cargadas
      const recipe = allMeals.value.find(r => r.title === title)
      return recipe ? recipe.id : null
    }

    // Función auxiliar para obtener ID de receta por defecto según tipo
    const getDefaultRecipeIdForType = (type) => {
      const defaultMap = {
        'desayuno': 'aaaaaaaa-0000-0000-0000-000000000001',
        'almuerzo': 'aaaaaaaa-0000-0000-0000-000000000002',
        'cena': 'aaaaaaaa-0000-0000-0000-000000000003'
      }
      return defaultMap[type] || 'aaaaaaaa-0000-0000-0000-000000000001'
    }

    // Add Ingredient Modal
    const openAddIngredientModal = () => {
      ingredientSearch.value = ''
      showAddIngredientModal.value = true
    }

    const closeAddIngredientModal = () => {
      showAddIngredientModal.value = false
    }

    const filterIngredients = () => {
      // El filtrado se maneja en la propiedad computed
    }

    const selectIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      showAddIngredientModal.value = false
      showIngredientDetailsModal.value = true

      // Reiniciar formulario con valores por defecto del ingrediente
      newIngredientData.category = ingredient.category || 'verduras'
      newIngredientData.quantity = 1
      newIngredientData.unit = ingredient.default_unit || 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }

    // Ingredient Details Modal
    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
    }

    const addIngredientToPantry = async () => {
      try {
        if (!selectedIngredient.value.id) {
          showNotification('error', 'Error', 'Ingrediente no seleccionado')
          return
        }

        // Calcular fecha de vencimiento
        let expiryDate = null
        if (newIngredientData.expiryDays) {
          expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + parseInt(newIngredientData.expiryDays))
        }

        console.log('➕ Agregando a despensa:', {
          user_id: authStore.user.id,
          ingredient_id: selectedIngredient.value.id,
          quantity: newIngredientData.quantity,
          unit: newIngredientData.unit,
          expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null
        })

        // Usar función de base de datos para agregar a la despensa
        const { data, error } = await supabase
          .rpc('add_to_pantry', {
            p_user_id: authStore.user.id,
            p_ingredient_id: selectedIngredient.value.id,
            p_quantity: parseFloat(newIngredientData.quantity),
            p_unit: newIngredientData.unit,
            p_expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
            p_notes: newIngredientData.notes
          })

        if (error) {
          console.error('Error RPC:', error)
          // Intentar insertar directamente si falla la función RPC
          const { error: insertError } = await supabase
            .from('user_pantry')
            .insert({
              user_id: authStore.user.id,
              ingredient_id: selectedIngredient.value.id,
              quantity: parseFloat(newIngredientData.quantity),
              unit: newIngredientData.unit,
              expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
              notes: newIngredientData.notes
            })

          if (insertError) throw insertError
        }

        // Recargar despensa
        await loadPantryItems()

        showNotification('success', 'Éxito',
          `${selectedIngredient.value.name} agregado a la despensa`
        )

        closeIngredientDetailsModal()

      } catch (error) {
        console.error('❌ Error agregando ingrediente:', error)
        showNotification('error', 'Error', 'No se pudo agregar el ingrediente')
      }
    }

    // Weather Recipe Modal
    const openWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = true
    }

    const closeWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = false
    }

    // Pantry actions
    const decreaseQuantity = async (pantryItem) => {
      try {
        if (!pantryItem.id) {
          showNotification('error', 'Error', 'Ítem no válido')
          return
        }

        const newQuantity = Math.max(0, pantryItem.quantityValue - 1)

        const { error } = await supabase
          .from('user_pantry')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', pantryItem.id)

        if (error) throw error

        // Recargar despensa
        await loadPantryItems()

        showNotification('success', 'Éxito', `Cantidad disminuida de: ${pantryItem.name}`)

      } catch (error) {
        console.error('❌ Error disminuyendo cantidad:', error)
        showNotification('error', 'Error', 'No se pudo actualizar la cantidad')
      }
    }

    const increaseQuantity = async (pantryItem) => {
      try {
        if (!pantryItem.id) {
          showNotification('error', 'Error', 'Ítem no válido')
          return
        }

        const newQuantity = pantryItem.quantityValue + 1

        const { error } = await supabase
          .from('user_pantry')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', pantryItem.id)

        if (error) throw error

        // Recargar despensa
        await loadPantryItems()

        showNotification('success', 'Éxito', `Cantidad aumentada de: ${pantryItem.name}`)

      } catch (error) {
        console.error('❌ Error aumentando cantidad:', error)
        showNotification('error', 'Error', 'No se pudo actualizar la cantidad')
      }
    }

    const removeIngredient = async (pantryItem) => {
      try {
        if (!pantryItem.id) {
          showNotification('error', 'Error', 'Ítem no válido')
          return
        }

        const { error } = await supabase
          .from('user_pantry')
          .delete()
          .eq('id', pantryItem.id)

        if (error) throw error

        // Recargar despensa
        await loadPantryItems()

        showNotification('success', 'Éxito', `${pantryItem.name} eliminado de la despensa`)

      } catch (error) {
        console.error('❌ Error eliminando ingrediente:', error)
        showNotification('error', 'Error', 'No se pudo eliminar el ingrediente')
      }
    }

    // Original methods
    const goToRecipes = () => {
      router.push('/recetas')
    }

    const handleNotification = async (notification) => {
      try {
        // Marcar como leída si tiene ID de base de datos
        if (notification.id && typeof notification.id === 'string' && notification.id.includes('-')) {
          await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', notification.id)

          // Recargar notificaciones
          await loadNotifications()
        }

        // Manejar según tipo
        switch (notification.type) {
          case 'expiry':
            showNotification('info', 'Ingrediente próximo a vencer', notification.text)
            break
          case 'recipe':
            if (notification.relatedId) {
              await openRecipeModal(notification.relatedId)
            } else {
              showNotification('info', 'Nueva receta', notification.text)
            }
            break
          case 'shopping':
            router.push('/lista-compras')
            break
          case 'family':
            router.push('/familiar')
            break
          case 'weather':
            openWeatherRecipeModal()
            break
          default:
            showNotification('info', 'Notificación', notification.text)
        }

      } catch (error) {
        console.error('❌ Error manejando notificación:', error)
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
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('❌ Error cerrando sesión:', error)
        showNotification('error', 'Error', 'No se pudo cerrar sesión')
      }
    }

    // Initialize data on mount
    onMounted(async () => {
      if (authStore.isAuthenticated) {
        console.log('🚀 Inicializando datos del HomeView...')

        // Cargar datos en paralelo
        await Promise.all([
          loadTodayMeals(),
          loadPantryItems(),
          loadRecommendedRecipes(),
          loadWeatherSuggestion(),
          loadNotifications(),
          loadAllIngredients(),
          loadAllMeals()
        ])

        console.log('✅ Todos los datos cargados')
      }
    })

    return {
      isMobileMenuOpen,
      notifications,
      pantryItems,
      todayMeals,
      recommendedRecipes,
      weatherSuggestion,

      // Modal states
      showRecipeModal,
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showWeatherRecipeModal,

      // Toast
      showToast,
      toastType,
      toastTitle,
      toastMessage,

      // Current states
      currentRecipe,
      currentMealType,
      currentStep,
      isFavorite,
      selectedMeal,
      ingredientSearch,
      selectedIngredient,

      // Data
      menuPreferences,
      generatedMenu,
      filteredMeals,
      filteredIngredientList,
      newIngredientData,

      // Loading states
      loadingStates,

      // Methods
      openRecipeModal,
      closeRecipeModal,
      nextStep,
      prevStep,
      toggleFavorite,
      addToShoppingList,

      openChangeMealModal,
      closeChangeMealModal,
      selectMeal,
      confirmMealChange,

      openGenerateMenuModal,
      closeGenerateMenuModal,
      generateNewMenu,
      applyGeneratedMenu,

      openAddIngredientModal,
      closeAddIngredientModal,
      filterIngredients,
      selectIngredient,

      closeIngredientDetailsModal,
      addIngredientToPantry,

      openWeatherRecipeModal,
      closeWeatherRecipeModal,

      decreaseQuantity,
      increaseQuantity,
      removeIngredient,

      goToRecipes,
      handleNotification,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      getMealTypeText,



      toastIcon,
    }
  }
}
</script>

<style scoped>
/* Solo agregamos estilos para toast y loading states */

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  min-width: 300px;
  animation: slideInRight 0.3s ease;
  backdrop-filter: blur(10px);
}

.toast-notification.success {
  background: linear-gradient(135deg, #5DA271 0%, #4a8a5c 100%);
  color: white;
  border-left: 4px solid #3a6a48;
}

.toast-notification.error {
  background: linear-gradient(135deg, #D4183D 0%, #b31534 100%);
  color: white;
  border-left: 4px solid #911129;
}

.toast-notification.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-left: 4px solid #b45309;
}

.toast-notification.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-left: 4px solid #1d4ed8;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  margin-top: 0;
}

.toast-message {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
  white-space: pre-line;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: auto;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.toast-close .iconify {
  width: 16px;
  height: 16px;
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Loading States */
.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--muted-foreground);
  grid-column: 1 / -1;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #5DA271;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: var(--muted-foreground);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--muted-foreground);
  grid-column: 1 / -1;
}

.empty-state .iconify {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-menu {
  text-align: center;
  padding: 2rem;
  color: var(--muted-foreground);
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toast-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}

/* EL RESTO DEL CSS ORIGINAL PERMANECE EXACTAMENTE IGUAL */

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

/* Weather Suggestion */
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

.weather-stats .stat-item {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.weather-stats .stat-label {
  display: block;
  font-size: 0.625rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.weather-stats .stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-foreground);
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

/* MODAL STYLES */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
}

.modal-close .iconify {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--foreground);
}

/* Recipe Modal */
.recipe-modal {
  max-width: 900px;
}

.recipe-modal-image {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.recipe-modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 2rem;
  color: white;
}

.recipe-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.recipe-badge-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.recipe-title-overlay h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.recipe-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.rating-stars {
  color: #ffd700;
}

.recipe-modal-details {
  padding: 2rem;
}

.recipe-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: rgba(168, 213, 186, 0.1);
  padding: 1rem;
  border-radius: 1rem;
}

.stat-box {
  text-align: center;
  padding: 0.5rem;
}

.stat-box .iconify {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-top: 0.25rem;
}

.recipe-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.favorite-btn:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
  color: var(--destructive);
}

.shopping-btn:hover {
  background-color: rgba(93, 162, 113, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.recipe-section {
  margin-bottom: 2rem;
}

.recipe-section .section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: rgba(168, 213, 186, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.ingredient-name {
  font-weight: 500;
}

.ingredient-quantity {
  color: var(--primary);
  font-weight: 600;
}

.instructions-container {
  background-color: rgba(168, 213, 186, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
}

.step-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.step-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-btn:not(:disabled):hover {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.step-indicator {
  font-weight: 600;
  color: var(--foreground);
}

.step-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.step-image {
  border-radius: 0.75rem;
  overflow: hidden;
  height: 250px;
}

.step-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.step-description h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.step-description p {
  line-height: 1.6;
  color: var(--muted-foreground);
}

/* Change Meal Modal */
.change-meal-modal {
  max-width: 800px;
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.meal-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.meal-option {
  background-color: white;
  border-radius: 0.75rem;
  border: 2px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.meal-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.meal-option.selected {
  border-color: var(--primary);
  background-color: rgba(93, 162, 113, 0.1);
}

.meal-option-image {
  position: relative;
  height: 120px;
}

.meal-option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-option-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.meal-option-content {
  padding: 1rem;
}

.meal-option-content h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.meal-option-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

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
}

.generate-btn:hover {
  background-color: #7c3aed;
}

/* Generate Menu Modal */
.generate-menu-modal {
  max-width: 800px;
  padding: 2rem;
}

.preferences-section {
  margin-bottom: 2rem;
}

.preferences-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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

.generated-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 1rem;
}

.generated-meal {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  height: auto;
}

.generated-meal-header {
  background-color: rgba(93, 162, 113, 0.1);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.generated-meal-header h4 {
  font-weight: 600;
  color: var(--primary);
}

.generated-meal-content {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
}

.generated-meal-content img {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.generated-meal-info {
  flex: 1;
}

.generated-meal-info h5 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.generated-meal-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

/* Add Ingredient Modal */
.add-ingredient-modal {
  max-width: 800px;
  padding: 2rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input .iconify {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--muted-foreground);
}

.search-input input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.ingredient-option {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.ingredient-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.ingredient-option-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.ingredient-option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ingredient-option-name {
  font-weight: 500;
  text-align: center;
}

.ingredient-add-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: var(--primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.ingredient-add-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: scale(1.1);
}

/* Ingredient Details Modal */
.ingredient-details-modal {
  max-width: 500px;
  padding: 2rem;
}

.ingredient-image-large {
  width: 100%;
  height: 200px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.ingredient-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ingredient-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--foreground);
}

.form-select,
.form-input,
.form-textarea {
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.quantity-input-group {
  display: flex;
  gap: 0.5rem;
}

.quantity-input-group .form-input {
  flex: 1;
}

.quantity-input-group .form-select {
  width: 120px;
}

.expiry-input {
  position: relative;
  display: flex;
  align-items: center;
}

.expiry-input .form-input {
  flex: 1;
  padding-right: 4rem;
}

.expiry-label {
  position: absolute;
  right: 0.75rem;
  color: var(--muted-foreground);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Weather Recipe Modal */
.weather-recipe-modal {
  max-width: 600px;
  padding: 2rem;
}

.weather-recipe-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.weather-icon-container-large {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #a8d5ba 0%, #8bb174 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon-large {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.weather-recipe-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.weather-recipe-subtitle {
  color: var(--muted-foreground);
}

.weather-recipe-content {
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.weather-recipe-image {
  position: relative;
  height: 200px;
}

.weather-recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.weather-recipe-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  color: var(--primary);
}

.weather-recipe-info {
  padding: 1.5rem;
}

.weather-recipe-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.weather-recipe-desc {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.weather-recipe-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.weather-recipe-stats .stat-box {
  text-align: center;
}

.weather-recipe-stats .iconify {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.weather-recipe-stats .stat-value {
  font-size: 1rem;
  font-weight: 600;
}

.cook-btn {
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cook-btn:hover {
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

  /* Modal responsive */
  .modal-content {
    margin: 1rem;
    max-height: 85vh;
  }

  .recipe-modal {
    padding: 0;
  }

  .recipe-modal-image {
    height: 200px;
  }

  .recipe-title-overlay h2 {
    font-size: 1.5rem;
  }

  .recipe-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .recipe-actions {
    grid-template-columns: 1fr;
  }

  .step-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .step-image {
    height: 200px;
  }

  .meal-options-grid {
    grid-template-columns: 1fr;
  }

  .preferences-grid {
    grid-template-columns: 1fr;
  }

  .ingredients-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
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
