<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full" :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5">
          <div>
            <!-- Header del planificador -->
            <div class="mb-6 flex flex-col gap-5">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:calendar"></span>
                </div>
                <div>
                  <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Planificador Semanal</h1>
                  <p class="text-sm text-[#6C7A6C]">Organiza tus comidas de la semana</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 max-md:flex-col max-md:items-stretch">
                <button class="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5DA271] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(93,162,113,0.9)]" @click="openGenerateWeeklyModal">
                  <span class="iconify" data-icon="mdi:sparkles"></span>
                  Generar semana
                </button>
                <button class="flex cursor-pointer items-center gap-2 rounded-xl bg-[rgba(139,177,116,0.9)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(139,177,116,1)]" @click="generateShoppingList">
                  <span class="iconify" data-icon="mdi:cart"></span>
                  Lista de compras
                </button>
                <div class="ml-auto flex items-center gap-3 max-md:ml-0 max-md:justify-center">
                  <button @click="previousWeek" class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.1)]">
                    <span class="iconify h-5 w-5 text-[#2C2C2C]" data-icon="mdi:chevron-left"></span>
                  </button>
                  <span class="min-w-50 text-center font-medium text-[#2C2C2C]">{{ formatWeekRange() }}</span>
                  <button @click="nextWeek" class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.1)]">
                    <span class="iconify h-5 w-5 text-[#2C2C2C]" data-icon="mdi:chevron-right"></span>
                  </button>
                  <button @click="goToCurrentWeek" class="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2 text-sm text-[#2C2C2C] transition-all hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.1)]">Esta semana</button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading.initial" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <!-- Grid del planificador -->
            <div v-else class="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <div v-for="day in weekDays" :key="day.date" class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                <div class="mb-4 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] pb-3">
                  <div class="flex flex-col">
                    <span class="text-base font-semibold text-[#2C2C2C]">{{ day.name }}</span>
                    <span class="mt-0.5 text-sm text-[#6C7A6C]">{{ formatDate(day.date) }}</span>
                  </div>
                  <button class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(93,162,113,0.1)] text-[#5DA271] transition-all hover:border-[#5DA271] hover:bg-[rgba(93,162,113,0.2)]" @click="generateDayMenu(day.date)" title="Generar menú para este día">
                    <span class="iconify h-4.5 w-4.5" data-icon="mdi:auto-fix"></span>
                  </button>
                </div>

                <div class="flex flex-col gap-3">
                  <div v-for="mealType in mealTypes" :key="`${day.date}-${mealType.key}`" class="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(168,213,186,0.05)] p-3 transition-all hover:bg-[rgba(168,213,186,0.1)]" @click="openRecipeSelection(day.name, mealType.key)">
                    <div class="mb-3 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="iconify h-4 w-4 text-[#5DA271]" :data-icon="mealType.icon"></span>
                        <span class="text-sm font-medium text-[#2C2C2C]">{{ mealType.label }}</span>
                        <span class="ml-2 text-xs text-[#6C7A6C]">{{ mealType.time }}</span>
                      </div>
                      <button class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[rgba(0,0,0,0.08)] bg-white transition-all hover:border-[#5DA271] hover:bg-[#5DA271] hover:text-white" @click.stop="openRecipeSelection(day.name, mealType.key)" title="Agregar comida">
                        <span class="iconify h-4 w-4" data-icon="mdi:plus"></span>
                      </button>
                    </div>

                    <div v-if="getMealForSlot(day.name, mealType.key)" class="group relative cursor-pointer rounded-xl border border-[rgba(93,162,113,0.2)] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#5DA271] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]" @click.stop="openRecipeSelection(day.name, mealType.key)">
                      <button class="absolute right-2 top-2 z-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#d4183d] text-white opacity-0 transition-opacity hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] group-hover:opacity-100" @click.stop="removeMeal(day.name, mealType.key)" title="Eliminar">
                        <span class="iconify h-3 w-3" data-icon="mdi:close"></span>
                      </button>

                      <div class="flex items-center gap-3">
                        <div class="h-12.5 w-12.5 shrink-0 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)]">
                          <img :src="getMealForSlot(day.name, mealType.key)?.image_url || defaultImage" :alt="getMealForSlot(day.name, mealType.key)?.title" class="h-full w-full object-cover" @error="handleImageError">
                        </div>
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-[13px] font-medium text-[#2C2C2C]">{{ getMealForSlot(day.name, mealType.key)?.title || 'Sin asignar' }}</p>
                          <div class="mt-1 text-[11px] text-[#6C7A6C]">
                            <span>⏱️ {{ getMealForSlot(day.name, mealType.key)?.total_time || '--' }} min</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(0,0,0,0.08)] bg-[rgba(168,213,186,0.05)] py-6 text-[#6C7A6C] transition-all hover:border-[#5DA271] hover:bg-[rgba(168,213,186,0.1)] hover:text-[#5DA271]" @click.stop="openRecipeSelection(day.name, mealType.key)">
                      <span class="iconify mb-2 h-6 w-6" data-icon="mdi:plus-circle-outline"></span>
                      <p class="text-xs font-medium">Agregar {{ mealType.label.toLowerCase() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal de selección de recetas -->
            <div v-if="isSelectingRecipe" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeRecipeSelection">
              <div class="flex max-h-[80vh] w-full max-w-200 flex-col overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
                <div class="relative border-b border-[rgba(0,0,0,0.08)] bg-white p-6">
                  <h3 class="mb-1 text-lg font-semibold text-[#2C2C2C]">Seleccionar opción para {{ selectedDay }}</h3>
                  <p class="text-sm text-[#6C7A6C]">Elige una receta para {{ getMealTypeLabel(selectedMeal) }}</p>
                  <button class="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6C7A6C] transition-all hover:bg-[#D8EBD0]" @click="closeRecipeSelection">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <!-- Lista de recetas -->
                <div class="flex-1 overflow-y-auto p-6">
                  <div class="mb-4">
                    <div class="relative">
                      <span class="iconify absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6C7A6C]" data-icon="mdi:magnify"></span>
                      <input 
                        type="text" 
                        v-model="recipeSearchQuery"
                        placeholder="Buscar recetas..."
                        class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-3 pl-12 pr-5 text-sm text-[#2C2C2C] focus:border-[#5DA271] focus:outline-none"
                      >
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div v-for="recipe in filteredRecipesForModal" :key="recipe.id" class="cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all hover:-translate-y-0.5 hover:border-[#5DA271] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]" @click="selectRecipe(recipe)">
                      <div class="relative h-30 overflow-hidden">
                        <img :src="recipe.image_url || defaultImage" :alt="recipe.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute left-2 top-2 rounded bg-[#5DA271] px-2 py-0.5 text-[10px] font-medium text-white">{{ getCategoryLabel(recipe.category) }}</div>
                      </div>
                      <div class="p-3">
                        <h4 class="mb-2 text-sm font-medium text-[#2C2C2C]">{{ recipe.title }}</h4>
                        <div class="flex gap-3 text-[11px] text-[#6C7A6C]">
                          <span>⏱️ {{ recipe.total_time }} min</span>
                          <span>👥 {{ recipe.servings }} porciones</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="filteredRecipesForModal.length === 0" class="py-12 text-center text-[#6C7A6C]">
                    No se encontraron recetas
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal de generación de menú semanal -->
            <div v-if="showGenerateWeeklyModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-4" @click="closeGenerateWeeklyModal">
              <div class="relative max-h-[90vh] w-full max-w-225 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl" @click.stop>
                <button class="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F6F9F6] transition-all hover:border-[#d4183d] hover:bg-[rgba(212,24,61,0.1)]" @click="closeGenerateWeeklyModal">
                  <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                </button>

                <h2 class="mb-4 text-2xl font-semibold text-[#2C2C2C]">Generar Menú Semanal</h2>

                <div class="mb-8">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">Preferencias de generación</h3>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] p-3 transition-all hover:bg-[rgba(168,213,186,0.1)]">
                      <input type="checkbox" v-model="generationPreferences.quick" class="hidden">
                      <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': generationPreferences.quick }">
                        <span v-if="generationPreferences.quick" class="text-white text-xs">✓</span>
                      </span>
                      <span class="font-medium">Comidas rápidas (menos de 30 min)</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] p-3 transition-all hover:bg-[rgba(168,213,186,0.1)]">
                      <input type="checkbox" v-model="generationPreferences.healthy" class="hidden">
                      <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': generationPreferences.healthy }">
                        <span v-if="generationPreferences.healthy" class="text-white text-xs">✓</span>
                      </span>
                      <span class="font-medium">Saludable (bajas calorías)</span>
                    </label>
                  </div>
                </div>

                <div class="mb-8">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">Vista previa del menú</h3>
                  <div v-if="generatedWeeklyMenu.length === 0" class="flex flex-col items-center justify-center rounded-xl bg-[rgba(168,213,186,0.1)] p-12 text-center text-[#6C7A6C]">
                    <p>Selecciona preferencias y genera el menú</p>
                  </div>
                  <div v-else class="grid max-h-75 grid-cols-1 gap-4 overflow-y-auto rounded-xl bg-[rgba(168,213,186,0.1)] p-4">
                    <div v-for="meal in generatedWeeklyMenu" :key="`${meal.day}-${meal.mealType}`" class="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                      <div class="flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-[rgba(93,162,113,0.1)] px-4 py-3">
                        <h4 class="text-sm font-semibold text-[#5DA271]">{{ meal.day }}</h4>
                        <span class="rounded-full bg-[#5DA271] px-2 py-0.5 text-xs font-medium text-white">{{ getMealTypeLabel(meal.mealType) }}</span>
                      </div>
                      <div class="flex items-center gap-3 p-4">
                        <img :src="meal.recipe?.image_url || defaultImage" :alt="meal.recipe?.title" class="h-15 w-15 rounded-lg object-cover" @error="handleImageError">
                        <div class="flex-1">
                          <h5 class="mb-1 text-sm font-medium">{{ meal.recipe?.title || 'Sin asignar' }}</h5>
                          <div class="flex gap-3 text-xs text-[#6C7A6C]">
                            <span>⏱️ {{ meal.recipe?.total_time || '--' }} min</span>
                            <span>👥 {{ meal.recipe?.servings || '--' }} porciones</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 max-sm:flex-col">
                  <button class="flex-1 cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-6 py-3 font-medium text-[#2C2C2C] transition-all hover:bg-[rgba(168,213,186,0.1)]" @click="closeGenerateWeeklyModal">Cancelar</button>
                  <button class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3 font-medium text-white transition-all hover:bg-[#7c3aed]" @click="generateWeekPreview">
                    <span class="iconify" data-icon="mdi:sparkles"></span>
                    Generar Vista Previa
                  </button>
                  <button class="flex-1 cursor-pointer rounded-xl bg-[#5DA271] px-6 py-3 font-medium text-white transition-all hover:bg-[rgba(93,162,113,0.9)] disabled:opacity-50 disabled:cursor-not-allowed" :disabled="generatedWeeklyMenu.length === 0" @click="applyGeneratedWeeklyMenu">
                    Aplicar Menú Semanal
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal de lista de compras -->
            <div v-if="showShoppingListModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-4" @click="closeShoppingListModal">
              <div class="relative max-h-[90vh] w-full max-w-200 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl" @click.stop>
                <button class="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F6F9F6] transition-all hover:border-[#d4183d] hover:bg-[rgba(212,24,61,0.1)]" @click="closeShoppingListModal">
                  <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                </button>

                <h2 class="mb-2 text-2xl font-semibold text-[#2C2C2C]">Lista de Compras Semanal</h2>
                <p class="mb-6 text-sm text-[#6C7A6C]">Ingredientes necesarios para la semana</p>

                <div class="mb-8">
                  <div class="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-[rgba(168,213,186,0.1)] p-4">
                    <div class="text-center">
                      <span class="block text-xs text-[#6C7A6C]">Total ingredientes</span>
                      <span class="block text-2xl font-semibold text-[#2C2C2C]">{{ shoppingList.length }}</span>
                    </div>
                    <div class="text-center">
                      <span class="block text-xs text-[#6C7A6C]">Recetas incluidas</span>
                      <span class="block text-2xl font-semibold text-[#2C2C2C]">{{ shoppingListStats.recipes }}</span>
                    </div>
                  </div>

                  <div class="max-h-100 overflow-y-auto rounded-xl bg-[rgba(168,213,186,0.1)] p-4">
                    <div v-if="shoppingList.length === 0" class="flex flex-col items-center justify-center py-12 text-center text-[#6C7A6C]">
                      <p>No hay ingredientes en la lista de compras</p>
                    </div>
                    <div v-else v-for="category in groupedShoppingList" :key="category.name" class="mb-6 last:mb-0">
                      <h4 class="mb-3 border-b border-[rgba(0,0,0,0.08)] pb-2 text-base font-semibold text-[#2C2C2C]">{{ category.name }}</h4>
                      <div class="flex flex-col gap-2">
                        <div v-for="item in category.items" :key="item.id" class="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3">
                          <label class="flex flex-1 cursor-pointer items-center gap-3">
                            <input type="checkbox" v-model="item.purchased" class="hidden">
                            <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': item.purchased }">
                              <span v-if="item.purchased" class="text-white text-xs">✓</span>
                            </span>
                            <span class="font-medium text-[#2C2C2C]" :class="{ 'line-through text-[#6C7A6C]': item.purchased }">{{ item.name }}</span>
                          </label>
                          <div class="flex items-center gap-2">
                            <span class="font-semibold text-[#5DA271]">{{ item.quantity }}</span>
                            <span class="text-sm text-[#6C7A6C]">{{ item.unit }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 max-sm:flex-col">
                  <button class="flex-1 cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-6 py-3 font-medium text-[#2C2C2C] transition-all hover:bg-[rgba(168,213,186,0.1)]" @click="closeShoppingListModal">Cerrar</button>
                  <button class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[rgba(139,177,116,0.9)] px-6 py-3 font-medium text-white transition-all hover:bg-[rgba(139,177,116,1)]" @click="exportShoppingList">
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

    <!-- Toast Notification -->
    <div v-if="showToast" 
      class="fixed top-5 right-5 z-9999 max-w-100 min-w-75 animate-slide-in-right text-white"
      :style="{ background: toastType === 'success' ? 'linear-gradient(135deg, #5DA271 0%, #8BB174 100%)' : toastType === 'error' ? 'linear-gradient(135deg, #d4183d 0%, #b31534 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }">
      <div class="flex items-start gap-3 p-4">
        <span class="iconify w-6 h-6 shrink-0" :data-icon="toastIcon"></span>
        <div>
          <p class="font-semibold text-sm mb-1">{{ toastTitle }}</p>
          <p class="text-xs opacity-90 leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false" class="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center shrink-0 ml-auto">
          <span class="iconify w-4 h-4 text-white" data-icon="mdi:close"></span>
        </button>
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
import { supabase } from '../supabase'

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
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120'
    
    // Tipos de comidas
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless', dbType: 'desayuno' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food', dbType: 'almuerzo' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent', dbType: 'cena' }
    ]

    // Estados
    const loading = reactive({ initial: true, recipes: false, shoppingList: false })
    const weekMeals = ref([])
    const allRecipes = ref([])
    const weekDays = ref([])
    const currentWeekStart = ref(null)
    
    // Modal de selección
    const isSelectingRecipe = ref(false)
    const selectedDay = ref('')
    const selectedMeal = ref('')
    const recipeSearchQuery = ref('')
    
    // Modal de generación
    const showGenerateWeeklyModal = ref(false)
    const generatedWeeklyMenu = ref([])
    const generationPreferences = reactive({ quick: false, healthy: false })
    
    // Modal de lista de compras
    const showShoppingListModal = ref(false)
    const shoppingList = ref([])
    
    // Toast
    const showToast = ref(false)
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

    const getMealTypeLabel = (mealKey) => {
      const meal = mealTypes.find(m => m.key === mealKey)
      return meal ? meal.label : mealKey
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    const getWeekStart = (date = new Date()) => {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(date.setDate(diff))
      weekStart.setHours(0, 0, 0, 0)
      return weekStart
    }

    const generateWeekDays = (weekStart) => {
      const daysArray = []
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        daysArray.push({ name: dayNames[i], date: date.toISOString().split('T')[0], dayOfWeek: i })
      }
      return daysArray
    }

    const formatWeekRange = () => {
      if (weekDays.value.length === 0) return 'Cargando...'
      const firstDay = weekDays.value[0]
      const lastDay = weekDays.value[6]
      return `Semana del ${formatDate(firstDay.date)} al ${formatDate(lastDay.date)}`
    }

    const getMealForSlot = (day, mealKey) => {
      return weekMeals.value.find(m => m.day === day && m.mealType === mealKey)
    }

    const getCurrentPlannerId = async () => {
      const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('weekly_planner')
        .select('id')
        .eq('user_id', authStore.user?.id)
        .eq('week_start', weekStartStr)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error obteniendo planificador:', error)
        return null
      }
      return data?.id || null
    }

    const loadWeekData = async () => {
      try {
        loading.initial = true
        
        const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
        const weekEnd = new Date(currentWeekStart.value)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        // Buscar o crear planificador
        let { data: planner, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id')
          .eq('user_id', authStore.user?.id)
          .eq('week_start', weekStartStr)
          .single()
        
        if (plannerError && plannerError.code === 'PGRST116') {
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
        
        // Cargar comidas planificadas
        const { data: plannedMeals, error: mealsError } = await supabase
          .from('planned_meals')
          .select(`
            id,
            day_of_week,
            meal_type,
            recipe:recipes (
              id,
              title,
              total_time,
              servings,
              image_url,
              category
            )
          `)
          .eq('planner_id', planner.id)
        
        if (mealsError) throw mealsError
        
        // Transformar datos
        weekMeals.value = (plannedMeals || []).map(meal => ({
          id: meal.id,
          day: weekDays.value.find(d => d.dayOfWeek === meal.day_of_week)?.name || '',
          dayOfWeek: meal.day_of_week,
          mealType: mealTypes.find(m => m.dbType === meal.meal_type)?.key || '',
          mealDbType: meal.meal_type,
          title: meal.recipe?.title,
          total_time: meal.recipe?.total_time,
          servings: meal.recipe?.servings,
          image_url: meal.recipe?.image_url,
          recipe_id: meal.recipe?.id,
          category: meal.recipe?.category
        }))
        
      } catch (error) {
        console.error('Error cargando datos:', error)
        showNotification('error', 'Error', 'No se pudo cargar el planificador')
      } finally {
        loading.initial = false
      }
    }

    const loadAllRecipes = async () => {
      try {
        loading.recipes = true
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, total_time, servings, image_url, category, tags')
          .eq('is_public', true)
          .order('title')
        
        if (error) throw error
        allRecipes.value = data || []
      } catch (error) {
        console.error('Error cargando recetas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las recetas')
      } finally {
        loading.recipes = false
      }
    }

    const selectRecipe = async (recipe) => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }
        
        const dayData = weekDays.value.find(d => d.name === selectedDay.value)
        const mealTypeData = mealTypes.find(m => m.key === selectedMeal.value)
        
        if (!dayData || !mealTypeData) {
          showNotification('error', 'Error', 'Datos inválidos')
          return
        }
        
        // Eliminar si existe
        await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', plannerId)
          .eq('day_of_week', dayData.dayOfWeek)
          .eq('meal_type', mealTypeData.dbType)
        
        // Insertar nueva
        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert({
            planner_id: plannerId,
            day_of_week: dayData.dayOfWeek,
            meal_type: mealTypeData.dbType,
            recipe_id: recipe.id
          })
        
        if (insertError) throw insertError
        
        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === selectedDay.value && m.mealType === selectedMeal.value)
        )
        weekMeals.value.push({
          id: Date.now(),
          day: selectedDay.value,
          dayOfWeek: dayData.dayOfWeek,
          mealType: selectedMeal.value,
          mealDbType: mealTypeData.dbType,
          title: recipe.title,
          total_time: recipe.total_time,
          servings: recipe.servings,
          image_url: recipe.image_url,
          recipe_id: recipe.id,
          category: recipe.category
        })
        
        showNotification('success', 'Éxito', `${recipe.title} agregado al planificador`)
        closeRecipeSelection()
        
      } catch (error) {
        console.error('Error seleccionando receta:', error)
        showNotification('error', 'Error', 'No se pudo agregar la receta')
      }
    }

    const removeMeal = async (day, mealKey) => {
      try {
        const meal = weekMeals.value.find(m => m.day === day && m.mealType === mealKey)
        if (!meal) return
        
        const plannerId = await getCurrentPlannerId()
        if (plannerId && meal.dayOfWeek !== undefined && meal.mealDbType) {
          await supabase
            .from('planned_meals')
            .delete()
            .eq('planner_id', plannerId)
            .eq('day_of_week', meal.dayOfWeek)
            .eq('meal_type', meal.mealDbType)
        }
        
        weekMeals.value = weekMeals.value.filter(m => !(m.day === day && m.mealType === mealKey))
        showNotification('success', 'Eliminado', 'Comida eliminada del planificador')
        
      } catch (error) {
        console.error('Error eliminando comida:', error)
        showNotification('error', 'Error', 'No se pudo eliminar la comida')
      }
    }

    const generateDayMenu = async (date) => {
      try {
        const dayName = weekDays.value.find(d => d.date === date)?.name
        if (!dayName) return
        
        const dayData = weekDays.value.find(d => d.name === dayName)
        const plannerId = await getCurrentPlannerId()
        
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }
        
        // Eliminar comidas existentes para este día
        for (const mealType of mealTypes) {
          await supabase
            .from('planned_meals')
            .delete()
            .eq('planner_id', plannerId)
            .eq('day_of_week', dayData.dayOfWeek)
            .eq('meal_type', mealType.dbType)
        }
        
        // Generar nuevas comidas
        const newMeals = []
        for (const mealType of mealTypes) {
          const suitableRecipes = allRecipes.value.filter(r => r.category === mealType.dbType)
          if (suitableRecipes.length > 0) {
            const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
            const { error } = await supabase
              .from('planned_meals')
              .insert({
                planner_id: plannerId,
                day_of_week: dayData.dayOfWeek,
                meal_type: mealType.dbType,
                recipe_id: randomRecipe.id
              })
            
            if (!error) {
              newMeals.push({
                id: Date.now() + Math.random(),
                day: dayName,
                dayOfWeek: dayData.dayOfWeek,
                mealType: mealType.key,
                mealDbType: mealType.dbType,
                title: randomRecipe.title,
                total_time: randomRecipe.total_time,
                servings: randomRecipe.servings,
                image_url: randomRecipe.image_url,
                recipe_id: randomRecipe.id,
                category: randomRecipe.category
              })
            }
          }
        }
        
        weekMeals.value = weekMeals.value.filter(m => m.day !== dayName)
        weekMeals.value.push(...newMeals)
        showNotification('success', 'Éxito', `Menú generado para ${dayName}`)
        
      } catch (error) {
        console.error('Error generando menú diario:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    const generateWeekPreview = async () => {
      try {
        let filteredRecipes = [...allRecipes.value]
        if (generationPreferences.quick) {
          filteredRecipes = filteredRecipes.filter(r => r.total_time <= 30)
        }
        
        const preview = []
        for (const day of weekDays.value) {
          for (const mealType of mealTypes) {
            const existing = weekMeals.value.find(m => m.day === day.name && m.mealType === mealType.key)
            if (existing) {
              preview.push({ day: day.name, mealType: mealType.key, recipe: existing })
            } else {
              const suitableRecipes = filteredRecipes.filter(r => r.category === mealType.dbType)
              if (suitableRecipes.length > 0) {
                const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
                preview.push({ day: day.name, mealType: mealType.key, recipe: randomRecipe })
              }
            }
          }
        }
        generatedWeeklyMenu.value = preview
        showNotification('success', 'Éxito', 'Vista previa generada')
      } catch (error) {
        console.error('Error generando vista previa:', error)
        showNotification('error', 'Error', 'No se pudo generar la vista previa')
      }
    }

    const applyGeneratedWeeklyMenu = async () => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }
        
        // Eliminar todas las comidas
        await supabase.from('planned_meals').delete().eq('planner_id', plannerId)
        
        // Insertar nuevas
        const mealsToInsert = generatedWeeklyMenu.value
          .filter(meal => meal.recipe)
          .map(meal => {
            const dayData = weekDays.value.find(d => d.name === meal.day)
            const mealTypeData = mealTypes.find(m => m.key === meal.mealType)
            return {
              planner_id: plannerId,
              day_of_week: dayData?.dayOfWeek,
              meal_type: mealTypeData?.dbType,
              recipe_id: meal.recipe.id
            }
          })
          .filter(meal => meal.day_of_week !== undefined && meal.meal_type)
        
        if (mealsToInsert.length > 0) {
          const { error } = await supabase.from('planned_meals').insert(mealsToInsert)
          if (error) throw error
        }
        
        await loadWeekData()
        showNotification('success', 'Éxito', 'Menú semanal aplicado')
        closeGenerateWeeklyModal()
        
      } catch (error) {
        console.error('Error aplicando menú:', error)
        showNotification('error', 'Error', 'No se pudo aplicar el menú')
      }
    }

    const generateShoppingList = async () => {
      try {
        loading.shoppingList = true
        const recipeIds = weekMeals.value.filter(m => m.recipe_id).map(m => m.recipe_id)
        
        if (recipeIds.length === 0) {
          showNotification('info', 'Información', 'No hay recetas planificadas')
          shoppingList.value = []
          showShoppingListModal.value = true
          return
        }
        
        const { data, error } = await supabase
          .from('recipe_ingredients')
          .select(`
            quantity,
            unit,
            ingredient:ingredients (id, name, category)
          `)
          .in('recipe_id', recipeIds)
        
        if (error) throw error
        
        const consolidated = {}
        data.forEach(item => {
          const ingredient = item.ingredient
          if (!ingredient) return
          const key = `${ingredient.id}-${item.unit}`
          if (!consolidated[key]) {
            consolidated[key] = {
              id: ingredient.id,
              name: ingredient.name,
              category: ingredient.category || 'otros',
              quantity: 0,
              unit: item.unit,
              purchased: false
            }
          }
          consolidated[key].quantity += parseFloat(item.quantity)
        })
        
        shoppingList.value = Object.values(consolidated).map(item => ({
          ...item,
          quantity: Math.ceil(item.quantity * 100) / 100,
          purchased: false
        }))
        
        showShoppingListModal.value = true
        
      } catch (error) {
        console.error('Error generando lista:', error)
        showNotification('error', 'Error', 'No se pudo generar la lista')
      } finally {
        loading.shoppingList = false
      }
    }

    const groupedShoppingList = computed(() => {
      const groups = {}
      shoppingList.value.forEach(item => {
        const category = item.category || 'otros'
        const categoryNames = { 'verduras': 'Verduras', 'frutas': 'Frutas', 'proteínas': 'Proteínas', 'granos': 'Granos', 'lácteos': 'Lácteos', 'condimentos': 'Condimentos', 'bebidas': 'Bebidas', 'otros': 'Otros' }
        const name = categoryNames[category] || category
        if (!groups[name]) groups[name] = { name, items: [] }
        groups[name].items.push(item)
      })
      return Object.values(groups)
    })

    const shoppingListStats = computed(() => ({
      recipes: new Set(weekMeals.value.filter(m => m.recipe_id).map(m => m.recipe_id)).size,
      total: shoppingList.value.length
    }))

    const exportShoppingList = () => {
      let text = `LISTA DE COMPRAS - ${formatWeekRange()}\n\n`
      groupedShoppingList.value.forEach(cat => {
        text += `=== ${cat.name.toUpperCase()} ===\n`
        cat.items.forEach(item => {
          text += `[ ] ${item.name} - ${item.quantity} ${item.unit}\n`
        })
        text += '\n'
      })
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
      showNotification('success', 'Éxito', 'Lista exportada')
    }

    const filteredRecipesForModal = computed(() => {
      let filtered = [...allRecipes.value]
      if (recipeSearchQuery.value.trim()) {
        const query = recipeSearchQuery.value.toLowerCase()
        filtered = filtered.filter(r => r.title.toLowerCase().includes(query))
      }
      return filtered
    })

    const openRecipeSelection = (day, mealKey) => {
      selectedDay.value = day
      selectedMeal.value = mealKey
      recipeSearchQuery.value = ''
      isSelectingRecipe.value = true
    }

    const closeRecipeSelection = () => {
      isSelectingRecipe.value = false
      selectedDay.value = ''
      selectedMeal.value = ''
    }

    const openGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = true
      generatedWeeklyMenu.value = []
    }

    const closeGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = false
    }

    const closeShoppingListModal = () => {
      showShoppingListModal.value = false
    }

    const previousWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() - 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    const nextWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() + 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    const goToCurrentWeek = () => {
      currentWeekStart.value = getWeekStart(new Date())
      weekDays.value = generateWeekDays(currentWeekStart.value)
      loadWeekData()
    }

    const handleImageError = (event) => {
      event.target.src = defaultImage
    }

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

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        currentWeekStart.value = getWeekStart(new Date())
        weekDays.value = generateWeekDays(currentWeekStart.value)
        await Promise.all([loadAllRecipes(), loadWeekData()])
      }
    })

    return {
      isMobileMenuOpen,
      mealTypes,
      weekDays,
      weekMeals,
      loading,
      defaultImage,
      isSelectingRecipe,
      selectedDay,
      selectedMeal,
      recipeSearchQuery,
      filteredRecipesForModal,
      showGenerateWeeklyModal,
      generatedWeeklyMenu,
      generationPreferences,
      showShoppingListModal,
      shoppingList,
      groupedShoppingList,
      shoppingListStats,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      formatDate,
      formatWeekRange,
      getMealTypeLabel,
      getCategoryLabel,
      getMealForSlot,
      openRecipeSelection,
      closeRecipeSelection,
      selectRecipe,
      removeMeal,
      generateDayMenu,
      openGenerateWeeklyModal,
      closeGenerateWeeklyModal,
      generateWeekPreview,
      applyGeneratedWeeklyMenu,
      generateShoppingList,
      closeShoppingListModal,
      exportShoppingList,
      previousWeek,
      nextWeek,
      goToCurrentWeek,
      handleImageError,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s ease;
}
</style>