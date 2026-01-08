<!-- src/views/ListaComprasView.vue -->
<template>
  <div class="lista-compras-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <div class="lista-compras-view">
            <!-- Header de la lista -->
            <div class="lista-header">
              <div class="header-left">
                <div class="header-icon-container">
                  <span class="iconify" data-icon="mdi:cart"></span>
                </div>
                <div>
                  <h1 class="lista-title">Lista de Compras</h1>
                  <p class="lista-subtitle">
                    {{ purchasedCount }} de {{ totalItems }} comprados • 
                    <span class="store-section-badge" v-if="activeStoreSection">
                      {{ activeStoreSection }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="header-actions">
                <div class="view-options">
                  <button 
                    class="view-option-btn" 
                    :class="{ active: viewMode === 'categorized' }"
                    @click="viewMode = 'categorized'"
                  >
                    <span class="iconify" data-icon="mdi:format-list-bulleted-type"></span>
                    Categorizado
                  </button>
                  <button 
                    class="view-option-btn" 
                    :class="{ active: viewMode === 'store' }"
                    @click="viewMode = 'store'"
                  >
                    <span class="iconify" data-icon="mdi:store"></span>
                    Por Tienda
                  </button>
                  <button 
                    class="view-option-btn" 
                    :class="{ active: viewMode === 'priority' }"
                    @click="viewMode = 'priority'"
                  >
                    <span class="iconify" data-icon="mdi:flag"></span>
                    Prioridad
                  </button>
                </div>

                <div class="header-controls">
                  <!-- Filtro por sección -->
                  <div class="section-filter">
                    <select v-model="activeStoreSection" class="section-select">
                      <option value="">Todas las secciones</option>
                      <option v-for="section in storeSections" :key="section.id" :value="section.name">
                        {{ section.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Botones de acción -->
                  <button class="generate-list-btn" @click="openGenerateFromPlanModal">
                    <span class="iconify" data-icon="mdi:calendar-import"></span>
                    Importar del Plan
                  </button>
                  <button class="add-manual-btn" @click="openAddItemModal">
                    <span class="iconify" data-icon="mdi:plus"></span>
                    Agregar Item
                  </button>
                </div>
              </div>
            </div>

            <!-- Estadísticas rápidas -->
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon">
                  <span class="iconify" data-icon="mdi:cart-outline"></span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ totalItems }}</span>
                  <span class="stat-label">Total Items</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <span class="iconify" data-icon="mdi:check-circle-outline"></span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ purchasedCount }}</span>
                  <span class="stat-label">Comprados</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <span class="iconify" data-icon="mdi:clock-outline"></span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ pendingCount }}</span>
                  <span class="stat-label">Pendientes</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <span class="iconify" data-icon="mdi:cash"></span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">${{ estimatedTotal }}</span>
                  <span class="stat-label">Total Estimado</span>
                </div>
              </div>
            </div>

            <!-- Barra de búsqueda y filtros -->
            <div class="search-filters-section">
              <div class="search-wrapper">
                <div class="search-input-wrapper">
                  <span class="iconify search-icon" data-icon="mdi:magnify"></span>
                  <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="Buscar en lista de compras..."
                    class="search-input"
                    @input="filterItems"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="clearSearch">
                    <span class="iconify" data-icon="mdi:close"></span>
                  </button>
                </div>
              </div>

              <div class="filters-wrapper">
                <button 
                  class="filter-btn" 
                  :class="{ active: activeFilter === 'all' }"
                  @click="setFilter('all')"
                >
                  Todos
                </button>
                <button 
                  class="filter-btn" 
                  :class="{ active: activeFilter === 'pending' }"
                  @click="setFilter('pending')"
                >
                  <span class="iconify" data-icon="mdi:clock-outline"></span>
                  Pendientes
                </button>
                <button 
                  class="filter-btn" 
                  :class="{ active: activeFilter === 'purchased' }"
                  @click="setFilter('purchased')"
                >
                  <span class="iconify" data-icon="mdi:check-circle"></span>
                  Comprados
                </button>
                <button 
                  class="filter-btn" 
                  :class="{ active: activeFilter === 'high' }"
                  @click="setFilter('high')"
                >
                  <span class="iconify" data-icon="mdi:flag"></span>
                  Alta Prioridad
                </button>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="shopping-content">
              <!-- Vista por Categorías -->
              <div v-if="viewMode === 'categorized'" class="categorized-view">
                <div v-if="Object.keys(groupedByCategory).length > 0" class="categories-container">
                  <div v-for="(items, category) in groupedByCategory" :key="category" class="category-section">
                    <h3 class="category-title">
                      {{ formatCategory(category) }}
                      <span class="category-count">{{ items.length }} items</span>
                    </h3>
                    <div class="items-grid">
                      <div 
                        v-for="item in items" 
                        :key="item.id"
                        class="shopping-item-card"
                        :class="{ 
                          'purchased': item.is_purchased,
                          'priority-high': item.priority === 'high',
                          'priority-medium': item.priority === 'medium',
                          'priority-low': item.priority === 'low'
                        }"
                      >
                        <div class="item-checkbox">
                          <input 
                            type="checkbox" 
                            :id="`item-${item.id}`"
                            :checked="item.is_purchased"
                            @change="togglePurchased(item)"
                            class="checkbox-input"
                          >
                          <label :for="`item-${item.id}`" class="checkbox-label"></label>
                        </div>

                        <div class="item-info" @click="openEditItemModal(item)">
                          <div class="item-main">
                            <h4 class="item-name" :class="{ 'purchased-text': item.is_purchased }">
                              {{ item.name }}
                            </h4>
                            <div class="item-details">
                              <span class="item-quantity">
                                {{ item.quantity }} {{ item.unit || 'unidades' }}
                              </span>
                              <span v-if="item.estimated_price" class="item-price">
                                ${{ item.estimated_price }}
                              </span>
                              <span v-if="item.store_section" class="item-section">
                                <span class="iconify" data-icon="mdi:store"></span>
                                {{ item.store_section }}
                              </span>
                            </div>
                            <div v-if="item.notes" class="item-notes">
                              {{ item.notes }}
                            </div>
                            <div v-if="item.recipe_id" class="item-recipe">
                              <span class="iconify" data-icon="mdi:book-recipe"></span>
                              De receta
                            </div>
                          </div>

                          <div class="item-actions">
                            <button class="item-action-btn" @click.stop="openEditItemModal(item)">
                              <span class="iconify" data-icon="mdi:pencil"></span>
                            </button>
                            <button class="item-action-btn delete" @click.stop="deleteItem(item.id)">
                              <span class="iconify" data-icon="mdi:trash-can-outline"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-state">
                  <div class="empty-icon">
                    <span class="iconify" data-icon="mdi:cart-off"></span>
                  </div>
                  <h3 class="empty-title">No hay items en la lista</h3>
                  <p class="empty-description">
                    {{ searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza agregando items manualmente o importando del planificador.' }}
                  </p>
                  <div class="empty-actions">
                    <button class="empty-action-btn primary" @click="openAddItemModal">
                      <span class="iconify" data-icon="mdi:plus"></span>
                      Agregar Item Manual
                    </button>
                    <button class="empty-action-btn secondary" @click="openGenerateFromPlanModal">
                      <span class="iconify" data-icon="mdi:calendar-import"></span>
                      Importar del Plan
                    </button>
                  </div>
                </div>
              </div>

              <!-- Vista por Tienda -->
              <div v-else-if="viewMode === 'store'" class="store-view">
                <div v-if="groupedByStore.length > 0" class="store-sections-container">
                  <div v-for="section in groupedByStore" :key="section.name" class="store-section">
                    <h3 class="store-section-title">
                      <span class="section-icon" :style="{ color: section.color }">
                        <span class="iconify" :data-icon="section.icon"></span>
                      </span>
                      {{ section.name }}
                      <span class="section-count">{{ section.items.length }} items</span>
                    </h3>
                    <div class="store-items-grid">
                      <div 
                        v-for="item in section.items" 
                        :key="item.id"
                        class="store-item-card"
                        :class="{ 'purchased': item.is_purchased }"
                      >
                        <div class="store-item-checkbox">
                          <input 
                            type="checkbox" 
                            :id="`store-item-${item.id}`"
                            :checked="item.is_purchased"
                            @change="togglePurchased(item)"
                            class="checkbox-input"
                          >
                          <label :for="`store-item-${item.id}`" class="checkbox-label"></label>
                        </div>

                        <div class="store-item-info">
                          <h4 class="store-item-name">{{ item.name }}</h4>
                          <div class="store-item-details">
                            <span class="store-item-quantity">
                              {{ item.quantity }} {{ item.unit || 'unidades' }}
                            </span>
                            <span v-if="item.category" class="store-item-category">
                              {{ formatCategory(item.category) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vista por Prioridad -->
              <div v-else class="priority-view">
                <div class="priority-columns">
                  <div class="priority-column high">
                    <h3 class="priority-title">
                      <span class="priority-icon">
                        <span class="iconify" data-icon="mdi:flag"></span>
                      </span>
                      Alta Prioridad
                      <span class="priority-count">{{ highPriorityItems.length }}</span>
                    </h3>
                    <div class="priority-items">
                      <div 
                        v-for="item in highPriorityItems" 
                        :key="item.id"
                        class="priority-item-card"
                        :class="{ 'purchased': item.is_purchased }"
                      >
                        <div class="priority-item-content">
                          <div class="priority-item-checkbox">
                            <input 
                              type="checkbox" 
                              :checked="item.is_purchased"
                              @change="togglePurchased(item)"
                              class="checkbox-input"
                            >
                          </div>
                          <div class="priority-item-info">
                            <h4>{{ item.name }}</h4>
                            <p>{{ item.quantity }} {{ item.unit || 'unidades' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="priority-column medium">
                    <h3 class="priority-title">
                      <span class="priority-icon">
                        <span class="iconify" data-icon="mdi:flag-outline"></span>
                      </span>
                      Prioridad Media
                      <span class="priority-count">{{ mediumPriorityItems.length }}</span>
                    </h3>
                    <div class="priority-items">
                      <div 
                        v-for="item in mediumPriorityItems" 
                        :key="item.id"
                        class="priority-item-card"
                        :class="{ 'purchased': item.is_purchased }"
                      >
                        <div class="priority-item-content">
                          <div class="priority-item-checkbox">
                            <input 
                              type="checkbox" 
                              :checked="item.is_purchased"
                              @change="togglePurchased(item)"
                              class="checkbox-input"
                            >
                          </div>
                          <div class="priority-item-info">
                            <h4>{{ item.name }}</h4>
                            <p>{{ item.quantity }} {{ item.unit || 'unidades' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="priority-column low">
                    <h3 class="priority-title">
                      <span class="priority-icon">
                        <span class="iconify" data-icon="mdi:flag-variant-outline"></span>
                      </span>
                      Baja Prioridad
                      <span class="priority-count">{{ lowPriorityItems.length }}</span>
                    </h3>
                    <div class="priority-items">
                      <div 
                        v-for="item in lowPriorityItems" 
                        :key="item.id"
                        class="priority-item-card"
                        :class="{ 'purchased': item.is_purchased }"
                      >
                        <div class="priority-item-content">
                          <div class="priority-item-checkbox">
                            <input 
                              type="checkbox" 
                              :checked="item.is_purchased"
                              @change="togglePurchased(item)"
                              class="checkbox-input"
                            >
                          </div>
                          <div class="priority-item-info">
                            <h4>{{ item.name }}</h4>
                            <p>{{ item.quantity }} {{ item.unit || 'unidades' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones globales -->
            <div class="global-actions">
              <button class="action-btn export-btn" @click="exportShoppingList">
                <span class="iconify" data-icon="mdi:export"></span>
                Exportar Lista
              </button>
              <button class="action-btn clear-btn" @click="clearPurchased">
                <span class="iconify" data-icon="mdi:check-all"></span>
                Limpiar Comprados
              </button>
              <button class="action-btn share-btn" @click="openShareModal">
                <span class="iconify" data-icon="mdi:share"></span>
                Compartir
              </button>
              <button class="action-btn generate-btn" @click="openGenerateFromPlanModal">
                <span class="iconify" data-icon="mdi:auto-fix"></span>
                Generar de Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODALES -->

    <!-- Modal para agregar/editar item -->
    <div v-if="showItemModal" class="modal-overlay" @click="closeItemModal">
      <div class="modal-content item-modal" @click.stop>
        <button class="modal-close" @click="closeItemModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">{{ editingItem ? 'Editar Item' : 'Agregar Nuevo Item' }}</h2>

        <div class="item-form">
          <div class="form-row">
            <div class="form-group full-width">
              <label>Nombre del Item *</label>
              <input 
                type="text" 
                v-model="itemForm.name"
                class="form-input"
                placeholder="Ej: Tomate, Arroz, Leche"
                required
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Cantidad *</label>
              <input 
                type="number" 
                v-model="itemForm.quantity"
                class="form-input"
                placeholder="1"
                min="0.1"
                step="0.1"
                required
              >
            </div>
            <div class="form-group">
              <label>Unidad</label>
              <select v-model="itemForm.unit" class="form-select">
                <option value="">Unidades</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="litro">litro</option>
                <option value="ml">ml</option>
                <option value="unidades">unidades</option>
                <option value="paquete">paquete</option>
                <option value="docena">docena</option>
              </select>
            </div>
            <div class="form-group">
              <label>Precio Estimado</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  v-model="itemForm.estimated_price"
                  class="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="itemForm.category" class="form-select">
                <option value="">Seleccionar categoría</option>
                <option value="verduras">Verduras</option>
                <option value="frutas">Frutas</option>
                <option value="proteinas">Proteínas</option>
                <option value="lacteos">Lácteos</option>
                <option value="granos">Granos</option>
                <option value="condimentos">Condimentos</option>
                <option value="bebidas">Bebidas</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div class="form-group">
              <label>Sección de Tienda</label>
              <select v-model="itemForm.store_section" class="form-select">
                <option value="">Seleccionar sección</option>
                <option v-for="section in storeSections" :key="section.id" :value="section.name">
                  {{ section.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Prioridad</label>
              <div class="priority-selector">
                <button 
                  class="priority-option"
                  :class="{ 'active': itemForm.priority === 'low' }"
                  @click="itemForm.priority = 'low'"
                >
                  <span class="priority-dot low"></span>
                  Baja
                </button>
                <button 
                  class="priority-option"
                  :class="{ 'active': itemForm.priority === 'medium' }"
                  @click="itemForm.priority = 'medium'"
                >
                  <span class="priority-dot medium"></span>
                  Media
                </button>
                <button 
                  class="priority-option"
                  :class="{ 'active': itemForm.priority === 'high' }"
                  @click="itemForm.priority = 'high'"
                >
                  <span class="priority-dot high"></span>
                  Alta
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Notas (opcional)</label>
            <textarea 
              v-model="itemForm.notes"
              class="form-textarea"
              placeholder="Ej: Orgánico, marca preferida, etc."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Frecuencia</label>
            <div class="frequency-selector">
              <button 
                class="frequency-option"
                :class="{ 'active': itemForm.frequency === 'once' }"
                @click="itemForm.frequency = 'once'"
              >
                Una vez
              </button>
              <button 
                class="frequency-option"
                :class="{ 'active': itemForm.frequency === 'weekly' }"
                @click="itemForm.frequency = 'weekly'"
              >
                Semanal
              </button>
              <button 
                class="frequency-option"
                :class="{ 'active': itemForm.frequency === 'monthly' }"
                @click="itemForm.frequency = 'monthly'"
              >
                Mensual
              </button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeItemModal">
            Cancelar
          </button>
          <button 
            class="modal-btn confirm-btn" 
            @click="saveItem"
            :disabled="!itemForm.name || !itemForm.quantity"
          >
            {{ editingItem ? 'Actualizar' : 'Agregar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para generar desde planificador -->
    <div v-if="showGenerateModal" class="modal-overlay" @click="closeGenerateModal">
      <div class="modal-content generate-modal" @click.stop>
        <button class="modal-close" @click="closeGenerateModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Generar Lista desde Planificador</h2>
        <p class="modal-description">
          Importa automáticamente los ingredientes necesarios desde tu planificación semanal
        </p>

        <div class="date-range-selector">
          <div class="date-group">
            <label>Fecha de inicio</label>
            <input 
              type="date" 
              v-model="importDates.start"
              class="date-input"
              :max="importDates.end"
            >
          </div>
          <div class="date-group">
            <label>Fecha de fin</label>
            <input 
              type="date" 
              v-model="importDates.end"
              class="date-input"
              :min="importDates.start"
            >
          </div>
        </div>

        <div class="import-options">
          <h3>Opciones de importación</h3>
          <div class="options-grid">
            <label class="option-item">
              <input type="checkbox" v-model="importOptions.checkPantry">
              <span class="checkbox-custom"></span>
              <span class="option-text">Verificar despensa disponible</span>
              <span class="option-hint">Solo importar lo que no tienes</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="importOptions.excludePurchased">
              <span class="checkbox-custom"></span>
              <span class="option-text">Excluir items ya comprados</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="importOptions.groupSimilar">
              <span class="checkbox-custom"></span>
              <span class="option-text">Agrupar items similares</span>
              <span class="option-hint">Sumar cantidades del mismo item</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="importOptions.keepExisting">
              <span class="checkbox-custom"></span>
              <span class="option-text">Mantener items existentes</span>
              <span class="option-hint">No eliminar la lista actual</span>
            </label>
          </div>
        </div>

        <div class="preview-section" v-if="importPreview.length > 0">
          <h3>Vista previa ({{ importPreview.length }} items)</h3>
          <div class="preview-scroll">
            <div v-for="item in importPreview" :key="item.name" class="preview-item">
              <span class="preview-name">{{ item.name }}</span>
              <span class="preview-details">
                {{ item.total_quantity }} {{ item.unit }}
                <span v-if="item.recipe_id" class="preview-recipe">(de receta)</span>
              </span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="closeGenerateModal">
            Cancelar
          </button>
          <button 
            class="modal-btn preview-btn"
            @click="generatePreview"
            :disabled="loadingImport"
          >
            <span v-if="loadingImport" class="iconify loading-icon" data-icon="mdi:loading"></span>
            {{ loadingImport ? 'Generando...' : 'Generar Vista Previa' }}
          </button>
          <button 
            class="modal-btn confirm-btn"
            @click="importFromPlan"
            :disabled="importPreview.length === 0"
          >
            Importar a Lista
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para compartir -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeShareModal">
      <div class="modal-content share-modal" @click.stop>
        <button class="modal-close" @click="closeShareModal">
          <span class="iconify" data-icon="mdi:close"></span>
        </button>

        <h2 class="modal-title">Compartir Lista de Compras</h2>

        <div class="share-options">
          <div class="share-option" @click="exportAsText">
            <div class="share-icon">
              <span class="iconify" data-icon="mdi:text-box"></span>
            </div>
            <div class="share-info">
              <h4>Exportar como Texto</h4>
              <p>Lista en formato texto plano para copiar/pegar</p>
            </div>
          </div>

          <div class="share-option" @click="generateQRCode">
            <div class="share-icon">
              <span class="iconify" data-icon="mdi:qrcode"></span>
            </div>
            <div class="share-info">
              <h4>Generar Código QR</h4>
              <p>Escanea en la tienda para ver la lista</p>
            </div>
          </div>

          <div class="share-option" @click="shareViaWhatsApp">
            <div class="share-icon">
              <span class="iconify" data-icon="mdi:whatsapp"></span>
            </div>
            <div class="share-info">
              <h4>Compartir por WhatsApp</h4>
              <p>Envía la lista a familiares o amigos</p>
            </div>
          </div>

          <div class="share-option" @click="printList">
            <div class="share-icon">
              <span class="iconify" data-icon="mdi:printer"></span>
            </div>
            <div class="share-info">
              <h4>Imprimir Lista</h4>
              <p>Imprime para llevar a la tienda</p>
            </div>
          </div>
        </div>

        <div v-if="showQRCode" class="qr-section">
          <h3>Código QR Generado</h3>
          <div class="qr-container" ref="qrCodeRef">
            <!-- QR Code será generado aquí -->
          </div>
          <p class="qr-hint">Escanea este código en la tienda para ver la lista</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { supabase } from '../supabase'

export default {
  name: 'ListaComprasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const toast = useToast()

    // Layout state
    const isMobileMenuOpen = ref(false)

    // Datos principales
    const shoppingList = ref([])
    const filteredList = ref([])
    const storeSections = ref([])

    // Estados de vista
    const viewMode = ref('categorized')
    const activeFilter = ref('all')
    const activeStoreSection = ref('')
    const searchQuery = ref('')

    // Estados de modales
    const showItemModal = ref(false)
    const showGenerateModal = ref(false)
    const showShareModal = ref(false)

    // Datos de formularios
    const editingItem = ref(null)
    const itemForm = reactive({
      name: '',
      quantity: 1,
      unit: '',
      category: '',
      store_section: '',
      priority: 'medium',
      estimated_price: null,
      notes: '',
      frequency: 'once',
      is_purchased: false
    })

    const importDates = reactive({
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })

    const importOptions = reactive({
      checkPantry: true,
      excludePurchased: true,
      groupSimilar: true,
      keepExisting: true
    })

    const importPreview = ref([])
    const loadingImport = ref(false)

    // QR Code
    const showQRCode = ref(false)
    const qrCodeRef = ref(null)

    // Computed properties
    const totalItems = computed(() => filteredList.value.length)
    const purchasedCount = computed(() => filteredList.value.filter(item => item.is_purchased).length)
    const pendingCount = computed(() => totalItems.value - purchasedCount.value)
    const estimatedTotal = computed(() => {
      return filteredList.value
        .filter(item => item.estimated_price && !item.is_purchased)
        .reduce((sum, item) => sum + parseFloat(item.estimated_price), 0)
        .toFixed(2)
    })

    const groupedByCategory = computed(() => {
      const groups = {}
      filteredList.value.forEach(item => {
        const category = item.category || 'sin-categoria'
        if (!groups[category]) groups[category] = []
        groups[category].push(item)
      })
      return groups
    })

    const groupedByStore = computed(() => {
      const sections = storeSections.value.map(section => ({
        ...section,
        items: filteredList.value.filter(item => item.store_section === section.name)
      })).filter(section => section.items.length > 0)
      return sections
    })

    const highPriorityItems = computed(() => 
      filteredList.value.filter(item => item.priority === 'high')
    )
    const mediumPriorityItems = computed(() => 
      filteredList.value.filter(item => item.priority === 'medium')
    )
    const lowPriorityItems = computed(() => 
      filteredList.value.filter(item => item.priority === 'low' || !item.priority)
    )

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

    // Helper functions
    const formatCategory = (category) => {
      const categories = {
        'verduras': 'Verduras',
        'frutas': 'Frutas',
        'proteinas': 'Proteínas',
        'lacteos': 'Lácteos',
        'granos': 'Granos',
        'condimentos': 'Condimentos',
        'bebidas': 'Bebidas',
        'otros': 'Otros',
        'sin-categoria': 'Sin Categoría'
      }
      return categories[category] || category
    }

    // Funciones de CRUD
    const fetchShoppingList = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        shoppingList.value = data || []
        filteredList.value = [...shoppingList.value]
      } catch (error) {
        console.error('Error fetching shopping list:', error)
        toast.error('Error al cargar la lista de compras')
      }
    }

    const fetchStoreSections = async () => {
      try {
        const { data, error } = await supabase
          .from('store_sections')
          .select('*')
          .order('display_order')

        if (error) throw error
        storeSections.value = data || []
      } catch (error) {
        console.error('Error fetching store sections:', error)
      }
    }

    const saveItem = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        if (!itemForm.name || !itemForm.quantity) {
          toast.error('Nombre y cantidad son requeridos')
          return
        }

        const itemData = {
          user_id: user.id,
          name: itemForm.name.trim(),
          quantity: parseFloat(itemForm.quantity),
          unit: itemForm.unit || null,
          category: itemForm.category || null,
          store_section: itemForm.store_section || null,
          priority: itemForm.priority,
          estimated_price: itemForm.estimated_price ? parseFloat(itemForm.estimated_price) : null,
          notes: itemForm.notes || null,
          frequency: itemForm.frequency,
          is_purchased: itemForm.is_purchased
        }

        if (editingItem.value) {
          // Actualizar item existente
          const { error } = await supabase
            .from('shopping_list')
            .update(itemData)
            .eq('id', editingItem.value.id)

          if (error) throw error
          toast.success('Item actualizado correctamente')
        } else {
          // Crear nuevo item
          const { error } = await supabase
            .from('shopping_list')
            .insert([itemData])

          if (error) throw error
          toast.success('Item agregado a la lista')
        }

        await fetchShoppingList()
        closeItemModal()
      } catch (error) {
        console.error('Error saving item:', error)
        toast.error('Error al guardar el item')
      }
    }

    const togglePurchased = async (item) => {
      try {
        const { error } = await supabase
          .from('shopping_list')
          .update({ 
            is_purchased: !item.is_purchased,
            last_purchased_date: !item.is_purchased ? new Date().toISOString().split('T')[0] : null
          })
          .eq('id', item.id)

        if (error) throw error

        // Actualizar localmente
        item.is_purchased = !item.is_purchased
        if (item.is_purchased) {
          item.last_purchased_date = new Date().toISOString().split('T')[0]
        }

        toast.success(item.is_purchased ? 'Marcado como comprado' : 'Marcado como pendiente')
      } catch (error) {
        console.error('Error toggling purchased:', error)
        toast.error('Error al actualizar el item')
      }
    }

    const deleteItem = async (itemId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este item?')) {
        return
      }

      try {
        const { error } = await supabase
          .from('shopping_list')
          .delete()
          .eq('id', itemId)

        if (error) throw error

        shoppingList.value = shoppingList.value.filter(item => item.id !== itemId)
        filteredList.value = filteredList.value.filter(item => item.id !== itemId)
        toast.success('Item eliminado')
      } catch (error) {
        console.error('Error deleting item:', error)
        toast.error('Error al eliminar el item')
      }
    }

    const clearPurchased = async () => {
      if (!confirm('¿Eliminar todos los items comprados?')) {
        return
      }

      try {
        const user = await getCurrentUser()
        if (!user) return

        const purchasedIds = shoppingList.value
          .filter(item => item.is_purchased)
          .map(item => item.id)

        if (purchasedIds.length === 0) {
          toast.info('No hay items comprados para eliminar')
          return
        }

        const { error } = await supabase
          .from('shopping_list')
          .delete()
          .in('id', purchasedIds)

        if (error) throw error

        await fetchShoppingList()
        toast.success('Items comprados eliminados')
      } catch (error) {
        console.error('Error clearing purchased:', error)
        toast.error('Error al eliminar items comprados')
      }
    }

    // Funciones de filtrado
    const setFilter = (filter) => {
      activeFilter.value = filter
      filterItems()
    }

    const filterItems = () => {
      let filtered = [...shoppingList.value]

      // Aplicar filtro de estado
      if (activeFilter.value === 'pending') {
        filtered = filtered.filter(item => !item.is_purchased)
      } else if (activeFilter.value === 'purchased') {
        filtered = filtered.filter(item => item.is_purchased)
      } else if (activeFilter.value === 'high') {
        filtered = filtered.filter(item => item.priority === 'high')
      }

      // Aplicar filtro de sección
      if (activeStoreSection.value) {
        filtered = filtered.filter(item => item.store_section === activeStoreSection.value)
      }

      // Aplicar búsqueda
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query))
        )
      }

      filteredList.value = filtered
    }

    const clearSearch = () => {
      searchQuery.value = ''
      filterItems()
    }

    // Funciones de modales
    const openAddItemModal = () => {
      editingItem.value = null
      Object.assign(itemForm, {
        name: '',
        quantity: 1,
        unit: '',
        category: '',
        store_section: '',
        priority: 'medium',
        estimated_price: null,
        notes: '',
        frequency: 'once',
        is_purchased: false
      })
      showItemModal.value = true
    }

    const openEditItemModal = (item) => {
      editingItem.value = item
      Object.assign(itemForm, {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || '',
        category: item.category || '',
        store_section: item.store_section || '',
        priority: item.priority || 'medium',
        estimated_price: item.estimated_price,
        notes: item.notes || '',
        frequency: item.frequency || 'once',
        is_purchased: item.is_purchased
      })
      showItemModal.value = true
    }

    const closeItemModal = () => {
      showItemModal.value = false
      editingItem.value = null
    }

    const openGenerateFromPlanModal = () => {
      showGenerateModal.value = true
      importPreview.value = []
    }

    const closeGenerateModal = () => {
      showGenerateModal.value = false
      importPreview.value = []
    }

    const openShareModal = () => {
      showShareModal.value = true
      showQRCode.value = false
    }

    const closeShareModal = () => {
      showShareModal.value = false
      showQRCode.value = false
    }

    // Funciones de importación desde planificador
    const generatePreview = async () => {
      loadingImport.value = true
      try {
        const user = await getCurrentUser()
        if (!user) return

        // Usar la función SQL que ya existe en la base de datos
        const { data, error } = await supabase.rpc('import_from_weekly_plan', {
          user_uuid: user.id,
          start_date: importDates.start,
          end_date: importDates.end
        })

        if (error) throw error

        importPreview.value = data || []
        
        if (importPreview.value.length === 0) {
          toast.info('No hay ingredientes para importar en el rango de fechas seleccionado')
        } else {
          toast.success(`Se encontraron ${importPreview.value.length} items para importar`)
        }
      } catch (error) {
        console.error('Error generating preview:', error)
        toast.error('Error al generar vista previa')
      } finally {
        loadingImport.value = false
      }
    }

    const importFromPlan = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        if (!importOptions.keepExisting) {
          // Eliminar lista existente
          const { error: deleteError } = await supabase
            .from('shopping_list')
            .delete()
            .eq('user_id', user.id)

          if (deleteError) throw deleteError
        }

        // Preparar items para insertar
        const itemsToInsert = importPreview.value.map(item => ({
          user_id: user.id,
          name: item.item_name,
          quantity: item.total_quantity,
          unit: item.unit || 'unidades',
          category: item.category || 'otros',
          recipe_id: item.recipe_id,
          priority: 'medium',
          is_purchased: false
        }))

        if (itemsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('shopping_list')
            .insert(itemsToInsert)

          if (insertError) throw insertError
        }

        await fetchShoppingList()
        closeGenerateModal()
        toast.success(`${itemsToInsert.length} items importados correctamente`)
      } catch (error) {
        console.error('Error importing from plan:', error)
        toast.error('Error al importar items')
      }
    }

    // Funciones de exportación y compartir
    const exportShoppingList = () => {
      const itemsText = filteredList.value
        .map(item => {
          const status = item.is_purchased ? '[✓]' : '[ ]'
          const price = item.estimated_price ? ` - $${item.estimated_price}` : ''
          const section = item.store_section ? ` (${item.store_section})` : ''
          return `${status} ${item.name} - ${item.quantity} ${item.unit || 'unidades'}${price}${section}`
        })
        .join('\n')

      const blob = new Blob([itemsText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Lista exportada como archivo de texto')
    }

    const exportAsText = () => {
      const itemsText = filteredList.value
        .map(item => {
          const status = item.is_purchased ? '[COMPRADO]' : '[PENDIENTE]'
          const price = item.estimated_price ? ` | $${item.estimated_price}` : ''
          const section = item.store_section ? ` | ${item.store_section}` : ''
          const notes = item.notes ? ` | Nota: ${item.notes}` : ''
          return `${status} ${item.name} | ${item.quantity} ${item.unit || 'unidades'}${price}${section}${notes}`
        })
        .join('\n')

      navigator.clipboard.writeText(itemsText)
        .then(() => {
          toast.success('Lista copiada al portapapeles')
          closeShareModal()
        })
        .catch(err => {
          console.error('Error copying text:', err)
          toast.error('Error al copiar al portapapeles')
        })
    }

    const generateQRCode = () => {
      showQRCode.value = true
      // En una implementación real, usarías una librería QR como qrcode
      // Por ahora mostramos un placeholder
      setTimeout(() => {
        if (qrCodeRef.value) {
          qrCodeRef.value.innerHTML = `
            <div class="qr-placeholder">
              <span class="iconify" data-icon="mdi:qrcode" style="font-size: 120px; color: #333;"></span>
              <p>QR Code generado dinámicamente</p>
            </div>
          `
        }
      }, 100)
    }

    const shareViaWhatsApp = () => {
      const itemsText = filteredList.value
        .map(item => {
          const emoji = item.is_purchased ? '✅' : '⬜'
          return `${emoji} ${item.name} - ${item.quantity} ${item.unit || 'unidades'}`
        })
        .join('%0A')

      const message = `*Lista de Compras*%0A%0A${itemsText}%0A%0A_Generada con Esencia Casera_`
      window.open(`https://wa.me/?text=${message}`, '_blank')
      closeShareModal()
    }

    const printList = () => {
      window.print()
    }

    // Funciones de utilidad
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }

    // Watch para filtros
    watch([searchQuery, activeStoreSection, activeFilter], filterItems)

    // Inicialización
    onMounted(async () => {
      await Promise.all([
        fetchShoppingList(),
        fetchStoreSections()
      ])
    })

    return {
      isMobileMenuOpen,
      viewMode,
      activeFilter,
      activeStoreSection,
      searchQuery,
      shoppingList,
      filteredList,
      storeSections,
      showItemModal,
      showGenerateModal,
      showShareModal,
      itemForm,
      editingItem,
      importDates,
      importOptions,
      importPreview,
      loadingImport,
      showQRCode,
      qrCodeRef,

      // Computed
      totalItems,
      purchasedCount,
      pendingCount,
      estimatedTotal,
      groupedByCategory,
      groupedByStore,
      highPriorityItems,
      mediumPriorityItems,
      lowPriorityItems,

      // Layout functions
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,

      // Helper functions
      formatCategory,

      // CRUD functions
      saveItem,
      togglePurchased,
      deleteItem,
      clearPurchased,

      // Filter functions
      setFilter,
      filterItems,
      clearSearch,

      // Modal functions
      openAddItemModal,
      openEditItemModal,
      closeItemModal,
      openGenerateFromPlanModal,
      closeGenerateModal,
      openShareModal,
      closeShareModal,

      // Import functions
      generatePreview,
      importFromPlan,

      // Export functions
      exportShoppingList,
      exportAsText,
      generateQRCode,
      shareViaWhatsApp,
      printList
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que HomeView y PlanificadorView */
.lista-compras-container {
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

/* Header de la lista */
.lista-header {
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

.lista-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.lista-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 8px;
}

.store-section-badge {
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.view-options {
  display: flex;
  gap: 8px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 4px;
}

.view-option-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-option-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  color: var(--foreground);
}

.view-option-btn.active {
  background-color: var(--primary);
  color: white;
}

.view-option-btn .iconify {
  width: 16px;
  height: 16px;
}

.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.section-filter {
  position: relative;
}

.section-select {
  padding: 10px 16px;
  padding-right: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--foreground);
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.generate-list-btn,
.add-manual-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-list-btn {
  background-color: rgba(139, 177, 116, 0.1);
  color: var(--secondary);
  border: 1px solid rgba(139, 177, 116, 0.3);
}

.generate-list-btn:hover {
  background-color: rgba(139, 177, 116, 0.2);
}

.add-manual-btn {
  background-color: var(--primary);
  color: white;
}

.add-manual-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Estadísticas rápidas */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

/* Barra de búsqueda y filtros */
.search-filters-section {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 20px;
  margin-bottom: 24px;
}

.search-wrapper {
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 48px;
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

.clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: var(--destructive);
}

.filters-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.filter-btn .iconify {
  width: 14px;
  height: 14px;
}

/* Contenido principal */
.shopping-content {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  margin-bottom: 24px;
  min-height: 400px;
}

/* Vista por categorías */
.category-section {
  margin-bottom: 32px;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  background-color: rgba(168, 213, 186, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shopping-item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.shopping-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.shopping-item-card.purchased {
  opacity: 0.7;
  background-color: rgba(168, 213, 186, 0.05);
}

.shopping-item-card.priority-high {
  border-left: 4px solid var(--destructive);
}

.shopping-item-card.priority-medium {
  border-left: 4px solid var(--secondary);
}

.shopping-item-card.priority-low {
  border-left: 4px solid var(--border);
}

.item-checkbox {
  flex-shrink: 0;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-input:checked + .checkbox-label {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkbox-input:checked + .checkbox-label::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.item-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.item-main {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 6px;
}

.item-name.purchased-text {
  text-decoration: line-through;
  color: var(--muted-foreground);
}

.item-details {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 6px;
}

.item-quantity {
  font-weight: 500;
  color: var(--primary);
}

.item-price {
  color: var(--secondary);
  font-weight: 500;
}

.item-section {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-section .iconify {
  width: 12px;
  height: 12px;
}

.item-notes {
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
  margin-top: 4px;
}

.item-recipe {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--secondary);
  background-color: rgba(139, 177, 116, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  width: fit-content;
  margin-top: 6px;
}

.item-recipe .iconify {
  width: 10px;
  height: 10px;
}

.item-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.shopping-item-card:hover .item-actions {
  opacity: 1;
}

.item-action-btn {
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
  color: var(--muted-foreground);
}

.item-action-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  color: var(--foreground);
}

.item-action-btn.delete:hover {
  background-color: rgba(212, 24, 61, 0.1);
  border-color: var(--destructive);
  color: var(--destructive);
}

.item-action-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Estado vacío */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  color: var(--muted-foreground);
}

.empty-icon .iconify {
  width: 80px;
  height: 80px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.empty-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action-btn.primary {
  background-color: var(--primary);
  color: white;
  border: none;
}

.empty-action-btn.primary:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.empty-action-btn.secondary {
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.empty-action-btn.secondary:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

.empty-action-btn .iconify {
  width: 16px;
  height: 16px;
}

/* Vista por tienda */
.store-sections-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.store-section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon .iconify {
  width: 20px;
  height: 20px;
}

.section-count {
  margin-left: auto;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  background-color: rgba(168, 213, 186, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.store-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.store-item-card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.store-item-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.store-item-card.purchased {
  opacity: 0.7;
  background-color: rgba(168, 213, 186, 0.05);
}

.store-item-checkbox {
  flex-shrink: 0;
}

.store-item-info {
  flex: 1;
  min-width: 0;
}

.store-item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-item-details {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.store-item-category {
  background-color: rgba(93, 162, 113, 0.1);
  color: var(--primary);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Vista por prioridad */
.priority-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.priority-column {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
}

.priority-column.high {
  border-top: 4px solid var(--destructive);
}

.priority-column.medium {
  border-top: 4px solid var(--secondary);
}

.priority-column.low {
  border-top: 4px solid var(--border);
}

.priority-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.priority-icon .iconify {
  width: 16px;
  height: 16px;
}

.priority-count {
  margin-left: auto;
  font-size: 14px;
  color: var(--muted-foreground);
  background-color: rgba(168, 213, 186, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.priority-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.priority-item-card {
  background-color: rgba(168, 213, 186, 0.05);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s;
}

.priority-item-card:hover {
  background-color: rgba(168, 213, 186, 0.1);
}

.priority-item-card.purchased {
  opacity: 0.6;
}

.priority-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.priority-item-checkbox {
  flex-shrink: 0;
}

.priority-item-info {
  flex: 1;
  min-width: 0;
}

.priority-item-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.priority-item-info p {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Acciones globales */
.global-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn {
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.export-btn:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
}

.clear-btn {
  background-color: rgba(212, 24, 61, 0.1);
  color: var(--destructive);
  border: 1px solid rgba(212, 24, 61, 0.2);
}

.clear-btn:hover {
  background-color: rgba(212, 24, 61, 0.2);
}

.share-btn {
  background-color: rgba(139, 177, 116, 0.1);
  color: var(--secondary);
  border: 1px solid rgba(139, 177, 116, 0.3);
}

.share-btn:hover {
  background-color: rgba(139, 177, 116, 0.2);
}

.generate-btn {
  background-color: var(--primary);
  color: white;
}

.generate-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

.action-btn .iconify {
  width: 16px;
  height: 16px;
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
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: var(--card);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
  background-color: rgba(212, 24, 61, 0.1);
}

.modal-close .iconify {
  width: 20px;
  height: 20px;
  color: var(--foreground);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
}

.modal-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 24px;
}

/* Modal de item */
.item-modal {
  padding: 24px;
}

.item-form {
  margin: 24px 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--foreground);
  font-size: 14px;
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
  resize: vertical;
  min-height: 80px;
}

.price-input {
  position: relative;
}

.price-input .currency {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
}

.price-input .form-input {
  padding-left: 24px;
}

.priority-selector,
.frequency-selector {
  display: flex;
  gap: 8px;
}

.priority-option,
.frequency-option {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--foreground);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.priority-option:hover,
.frequency-option:hover {
  border-color: var(--primary);
}

.priority-option.active,
.frequency-option.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-dot.low {
  background-color: var(--border);
}

.priority-dot.medium {
  background-color: var(--secondary);
}

.priority-dot.high {
  background-color: var(--destructive);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
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

.preview-btn {
  background-color: var(--secondary);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-btn:hover {
  background-color: rgba(139, 177, 116, 0.9);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* Modal de generación */
.generate-modal {
  max-width: 700px;
  padding: 24px;
}

.date-range-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.date-group {
  display: flex;
  flex-direction: column;
}

.date-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: white;
  color: var(--foreground);
  font-size: 14px;
}

.import-options {
  margin-bottom: 24px;
}

.import-options h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background-color: rgba(168, 213, 186, 0.05);
  border-color: var(--primary);
}

.option-item input[type="checkbox"] {
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
  flex-shrink: 0;
  margin-top: 2px;
}

.option-item input[type="checkbox"]:checked + .checkbox-custom {
  background-color: var(--primary);
  border-color: var(--primary);
}

.option-item input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.option-text {
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 2px;
  display: block;
}

.option-hint {
  font-size: 12px;
  color: var(--muted-foreground);
  display: block;
}

.preview-section {
  margin-bottom: 24px;
}

.preview-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 12px;
}

.preview-scroll {
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(168, 213, 186, 0.05);
  border-radius: 12px;
  padding: 12px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-name {
  font-weight: 500;
  color: var(--foreground);
}

.preview-details {
  font-size: 12px;
  color: var(--muted-foreground);
}

.preview-recipe {
  font-style: italic;
}

/* Modal de compartir */
.share-modal {
  max-width: 500px;
  padding: 24px;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.share-option:hover {
  background-color: rgba(168, 213, 186, 0.1);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.share-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.share-info {
  flex: 1;
}

.share-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.share-info p {
  font-size: 13px;
  color: var(--muted-foreground);
}

.qr-section {
  text-align: center;
  padding: 20px;
  background-color: rgba(168, 213, 186, 0.05);
  border-radius: 12px;
}

.qr-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.qr-container {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: inline-block;
  margin-bottom: 12px;
}

.qr-hint {
  font-size: 13px;
  color: var(--muted-foreground);
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  
  /* Header responsive */
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-options {
    justify-content: center;
  }
  
  .header-controls {
    flex-direction: column;
  }
  
  /* Quick stats */
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Priority columns */
  .priority-columns {
    grid-template-columns: 1fr;
  }
  
  /* Store items grid */
  .store-items-grid {
    grid-template-columns: 1fr;
  }
  
  /* Form responsive */
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  /* Modal responsive */
  .modal-content {
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
  
  /* Empty actions */
  .empty-actions {
    flex-direction: column;
  }
  
  /* Global actions */
  .global-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .priority-columns {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .priority-column:last-child {
    grid-column: span 2;
  }
  
  .store-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .view-options {
    flex-direction: column;
  }
  
  .filters-wrapper {
    flex-direction: column;
  }
  
  .filter-btn {
    justify-content: center;
  }
  
  .category-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .category-count {
    margin-left: 0;
  }
  
  .item-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-actions {
    opacity: 1;
    align-self: flex-end;
  }
}
</style>