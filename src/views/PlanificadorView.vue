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
          <!-- Contenido del planificador -->
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
                <button class="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5DA271] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(93,162,113,0.9)]" @click="generateWeeklyMenu">
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

            <!-- Grid del planificador responsive -->
            <div class="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <div v-for="(day, index) in weekDays" :key="day.date" class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
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
                        <div v-if="getMealForSlot(day.name, mealType.key)?.isOutside" class="flex w-full flex-col items-center justify-center gap-2 py-4">
                          <span class="iconify h-6 w-6 text-[#8BB174]" data-icon="mdi:map-marker"></span>
                          <p class="text-center text-xs font-medium text-[#8BB174]">Salida / Fuera de casa</p>
                        </div>
                        <div v-else-if="getMealForSlot(day.name, mealType.key)?.recipe" class="flex w-full items-center gap-3">
                          <div class="h-12.5 w-12.5 shrink-0 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)]">
                            <img :src="getMealForSlot(day.name, mealType.key)?.recipe?.image" :alt="getMealForSlot(day.name, mealType.key)?.recipe?.name" class="h-full w-full object-cover" @error="handleImageError">
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="truncate text-[13px] font-medium text-[#2C2C2C]">{{ getMealForSlot(day.name, mealType.key)?.recipe?.name || 'Comida rápida' }}</p>
                            <div v-if="getMealForSlot(day.name, mealType.key)?.recipe" class="mt-1 text-[11px] text-[#6C7A6C]">
                              <span>⏱️ {{ getMealForSlot(day.name, mealType.key)?.recipe?.time || '--' }}</span>
                            </div>
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
                  <p class="text-sm text-[#6C7A6C]">Elige una receta o marca como salida</p>
                  <button class="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6C7A6C] transition-all hover:bg-[#D8EBD0]" @click="closeRecipeSelection">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <!-- Opción de salida -->
                <button class="mx-6 mb-4 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#8BB174] bg-[rgba(139,177,116,0.2)] p-4 transition-all hover:-translate-y-px hover:bg-[rgba(139,177,116,0.3)]" @click="setOutsideMeal">
                  <span class="iconify h-6 w-6 text-[#8BB174]" data-icon="mdi:map-marker"></span>
                  <div class="text-left">
                    <p class="mb-0.5 text-sm font-medium text-[#8BB174]">Marcar como salida</p>
                    <p class="text-xs text-[#6C7A6C]">No comeré en casa</p>
                  </div>
                </button>

                <!-- Lista de recetas -->
                <div class="flex-1 overflow-y-auto px-6 pb-6">
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div v-for="recipe in allRecipes" :key="recipe.id" class="cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all hover:-translate-y-0.5 hover:border-[#5DA271] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]" @click="selectRecipe(recipe)">
                      <div class="relative h-30 overflow-hidden">
                        <img :src="recipe.image" :alt="recipe.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute left-2 top-2 rounded bg-[#5DA271] px-2 py-0.5 text-[10px] font-medium text-white">{{ recipe.type }}</div>
                      </div>
                      <div class="p-3">
                        <h4 class="mb-2 text-sm font-medium text-[#2C2C2C]">{{ recipe.name }}</h4>
                        <div class="flex gap-3 text-[11px] text-[#6C7A6C]">
                          <span>⏱️ {{ recipe.time }}</span>
                          <span>👥 {{ recipe.servings }} porciones</span>
                        </div>
                      </div>
                    </div>
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
                    <div class="flex items-center">
                      <label class="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] p-3 transition-all hover:bg-[rgba(168,213,186,0.1)]">
                        <input type="checkbox" v-model="generationPreferences.variety" class="hidden">
                        <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': generationPreferences.variety }"></span>
                        <span class="ml-2 font-medium">Maximizar variedad</span>
                      </label>
                    </div>
                    <div class="flex items-center">
                      <label class="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] p-3 transition-all hover:bg-[rgba(168,213,186,0.1)]">
                        <input type="checkbox" v-model="generationPreferences.quick" class="hidden">
                        <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': generationPreferences.quick }"></span>
                        <span class="ml-2 font-medium">Incluir comidas rápidas</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">Días a planificar</h3>
                  <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div v-for="day in weekDays" :key="day.date" class="flex items-center">
                      <label class="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.08)] p-2 transition-all hover:bg-[rgba(168,213,186,0.1)]">
                        <input type="checkbox" v-model="generationPreferences.selectedDays[day.name.toLowerCase()]" class="hidden">
                        <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': generationPreferences.selectedDays[day.name.toLowerCase()] }"></span>
                        <span class="font-medium">{{ day.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">Vista previa del menú</h3>
                  <div v-if="generatedWeeklyMenu.length === 0" class="flex flex-col items-center justify-center rounded-xl bg-[rgba(168,213,186,0.1)] p-12 text-center text-[#6C7A6C]">
                    <p>Selecciona preferencias y genera el menú</p>
                  </div>
                  <div v-else class="grid max-h-75 grid-cols-1 gap-4 overflow-y-auto rounded-xl bg-[rgba(168,213,186,0.1)] p-4 sm:grid-cols-2">
                    <div v-for="meal in generatedWeeklyMenu" :key="`${meal.day}-${meal.meal}`" class="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
                      <div class="flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-[rgba(93,162,113,0.1)] px-4 py-3">
                        <h4 class="text-sm font-semibold text-[#5DA271]">{{ meal.day }}</h4>
                        <span class="rounded-full bg-[#5DA271] px-2 py-0.5 text-xs font-medium text-white">{{ getMealTypeLabel(meal.meal) }}</span>
                      </div>
                      <div class="flex items-center gap-3 p-4">
                        <img :src="meal.recipe?.image || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=200'" :alt="meal.recipe?.name || 'Comida rápida'" class="h-15 w-15 rounded-lg object-cover" @error="handleImageError">
                        <div class="flex-1">
                          <h5 class="mb-1 text-sm font-medium">{{ meal.recipe?.name || 'Sin asignar' }}</h5>
                          <div v-if="meal.recipe" class="flex gap-3 text-xs text-[#6C7A6C]">
                            <span>⏱️ {{ meal.recipe.time }}</span>
                            <span>👥 {{ meal.recipe.servings }} porciones</span>
                          </div>
                          <div v-if="meal.isOutside" class="mt-1 inline-flex items-center gap-1 rounded bg-[rgba(139,177,116,0.2)] px-1.5 py-0.5 text-[10px] text-[#8BB174]">
                            <span class="iconify h-2 w-2" data-icon="mdi:map-marker"></span>
                            Fuera
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
                            <span class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.08)] transition-all" :class="{ 'border-[#5DA271] bg-[#5DA271]': item.purchased }"></span>
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
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '@/supabase'

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
    
    // Tipos de comidas con correspondencia a base de datos
    const mealTypes = [
      { key: 'breakfast', label: 'Desayuno', time: '8:00 AM', icon: 'mdi:sun-wireless', dbType: 'desayuno' },
      { key: 'lunch', label: 'Almuerzo', time: '1:00 PM', icon: 'mdi:food', dbType: 'almuerzo' },
      { key: 'snack', label: 'Merienda', time: '4:00 PM', icon: 'mdi:coffee', dbType: 'merienda' },
      { key: 'dinner', label: 'Cena', time: '7:00 PM', icon: 'mdi:moon-waning-crescent', dbType: 'cena' }
    ]

    // Estados del componente
    const weekMeals = ref([])
    const isSelectingRecipe = ref(false)
    const selectedDay = ref('')
    const selectedMeal = ref('')
    const showGenerateWeeklyModal = ref(false)
    const showShoppingListModal = ref(false)
    const generatedWeeklyMenu = ref([])
    const shoppingList = ref([])
    const allRecipes = ref([])
    const loading = reactive({
      initial: true,
      recipes: false,
      shoppingList: false
    })

    // Navegación semanal
    const currentWeekStart = ref(null)
    const weekDays = ref([])

    // Preferencias de generación
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

    // Sistema de notificaciones
    const showToast = ref(false)
    const toastConfig = reactive({
      type: 'info',
      title: '',
      message: '',
      icon: 'mdi:information'
    })

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    // Obtener lunes de una semana
    const getWeekStart = (date = new Date()) => {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(date.setDate(diff))
      weekStart.setHours(0, 0, 0, 0)
      return weekStart
    }

    // Obtener domingo de una semana
    const getWeekEnd = (weekStart) => {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      return weekEnd
    }

    // Formatear fecha en español
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    // Formatear rango semanal
    const formatWeekRange = () => {
      if (weekDays.value.length === 0) return 'Cargando...'
      
      const firstDay = weekDays.value[0]
      const lastDay = weekDays.value[6]
      
      const firstFormatted = formatDate(firstDay.date)
      const lastFormatted = formatDate(lastDay.date)
      
      return `Semana del ${firstFormatted} al ${lastFormatted}`
    }

    // Obtener etiqueta del tipo de comida
    const getMealTypeLabel = (mealKey) => {
      const meal = mealTypes.find(m => m.key === mealKey)
      return meal ? meal.label : mealKey
    }

    // Mostrar notificación
    const showNotification = (type, title, message, icon = null) => {
      toastConfig.type = type
      toastConfig.title = title
      toastConfig.message = message
      
      if (icon) {
        toastConfig.icon = icon
      } else {
        switch (type) {
          case 'success':
            toastConfig.icon = 'mdi:check-circle'
            break
          case 'error':
            toastConfig.icon = 'mdi:alert-circle'
            break
          case 'warning':
            toastConfig.icon = 'mdi:alert'
            break
          default:
            toastConfig.icon = 'mdi:information'
        }
      }
      
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }

    // Manejador de errores de imágenes
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik0xMDAgN0g1MFY1MEgxMDBWN0oiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTM1MCAxNTBIMzAwVjEwMEgzNTBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8cGF0aCBkPSJNMTUwIDEwMEgxMDBWNTBIMTUwVjEwMFoiIGZpbGw9IiNlMWU4ZTAiLz4KPHBhdGggZD0iTTIwMCAxNTBIMTUwVjEwMEgyMDBWMTUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

    // ============================================
    // GESTIÓN DE SEMANAS
    // ============================================

    // Generar array de días de la semana
    const generateWeekDays = (weekStart) => {
      const daysArray = []
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        
        daysArray.push({
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          dayOfWeek: i // 0=lunes, 6=domingo
        })
      }
      
      return daysArray
    }

    // Navegar a semana anterior
    const previousWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() - 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    // Navegar a semana siguiente
    const nextWeek = () => {
      const newWeekStart = new Date(currentWeekStart.value)
      newWeekStart.setDate(newWeekStart.getDate() + 7)
      currentWeekStart.value = newWeekStart
      weekDays.value = generateWeekDays(newWeekStart)
      loadWeekData()
    }

    // Ir a semana actual
    const goToCurrentWeek = () => {
      const today = new Date()
      currentWeekStart.value = getWeekStart(today)
      weekDays.value = generateWeekDays(currentWeekStart.value)
      loadWeekData()
    }

    // ============================================
    // CARGA DE DATOS
    // ============================================

    // Cargar datos de la semana actual
    const loadWeekData = async () => {
      try {
        loading.initial = true
        
        if (!authStore.user?.id) {
          showNotification('error', 'Error', 'Usuario no autenticado')
          return
        }

        const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
        
        // 1. Buscar o crear planificador semanal
        const { data: plannerData, error: plannerError } = await supabase
          .from('weekly_planner')
          .select('id, week_start, preferences')
          .eq('user_id', authStore.user.id)
          .eq('week_start', weekStartStr)
          .single()

        let plannerId = null
        
        if (plannerError || !plannerData) {
          // Crear nuevo planificador
          const weekEnd = getWeekEnd(new Date(currentWeekStart.value))
          
          const { data: newPlanner, error: createError } = await supabase
            .from('weekly_planner')
            .insert({
              user_id: authStore.user.id,
              week_start: weekStartStr,
              week_end: weekEnd.toISOString().split('T')[0],
              preferences: { dietary: [], variety: true }
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creando planificador:', createError)
            showNotification('error', 'Error', 'No se pudo crear el planificador semanal')
            return
          }
          
          plannerId = newPlanner.id
        } else {
          plannerId = plannerData.id
        }

        // 2. Cargar comidas planificadas
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
              image_url
            )
          `)
          .eq('planner_id', plannerId)

        if (mealsError) {
          console.error('Error cargando comidas:', mealsError)
          showNotification('error', 'Error', 'No se pudieron cargar las comidas planificadas')
        } else {
          // Transformar datos para la vista
          weekMeals.value = plannedMeals.map(meal => {
            const dayName = weekDays.value.find(d => d.dayOfWeek === meal.day_of_week)?.name || ''
            const mealType = mealTypes.find(m => m.dbType === meal.meal_type)?.key || ''
            
            return {
              id: meal.id,
              day: dayName,
              dayOfWeek: meal.day_of_week,
              meal: mealType,
              mealDbType: meal.meal_type,
              recipe: meal.recipe ? {
                id: meal.recipe.id,
                name: meal.recipe.title,
                time: `${meal.recipe.total_time} min`,
                servings: meal.recipe.servings,
                image: meal.recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120'
              } : null,
              isOutside: !meal.recipe
            }
          })
        }

        // 3. Cargar recetas para el modal
        await loadAllRecipes()

      } catch (error) {
        console.error('Error cargando datos:', error)
        showNotification('error', 'Error', 'Error al cargar los datos del planificador')
      } finally {
        loading.initial = false
      }
    }

    // Cargar todas las recetas
    const loadAllRecipes = async () => {
      try {
        loading.recipes = true
        
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, total_time, servings, image_url, tags')
          .eq('is_public', true)
          .order('title')

        if (error) throw error

        allRecipes.value = data.map(recipe => {
          // Determinar tipo basado en tags
          let type = 'General'
          if (recipe.tags?.includes('desayuno')) type = 'Desayuno'
          else if (recipe.tags?.includes('almuerzo')) type = 'Almuerzo'
          else if (recipe.tags?.includes('cena')) type = 'Cena'
          else if (recipe.tags?.includes('merienda')) type = 'Merienda'

          return {
            id: recipe.id,
            name: recipe.title,
            time: `${recipe.total_time} min`,
            servings: recipe.servings,
            type: type,
            image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=120',
            tags: recipe.tags || []
          }
        })

      } catch (error) {
        console.error('Error cargando recetas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar las recetas')
        allRecipes.value = []
      } finally {
        loading.recipes = false
      }
    }

    // ============================================
    // GESTIÓN DE COMIDAS POR SLOT
    // ============================================

    // Obtener comida para un slot específico
    const getMealForSlot = (day, mealKey) => {
      return weekMeals.value.find(m => m.day === day && m.meal === mealKey)
    }

    // Abrir modal de selección
    const openRecipeSelection = (day, mealKey) => {
      selectedDay.value = day
      selectedMeal.value = mealKey
      isSelectingRecipe.value = true
    }

    // Cerrar modal
    const closeRecipeSelection = () => {
      isSelectingRecipe.value = false
      selectedDay.value = ''
      selectedMeal.value = ''
    }

    // Obtener planificador ID para la semana actual
    const getCurrentPlannerId = async () => {
      const weekStartStr = currentWeekStart.value.toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('weekly_planner')
        .select('id')
        .eq('user_id', authStore.user.id)
        .eq('week_start', weekStartStr)
        .single()

      if (error) {
        console.error('Error obteniendo planificador:', error)
        return null
      }
      
      return data.id
    }

    // Seleccionar receta
    const selectRecipe = async (recipe) => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        const dayOfWeek = weekDays.value.find(d => d.name === selectedDay.value)?.dayOfWeek
        const mealDbType = mealTypes.find(m => m.key === selectedMeal.value)?.dbType

        if (dayOfWeek === undefined || !mealDbType) {
          showNotification('error', 'Error', 'Datos inválidos')
          return
        }

        // Primero eliminar si existe (usando UPSERT con DELETE + INSERT)
        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', plannerId)
          .eq('day_of_week', dayOfWeek)
          .eq('meal_type', mealDbType)

        if (deleteError) throw deleteError

        // Insertar nueva comida
        const { error: insertError } = await supabase
          .from('planned_meals')
          .insert({
            planner_id: plannerId,
            day_of_week: dayOfWeek,
            meal_type: mealDbType,
            recipe_id: recipe.id
          })

        if (insertError) throw insertError

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
        )
        
        weekMeals.value.push({
          id: Date.now(), // ID temporal, se refrescará al recargar
          day: selectedDay.value,
          dayOfWeek: dayOfWeek,
          meal: selectedMeal.value,
          mealDbType: mealDbType,
          recipe: recipe,
          isOutside: false
        })

        showNotification('success', 'Éxito', `${recipe.name} agregado al planificador`)
        closeRecipeSelection()

      } catch (error) {
        console.error('Error seleccionando receta:', error)
        showNotification('error', 'Error', 'No se pudo agregar la receta')
      }
    }

    // Marcar como salida/fuera
    const setOutsideMeal = async () => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        const dayOfWeek = weekDays.value.find(d => d.name === selectedDay.value)?.dayOfWeek
        const mealDbType = mealTypes.find(m => m.key === selectedMeal.value)?.dbType

        if (dayOfWeek === undefined || !mealDbType) {
          showNotification('error', 'Error', 'Datos inválidos')
          return
        }

        // Primero eliminar si existe
        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', plannerId)
          .eq('day_of_week', dayOfWeek)
          .eq('meal_type', mealDbType)

        if (deleteError) throw deleteError

        // Insertar marcador de "fuera" - USAR UN RECETA ESPECIAL O UN CAMPO is_outside
        // Como la tabla requiere recipe_id, necesitamos crear una receta especial "Fuera de casa"
        // Por ahora, mostramos notificación y no guardamos
        showNotification('warning', 'Próximamente', 'Funcionalidad de "fuera" en desarrollo')
        closeRecipeSelection()
        
        // Actualizar estado local con marcador visual
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === selectedDay.value && m.meal === selectedMeal.value)
        )
        
        weekMeals.value.push({
          id: Date.now(),
          day: selectedDay.value,
          dayOfWeek: dayOfWeek,
          meal: selectedMeal.value,
          mealDbType: mealDbType,
          recipe: null,
          isOutside: true
        })

      } catch (error) {
        console.error('Error marcando como fuera:', error)
        showNotification('error', 'Error', 'No se pudo actualizar')
      }
    }

    // Eliminar comida
    const removeMeal = async (day, mealKey) => {
      try {
        const meal = weekMeals.value.find(m => m.day === day && m.meal === mealKey)
        
        if (!meal?.id) {
          showNotification('warning', 'Advertencia', 'No hay comida para eliminar')
          return
        }

        const plannerId = await getCurrentPlannerId()
        if (plannerId && meal.dayOfWeek !== undefined && meal.mealDbType) {
          const { error } = await supabase
            .from('planned_meals')
            .delete()
            .eq('planner_id', plannerId)
            .eq('day_of_week', meal.dayOfWeek)
            .eq('meal_type', meal.mealDbType)

          if (error) throw error
        }

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(
          m => !(m.day === day && m.meal === mealKey)
        )

        showNotification('success', 'Éxito', 'Comida eliminada del planificador')

      } catch (error) {
        console.error('Error eliminando comida:', error)
        showNotification('error', 'Error', 'No se pudo eliminar la comida')
      }
    }

    // ============================================
    // GENERACIÓN DE MENÚ SEMANAL
    // ============================================

    // Abrir modal de generación
    const generateWeeklyMenu = () => {
      showGenerateWeeklyModal.value = true
      generatedWeeklyMenu.value = []
    }

    // Cerrar modal
    const closeGenerateWeeklyModal = () => {
      showGenerateWeeklyModal.value = false
      generationPreferences.selectedDays = {
        lunes: true,
        martes: true,
        miércoles: true,
        jueves: true,
        viernes: true,
        sábado: true,
        domingo: true
      }
    }

    // Generar menú para un día
    const generateDayMenu = async (date) => {
      try {
        const dayName = weekDays.value.find(d => d.date === date)?.name
        if (!dayName) return
        
        const dayOfWeek = weekDays.value.find(d => d.name === dayName)?.dayOfWeek
        const plannerId = await getCurrentPlannerId()
        
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        // Eliminar comidas existentes para este día
        for (const meal of mealTypes) {
          await supabase
            .from('planned_meals')
            .delete()
            .eq('planner_id', plannerId)
            .eq('day_of_week', dayOfWeek)
            .eq('meal_type', meal.dbType)
        }

        // Generar nuevas comidas
        const newMeals = []
        
        for (const mealType of mealTypes) {
          const suitableRecipes = allRecipes.value.filter(recipe => 
            recipe.tags?.includes(mealType.dbType) || recipe.type === mealType.label
          )
          
          if (suitableRecipes.length > 0) {
            const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
            
            const { error } = await supabase
              .from('planned_meals')
              .insert({
                planner_id: plannerId,
                day_of_week: dayOfWeek,
                meal_type: mealType.dbType,
                recipe_id: randomRecipe.id
              })

            if (!error) {
              newMeals.push({
                id: Date.now() + Math.random(),
                day: dayName,
                dayOfWeek: dayOfWeek,
                meal: mealType.key,
                mealDbType: mealType.dbType,
                recipe: randomRecipe,
                isOutside: false
              })
            }
          }
        }

        // Actualizar estado local
        weekMeals.value = weekMeals.value.filter(m => m.day !== dayName)
        weekMeals.value.push(...newMeals)

        showNotification('success', 'Éxito', `Menú generado para ${dayName}`)

      } catch (error) {
        console.error('Error generando menú diario:', error)
        showNotification('error', 'Error', 'No se pudo generar el menú')
      }
    }

    // Generar vista previa del menú semanal
    const generateWeekPreview = async () => {
      try {
        let filteredRecipes = [...allRecipes.value]
        
        if (generationPreferences.quick) {
          filteredRecipes = filteredRecipes.filter(r => 
            parseInt(r.time) <= 30
          )
        }

        const preview = []
        
        for (const day of weekDays.value) {
          const dayLower = day.name.toLowerCase()
          
          if (generationPreferences.selectedDays[dayLower]) {
            for (const mealType of mealTypes) {
              const existing = weekMeals.value.find(
                m => m.day === day.name && m.meal === mealType.key
              )
              
              if (existing) {
                preview.push(existing)
              } else {
                const suitableRecipes = filteredRecipes.filter(recipe => 
                  recipe.tags?.includes(mealType.dbType) || recipe.type === mealType.label
                )
                
                if (suitableRecipes.length > 0) {
                  const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]
                  
                  preview.push({
                    day: day.name,
                    dayOfWeek: day.dayOfWeek,
                    meal: mealType.key,
                    mealDbType: mealType.dbType,
                    recipe: randomRecipe,
                    isOutside: false
                  })
                }
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

    // Aplicar menú generado
    const applyGeneratedWeeklyMenu = async () => {
      try {
        const plannerId = await getCurrentPlannerId()
        if (!plannerId) {
          showNotification('error', 'Error', 'No se encontró el planificador')
          return
        }

        // Eliminar todas las comidas de la semana actual
        const { error: deleteError } = await supabase
          .from('planned_meals')
          .delete()
          .eq('planner_id', plannerId)

        if (deleteError) throw deleteError

        // Insertar nuevas comidas
        const mealsToInsert = generatedWeeklyMenu.value
          .filter(meal => meal.recipe)
          .map(meal => ({
            planner_id: plannerId,
            day_of_week: meal.dayOfWeek,
            meal_type: meal.mealDbType,
            recipe_id: meal.recipe.id
          }))

        if (mealsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('planned_meals')
            .insert(mealsToInsert)

          if (insertError) throw insertError
        }

        // Actualizar estado local
        weekMeals.value = generatedWeeklyMenu.value

        showNotification('success', 'Éxito', 'Menú semanal aplicado exitosamente')
        closeGenerateWeeklyModal()

      } catch (error) {
        console.error('Error aplicando menú:', error)
        showNotification('error', 'Error', 'No se pudo aplicar el menú')
      }
    }

    // ============================================
    // LISTA DE COMPRAS
    // ============================================

    const generateShoppingList = async () => {
      try {
        loading.shoppingList = true
        await generateShoppingListData()
        showShoppingListModal.value = true
      } catch (error) {
        console.error('Error generando lista:', error)
        showNotification('error', 'Error', 'No se pudo generar la lista')
      } finally {
        loading.shoppingList = false
      }
    }

    const closeShoppingListModal = () => {
      showShoppingListModal.value = false
    }

    const generateShoppingListData = async () => {
      try {
        const recipeIds = weekMeals.value
          .filter(meal => !meal.isOutside && meal.recipe?.id)
          .map(meal => meal.recipe.id)
        
        if (recipeIds.length === 0) {
          shoppingList.value = []
          showNotification('info', 'Información', 'No hay recetas planificadas')
          return
        }

        const { data: ingredientsData, error } = await supabase
          .from('recipe_ingredients')
          .select(`
            quantity,
            unit,
            ingredient:ingredients (
              id,
              name,
              category
            )
          `)
          .in('recipe_id', recipeIds)

        if (error) throw error

        const consolidated = {}
        
        ingredientsData.forEach(item => {
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
          quantity: `${Math.ceil(item.quantity * 100) / 100}`,
          purchased: false
        }))

      } catch (error) {
        console.error('Error generando lista de compras:', error)
        throw error
      }
    }

    const groupedShoppingList = computed(() => {
      const groups = {}
      
      shoppingList.value.forEach(item => {
        const category = item.category || 'otros'
        
        if (!groups[category]) {
          groups[category] = {
            name: formatCategory(category),
            items: []
          }
        }
        groups[category].items.push(item)
      })
      
      return Object.values(groups)
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

    const shoppingListStats = computed(() => {
      const recipes = new Set(
        weekMeals.value
          .filter(meal => !meal.isOutside && meal.recipe)
          .map(meal => meal.recipe.id)
      )
      
      return {
        recipes: recipes.size,
        total: shoppingList.value.length,
        purchased: shoppingList.value.filter(item => item.purchased).length
      }
    })

    const exportShoppingList = () => {
      try {
        let listText = `LISTA DE COMPRAS - ${formatWeekRange()}\n\n`
        
        groupedShoppingList.value.forEach(category => {
          listText += `=== ${category.name.toUpperCase()} ===\n`
          
          category.items.forEach(item => {
            const purchased = item.purchased ? '[✓]' : '[ ]'
            listText += `${purchased} ${item.name} - ${item.quantity} ${item.unit}\n`
          })
          
          listText += '\n'
        })
        
        const blob = new Blob([listText], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        showNotification('success', 'Éxito', 'Lista exportada')

      } catch (error) {
        console.error('Error exportando lista:', error)
        showNotification('error', 'Error', 'No se pudo exportar la lista')
      }
    }

    // ============================================
    // FUNCIONES DEL LAYOUT
    // ============================================

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

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }

      const today = new Date()
      currentWeekStart.value = getWeekStart(today)
      weekDays.value = generateWeekDays(currentWeekStart.value)
      
      await loadWeekData()
      
      showNotification('success', 'Bienvenido', 'Planificador semanal cargado')
    })

    return {
      // Estados
      isMobileMenuOpen,
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
      loading,
      showToast,
      toastConfig,
      
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