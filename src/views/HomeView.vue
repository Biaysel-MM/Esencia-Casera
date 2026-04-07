<template>
  <div class="min-h-screen" :class="{ 'overflow-hidden': isMobileMenuOpen }"
    style="background-color: var(--background); color: var(--foreground);">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu"
      class="fixed left-0 top-0 w-65 h-screen z-1000 bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="{ 'translate-x-0': isMobileMenuOpen, '-translate-x-full': !isMobileMenuOpen }"
      style="background-color: var(--card); border-color: var(--border);" />

    <!-- Main Content Area -->
    <div class="min-h-screen transition-all duration-300 ease-in-out md:ml-65"
      style="background-color: var(--background);">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout"
        class="fixed top-0 right-0 left-0 md:left-65 h-17.5 z-900 border-b shadow-sm transition-all duration-300"
        style="background-color: var(--card); border-color: var(--border);" />

      <!-- Scrollable Content -->
      <main class="pt-17.5 min-h-[calc(100vh-70px)] overflow-y-auto" style="background-color: var(--background);">
        <div class="max-w-350 mx-auto w-full p-4 md:p-6 lg:p-8">
          <div class="flex flex-col gap-6">
            <!-- Welcome Section -->
            <div class="rounded-2xl border p-6 bg-linear-to-br from-[rgba(93,162,113,0.2)] to-[rgba(168,213,186,0.2)]"
              style="border-color: var(--border);">
              <div class="flex items-center gap-5 max-md:flex-col max-md:text-center">
                <div
                  class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#5DA271] text-xl font-semibold text-white">
                  {{ userInitials }}
                </div>
                <div>
                  <h1 class="mb-1 text-[28px] font-semibold text-[#2C2C2C] max-md:text-2xl">¡Hola {{ userName }}! 👋
                  </h1>
                  <p class="text-base text-[#6C7A6C]">Tienes <strong>{{ pantryItems.length }}</strong> ingredientes en
                    tu despensa</p>
                </div>
              </div>
            </div>

            <!-- Daily Meals Section (diseño igual a RecetasView) -->
            <section class="rounded-2xl p-6 shadow-sm border"
              style="background-color: var(--card); border-color: var(--border);">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 class="text-xl font-semibold" style="color: var(--foreground);">Comidas del día</h2>
                <button @click="openGenerateMenuModal"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm"
                  style="border-color: var(--border); color: var(--primary); background-color: transparent;">
                  <span class="iconify w-5 h-5" data-icon="mdi:sparkles"></span>
                  Generar nuevo menú
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-if="loadingStates.meals" class="col-span-full flex flex-col items-center justify-center py-12"
                  style="color: var(--muted-foreground);">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4"
                    style="border-color: var(--border); border-top-color: var(--primary);"></div>
                  <p>Cargando comidas...</p>
                </div>

                <div v-else-if="todayMeals.length === 0"
                  class="col-span-full flex flex-col items-center justify-center py-12"
                  style="color: var(--muted-foreground);">
                  <span class="iconify w-12 h-12 mb-4" data-icon="mdi:food-outline"></span>
                  <p>No hay comidas planificadas para hoy</p>
                  <button @click="openGenerateMenuModal"
                    class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors duration-200"
                    style="background-color: var(--primary);">
                    <span class="iconify w-5 h-5" data-icon="mdi:sparkles"></span>
                    Generar menú automático
                  </button>
                </div>

                <template v-else>
                  <div v-for="meal in todayMeals" :key="meal.id"
                    class="group cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                    @click="openRecipeModal(meal.recipe_id)"
                    style="background-color: var(--card); border-color: var(--border);">
                    <div class="relative h-48 overflow-hidden">
                      <img :src="meal.image_url || defaultImage" :alt="meal.title"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="handleImageError" />
                      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                      <!-- Badge de categoría -->
                      <div class="absolute left-3 top-3">
                        <span class="rounded-lg bg-[#5DA271] px-3 py-1.5 text-xs font-medium text-white">
                          {{ getCategoryLabel(meal.category) }}
                        </span>
                      </div>

                      <!-- Badge de compatibilidad (si aplica) -->
                      <div class="absolute bottom-3 right-3">
                        <div class="flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-white text-xs">
                          <span class="iconify w-3 h-3" data-icon="mdi:calendar"></span>
                          <span>Planificado</span>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div class="absolute bottom-3 left-3 flex gap-1">
                        <span v-for="(tag, idx) in (meal.tags || []).slice(0, 2)" :key="idx"
                          class="rounded px-2 py-0.5 text-[10px] font-medium bg-white/90 text-[#2C2C2C]">
                          {{ tag }}
                        </span>
                      </div>
                    </div>

                    <div class="p-5">
                      <h3 class="mb-3 text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ meal.title }}</h3>

                      <!-- Métricas -->
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                          <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                          <span>{{ meal.total_time }} min</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                          <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                          <span>{{ meal.servings }} porciones</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-sm text-[#6C7A6C]">
                          <span class="iconify h-4 w-4 text-red-500" data-icon="mdi:fire"></span>
                          <span>{{ meal.calories_per_serving || '--' }} kcal</span>
                        </div>
                      </div>

                      <!-- Botones de acción -->
                      <div class="flex gap-2">
                        <button @click.stop="openRecipeModal(meal.recipe_id)"
                          class="flex-1 rounded-xl bg-[#5DA271] py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                          Ver receta
                        </button>
                        <button @click.stop="openChangeMealModal(meal.meal_type)"
                          class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2.5 transition-all duration-200 hover:bg-[#D8EBD0]"
                          title="Cambiar comida">
                          <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:swap-horizontal"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- My Pantry (estilo antiguo con imagen y autocompletado) -->
            <section class="rounded-2xl p-6 shadow-sm border"
              style="background-color: var(--card); border-color: var(--border);">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 class="text-xl font-semibold text-gray-900"><i class="iconify text-green-800 h-5 w-5"
                    data-icon="mdi:food"></i>
                  Mi Despensa</h2>
                <button @click="openAddIngredientModal"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm"
                  style="border-color: var(--border); color: var(--primary); background-color: transparent;">
                  <span class="iconify w-5 h-5" data-icon="mdi:plus"></span>
                  Agregar ingrediente
                </button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-if="loadingStates.pantry && pantryItems.length === 0"
                  class="col-span-full flex flex-col items-center justify-center py-12"
                  style="color: var(--muted-foreground);">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4"
                    style="border-color: var(--border); border-top-color: var(--primary);"></div>
                  <p>Cargando despensa...</p>
                </div>

                <div v-else-if="pantryItems.length === 0"
                  class="col-span-full flex flex-col items-center justify-center py-12"
                  style="color: var(--muted-foreground);">
                  <span class="iconify w-12 h-12 mb-4" data-icon="mdi:fridge-outline"></span>
                  <p>Tu despensa está vacía</p>
                  <button @click="openAddIngredientModal"
                    class="mt-4 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors duration-200"
                    style="background-color: var(--primary);">
                    Agregar tu primer ingrediente
                  </button>
                </div>

                <div v-else v-for="item in pantryItems" :key="item.id"
                  class="rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200"
                  style="background-color: var(--card); border-color: var(--border);">
                  <div class="relative h-32">
                    <img :src="item.image_url || defaultImage" :alt="item.name" class="w-full h-full object-cover"
                      @error="handleImageError">
                    <span v-if="item.expiry_status === 'danger'"
                      class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white bg-red-600">
                      ⚠️ Pronto vence
                    </span>
                  </div>
                  <div class="p-3">
                    <h4 class="font-medium text-sm mb-1 line-clamp-1" style="color: var(--foreground);">{{ item.name }}
                    </h4>
                    <p class="text-xs mb-2" style="color: var(--foreground);">{{ item.quantity }} {{ item.unit }}</p>
                    <div class="flex gap-1.5">
                      <button @click="decreaseQuantity(item)"
                        class="w-8 h-8 rounded-lg border transition-colors duration-200 flex items-center justify-center"
                        style="border-color: var(--border); background-color: var(--card);">
                        <span class="iconify w-4 h-4" data-icon="mdi:minus" style="color: var(--foreground);"></span>
                      </button>
                      <button @click="increaseQuantity(item)"
                        class="w-8 h-8 rounded-lg border transition-colors duration-200 flex items-center justify-center"
                        style="border-color: var(--border); background-color: var(--card);">
                        <span class="iconify w-4 h-4" data-icon="mdi:plus" style="color: var(--foreground);"></span>
                      </button>
                      <button @click="removeIngredient(item)"
                        class="w-8 h-8 rounded-lg border ml-auto transition-colors duration-200 flex items-center justify-center"
                        style="border-color: var(--destructive); background-color: var(--card);">
                        <span class="iconify w-4 h-4" data-icon="mdi:trash-can-outline"
                          style="color: var(--destructive);"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Grid Layout for Recipes and Weather -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Popular Recipes Section -->
              <!-- Popular Recipes Section (diseño compacto y responsive) -->
              <section class="rounded-2xl p-6 shadow-sm border"
                style="background-color: var(--card); border-color: var(--border);">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold" style="color: var(--foreground);">Recetas Populares</h2>
                  <button @click="goToRecipes"
                    class="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200"
                    style="color: var(--primary);">
                    Ver todas
                    <span class="iconify w-4 h-4" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-if="loadingStates.popularRecipes && popularRecipes.length === 0"
                    class="col-span-full flex flex-col items-center justify-center py-12"
                    style="color: var(--muted-foreground);">
                    <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4"
                      style="border-color: var(--border); border-top-color: var(--primary);"></div>
                    <p>Cargando recetas...</p>
                  </div>

                  <div v-else v-for="recipe in popularRecipes.slice(0, 2)" :key="recipe.id"
                    class="group cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                    @click="openRecipeModal(recipe.id)"
                    style="background-color: var(--card); border-color: var(--border);">
                    <div class="relative h-32 overflow-hidden">
                      <img :src="recipe.image_url || defaultImage" :alt="recipe.title"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="handleImageError" />
                      <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

                      <!-- Badge de categoría (más pequeño) -->
                      <div class="absolute left-2 top-2">
                        <span class="rounded-md bg-[#5DA271] px-2 py-0.5 text-[10px] font-medium text-white">
                          {{ getCategoryLabel(recipe.category) }}
                        </span>
                      </div>

                      <!-- Badge de popularidad -->
                      <div class="absolute bottom-2 right-2">
                        <div
                          class="flex items-center gap-0.5 rounded-md bg-black/50 px-1.5 py-0.5 text-white text-[10px]">
                          <span class="iconify w-2.5 h-2.5" data-icon="mdi:star"></span>
                          <span>Popular</span>
                        </div>
                      </div>

                      <!-- Tags (opcional, más pequeños) -->
                      <div class="absolute bottom-2 left-2 flex gap-1">
                        <span v-for="(tag, idx) in (recipe.tags || []).slice(0, 1)" :key="idx"
                          class="rounded px-1.5 py-0.5 text-[9px] font-medium bg-white/90 text-[#2C2C2C]">
                          {{ tag }}
                        </span>
                      </div>
                    </div>

                    <div class="p-3">
                      <h3 class="mb-2 text-sm font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.title }}</h3>

                      <!-- Métricas más compactas -->
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-1 text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                          <span>{{ recipe.total_time }} min</span>
                        </div>
                        <div class="flex items-center gap-1 text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                          <span>{{ recipe.servings }} porc.</span>
                        </div>
                        <div class="flex items-center gap-1 text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 text-red-500" data-icon="mdi:fire"></span>
                          <span>{{ recipe.calories_per_serving || '--' }}</span>
                        </div>
                      </div>

                      <!-- Barra de progreso más pequeña (si aplica) -->
                      <div v-if="recipe.available_ingredients !== undefined" class="mb-2">
                        <div class="flex justify-between text-[10px] mb-1">
                          <span class="text-[#6C7A6C]">Ingredientes</span>
                          <span class="font-medium text-[#5DA271] text-[10px]">
                            {{ recipe.available_ingredients || 0 }}/{{ recipe.total_ingredients || 0 }}
                          </span>
                        </div>
                        <div class="h-1 w-full overflow-hidden rounded-full bg-[#E8F0E8]">
                          <div class="h-full rounded-full transition-all duration-300" :style="{
                            width: ((recipe.available_ingredients || 0) / (recipe.total_ingredients || 1) * 100) + '%',
                            backgroundColor: '#5DA271'
                          }"></div>
                        </div>
                      </div>

                      <!-- Botón más pequeño -->
                      <button @click.stop="openRecipeModal(recipe.id)"
                        class="w-full rounded-lg bg-[#5DA271] py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                        Ver receta
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right Column -->
              <div class="flex flex-col gap-6">
                <!-- Weather Suggestion -->
                <section class="rounded-2xl p-6 text-white shadow-lg"
                  style="background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <span class="iconify w-8 h-8 text-white" :data-icon="weatherIcon"></span>
                    </div>
                    <div>
                      <h3 class="font-medium text-white text-base">Sugerencia del clima</h3>
                      <p class="text-sm text-white/90">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C -
                        ${weatherSuggestion.condition}` : 'Cargando clima...' }}</p>
                    </div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p class="text-sm mb-4 leading-relaxed flex items-start gap-1.5">
                      <span class="iconify w-4 h-4 mt-0.5 shrink-0" data-icon="mdi:lightbulb-on-outline"></span>
                      {{ weatherSuggestion?.suggestion_text || 'Cargando sugerencia...' }}
                    </p>
                    <div class="grid grid-cols-3 gap-2 mb-4">
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Temperatura</span>
                        <span class="block text-lg font-semibold">{{ weatherSuggestion?.temperature || '--' }}°C</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Humedad</span>
                        <span class="block text-lg font-semibold">{{ weatherSuggestion?.humidity || '--' }}%</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Viento</span>
                        <span class="block text-lg font-semibold">{{ weatherSuggestion?.wind_speed || '--' }}
                          km/h</span>
                      </div>
                    </div>
                    <button v-if="weatherSuggestion?.recipe_id" @click="openRecipeModal(weatherSuggestion.recipe_id)"
                      class="w-full py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2"
                      style="background-color: white; color: var(--primary);">
                      <span class="iconify w-4 h-4" data-icon="mdi:food"></span>
                      Ver receta sugerida
                    </button>
                  </div>
                </section>

                <!-- Notifications -->
                <section class="rounded-2xl p-6 shadow-sm border"
                  style="background-color: var(--card); border-color: var(--border);">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-medium" style="color: var(--foreground);">Notificaciones</h3>
                    <span class="w-6 h-6 rounded-full text-white text-xs font-medium flex items-center justify-center"
                      :style="{ backgroundColor: 'var(--primary)' }">{{ notifications.length }}</span>
                  </div>
                  <div class="flex flex-col gap-3">
                    <div v-if="loadingStates.notifications && notifications.length === 0"
                      class="flex flex-col items-center justify-center py-8" style="color: var(--muted-foreground);">
                      <div class="w-8 h-8 border-3 rounded-full animate-spin mb-3"
                        style="border-color: var(--border); border-top-color: var(--primary);"></div>
                      <p class="text-sm">Cargando notificaciones...</p>
                    </div>
                    <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8"
                      style="color: var(--muted-foreground);">
                      <span class="iconify w-8 h-8 mb-2" data-icon="mdi:bell-outline"></span>
                      <p class="text-sm">No tienes notificaciones</p>
                    </div>
                    <div v-else v-for="notification in notifications.slice(0, 3)" :key="notification.id"
                      @click="handleNotification(notification)"
                      class="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200 cursor-pointer"
                      style="background-color: var(--muted);">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="{
                        'bg-red-100': notification.type === 'expiry',
                        'bg-green-100': notification.type === 'recipe',
                        'bg-yellow-100': notification.type === 'shopping'
                      }">
                        <span class="iconify w-5 h-5" :class="{
                          'text-red-600': notification.type === 'expiry',
                          'text-green-600': notification.type === 'recipe',
                          'text-yellow-600': notification.type === 'shopping'
                        }" :data-icon="getNotificationIcon(notification.type)"></span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium" style="color: var(--foreground);">{{ notification.title }}</p>
                        <p class="text-xs mt-0.5" style="color: var(--muted-foreground);">{{ notification.message }}</p>
                        <p class="text-xs mt-0.5 opacity-70" style="color: var(--muted-foreground);">{{
                          formatTimeAgo(notification.created_at) }}</p>
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
    <div v-if="showToast" class="fixed top-5 right-5 z-9999 max-w-100 min-w-75 animate-slide-in-right text-white"
      :style="{ background: toastType === 'success' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : toastType === 'error' ? 'linear-gradient(135deg, var(--destructive) 0%, #b31534 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }">
      <div class="flex items-start gap-3 p-4">
        <span class="iconify w-6 h-6 shrink-0" :data-icon="toastIcon"></span>
        <div>
          <p class="font-semibold text-sm mb-1">{{ toastTitle }}</p>
          <p class="text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false"
          class="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-4 h-4 text-white" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>

    <!-- RECIPE MODAL -->
    <div v-if="showRecipeModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
      @click="closeRecipeModal">
      <div class="rounded-2xl max-w-225 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in" @click.stop
        style="background-color: var(--card);">
        <button @click="closeRecipeModal"
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center z-10"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>
        <div v-if="loadingStates.recipeModal" class="flex flex-col items-center justify-center min-h-75"
          style="color: var(--muted-foreground);">
          <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4"
            style="border-color: var(--border); border-top-color: var(--primary);"></div>
          <p>Cargando receta...</p>
        </div>
        <div v-else-if="currentRecipe">
          <div class="relative h-75 overflow-hidden rounded-t-2xl">
            <img :src="currentRecipe.image_url || defaultImage" :alt="currentRecipe.title"
              class="w-full h-full object-cover" @error="handleImageError">
            <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
            <div class="absolute left-5 top-5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              :style="{ backgroundColor: 'var(--primary)' }">
              {{ getCategoryLabel(currentRecipe.category) }}
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 class="text-3xl font-bold mb-2">{{ currentRecipe.title }}</h2>
            </div>
          </div>
          <div class="p-8">
            <!-- Métricas de la receta -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl"
              style="background-color: var(--muted);">
              <div class="text-center">
                <span class="block text-lg font-semibold">{{ currentRecipe.total_time }} min</span>
                <span class="text-xs">Tiempo</span>
              </div>
              <div class="text-center">
                <span class="block text-lg font-semibold">{{ currentRecipe.servings }}</span>
                <span class="text-xs">Porciones</span>
              </div>
              <div class="text-center">
                <span class="block text-lg font-semibold">{{ currentRecipe.calories_per_serving || '--' }} kcal</span>
                <span class="text-xs">Calorías</span>
              </div>
              <div class="text-center">
                <span class="block text-lg font-semibold">{{ currentRecipe.rating || 'Nuevo' }}</span>
                <span class="text-xs">Calificación</span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-4 mb-8">
              <button @click="toggleFavorite"
                class="flex-1 py-3 rounded-xl border font-medium transition-all duration-200"
                :style="{ borderColor: 'var(--border)', backgroundColor: 'transparent', color: 'var(--foreground)' }">
                <span class="iconify w-5 h-5 inline mr-2"
                  :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
              </button>
              <button @click="addToShoppingList"
                class="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-200"
                :style="{ backgroundColor: 'var(--primary)' }">
                <span class="iconify w-5 h-5 inline mr-2" data-icon="mdi:cart-plus"></span>
                Lista de compras
              </button>
            </div>

            <!-- Ingredientes -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-[#2C2C2C]">
                <span class="iconify w-5 h-5 text-[#5DA271]" data-icon="mdi:food-apple"></span>
                Ingredientes
              </h3>
              <div class="p-4 rounded-xl bg-[rgba(168,213,186,0.1)]">
                <div v-for="ing in recipeIngredients" :key="ing.ingredient_id"
                  class="py-2 last:border-0 flex justify-between items-center border-b border-[rgba(0,0,0,0.05)]">
                  <span class="flex items-center gap-2 text-[#2C2C2C]">
                    <span class="iconify w-4 h-4 text-[#5DA271]" data-icon="mdi:checkbox-blank-circle-outline"></span>
                    <span>{{ ing.ingredient_name }}</span>
                  </span>
                  <span class="font-medium text-[#5DA271]">{{ ing.quantity }} {{ ing.unit }}</span>
                </div>
                <div v-if="recipeIngredients.length === 0" class="py-4 text-center text-[#6C7A6C]">
                  <span class="iconify w-8 h-8 mx-auto mb-1 opacity-50" data-icon="mdi:food-off"></span>
                  <p class="text-sm">No hay ingredientes registrados</p>
                </div>
              </div>
            </div>

            <!-- Instrucciones -->
            <div v-if="currentRecipe.steps && currentRecipe.steps.length > 0" class="mb-8">
              <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span class="iconify w-5 h-5" :style="{ color: 'var(--primary)' }"
                  data-icon="mdi:format-list-numbered"></span>
                Instrucciones
              </h3>
              <div class="flex flex-col gap-4">
                <div v-for="(step, idx) in currentRecipe.steps" :key="idx" class="flex gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
                    :style="{ backgroundColor: 'var(--primary)' }">{{ idx + 1 }}</div>
                  <p class="text-sm leading-relaxed" style="color: var(--foreground);">{{ step.step || step }}</p>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="currentRecipe.tags && currentRecipe.tags.length > 0">
              <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span class="iconify w-5 h-5" :style="{ color: 'var(--primary)' }"
                  data-icon="mdi:tag-multiple-outline"></span>
                Etiquetas
              </h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in currentRecipe.tags" :key="tag"
                  class="rounded-full border px-3.5 py-1.5 text-[13px] font-medium"
                  :style="{ borderColor: 'rgba(93,162,113,0.3)', backgroundColor: 'rgba(168,213,186,0.2)', color: 'var(--primary)' }">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CHANGE MEAL MODAL -->
    <div v-if="showChangeMealModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
      @click="closeChangeMealModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop
        style="background-color: var(--card);">
        <button @click="closeChangeMealModal" class="absolute top-4 right-4 w-10 h-10 rounded-xl border"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close"></span>
        </button>
        <h2 class="text-2xl font-semibold text-center mb-6">Cambiar {{ getMealTypeText(currentMealType) }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-100 overflow-y-auto">
          <div v-for="meal in filteredMeals" :key="meal.id" @click="selectMeal(meal)"
            class="rounded-xl border-2 cursor-pointer p-3" :class="{ 'border-green-600': selectedMeal?.id === meal.id }"
            :style="{ borderColor: selectedMeal?.id === meal.id ? 'var(--primary)' : 'var(--border)' }">
            <h4 class="font-medium">{{ meal.title }}</h4>
            <div class="flex gap-3 text-xs mt-1">
              <span>⏱️ {{ meal.total_time }} min</span>
              <span>👥 {{ meal.servings }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-4 justify-end">
          <button @click="closeChangeMealModal" class="px-6 py-3 rounded-xl border">Cancelar</button>
          <button @click="confirmMealChange" :disabled="!selectedMeal"
            class="px-6 py-3 rounded-xl text-white disabled:opacity-50"
            :style="{ backgroundColor: 'var(--primary)' }">Cambiar Comida</button>
        </div>
      </div>
    </div>

    <!-- GENERATE MENU MODAL -->
    <div v-if="showGenerateMenuModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
      @click="closeGenerateMenuModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop
        style="background-color: var(--card);">
        <button @click="closeGenerateMenuModal" class="absolute top-4 right-4 w-10 h-10 rounded-xl border">✕</button>
        <h2 class="text-2xl font-semibold text-center mb-6">Generar Nuevo Menú</h2>
        <div class="mb-6">
          <h3 class="font-medium mb-3">Preferencias</h3>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="menuPreferences.healthy"> Saludable
          </label>
          <label class="flex items-center gap-2 mt-2">
            <input type="checkbox" v-model="menuPreferences.quick"> Rápido (&lt;30 min)
          </label>
        </div>
        <div class="flex gap-4 justify-end">
          <button @click="closeGenerateMenuModal" class="px-6 py-3 rounded-xl border">Cancelar</button>
          <button @click="generateNewMenu" class="px-6 py-3 rounded-xl text-white"
            :style="{ backgroundColor: '#8b5cf6' }">Generar Menú</button>
        </div>
      </div>
    </div>

    <!-- ADD INGREDIENT MODAL  -->
    <div v-if="showAddIngredientModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
      @click="closeAddIngredientModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop
        style="background-color: var(--card);">
        <button @click="closeAddIngredientModal"
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">Agregar Ingrediente</h2>

        <div class="mb-6">
          <div class="relative">
            <span class="iconify w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2"
              style="color: var(--muted-foreground);" data-icon="mdi:magnify"></span>
            <input type="text" v-model="ingredientSearch" @input="filterIngredients" placeholder="Buscar ingrediente..."
              class="w-full pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
              style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-100 overflow-y-auto p-1">
          <div v-for="ingredient in filteredIngredientList" :key="ingredient.id" @click="selectIngredient(ingredient)"
            class="relative rounded-xl border p-4 flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            style="border-color: var(--border); background-color: var(--card);">
            <div class="w-20 h-20 rounded-lg overflow-hidden">
              <img :src="ingredient.image_url || defaultImage" :alt="ingredient.name" class="w-full h-full object-cover"
                @error="handleImageError">
            </div>
            <div class="font-medium text-sm text-center" style="color: var(--foreground);">{{ ingredient.name }}</div>
            <button
              class="absolute top-2 right-2 w-8 h-8 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
              style="background-color: var(--primary);">
              <span class="iconify w-4 h-4" data-icon="mdi:plus"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- INGREDIENT DETAILS MODAL -->
    <div v-if="showIngredientDetailsModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in"
      @click="closeIngredientDetailsModal">
      <div class="rounded-2xl max-w-125 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop
        style="background-color: var(--card);">
        <button @click="closeIngredientDetailsModal"
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">{{ selectedIngredient.name
        }}
        </h2>

        <div class="w-full h-50 rounded-xl overflow-hidden mb-6">
          <img :src="selectedIngredient.image_url || defaultImage" :alt="selectedIngredient.name"
            class="w-full h-full object-cover" @error="handleImageError">
        </div>
        <div>
          <label class="block font-medium mb-2" style="color: var(--foreground);">Categoría</label>
          <select v-model="newIngredientData.category"
            class="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
            style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
            <option value="verduras">Verduras</option>
            <option value="frutas">Frutas</option>
            <option value="proteínas">Proteínas</option>
            <option value="granos">Granos</option>
            <option value="lácteos">Lácteos</option>
            <option value="condimentos">Condimentos</option>
          </select>
        </div>
        <div class="flex flex-col gap-5 mb-8">
          <div>
            <label class="block font-medium mb-2" style="color: var(--foreground);">Cantidad</label>
            <div class="flex gap-2">
              <input type="number" v-model="newIngredientData.quantity" min="1"
                class="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
              <select v-model="newIngredientData.unit"
                class="w-30 p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
                <option value="unidades">Unidades</option>
                <option value="gramos">Gramos</option>
                <option value="kg">Kilogramos</option>
                <option value="ml">Mililitros</option>
                <option value="litros">Litros</option>
                <option value="tazas">Tazas</option>
                <option value="cucharadas">Cucharadas</option>
                <option value="cucharaditas">Cucharaditas</option>
                <option value="manojos">Manojos</option>
                <option value="dientes">Dientes</option>
                <option value="latas">Latas</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-medium mb-2" style="color: var(--foreground);">Días hasta vencer (opcional)</label>
            <div class="relative">
              <input type="number" v-model="newIngredientData.expiryDays" min="1" placeholder="Ej: 7"
                class="w-full p-3 pr-16 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
              <span class="absolute right-4 top-1/2 -translate-y-1/2"
                style="color: var(--muted-foreground);">días</span>
            </div>
          </div>

          <div>
            <label class="block font-medium mb-2" style="color: var(--foreground);">Notas adicionales (opcional)</label>
            <textarea v-model="newIngredientData.notes" rows="3" placeholder="Ej: Tomates orgánicos, maduros"
              class="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
              style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);"></textarea>
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <button @click="closeIngredientDetailsModal"
            class="px-6 py-3 rounded-xl border transition-colors duration-200 font-medium"
            style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
            Cancelar
          </button>
          <button @click="addIngredientToPantry"
            class="px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200"
            style="background-color: var(--primary);">
            Agregar a Despensa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
// Agregar imports
import { formatQuantity, getStepText } from '@/services/translations'

export default {
  name: 'InicioView',
  components: { Sidebar, Header },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()


    // Layout
    const isMobileMenuOpen = ref(false)
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'

    // User data
    const userName = computed(() => authStore.userName)
    const userInitials = computed(() => {
      const name = userName.value || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    // Data states
    const todayMeals = ref([])
    const pantryItems = ref([])
    const popularRecipes = ref([])
    const weatherSuggestion = ref(null)
    const notifications = ref([])
    const allRecipes = ref([])
    const allIngredients = ref([])

    // Current selections
    const currentRecipe = ref(null)
    const currentMealType = ref('')
    const selectedMeal = ref(null)
    const recipeIngredients = ref([])
    const isFavorite = ref(false)
    const ingredientSearch = ref('')
    const selectedIngredient = ref(null)

    // New ingredient data
    const newIngredientData = reactive({ category: 'verduras', quantity: 1, unit: 'unidades', expiryDays: null, notes: '' })
    const menuPreferences = reactive({ healthy: false, quick: false })

    // Modal states
    const showRecipeModal = ref(false)
    const showChangeMealModal = ref(false)
    const showGenerateMenuModal = ref(false)
    const showAddIngredientModal = ref(false)
    const showIngredientDetailsModal = ref(false)
    const showToast = ref(false)

    // Loading states
    const loadingStates = reactive({
      meals: true,
      pantry: true,
      popularRecipes: true,
      weather: true,
      notifications: true,
      recipeModal: false
    })

    // Toast
    const toastType = ref('success')
    const toastTitle = ref('')
    const toastMessage = ref('')
    const toastIcon = ref('mdi:check-circle')

    const showNotification = (type, title, message, icon = null) => {
      toastType.value = type
      toastTitle.value = title
      toastMessage.value = message
      toastIcon.value = icon || (type === 'success' ? 'mdi:check-circle' : type === 'error' ? 'mdi:alert-circle' : 'mdi:alert')
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3000)
    }

    const getCategoryLabel = (category) => {
      const labels = { 'desayuno': 'Desayuno', 'almuerzo': 'Almuerzo', 'cena': 'Cena', 'postre': 'Postre', 'snack': 'Snack' }
      return labels[category] || category || 'Receta'
    }

    const getMealTypeText = (type) => {
      const types = { 'desayuno': 'Desayuno', 'almuerzo': 'Almuerzo', 'cena': 'Cena', 'breakfast': 'Desayuno', 'lunch': 'Almuerzo', 'dinner': 'Cena' }
      return types[type] || type
    }

    const getMealEmoji = (type) => {
      const emojis = { 'desayuno': '🌅', 'almuerzo': '🍽️', 'cena': '🌙', 'breakfast': '🌅', 'lunch': '🍽️', 'dinner': '🌙' }
      return emojis[type] || '🍴'
    }

    const getNotificationIcon = (type) => {
      const icons = { 'expiry': 'mdi:alert-circle-outline', 'recipe': 'mdi:food', 'shopping': 'mdi:cart', 'family': 'mdi:account-group', 'weather': 'mdi:weather-partly-cloudy', 'system': 'mdi:information' }
      return icons[type] || 'mdi:bell'
    }

    const formatTimeAgo = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      if (diffMins < 1) return 'Hace un momento'
      if (diffMins < 60) return `Hace ${diffMins} min`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `Hace ${diffHours} h`
      const diffDays = Math.floor(diffHours / 24)
      return `Hace ${diffDays} d`
    }

    const weatherIcon = computed(() => {
      if (!weatherSuggestion.value) return 'mdi:weather-partly-cloudy'
      const condition = weatherSuggestion.value.condition?.toLowerCase() || ''
      if (condition.includes('soleado')) return 'mdi:weather-sunny'
      if (condition.includes('lluvia')) return 'mdi:weather-rainy'
      if (condition.includes('nublado')) return 'mdi:weather-cloudy'
      return 'mdi:weather-partly-cloudy'
    })

    const filteredMeals = computed(() => {
      const typeMap = { 'desayuno': 'desayuno', 'almuerzo': 'almuerzo', 'cena': 'cena' }
      const targetType = typeMap[currentMealType.value] || currentMealType.value
      return allRecipes.value.filter(r => r.category === targetType)
    })

    // ========== LOAD TODAY'S MEALS ==========
    // ========== LOAD TODAY'S MEALS ==========
    const loadTodayMeals = async () => {
      try {
        loadingStates.meals = true

        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7 // Lunes=0, Domingo=6

        // Obtener la semana actual
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const weekStartStr = weekStart.toISOString().split('T')[0]

        // Obtener el planner de la semana actual
        let { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('week_start', weekStartStr)
          .single()

        if (plannerError && plannerError.code === 'PGRST116') {
          // No existe planner para esta semana, crear uno
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          const { data: newPlanner, error: createError } = await supabase
            .from('weekly_planner')
            .insert({
              user_id: authStore.user?.id,
              week_start: weekStartStr,
              week_end: weekEnd.toISOString().split('T')[0],
              preferences: {}
            })
            .select()
            .single()

          if (createError) throw createError
          planner = newPlanner
        } else if (plannerError) {
          throw plannerError
        }

        // Obtener las comidas del día actual
        const { data: meals, error: mealsError } = await supabase
          .from('planned_meals')
          .select(`
        id,
        meal_type,
        day_of_week,
        recipe:recipes (
          id,
          title,
          total_time,
          servings,
          image_url,
          category,
          calories_per_serving,
          tags
        )
      `)
          .eq('planner_id', planner.id)
          .eq('day_of_week', dayOfWeek)

        if (mealsError) throw mealsError

        // Transformar los datos
        todayMeals.value = (meals || []).map(meal => ({
          id: meal.id,
          meal_type: meal.meal_type,
          recipe_id: meal.recipe?.id,
          title: meal.recipe?.title,
          total_time: meal.recipe?.total_time,
          servings: meal.recipe?.servings,
          image_url: meal.recipe?.image_url,
          category: meal.recipe?.category,
          calories_per_serving: meal.recipe?.calories_per_serving,
          tags: meal.recipe?.tags
        }))

      } catch (error) {
        console.error('Error cargando comidas:', error)
        todayMeals.value = []
      } finally {
        loadingStates.meals = false
      }
    }

    // ========== LOAD PANTRY ==========
    const loadPantry = async () => {
      try {
        loadingStates.pantry = true
        const { data, error } = await supabase
          .from('user_pantry')
          .select(`id, quantity, unit, expiry_date, ingredient:ingredients (id, name, category, image_url)`)
          .eq('user_id', authStore.user?.id)

        if (error) throw error

        const today = new Date()
        pantryItems.value = (data || []).map(item => {
          let expiry_status = 'safe'
          let days_until_expiry = null
          if (item.expiry_date) {
            const expiryDate = new Date(item.expiry_date)
            days_until_expiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
            if (days_until_expiry <= 0) expiry_status = 'danger'
            else if (days_until_expiry <= 2) expiry_status = 'danger'
            else if (days_until_expiry <= 5) expiry_status = 'warning'
            else expiry_status = 'safe'
          }
          return {
            id: item.id,
            name: item.ingredient?.name,
            category: item.ingredient?.category,
            image_url: item.ingredient?.image_url,
            quantity: item.quantity,
            unit: item.unit,
            expiry_date: item.expiry_date,
            expiry_status,
            days_until_expiry
          }
        })
      } catch (error) {
        console.error('Error cargando despensa:', error)
        pantryItems.value = []
      } finally {
        loadingStates.pantry = false
      }
    }

    // ========== LOAD POPULAR RECIPES ==========
    const loadPopularRecipes = async () => {
      try {
        loadingStates.popularRecipes = true
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, total_time, servings, image_url, category, tags')
          .eq('is_public', true)
          .order('rating', { ascending: false })
          .limit(4)

        if (error) throw error
        popularRecipes.value = (data || []).map(recipe => ({
          ...recipe,
          badge: recipe.tags?.includes('rápido') ? '⚡ Rápido' : recipe.tags?.includes('saludable') ? '🌿 Saludable' : '⭐ Recomendada'
        }))
      } catch (error) {
        console.error('Error cargando recetas populares:', error)
        popularRecipes.value = []
      } finally {
        loadingStates.popularRecipes = false
      }
    }

    // ========== LOAD WEATHER SUGGESTION ==========
    const loadWeatherSuggestion = async () => {
      try {
        loadingStates.weather = true
        const temperature = 22
        const condition = 'Parcialmente nublado'

        let recipeSuggestion = null
        if (temperature < 15) {
          const { data } = await supabase.from('recipes').select('id, title').eq('category', 'cena').limit(1).single()
          recipeSuggestion = data
        } else if (temperature > 25) {
          const { data } = await supabase.from('recipes').select('id, title').eq('category', 'almuerzo').ilike('tags', '%ensalada%').limit(1).single()
          recipeSuggestion = data
        } else {
          const { data } = await supabase.from('recipes').select('id, title').eq('category', 'almuerzo').limit(1).single()
          recipeSuggestion = data
        }

        weatherSuggestion.value = {
          temperature,
          condition,
          humidity: 65,
          wind_speed: 12,
          suggestion_text: recipeSuggestion ? `Hoy es un día perfecto para preparar ${recipeSuggestion.title}. El clima ${condition.toLowerCase()} es ideal para esta receta.` : 'Disfruta de un día agradable preparando algo especial.',
          recipe_id: recipeSuggestion?.id
        }
      } catch (error) {
        console.error('Error cargando sugerencia:', error)
      } finally {
        loadingStates.weather = false
      }
    }

    // ========== LOAD NOTIFICATIONS ==========
    const loadNotifications = async () => {
      try {
        loadingStates.notifications = true
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', authStore.user?.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        notifications.value = data || []
      } catch (error) {
        console.error('Error cargando notificaciones:', error)
        notifications.value = []
      } finally {
        loadingStates.notifications = false
      }
    }

    // ========== LOAD ALL RECIPES ==========
    const loadAllRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, total_time, servings, image_url, category')
          .eq('is_public', true)
        if (error) throw error
        allRecipes.value = data || []
      } catch (error) {
        console.error('Error cargando recetas:', error)
      }
    }

    // ========== LOAD ALL INGREDIENTS ==========
    const loadAllIngredients = async () => {
      try {
        const { data, error } = await supabase.from('ingredients').select('*').order('name')
        if (error) throw error
        allIngredients.value = data || []
      } catch (error) {
        console.error('Error cargando ingredientes:', error)
      }
    }

    // ========== RECIPE DETAIL ==========
    const openRecipeModal = async (recipeId) => {
      try {
        loadingStates.recipeModal = true
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single()
        if (error) throw error

        const { data: ingredients } = await supabase
          .from('recipe_ingredients')
          .select(`quantity, unit, ingredient:ingredients (name)`)
          .eq('recipe_id', recipeId)

        recipeIngredients.value = (ingredients || []).map(i => ({
          ingredient_name: i.ingredient?.name,
          quantity: i.quantity,
          unit: i.unit
        }))

        const { data: fav } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('recipe_id', recipeId)
          .maybeSingle()
        isFavorite.value = !!fav

        currentRecipe.value = recipe
        showRecipeModal.value = true
      } catch (error) {
        console.error('Error cargando receta:', error)
        showNotification('error', 'Error', 'No se pudo cargar la receta')
      } finally {
        loadingStates.recipeModal = false
      }
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false
      currentRecipe.value = null
    }

    const toggleFavorite = async () => {
      if (!currentRecipe.value) return
      try {
        if (isFavorite.value) {
          await supabase.from('favorites').delete().eq('user_id', authStore.user?.id).eq('recipe_id', currentRecipe.value.id)
          isFavorite.value = false
          showNotification('success', 'Eliminado', 'Receta eliminada de favoritos')
        } else {
          await supabase.from('favorites').insert({ user_id: authStore.user?.id, recipe_id: currentRecipe.value.id })
          isFavorite.value = true
          showNotification('success', 'Agregado', 'Receta agregada a favoritos')
        }
      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudo actualizar')
      }
    }

    const addToShoppingList = async () => {
      if (!currentRecipe.value) return
      try {
        let { data: list } = await supabase.from('shopping_lists').select('id').eq('user_id', authStore.user?.id).eq('status', 'active').limit(1).single()
        let listId = list?.id
        if (!listId) {
          const { data: newList } = await supabase.from('shopping_lists').insert({ user_id: authStore.user?.id, name: 'Lista de Compras' }).select().single()
          listId = newList.id
        }
        const { data: ingredients } = await supabase.from('recipe_ingredients').select('ingredient_id, quantity, unit').eq('recipe_id', currentRecipe.value.id)
        if (ingredients?.length) {
          await supabase.from('shopping_list_items').upsert(ingredients.map(i => ({ list_id: listId, ingredient_id: i.ingredient_id, quantity: i.quantity, unit: i.unit })), { onConflict: 'list_id,ingredient_id' })
          showNotification('success', 'Éxito', 'Ingredientes agregados a la lista')
        }
      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudo agregar')
      }
    }

    // ========== CHANGE MEAL ==========
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
      if (!selectedMeal.value) return
      try {
        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const weekStartStr = weekStart.toISOString().split('T')[0]

        let { data: planner } = await supabase.from('weekly_planner').select('id').eq('user_id', authStore.user?.id).eq('week_start', weekStartStr).single()
        if (!planner) {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          const { data: newPlanner } = await supabase.from('weekly_planner').insert({ user_id: authStore.user?.id, week_start: weekStartStr, week_end: weekEnd.toISOString().split('T')[0] }).select().single()
          planner = newPlanner
        }

        await supabase.from('planned_meals').upsert({
          planner_id: planner.id,
          day_of_week: dayOfWeek,
          meal_type: currentMealType.value,
          recipe_id: selectedMeal.value.id
        }, { onConflict: 'planner_id,day_of_week,meal_type' })

        await loadTodayMeals()
        showNotification('success', 'Éxito', 'Comida actualizada')
        closeChangeMealModal()
      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudo cambiar la comida')
      }
    }

    // ========== GENERATE MENU ==========
    const openGenerateMenuModal = () => {
      showGenerateMenuModal.value = true
    }

    const closeGenerateMenuModal = () => {
      showGenerateMenuModal.value = false
    }

    const generateNewMenu = async () => {
      try {
        const today = new Date()
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const weekStartStr = weekStart.toISOString().split('T')[0]

        let filteredRecipes = [...allRecipes.value]
        if (menuPreferences.healthy) {
          filteredRecipes = filteredRecipes.filter(r => (r.calories_per_serving || 500) <= 400)
        }
        if (menuPreferences.quick) {
          filteredRecipes = filteredRecipes.filter(r => (r.total_time || 60) <= 30)
        }

        let { data: planner } = await supabase.from('weekly_planner').select('id').eq('user_id', authStore.user?.id).eq('week_start', weekStartStr).single()
        if (!planner) {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          const { data: newPlanner } = await supabase.from('weekly_planner').insert({ user_id: authStore.user?.id, week_start: weekStartStr, week_end: weekEnd.toISOString().split('T')[0] }).select().single()
          planner = newPlanner
        }

        const dayOfWeek = (today.getDay() + 6) % 7
        await supabase.from('planned_meals').delete().eq('planner_id', planner.id).eq('day_of_week', dayOfWeek)

        const mealTypes = ['desayuno', 'almuerzo', 'cena']
        for (const mealType of mealTypes) {
          const suitable = filteredRecipes.filter(r => r.category === mealType)
          if (suitable.length) {
            const random = suitable[Math.floor(Math.random() * suitable.length)]
            await supabase.from('planned_meals').insert({ planner_id: planner.id, day_of_week: dayOfWeek, meal_type: mealType, recipe_id: random.id })
          }
        }

        await loadTodayMeals()
        showNotification('success', 'Éxito', 'Nuevo menú generado')
        closeGenerateMenuModal()
      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    // ========== PANTRY ACTIONS CON AUTO-CATEGORÍA ==========
    const openAddIngredientModal = () => {
      ingredientSearch.value = ''
      showAddIngredientModal.value = true
    }

    const closeAddIngredientModal = () => {
      showAddIngredientModal.value = false
    }

    const filterIngredients = () => { }

    const selectIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      closeAddIngredientModal()
      showIngredientDetailsModal.value = true

      // AUTO-COMPLETAR CATEGORÍA BASADA EN EL INGREDIENTE
      // La categoría ya viene de la base de datos, así que no necesitamos seleccionarla manualmente
      newIngredientData.category = ingredient.category || getAutoCategory(ingredient.name)
      newIngredientData.quantity = 1
      newIngredientData.unit = ingredient.default_unit || 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }

    // Función auxiliar para determinar categoría automáticamente por si la base de datos no la tiene
    const getAutoCategory = (ingredientName) => {
      const name = ingredientName.toLowerCase()

      // Verduras
      if (['plátano verde', 'yuca', 'ñame', 'batata', 'cebolla', 'ajo', 'ají cubanela', 'ajíes morrones', 'cilantro', 'cilantro ancho', 'tomate', 'lechuga', 'zanahoria', 'brócoli', 'papas'].some(v => name.includes(v))) {
        return 'verduras'
      }

      // Frutas
      if (['plátano maduro', 'aguacate', 'limón', 'naranja agria', 'fresas', 'plátano', 'guineo verde'].some(f => name.includes(f))) {
        return 'frutas'
      }

      // Proteínas
      if (['pollo', 'cerdo', 'res', 'carne de res', 'salami', 'huevos', 'arenque', 'sardinas'].some(p => name.includes(p))) {
        return 'proteínas'
      }

      // Granos
      if (['arroz', 'habichuelas', 'guandules', 'maíz', 'pasta', 'espaguetis', 'avena', 'pan'].some(g => name.includes(g))) {
        return 'granos'
      }

      // Condimentos
      if (['sal', 'pimienta', 'orégano', 'canela', 'clavo', 'vinagre', 'aceite', 'manteca', 'sazón', 'sofrito', 'pasta de tomate'].some(c => name.includes(c))) {
        return 'condimentos'
      }

      // Lácteos
      if (['leche', 'queso', 'mantequilla'].some(l => name.includes(l))) {
        return 'lácteos'
      }

      return 'otros'
    }

    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
      selectedIngredient.value = null
      // Resetear datos
      newIngredientData.category = 'verduras'
      newIngredientData.quantity = 1
      newIngredientData.unit = 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }

    const filteredIngredientList = computed(() => {
      let filtered = [...allIngredients.value]
      if (ingredientSearch.value) {
        filtered = filtered.filter(i => i.name.toLowerCase().includes(ingredientSearch.value.toLowerCase()))
      }
      return filtered
    })

    const addIngredientToPantry = async () => {
      if (!selectedIngredient.value) return
      try {
        let expiryDate = null
        if (newIngredientData.expiryDays) {
          expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + parseInt(newIngredientData.expiryDays))
        }

        // Usar la categoría que viene del ingrediente o la autocompletada
        const categoryToUse = selectedIngredient.value.category || getAutoCategory(selectedIngredient.value.name)

        await supabase.rpc('add_to_pantry', {
          p_user_id: authStore.user?.id,
          p_ingredient_id: selectedIngredient.value.id,
          p_quantity: parseFloat(newIngredientData.quantity),
          p_unit: newIngredientData.unit,
          p_expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
          p_notes: newIngredientData.notes
        })

        await loadPantry()
        showNotification('success', 'Agregado', `${selectedIngredient.value.name} agregado a la despensa`)
        closeIngredientDetailsModal()
      } catch (error) {
        console.error('Error:', error)
        showNotification('error', 'Error', 'No se pudo agregar')
      }
    }

    const decreaseQuantity = async (item) => {
      try {
        const newQuantity = Math.max(0, (item.quantity || 1) - 1)
        if (newQuantity === 0) {
          await supabase.from('user_pantry').delete().eq('id', item.id)
        } else {
          await supabase.from('user_pantry').update({ quantity: newQuantity }).eq('id', item.id)
        }
        await loadPantry()
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const increaseQuantity = async (item) => {
      try {
        const newQuantity = (item.quantity || 1) + 1
        await supabase.from('user_pantry').update({ quantity: newQuantity }).eq('id', item.id)
        await loadPantry()
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const removeIngredient = async (item) => {
      try {
        await supabase.from('user_pantry').delete().eq('id', item.id)
        await loadPantry()
        showNotification('success', 'Eliminado', `${item.name} eliminado de la despensa`)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // ========== NOTIFICATIONS ==========
    const handleNotification = async (notification) => {
      await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', notification.id)
      if (notification.type === 'recipe' && notification.related_id) {
        openRecipeModal(notification.related_id)
      } else if (notification.type === 'shopping') {
        router.push('/lista-compras')
      }
      await loadNotifications()
    }

    // ========== NAVIGATION ==========
    const goToRecipes = () => router.push('/recetas')

    const handleImageError = (event) => { event.target.src = defaultImage }

    const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
    const closeMobileMenu = () => { isMobileMenuOpen.value = false }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    // ========== INIT ==========
    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await Promise.all([
          loadTodayMeals(),
          loadPantry(),
          loadPopularRecipes(),
          loadWeatherSuggestion(),
          loadNotifications(),
          loadAllRecipes(),
          loadAllIngredients()
        ])
      }
    })

    return {
      isMobileMenuOpen,
      userName,
      userInitials,
      todayMeals,
      pantryItems,
      popularRecipes,
      weatherSuggestion,
      weatherIcon,
      notifications,
      showRecipeModal,
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      currentRecipe,
      currentMealType,
      selectedMeal,
      selectedIngredient,
      recipeIngredients,
      isFavorite,
      ingredientSearch,
      filteredIngredientList,
      filteredMeals,
      newIngredientData,
      menuPreferences,
      loadingStates,
      defaultImage,
      getCategoryLabel,
      getMealTypeText,
      getMealEmoji,
      getNotificationIcon,
      formatTimeAgo,
      openRecipeModal,
      closeRecipeModal,
      toggleFavorite,
      addToShoppingList,
      openChangeMealModal,
      closeChangeMealModal,
      selectMeal,
      confirmMealChange,
      openGenerateMenuModal,
      closeGenerateMenuModal,
      generateNewMenu,
      openAddIngredientModal,
      closeAddIngredientModal,
      selectIngredient,
      closeIngredientDetailsModal,
      addIngredientToPantry,
      decreaseQuantity,
      increaseQuantity,
      removeIngredient,
      handleNotification,
      goToRecipes,
      handleImageError,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease;
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}

.animate-slide-in {
  animation: slide-in 0.3s ease;
}
</style>