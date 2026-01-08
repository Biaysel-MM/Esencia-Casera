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
            <section class="section-card">
              <div class="section-header">
                <h2 class="section-title">Comidas del día</h2>
                <div class="date-selector">
                  <button @click="previousDay" class="date-nav-btn">
                    <span class="iconify" data-icon="mdi:chevron-left"></span>
                  </button>
                  <span class="current-date">{{ formatDate(selectedDate) }}</span>
                  <button @click="nextDay" class="date-nav-btn">
                    <span class="iconify" data-icon="mdi:chevron-right"></span>
                  </button>
                  <button @click="goToToday" class="today-btn">Hoy</button>
                </div>
                <button class="generate-menu-btn" @click="openGenerateMenuModal">
                  <span class="iconify" data-icon="mdi:sparkles"></span>
                  Generar nuevo menú
                </button>
              </div>

              <div v-if="loadingDailyMenu" class="loading-state">
                <span class="iconify loading-icon" data-icon="mdi:loading"></span>
                Cargando menú del día...
              </div>

              <div v-else class="meals-grid">
                <!-- Breakfast -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img :src="dailyMenu.breakfast?.image_url || 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="dailyMenu.breakfast?.title || 'Desayuno'">
                    <div class="meal-emoji">🌅</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Desayuno</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{ dailyMenu.breakfast?.title || 'No asignado' }}</h3>
                    <div v-if="dailyMenu.breakfast" class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{ dailyMenu.breakfast.prep_time + dailyMenu.breakfast.cook_time }} min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{ dailyMenu.breakfast.servings }} porciones</span>
                      </div>
                    </div>
                    <div v-else class="no-recipe">
                      <p>No hay receta asignada</p>
                    </div>
                    <div class="meal-actions">
                      <button v-if="dailyMenu.breakfast" class="cook-btn" @click="openRecipeModal(dailyMenu.breakfast)">
                        Cocinar
                      </button>
                      <button v-else class="cook-btn disabled" disabled>No asignado</button>
                      <button class="change-btn" @click="openChangeMealModal('breakfast')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Lunch -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img :src="dailyMenu.lunch?.image_url || 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="dailyMenu.lunch?.title || 'Almuerzo'">
                    <div class="meal-emoji">🍽️</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Almuerzo</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{ dailyMenu.lunch?.title || 'No asignado' }}</h3>
                    <div v-if="dailyMenu.lunch" class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{ dailyMenu.lunch.prep_time + dailyMenu.lunch.cook_time }} min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{ dailyMenu.lunch.servings }} porciones</span>
                      </div>
                    </div>
                    <div v-else class="no-recipe">
                      <p>No hay receta asignada</p>
                    </div>
                    <div class="meal-actions">
                      <button v-if="dailyMenu.lunch" class="cook-btn" @click="openRecipeModal(dailyMenu.lunch)">
                        Cocinar
                      </button>
                      <button v-else class="cook-btn disabled" disabled>No asignado</button>
                      <button class="change-btn" @click="openChangeMealModal('lunch')">Cambiar</button>
                    </div>
                  </div>
                </div>

                <!-- Dinner -->
                <div class="meal-card">
                  <div class="meal-image">
                    <img :src="dailyMenu.dinner?.image_url || 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=160'"
                      :alt="dailyMenu.dinner?.title || 'Cena'">
                    <div class="meal-emoji">🌙</div>
                    <div class="meal-gradient"></div>
                    <div class="meal-label">
                      <h4>Cena</h4>
                    </div>
                  </div>
                  <div class="meal-content">
                    <h3>{{ dailyMenu.dinner?.title || 'No asignado' }}</h3>
                    <div v-if="dailyMenu.dinner" class="meal-details">
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:clock-outline"></span>
                        <span>{{ dailyMenu.dinner.prep_time + dailyMenu.dinner.cook_time }} min</span>
                      </div>
                      <div class="detail-item">
                        <span class="iconify" data-icon="mdi:account-group-outline"></span>
                        <span>{{ dailyMenu.dinner.servings }} porciones</span>
                      </div>
                    </div>
                    <div v-else class="no-recipe">
                      <p>No hay receta asignada</p>
                    </div>
                    <div class="meal-actions">
                      <button v-if="dailyMenu.dinner" class="cook-btn" @click="openRecipeModal(dailyMenu.dinner)">
                        Cocinar
                      </button>
                      <button v-else class="cook-btn disabled" disabled>No asignado</button>
                      <button class="change-btn" @click="openChangeMealModal('dinner')">Cambiar</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

  <!-- My Pantry - CORREGIDO -->
  <section class="section-card bg-white-card">
    <div class="section-header">
      <h2 class="section-title">Mi Despensa</h2>
      <div class="pantry-stats">
        <span class="stat-item">{{ pantryItems.length }} ingredientes</span>
        <span v-if="expiringSoonCount > 0" class="stat-item warning">
          {{ expiringSoonCount }} próximos a vencer
        </span>
      </div>
      <button class="add-ingredient-btn" @click="openAddIngredientModal">
        <span class="iconify" data-icon="mdi:plus"></span>
        Agregar ingrediente
      </button>
    </div>

    <div v-if="loadingPantry" class="loading-state">
      <span class="iconify loading-icon" data-icon="mdi:loading"></span>
      Cargando despensa...
    </div>

    <div v-else-if="pantryItems.length === 0" class="empty-state">
      <span class="iconify empty-icon" data-icon="mdi:fridge-outline"></span>
      <p>Tu despensa está vacía</p>
      <button class="empty-state-btn" @click="openAddIngredientModal">
        Agregar tu primer ingrediente
      </button>
    </div>

    <div v-else class="pantry-grid">
      <div v-for="item in pantryItems.slice(0, 4)" :key="item.id" class="pantry-item">
        <div class="pantry-image">
          <img :src="item.image_url || getIngredientImage(item.name)" :alt="item.name">
          <div :class="['expiry-badge', getExpiryBadgeClass(item)]">
            {{ getExpiryText(item) }}
          </div>
        </div>
        <div class="pantry-info">
          <h4>{{ item.name }}</h4>
          <p class="pantry-quantity">{{ item.quantity }} {{ item.unit }}</p>
          <p class="pantry-category">{{ formatCategory(item.category) }}</p>
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
      
      <!-- Ver más si hay más de 4 ingredientes -->
      <div v-if="pantryItems.length > 4" class="pantry-more" @click="goToPantry">
        <div class="pantry-more-content">
          <span class="iconify" data-icon="mdi:plus-circle-outline"></span>
          <p>Ver {{ pantryItems.length - 4 }} más</p>
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

                <div v-if="loadingRecommended" class="loading-state">
                  <span class="iconify loading-icon" data-icon="mdi:loading"></span>
                  Buscando recetas recomendadas...
                </div>

                <div v-else class="recipes-grid">
                  <div v-for="recipe in recommendedRecipes" :key="recipe.id" class="recipe-card" @click="openRecipeModal(recipe)">
                    <div class="recipe-image">
                      <img :src="recipe.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120'"
                        :alt="recipe.title">
                      <div class="recipe-badge">
                        <span v-if="recipe.is_vegetarian">🌿 Vegetariano</span>
                        <span v-else-if="recipe.is_healthy">🥗 Saludable</span>
                        <span v-else-if="recipe.is_quick">⚡ Rápido</span>
                      </div>
                    </div>
                    <div class="recipe-content">
                      <h4>{{ recipe.title }}</h4>
                      <div class="recipe-details">
                        <span>⏱️ {{ recipe.prep_time + recipe.cook_time }} min</span>
                        <span>👥 {{ recipe.servings }} porciones</span>
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
                      <p class="weather-subtitle">{{ weather.temp }}°C - {{ weather.condition }}</p>
                    </div>
                  </div>
                  <div class="weather-content">
                    <p class="weather-desc">
                      <span class="iconify" data-icon="mdi:lightbulb-on-outline"></span>
                      {{ weather.suggestion }}
                    </p>
                    <div class="weather-stats">
                      <div class="stat-item">
                        <span class="stat-label">Temperatura</span>
                        <span class="stat-value">{{ weather.temp }}°C</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Humedad</span>
                        <span class="stat-value">{{ weather.humidity }}%</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Viento</span>
                        <span class="stat-value">{{ weather.wind }} km/h</span>
                      </div>
                    </div>
                    <button v-if="weather.recipe" class="weather-recipe-btn" @click="openRecipeModal(weather.recipe)">
                      <span class="iconify" data-icon="mdi:food"></span>
                      Ir a receta sugerida
                    </button>
                  </div>
                </section>

                <!-- Notifications -->
                <section class="notifications-section">
                  <div class="notifications-header">
                    <h3>Notificaciones</h3>
                    <span class="notifications-badge">{{ unreadNotificationsCount }}</span>
                  </div>
                  
                  <div v-if="loadingNotifications" class="loading-state">
                    <span class="iconify loading-icon" data-icon="mdi:loading"></span>
                    Cargando...
                  </div>
                  
                  <div v-else-if="notifications.length === 0" class="empty-state">
                    <p>No hay notificaciones</p>
                  </div>
                  
                  <div v-else class="notifications-list">
                    <div 
                      v-for="notification in notifications.slice(0, 3)" 
                      :key="notification.id"
                      class="notification-item"
                      :class="{ 'unread': !notification.is_read }"
                      @click="handleNotification(notification)"
                    >
                      <div class="notification-icon" :class="notification.type">
                        <span class="iconify" :data-icon="notification.icon || getNotificationIcon(notification.type)"></span>
                      </div>
                      <div class="notification-content">
                        <p class="notification-text">{{ notification.title }}</p>
                        <p class="notification-time">{{ formatTimeAgo(notification.created_at) }}</p>
                      </div>
                      <button v-if="!notification.is_read" class="mark-read-btn" @click.stop="markAsRead(notification)">
                        <span class="iconify" data-icon="mdi:check"></span>
                      </button>
                    </div>
                  </div>
                  
                  <button v-if="notifications.length > 3" class="view-all-notifications" @click="goToNotifications">
                    Ver todas las notificaciones
                    <span class="iconify" data-icon="mdi:chevron-right"></span>
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODALS -->
    
    <!-- Recipe Modal -->
    <div v-if="showRecipeModal" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content recipe-modal" @click.stop>
        <button class="modal-close" @click="closeRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <div class="recipe-modal-image">
          <img :src="currentRecipe.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'" 
               :alt="currentRecipe.title">
          <div class="recipe-image-overlay">
            <div class="recipe-badges">
              <span v-if="currentRecipe.is_vegetarian" class="recipe-badge-item">Vegetariano</span>
              <span v-if="currentRecipe.is_healthy" class="recipe-badge-item">Saludable</span>
              <span v-if="currentRecipe.is_quick" class="recipe-badge-item">Rápido</span>
              <span class="recipe-badge-item">{{ currentRecipe.difficulty === 'easy' ? 'Fácil' : currentRecipe.difficulty === 'medium' ? 'Medio' : 'Difícil' }}</span>
            </div>
            <div class="recipe-title-overlay">
              <h2>{{ currentRecipe.title }}</h2>
              <div class="recipe-rating">
                <span class="rating-stars">★★★★★</span>
                <span class="rating-value">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div class="recipe-modal-details">
          <div class="recipe-stats">
            <div class="stat-box">
              <span class="iconify" data-icon="mdi:clock-outline"></span>
              <span class="stat-value">{{ currentRecipe.prep_time + currentRecipe.cook_time }} min</span>
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
            <div v-if="loadingRecipeDetails" class="loading-state">
              Cargando ingredientes...
            </div>
            <div v-else class="ingredients-list">
              <div v-for="ingredient in currentRecipeIngredients" :key="ingredient.id" class="ingredient-item">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-quantity">{{ ingredient.quantity }} {{ ingredient.unit }}</span>
              </div>
            </div>
          </div>

          <div class="recipe-section">
            <h3 class="section-title">
              <span class="iconify" data-icon="mdi:book-open-page-variant"></span>
              Instrucciones paso a paso
            </h3>
            <div v-if="loadingRecipeDetails" class="loading-state">
              Cargando instrucciones...
            </div>
            <div v-else class="instructions-container">
              <div class="step-navigation">
                <button class="step-btn" @click="prevStep" :disabled="currentStep === 0">
                  <span class="iconify" data-icon="mdi:chevron-left"></span>
                  Anterior
                </button>
                <div class="step-indicator">Paso {{ currentStep + 1 }} de {{ currentRecipeSteps.length }}</div>
                <button class="step-btn" @click="nextStep" :disabled="currentStep === currentRecipeSteps.length - 1">
                  Siguiente
                  <span class="iconify" data-icon="mdi:chevron-right"></span>
                </button>
              </div>
              
              <div class="step-content">
                <div class="step-image">
                  <img :src="currentRecipeSteps[currentStep]?.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400'" 
                       :alt="'Paso ' + (currentStep + 1)">
                </div>
                <div class="step-description">
                  <h4>Paso {{ currentStep + 1 }}</h4>
                  <p>{{ currentRecipeSteps[currentStep]?.description || 'Descripción no disponible' }}</p>
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
        
        <h2 class="modal-title">Cambiar {{ currentMealType === 'breakfast' ? 'Desayuno' : currentMealType === 'lunch' ? 'Almuerzo' : 'Cena' }}</h2>
        
        <div class="search-section">
          <div class="search-input">
            <span class="iconify" data-icon="mdi:magnify"></span>
            <input 
              type="text" 
              v-model="mealSearch" 
              placeholder="Buscar receta..."
              @input="filterMealOptions"
            >
          </div>
        </div>
        
        <div v-if="loadingMealOptions" class="loading-state">
          <span class="iconify loading-icon" data-icon="mdi:loading"></span>
          Cargando opciones...
        </div>
        
        <div v-else class="meal-options-grid">
          <div 
            v-for="meal in filteredMealOptions" 
            :key="meal.id" 
            class="meal-option"
            :class="{ 'selected': selectedMeal?.id === meal.id }"
            @click="selectMeal(meal)"
          >
            <div class="meal-option-image">
              <img :src="meal.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'" 
                   :alt="meal.title">
              <div class="meal-option-badge">{{ formatCategory(meal.category) }}</div>
            </div>
            <div class="meal-option-content">
              <h4>{{ meal.title }}</h4>
              <div class="meal-option-details">
                <span>⏱️ {{ meal.prep_time + meal.cook_time }} min</span>
                <span>👥 {{ meal.servings }} porciones</span>
              </div>
              <div class="meal-option-tags">
                <span v-if="meal.is_vegetarian" class="tag vegetarian">🌿 Veg</span>
                <span v-if="meal.is_healthy" class="tag healthy">🥗 Salud</span>
                <span v-if="meal.is_quick" class="tag quick">⚡ Ráp</span>
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
                <input type="checkbox" v-model="menuPreferences.vegetarian">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Vegetariano</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.healthy">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Saludable</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.quick">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Rápido</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="menuPreferences.usePantry">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Usar ingredientes disponibles</span>
              </label>
            </div>
          </div>
        </div>

        <div class="generated-menu">
          <div v-if="generatedMenu.length === 0" class="empty-state">
            <p>Selecciona preferencias y genera un menú</p>
          </div>
          <div v-else>
            <div class="generated-meal" v-for="meal in generatedMenu" :key="meal.type">
              <div class="generated-meal-header">
                <h4>{{ formatMealType(meal.type) }}</h4>
              </div>
              <div class="generated-meal-content">
                <img :src="meal.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w-400&h=200'" 
                     :alt="meal.title">
                <div class="generated-meal-info">
                  <h5>{{ meal.title }}</h5>
                  <div class="generated-meal-details">
                    <span>⏱️ {{ meal.prep_time + meal.cook_time }} min</span>
                    <span>👥 {{ meal.servings }} porciones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeGenerateMenuModal">Cancelar</button>
          <button class="modal-btn generate-btn" @click="generateNewMenu">
            <span class="iconify" data-icon="mdi:sparkles"></span>
            Generar Menú
          </button>
          <button class="modal-btn confirm-btn" @click="applyGeneratedMenu" :disabled="generatedMenu.length === 0">
            Aplicar Menú
          </button>
        </div>
      </div>
    </div>

    <!-- Add Ingredient Modal -->

  <!-- Add Ingredient Modal - CORREGIDO (con el diseño anterior) -->
  <div v-if="showAddIngredientModal" class="modal-overlay" @click="closeAddIngredientModal">
    <div class="modal-content add-ingredient-modal" @click.stop>
      <button class="modal-close" @click="closeAddIngredientModal">
        <span class="iconify" data-icon="mdi:close"></span>
      </button>
      
      <h2 class="modal-title">Agregar Ingrediente</h2>
      
      <div class="search-section">
        <div class="search-input">
          <span class="iconify" data-icon="mdi:magnify"></span>
          <input 
            type="text" 
            v-model="ingredientSearch" 
            placeholder="Buscar ingrediente..."
            @input="filterIngredientOptions"
          >
        </div>
      </div>

      <div v-if="loadingIngredientOptions" class="loading-state">
        <span class="iconify loading-icon" data-icon="mdi:loading"></span>
        Cargando ingredientes...
      </div>

      <div v-else class="ingredients-grid">
        <!-- Ingredientes comunes predefinidos -->
        <div 
          v-for="ingredient in popularIngredients" 
          :key="ingredient.id"
          class="ingredient-option"
          @click="selectCommonIngredient(ingredient)"
        >
          <div class="ingredient-option-image">
            <img :src="ingredient.image_url" :alt="ingredient.name">
          </div>
          <div class="ingredient-option-name">{{ ingredient.name }}</div>
          <button class="ingredient-add-btn">
            <span class="iconify" data-icon="mdi:plus"></span>
          </button>
        </div>
        
        <!-- Ingredientes filtrados de la base de datos -->
        <div 
          v-for="ingredient in filteredIngredientOptions" 
          :key="'db-' + ingredient.name"
          class="ingredient-option"
          @click="selectIngredient(ingredient)"
        >
          <div class="ingredient-option-image">
            <img :src="ingredient.image_url || getIngredientImage(ingredient.name)" 
                 :alt="ingredient.name">
          </div>
          <div class="ingredient-option-name">{{ ingredient.name }}</div>
          <div class="ingredient-option-category">{{ formatCategory(ingredient.category) }}</div>
          <button class="ingredient-add-btn">
            <span class="iconify" data-icon="mdi:plus"></span>
          </button>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="modal-btn cancel-btn" @click="closeAddIngredientModal">Cancelar</button>
        <button class="modal-btn add-custom-btn" @click="openCustomIngredientModal">
          <span class="iconify" data-icon="mdi:plus-circle"></span>
          Agregar personalizado
        </button>
      </div>
    </div>
  </div>

    <!-- Ingredient Details Modal -->

  <!-- Ingredient Details Modal - CORREGIDO -->
  <div v-if="showIngredientDetailsModal" class="modal-overlay" @click="closeIngredientDetailsModal">
    <div class="modal-content ingredient-details-modal" @click.stop>
      <button class="modal-close" @click="closeIngredientDetailsModal">
        <span class="iconify" data-icon="mdi:close"></span>
      </button>
      
      <h2 class="modal-title">{{ selectedIngredient.name }}</h2>
      
      <div class="ingredient-image-large">
        <img :src="selectedIngredient.image_url || getIngredientImage(selectedIngredient.name)" 
             :alt="selectedIngredient.name">
      </div>

      <div class="ingredient-form">
        <div class="form-group">
          <label>Categoría *</label>
          <select v-model="newIngredientData.category" class="form-select" required>
            <option value="verduras">Verduras</option>
            <option value="frutas">Frutas</option>
            <option value="proteinas">Proteínas</option>
            <option value="granos">Granos</option>
            <option value="lacteos">Lácteos</option>
            <option value="condimentos">Condimentos</option>
            <option value="especias">Especias</option>
            <option value="aceites">Aceites</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div class="form-group">
          <label>Cantidad *</label>
          <div class="quantity-input-group">
            <input 
              type="number" 
              v-model="newIngredientData.quantity" 
              min="0.1" 
              step="0.1"
              class="form-input"
              required
            >
            <select v-model="newIngredientData.unit" class="form-select" required>
              <option value="">Seleccionar unidad</option>
              <option value="unidades">Unidades</option>
              <option value="gramos">Gramos</option>
              <option value="kg">Kilogramos</option>
              <option value="ml">Mililitros</option>
              <option value="litros">Litros</option>
              <option value="tazas">Tazas</option>
              <option value="cucharadas">Cucharadas</option>
              <option value="cucharaditas">Cucharaditas</option>
              <option value="pizcas">Pizcas</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Fecha de vencimiento (opcional)</label>
          <div class="expiry-input">
            <input 
              type="date" 
              v-model="newIngredientData.expiryDate"
              class="form-input"
              :min="new Date().toISOString().split('T')[0]"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Notas adicionales (opcional)</label>
          <textarea 
            v-model="newIngredientData.notes" 
            class="form-textarea"
            placeholder="Ej: Tomates orgánicos, maduros, comprados en el mercado local"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button class="modal-btn cancel-btn" @click="closeIngredientDetailsModal">Cancelar</button>
        <button class="modal-btn confirm-btn" @click="addIngredientToPantry" 
                :disabled="!newIngredientData.unit || newIngredientData.quantity <= 0">
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
            <span class="iconify weather-icon-large" :data-icon="weather.icon"></span>
          </div>
          <div>
            <h2 class="weather-recipe-title">Receta Sugerida por el Clima</h2>
            <p class="weather-recipe-subtitle">{{ weather.temp }}°C - {{ weather.condition }}</p>
          </div>
        </div>

        <div class="weather-recipe-content">
          <div class="weather-recipe-image">
            <img :src="weather.recipe?.image_url || 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'" 
                 :alt="weather.recipe?.title || 'Receta sugerida'">
            <div class="weather-recipe-badge">🌤️ Perfecta para días frescos</div>
          </div>

          <div class="weather-recipe-info">
            <h3>{{ weather.recipe?.title || 'Sopa de Verduras Nutritiva' }}</h3>
            <p class="weather-recipe-desc">{{ weather.suggestion }}</p>
            
            <div class="weather-recipe-stats">
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:clock-outline"></span>
                <span class="stat-value">{{ weather.recipe ? (weather.recipe.prep_time + weather.recipe.cook_time) : 35 }} min</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:account-group-outline"></span>
                <span class="stat-value">{{ weather.recipe?.servings || 6 }} porciones</span>
              </div>
              <div class="stat-box">
                <span class="iconify" data-icon="mdi:fire"></span>
                <span class="stat-value">{{ weather.recipe?.calories || 210 }} kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeWeatherRecipeModal">Cancelar</button>
          <button v-if="weather.recipe" class="modal-btn cook-btn" @click="openRecipeModal(weather.recipe)">
            <span class="iconify" data-icon="mdi:chef-hat"></span>
            Ver Receta Completa
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Ingredient Modal -->
    <div v-if="showCustomIngredientModal" class="modal-overlay" @click="closeCustomIngredientModal">
      <div class="modal-content custom-ingredient-modal" @click.stop>
        <button class="modal-close" @click="closeCustomIngredientModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <h2 class="modal-title">Agregar Ingrediente Personalizado</h2>
        
        <div class="ingredient-form">
          <div class="form-group">
            <label>Nombre del ingrediente *</label>
            <input 
              type="text" 
              v-model="customIngredientData.name" 
              class="form-input"
              placeholder="Ej: Tomate cherry"
              required
            >
          </div>

          <div class="form-group">
            <label>Categoría *</label>
            <select v-model="customIngredientData.category" class="form-select" required>
              <option value="">Seleccionar categoría</option>
              <option value="verduras">Verduras</option>
              <option value="frutas">Frutas</option>
              <option value="proteinas">Proteínas</option>
              <option value="granos">Granos</option>
              <option value="lacteos">Lácteos</option>
              <option value="condimentos">Condimentos</option>
              <option value="especias">Especias</option>
              <option value="aceites">Aceites</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cantidad *</label>
            <div class="quantity-input-group">
              <input 
                type="number" 
                v-model="customIngredientData.quantity" 
                min="0.1" 
                step="0.1"
                class="form-input"
                placeholder="0.0"
                required
              >
              <select v-model="customIngredientData.unit" class="form-select" required>
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
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>URL de imagen (opcional)</label>
            <input 
              type="text" 
              v-model="customIngredientData.image_url" 
              class="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            >
          </div>

          <div class="form-group">
            <label>Fecha de vencimiento (opcional)</label>
            <input 
              type="date" 
              v-model="customIngredientData.expiry_date"
              class="form-input"
              :min="new Date().toISOString().split('T')[0]"
            >
          </div>

          <div class="form-group">
            <label>Notas (opcional)</label>
            <textarea 
              v-model="customIngredientData.notes" 
              class="form-textarea"
              placeholder="Información adicional sobre el ingrediente"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeCustomIngredientModal">Cancelar</button>
          <button class="modal-btn confirm-btn" @click="addCustomIngredient" :disabled="!isCustomIngredientValid">
            Agregar Ingrediente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { supabase } from '../supabase'

export default {
  name: 'HomeView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // Modal states
    const showRecipeModal = ref(false)
    const showChangeMealModal = ref(false)
    const showGenerateMenuModal = ref(false)
    const showAddIngredientModal = ref(false)
    const showIngredientDetailsModal = ref(false)
    const showWeatherRecipeModal = ref(false)
    const showCustomIngredientModal = ref(false)
    
    // Loading states
    const loadingDailyMenu = ref(false)
    const loadingPantry = ref(false)
    const loadingRecommended = ref(false)
    const loadingNotifications = ref(false)
    const loadingRecipeDetails = ref(false)
    const loadingMealOptions = ref(false)
    const loadingIngredientOptions = ref(false)
    
    // Current states
    const currentRecipe = ref({})
    const currentMealType = ref('')
    const currentStep = ref(0)
    const isFavorite = ref(false)
    const selectedMeal = ref(null)
    const ingredientSearch = ref('')
    const selectedIngredient = ref({})
    const mealSearch = ref('')
    
    // Data
    const selectedDate = ref(new Date().toISOString().split('T')[0])
    const dailyMenu = reactive({
      breakfast: null,
      lunch: null,
      dinner: null
    })
    
    const pantryItems = ref([])
    const recommendedRecipes = ref([])
    const notifications = ref([])
    const mealOptions = ref([])
    const ingredientOptions = ref([])
    
    const currentRecipeIngredients = ref([])
    const currentRecipeSteps = ref([])
    
    // Preferences
    const menuPreferences = reactive({
      vegetarian: false,
      healthy: false,
      quick: false,
      usePantry: false
    })
    
    const generatedMenu = ref([])
    
    // New ingredient data
    const newIngredientData = reactive({
      category: 'verduras',
      quantity: 1,
      unit: 'unidades',
      expiryDate: null,
      notes: ''
    })
    
    const customIngredientData = reactive({
      name: '',
      category: '',
      quantity: 1,
      unit: '',
      image_url: '',
      expiry_date: null,
      notes: ''
    })
    
    // Weather data
    const weather = reactive({
      temp: 18,
      condition: 'Parcialmente nublado',
      humidity: 65,
      wind: 12,
      suggestion: 'Hoy es un día perfecto para preparar algo caliente y reconfortante como una sopa o guiso.',
      icon: 'mdi:weather-partly-cloudy',
      recipe: null
    })
    
    // Datos para ingredientes populares
    const popularIngredients = ref([
      { 
        id: 1, 
        name: 'Tomate', 
        category: 'verduras', 
        image_url: 'https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 2, 
        name: 'Cebolla', 
        category: 'verduras', 
        image_url: 'https://images.unsplash.com/photo-1597937081593-0ddc5f66deb0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 3, 
        name: 'Pollo', 
        category: 'proteinas', 
        image_url: 'https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 4, 
        name: 'Arroz', 
        category: 'granos', 
        image_url: 'https://images.unsplash.com/photo-1651793371427-ad065df0d208?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 5, 
        name: 'Leche', 
        category: 'lacteos', 
        image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 6, 
        name: 'Huevos', 
        category: 'proteinas', 
        image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 7, 
        name: 'Pan', 
        category: 'granos', 
        image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 8, 
        name: 'Queso', 
        category: 'lacteos', 
        image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 9, 
        name: 'Plátano', 
        category: 'frutas', 
        image_url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 10, 
        name: 'Manzana', 
        category: 'frutas', 
        image_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 11, 
        name: 'Zanahoria', 
        category: 'verduras', 
        image_url: 'https://images.unsplash.com/photo-1598170845058-78132e1b46d0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      },
      { 
        id: 12, 
        name: 'Aceite', 
        category: 'condimentos', 
        image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' 
      }
    ])
    
    // Computed properties
    const unreadNotificationsCount = computed(() => {
      return notifications.value.filter(n => !n.is_read).length
    })
    
    const expiringSoonCount = computed(() => {
      const today = new Date()
      const threeDaysFromNow = new Date(today)
      threeDaysFromNow.setDate(today.getDate() + 3)
      
      return pantryItems.value.filter(item => {
        if (!item.expiry_date) return false
        const expiry = new Date(item.expiry_date)
        return expiry <= threeDaysFromNow && expiry >= today
      }).length
    })
    
    const filteredMealOptions = computed(() => {
      if (!mealSearch.value) return mealOptions.value
      
      const search = mealSearch.value.toLowerCase()
      return mealOptions.value.filter(meal => 
        meal.title.toLowerCase().includes(search) ||
        meal.description?.toLowerCase().includes(search)
      )
    })
    
    const filteredIngredientOptions = computed(() => {
      if (!ingredientSearch.value) return popularIngredients.value
      
      const search = ingredientSearch.value.toLowerCase()
      return popularIngredients.value.filter(ingredient => 
        ingredient.name.toLowerCase().includes(search) ||
        ingredient.category.toLowerCase().includes(search)
      )
    })
    
    const isCustomIngredientValid = computed(() => {
      return customIngredientData.name.trim() !== '' &&
             customIngredientData.category !== '' &&
             customIngredientData.quantity > 0 &&
             customIngredientData.unit !== ''
    })
    
    // Helper functions
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const options = { weekday: 'long', day: 'numeric', month: 'long' }
      return date.toLocaleDateString('es-ES', options)
    }
    
    const formatTimeAgo = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 60) return `Hace ${diffMins} min`
      if (diffHours < 24) return `Hace ${diffHours} h`
      if (diffDays < 7) return `Hace ${diffDays} d`
      
      return date.toLocaleDateString('es-ES')
    }
    
    const formatCategory = (category) => {
      const categories = {
        'verduras': 'Verduras',
        'frutas': 'Frutas',
        'proteinas': 'Proteínas',
        'granos': 'Granos',
        'lacteos': 'Lácteos',
        'condimentos': 'Condimentos',
        'especias': 'Especias',
        'aceites': 'Aceites',
        'otros': 'Otros',
        'breakfast': 'Desayuno',
        'lunch': 'Almuerzo',
        'dinner': 'Cena',
        'snack': 'Snack',
        'dessert': 'Postre'
      }
      return categories[category] || category
    }
    
    const formatMealType = (type) => {
      const types = {
        'breakfast': 'Desayuno',
        'lunch': 'Almuerzo',
        'dinner': 'Cena'
      }
      return types[type] || type
    }
    
    const getExpiryBadgeClass = (item) => {
      if (!item.expiry_date) return 'safe'
      
      const expiry = new Date(item.expiry_date)
      const today = new Date()
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'danger' // Vencido
      if (diffDays <= 2) return 'danger'
      if (diffDays <= 5) return 'warning'
      return 'safe'
    }
    
    const getExpiryText = (item) => {
      if (!item.expiry_date) return 'Sin fecha'
      
      const expiry = new Date(item.expiry_date)
      const today = new Date()
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'Vencido'
      if (diffDays === 0) return 'Hoy'
      if (diffDays === 1) return '1 día'
      return `${diffDays} días`
    }
    
    const getNotificationIcon = (type) => {
      const icons = {
        'alert': 'mdi:alert-circle-outline',
        'recipe': 'mdi:food',
        'shopping': 'mdi:cart',
        'system': 'mdi:information-outline'
      }
      return icons[type] || 'mdi:information-outline'
    }
    
    // Método para obtener imagen de ingrediente
    const getIngredientImage = (ingredientName) => {
      const ingredientMap = {
        'tomate': 'https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'cebolla': 'https://images.unsplash.com/photo-1597937081593-0ddc5f66deb0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'pollo': 'https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'arroz': 'https://images.unsplash.com/photo-1651793371427-ad065df0d208?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'zanahoria': 'https://images.unsplash.com/photo-1598170845058-78132e1b46d0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'lechuga': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'queso': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'huevo': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'leche': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'pan': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'manzana': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'plátano': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200',
        'aceite': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200'
      }
      
      const lowerName = ingredientName.toLowerCase()
      for (const [key, value] of Object.entries(ingredientMap)) {
        if (lowerName.includes(key)) {
          return value
        }
      }
      
      // Si no encuentra, usar Unsplash genérico
      return `https://source.unsplash.com/200x200/?${encodeURIComponent(ingredientName)},food`
    }
    
    // Database functions
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }
    
    const fetchDailyMenu = async () => {
      loadingDailyMenu.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return
        
        const { data, error } = await supabase
          .from('daily_menus')
          .select(`
            *,
            breakfast_recipe:breakfast_recipe_id (*),
            lunch_recipe:lunch_recipe_id (*),
            dinner_recipe:dinner_recipe_id (*)
          `)
          .eq('user_id', user.id)
          .eq('date', selectedDate.value)
          .single()
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
          throw error
        }
        
        if (data) {
          dailyMenu.breakfast = data.breakfast_recipe
          dailyMenu.lunch = data.lunch_recipe
          dailyMenu.dinner = data.dinner_recipe
        } else {
          // Create empty menu for today
          dailyMenu.breakfast = null
          dailyMenu.lunch = null
          dailyMenu.dinner = null
        }
      } catch (error) {
        console.error('Error fetching daily menu:', error)
        toast.error('Error al cargar el menú del día')
      } finally {
        loadingDailyMenu.value = false
      }
    }
    
    const fetchPantryItems = async () => {
      loadingPantry.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return
        
        const { data, error } = await supabase
          .from('pantry')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        pantryItems.value = data || []
      } catch (error) {
        console.error('Error fetching pantry:', error)
        toast.error('Error al cargar la despensa')
      } finally {
        loadingPantry.value = false
      }
    }
    
    const fetchRecommendedRecipes = async () => {
      loadingRecommended.value = true
      try {
        // Get recipes based on pantry and preferences
        const user = await getCurrentUser()
        
        // Simple recommendation: get 2 random recipes
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .limit(2)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        recommendedRecipes.value = data || []
        
        // Set weather recipe suggestion
        if (data && data.length > 0) {
          weather.recipe = data[0]
          weather.suggestion = `Hoy es un día perfecto para preparar ${data[0].title}. El clima fresco pide algo caliente y reconfortante.`
        }
      } catch (error) {
        console.error('Error fetching recommended recipes:', error)
      } finally {
        loadingRecommended.value = false
      }
    }
    
    const fetchNotifications = async () => {
      loadingNotifications.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (error) throw error
        
        notifications.value = data || []
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        loadingNotifications.value = false
      }
    }
    
    const fetchMealOptions = async (mealType) => {
      loadingMealOptions.value = true
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('category', mealType)
          .order('title')
        
        if (error) throw error
        
        mealOptions.value = data || []
      } catch (error) {
        console.error('Error fetching meal options:', error)
        toast.error('Error al cargar las opciones de comida')
      } finally {
        loadingMealOptions.value = false
      }
    }
    
    const fetchIngredientOptions = async () => {
      loadingIngredientOptions.value = true
      try {
        // Buscar ingredientes únicos de las recetas
        const { data: ingredientsData, error } = await supabase
          .from('recipe_ingredients')
          .select('name, category')
          .order('name')
          .limit(20) // Limitar para no sobrecargar

        if (error) throw error

        // Convertir a formato de opciones
        ingredientOptions.value = ingredientsData?.map(ing => ({
          id: ing.name,
          name: ing.name,
          category: ing.category,
          image_url: getIngredientImage(ing.name)
        })) || []
      } catch (error) {
        console.error('Error fetching ingredient options:', error)
      } finally {
        loadingIngredientOptions.value = false
      }
    }
    
    const fetchRecipeDetails = async (recipeId) => {
      loadingRecipeDetails.value = true
      try {
        const [ingredientsResponse, stepsResponse] = await Promise.all([
          supabase
            .from('recipe_ingredients')
            .select('*')
            .eq('recipe_id', recipeId)
            .order('order_index'),
          supabase
            .from('recipe_steps')
            .select('*')
            .eq('recipe_id', recipeId)
            .order('step_number')
        ])
        
        if (ingredientsResponse.error) throw ingredientsResponse.error
        if (stepsResponse.error) throw stepsResponse.error
        
        currentRecipeIngredients.value = ingredientsResponse.data || []
        currentRecipeSteps.value = stepsResponse.data || []
      } catch (error) {
        console.error('Error fetching recipe details:', error)
        toast.error('Error al cargar los detalles de la receta')
      } finally {
        loadingRecipeDetails.value = false
      }
    }
    
    // Modal methods
    const openRecipeModal = async (recipe) => {
      currentRecipe.value = recipe
      currentStep.value = 0
      showRecipeModal.value = true
      
      // Check if recipe is in favorites
      const user = await getCurrentUser()
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id)
          .single()
        
        isFavorite.value = !!data
      }
      
      // Fetch recipe details
      await fetchRecipeDetails(recipe.id)
    }
    
    const closeRecipeModal = () => {
      showRecipeModal.value = false
      currentRecipe.value = {}
      currentRecipeIngredients.value = []
      currentRecipeSteps.value = []
    }
    
    const openChangeMealModal = async (mealType) => {
      currentMealType.value = mealType
      selectedMeal.value = null
      mealSearch.value = ''
      showChangeMealModal.value = true
      
      await fetchMealOptions(mealType)
    }
    
    const closeChangeMealModal = () => {
      showChangeMealModal.value = false
    }
    
    const openGenerateMenuModal = async () => {
      showGenerateMenuModal.value = true
      generatedMenu.value = []
      
      // Load user preferences
      const user = await getCurrentUser()
      if (user) {
        const { data } = await supabase
          .from('menu_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single()
        
        if (data?.preferences) {
          Object.assign(menuPreferences, data.preferences)
        }
      }
    }
    
    const closeGenerateMenuModal = () => {
      showGenerateMenuModal.value = false
    }
    
    const openAddIngredientModal = async () => {
      ingredientSearch.value = ''
      showAddIngredientModal.value = true
      
      await fetchIngredientOptions()
    }
    
    const closeAddIngredientModal = () => {
      showAddIngredientModal.value = false
    }
    
    // Nuevo método para seleccionar ingrediente común
    const selectCommonIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      showAddIngredientModal.value = false
      showIngredientDetailsModal.value = true
      
      // Reset form con datos del ingrediente
      Object.assign(newIngredientData, {
        category: ingredient.category,
        quantity: 1,
        unit: 'unidades',
        expiryDate: null,
        notes: ''
      })
    }
    
    const openCustomIngredientModal = () => {
      showAddIngredientModal.value = false
      showCustomIngredientModal.value = true
      
      // Reset form
      Object.assign(customIngredientData, {
        name: '',
        category: '',
        quantity: 1,
        unit: '',
        image_url: '',
        expiry_date: null,
        notes: ''
      })
    }
    
    const closeCustomIngredientModal = () => {
      showCustomIngredientModal.value = false
    }
    
    const openWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = true
    }
    
    const closeWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = false
    }
    
    // Action methods
    const toggleFavorite = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Debes iniciar sesión para agregar favoritos')
          return
        }
        
        if (isFavorite.value) {
          // Remove from favorites
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('recipe_id', currentRecipe.value.id)
          
          if (error) throw error
          
          isFavorite.value = false
          toast.success('Receta eliminada de favoritos')
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              recipe_id: currentRecipe.value.id
            })
          
          if (error) throw error
          
          isFavorite.value = true
          toast.success('Receta agregada a favoritos')
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
        toast.error('Error al actualizar favoritos')
      }
    }
    
    const addToShoppingList = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Debes iniciar sesión para agregar a la lista de compras')
          return
        }
        
        // Add each ingredient to shopping list
        const itemsToAdd = currentRecipeIngredients.value.map(ing => ({
          user_id: user.id,
          name: ing.name,
          quantity: parseFloat(ing.quantity) || 1,
          unit: ing.unit || 'unidades',
          category: 'compra',
          is_purchased: false
        }))
        
        const { error } = await supabase
          .from('shopping_list')
          .insert(itemsToAdd)
        
        if (error) throw error
        
        toast.success('Ingredientes agregados a la lista de compras')
      } catch (error) {
        console.error('Error adding to shopping list:', error)
        toast.error('Error al agregar a la lista de compras')
      }
    }
    
    const selectMeal = (meal) => {
      selectedMeal.value = meal
    }
    
    const confirmMealChange = async () => {
      try {
        const user = await getCurrentUser()
        if (!user || !selectedMeal.value) return
        
        // Check if daily menu exists for selected date
        const { data: existingMenu } = await supabase
          .from('daily_menus')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', selectedDate.value)
          .single()
        
        const updateData = {
          user_id: user.id,
          date: selectedDate.value,
          [`${currentMealType.value}_recipe_id`]: selectedMeal.value.id
        }
        
        let error
        if (existingMenu) {
          // Update existing menu
          const { error: updateError } = await supabase
            .from('daily_menus')
            .update(updateData)
            .eq('id', existingMenu.id)
          
          error = updateError
        } else {
          // Create new menu
          const { error: insertError } = await supabase
            .from('daily_menus')
            .insert(updateData)
          
          error = insertError
        }
        
        if (error) throw error
        
        // Update local state
        dailyMenu[currentMealType.value] = selectedMeal.value
        
        toast.success(`${formatMealType(currentMealType.value)} actualizado`)
        closeChangeMealModal()
      } catch (error) {
        console.error('Error changing meal:', error)
        toast.error('Error al cambiar la comida')
      }
    }
    
    const generateNewMenu = async () => {
      try {
        // Build query based on preferences
        let query = supabase
          .from('recipes')
          .select('*')
        
        // Apply filters based on preferences
        const filters = []
        if (menuPreferences.vegetarian) {
          filters.push('is_vegetarian.eq.true')
        }
        if (menuPreferences.healthy) {
          filters.push('is_healthy.eq.true')
        }
        if (menuPreferences.quick) {
          filters.push('is_quick.eq.true')
        }
        
        // Get one recipe for each meal type
        const mealTypes = ['breakfast', 'lunch', 'dinner']
        generatedMenu.value = []
        
        for (const mealType of mealTypes) {
          let mealQuery = supabase
            .from('recipes')
            .select('*')
            .eq('category', mealType)
            .limit(1)
          
          // Apply additional filters
          filters.forEach(filter => {
            const [column, operator, value] = filter.split('.')
            mealQuery = mealQuery.filter(column, operator, value)
          })
          
          const { data, error } = await mealQuery
          
          if (error) throw error
          
          if (data && data.length > 0) {
            generatedMenu.value.push({
              type: mealType,
              ...data[0]
            })
          }
        }
        
        toast.success('Menú generado exitosamente')
      } catch (error) {
        console.error('Error generating menu:', error)
        toast.error('Error al generar el menú')
      }
    }
    
    const applyGeneratedMenu = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return
        
        // Check if daily menu exists for selected date
        const { data: existingMenu } = await supabase
          .from('daily_menus')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', selectedDate.value)
          .single()
        
        const updateData = {
          user_id: user.id,
          date: selectedDate.value,
          breakfast_recipe_id: generatedMenu.value.find(m => m.type === 'breakfast')?.id || null,
          lunch_recipe_id: generatedMenu.value.find(m => m.type === 'lunch')?.id || null,
          dinner_recipe_id: generatedMenu.value.find(m => m.type === 'dinner')?.id || null
        }
        
        let error
        if (existingMenu) {
          // Update existing menu
          const { error: updateError } = await supabase
            .from('daily_menus')
            .update(updateData)
            .eq('id', existingMenu.id)
          
          error = updateError
        } else {
          // Create new menu
          const { error: insertError } = await supabase
            .from('daily_menus')
            .insert(updateData)
          
          error = insertError
        }
        
        if (error) throw error
        
        // Update local state
        await fetchDailyMenu()
        
        // Save preferences
        await supabase
          .from('menu_preferences')
          .upsert({
            user_id: user.id,
            preferences: menuPreferences,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
        
        toast.success('Menú aplicado exitosamente')
        closeGenerateMenuModal()
      } catch (error) {
        console.error('Error applying menu:', error)
        toast.error('Error al aplicar el menú')
      }
    }
    
    const selectIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      showAddIngredientModal.value = false
      showIngredientDetailsModal.value = true
      
      // Reset form
      Object.assign(newIngredientData, {
        category: ingredient.category,
        quantity: 1,
        unit: 'unidades',
        expiryDate: null,
        notes: ''
      })
    }
    
    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
    }
    
    const addIngredientToPantry = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Debes iniciar sesión para agregar ingredientes')
          return
        }
        
        const { error } = await supabase
          .from('pantry')
          .insert({
            user_id: user.id,
            name: selectedIngredient.value.name,
            category: newIngredientData.category,
            quantity: newIngredientData.quantity,
            unit: newIngredientData.unit,
            expiry_date: newIngredientData.expiryDate,
            image_url: selectedIngredient.value.image_url || getIngredientImage(selectedIngredient.value.name),
            notes: newIngredientData.notes
          })
        
        if (error) throw error
        
        toast.success(`${selectedIngredient.value.name} agregado a la despensa`)
        closeIngredientDetailsModal()
        await fetchPantryItems()
      } catch (error) {
        console.error('Error adding ingredient:', error)
        toast.error('Error al agregar el ingrediente')
      }
    }
    
    const addCustomIngredient = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Debes iniciar sesión para agregar ingredientes')
          return
        }
        
        const { error } = await supabase
          .from('pantry')
          .insert({
            user_id: user.id,
            name: customIngredientData.name,
            category: customIngredientData.category,
            quantity: customIngredientData.quantity,
            unit: customIngredientData.unit,
            expiry_date: customIngredientData.expiry_date,
            image_url: customIngredientData.image_url || getIngredientImage(customIngredientData.name),
            notes: customIngredientData.notes
          })
        
        if (error) throw error
        
        toast.success(`${customIngredientData.name} agregado a la despensa`)
        closeCustomIngredientModal()
        await fetchPantryItems()
      } catch (error) {
        console.error('Error adding custom ingredient:', error)
        toast.error('Error al agregar el ingrediente')
      }
    }
    
    // Pantry actions
    const decreaseQuantity = async (item) => {
      try {
        const newQuantity = Math.max(0, item.quantity - 1)
        
        if (newQuantity === 0) {
          // Remove item if quantity becomes 0
          const { error } = await supabase
            .from('pantry')
            .delete()
            .eq('id', item.id)
          
          if (error) throw error
          
          toast.info(`${item.name} eliminado de la despensa`)
        } else {
          // Update quantity
          const { error } = await supabase
            .from('pantry')
            .update({ quantity: newQuantity })
            .eq('id', item.id)
          
          if (error) throw error
          
          toast.info(`Cantidad de ${item.name} disminuida`)
        }
        
        await fetchPantryItems()
      } catch (error) {
        console.error('Error decreasing quantity:', error)
        toast.error('Error al actualizar la cantidad')
      }
    }
    
    const increaseQuantity = async (item) => {
      try {
        const newQuantity = item.quantity + 1
        
        const { error } = await supabase
          .from('pantry')
          .update({ quantity: newQuantity })
          .eq('id', item.id)
        
        if (error) throw error
        
        toast.info(`Cantidad de ${item.name} aumentada`)
        await fetchPantryItems()
      } catch (error) {
        console.error('Error increasing quantity:', error)
        toast.error('Error al actualizar la cantidad')
      }
    }
    
    const removeIngredient = async (item) => {
      if (!confirm(`¿Estás seguro de que quieres eliminar ${item.name} de tu despensa?`)) {
        return
      }
      
      try {
        const { error } = await supabase
          .from('pantry')
          .delete()
          .eq('id', item.id)
        
        if (error) throw error
        
        toast.success(`${item.name} eliminado de la despensa`)
        await fetchPantryItems()
      } catch (error) {
        console.error('Error removing ingredient:', error)
        toast.error('Error al eliminar el ingrediente')
      }
    }
    
    // Notification actions
    const handleNotification = (notification) => {
      // Mark as read
      markAsRead(notification)
      
      switch (notification.type) {
        case 'alert':
          // Show pantry items expiring soon
          router.push('/despensa')
          break
        case 'recipe':
          // Show recipe modal if recipe_id in metadata
          if (notification.metadata?.recipe_id) {
            // Fetch and show recipe
            supabase
              .from('recipes')
              .select('*')
              .eq('id', notification.metadata.recipe_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  openRecipeModal(data)
                }
              })
          }
          break
        case 'shopping':
          router.push('/lista-compras')
          break
      }
    }
    
    const markAsRead = async (notification) => {
      if (notification.is_read) return
      
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id)
        
        if (error) throw error
        
        // Update local state
        notification.is_read = true
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
    
    const markAllAsRead = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return
        
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
        
        if (error) throw error
        
        // Update local state
        notifications.value.forEach(n => n.is_read = true)
        toast.success('Todas las notificaciones marcadas como leídas')
      } catch (error) {
        console.error('Error marking all as read:', error)
        toast.error('Error al marcar notificaciones como leídas')
      }
    }
    
    // Navigation methods
    const goToRecipes = () => {
      router.push('/recetas')
    }
    
    const goToNotifications = () => {
      router.push('/notificaciones')
    }
    
    const goToPantry = () => {
      router.push('/despensa')
    }
    
    const previousDay = () => {
      const date = new Date(selectedDate.value)
      date.setDate(date.getDate() - 1)
      selectedDate.value = date.toISOString().split('T')[0]
    }
    
    const nextDay = () => {
      const date = new Date(selectedDate.value)
      date.setDate(date.getDate() + 1)
      selectedDate.value = date.toISOString().split('T')[0]
    }
    
    const goToToday = () => {
      selectedDate.value = new Date().toISOString().split('T')[0]
    }
    
    // Step navigation
    const nextStep = () => {
      if (currentStep.value < currentRecipeSteps.value.length - 1) {
        currentStep.value++
      }
    }
    
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }
    
    const filterMealOptions = () => {
      // Handled by computed property
    }
    
    const filterIngredients = () => {
      // Handled by computed property
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
        toast.error('Error al cerrar sesión')
      }
    }
    
    // Watch for date changes
    watch(selectedDate, () => {
      fetchDailyMenu()
    })
    
    // Initialize data
    onMounted(async () => {
      await Promise.all([
        fetchDailyMenu(),
        fetchPantryItems(),
        fetchRecommendedRecipes(),
        fetchNotifications()
      ])
    })
    
    return {
      isMobileMenuOpen,
      selectedDate,
      dailyMenu,
      pantryItems,
      recommendedRecipes,
      notifications,
      weather,
      menuPreferences,
      generatedMenu,
      popularIngredients,
      
      // Loading states
      loadingDailyMenu,
      loadingPantry,
      loadingRecommended,
      loadingNotifications,
      loadingRecipeDetails,
      loadingMealOptions,
      loadingIngredientOptions,
      
      // Modal states
      showRecipeModal,
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showWeatherRecipeModal,
      showCustomIngredientModal,
      
      // Current states
      currentRecipe,
      currentMealType,
      currentStep,
      isFavorite,
      selectedMeal,
      ingredientSearch,
      selectedIngredient,
      mealSearch,
      
      // Data
      currentRecipeIngredients,
      currentRecipeSteps,
      filteredMealOptions,
      filteredIngredientOptions,
      newIngredientData,
      customIngredientData,
      
      // Computed
      unreadNotificationsCount,
      expiringSoonCount,
      isCustomIngredientValid,
      
      // Methods
      formatDate,
      formatTimeAgo,
      formatCategory,
      formatMealType,
      getExpiryBadgeClass,
      getExpiryText,
      getIngredientImage,
      
      // Modal methods
      openRecipeModal,
      closeRecipeModal,
      openChangeMealModal,
      closeChangeMealModal,
      openGenerateMenuModal,
      closeGenerateMenuModal,
      openAddIngredientModal,
      closeAddIngredientModal,
      selectCommonIngredient,
      openCustomIngredientModal,
      closeCustomIngredientModal,
      openWeatherRecipeModal,
      closeWeatherRecipeModal,
      
      // Action methods
      toggleFavorite,
      addToShoppingList,
      selectMeal,
      confirmMealChange,
      generateNewMenu,
      applyGeneratedMenu,
      selectIngredient,
      closeIngredientDetailsModal,
      addIngredientToPantry,
      addCustomIngredient,
      
      // Pantry actions
      decreaseQuantity,
      increaseQuantity,
      removeIngredient,
      
      // Notification actions
      handleNotification,
      markAsRead,
      markAllAsRead,
      
      // Navigation
      goToRecipes,
      goToNotifications,
      goToPantry,
      previousDay,
      nextDay,
      goToToday,
      
      // Step navigation
      nextStep,
      prevStep,
      
      // Filter methods
      filterMealOptions,
      filterIngredients,
      
      // Layout functions
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

.preference-label input:checked + .checkbox-custom {
  background-color: var(--primary);
  border-color: var(--primary);
}

.preference-label input:checked + .checkbox-custom::after {
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
  overflow: hidden;
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
/* Agrega estos estilos al final del bloque <style scoped> existente */

/* Loading states */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--muted-foreground);
}

.loading-icon {
  width: 3rem;
  height: 3rem;
  color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Empty states */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--muted-foreground);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: var(--border);
  margin-bottom: 1rem;
}

.empty-state-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-state-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Date selector */
.date-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.current-date {
  font-weight: 500;
  color: var(--foreground);
  min-width: 200px;
  text-align: center;
}

.date-nav-btn {
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

.date-nav-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

.date-nav-btn .iconify {
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

/* Pantry stats */
.pantry-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.stat-item {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(168, 213, 186, 0.1);
  color: var(--primary);
}

.stat-item.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* No recipe state */
.no-recipe {
  padding: 0.5rem 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

/* Disabled buttons */
.cook-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Meal option tags */
.meal-option-tags {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
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
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

/* Notification unread state */
.notification-item.unread {
  background-color: rgba(93, 162, 113, 0.15);
}

.mark-read-btn {
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
  flex-shrink: 0;
}

.mark-read-btn:hover {
  background-color: var(--primary);
  border-color: var(--primary);
}

.mark-read-btn:hover .iconify {
  color: white;
}

.mark-read-btn .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--primary);
}

.view-all-notifications {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  margin-top: 1rem;
}

.view-all-notifications:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

/* Ingredient option category */
.ingredient-option-category {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  text-transform: capitalize;
}

/* Custom ingredient modal */
.custom-ingredient-modal {
  max-width: 500px;
  padding: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .date-selector {
    order: 2;
    justify-content: center;
  }
  
  .current-date {
    min-width: auto;
  }
  
  .pantry-stats {
    order: 1;
    justify-content: center;
  }
  
  .loading-state,
  .empty-state {
    padding: 2rem;
  }
  
  .loading-icon,
  .empty-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .date-selector {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pantry-stats {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}



/* Pantry more item */
.pantry-more {
  background-color: rgba(168, 213, 186, 0.1);
  border: 2px dashed var(--primary);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pantry-more:hover {
  background-color: rgba(168, 213, 186, 0.2);
  transform: translateY(-2px);
}

.pantry-more-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--primary);
}

.pantry-more-content .iconify {
  width: 2rem;
  height: 2rem;
}

.pantry-more-content p {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

/* Ingredient option styles mejorados */
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
  height: 100%;
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
  background-color: #f5f5f5;
}

.ingredient-option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ingredient-option-name {
  font-weight: 500;
  text-align: center;
  font-size: 0.875rem;
}

.ingredient-option-category {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  text-transform: capitalize;
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
  z-index: 2;
}

.ingredient-add-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
  transform: scale(1.1);
}

.ingredient-add-btn .iconify {
  width: 1.25rem;
  height: 1.25rem;
}

/* Asegurar que el grid de ingredientes tenga el diseño anterior */
.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .pantry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .ingredients-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .pantry-grid {
    grid-template-columns: 1fr;
  }
  
  .ingredients-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>