<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen" :class="{ 'overflow-hidden': isMobileMenuOpen }" style="background-color: var(--background); color: var(--foreground);">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" 
      class="fixed left-0 top-0 w-65 h-screen z-1000 bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="{ 'translate-x-0': isMobileMenuOpen, '-translate-x-full': !isMobileMenuOpen }"
      style="background-color: var(--card); border-color: var(--border);" />

    <!-- Main Content Area -->
    <div class="min-h-screen transition-all duration-300 ease-in-out md:ml-65" style="background-color: var(--background);">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" 
        class="fixed top-0 right-0 left-0 md:left-65 h-17.5 z-900 border-b shadow-sm transition-all duration-300"
        style="background-color: var(--card); border-color: var(--border);" />

      <!-- Scrollable Content -->
      <main class="pt-17.5 min-h-[calc(100vh-70px)] overflow-y-auto" style="background-color: var(--background);">
        <div class="max-w-300 mx-auto w-full p-4 md:p-6 lg:p-8">
          <div class="flex flex-col gap-6">
            <!-- Daily Meals -->
            <section class="rounded-2xl p-6 shadow-sm border" style="background-color: var(--card); border-color: var(--border);">
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
                <!-- Loading State -->
                <div v-if="loadingStates.meals" class="col-span-full flex flex-col items-center justify-center py-12" style="color: var(--muted-foreground);">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4" style="border-color: var(--border); border-top-color: var(--primary);"></div>
                  <p>Cargando comidas...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="todayMeals.length === 0" class="col-span-full flex flex-col items-center justify-center py-12" style="color: var(--muted-foreground);">
                  <span class="iconify w-12 h-12 mb-4" style="color: var(--muted-foreground);" data-icon="mdi:food-outline"></span>
                  <p>No hay comidas planificadas para hoy</p>
                  <button @click="openGenerateMenuModal" class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors duration-200" style="background-color: var(--primary);">
                    <span class="iconify w-5 h-5" data-icon="mdi:sparkles"></span>
                    Generar menú automático
                  </button>
                </div>

                <!-- Comidas cargadas -->
                <template v-else>
                  <div v-for="meal in todayMeals" :key="meal.id" 
                    class="rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style="background-color: var(--card); border-color: var(--border);">
                    <div class="relative h-40 overflow-hidden">
                      <img :src="meal.image" :alt="meal.title" class="w-full h-full object-cover">
                      <div class="absolute top-3 left-3 text-2xl">{{ getMealEmoji(meal.type) }}</div>
                      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                      <div class="absolute bottom-3 left-3 right-3">
                        <h4 class="text-white text-sm font-medium">{{ getMealTypeText(meal.type) }}</h4>
                      </div>
                    </div>
                    <div class="p-4">
                      <h3 class="font-medium mb-3" style="color: var(--foreground);">{{ meal.title }}</h3>
                      <div class="flex gap-4 mb-4 text-xs" style="color: var(--muted-foreground);">
                        <div class="flex items-center gap-1.5">
                          <span class="iconify w-3.5 h-3.5" data-icon="mdi:clock-outline"></span>
                          <span>{{ meal.time }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <span class="iconify w-3.5 h-3.5" data-icon="mdi:account-group-outline"></span>
                          <span>{{ meal.servings }}</span>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <button @click="openRecipeModal(meal.recipeId)" 
                          class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 text-white"
                          style="background-color: var(--primary);">
                          Cocinar
                        </button>
                        <button @click="openChangeMealModal(meal.type === 'desayuno' ? 'breakfast' : meal.type === 'almuerzo' ? 'lunch' : 'dinner')" 
                          class="px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium"
                          style="border-color: var(--border); color: var(--foreground); background-color: transparent;">
                          Cambiar
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- My Pantry -->
            <section class="rounded-2xl p-6 shadow-sm border" style="background-color: var(--card); border-color: var(--border);">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 class="text-xl font-semibold" style="color: var(--foreground);">Mi Despensa</h2>
                <button @click="openAddIngredientModal" 
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm"
                  style="border-color: var(--border); color: var(--primary); background-color: transparent;">
                  <span class="iconify w-5 h-5" data-icon="mdi:plus"></span>
                  Agregar ingrediente
                </button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <!-- Loading State -->
                <div v-if="loadingStates.pantry && pantryItems.length === 0" class="col-span-full flex flex-col items-center justify-center py-12" style="color: var(--muted-foreground);">
                  <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4" style="border-color: var(--border); border-top-color: var(--primary);"></div>
                  <p>Cargando despensa...</p>
                </div>

                <div v-else-if="pantryItems.length === 0" class="col-span-full flex flex-col items-center justify-center py-12" style="color: var(--muted-foreground);">
                  <span class="iconify w-12 h-12 mb-4" style="color: var(--muted-foreground);" data-icon="mdi:fridge-outline"></span>
                  <p>Tu despensa está vacía</p>
                  <button @click="openAddIngredientModal" class="mt-4 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors duration-200" style="background-color: var(--primary);">
                    Agregar tu primer ingrediente
                  </button>
                </div>

                <div v-else v-for="item in pantryItems" :key="item.id" 
                  class="rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200"
                  style="background-color: var(--card); border-color: var(--border);">
                  <div class="relative h-32">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white" :class="{
                      'bg-green-600': item.expiryBadge === 'safe',
                      'bg-orange-500': item.expiryBadge === 'warning',
                      'bg-red-600': item.expiryBadge === 'danger'
                    }">
                      {{ item.daysUntilExpiry !== null ? `${item.daysUntilExpiry} días` : 'Sin fecha' }}
                    </span>
                  </div>
                  <div class="p-3">
                    <h4 class="font-medium text-sm mb-1" style="color: var(--foreground);">{{ item.name }}</h4>
                    <p class="text-xs mb-0.5" style="color: var(--foreground);">{{ item.quantity }}</p>
                    <p class="text-xs uppercase tracking-wide mb-2" style="color: var(--muted-foreground);">{{ item.category }}</p>
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
                        <span class="iconify w-4 h-4" data-icon="mdi:trash-can-outline" style="color: var(--destructive);"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Grid Layout for Recipes and Weather -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Recommended Recipes -->
              <section class="rounded-2xl p-6 shadow-sm border" style="background-color: var(--card); border-color: var(--border);">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold" style="color: var(--foreground);">Recetas Recomendadas</h2>
                  <button @click="goToRecipes" class="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200" style="color: var(--primary);">
                    Ver todas
                    <span class="iconify w-4 h-4" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Loading State -->
                  <div v-if="loadingStates.recipes && recommendedRecipes.length === 0" class="col-span-full flex flex-col items-center justify-center py-12" style="color: var(--muted-foreground);">
                    <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4" style="border-color: var(--border); border-top-color: var(--primary);"></div>
                    <p>Cargando recetas...</p>
                  </div>

                  <div v-else v-for="recipe in recommendedRecipes.slice(0, 2)" :key="recipe.id" @click="openRecipeModal(recipe.id)" 
                    class="rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style="background-color: var(--card); border-color: var(--border);">
                    <div class="relative h-32">
                      <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover">
                      <span class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white" style="background-color: var(--primary);">{{ recipe.badge }}</span>
                    </div>
                    <div class="p-3">
                      <h4 class="font-medium text-sm mb-2" style="color: var(--foreground);">{{ recipe.title }}</h4>
                      <div class="flex gap-3 text-xs mb-3" style="color: var(--muted-foreground);">
                        <span>⏱️ {{ recipe.time }}</span>
                        <span>👥 {{ recipe.servings }}</span>
                      </div>
                      <button class="w-full py-2 rounded-lg text-xs font-medium transition-all duration-200" style="border: 1px solid var(--primary); color: var(--primary); background-color: transparent;">
                        Ver receta
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right Column -->
              <div class="flex flex-col gap-6">
                <!-- Weather Suggestion -->
                <section class="rounded-2xl p-6 text-white shadow-lg" style="background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <span class="iconify w-8 h-8 text-white" data-icon="mdi:weather-partly-cloudy"></span>
                    </div>
                    <div>
                      <h3 class="font-medium text-white text-base">Sugerencia del clima</h3>
                      <p class="text-sm text-white/90">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C - ${weatherSuggestion.condition}` : '18°C - Parcialmente nublado' }}</p>
                    </div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p class="text-sm mb-4 leading-relaxed flex items-start gap-1.5">
                      <span class="iconify w-4 h-4 mt-0.5 shrink-0" data-icon="mdi:lightbulb-on-outline"></span>
                      {{ weatherSuggestion ? weatherSuggestion.suggestionText : 'Hoy es un día perfecto para preparar Sopa de Verduras Nutritiva. El clima fresco pide algo caliente y reconfortante.' }}
                    </p>
                    <div class="grid grid-cols-3 gap-2 mb-4">
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Temperatura</span>
                        <span class="block text-lg font-semibold">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C` : '18°C' }}</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Humedad</span>
                        <span class="block text-lg font-semibold">65%</span>
                      </div>
                      <div class="bg-white/15 rounded-lg p-2 text-center">
                        <span class="block text-xs text-white/80">Viento</span>
                        <span class="block text-lg font-semibold">12 km/h</span>
                      </div>
                    </div>
                    <button @click="openWeatherRecipeModal" class="w-full py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2" style="background-color: white; color: var(--primary);">
                      <span class="iconify w-4 h-4" data-icon="mdi:food"></span>
                      Ir a receta sugerida
                    </button>
                  </div>
                </section>

                <!-- Notifications -->
                <section class="rounded-2xl p-6 shadow-sm border" style="background-color: var(--card); border-color: var(--border);">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-medium" style="color: var(--foreground);">Notificaciones</h3>
                    <span class="w-6 h-6 rounded-full text-white text-xs font-medium flex items-center justify-center" style="background-color: var(--primary);">{{ notifications.length }}</span>
                  </div>
                  <div class="flex flex-col gap-3">
                    <!-- Loading State -->
                    <div v-if="loadingStates.notifications && notifications.length === 0" class="flex flex-col items-center justify-center py-8" style="color: var(--muted-foreground);">
                      <div class="w-8 h-8 border-3 rounded-full animate-spin mb-3" style="border-color: var(--border); border-top-color: var(--primary);"></div>
                      <p class="text-sm">Cargando notificaciones...</p>
                    </div>

                    <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8" style="color: var(--muted-foreground);">
                      <span class="iconify w-8 h-8 mb-2" style="color: var(--muted-foreground);" data-icon="mdi:bell-outline"></span>
                      <p class="text-sm">No tienes notificaciones</p>
                    </div>

                    <div v-else v-for="notification in notifications.slice(0, 3)" :key="notification.id" @click="handleNotification(notification)" 
                      class="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200 cursor-pointer" style="background-color: var(--muted);">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="{
                        'bg-red-100': notification.type === 'alert',
                        'bg-green-100': notification.type === 'recipe',
                        'bg-yellow-100': notification.type === 'shopping'
                      }">
                        <span class="iconify w-5 h-5" :class="{
                          'text-red-600': notification.type === 'alert',
                          'text-green-600': notification.type === 'recipe',
                          'text-yellow-600': notification.type === 'shopping'
                        }" :data-icon="notification.icon"></span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm" style="color: var(--foreground);">{{ notification.text }}</p>
                        <p class="text-xs mt-0.5" style="color: var(--muted-foreground);">{{ notification.time }}</p>
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
    <div v-if="showToast" 
      class="fixed top-5 right-5 z-9999 max-w-100 min-w-75 animate-slide-in-right text-white"
      :style="{
        background: toastType === 'success' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' :
                  toastType === 'error' ? 'linear-gradient(135deg, var(--destructive) 0%, #b31534 100%)' :
                  toastType === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderLeftWidth: '4px',
        borderLeftColor: toastType === 'success' ? '#2d6a4f' : toastType === 'error' ? '#b91c1c' : toastType === 'warning' ? '#b45309' : '#1e40af'
      }">
      <div class="flex items-start gap-3 p-4">
        <span class="iconify w-6 h-6 shrink-0" :data-icon="toastIcon || 'mdi:information'"></span>
        <div>
          <p class="font-semibold text-sm mb-1">{{ toastTitle }}</p>
          <p class="text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false" class="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-4 h-4 text-white" data-icon="mdi:close"></span>
        </button>
      </div>
    </div>

    <!-- MODALS -->

    <!-- Recipe Modal -->
    <div v-if="showRecipeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeRecipeModal">
      <div class="rounded-2xl max-w-225 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in" @click.stop style="background-color: var(--card);">
        <button @click="closeRecipeModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center z-10"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <div v-if="loadingStates.recipeModal" class="flex flex-col items-center justify-center min-h-75" style="color: var(--muted-foreground);">
          <div class="w-10 h-10 border-4 rounded-full animate-spin mb-4" style="border-color: var(--border); border-top-color: var(--primary);"></div>
          <p>Cargando receta...</p>
        </div>

        <div v-else>
          <div class="relative h-75 overflow-hidden rounded-t-2xl">
            <img :src="currentRecipe.image" :alt="currentRecipe.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div class="flex gap-2 mb-4 flex-wrap">
                <span v-for="badge in currentRecipe.badges" :key="badge" class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">{{ badge }}</span>
              </div>
              <h2 class="text-3xl font-bold mb-2">{{ currentRecipe.title }}</h2>
              <div class="flex items-center gap-2">
                <span class="text-yellow-400 text-lg">★★★★★</span>
                <span class="text-sm">{{ currentRecipe.rating }}</span>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-xl" style="background-color: var(--muted);">
              <div class="text-center p-2">
                <span class="iconify w-6 h-6 mx-auto mb-2" style="color: var(--primary);" data-icon="mdi:clock-outline"></span>
                <span class="block text-lg font-semibold" style="color: var(--foreground);">{{ currentRecipe.time }}</span>
                <span class="block text-xs" style="color: var(--muted-foreground);">Tiempo</span>
              </div>
              <div class="text-center p-2">
                <span class="iconify w-6 h-6 mx-auto mb-2" style="color: var(--primary);" data-icon="mdi:account-group-outline"></span>
                <span class="block text-lg font-semibold" style="color: var(--foreground);">{{ currentRecipe.servings }}</span>
                <span class="block text-xs" style="color: var(--muted-foreground);">Porciones</span>
              </div>
              <div class="text-center p-2">
                <span class="iconify w-6 h-6 mx-auto mb-2" style="color: var(--primary);" data-icon="mdi:fire"></span>
                <span class="block text-lg font-semibold" style="color: var(--foreground);">{{ currentRecipe.calories }}</span>
                <span class="block text-xs" style="color: var(--muted-foreground);">Calorías</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button @click="toggleFavorite" 
                class="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 font-medium"
                style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
                <span class="iconify w-5 h-5" :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
                {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
              </button>
              <button @click="addToShoppingList" 
                class="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 font-medium"
                style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
                <span class="iconify w-5 h-5" data-icon="mdi:cart-plus"></span>
                Agregar a lista de compras
              </button>
            </div>

            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4 flex items-center gap-2" style="color: var(--foreground);">
                <span class="iconify w-6 h-6" data-icon="mdi:food-apple" style="color: var(--primary);"></span>
                Ingredientes
              </h3>
              <div class="p-6 rounded-xl" style="background-color: var(--muted);">
                <div v-for="ingredient in currentRecipe.ingredients" :key="ingredient.name" 
                  class="flex justify-between items-center py-3 border-b last:border-0" style="border-color: var(--border);">
                  <span class="font-medium" style="color: var(--foreground);">{{ ingredient.name }}</span>
                  <span class="font-semibold" style="color: var(--primary);">{{ ingredient.quantity }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold mb-4 flex items-center gap-2" style="color: var(--foreground);">
                <span class="iconify w-6 h-6" data-icon="mdi:book-open-page-variant" style="color: var(--primary);"></span>
                Instrucciones paso a paso
              </h3>
              <div class="p-6 rounded-xl" style="background-color: var(--muted);">
                <div class="flex items-center justify-between mb-6 pb-4 border-b" style="border-color: var(--border);">
                  <button @click="prevStep" :disabled="currentStep === 0" 
                    class="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    style="border-color: var(--border); background-color: var(--card); color: var(--foreground);">
                    <span class="iconify w-4 h-4" data-icon="mdi:chevron-left"></span>
                    Anterior
                  </button>
                  <div class="font-semibold" style="color: var(--foreground);">Paso {{ currentStep + 1 }} de {{ currentRecipe.steps?.length || 0 }}</div>
                  <button @click="nextStep" :disabled="currentStep === (currentRecipe.steps?.length - 1 || 0)" 
                    class="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    style="border-color: var(--border); background-color: var(--card); color: var(--foreground);">
                    Siguiente
                    <span class="iconify w-4 h-4" data-icon="mdi:chevron-right"></span>
                  </button>
                </div>

                <div v-if="currentRecipe.steps && currentRecipe.steps[currentStep]" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="rounded-xl overflow-hidden h-62.5">
                    <img :src="currentRecipe.steps[currentStep].image_url || currentRecipe.steps[currentStep].image" :alt="'Paso ' + (currentStep + 1)" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold mb-3" style="color: var(--foreground);">Paso {{ currentStep + 1 }}</h4>
                    <p class="leading-relaxed" style="color: var(--muted-foreground);">{{ currentRecipe.steps[currentStep].description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Meal Modal -->
    <div v-if="showChangeMealModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeChangeMealModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop style="background-color: var(--card);">
        <button @click="closeChangeMealModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">Cambiar {{ currentMealType === 'breakfast' ? 'Desayuno' : currentMealType === 'lunch' ? 'Almuerzo' : 'Cena' }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-100 overflow-y-auto p-4">
          <div v-for="meal in filteredMeals" :key="meal.id" @click="selectMeal(meal)" 
            class="rounded-xl border-2 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
            :class="{
              'border-green-600': selectedMeal?.id === meal.id,
              'border-gray-200': selectedMeal?.id !== meal.id
            }"
            :style="{
              backgroundColor: selectedMeal?.id === meal.id ? 'var(--muted)' : 'var(--card)',
              borderColor: selectedMeal?.id === meal.id ? 'var(--primary)' : 'var(--border)'
            }">
            <div class="relative h-30">
              <img :src="meal.image" :alt="meal.title" class="w-full h-full object-cover">
              <span class="absolute top-2 left-2 px-3 py-1 rounded-full text-white text-xs font-medium" style="background-color: var(--primary);">{{ getMealTypeText(meal.type) }}</span>
            </div>
            <div class="p-4">
              <h4 class="font-medium mb-2" style="color: var(--foreground);">{{ meal.title }}</h4>
              <div class="flex gap-3 text-xs" style="color: var(--muted-foreground);">
                <span>⏱️ {{ meal.time }}</span>
                <span>👥 {{ meal.servings }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <button @click="closeChangeMealModal" 
            class="px-6 py-3 rounded-xl border transition-colors duration-200 font-medium"
            style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
            Cancelar
          </button>
          <button @click="confirmMealChange" :disabled="!selectedMeal" 
            class="px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: var(--primary);">
            Cambiar Comida
          </button>
        </div>
      </div>
    </div>

    <!-- Generate Menu Modal -->
    <div v-if="showGenerateMenuModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeGenerateMenuModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop style="background-color: var(--card);">
        <button @click="closeGenerateMenuModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">Generar Nuevo Menú</h2>

        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4" style="color: var(--foreground);">Preferencias</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors duration-200" style="border-color: var(--border); background-color: var(--card);">
              <input type="checkbox" v-model="menuPreferences.dietary" value="vegetariano" class="hidden">
              <span class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all" :class="{
                'bg-green-600 border-green-600': menuPreferences.dietary.includes('vegetariano')
              }" style="border-color: var(--border);">
                <span v-if="menuPreferences.dietary.includes('vegetariano')" class="text-white text-xs">✓</span>
              </span>
              <span class="font-medium" style="color: var(--foreground);">Vegetariano</span>
            </label>
            <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors duration-200" style="border-color: var(--border); background-color: var(--card);">
              <input type="checkbox" v-model="menuPreferences.dietary" value="saludable" class="hidden">
              <span class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all" :class="{
                'bg-green-600 border-green-600': menuPreferences.dietary.includes('saludable')
              }" style="border-color: var(--border);">
                <span v-if="menuPreferences.dietary.includes('saludable')" class="text-white text-xs">✓</span>
              </span>
              <span class="font-medium" style="color: var(--foreground);">Saludable</span>
            </label>
            <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors duration-200" style="border-color: var(--border); background-color: var(--card);">
              <input type="checkbox" v-model="menuPreferences.dietary" value="rapido" class="hidden">
              <span class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all" :class="{
                'bg-green-600 border-green-600': menuPreferences.dietary.includes('rapido')
              }" style="border-color: var(--border);">
                <span v-if="menuPreferences.dietary.includes('rapido')" class="text-white text-xs">✓</span>
              </span>
              <span class="font-medium" style="color: var(--foreground);">Rápido</span>
            </label>
          </div>
        </div>

        <div v-if="generatedMenu.length > 0" class="mb-8 max-h-75 overflow-y-auto rounded-xl p-4" style="background-color: var(--muted);">
          <div v-for="meal in generatedMenu" :key="meal.type" class="rounded-xl border mb-3 last:mb-0 overflow-hidden" style="border-color: var(--border); background-color: var(--card);">
            <div class="px-4 py-2 border-b" style="background-color: var(--muted); border-color: var(--border);">
              <h4 class="font-semibold" style="color: var(--primary);">{{ getMealTypeText(meal.type) }}</h4>
            </div>
            <div class="flex p-4 gap-4 items-center">
              <img :src="meal.image" :alt="meal.title" class="w-20 h-20 rounded-lg object-cover">
              <div class="flex-1">
                <h5 class="font-medium mb-1" style="color: var(--foreground);">{{ meal.title }}</h5>
                <div class="flex gap-3 text-xs" style="color: var(--muted-foreground);">
                  <span>⏱️ {{ meal.time }}</span>
                  <span>👥 {{ meal.servings }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mb-8 text-center py-8 rounded-xl" style="background-color: var(--muted); color: var(--muted-foreground);">
          <p>Genera un menú para ver la previsualización</p>
        </div>

        <div class="flex gap-4 justify-end">
          <button @click="closeGenerateMenuModal" 
            class="px-6 py-3 rounded-xl border transition-colors duration-200 font-medium"
            style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
            Cancelar
          </button>
          <button @click="generateNewMenu" 
            class="px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200 flex items-center gap-2"
            style="background-color: #8b5cf6;">
            <span class="iconify w-5 h-5" data-icon="mdi:sparkles"></span>
            Generar Menú
          </button>
          <button v-if="generatedMenu.length > 0" @click="applyGeneratedMenu" 
            class="px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200"
            style="background-color: var(--primary);">
            Aplicar Menú
          </button>
        </div>
      </div>
    </div>

    <!-- Add Ingredient Modal -->
    <div v-if="showAddIngredientModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeAddIngredientModal">
      <div class="rounded-2xl max-w-200 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop style="background-color: var(--card);">
        <button @click="closeAddIngredientModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">Agregar Ingrediente</h2>

        <div class="mb-6">
          <div class="relative">
            <span class="iconify w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style="color: var(--muted-foreground);" data-icon="mdi:magnify"></span>
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
              <img :src="ingredient.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200'" :alt="ingredient.name" class="w-full h-full object-cover">
            </div>
            <div class="font-medium text-sm text-center" style="color: var(--foreground);">{{ ingredient.name }}</div>
            <button class="absolute top-2 right-2 w-8 h-8 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-110" style="background-color: var(--primary);">
              <span class="iconify w-4 h-4" data-icon="mdi:plus"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ingredient Details Modal -->
    <div v-if="showIngredientDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeIngredientDetailsModal">
      <div class="rounded-2xl max-w-125 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop style="background-color: var(--card);">
        <button @click="closeIngredientDetailsModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <h2 class="text-2xl font-semibold text-center mb-6" style="color: var(--foreground);">{{ selectedIngredient.name }}</h2>

        <div class="w-full h-50 rounded-xl overflow-hidden mb-6">
          <img :src="selectedIngredient.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300'" :alt="selectedIngredient.name" class="w-full h-full object-cover">
        </div>

        <div class="flex flex-col gap-5 mb-8">
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
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label class="block font-medium mb-2" style="color: var(--foreground);">Cantidad</label>
            <div class="flex gap-2">
              <input type="number" v-model="newIngredientData.quantity" min="1" 
                class="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
              <select v-model="newIngredientData.unit" class="w-30 p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
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

          <div>
            <label class="block font-medium mb-2" style="color: var(--foreground);">Días hasta vencer (opcional)</label>
            <div class="relative">
              <input type="number" v-model="newIngredientData.expiryDays" min="1" placeholder="Ej: 7" 
                class="w-full p-3 pr-16 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                style="border-color: var(--border); background-color: var(--input-background); color: var(--foreground);">
              <span class="absolute right-4 top-1/2 -translate-y-1/2" style="color: var(--muted-foreground);">días</span>
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

    <!-- Weather Recipe Modal -->
    <div v-if="showWeatherRecipeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4 animate-fade-in" @click="closeWeatherRecipeModal">
      <div class="rounded-2xl max-w-150 w-full max-h-[90vh] overflow-y-auto relative animate-slide-in p-8" @click.stop style="background-color: var(--card);">
        <button @click="closeWeatherRecipeModal" 
          class="absolute top-4 right-4 w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center"
          style="background-color: var(--background); border-color: var(--border);">
          <span class="iconify w-5 h-5" data-icon="mdi:close" style="color: var(--foreground);"></span>
        </button>

        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);">
            <span class="iconify w-10 h-10 text-white" data-icon="mdi:weather-partly-cloudy"></span>
          </div>
          <div>
            <h2 class="text-2xl font-semibold" style="color: var(--foreground);">Receta Sugerida por el Clima</h2>
            <p style="color: var(--muted-foreground);">{{ weatherSuggestion ? `${weatherSuggestion.temperature}°C - ${weatherSuggestion.condition}` : '18°C - Parcialmente nublado' }}</p>
          </div>
        </div>

        <div class="rounded-xl overflow-hidden mb-8" style="background-color: var(--muted);">
          <div class="relative h-50">
            <img :src="weatherSuggestion?.recipe?.image_url || 'https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=300'" alt="Receta sugerida" class="w-full h-full object-cover">
            <span class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm font-medium text-sm" style="color: var(--primary);">🌤️ Perfecta para días frescos</span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-3" style="color: var(--foreground);">{{ weatherSuggestion?.recipe?.title || 'Sopa de Verduras Nutritiva' }}</h3>
            <p class="mb-6 leading-relaxed" style="color: var(--muted-foreground);">{{ weatherSuggestion?.suggestionText || 'Esta receta caliente y reconfortante es ideal para el clima fresco de hoy. Las verduras de temporada y el caldo casero te mantendrán abrigado.' }}</p>
            <div class="grid grid-cols-3 gap-4 p-4 rounded-xl border" style="border-color: var(--border); background-color: var(--card);">
              <div class="text-center">
                <span class="iconify w-6 h-6 mx-auto mb-2" data-icon="mdi:clock-outline" style="color: var(--primary);"></span>
                <span class="block font-semibold" style="color: var(--foreground);">35 min</span>
              </div>
              <div class="text-center">
                <span class="iconify w-6 h-6 mx-auto mb-2" data-icon="mdi:account-group-outline" style="color: var(--primary);"></span>
                <span class="block font-semibold" style="color: var(--foreground);">6 porciones</span>
              </div>
              <div class="text-center">
                <span class="iconify w-6 h-6 mx-auto mb-2" data-icon="mdi:fire" style="color: var(--primary);"></span>
                <span class="block font-semibold" style="color: var(--foreground);">210 kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <button @click="closeWeatherRecipeModal" 
            class="px-6 py-3 rounded-xl border transition-colors duration-200 font-medium"
            style="border-color: var(--border); background-color: transparent; color: var(--foreground);">
            Cancelar
          </button>
          <button @click="openRecipeModal(weatherSuggestion?.recipe?.id || 'aaaaaaaa-0000-0000-0000-000000000005')" 
            class="px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200 flex items-center gap-2"
            style="background-color: var(--primary);">
            <span class="iconify w-5 h-5" data-icon="mdi:chef-hat"></span>
            Ver Receta Completa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

<script>
import { ref, computed, reactive, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
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

    onBeforeUnmount(() => {
      console.log('HomeView se desmontará')
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
    // DATABASE FUNCTIONS
    // ============================================

    const loadTodayMeals = async () => {
      try {
        loadingStates.meals = true
        const today = new Date()
        const formattedToday = today.toISOString().split('T')[0]
        const dayOfWeek = (today.getDay() + 6) % 7
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        let plannerId = null
        const { data: existingPlanner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('week_start', formattedWeekStart)
          .maybeSingle()

        if (plannerError) {
          console.error('Error buscando planificador:', plannerError)
        }

        if (existingPlanner) {
          plannerId = existingPlanner.id
        } else {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          const { data: newPlanner, error: createError } = await supabase
            .from('weekly_planner')
            .insert({
              user_id: authStore.user.id,
              week_start: formattedWeekStart,
              week_end: weekEnd.toISOString().split('T')[0],
              preferences: { dietary: [] }
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creando planificador:', createError)
            try {
              const { data: altPlanner, error: altError } = await supabase
                .rpc('create_weekly_planner', {
                  p_user_id: authStore.user.id,
                  p_week_start: formattedWeekStart
                })
              if (altError) throw altError
              plannerId = altPlanner
            } catch (rpcError) {
              console.error('Error RPC:', rpcError)
              todayMeals.value = getDefaultMeals()
              return
            }
          } else {
            plannerId = newPlanner.id
          }
        }

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

        if (mealsError) {
          console.error('Error obteniendo comidas planificadas:', mealsError)
        }

        if (plannedMeals && plannedMeals.length > 0) {
          todayMeals.value = plannedMeals.map(meal => {
            const recipe = meal.recipe || {}
            return {
              id: meal.id,
              type: meal.meal_type,
              title: recipe.title || getDefaultMealTitle(meal.meal_type),
              description: recipe.description || '',
              time: `${recipe.total_time || 30} min`,
              servings: `${recipe.servings || 2} porciones`,
              image: recipe.image_url || getDefaultMealImage(meal.meal_type),
              calories: recipe.calories_per_serving,
              recipeId: recipe.id || getDefaultRecipeId(meal.meal_type)
            }
          })
        } else {
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
              .select()
              .single()
            if (insertError) {
              console.error(`Error insertando ${meal.type}:`, insertError)
            }
          }
          todayMeals.value = defaultMeals
        }
        ensureAllMealsPresent()
      } catch (error) {
        console.error('Error cargando comidas del día:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las comidas del día')
        todayMeals.value = getDefaultMeals()
      } finally {
        loadingStates.meals = false
      }
    }

    const ensureAllMealsPresent = () => {
      const requiredMeals = ['desayuno', 'almuerzo', 'cena']
      const existingTypes = todayMeals.value.map(m => m.type)
      requiredMeals.forEach(mealType => {
        if (!existingTypes.includes(mealType)) {
          todayMeals.value.push({
            id: `temp_${mealType}`,
            type: mealType,
            title: getDefaultMealTitle(mealType),
            time: '30 min',
            servings: '2 porciones',
            image: getDefaultMealImage(mealType),
            recipeId: getDefaultRecipeId(mealType)
          })
        }
      })
    }

    const getDefaultMealTitle = (mealType) => {
      const titles = {
        'desayuno': 'Bowl de Avena con Frutas',
        'almuerzo': 'Ensalada de Pollo a la Parrilla',
        'cena': 'Pasta Primavera'
      }
      return titles[mealType] || 'Receta del día'
    }

    const getDefaultMealImage = (mealType) => {
      const images = {
        'desayuno': 'https://images.unsplash.com/photo-1592503469196-3a7880cc2d05?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
        'almuerzo': 'https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200',
        'cena': 'https://images.unsplash.com/photo-1704915912471-070dd75619c9?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
      }
      return images[mealType] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
    }

    const getDefaultRecipeId = (mealType) => {
      const ids = {
        'desayuno': 'aaaaaaaa-0000-0000-0000-000000000001',
        'almuerzo': 'aaaaaaaa-0000-0000-0000-000000000002',
        'cena': 'aaaaaaaa-0000-0000-0000-000000000003'
      }
      return ids[mealType] || 'aaaaaaaa-0000-0000-0000-000000000001'
    }

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
        console.error('Error cargando despensa:', error)
        showNotification('error', 'Error', 'No se pudo cargar la despensa')
        pantryItems.value = []
      } finally {
        loadingStates.pantry = false
      }
    }

    const loadRecommendedRecipes = async () => {
      try {
        loadingStates.recipes = true
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
        console.error('Error cargando recetas recomendadas:', error)
        recommendedRecipes.value = []
      } finally {
        loadingStates.recipes = false
      }
    }

    const loadWeatherSuggestion = async () => {
      try {
        loadingStates.weather = true
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
        console.error('Error cargando sugerencia de clima:', error)
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
          notifications.value = [
            { id: 1, type: 'alert', icon: 'mdi:alert-circle-outline', text: 'El pollo caduca en 2 días', time: 'Hace 1 hora' },
            { id: 2, type: 'recipe', icon: 'mdi:food', text: 'Nueva receta sugerida para ti', time: 'Hace 3 horas' },
            { id: 3, type: 'shopping', icon: 'mdi:cart', text: 'La leche se está agotando', time: 'Hace 5 horas' }
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
          notifications.value = [
            { id: 1, type: 'alert', icon: 'mdi:alert-circle-outline', text: 'Bienvenido a Esencia Casera!', time: 'Recién' },
            { id: 2, type: 'recipe', icon: 'mdi:food', text: 'Agrega ingredientes a tu despensa para recibir recomendaciones', time: 'Recién' }
          ]
        }
      } catch (error) {
        console.error('Error cargando notificaciones:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las notificaciones')
        notifications.value = []
      } finally {
        loadingStates.notifications = false
      }
    }

    const loadAllIngredients = async () => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('id, name, category, image_url')
          .order('name')
        if (error) throw error
        allIngredients.value = data
      } catch (error) {
        console.error('Error cargando ingredientes:', error)
        allIngredients.value = []
      }
    }

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
        console.error('Error cargando todas las comidas:', error)
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

    const getMealEmoji = (mealType) => {
      const emojis = {
        'desayuno': '🌅',
        'almuerzo': '🍽️',
        'cena': '🌙',
        'breakfast': '🌅',
        'lunch': '🍽️',
        'dinner': '🌙'
      }
      return emojis[mealType] || '🍴'
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
    // MODAL FUNCTIONS
    // ============================================

    const openRecipeModal = async (recipeId) => {
      try {
        loadingStates.recipeModal = true
        if (!recipeId || typeof recipeId !== 'string') {
          showNotification('error', 'Error', 'ID de receta inválido')
          return
        }

        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single()

        if (recipeError) {
          currentRecipe.value = getDefaultRecipe()
          isFavorite.value = false
        } else {
          let ingredientsList = []
          try {
            const { data: ingredientsData, error: ingredientsError } = await supabase
              .from('recipe_ingredients')
              .select(`
                quantity,
                unit,
                ingredient:ingredients (name)
              `)
              .eq('recipe_id', recipeId)

            if (!ingredientsError && ingredientsData && ingredientsData.length > 0) {
              ingredientsList = ingredientsData.map(ri => ({
                name: ri.ingredient?.name || 'Ingrediente desconocido',
                quantity: `${ri.quantity} ${ri.unit}`
              }))
            } else {
              ingredientsList = getDefaultRecipe().ingredients
            }
          } catch (ingredientsError) {
            ingredientsList = getDefaultRecipe().ingredients
          }

          try {
            const { data: favoriteData, error: favoriteError } = await supabase
              .from('favorites')
              .select('id')
              .eq('user_id', authStore.user.id)
              .eq('recipe_id', recipeId)
              .maybeSingle()
            isFavorite.value = !!favoriteData
          } catch (favoriteCheckError) {
            isFavorite.value = false
          }

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
        }

        currentStep.value = 0
        showRecipeModal.value = true
      } catch (error) {
        console.error('Error cargando receta:', error)
        showNotification('error', 'Error', 'No se pudo cargar la receta')
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
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', authStore.user.id)
            .eq('recipe_id', currentRecipe.value.id)
          if (error) throw error
          isFavorite.value = false
          showNotification('success', 'Éxito', 'Receta eliminada de favoritos')
        } else {
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
        console.error('Error actualizando favoritos:', error)
        showNotification('error', 'Error', 'No se pudo actualizar favoritos')
      }
    }

    const addToShoppingList = async () => {
      try {
        if (!currentRecipe.value.id || currentRecipe.value.id === 'default') {
          showNotification('warning', 'Advertencia', 'No se puede agregar una receta de ejemplo')
          return
        }

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
        console.error('Error agregando a lista de compras:', error)
        showNotification('error', 'Error', 'No se pudieron agregar los ingredientes')
      }
    }

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

        const today = new Date()
        const dayOfWeek = (today.getDay() + 6) % 7
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay() + 1)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

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

        const typeMap = {
          'breakfast': 'desayuno',
          'lunch': 'almuerzo',
          'dinner': 'cena'
        }
        const targetType = typeMap[currentMealType.value] || currentMealType.value

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

        await loadTodayMeals()
        showNotification('success', 'Éxito', `Comida cambiada a: ${selectedMeal.value.title}`)
        closeChangeMealModal()
      } catch (error) {
        console.error('Error cambiando comida:', error)
        showNotification('error', 'Error', 'No se pudo cambiar la comida')
      }
    }

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
        const today = new Date()
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

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

        if (!plannerId) {
          showNotification('warning', 'Advertencia', 'No se pudo generar el menú')
          return
        }

        const jsDayOfWeek = today.getDay()
        const dayOfWeek = (jsDayOfWeek + 6) % 7

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
          .eq('day_of_week', dayOfWeek)
          .order('meal_type')

        if (mealsError) {
          generatedMenu.value = [
            { type: 'desayuno', title: 'Smoothie Bowl de Frutas Tropicales', time: '10 min', servings: '2 porciones', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200' },
            { type: 'almuerzo', title: 'Quinoa con Vegetales Salteados', time: '25 min', servings: '4 porciones', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200' },
            { type: 'cena', title: 'Crema de Calabaza', time: '30 min', servings: '4 porciones', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200' }
          ]
        } else {
          generatedMenu.value = plannedMeals.map(meal => ({
            type: meal.meal_type,
            title: meal.recipe?.title || 'Receta no disponible',
            time: `${meal.recipe?.total_time || 30} min`,
            servings: `${meal.recipe?.servings || 4} porciones`,
            image: meal.recipe?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'
          }))
        }

        showNotification('success', 'Éxito', 'Nuevo menú generado según tus preferencias')
      } catch (error) {
        console.error('Error generando menú:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    const applyGeneratedMenu = async () => {
      try {
        const today = new Date()
        const jsDayOfWeek = today.getDay()
        const dayOfWeek = (jsDayOfWeek + 6) % 7
        const weekStart = new Date(today)
        const dayDiff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        weekStart.setDate(dayDiff)
        const formattedWeekStart = weekStart.toISOString().split('T')[0]

        const { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user.id)
          .eq('week_start', formattedWeekStart)
          .single()

        if (plannerError) {
          showNotification('error', 'Error', 'No se encontró el planificador semanal')
          return
        }

        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', planner.id)
          .eq('day_of_week', dayOfWeek)

        if (deleteError) {
          showNotification('error', 'Error', 'No se pudieron eliminar las comidas anteriores')
          return
        }

        const mealsToInsert = generatedMenu.value.map(meal => ({
          planner_id: planner.id,
          day_of_week: dayOfWeek,
          meal_type: meal.type,
          recipe_id: getRecipeIdByTitle(meal.title) || getDefaultRecipeIdForType(meal.type)
        }))

        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert(mealsToInsert)

        if (insertError) throw insertError

        await loadTodayMeals()
        showNotification('success', 'Éxito', 'Nuevo menú aplicado exitosamente')
        closeGenerateMenuModal()
      } catch (error) {
        console.error('Error aplicando menú:', error)
        showNotification('error', 'Error', 'No se pudo aplicar el menú')
      }
    }

    const getRecipeIdByTitle = (title) => {
      const recipe = allMeals.value.find(r => r.title === title)
      return recipe ? recipe.id : null
    }

    const getDefaultRecipeIdForType = (type) => {
      const defaultMap = {
        'desayuno': 'aaaaaaaa-0000-0000-0000-000000000001',
        'almuerzo': 'aaaaaaaa-0000-0000-0000-000000000002',
        'cena': 'aaaaaaaa-0000-0000-0000-000000000003'
      }
      return defaultMap[type] || 'aaaaaaaa-0000-0000-0000-000000000001'
    }

    const openAddIngredientModal = () => {
      ingredientSearch.value = ''
      showAddIngredientModal.value = true
    }

    const closeAddIngredientModal = () => {
      showAddIngredientModal.value = false
    }

    const filterIngredients = () => {}

    const selectIngredient = (ingredient) => {
      selectedIngredient.value = ingredient
      showAddIngredientModal.value = false
      showIngredientDetailsModal.value = true
      newIngredientData.category = ingredient.category || 'verduras'
      newIngredientData.quantity = 1
      newIngredientData.unit = ingredient.default_unit || 'unidades'
      newIngredientData.expiryDays = null
      newIngredientData.notes = ''
    }

    const closeIngredientDetailsModal = () => {
      showIngredientDetailsModal.value = false
    }

    const addIngredientToPantry = async () => {
      try {
        if (!selectedIngredient.value.id) {
          showNotification('error', 'Error', 'Ingrediente no seleccionado')
          return
        }

        let expiryDate = null
        if (newIngredientData.expiryDays) {
          expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + parseInt(newIngredientData.expiryDays))
        }

        const { error } = await supabase
          .rpc('add_to_pantry', {
            p_user_id: authStore.user.id,
            p_ingredient_id: selectedIngredient.value.id,
            p_quantity: parseFloat(newIngredientData.quantity),
            p_unit: newIngredientData.unit,
            p_expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
            p_notes: newIngredientData.notes
          })

        if (error) {
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

        await loadPantryItems()
        showNotification('success', 'Éxito', `${selectedIngredient.value.name} agregado a la despensa`)
        closeIngredientDetailsModal()
      } catch (error) {
        console.error('Error agregando ingrediente:', error)
        showNotification('error', 'Error', 'No se pudo agregar el ingrediente')
      }
    }

    const openWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = true
    }

    const closeWeatherRecipeModal = () => {
      showWeatherRecipeModal.value = false
    }

    const decreaseQuantity = async (pantryItem) => {
      try {
        if (!pantryItem.id) {
          showNotification('error', 'Error', 'Ítem no válido')
          return
        }

        const newQuantity = Math.max(0, pantryItem.quantityValue - 1)
        const { error } = await supabase
          .from('user_pantry')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', pantryItem.id)

        if (error) throw error
        await loadPantryItems()
        showNotification('success', 'Éxito', `Cantidad disminuida de: ${pantryItem.name}`)
      } catch (error) {
        console.error('Error disminuyendo cantidad:', error)
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
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', pantryItem.id)

        if (error) throw error
        await loadPantryItems()
        showNotification('success', 'Éxito', `Cantidad aumentada de: ${pantryItem.name}`)
      } catch (error) {
        console.error('Error aumentando cantidad:', error)
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
        await loadPantryItems()
        showNotification('success', 'Éxito', `${pantryItem.name} eliminado de la despensa`)
      } catch (error) {
        console.error('Error eliminando ingrediente:', error)
        showNotification('error', 'Error', 'No se pudo eliminar el ingrediente')
      }
    }

    const goToRecipes = () => {
      router.push('/recetas')
    }

    const handleNotification = async (notification) => {
      try {
        if (notification.id && typeof notification.id === 'string' && notification.id.includes('-')) {
          await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', notification.id)
          await loadNotifications()
        }

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
        console.error('Error manejando notificación:', error)
      }
    }

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
        console.error('Error cerrando sesión:', error)
        showNotification('error', 'Error', 'No se pudo cerrar sesión')
      }
    }

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await Promise.all([
          loadTodayMeals(),
          loadPantryItems(),
          loadRecommendedRecipes(),
          loadWeatherSuggestion(),
          loadNotifications(),
          loadAllIngredients(),
          loadAllMeals()
        ])
      }
    })

    return {
      isMobileMenuOpen,
      notifications,
      pantryItems,
      todayMeals,
      recommendedRecipes,
      weatherSuggestion,
      showRecipeModal,
      showChangeMealModal,
      showGenerateMenuModal,
      showAddIngredientModal,
      showIngredientDetailsModal,
      showWeatherRecipeModal,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      currentRecipe,
      currentMealType,
      currentStep,
      isFavorite,
      selectedMeal,
      ingredientSearch,
      selectedIngredient,
      menuPreferences,
      generatedMenu,
      filteredMeals,
      filteredIngredientList,
      newIngredientData,
      loadingStates,
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
      getMealEmoji,
      toastIcon
    }
  }
}
</script>
