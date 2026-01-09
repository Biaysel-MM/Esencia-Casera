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
<<<<<<< HEAD
=======
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
>>>>>>> versionAntigua
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

<<<<<<< HEAD
            <!-- Vista Mensual -->
            <!-- REEMPLAZA la vista mensual (desde línea ~350) -->
            <div v-else class="monthly-view-simple">
              <div class="month-header">
                <button @click="previousMonth" class="month-nav-btn">
                  <span class="iconify" data-icon="mdi:chevron-left"></span>
                </button>
                <h3>{{ currentMonthYear }}</h3>
                <button @click="nextMonth" class="month-nav-btn">
                  <span class="iconify" data-icon="mdi:chevron-right"></span>
                </button>
              </div>

              <div class="weekdays-header">
                <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="day" class="weekday">
                  {{ day }}
                </div>
              </div>

              <div class="month-grid-responsive">
                <div v-for="day in monthDays" :key="day.date" class="month-day-responsive"
                  :class="{ 'current-month': day.isCurrentMonth, 'today': isTodayDate(day.date) }"
                  @click="selectDayForQuickAdd(day.date)">
                  <div class="day-header-responsive">
                    <span class="day-number">{{ day.day }}</span>
                    <span v-if="isTodayDate(day.date)" class="today-badge">Hoy</span>
                  </div>

                  <div class="day-meals-responsive">
                    <div v-for="meal in getDayMeals(day.date)" :key="`${day.date}-${meal.type}`"
                      class="month-meal-responsive" @click.stop="openMealModal(day.date, meal.type)">
                      <div class="meal-icon-responsive">
                        <span class="iconify" :data-icon="getMealIcon(meal.type)"></span>
                      </div>
                      <span class="meal-name-responsive">
                        {{ truncateText(meal.recipe?.title || meal.name || '...', 12) }}
                      </span>
                    </div>

                    <button v-if="getDayMeals(day.date).length === 0" class="add-meal-month-btn"
                      @click.stop="openQuickAddForDay(day.date)" title="Agregar comida">
                      <span class="iconify" data-icon="mdi:plus"></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Resumen mensual -->
              <div class="month-summary">
                <h4>Resumen del mes</h4>
                <div class="summary-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ getMonthMealsCount() }}</span>
                    <span class="stat-label">Comidas planificadas</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ getMonthRecipesCount() }}</span>
                    <span class="stat-label">Recetas diferentes</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ getMonthOutsideCount() }}</span>
                    <span class="stat-label">Días fuera</span>
                  </div>
                </div>
=======
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
>>>>>>> versionAntigua
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
<<<<<<< HEAD
import { ref, reactive, computed, onMounted, watch } from 'vue'
=======
import { ref, reactive, computed, onMounted } from 'vue'
>>>>>>> versionAntigua
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { supabase } from '../supabase'

export default {
  name: 'PlanificadorView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const toast = useToast()

    // Layout state
    const isMobileMenuOpen = ref(false)

<<<<<<< HEAD
    // Data
    const currentView = ref('weekly')
    const currentWeekStart = ref(new Date())
    const weekDays = ref([])
    const monthDays = ref([])
    const weeklyPlan = ref([])
    const allRecipes = ref([])
    const filteredRecipes = ref([])
=======
    // Datos del planificador
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food' },
      { key: 'snack', label: 'Merienda', time: '4:00 PM', icon: 'mdi:coffee' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent' }
    ]
>>>>>>> versionAntigua

    // ✅ AÑADE ESTO JUSTO AQUÍ:
    // Variables para navegación mensual
    const currentMonth = ref(new Date().getMonth())
    const currentYear = ref(new Date().getFullYear())

    // Estados de carga
    const loadingWeeklyPlan = ref(false)
    const loadingRecipes = ref(false)
    const loadingShoppingList = ref(false)

    // Estados de modales
    const showRecipeModal = ref(false)
    const showQuickRecipeModal = ref(false)
    const showGenerateWeeklyModal = ref(false)
    const showShoppingListModal = ref(false)

    // Datos seleccionados
    const selectedDay = ref('')
    const selectedMeal = ref('')
    const selectedCategory = ref('all')
    const recipeSearch = ref('')

<<<<<<< HEAD


    // Datos temporales
    const quickMealData = reactive({
      name: '',
      type: '',
      notes: ''
    })

    const generationPreferences = reactive({
      vegetarian: false,
      healthy: false,
      quick: false,
      variety: true,
      usePantry: false,
      selectedDays: {
        lunes: true,
        martes: true,
        miércoles: true,
        jueves: true,
        viernes: true,
        sábado: true,
        domingo: true
=======
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
>>>>>>> versionAntigua
      }
    })

    const generatedWeeklyMenu = ref([])
    const shoppingList = ref([])

    // Tipos de comidas
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent' }
    ]

    // Categorías
    const categories = [
      { key: 'all', label: 'Todas' },
      { key: 'breakfast', label: 'Desayuno' },
      { key: 'lunch', label: 'Almuerzo' },
      { key: 'dinner', label: 'Cena' },
      { key: 'vegetarian', label: 'Vegetariano' },
      { key: 'healthy', label: 'Saludable' },
      { key: 'quick', label: 'Rápido' }
    ]

    // Computed properties

    // CON ESTO:
    const currentMonthYear = computed(() => {
      const date = new Date(currentYear.value, currentMonth.value, 1)
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    })



    const modalRecipes = computed(() => {
      let filtered = allRecipes.value

      if (selectedMeal.value) {
        filtered = filtered.filter(recipe => recipe.category === selectedMeal.value)
      }

      return filtered.slice(0, 12)
    })

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
      const categories = new Set(shoppingList.value.map(item => item.category))
      const recipes = new Set(shoppingList.value.map(item => item.recipe_id).filter(Boolean))

      return {
        categories: categories.size,
        recipes: recipes.size,
        total: shoppingList.value.length
      }
    })

    // Helper functions
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
        'otros': 'Otros'
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

    const formatDayName = (dateString) => {
      const date = new Date(dateString)
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      return days[date.getDay()]
    }

    const getMealTime = (type) => {
      const meal = mealTypes.find(m => m.key === type)
      return meal ? meal.time : ''
    }

    const getMealIcon = (type) => {
      const meal = mealTypes.find(m => m.key === type)
      return meal ? meal.icon : 'mdi:food'
    }

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
      try {
        await supabase.auth.signOut()
        router.push('/login')
      } catch (error) {
        console.error('Error logging out:', error)
        toast.error('Error al cerrar sesión')
      }
    }

    // Funciones del planificador
    const generateWeekDays = () => {
      const days = []
      const startDate = new Date(currentWeekStart.value)

      // Ajustar al lunes
      const dayOfWeek = startDate.getDay()
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      startDate.setDate(diff)

      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        days.push({
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          day: date.getDate()
        })
      }

      weekDays.value = days
      generateMonthDays() // Esto llamará a la nueva función
    }

    // ✅ AÑADE TODAS ESTAS FUNCIONES JUSTO AQUÍ:

    // 1. Función para verificar si es hoy
    const isTodayDate = (dateString) => {
      const today = new Date().toISOString().split('T')[0]
      return dateString === today
    }

    // 2. Función para truncar texto
    const truncateText = (text, maxLength) => {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    // 3. Nueva función generateMonthDays (reemplaza la anterior)
    const generateMonthDays = () => {
      const days = []
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

      // Empezar desde el domingo anterior
      const startDate = new Date(firstDay)
      startDate.setDate(firstDay.getDate() - firstDay.getDay())

      while (days.length < 42) { // 6 semanas
        const dayDate = new Date(startDate)
        dayDate.setDate(startDate.getDate() + days.length)

        days.push({
          name: dayNames[dayDate.getDay()],
          date: dayDate.toISOString().split('T')[0],
          day: dayDate.getDate(),
          isCurrentMonth: dayDate.getMonth() === currentMonth.value
        })
      }

      monthDays.value = days
    }

    // 4. Navegación mensual
    const previousMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
      generateMonthDays()
    }

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
      generateMonthDays()
    }

    // 5. Funciones para el calendario
    const selectDayForQuickAdd = (date) => {
      // Puedes cambiar a vista semanal o hacer otra acción
      console.log('Día seleccionado:', date)
    }

    const openQuickAddForDay = (date) => {
      selectedDay.value = date
      showRecipeModal.value = true
    }

    // 6. Estadísticas mensuales
    const getMonthMealsCount = () => {
      const monthStart = new Date(currentYear.value, currentMonth.value, 1)
        .toISOString().split('T')[0]
      const monthEnd = new Date(currentYear.value, currentMonth.value + 1, 0)
        .toISOString().split('T')[0]

      return weeklyPlan.value.filter(meal =>
        meal.date >= monthStart && meal.date <= monthEnd
      ).length
    }

    const getMonthRecipesCount = () => {
      const monthStart = new Date(currentYear.value, currentMonth.value, 1)
        .toISOString().split('T')[0]
      const monthEnd = new Date(currentYear.value, currentMonth.value + 1, 0)
        .toISOString().split('T')[0]

      const recipes = new Set(
        weeklyPlan.value
          .filter(meal => meal.date >= monthStart && meal.date <= monthEnd && meal.recipe_id)
          .map(meal => meal.recipe_id)
      )

      return recipes.size
    }

    const getMonthOutsideCount = () => {
      const monthStart = new Date(currentYear.value, currentMonth.value, 1)
        .toISOString().split('T')[0]
      const monthEnd = new Date(currentYear.value, currentMonth.value + 1, 0)
        .toISOString().split('T')[0]

      return weeklyPlan.value.filter(meal =>
        meal.date >= monthStart && meal.date <= monthEnd && meal.isOutside
      ).length
    }


    const getMealForSlot = (date, mealType) => {
      return weeklyPlan.value.find(
        meal => meal.date === date && meal.type === mealType
      )
    }

    const getDayMeals = (date) => {
      return weeklyPlan.value.filter(meal => meal.date === date).slice(0, 2)
    }

    const openRecipeSelection = (date, mealType) => {
      selectedDay.value = date
      selectedMeal.value = mealType
      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      selectedDay.value = ''
      selectedMeal.value = ''
    }

    const openQuickRecipeModal = () => {
      showRecipeModal.value = false
      showQuickRecipeModal.value = true

      // Reset form
      Object.assign(quickMealData, {
        name: '',
        type: '',
        notes: ''
      })
    }

    const closeQuickRecipeModal = () => {
      showQuickRecipeModal.value = false
    }

    const openMealModal = (date, mealType) => {
      const meal = getMealForSlot(date, mealType)
      if (meal) {
        if (meal.recipe) {
          router.push(`/receta/${meal.recipe.id}`)
        }
      }
    }

    const openGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = true
      generatedWeeklyMenu.value = []
    }

    const closeGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = false
    }

    const openShoppingListModal = () => {
      showShoppingListModal.value = true
      generateShoppingListData()
    }

    const closeShoppingListModal = () => {
      showShoppingListModal.value = false
    }

    // Funciones de navegación
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

    // Funciones de arrastrar y soltar
    const handleDragStart = (date, mealType, event) => {
      const meal = getMealForSlot(date, mealType)
      if (meal) {
        event.dataTransfer.setData('text/plain', JSON.stringify({
          type: 'meal',
          date: date,
          mealType: mealType,
          meal: meal
        }))
      }
    }

    const handleRecipeDragStart = (recipe, event) => {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'recipe',
        recipe: recipe
      }))
    }

    const handleDragEnter = (event) => {
      event.target.classList.add('drag-over')
    }

    const handleDragLeave = (event) => {
      event.target.classList.remove('drag-over')
    }

    const handleDrop = (date, mealType, event) => {
      event.target.classList.remove('drag-over')
      event.preventDefault()

      try {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'))

        if (data.type === 'recipe') {
          selectRecipeForSlot(data.recipe)
        } else if (data.type === 'meal') {
          moveMeal(data.meal, date, mealType)
        }
      } catch (error) {
        console.error('Error al procesar drop:', error)
      }
    }

    const moveMeal = async (meal, newDate, newMealType) => {
      try {
        // Remove from old slot
        weeklyPlan.value = weeklyPlan.value.filter(
          m => !(m.date === meal.date && m.type === meal.type)
        )

        // Add to new slot
        meal.date = newDate
        meal.type = newMealType
        weeklyPlan.value.push(meal)

        // Save to database
        await saveWeeklyPlan()

        toast.success('Comida movida exitosamente')
      } catch (error) {
        console.error('Error moving meal:', error)
        toast.error('Error al mover la comida')
      }
    }

    // Funciones de recetas
    const selectRecipeForSlot = async (recipe) => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Remove existing meal for this slot
        weeklyPlan.value = weeklyPlan.value.filter(
          m => !(m.date === selectedDay.value && m.type === selectedMeal.value)
        )

        // Add new meal
        weeklyPlan.value.push({
          date: selectedDay.value,
          type: selectedMeal.value,
          recipe: recipe,
          recipe_id: recipe.id,
          isOutside: false,
          user_id: user.id
        })

        // Save to database
        await saveWeeklyPlan()

        toast.success(`${recipe.title} agregado al planificador`)
        closeRecipeModal()
      } catch (error) {
        console.error('Error selecting recipe:', error)
        toast.error('Error al agregar la receta')
      }
    }

    const selectRecipeForModal = (recipe) => {
      // This can be used for quick view or other actions
      console.log('Recipe selected:', recipe)
    }

    const setOutsideMeal = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Remove existing meal for this slot
        weeklyPlan.value = weeklyPlan.value.filter(
          m => !(m.date === selectedDay.value && m.type === selectedMeal.value)
        )

        // Add outside meal
        weeklyPlan.value.push({
          date: selectedDay.value,
          type: selectedMeal.value,
          recipe: null,
          recipe_id: null,
          isOutside: true,
          name: 'Fuera de casa',
          user_id: user.id
        })

        // Save to database
        await saveWeeklyPlan()

        toast.success('Marcado como salida')
        closeRecipeModal()
      } catch (error) {
        console.error('Error setting outside meal:', error)
        toast.error('Error al marcar como salida')
      }
    }

    const saveQuickMeal = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Remove existing meal for this slot
        weeklyPlan.value = weeklyPlan.value.filter(
          m => !(m.date === selectedDay.value && m.type === selectedMeal.value)
        )

        // Add quick meal
        weeklyPlan.value.push({
          date: selectedDay.value,
          type: selectedMeal.value,
          recipe: null,
          recipe_id: null,
          isOutside: false,
          name: quickMealData.name,
          notes: quickMealData.notes,
          quick_type: quickMealData.type,
          user_id: user.id
        })

        // Save to database
        await saveWeeklyPlan()

        toast.success('Comida rápida agregada')
        closeQuickRecipeModal()
        closeRecipeModal()
      } catch (error) {
        console.error('Error saving quick meal:', error)
        toast.error('Error al agregar comida rápida')
      }
    }

    const removeMeal = async (date, mealType) => {
      if (!confirm('¿Estás seguro de que quieres eliminar esta comida del planificador?')) {
        return
      }

      try {
        weeklyPlan.value = weeklyPlan.value.filter(
          m => !(m.date === date && m.type === mealType)
        )

        // Save to database
        await saveWeeklyPlan()

        toast.success('Comida eliminada del planificador')
      } catch (error) {
        console.error('Error removing meal:', error)
        toast.error('Error al eliminar la comida')
      }
    }

    // ✅ AÑADE ESTA FUNCIÓN JUSTO AQUÍ:
    // Generar menú para un día específico
    const generateDayMenu = async (date) => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Obtener recetas para cada tipo de comida del día
        for (const mealType of mealTypes) {
          // Saltar si ya tiene comida
          if (getMealForSlot(date, mealType.key)) continue

          const { data: recipes, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('category', mealType.key)
            .limit(1)

          if (error) throw error

          if (recipes && recipes.length > 0) {
            weeklyPlan.value.push({
              date: date,
              type: mealType.key,
              recipe: recipes[0],
              recipe_id: recipes[0].id,
              isOutside: false,
              user_id: user.id
            })
          }
        }

        await saveWeeklyPlan()
        toast.success('Menú generado para el día')
      } catch (error) {
        console.error('Error generating day menu:', error)
        toast.error('Error al generar el menú')
      }
    }

    // Funciones de generación de menú
    const generateWeeklyMenu = () => {
      openGenerateWeeklyModal()
    }

    const generateWeekPreview = async () => {
      try {
        generatedWeeklyMenu.value = []

        const user = await getCurrentUser()
        if (!user) return

        // Get recipes based on preferences
        let query = supabase
          .from('recipes')
          .select('*')

        if (generationPreferences.vegetarian) {
          query = query.eq('is_vegetarian', true)
        }

        if (generationPreferences.healthy) {
          query = query.eq('is_healthy', true)
        }

        if (generationPreferences.quick) {
          query = query.eq('is_quick', true)
        }

        const { data: recipes, error } = await query

        if (error) throw error

        // Generate menu for selected days
        const daysToPlan = weekDays.value.filter(day =>
          generationPreferences.selectedDays[day.name.toLowerCase()]
        )

        for (const day of daysToPlan) {
          for (const mealType of mealTypes) {
            // Skip if already planned
            const existingMeal = getMealForSlot(day.date, mealType.key)
            if (existingMeal) {
              generatedWeeklyMenu.value.push(existingMeal)
              continue
            }

            // Find recipe for this meal type
            const suitableRecipes = recipes.filter(recipe =>
              recipe.category === mealType.key
            )

            if (suitableRecipes.length > 0) {
              const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]

              generatedWeeklyMenu.value.push({
                date: day.date,
                type: mealType.key,
                recipe: randomRecipe,
                recipe_id: randomRecipe.id,
                isOutside: false,
                user_id: user.id
              })
            }
          }
        }

        toast.success('Menú semanal generado')
      } catch (error) {
        console.error('Error generating weekly menu:', error)
        toast.error('Error al generar el menú')
      }
    }

    const applyGeneratedWeeklyMenu = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Replace existing meals with generated ones
        for (const meal of generatedWeeklyMenu.value) {
          // Remove existing meal for this slot
          weeklyPlan.value = weeklyPlan.value.filter(
            m => !(m.date === meal.date && m.type === meal.type)
          )

          // Add generated meal
          weeklyPlan.value.push(meal)
        }

        // Save to database
        await saveWeeklyPlan()

        toast.success('Menú semanal aplicado exitosamente')
        closeGenerateWeeklyModal()
      } catch (error) {
        console.error('Error applying weekly menu:', error)
        toast.error('Error al aplicar el menú')
      }
    }

    // Funciones de lista de compras
    const generateShoppingList = () => {
      openShoppingListModal()
    }

    const generateShoppingListData = async () => {
      loadingShoppingList.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Get all recipes from weekly plan
        const recipeIds = weeklyPlan.value
          .filter(meal => meal.recipe_id)
          .map(meal => meal.recipe_id)

        if (recipeIds.length === 0) {
          shoppingList.value = []
          return
        }

        // Get ingredients for all recipes
        const { data: ingredients, error } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .in('recipe_id', recipeIds)

        if (error) throw error

        // Group and sum ingredients
        const grouped = {}

        ingredients.forEach(ing => {
          const key = `${ing.name}-${ing.unit || 'unidades'}`

          if (!grouped[key]) {
            grouped[key] = {
              id: ing.id,
              name: ing.name,
              quantity: 0,
              unit: ing.unit || 'unidades',
              category: ing.category || 'otros',
              recipe_id: ing.recipe_id,
              purchased: false
            }
          }

          // Sum quantities (simple approach - in real app, you'd need to parse quantities)
          const quantity = parseFloat(ing.quantity) || 1
          grouped[key].quantity += quantity
        })

        shoppingList.value = Object.values(grouped)
      } catch (error) {
        console.error('Error generating shopping list:', error)
        toast.error('Error al generar la lista de compras')
      } finally {
        loadingShoppingList.value = false
      }
    }

    const updateShoppingItem = async (item) => {
      // In a real app, you'd save this to the database
      console.log('Update shopping item:', item)
    }

    const removeShoppingItem = (item) => {
      shoppingList.value = shoppingList.value.filter(i => i.id !== item.id)
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

      toast.success('Lista exportada')
    }

    const addAllToShoppingList = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const itemsToAdd = shoppingList.value.map(item => ({
          user_id: user.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          is_purchased: false
        }))

        const { error } = await supabase
          .from('shopping_list')
          .insert(itemsToAdd)

        if (error) throw error

        toast.success('Ingredientes agregados a la lista de compras')
        closeShoppingListModal()
      } catch (error) {
        console.error('Error adding to shopping list:', error)
        toast.error('Error al agregar a la lista de compras')
      }
    }

    // Funciones de filtrado
    const filterRecipes = () => {
      let filtered = allRecipes.value

      // Filter by category
      if (selectedCategory.value !== 'all') {
        if (selectedCategory.value === 'vegetarian') {
          filtered = filtered.filter(r => r.is_vegetarian)
        } else if (selectedCategory.value === 'healthy') {
          filtered = filtered.filter(r => r.is_healthy)
        } else if (selectedCategory.value === 'quick') {
          filtered = filtered.filter(r => r.is_quick)
        } else {
          filtered = filtered.filter(r => r.category === selectedCategory.value)
        }
      }

      // Filter by search
      if (recipeSearch.value) {
        const search = recipeSearch.value.toLowerCase()
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search)
        )
      }

      filteredRecipes.value = filtered
    }

    // Funciones de base de datos
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }

    const fetchWeeklyPlan = async () => {
      loadingWeeklyPlan.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Get start and end of current week
        const startDate = new Date(weekDays.value[0].date)
        const endDate = new Date(weekDays.value[6].date)

        const { data, error } = await supabase
          .from('weekly_plan')
          .select(`
            *,
            recipe:recipe_id (*)
          `)
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])

        if (error) throw error

        weeklyPlan.value = data || []
      } catch (error) {
        console.error('Error fetching weekly plan:', error)
        toast.error('Error al cargar el plan semanal')
      } finally {
        loadingWeeklyPlan.value = false
      }
    }

    const saveWeeklyPlan = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Get meals for current week only
        const weekDates = weekDays.value.map(d => d.date)
        const mealsToSave = weeklyPlan.value.filter(meal =>
          weekDates.includes(meal.date)
        )

        // First, delete existing meals for this week
        const startDate = weekDates[0]
        const endDate = weekDates[6]

        await supabase
          .from('weekly_plan')
          .delete()
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        // Then insert new meals
        if (mealsToSave.length > 0) {
          const { error } = await supabase
            .from('weekly_plan')
            .insert(mealsToSave.map(meal => ({
              user_id: user.id,
              date: meal.date,
              type: meal.type,
              recipe_id: meal.recipe_id,
              is_outside: meal.isOutside,
              name: meal.name,
              notes: meal.notes,
              quick_type: meal.quick_type
            })))

          if (error) throw error
        }
      } catch (error) {
        console.error('Error saving weekly plan:', error)
        throw error
      }
    }

    const fetchRecipes = async () => {
      loadingRecipes.value = true
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('title')

        if (error) throw error

        allRecipes.value = data || []
        filteredRecipes.value = data || []
      } catch (error) {
        console.error('Error fetching recipes:', error)
        toast.error('Error al cargar las recetas')
      } finally {
        loadingRecipes.value = false
      }
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

<<<<<<< HEAD
    const goToRecipes = () => {
      router.push('/recetas')
    }

    // Watch for week changes
    watch(currentWeekStart, () => {
      generateWeekDays()
      fetchWeeklyPlan()
    })

    // Initialize
    onMounted(async () => {
      generateWeekDays()
      await Promise.all([
        fetchWeeklyPlan(),
        fetchRecipes()
      ])
    })

    // Necesitamos crear la tabla weekly_plan si no existe
    const createWeeklyPlanTable = async () => {
      try {
        const { error } = await supabase.rpc('create_weekly_plan_table')
        if (error) throw error
      } catch (error) {
        console.error('Error creating weekly plan table:', error)
      }
    }



    return {
      isMobileMenuOpen,
      currentView,
      weekDays,
      monthDays,
      weeklyPlan,
      mealTypes,
      categories,
      selectedCategory,
      recipeSearch,
      showRecipeModal,
      showQuickRecipeModal,
      showGenerateWeeklyModal,
      showShoppingListModal,
      loadingWeeklyPlan,
      loadingRecipes,
      loadingShoppingList,
      quickMealData,
      generationPreferences,
      generatedWeeklyMenu,
      shoppingList,
      filteredRecipes,
      modalRecipes,
      groupedShoppingList,
      shoppingListStats,
      currentMonthYear,

      // Layout functions
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,

      // Navigation
      previousWeek,
      nextWeek,
      goToCurrentWeek,

      // Helper functions
      formatDate,
      formatWeekRange,
      formatCategory,
      formatMealType,
      formatDayName,
      getMealTime,
      getMealIcon,

      // Plan functions
=======
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
>>>>>>> versionAntigua
      getMealForSlot,
      getDayMeals,
      openRecipeSelection,
      closeRecipeModal,
      openQuickRecipeModal,
      closeQuickRecipeModal,
      openMealModal,
      openGenerateWeeklyModal,
      closeGenerateWeeklyModal,
      openShoppingListModal,
      closeShoppingListModal,

      // Meal functions
      selectRecipeForSlot,
      selectRecipeForModal,
      setOutsideMeal,
      saveQuickMeal,
      removeMeal,
<<<<<<< HEAD

      // Generation functions
      generateWeeklyMenu,
      generateWeekPreview,
      applyGeneratedWeeklyMenu,

      // Shopping list functions
      generateShoppingList,
      updateShoppingItem,
      removeShoppingItem,
      exportShoppingList,
      addAllToShoppingList,

      // Filter functions
      filterRecipes,

      // Drag and drop
      handleDragStart,
      handleRecipeDragStart,
      handleDragEnter,
      handleDragLeave,
      handleDrop,

      // Utils
      handleImageError,
      goToRecipes,

      isTodayDate,
      truncateText,
      previousMonth,
      nextMonth,
      selectDayForQuickAdd,
      openQuickAddForDay,
      getMonthMealsCount,
      getMonthRecipesCount,
      getMonthOutsideCount,
      generateDayMenu,
=======
      
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
>>>>>>> versionAntigua
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

<<<<<<< HEAD
/* Pestañas de vista */
.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  color: var(--foreground);
}

.tab-btn.active {
  background-color: var(--primary);
  color: white;
}

.tab-btn .iconify {
  width: 1.25rem;
  height: 1.25rem;
}

/* Vista semanal */
.weekly-view {
  display: flex;
  gap: 24px;
}

/* Grid del planificador */
.planificador-grid {
  flex: 1;
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: scroll;
=======
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
>>>>>>> versionAntigua
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

<<<<<<< HEAD
.grid-header {
  display: grid;
  grid-template-columns: 140px repeat(3, 1fr);
  background-color: rgba(168, 213, 186, 0.2);
  border-bottom: 1px solid var(--border);
  width: 100%;
}

.header-cell {
  padding: 16px;
  text-align: left;
  width: 100%;
=======
.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
>>>>>>> versionAntigua
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

<<<<<<< HEAD
/* Filas del grid */
.grid-row {
  display: grid;
  grid-template-columns: 140px repeat(3, 1fr);
  border-bottom: 1px solid var(--border);
}

.grid-row:last-child {
  border-bottom: none;
}

.day-cell {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid var(--border);
  background-color: rgba(168, 213, 186, 0.05);
}

.day-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.day-date {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.meal-cell {
  padding: 12px;
  border-right: 1px solid var(--border);
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-cell:last-child {
  border-right: none;
}

.meal-cell.drag-over {
  background-color: rgba(93, 162, 113, 0.1);
  border: 2px dashed var(--primary);
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
=======
.add-meal-btn-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
>>>>>>> versionAntigua
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
<<<<<<< HEAD
  cursor: move;
=======
  border: 1px solid rgba(93, 162, 113, 0.2);
  cursor: pointer;
>>>>>>> versionAntigua
  transition: all 0.2s;
}

.meal-content-responsive:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

<<<<<<< HEAD
.remove-btn {
=======
.remove-btn-small {
>>>>>>> versionAntigua
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

<<<<<<< HEAD
.meal-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn .iconify {
=======
.meal-content-responsive:hover .remove-btn-small {
  opacity: 1;
}

.remove-btn-small .iconify {
>>>>>>> versionAntigua
  width: 12px;
  height: 12px;
}

.meal-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

<<<<<<< HEAD
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

.outside-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--secondary);
  background-color: rgba(139, 177, 116, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  width: fit-content;
}

.outside-badge .iconify {
  width: 10px;
  height: 10px;
}

/* Panel lateral de recetas */
.recipes-sidebar {
  width: 300px;
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.search-section {
  margin-bottom: 16px;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input .iconify {
  position: absolute;
  left: 12px;
  width: 1rem;
  height: 1rem;
  color: var(--muted-foreground);
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: white;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.recipe-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.category-btn {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.recipes-scroll {
  flex: 1;
  overflow-y: auto;
}

.recipe-draggable {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 12px;
  cursor: move;
  transition: all 0.2s;
}

.recipe-draggable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.recipe-drag-content {
=======
.outside-content {
>>>>>>> versionAntigua
  display: flex;
  align-items: center;
<<<<<<< HEAD
  gap: 12px;
  padding: 12px;
}

.recipe-drag-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
=======
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  width: 100%;
}

.outside-content .iconify {
  width: 24px;
  height: 24px;
  color: var(--secondary);
>>>>>>> versionAntigua
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

<<<<<<< HEAD
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border);
}

.month-day {
  background-color: var(--card);
  min-height: 120px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.month-day:not(.isCurrentMonth) {
  background-color: rgba(168, 213, 186, 0.05);
  opacity: 0.6;
}

.day-header {
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

.day-name-short {
  font-size: 12px;
  color: var(--muted-foreground);
}

.day-meals {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.month-meal {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: rgba(168, 213, 186, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.month-meal:hover {
  background-color: rgba(168, 213, 186, 0.2);
}

.meal-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-icon .iconify {
  width: 14px;
  height: 14px;
  color: var(--primary);
}

.meal-name-short {
  font-size: 10px;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* MODALES - Usando estilos similares a HomeView */

.modal-overlay {
=======
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
>>>>>>> versionAntigua
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

<<<<<<< HEAD
=======
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
>>>>>>> versionAntigua
@media (max-width: 768px) {

  /* Layout responsive */
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s ease;
  }

<<<<<<< HEAD
=======
  /* Cuando el menú móvil está abierto */
>>>>>>> versionAntigua
  .mobile-menu-open .sidebar-fixed {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }

<<<<<<< HEAD
=======
  /* Header ocupa toda la pantalla en móvil */
>>>>>>> versionAntigua
  .header-fixed {
    left: 0;
    right: 0;
  }

<<<<<<< HEAD
=======
  /* Contenido principal ocupa toda la pantalla en móvil */
>>>>>>> versionAntigua
  .main-content-wrapper {
    margin-left: 0;
    width: 100%;
  }

  .content-container {
    padding: 16px;
  }
<<<<<<< HEAD

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

  /* Grid responsive */
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
=======

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
>>>>>>> versionAntigua
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

<<<<<<< HEAD
  .tab-btn {
    justify-content: center;
  }

  .month-grid {
    grid-template-columns: 1fr;
  }

  .shopping-list-stats {
    grid-template-columns: 1fr;
=======
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
>>>>>>> versionAntigua
  }
}

@media (min-width: 769px) {
  .planificador-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

<<<<<<< HEAD
  .weekly-view {
    flex-direction: row;
  }
}

/* ============================================
   ESTILOS SIMPLIFICADOS SIN RECETAS DISPONIBLES
   ============================================ */

.weekly-view-simple {
  width: 100%;
}

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

.outside-badge-small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--secondary);
  background-color: rgba(139, 177, 116, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.outside-badge-small .iconify {
  width: 10px;
  height: 10px;
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

/* Vista mensual simplificada */
.monthly-view-simple {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.month-header h3 {
  font-size: 20px;
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
  border-radius: 8px;
  margin-bottom: 10px;
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
  border-radius: 8px;
  overflow: hidden;
}

.month-day-responsive {
  background-color: var(--card);
  min-height: 120px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border);
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
  background-color: rgba(93, 162, 113, 0.15);
  border: 2px solid var(--primary);
}

.day-header-responsive {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(168, 213, 186, 0.3);
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
  text-align: center;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.summary-stats .stat-item {
  text-align: center;
  padding: 12px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
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

/* Responsive */
@media (max-width: 768px) {
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
    gap: 12px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }

  .month-grid-responsive {
=======
  .planificador-grid-responsive {
>>>>>>> versionAntigua
    grid-template-columns: repeat(4, 1fr);
  }
}

<<<<<<< HEAD
@media (min-width: 1025px) {
=======
@media (min-width: 769px) and (max-width: 1399px) {
  .planificador-grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
>>>>>>> versionAntigua
  .planificador-grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>