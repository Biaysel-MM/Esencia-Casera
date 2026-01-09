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

            <!-- Pestañas de vista -->
            <div class="view-tabs">
              <button class="tab-btn" :class="{ active: currentView === 'weekly' }" @click="currentView = 'weekly'">
                <span class="iconify" data-icon="mdi:calendar-week"></span>
                Vista Semanal
              </button>
              <button class="tab-btn" :class="{ active: currentView === 'monthly' }" @click="currentView = 'monthly'">
                <span class="iconify" data-icon="mdi:calendar-month"></span>
                Vista Mensual
              </button>
            </div>

            <!-- Vista Semanal -->
            <!-- REEMPLAZA TODO el weekly-view (desde línea ~210) -->
            <div v-if="currentView === 'weekly'" class="weekly-view-simple">
              <!-- Grid del planificador simplificado -->
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
                      @dragover.prevent @drop="handleDrop(day.date, mealType.key, $event)" @dragenter="handleDragEnter"
                      @dragleave="handleDragLeave">
                      <div class="meal-slot-header">
                        <div class="meal-type">
                          <span class="iconify" :data-icon="mealType.icon"></span>
                          <span>{{ mealType.label }}</span>
                          <span class="meal-time">{{ mealType.time }}</span>
                        </div>
                        <button class="add-meal-btn-small" @click="openRecipeSelection(day.date, mealType.key)"
                          title="Agregar comida">
                          <span class="iconify" data-icon="mdi:plus"></span>
                        </button>
                      </div>

                      <div v-if="getMealForSlot(day.date, mealType.key)" class="meal-content-responsive"
                        draggable="true" @dragstart="handleDragStart(day.date, mealType.key, $event)"
                        @click="openMealModal(day.date, mealType.key)">
                        <button class="remove-btn-small" @click.stop="removeMeal(day.date, mealType.key)"
                          title="Eliminar">
                          <span class="iconify" data-icon="mdi:close"></span>
                        </button>

                        <div class="meal-preview">
                          <div class="meal-preview-image">
                            <img
                              :src="getMealForSlot(day.date, mealType.key)?.recipe?.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'"
                              :alt="getMealForSlot(day.date, mealType.key)?.recipe?.title" @error="handleImageError">
                          </div>
                          <div class="meal-preview-info">
                            <p class="meal-preview-name">
                              {{ getMealForSlot(day.date, mealType.key)?.recipe?.title || getMealForSlot(day.date,
                                mealType.key)?.name || 'Comida rápida' }}
                            </p>
                            <div v-if="getMealForSlot(day.date, mealType.key)?.recipe" class="meal-preview-details">
                              <span>⏱️ {{ (getMealForSlot(day.date, mealType.key)?.recipe?.prep_time || 0) +
                                (getMealForSlot(day.date, mealType.key)?.recipe?.cook_time || 0) }} min</span>
                            </div>
                            <div v-if="getMealForSlot(day.date, mealType.key)?.isOutside" class="outside-badge-small">
                              <span class="iconify" data-icon="mdi:map-marker"></span>
                              Fuera
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-else class="empty-slot" @click="openRecipeSelection(day.date, mealType.key)"
                        @dragover.prevent @drop="handleDrop(day.date, mealType.key, $event)">
                        <span class="iconify" data-icon="mdi:plus-circle-outline"></span>
                        <p>Agregar {{ mealType.label.toLowerCase() }}</p>
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

    <!-- MODALES -->

    <!-- Modal de selección de recetas -->
    <div v-if="showRecipeModal" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content recipe-selection-modal" @click.stop>
        <button class="modal-close" @click="closeRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <div class="modal-header">
          <h3 class="modal-title">Planificar comida para {{ formatDate(selectedDay) }}</h3>
          <p class="modal-description">{{ formatMealType(selectedMeal) }} - {{ getMealTime(selectedMeal) }}</p>
        </div>

        <!-- Opciones rápidas -->
        <div class="quick-options">
          <button class="outside-option-btn" @click="setOutsideMeal">
            <span class="iconify" data-icon="mdi:map-marker"></span>
            <div class="outside-option-info">
              <p class="outside-option-title">Marcar como salida</p>
              <p class="outside-option-desc">No comeré en casa</p>
            </div>
          </button>

          <button class="quick-recipe-btn" @click="openQuickRecipeModal">
            <span class="iconify" data-icon="mdi:lightning-bolt"></span>
            <div class="quick-option-info">
              <p class="quick-option-title">Comida rápida</p>
              <p class="quick-option-desc">Sin receta específica</p>
            </div>
          </button>
        </div>

        <!-- Lista de recetas -->
        <div class="modal-recipes-section">
          <div class="section-header">
            <h4>Seleccionar receta</h4>
            <button class="view-all-btn" @click="goToRecipes">
              Ver todas
              <span class="iconify" data-icon="mdi:chevron-right"></span>
            </button>
          </div>

          <div v-if="loadingRecipes" class="loading-state">
            <span class="iconify loading-icon" data-icon="mdi:loading"></span>
            Cargando recetas...
          </div>

          <div v-else class="recipes-scroll-container">
            <div class="recipes-grid">
              <div v-for="recipe in modalRecipes" :key="recipe.id" class="recipe-option-card"
                @click="selectRecipeForSlot(recipe)">
                <div class="recipe-option-image">
                  <img
                    :src="recipe.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'"
                    :alt="recipe.title" @error="handleImageError">
                  <div class="recipe-option-badge">{{ formatCategory(recipe.category) }}</div>
                </div>
                <div class="recipe-option-info">
                  <h4>{{ recipe.title }}</h4>
                  <div class="recipe-option-details">
                    <span>⏱️ {{ recipe.prep_time + recipe.cook_time }} min</span>
                    <span>👥 {{ recipe.servings }} porciones</span>
                  </div>
                  <div class="recipe-option-tags">
                    <span v-if="recipe.is_vegetarian" class="tag vegetarian">🌿 Veg</span>
                    <span v-if="recipe.is_healthy" class="tag healthy">🥗 Salud</span>
                    <span v-if="recipe.is_quick" class="tag quick">⚡ Ráp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de comida rápida -->
    <div v-if="showQuickRecipeModal" class="modal-overlay" @click="closeQuickRecipeModal">
      <div class="modal-content quick-recipe-modal" @click.stop>
        <button class="modal-close" @click="closeQuickRecipeModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Comida Rápida</h2>

        <div class="quick-recipe-form">
          <div class="form-group">
            <label>Nombre de la comida *</label>
            <input type="text" v-model="quickMealData.name" class="form-input"
              placeholder="Ej: Pizza, Hamburguesas, Sándwiches" required>
          </div>

          <div class="form-group">
            <label>Tipo de comida *</label>
            <select v-model="quickMealData.type" class="form-select" required>
              <option value="">Seleccionar tipo</option>
              <option value="comida_rapida">Comida rápida</option>
              <option value="delivery">Delivery/Pedido</option>
              <option value="restaurante">Restaurante</option>
              <option value="reunion_familiar">Reunión familiar</option>
              <option value="evento_especial">Evento especial</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea v-model="quickMealData.notes" class="form-textarea"
              placeholder="Ej: Pedir por Glovo, llevar postre, etc." rows="3"></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeQuickRecipeModal">Cancelar</button>
          <button class="modal-btn confirm-btn" @click="saveQuickMeal" :disabled="!quickMealData.name">
            Agregar al planificador
          </button>
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
                <input type="checkbox" v-model="generationPreferences.vegetarian">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Incluir opciones vegetarianas</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="generationPreferences.healthy">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Priorizar opciones saludables</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="generationPreferences.quick">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Incluir comidas rápidas</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="generationPreferences.variety">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Maximizar variedad</span>
              </label>
            </div>
            <div class="preference-item">
              <label class="preference-label">
                <input type="checkbox" v-model="generationPreferences.usePantry">
                <span class="checkbox-custom"></span>
                <span class="preference-text">Usar ingredientes disponibles</span>
              </label>
            </div>
          </div>
        </div>

        <div class="weekdays-section">
          <h3>Días a planificar</h3>
          <div class="weekdays-grid">
            <div v-for="day in weekDays" :key="day.date" class="weekday-item">
              <label class="weekday-label">
                <input type="checkbox" v-model="generationPreferences.selectedDays[day.name]" :checked="true">
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
            <div v-for="meal in generatedWeeklyMenu" :key="`${meal.date}-${meal.type}`" class="preview-meal">
              <div class="preview-meal-header">
                <h4>{{ formatDayName(meal.date) }}</h4>
                <span class="meal-type-badge">{{ formatMealType(meal.type) }}</span>
              </div>
              <div class="preview-meal-content">
                <img
                  :src="meal.recipe?.image_url || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'"
                  :alt="meal.recipe?.title || 'Comida rápida'" @error="handleImageError">
                <div class="preview-meal-info">
                  <h5>{{ meal.recipe?.title || meal.name || 'Sin asignar' }}</h5>
                  <div v-if="meal.recipe" class="preview-meal-details">
                    <span>⏱️ {{ meal.recipe.prep_time + meal.recipe.cook_time }} min</span>
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
        <p class="modal-subtitle">Ingredientes necesarios para la semana {{ formatWeekRange() }}</p>

        <div v-if="loadingShoppingList" class="loading-state">
          <span class="iconify loading-icon" data-icon="mdi:loading"></span>
          Generando lista de compras...
        </div>

        <div v-else class="shopping-list-content">
          <div class="shopping-list-stats">
            <div class="stat-item">
              <span class="stat-label">Total ingredientes</span>
              <span class="stat-value">{{ shoppingList.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Recetas incluidas</span>
              <span class="stat-value">{{ shoppingListStats.recipes }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Categorías</span>
              <span class="stat-value">{{ shoppingListStats.categories }}</span>
            </div>
          </div>

          <div class="shopping-list-items">
            <div v-for="category in groupedShoppingList" :key="category.name" class="category-section">
              <h4 class="category-title">{{ category.name }}</h4>
              <div class="category-items">
                <div v-for="item in category.items" :key="item.id" class="shopping-item">
                  <label class="item-label">
                    <input type="checkbox" v-model="item.purchased" @change="updateShoppingItem(item)">
                    <span class="checkbox-custom"></span>
                    <span class="item-name" :class="{ purchased: item.purchased }">{{ item.name }}</span>
                  </label>
                  <div class="item-quantity">
                    <span class="quantity-value">{{ item.quantity }}</span>
                    <span class="quantity-unit">{{ item.unit }}</span>
                    <button class="item-delete-btn" @click="removeShoppingItem(item)">
                      <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                    </button>
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
          <button class="modal-btn add-all-btn" @click="addAllToShoppingList">
            <span class="iconify" data-icon="mdi:cart-plus"></span>
            Agregar todos a lista
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
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
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food' },
      { key: 'snack', label: 'Merienda', time: '4:00 PM', icon: 'mdi:coffee' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent' }
    ]

    const weekMeals = ref([])
    const isSelectingRecipe = ref(false)
    const selectedDay = ref('')
    const selectedMeal = ref('')

    // Modales
    const showGenerateWeeklyModal = ref(false)
    const showShoppingListModal = ref(false)
    const generatedWeeklyMenu = ref([])
    const shoppingList = ref([])

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

    // Generación de semana
    const currentWeekStart = ref(new Date())
    const weekDays = computed(() => {
      const daysArray = []
      const startDate = new Date(currentWeekStart.value)
      
      // Ajustar al lunes
      const dayOfWeek = startDate.getDay()
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      startDate.setDate(diff)
      
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        daysArray.push({
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          day: date.getDate()
        })
      }
      
      return daysArray
    })

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

    // Funciones de navegación semanal
    const previousWeek = () => {
      const date = new Date(currentWeekStart.value)
      date.setDate(date.getDate() - 7)
      currentWeekStart.value = date
    }

    const nextWeek = () => {
      const date = new Date(currentWeekStart.value)
      date.setDate(date.getDate() + 7)
      currentWeekStart.value = date
    }

    const goToCurrentWeek = () => {
      currentWeekStart.value = new Date()
    }

    // Funciones helper
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    const formatWeekRange = () => {
      if (weekDays.value.length === 0) return ''
      
      const firstDay = new Date(weekDays.value[0].date)
      const lastDay = new Date(weekDays.value[6].date)
      
      const firstFormatted = firstDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      const lastFormatted = lastDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      
      return `Semana del ${firstFormatted} al ${lastFormatted}`
    }

    const getMealTypeLabel = (mealKey) => {
      const meal = mealTypes.find(m => m.key === mealKey)
      return meal ? meal.label : mealKey
    }

    // Funciones de generación de menú
    const generateWeeklyMenu = () => {
      showGenerateWeeklyModal.value = true
      generatedWeeklyMenu.value = []
    }

    const closeGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = false
    }

    const generateDayMenu = (date) => {
      const dayName = weekDays.value.find(d => d.date === date)?.name
      if (!dayName) return
      
      // Generar menú para el día con recetas aleatorias
      mealTypes.forEach(mealType => {
        if (!getMealForSlot(dayName, mealType.key)) {
          // Buscar receta apropiada para este tipo de comida
          const suitableRecipes = allRecipes.value.filter(recipe => 
            recipe.type.toLowerCase().includes(mealType.label.toLowerCase())
          )
          
          if (suitableRecipes.length > 0) {
            const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
            weekMeals.value.push({
              day: dayName,
              meal: mealType.key,
              recipe: randomRecipe,
              isOutside: false
            })
          }
        }
      })
    }

    const generateWeekPreview = () => {
      generatedWeeklyMenu.value = []
      
      weekDays.value.forEach(day => {
        if (generationPreferences.selectedDays[day.name.toLowerCase()]) {
          mealTypes.forEach(mealType => {
            const existingMeal = getMealForSlot(day.name, mealType.key)
            if (existingMeal) {
              generatedWeeklyMenu.value.push(existingMeal)
            } else {
              // Buscar receta aleatoria
              const suitableRecipes = allRecipes.value.filter(recipe => 
                recipe.type.toLowerCase().includes(mealType.label.toLowerCase())
              )
              
              if (suitableRecipes.length > 0) {
                const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
                generatedWeeklyMenu.value.push({
                  day: day.name,
                  meal: mealType.key,
                  recipe: randomRecipe,
                  isOutside: false
                })
              }
            }
          })
        }
      })
    }

    const applyGeneratedWeeklyMenu = () => {
      // Reemplazar las comidas existentes con las generadas
      generatedWeeklyMenu.value.forEach(meal => {
        // Eliminar comida existente para este slot
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === meal.day && m.meal === meal.meal)
        )
        
        // Agregar la nueva comida
        weekMeals.value.push(meal)
      })
      
      closeGenerateWeeklyModal()
    }

    // Funciones de lista de compras
    const generateShoppingList = () => {
      showShoppingListModal.value = true
      generateShoppingListData()
    }

    const closeShoppingListModal = () => {
      showShoppingListModal.value = false
    }

    const generateShoppingListData = () => {
      // Simular generación de lista de compras
      shoppingList.value = [
        { id: 1, name: 'Tomates', quantity: 3, unit: 'unidades', category: 'verduras', purchased: false },
        { id: 2, name: 'Cebolla', quantity: 2, unit: 'unidades', category: 'verduras', purchased: false },
        { id: 3, name: 'Pechuga de pollo', quantity: 500, unit: 'gramos', category: 'proteínas', purchased: false },
        { id: 4, name: 'Arroz', quantity: 1, unit: 'kilo', category: 'granos', purchased: true },
        { id: 5, name: 'Leche', quantity: 1, unit: 'litro', category: 'lácteos', purchased: false },
        { id: 6, name: 'Huevos', quantity: 12, unit: 'unidades', category: 'proteínas', purchased: false },
        { id: 7, name: 'Manzanas', quantity: 6, unit: 'unidades', category: 'frutas', purchased: false },
        { id: 8, name: 'Aceite de oliva', quantity: 1, unit: 'botella', category: 'aceites', purchased: true }
      ]
    }

    const groupedShoppingList = computed(() => {
      const groups = {}
      
      shoppingList.value.forEach(item => {
        if (!groups[item.category]) {
          groups[item.category] = {
            name: formatCategory(item.category),
            items: []
          }
        }
        groups[item.category].items.push(item)
      })
      
      return Object.values(groups)
    })

    const shoppingListStats = computed(() => {
      const recipes = new Set(weekMeals.value.filter(meal => meal.recipe).map(meal => meal.recipe.id))
      
      return {
        recipes: recipes.size,
        total: shoppingList.value.length
      }
    })

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

    const exportShoppingList = () => {
      const listText = shoppingList.value
        .map(item => `${item.purchased ? '[x]' : '[ ]'} ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n')
      
      const blob = new Blob([listText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAxNTBIMzAwVjEwMEgzNTBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    // Inicializar
    onMounted(() => {
      // Generar algunos datos de ejemplo
      generateShoppingListData()
    })

    return {
      isMobileMenuOpen,
      days,
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
      getMealTypeLabel,
      
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

.recipe-drag-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-drag-info {
  flex: 1;
  min-width: 0;
}

.recipe-drag-info h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-drag-details {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.recipe-drag-tags {
  display: flex;
  gap: 4px;
}

.tag {
  font-size: 0.625rem;
  padding: 2px 6px;
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
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

/* Vista mensual */
.monthly-view {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.month-header {
  padding: 20px;
  background-color: rgba(168, 213, 186, 0.2);
  border-bottom: 1px solid var(--border);
}

.month-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
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

.recipe-selection-modal {
  max-width: 900px;
  padding: 0;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  position: relative;
  background-color: var(--card);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

.modal-description {
  font-size: 0.875rem;
  color: var(--muted-foreground);
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

/* Opciones rápidas */
.quick-options {
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--border);
}

.outside-option-btn,
.quick-recipe-btn {
  flex: 1;
  background-color: rgba(168, 213, 186, 0.2);
  border: 2px dashed var(--border);
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
  border-color: var(--secondary);
  transform: translateY(-1px);
}

.quick-recipe-btn:hover {
  background-color: rgba(139, 92, 246, 0.1);
  border-color: #8b5cf6;
  transform: translateY(-1px);
}

.outside-option-btn .iconify,
.quick-recipe-btn .iconify {
  width: 24px;
  height: 24px;
}

.outside-option-btn .iconify {
  color: var(--secondary);
}

.quick-recipe-btn .iconify {
  color: #8b5cf6;
}

.quick-option-info,
.outside-option-info {
  text-align: left;
}

.outside-option-title,
.quick-option-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 2px;
}

.outside-option-desc,
.quick-option-desc {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* ============================================
   NUEVOS ESTILOS RESPONSIVE
   ============================================ */

/* Panel de recetas en móvil (arriba) */
.mobile-top {
  display: none;
}

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
}

.meal-slot:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.meal-slot.drag-over {
  background-color: rgba(93, 162, 113, 0.2);
  border: 2px dashed var(--primary);
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
  cursor: move;
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

/* Vista mensual responsive */
.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgba(168, 213, 186, 0.2);
  border-bottom: 1px solid var(--border);
}

.month-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.month-nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.month-nav-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

.month-nav-btn .iconify {
  width: 20px;
  height: 20px;
  color: var(--foreground);
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgba(168, 213, 186, 0.1);
  border-bottom: 1px solid var(--border);
}

.weekday {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.month-grid-responsive {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border);
}

.month-day-responsive {
  background-color: var(--card);
  min-height: 120px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.month-day-responsive:hover {
  background-color: rgba(168, 213, 186, 0.05);
}

.month-day-responsive.current-month {
  background-color: var(--card);
}

.month-day-responsive:not(.current-month) {
  background-color: rgba(168, 213, 186, 0.05);
  opacity: 0.7;
}

.month-day-responsive.today {
  background-color: rgba(93, 162, 113, 0.1);
  border: 2px solid var(--primary);
}

.day-header-responsive {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.today-badge {
  background-color: var(--primary);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.day-meals-responsive {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.month-meal-responsive {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: rgba(168, 213, 186, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.month-meal-responsive:hover {
  background-color: rgba(168, 213, 186, 0.3);
}

.meal-icon-responsive {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-icon-responsive .iconify {
  width: 12px;
  height: 12px;
  color: var(--primary);
}

.meal-name-responsive {
  font-size: 9px;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.add-meal-month-btn {
  width: 100%;
  height: 24px;
  border: 1px dashed var(--border);
  border-radius: 6px;
  background-color: rgba(168, 213, 186, 0.1);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.add-meal-month-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: rgba(168, 213, 186, 0.2);
}

.add-meal-month-btn .iconify {
  width: 12px;
  height: 12px;
}

.month-summary {
  margin-top: 24px;
  padding: 20px;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.month-summary h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.summary-stats .stat-item {
  text-align: center;
}

.summary-stats .stat-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 4px;
}

.summary-stats .stat-label {
  display: block;
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Mostrar/ocultar según dispositivo */
.desktop-only {
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .weekly-view {
    flex-direction: column;
  }

  .mobile-top {
    display: block;
    margin-bottom: 24px;
  }

  .mobile-top .recipes-scroll {
    display: none;
    /* Ocultar la lista en móvil para no duplicar */
  }

  .desktop-only {
    display: none;
  }

  .planificador-grid-responsive {
    grid-template-columns: 1fr;
  }

  .month-grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }

  .weekdays-header {
    grid-template-columns: repeat(2, 1fr);
  }

  .weekday:nth-child(n+3) {
    display: none;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }

  .month-grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1025px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }

  .weekly-view {
    flex-direction: row;
  }

  .recipes-sidebar.desktop-only {
    width: 300px;
    display: block;
  }
}

/* Sección de recetas en modal */
.modal-recipes-section {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background-color: rgba(93, 162, 113, 0.1);
  border-color: var(--primary);
}

.recipes-scroll-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.recipe-option-card {
  background-color: white;
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

.recipe-option-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: var(--primary);
  color: white;
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
  margin-bottom: 8px;
}

.recipe-option-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* Modal de comida rápida */
.quick-recipe-modal {
  max-width: 500px;
  padding: 2rem;
}

.quick-recipe-form {
  margin: 2rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--foreground);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Modal de generación semanal */
.generate-weekly-modal {
  max-width: 900px;
  padding: 2rem;
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

/* Modal de lista de compras */
.shopping-list-modal {
  max-width: 800px;
  padding: 2rem;
}

.modal-subtitle {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

.shopping-list-content {
  margin: 2rem 0;
}

.shopping-list-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.item-delete-btn {
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
  margin-left: 0.5rem;
}

.item-delete-btn:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
}

.item-delete-btn .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--destructive);
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

.add-all-btn {
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-all-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

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
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

/* Responsive */
@media (max-width: 1200px) {
  .weekly-view {
    flex-direction: column;
  }

  .recipes-sidebar {
    width: 100%;
    margin-top: 24px;
  }

  .recipes-scroll {
    max-height: 300px;
  }
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

  /* Layout responsive */
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

  /* Monthly view responsive */
  .month-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Modal responsive */
  .modal-content {
    margin: 1rem;
    max-height: 85vh;
  }

  .quick-options {
    flex-direction: column;
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
  .view-tabs {
    flex-direction: column;
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

@media (min-width: 769px) {
  .planificador-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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