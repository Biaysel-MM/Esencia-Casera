<!-- src/views/HomeView.vue -->
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
                <button class="generate-menu-btn" @click="openGenerateMenuModal">
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
                      <button class="cook-btn" @click="openRecipeModal('breakfast')">Cocinar</button>
                      <button class="change-btn" @click="openChangeMealModal('breakfast')">Cambiar</button>
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
                      <button class="cook-btn" @click="openRecipeModal('lunch')">Cocinar</button>
                      <button class="change-btn" @click="openChangeMealModal('lunch')">Cambiar</button>
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
                      <button class="cook-btn" @click="openRecipeModal('dinner')">Cocinar</button>
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
                  <div class="recipe-card" @click="openRecipeModal('tacos')">
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

                  <div class="recipe-card" @click="openRecipeModal('soup')">
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
                <!-- Weather Suggestion -->
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

    <!-- MODALS -->
    
    <!-- Recipe Modal -->
    <div v-if="showRecipeModal" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content recipe-modal" @click.stop>
        <button class="modal-close" @click="closeRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
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
                <div class="step-indicator">Paso {{ currentStep + 1 }} de {{ currentRecipe.steps.length }}</div>
                <button class="step-btn" @click="nextStep" :disabled="currentStep === currentRecipe.steps.length - 1">
                  Siguiente
                  <span class="iconify" data-icon="mdi:chevron-right"></span>
                </button>
              </div>
              
              <div class="step-content">
                <div class="step-image">
                  <img :src="currentRecipe.steps[currentStep].image" :alt="'Paso ' + (currentStep + 1)">
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

    <!-- Change Meal Modal -->
    <div v-if="showChangeMealModal" class="modal-overlay" @click="closeChangeMealModal">
      <div class="modal-content change-meal-modal" @click.stop>
        <button class="modal-close" @click="closeChangeMealModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>
        
        <h2 class="modal-title">Cambiar {{ currentMealType === 'breakfast' ? 'Desayuno' : currentMealType === 'lunch' ? 'Almuerzo' : 'Cena' }}</h2>
        
        <div class="meal-options-grid">
          <div v-for="meal in filteredMeals" :key="meal.id" class="meal-option" @click="selectMeal(meal)">
            <div class="meal-option-image">
              <img :src="meal.image" :alt="meal.title">
              <div class="meal-option-badge">{{ meal.type }}</div>
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

        <div class="generated-menu">
          <div class="generated-meal" v-for="meal in generatedMenu" :key="meal.type">
            <div class="generated-meal-header">
              <h4>{{ meal.type === 'breakfast' ? 'Desayuno' : meal.type === 'lunch' ? 'Almuerzo' : 'Cena' }}</h4>
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

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeGenerateMenuModal">Cancelar</button>
          <button class="modal-btn generate-btn" @click="generateNewMenu">
            <span class="iconify" data-icon="mdi:sparkles"></span>
            Generar Menú
          </button>
          <button class="modal-btn confirm-btn" @click="applyGeneratedMenu">
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
            <input 
              type="text" 
              v-model="ingredientSearch" 
              placeholder="Buscar ingrediente..."
              @input="filterIngredients"
            >
          </div>
        </div>

        <div class="ingredients-grid">
          <div 
            v-for="ingredient in filteredIngredientList" 
            :key="ingredient.id"
            class="ingredient-option"
            @click="selectIngredient(ingredient)"
          >
            <div class="ingredient-option-image">
              <img :src="ingredient.image" :alt="ingredient.name">
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
          <img :src="selectedIngredient.image" :alt="selectedIngredient.name">
        </div>

        <div class="ingredient-form">
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="newIngredientData.category" class="form-select">
              <option value="verduras">Verduras</option>
              <option value="frutas">Frutas</option>
              <option value="proteinas">Proteínas</option>
              <option value="granos">Granos</option>
              <option value="lacteos">Lácteos</option>
              <option value="condimentos">Condimentos</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cantidad</label>
            <div class="quantity-input-group">
              <input 
                type="number" 
                v-model="newIngredientData.quantity" 
                min="1" 
                class="form-input"
              >
              <select v-model="newIngredientData.unit" class="form-select">
                <option value="unidades">Unidades</option>
                <option value="gramos">Gramos</option>
                <option value="kg">Kilogramos</option>
                <option value="ml">Mililitros</option>
                <option value="litros">Litros</option>
                <option value="tazas">Tazas</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Días hasta vencer (opcional)</label>
            <div class="expiry-input">
              <input 
                type="number" 
                v-model="newIngredientData.expiryDays" 
                min="1" 
                class="form-input"
                placeholder="Ej: 7"
              >
              <span class="expiry-label">días</span>
            </div>
          </div>

          <div class="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea 
              v-model="newIngredientData.notes" 
              class="form-textarea"
              placeholder="Ej: Tomates orgánicos, maduros"
            ></textarea>
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
            <p class="weather-recipe-subtitle">18°C - Parcialmente nublado</p>
          </div>
        </div>

        <div class="weather-recipe-content">
          <div class="weather-recipe-image">
            <img src="https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300" alt="Sopa de Verduras">
            <div class="weather-recipe-badge">🌤️ Perfecta para días frescos</div>
          </div>

          <div class="weather-recipe-info">
            <h3>Sopa de Verduras Nutritiva</h3>
            <p class="weather-recipe-desc">Esta receta caliente y reconfortante es ideal para el clima fresco de hoy. Las verduras de temporada y el caldo casero te mantendrán abrigado.</p>
            
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
          <button class="modal-btn cook-btn" @click="openRecipeModal('soup')">
            <span class="iconify" data-icon="mdi:chef-hat"></span>
            Ver Receta Completa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
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
    
    // Modal states
    const showRecipeModal = ref(false)
    const showChangeMealModal = ref(false)
    const showGenerateMenuModal = ref(false)
    const showAddIngredientModal = ref(false)
    const showIngredientDetailsModal = ref(false)
    const showWeatherRecipeModal = ref(false)
    
    // Current states
    const currentRecipe = ref({})
    const currentMealType = ref('')
    const currentStep = ref(0)
    const isFavorite = ref(false)
    const selectedMeal = ref(null)
    const ingredientSearch = ref('')
    const selectedIngredient = ref({})
    
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
    
    // Menu preferences
    const menuPreferences = reactive({
      dietary: []
    })
    
    // Generated menu
    const generatedMenu = ref([
      {
        type: 'breakfast',
        title: 'Smoothie Bowl de Frutas Tropicales',
        time: '10 min',
        servings: '2 porciones',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=crop&w=400&h-200'
      },
      {
        type: 'lunch',
        title: 'Quinoa con Vegetales Salteados',
        time: '25 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        type: 'dinner',
        title: 'Crema de Calabaza',
        time: '30 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      }
    ])
    
    // All available meals for change modal
    const allMeals = ref([
      {
        id: 1,
        type: 'breakfast',
        title: 'Bowl de Avena con Frutas',
        time: '15 min',
        servings: '2 porciones',
        image: 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 2,
        type: 'breakfast',
        title: 'Tostadas con Aguacate',
        time: '10 min',
        servings: '2 porciones',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 3,
        type: 'breakfast',
        title: 'Huevos Revueltos con Espinacas',
        time: '15 min',
        servings: '2 porciones',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 4,
        type: 'lunch',
        title: 'Ensalada de Pollo a la Parrilla',
        time: '30 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 5,
        type: 'lunch',
        title: 'Pasta con Tomate y Albahaca',
        time: '20 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 6,
        type: 'dinner',
        title: 'Pasta Primavera',
        time: '25 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      },
      {
        id: 7,
        type: 'dinner',
        title: 'Salmón al Horno con Vegetales',
        time: '30 min',
        servings: '4 porciones',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      }
    ])
    
    // Recipe data
    const recipes = {
      breakfast: {
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
          { name: 'Fresas', quantity: '½ taza' },
          { name: 'Arándanos', quantity: '¼ taza' },
          { name: 'Miel', quantity: '1 cucharada' },
          { name: 'Nueces', quantity: '2 cucharadas' }
        ],
        steps: [
          {
            image: 'https://images.unsplash.com/photo-1622484206670-973a72bfc8a0?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'En una olla, mezcla la avena con la leche de almendras y cocina a fuego medio por 5 minutos, revolviendo constantemente.'
          },
          {
            image: 'https://images.unsplash.com/photo-1570196911694-76a7d48c8b23?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Mientras se cocina la avena, lava y corta las frutas: plátano en rodajas, fresas en cuartos.'
          },
          {
            image: 'https://images.unsplash.com/photo-1588347818036-ef26fd7a0f28?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Sirve la avena en dos bowls, decora con las frutas cortadas, arándanos, nueces y un chorrito de miel.'
          }
        ]
      },
      lunch: {
        title: 'Ensalada de Pollo a la Parrilla',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
        badges: ['Proteico', 'Saludable'],
        rating: '4.7',
        time: '30 min',
        servings: '4 porciones',
        calories: '320 kcal',
        ingredients: [
          { name: 'Pechuga de pollo', quantity: '500 g' },
          { name: 'Lechuga', quantity: '1 cabeza' },
          { name: 'Tomate', quantity: '2 unidades' },
          { name: 'Pepino', quantity: '1 unidad' },
          { name: 'Aceite de oliva', quantity: '2 cucharadas' },
          { name: 'Limón', quantity: '1 unidad' },
          { name: 'Sal y pimienta', quantity: 'al gusto' }
        ],
        steps: [
          {
            image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Sazona el pollo con sal, pimienta y un chorrito de aceite de oliva. Cocina a la parrilla por 6-8 minutos por lado.'
          },
          {
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Lava y corta las verduras: lechuga en trozos, tomate en gajos, pepino en rodajas.'
          },
          {
            image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Corta el pollo en tiras y mezcla con las verduras. Aliña con aceite de oliva y jugo de limón.'
          }
        ]
      },
      dinner: {
        title: 'Pasta Primavera',
        image: 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
        badges: ['Vegetariano', 'Rápido'],
        rating: '4.8',
        time: '25 min',
        servings: '4 porciones',
        calories: '350 kcal',
        ingredients: [
          { name: 'Pasta', quantity: '400 g' },
          { name: 'Brócoli', quantity: '1 cabeza' },
          { name: 'Zanahoria', quantity: '2 unidades' },
          { name: 'Champiñones', quantity: '200 g' },
          { name: 'Crema', quantity: '200 ml' },
          { name: 'Queso parmesano', quantity: '50 g' },
          { name: 'Ajo', quantity: '2 dientes' }
        ],
        steps: [
          {
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Cocina la pasta según las instrucciones del paquete. Reserva una taza de agua de la cocción.'
          },
          {
            image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Saltea las verduras en aceite de oliva: primero el ajo, luego el brócoli, zanahoria y champiñones.'
          },
          {
            image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Añade la crema, el queso parmesano y un poco del agua de la pasta. Mezcla con la pasta cocida.'
          }
        ]
      },
      tacos: {
        title: 'Tacos Mexicanos Caseros',
        image: 'https://images.unsplash.com/photo-1615818449536-f26c1e1fe0f0?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
        badges: ['Picante', 'Tradicional'],
        rating: '4.9',
        time: '25 min',
        servings: '4 porciones',
        calories: '380 kcal',
        ingredients: [
          { name: 'Tortillas de maíz', quantity: '12 unidades' },
          { name: 'Carne molida', quantity: '500 g' },
          { name: 'Cebolla', quantity: '1 unidad' },
          { name: 'Tomate', quantity: '2 unidades' },
          { name: 'Cilantro', quantity: '1 manojo' },
          { name: 'Limón', quantity: '2 unidades' },
          { name: 'Chile', quantity: '2 unidades' }
        ],
        steps: [
          {
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Cocina la carne molida con cebolla picada hasta que esté dorada. Sazona con sal y especias al gusto.'
          },
          {
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Pica finamente el tomate, cebolla, cilantro y chile para preparar la salsa.'
          },
          {
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Calienta las tortillas y sirve con la carne, salsa, limón y decoraciones adicionales.'
          }
        ]
      },
      soup: {
        title: 'Sopa de Verduras Nutritiva',
        image: 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300',
        badges: ['Saludable', 'Bajo en calorías'],
        rating: '4.6',
        time: '35 min',
        servings: '6 porciones',
        calories: '210 kcal',
        ingredients: [
          { name: 'Zanahoria', quantity: '3 unidades' },
          { name: 'Apio', quantity: '2 tallos' },
          { name: 'Cebolla', quantity: '1 unidad' },
          { name: 'Papa', quantity: '2 unidades' },
          { name: 'Caldo de verduras', quantity: '1.5 litros' },
          { name: 'Espinacas', quantity: '100 g' },
          { name: 'Aceite de oliva', quantity: '2 cucharadas' }
        ],
        steps: [
          {
            image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Pica todas las verduras en cubos pequeños: zanahoria, apio, cebolla y papa.'
          },
          {
            image: 'https://images.unsplash.com/photo-1570196911694-76a7d48c8b23?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Saltea las verduras en aceite de oliva por 5 minutos hasta que estén ligeramente doradas.'
          },
          {
            image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?crop=entropy&cs=tinysrgb&fit=crop&w=600&h=400',
            description: 'Añade el caldo y cocina por 20 minutos. Añade las espinacas al final y cocina por 2 minutos más.'
          }
        ]
      }
    }
    
    // All ingredients for pantry
    const allIngredients = ref([
      { id: 1, name: 'Tomate', category: 'verduras', image: 'https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 2, name: 'Cebolla', category: 'verduras', image: 'https://images.unsplash.com/photo-1597937081593-0ddc5f66deb0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 3, name: 'Pollo', category: 'proteinas', image: 'https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 4, name: 'Arroz', category: 'granos', image: 'https://images.unsplash.com/photo-1651793371427-ad065df0d208?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 5, name: 'Leche', category: 'lacteos', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 6, name: 'Huevos', category: 'proteinas', image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 7, name: 'Pan', category: 'granos', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 8, name: 'Queso', category: 'lacteos', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 9, name: 'Plátano', category: 'frutas', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 10, name: 'Manzana', category: 'frutas', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 11, name: 'Zanahoria', category: 'verduras', image: 'https://images.unsplash.com/photo-1598170845058-78132e1b46d0?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' },
      { id: 12, name: 'Aceite', category: 'condimentos', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200' }
    ])
    
    // New ingredient data
    const newIngredientData = reactive({
      category: 'verduras',
      quantity: 1,
      unit: 'unidades',
      expiryDays: null,
      notes: ''
    })
    
    // Computed
    const filteredMeals = computed(() => {
      return allMeals.value.filter(meal => meal.type === currentMealType.value)
    })
    
    const filteredIngredientList = computed(() => {
      if (!ingredientSearch.value) return allIngredients.value
      return allIngredients.value.filter(ingredient =>
        ingredient.name.toLowerCase().includes(ingredientSearch.value.toLowerCase())
      )
    })
    
    // Methods
    
    // Recipe Modal
    const openRecipeModal = (recipeKey) => {
      currentRecipe.value = recipes[recipeKey] || recipes.breakfast
      showRecipeModal.value = true
      currentStep.value = 0
      isFavorite.value = false
    }
    
    const closeRecipeModal = () => {
      showRecipeModal.value = false
    }
    
    const nextStep = () => {
      if (currentStep.value < currentRecipe.value.steps.length - 1) {
        currentStep.value++
      }
    }
    
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }
    
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      alert(isFavorite.value ? 'Receta agregada a favoritos' : 'Receta eliminada de favoritos')
    }
    
    const addToShoppingList = () => {
      alert('Ingredientes agregados a la lista de compras')
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
    
    const confirmMealChange = () => {
      if (selectedMeal.value) {
        alert(`Comida cambiada a: ${selectedMeal.value.title}`)
        closeChangeMealModal()
      }
    }
    
    // Generate Menu Modal
    const openGenerateMenuModal = () => {
      showGenerateMenuModal.value = true
      menuPreferences.dietary = []
    }
    
    const closeGenerateMenuModal = () => {
      showGenerateMenuModal.value = false
    }
    
    const generateNewMenu = () => {
      // Simulate generating a new menu based on preferences
      alert('Generando nuevo menú según tus preferencias...')
      // In a real app, this would call an API or algorithm
    }
    
    const applyGeneratedMenu = () => {
      alert('Nuevo menú aplicado exitosamente')
      closeGenerateMenuModal()
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
      // Filtering is handled by computed property
    }
    
    const selectIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      showAddIngredientModal.value = false
      showIngredientDetailsModal.value = true
      
      // Reset form
      newIngredientData.category = ingredient.category
      newIngredientData.quantity = 1
      newIngredientData.unit = 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }
    
    // Ingredient Details Modal
    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
    }
    
    const addIngredientToPantry = () => {
      alert(`${selectedIngredient.value.name} agregado a la despensa\n\n` +
            `Cantidad: ${newIngredientData.quantity} ${newIngredientData.unit}\n` +
            `Categoría: ${newIngredientData.category}\n` +
            (newIngredientData.expiryDays ? `Vence en: ${newIngredientData.expiryDays} días\n` : '') +
            (newIngredientData.notes ? `Notas: ${newIngredientData.notes}` : ''))
      closeIngredientDetailsModal()
    }
    
    // Weather Recipe Modal
    const openWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = true
    }
    
    const closeWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = false
    }
    
    // Pantry actions
    const decreaseQuantity = (ingredient) => {
      alert(`Cantidad disminuida de: ${ingredient}`)
    }
    
    const increaseQuantity = (ingredient) => {
      alert(`Cantidad aumentada de: ${ingredient}`)
    }
    
    const removeIngredient = (ingredient) => {
      if (confirm(`¿Estás seguro de que quieres eliminar ${ingredient} de tu despensa?`)) {
        alert(`${ingredient} eliminado de la despensa`)
      }
    }
    
    // Original methods
    const goToRecipes = () => {
      router.push('/recetas')
    }
    
    const handleNotification = (notification) => {
      console.log('Notificación clickeada:', notification)
      
      switch (notification.type) {
        case 'alert':
          alert('Esta notificación alerta sobre ingredientes próximos a caducar')
          break
        case 'recipe':
          openRecipeModal('soup')
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
      console.log('Logout')
      router.push('/login')
    }
    
    return {
      isMobileMenuOpen,
      notifications,
      
      // Modal states
      showRecipeModal,
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showWeatherRecipeModal,
      
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
</style>
