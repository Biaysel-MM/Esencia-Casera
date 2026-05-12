<template>
  <div class="min-h-screen bg-[#F4F9F4] text-[#1E2A1E]" :class="{ 'overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu"
      class="fixed left-0 top-0 w-65 h-screen z-1000 bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="{ 'translate-x-0': isMobileMenuOpen, '-translate-x-full': !isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen transition-all duration-300 ease-in-out md:ml-65 bg-[#F4F9F4]">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout"
        class="fixed top-0 right-0 left-0 md:left-65 h-17.5 z-900 border-b shadow-sm transition-all duration-300 bg-white border-[#E2E8E2]" />

      <!-- Scrollable Content -->
      <main class="pt-17.5 min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F4F9F4]">
        <div class="max-w-350 mx-auto w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div class="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <!-- Welcome Section -->
            <div class="rounded-2xl border p-4 sm:p-5 md:p-6 bg-linear-to-br from-[rgba(93,162,113,0.2)] to-[rgba(168,213,186,0.2)] border-[#E2E8E2]">
              <div class="flex items-center gap-4 sm:gap-5 max-md:flex-col max-md:text-center">
                <div class="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#5DA271] text-lg sm:text-xl font-semibold text-white">
                  {{ userInitials }}
                </div>
                <div>
                  <h1 class="mb-1 text-2xl sm:text-[28px] font-semibold text-[#2C2C2C]">¡Hola {{ userName }}! 👋</h1>
                  <p class="text-sm sm:text-base text-[#6C7A6C]">Tienes <strong>{{ pantryItems.length }}</strong> ingredientes en tu despensa</p>
                </div>
              </div>
            </div>

            <!-- Daily Meals Section -->
            <section class="rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border bg-white border-[#E2E8E2]">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <h2 class="text-lg sm:text-xl font-semibold text-[#1E2A1E]">Comidas del día</h2>
                <button @click="openGenerateMenuModal"
                  class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 font-medium text-xs sm:text-sm border-[#E2E8E2] text-[#4A8B5C] bg-transparent w-full sm:w-auto justify-center">
                  <span class="iconify w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:sparkles"></span>
                  Generar nuevo menú
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div v-if="loadingStates.meals" class="col-span-full flex flex-col items-center justify-center py-12 text-[#5A6E5A]">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4 border-[#E2E8E2] border-t-[#4A8B5C]"></div>
                  <p class="text-sm sm:text-base">Cargando comidas...</p>
                </div>

                <div v-else-if="todayMeals.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-[#5A6E5A]">
                  <span class="iconify w-10 h-10 sm:w-12 sm:h-12 mb-4" data-icon="mdi:food-outline"></span>
                  <p class="text-sm sm:text-base">No hay comidas planificadas para hoy</p>
                  <button @click="openGenerateMenuModal"
                    class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-medium transition-colors duration-200 bg-[#4A8B5C]">
                    <span class="iconify w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:sparkles"></span>
                    Generar menú automático
                  </button>
                </div>

                <template v-else>
                  <div v-for="meal in todayMeals" :key="meal.id"
                    class="group cursor-pointer overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                    @click="goToRecipeDetail(meal.recipe_id)">
                    <div class="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                      <img :src="meal.image_url || defaultImage" :alt="meal.title"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="handleImageError" />
                      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                      <div class="absolute left-2 sm:left-3 top-2 sm:top-3">
                        <span class="rounded-lg bg-[#5DA271] px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white">
                          {{ getCategoryLabel(meal.category) }}
                        </span>
                      </div>

                      <div class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                        <div class="flex items-center gap-1 rounded-lg bg-black/50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-white text-[10px] sm:text-xs">
                          <span class="iconify w-2.5 h-2.5 sm:w-3 sm:h-3" data-icon="mdi:calendar"></span>
                          <span>Planificado</span>
                        </div>
                      </div>

                      <div class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex gap-1">
                        <span v-for="(tag, idx) in (meal.tags || []).slice(0, 2)" :key="idx"
                          class="rounded px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium bg-white/90 text-[#2C2C2C]">
                          {{ tag }}
                        </span>
                      </div>
                    </div>

                    <div class="p-3 sm:p-4 md:p-5">
                      <h3 class="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-[#2C2C2C] line-clamp-1">{{ meal.title }}</h3>

                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 sm:h-4 sm:w-4 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                          <span>{{ meal.total_time }} min</span>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 sm:h-4 sm:w-4 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                          <span>{{ meal.servings }} porc.</span>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#6C7A6C]">
                          <span class="iconify h-3 w-3 sm:h-4 sm:w-4 text-red-500" data-icon="mdi:fire"></span>
                          <span>{{ meal.calories_per_serving || '--' }} kcal</span>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        <button @click.stop="goToRecipeDetail(meal.recipe_id)"
                          class="flex-1 rounded-xl bg-[#5DA271] py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                          Ver receta
                        </button>
                        <button @click.stop="openChangeMealModal(meal.meal_type, meal)"
                          class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-200 hover:bg-[#D8EBD0]"
                          title="Cambiar comida">
                          <span class="iconify h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#5DA271]" data-icon="mdi:swap-horizontal"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- My Pantry -->
            <section class="rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border bg-white border-[#E2E8E2]">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <i class="iconify text-green-800 h-4 w-4 sm:h-5 sm:w-5" data-icon="mdi:food"></i> Mi Despensa
                </h2>
                <button @click="openAddIngredientModal"
                  class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 font-medium text-xs sm:text-sm border-[#E2E8E2] text-[#4A8B5C] bg-transparent w-full sm:w-auto justify-center">
                  <span class="iconify w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:plus"></span>
                  Agregar ingrediente
                </button>
              </div>

              <!-- ... (Pantry content remains the same) ... -->
              <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div v-if="loadingStates.pantry && pantryItems.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-[#5A6E5A]">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4 border-[#E2E8E2] border-t-[#4A8B5C]"></div>
                  <p class="text-sm sm:text-base">Cargando despensa...</p>
                </div>

                <div v-else-if="pantryItems.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-[#5A6E5A]">
                  <span class="iconify w-10 h-10 sm:w-12 sm:h-12 mb-4" data-icon="mdi:fridge-outline"></span>
                  <p class="text-sm sm:text-base">Tu despensa está vacía</p>
                  <button @click="openAddIngredientModal"
                    class="mt-4 px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-medium transition-colors duration-200 bg-[#4A8B5C]">
                    Agregar tu primer ingrediente
                  </button>
                </div>

                <div v-else v-for="item in pantryItems" :key="item.id"
                  class="rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200 bg-white border-[#E2E8E2]">
                  <div class="relative h-28 sm:h-32">
                    <img :src="item.image_url || defaultImage" :alt="item.name" class="w-full h-full object-cover" @error="handleImageError">
                    <span v-if="item.expiry_status === 'danger'"
                      class="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-white bg-red-600">
                      ⚠️ Pronto vence
                    </span>
                  </div>
                  <div class="p-2 sm:p-3">
                    <h4 class="font-medium text-xs sm:text-sm mb-1 line-clamp-1 text-[#1E2A1E]">{{ item.name }}</h4>
                    <p class="text-[11px] sm:text-xs mb-2 text-[#1E2A1E]">{{ item.quantity }} {{ item.unit }}</p>
                    <div class="flex gap-1 sm:gap-1.5">
                      <button @click="decreaseQuantity(item)"
                        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-colors duration-200 flex items-center justify-center border-[#E2E8E2] bg-white">
                        <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E2A1E]" data-icon="mdi:minus"></span>
                      </button>
                      <button @click="increaseQuantity(item)"
                        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-colors duration-200 flex items-center justify-center border-[#E2E8E2] bg-white">
                        <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E2A1E]" data-icon="mdi:plus"></span>
                      </button>
                      <button @click="removeIngredient(item)"
                        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border ml-auto transition-colors duration-200 flex items-center justify-center border-[#D9534F] bg-white">
                        <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9534F]" data-icon="mdi:trash-can-outline"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Grid Layout for Recipes and Weather -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <!-- Popular Recipes Section -->
              <section class="rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border bg-white border-[#E2E8E2]">
                <div class="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                  <h2 class="text-lg sm:text-xl font-semibold text-[#1E2A1E]">Recetas Populares</h2>
                  <button @click="goToRecipes"
                    class="inline-flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors duration-200 text-[#4A8B5C]">
                    Ver todas
                    <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <!-- ... (Popular recipes content remains the same) ... -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div v-if="loadingStates.popularRecipes && popularRecipes.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-[#5A6E5A]">
                    <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4 border-[#E2E8E2] border-t-[#4A8B5C]"></div>
                    <p class="text-sm sm:text-base">Cargando recetas...</p>
                  </div>

                  <div v-else v-for="recipe in popularRecipes.slice(0, 2)" :key="recipe.id"
                    class="group cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                    @click="goToRecipeDetail(recipe.id)">
                    <!-- ... -->
                    <div class="relative h-28 sm:h-32 overflow-hidden">
                      <img :src="recipe.image_url || defaultImage" :alt="recipe.title"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="handleImageError" />
                      <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                      <div class="absolute left-1.5 sm:left-2 top-1.5 sm:top-2">
                        <span class="rounded-md bg-[#5DA271] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white">
                          {{ getCategoryLabel(recipe.category) }}
                        </span>
                      </div>
                      <div class="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2">
                        <div class="flex items-center gap-0.5 rounded-md bg-black/50 px-1 sm:px-1.5 py-0.5 text-white text-[9px] sm:text-[10px]">
                          <span class="iconify w-2 h-2 sm:w-2.5 sm:h-2.5" data-icon="mdi:star"></span>
                          <span>Popular</span>
                        </div>
                      </div>
                    </div>
                    <div class="p-2 sm:p-3">
                      <h3 class="mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-[#2C2C2C] line-clamp-1">{{ recipe.title }}</h3>
                      <div class="flex flex-wrap items-center justify-between gap-1 mb-1.5 sm:mb-2">
                        <div class="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                          <span>{{ recipe.total_time }} min</span>
                        </div>
                        <div class="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                          <span>{{ recipe.servings }} porc.</span>
                        </div>
                        <div class="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-[#6C7A6C]">
                          <span class="iconify h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" data-icon="mdi:fire"></span>
                          <span>{{ recipe.calories_per_serving || '--' }}</span>
                        </div>
                      </div>
                      <div v-if="recipe.available_ingredients !== undefined" class="mb-1.5 sm:mb-2">
                        <div class="flex justify-between text-[9px] sm:text-[10px] mb-0.5 sm:mb-1">
                          <span class="text-[#6C7A6C]">Ingredientes</span>
                          <span class="font-medium text-[#5DA271] text-[9px] sm:text-[10px]">
                            {{ recipe.available_ingredients || 0 }}/{{ recipe.total_ingredients || 0 }}
                          </span>
                        </div>
                        <div class="h-1 w-full overflow-hidden rounded-full bg-[#E8F0E8]">
                          <div class="h-full rounded-full transition-all duration-300 bg-[#5DA271]" :style="{ width: ((recipe.available_ingredients || 0) / (recipe.total_ingredients || 1) * 100) + '%' }"></div>
                        </div>
                      </div>
                      <button @click.stop="goToRecipeDetail(recipe.id)"
                        class="w-full rounded-lg bg-[#5DA271] py-1.5 text-[11px] sm:text-xs font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                        Ver receta
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right Column -->
              <div class="flex flex-col gap-4 sm:gap-5 md:gap-6">
                <!-- Weather Suggestion -->
                <section class="rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg bg-linear-to-r from-[#4A8B5C] to-[#7BA86A]">
                  <!-- ... (Weather content remains the same) ... -->
                  <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <span class="iconify w-6 h-6 sm:w-8 sm:h-8 text-white" :data-icon="weatherIcon"></span>
                    </div>
                    <div>
                      <h3 class="font-medium text-white text-sm sm:text-base">Sugerencia del clima</h3>
                      <p class="text-xs sm:text-sm text-white/90">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C - ${weatherSuggestion.condition}` : 'Cargando clima...' }}</p>
                    </div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <p class="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed flex items-start gap-1.5">
                      <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" data-icon="mdi:lightbulb-on-outline"></span>
                      {{ weatherSuggestion?.suggestion_text || 'Cargando sugerencia...' }}
                    </p>
                    <div class="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <div class="bg-white/15 rounded-lg p-1.5 sm:p-2 text-center">
                        <span class="block text-[10px] sm:text-xs text-white/80">Temperatura</span>
                        <span class="block text-base sm:text-lg font-semibold">{{ weatherSuggestion?.temperature || '--' }}°C</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-1.5 sm:p-2 text-center">
                        <span class="block text-[10px] sm:text-xs text-white/80">Humedad</span>
                        <span class="block text-base sm:text-lg font-semibold">{{ weatherSuggestion?.humidity || '--' }}%</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-1.5 sm:p-2 text-center">
                        <span class="block text-[10px] sm:text-xs text-white/80">Viento</span>
                        <span class="block text-base sm:text-lg font-semibold">{{ weatherSuggestion?.wind_speed || '--' }} km/h</span>
                      </div>
                    </div>
                    <button v-if="weatherSuggestion?.recipe_id" @click="goToRecipeDetail(weatherSuggestion.recipe_id)"
                      class="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 bg-white text-[#4A8B5C]">
                      <span class="iconify w-3.5 h-3.5 sm:w-4 sm:h-4" data-icon="mdi:food"></span>
                      Ver receta sugerida
                    </button>
                  </div>
                </section>

                <!-- Notifications -->
                <section class="rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border bg-white border-[#E2E8E2]">
                  <!-- ... (Notifications content remains the same) ... -->
                  <div class="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 class="text-sm sm:text-base font-medium text-[#1E2A1E]">Notificaciones</h3>
                    <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white text-[10px] sm:text-xs font-medium flex items-center justify-center bg-[#4A8B5C]">{{ notifications.length }}</span>
                  </div>
                  <div class="flex flex-col gap-2 sm:gap-3">
                    <div v-if="loadingStates.notifications && notifications.length === 0" class="flex flex-col items-center justify-center py-8 text-[#5A6E5A]">
                      <div class="w-8 h-8 border-3 rounded-full animate-spin mb-3 border-[#E2E8E2] border-t-[#4A8B5C]"></div>
                      <p class="text-xs sm:text-sm">Cargando notificaciones...</p>
                    </div>
                    <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8 text-[#5A6E5A]">
                      <span class="iconify w-7 h-7 sm:w-8 sm:h-8 mb-2" data-icon="mdi:bell-outline"></span>
                      <p class="text-xs sm:text-sm">No tienes notificaciones</p>
                    </div>
                    <div v-else v-for="notification in notifications.slice(0, 3)" :key="notification.id"
                      @click="handleNotification(notification)"
                      class="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-colors duration-200 cursor-pointer bg-[#E8F0E5]">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0" :class="{
                        'bg-red-100': notification.type === 'expiry',
                        'bg-green-100': notification.type === 'recipe',
                        'bg-yellow-100': notification.type === 'shopping'
                      }">
                        <span class="iconify w-4 h-4 sm:w-5 sm:h-5" :class="{
                          'text-red-600': notification.type === 'expiry',
                          'text-green-600': notification.type === 'recipe',
                          'text-yellow-600': notification.type === 'shopping'
                        }" :data-icon="getNotificationIcon(notification.type)"></span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-[#1E2A1E]">{{ notification.title }}</p>
                        <p class="text-[10px] sm:text-xs mt-0.5 text-[#5A6E5A] line-clamp-2">{{ notification.message }}</p>
                        <p class="text-[10px] sm:text-xs mt-0.5 opacity-70 text-[#5A6E5A]">{{ formatTimeAgo(notification.created_at) }}</p>
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
    <div v-if="showToast" class="fixed top-5 right-3 sm:right-5 z-9999 max-w-85 sm:max-w-100 min-w-65 sm:min-w-75 animate-slide-in-right text-white"
      :class="{
        'bg-linear-to-r from-[#4A8B5C] to-[#7BA86A]': toastType === 'success',
        'bg-linear-to-r from-[#D9534F] to-[#b31534]': toastType === 'error',
        'bg-linear-to-r from-[#f59e0b] to-[#d97706]': toastType === 'warning'
      }">
      <div class="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
        <span class="iconify w-5 h-5 sm:w-6 sm:h-6 shrink-0" :data-icon="toastIcon"></span>
        <div class="min-w-0">
          <p class="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{{ toastTitle }}</p>
          <p class="text-[10px] sm:text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false"
          class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-3 h-3 sm:w-4 sm:h-4 text-white" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>

    <!-- CHANGE MEAL MODAL (MEJORADO - Estilo Planificador) -->
    <div v-if="showChangeMealModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-3 sm:p-4 animate-fade-in"
      @click="closeChangeMealModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-4 sm:p-6 md:p-8 bg-white" @click.stop>
        <button @click="closeChangeMealModal" class="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border bg-[#F4F9F4] border-[#E2E8E2] flex items-center justify-center">
          <span class="iconify w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:close"></span>
        </button>
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Cambiar {{ getMealTypeText(currentMealType) }}</h2>
        
        <!-- Input de búsqueda -->
        <div class="mb-4 sm:mb-6">
          <div class="relative">
            <span class="iconify absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#6C7A6C] w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:magnify"></span>
            <input type="text" v-model="recipeSearchQuery" placeholder="Buscar recetas..." 
              class="w-full rounded-xl border border-[#E2E8E2] bg-white py-2.5 sm:py-3 pl-9 sm:pl-12 pr-4 text-sm text-[#1E2A1E] focus:border-[#5DA271] focus:outline-none focus:ring-2 focus:ring-[rgba(93,162,113,0.2)]">
          </div>
        </div>

        <!-- Grid de recetas MEJORADO con más información -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-h-80 sm:max-h-100 overflow-y-auto p-1">
          <div v-for="recipe in filteredChangeMealRecipes" :key="recipe.id" 
            @click="selectMeal(recipe)"
            class="cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
            :class="{ 'border-[#4A8B5C] bg-[rgba(74,139,92,0.05)]': selectedMeal?.id === recipe.id, 'border-[#E2E8E2] bg-white': selectedMeal?.id !== recipe.id }">
            <div class="flex gap-3 p-2 sm:p-3">
              <div class="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)]">
                <img :src="recipe.image_url || defaultImage" :alt="recipe.title" class="w-full h-full object-cover" @error="handleImageError">
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm sm:text-base font-semibold text-[#1E2A1E] line-clamp-1">{{ recipe.title }}</p>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[11px] sm:text-xs text-[#6C7A6C]">
                  <span class="flex items-center gap-0.5">
                    <span class="iconify w-3 h-3 text-[#5DA271]" data-icon="mdi:clock-outline"></span>
                    {{ recipe.total_time }} min
                  </span>
                  <span class="flex items-center gap-0.5">
                    <span class="iconify w-3 h-3 text-[#5DA271]" data-icon="mdi:account-group-outline"></span>
                    {{ recipe.servings }} porc.
                  </span>
                  <span class="flex items-center gap-0.5">
                    <span class="iconify w-3 h-3 text-red-500" data-icon="mdi:fire"></span>
                    {{ recipe.calories_per_serving || '--' }} kcal
                  </span>
                </div>
                <div class="mt-1.5 flex flex-wrap gap-1">
                  <span class="rounded bg-[#E8F0E8] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-[#4A8B5C]">
                    {{ getCategoryLabel(recipe.category) }}
                  </span>
                  <span v-for="tag in (recipe.tags || []).slice(0, 2)" :key="tag" class="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-[#6C7A6C]">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
          <button @click="closeChangeMealModal" class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-[#E2E8E2] bg-transparent text-[#1E2A1E] text-sm sm:text-base">Cancelar</button>
          <button @click="confirmMealChange" :disabled="!selectedMeal"
            class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-[#4A8B5C] text-sm sm:text-base">
            Cambiar Comida
          </button>
        </div>
      </div>
    </div>

    <!-- GENERATE MENU MODAL -->
    <div v-if="showGenerateMenuModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-3 sm:p-4 animate-fade-in"
      @click="closeGenerateMenuModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-4 sm:p-6 md:p-8 bg-white" @click.stop>
        <button @click="closeGenerateMenuModal" class="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border bg-[#F4F9F4] border-[#E2E8E2] flex items-center justify-center">
          <span class="iconify w-4 h-4 sm:w-5 sm:h-5" data-icon="mdi:close"></span>
        </button>
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Generar Nuevo Menú</h2>
        <div class="mb-4 sm:mb-6">
          <h3 class="text-sm sm:text-base font-medium mb-2 sm:mb-3">Preferencias</h3>
          <label class="flex items-center gap-2 text-sm sm:text-base">
            <input type="checkbox" v-model="menuPreferences.healthy"> Saludable
          </label>
          <label class="flex items-center gap-2 mt-2 text-sm sm:text-base">
            <input type="checkbox" v-model="menuPreferences.quick"> Rápido (&lt;30 min)
          </label>
        </div>
        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
          <button @click="closeGenerateMenuModal" class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-[#E2E8E2] bg-transparent text-[#1E2A1E] text-sm sm:text-base">Cancelar</button>
          <button @click="generateNewMenu" class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white transition-all duration-200 bg-[#8b5cf6] hover:bg-[#7c3aed] text-sm sm:text-base">Generar Menú</button>
        </div>
      </div>
    </div>

    <!-- ADD INGREDIENT MODAL -->
    <div v-if="showAddIngredientModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-3 sm:p-4 animate-fade-in"
      @click="closeAddIngredientModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-4 sm:p-6 md:p-8 bg-white" @click.stop>
        <button @click="closeAddIngredientModal"
          class="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#F4F9F4] border-[#E2E8E2]">
          <span class="iconify w-4 h-4 sm:w-5 sm:h-5 text-[#1E2A1E]" data-icon="mdi:close"></span>
        </button>

        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-[#1E2A1E]">Agregar Ingrediente</h2>

        <div class="mb-4 sm:mb-6">
          <div class="relative">
            <span class="iconify w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#5A6E5A]" data-icon="mdi:magnify"></span>
            <input type="text" v-model="ingredientSearch" @input="filterIngredients" placeholder="Buscar ingrediente..."
              class="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base">
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-80 sm:max-h-100 overflow-y-auto p-1">
          <div v-for="ingredient in filteredIngredientList" :key="ingredient.id" @click="selectIngredient(ingredient)"
            class="relative rounded-xl border p-2 sm:p-3 md:p-4 flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-[#E2E8E2] bg-white">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
              <img :src="ingredient.image_url || defaultImage" :alt="ingredient.name" class="w-full h-full object-cover" @error="handleImageError">
            </div>
            <div class="font-medium text-xs sm:text-sm text-center text-[#1E2A1E] line-clamp-1">{{ ingredient.name }}</div>
            <button class="absolute top-1 sm:top-2 right-1 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-110 bg-[#4A8B5C]">
              <span class="iconify w-3 h-3 sm:w-4 sm:h-4" data-icon="mdi:plus"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- INGREDIENT DETAILS MODAL -->
    <div v-if="showIngredientDetailsModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-3 sm:p-4 animate-fade-in"
      @click="closeIngredientDetailsModal">
      <div class="rounded-2xl max-w-125 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-4 sm:p-6 md:p-8 bg-white" @click.stop>
        <button @click="closeIngredientDetailsModal"
          class="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#F4F9F4] border-[#E2E8E2]">
          <span class="iconify w-4 h-4 sm:w-5 sm:h-5 text-[#1E2A1E]" data-icon="mdi:close"></span>
        </button>

        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-[#1E2A1E]">{{ selectedIngredient.name }}</h2>

        <div class="w-full h-40 sm:h-50 rounded-xl overflow-hidden mb-4 sm:mb-6">
          <img :src="selectedIngredient.image_url || defaultImage" :alt="selectedIngredient.name"
            class="w-full h-full object-cover" @error="handleImageError">
        </div>
        <div class="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
          <div>
            <label class="block text-sm sm:text-base font-medium mb-2 text-[#1E2A1E]">Categoría</label>
            <select v-model="newIngredientData.category"
              class="w-full p-2.5 sm:p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base">
              <option value="verduras">Verduras</option>
              <option value="frutas">Frutas</option>
              <option value="proteínas">Proteínas</option>
              <option value="granos">Granos</option>
              <option value="lácteos">Lácteos</option>
              <option value="condimentos">Condimentos</option>
            </select>
          </div>
          <div>
            <label class="block text-sm sm:text-base font-medium mb-2 text-[#1E2A1E]">Cantidad</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input type="number" v-model="newIngredientData.quantity" min="1"
                class="flex-1 p-2.5 sm:p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base">
              <select v-model="newIngredientData.unit"
                class="w-full sm:w-30 p-2.5 sm:p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base">
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
            <label class="block text-sm sm:text-base font-medium mb-2 text-[#1E2A1E]">Días hasta vencer (opcional)</label>
            <div class="relative">
              <input type="number" v-model="newIngredientData.expiryDays" min="1" placeholder="Ej: 7"
                class="w-full p-2.5 sm:p-3 pr-16 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base">
              <span class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#5A6E5A] text-xs sm:text-sm">días</span>
            </div>
          </div>

          <div>
            <label class="block text-sm sm:text-base font-medium mb-2 text-[#1E2A1E]">Notas adicionales (opcional)</label>
            <textarea v-model="newIngredientData.notes" rows="3" placeholder="Ej: Tomates orgánicos, maduros"
              class="w-full p-2.5 sm:p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 resize-none border-[#E2E8E2] bg-white text-[#1E2A1E] text-sm sm:text-base"></textarea>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
          <button @click="closeIngredientDetailsModal"
            class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl border transition-colors duration-200 font-medium border-[#E2E8E2] bg-transparent text-[#1E2A1E] text-sm sm:text-base">
            Cancelar
          </button>
          <button @click="addIngredientToPantry"
            class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-medium transition-colors duration-200 bg-[#4A8B5C] text-sm sm:text-base">
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
    const currentMealType = ref('')
    const selectedMeal = ref(null)
    const ingredientSearch = ref('')
    const selectedIngredient = ref(null)
    const recipeSearchQuery = ref('') // Para búsqueda en modal de cambio de comida

    // New ingredient data
    const newIngredientData = reactive({ category: 'verduras', quantity: 1, unit: 'unidades', expiryDays: null, notes: '' })
    const menuPreferences = reactive({ healthy: false, quick: false })

    // Modal states
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
      notifications: true
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

    // Recetas filtradas para el modal de cambio de comida
    const filteredChangeMealRecipes = computed(() => {
      let filtered = [...allRecipes.value]
      // Filtrar por tipo de comida actual (desayuno, almuerzo, cena)
      const typeMap = { 'desayuno': 'desayuno', 'almuerzo': 'almuerzo', 'cena': 'cena' }
      const targetType = typeMap[currentMealType.value] || currentMealType.value
      filtered = filtered.filter(r => r.category === targetType)
      
      if (recipeSearchQuery.value.trim()) {
        const query = recipeSearchQuery.value.toLowerCase()
        filtered = filtered.filter(r => r.title.toLowerCase().includes(query))
      }
      return filtered
    })

    // Navegación a detalle de receta
    const goToRecipeDetail = (id) => {
      router.push(`/recetas/${id}`)
    }

    // ========== LOAD TODAY'S MEALS ==========
    const loadTodayMeals = async () => {
      try {
        loadingStates.meals = true

        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7

        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const weekStartStr = weekStart.toISOString().split('T')[0]

        let { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('week_start', weekStartStr)
          .single()

        if (plannerError && plannerError.code === 'PGRST116') {
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
          .select('id, title, total_time, servings, image_url, category, tags, calories_per_serving')
          .eq('is_public', true)
          .order('rating', { ascending: false })
          .limit(4)

        if (error) throw error

        const { data: pantry } = await supabase
          .from('user_pantry')
          .select('ingredient_id')
          .eq('user_id', authStore.user?.id)

        const pantryIngredientIds = new Set(pantry?.map(p => p.ingredient_id) || [])

        const recipesWithAvailability = []
        for (const recipe of (data || [])) {
          const { data: ingredients } = await supabase
            .from('recipe_ingredients')
            .select('ingredient_id')
            .eq('recipe_id', recipe.id)

          const total = ingredients?.length || 0
          const available = ingredients?.filter(ing => pantryIngredientIds.has(ing.ingredient_id)).length || 0

          recipesWithAvailability.push({
            ...recipe,
            total_ingredients: total,
            available_ingredients: available
          })
        }

        popularRecipes.value = recipesWithAvailability
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
          .select('id, title, total_time, servings, image_url, category, calories_per_serving, tags')
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

    // ========== CHANGE MEAL ==========
    const openChangeMealModal = (mealType, currentMeal = null) => {
      currentMealType.value = mealType
      selectedMeal.value = null
      recipeSearchQuery.value = ''
      showChangeMealModal.value = true
    }

    const closeChangeMealModal = () => {
      showChangeMealModal.value = false
      selectedMeal.value = null
      recipeSearchQuery.value = ''
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

        // Mapear el tipo de comida (desayuno, almuerzo, cena)
        const mealTypeMap = { 'desayuno': 'desayuno', 'almuerzo': 'almuerzo', 'cena': 'cena' }
        const dbMealType = mealTypeMap[currentMealType.value] || currentMealType.value

        await supabase.from('planned_meals').upsert({
          planner_id: planner.id,
          day_of_week: dayOfWeek,
          meal_type: dbMealType,
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

    // ========== GENERATE MENU (CORREGIDO) ==========
    const openGenerateMenuModal = () => {
      showGenerateMenuModal.value = true
    }

    const closeGenerateMenuModal = () => {
      showGenerateMenuModal.value = false
    }

    const generateNewMenu = async () => {
      try {
        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7
        
        // Calcular el inicio de la semana (lunes)
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const weekStartStr = weekStart.toISOString().split('T')[0]

        // Obtener o crear el planificador
        let { data: planner } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('week_start', weekStartStr)
          .single()

        if (!planner) {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          const { data: newPlanner } = await supabase
            .from('weekly_planner')
            .insert({ 
              user_id: authStore.user?.id, 
              week_start: weekStartStr, 
              week_end: weekEnd.toISOString().split('T')[0],
              preferences: menuPreferences
            })
            .select()
            .single()
          planner = newPlanner
        }

        // Eliminar comidas existentes para el día de hoy
        await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', planner.id)
          .eq('day_of_week', dayOfWeek)

        // Definir los tipos de comida a generar
        const mealTypes = ['desayuno', 'almuerzo', 'cena']
        const newMeals = []

        // Filtrar recetas según preferencias
        let availableRecipes = [...allRecipes.value]
        
        if (menuPreferences.healthy) {
          availableRecipes = availableRecipes.filter(r => (r.calories_per_serving || 500) <= 450)
        }
        if (menuPreferences.quick) {
          availableRecipes = availableRecipes.filter(r => (r.total_time || 60) <= 30)
        }

        // Para cada tipo de comida, seleccionar una receta aleatoria de la categoría correspondiente
        for (const mealType of mealTypes) {
          const recipesForType = availableRecipes.filter(r => r.category === mealType)
          
          if (recipesForType.length === 0) {
            console.warn(`No hay recetas disponibles para ${mealType}`)
            // Si no hay para este tipo, intentar con cualquier categoría
            const anyRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)]
            if (anyRecipe) {
              newMeals.push({
                planner_id: planner.id,
                day_of_week: dayOfWeek,
                meal_type: mealType,
                recipe_id: anyRecipe.id
              })
            }
          } else {
            const randomIndex = Math.floor(Math.random() * recipesForType.length)
            const selectedRecipe = recipesForType[randomIndex]
            newMeals.push({
              planner_id: planner.id,
              day_of_week: dayOfWeek,
              meal_type: mealType,
              recipe_id: selectedRecipe.id
            })
          }
        }

        // Insertar las nuevas comidas si hay alguna
        if (newMeals.length > 0) {
          const { error: insertError } = await supabase
            .from('planned_meals')
            .insert(newMeals)

          if (insertError) {
            console.error('Error insertando comidas:', insertError)
            throw insertError
          }
        }

        // Recargar las comidas del día
        await loadTodayMeals()
        showNotification('success', 'Éxito', '¡Menú generado exitosamente!')
        closeGenerateMenuModal()

      } catch (error) {
        console.error('Error generando menú:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú: ' + error.message)
      }
    }

    // ========== PANTRY ACTIONS ==========
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

      newIngredientData.category = ingredient.category || 'verduras'
      newIngredientData.quantity = 1
      newIngredientData.unit = 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }

    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
      selectedIngredient.value = null
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
        goToRecipeDetail(notification.related_id)
      } else if (notification.type === 'shopping') {
        router.push('/lista-compras')
      }
      await loadNotifications()
    }

    const handleImageError = (event) => { event.target.src = defaultImage }

    // ========== NAVIGATION ==========
    const goToRecipes = () => router.push('/recetas')

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
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      currentMealType,
      selectedMeal,
      selectedIngredient,
      ingredientSearch,
      filteredIngredientList,
      filteredChangeMealRecipes,
      newIngredientData,
      menuPreferences,
      loadingStates,
      recipeSearchQuery,
      defaultImage,
      getCategoryLabel,
      getMealTypeText,
      getNotificationIcon,
      formatTimeAgo,
      goToRecipeDetail,
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