<template>
<<<<<<< HEAD
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
=======
  <div class="min-h-screen bg-gray-50" :class="{ 'overflow-hidden': isMobileMenuOpen }">
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
    <!-- Sidebar - Fixed position -->
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen" 
      @close="closeMobileMenu" 
<<<<<<< HEAD
      class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full"
      :class="{ 'max-md:translate-x-0': isMobileMenuOpen }"
    />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header 
        @toggle-mobile-menu="toggleMobileMenu" 
        @logout="handleLogout" 
        class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16"
      />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-350 p-5 md:p-6">
          <div>
            <!-- Header de la lista -->
            <div class="mb-6">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                    <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:cart"></span>
                  </div>
                  <div>
                    <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Lista de Compras</h1>
                    <p class="text-sm text-[#6C7A6C]">{{ checkedCount }} de {{ totalCount }} completados</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <button 
                    @click="createNewList"
                    class="cursor-pointer rounded-xl border border-[#5DA271] bg-transparent px-4 py-2.5 text-sm font-medium text-[#5DA271] transition-all duration-200 hover:bg-[#5DA271] hover:text-white"
                  >
                    <span class="iconify h-4 w-4" data-icon="mdi:plus"></span>
                    Nueva lista
                  </button>
                  <select 
                    v-model="currentListId"
                    @change="loadShoppingList"
                    class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-sm text-[#2C2C2C] focus:border-[#5DA271] focus:outline-none"
                  >
                    <option value="">Seleccionar lista</option>
                    <option v-for="list in shoppingLists" :key="list.id" :value="list.id">
                      {{ list.name }} ({{ list.status === 'active' ? 'Activa' : 'Completada' }})
                    </option>
                  </select>
=======
      class="fixed left-0 top-0 w-65 h-screen z-1000 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="{ '-translate-x-full': !isMobileMenuOpen, 'translate-x-0': isMobileMenuOpen }"
    />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-gray-50 transition-all duration-300 md:ml-65">
      <Header 
        @toggle-mobile-menu="toggleMobileMenu" 
        @logout="handleLogout" 
        class="fixed top-0 right-0 left-0 md:left-65 h-17.5 z-900 bg-white border-b border-gray-200 shadow-sm"
      />

      <!-- Scrollable Content -->
      <main class="pt-17.5 min-h-[calc(100vh-70px)] overflow-y-auto bg-gray-50">
        <div class="max-w-350 mx-auto w-full p-5 md:p-6">
          <!-- Contenido de la lista de compras -->
          <div>
            <!-- Header de la lista -->
            <div class="mb-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:cart"></span>
                </div>
                <div>
                  <h1 class="text-2xl font-semibold text-gray-900 mb-1">Lista de Compras</h1>
                  <p class="text-sm text-gray-500">{{ checkedCount }} de {{ totalCount }} completados</p>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(93,162,113,0.2)] border-t-[#5DA271]"></div>
            </div>

            <!-- Contenido de la lista -->
            <div v-else-if="currentListId && shoppingItems.length > 0">
              <!-- Barra de progreso -->
              <div class="mb-6 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-sm">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm text-[#2C2C2C]">Progreso</span>
                  <span class="text-sm font-semibold text-[#5DA271]">{{ Math.round(progress) }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-[rgba(93,162,113,0.2)]">
                  <div class="h-full rounded-full bg-linear-to-r from-[#5DA271] to-[#8BB174] transition-all duration-300" :style="{ width: progress + '%' }"></div>
                </div>
              </div>

              <!-- Grid principal -->
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Lista de compras - Ocupa 2 columnas en lg -->
                <div class="lg:col-span-2">
                  <div class="space-y-4">
                    <div v-for="(items, category) in groupedItems" :key="category" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-sm">
                      <h3 class="mb-4 text-lg font-semibold text-[#2C2C2C]">{{ category }}</h3>
                      <div class="space-y-3">
                        <div v-for="item in items" :key="item.id" 
                          class="flex items-center gap-3 rounded-xl border border-transparent bg-[rgba(93,162,113,0.05)] p-3 transition-all duration-200 hover:-translate-y-px hover:border-[#5DA271] hover:bg-[rgba(93,162,113,0.1)] hover:shadow-md">
                          <label class="relative flex cursor-pointer items-center" @click.stop>
                            <input 
                              type="checkbox" 
                              :checked="item.is_purchased"
                              @change="togglePurchased(item.id)"
                              class="absolute h-0 w-0 cursor-pointer opacity-0"
                            >
                            <span v-if="item.is_purchased" class="flex h-5 w-5 items-center justify-center rounded-md border-[#5DA271] bg-[#5DA271] text-white text-xs transition-all duration-200">✓</span>
                            <span v-else class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[rgba(0,0,0,0.2)] bg-white transition-all duration-200"></span>
                          </label>
                          <div class="min-w-0 flex-1" @click="togglePurchased(item.id)">
                            <p :class="['mb-0.5 cursor-pointer text-sm font-medium text-[#2C2C2C] transition-all duration-200', { 'text-[#6C7A6C] line-through': item.is_purchased }]">
                              {{ item.ingredient_name || 'Ingrediente' }}
                            </p>
                            <p class="text-xs text-[#6C7A6C]">{{ item.quantity }} {{ item.unit }}</p>
                          </div>
                          <button 
                            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[rgba(212,24,61,0.2)] bg-white text-[#6C7A6C] transition-all duration-200 hover:border-[#d4183d] hover:bg-[rgba(212,24,61,0.05)] hover:text-[#d4183d]"
                            @click="removeFromShoppingList(item.id)"
                          >
                            <span class="iconify h-4 w-4" data-icon="mdi:trash-can-outline"></span>
                          </button>
                        </div>
=======
            <!-- Barra de progreso -->
            <div v-if="totalCount > 0" class="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-900">Progreso</span>
                <span class="text-sm font-semibold text-emerald-600">{{ Math.round(progress) }}%</span>
              </div>
              <div class="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Grid principal -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Lista de compras - Ocupa 2 columnas en lg -->
              <div class="lg:col-span-2">
                <div v-if="Object.keys(groupedItems).length > 0" class="space-y-4">
                  <div v-for="(items, category) in groupedItems" :key="category" class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ category }}</h3>
                    <div class="space-y-3">
                      <div v-for="item in items" :key="item.id" 
                        class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-500 hover:-translate-y-px hover:shadow-md border border-transparent">
                        <label class="relative flex items-center cursor-pointer" @click.stop>
                          <input 
                            type="checkbox" 
                            :checked="item.checked"
                            @change="toggleShoppingItem(item.id)"
                            class="absolute opacity-0 cursor-pointer h-0 w-0"
                          >
                          <span v-if="item.checked" class="w-5 h-5 rounded-md transition-all duration-200 flex items-center justify-center bg-emerald-600 border-emerald-600">✓</span>
                          <span v-else class="w-5 h-5 bg-white border-2 border-gray-300 rounded-md transition-all duration-200 flex items-center justify-center">
                          </span>
                        </label>
                        <div class="flex-1 min-w-0" @click="toggleShoppingItem(item.id)">
                          <p :class="['text-sm font-medium text-gray-900 mb-0.5 transition-all duration-200 cursor-pointer', { 'line-through text-gray-400': item.checked }]">
                            {{ item.name }}
                          </p>
                          <p class="text-xs text-gray-500">{{ item.quantity }}</p>
                        </div>
                        <button 
                          class="w-8 h-8 rounded-lg border border-red-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-400 hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                          @click="removeFromShoppingList(item.id)"
                        >
                          <span class="iconify w-4 h-4" data-icon="mdi:trash-can-outline"></span>
                        </button>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                      </div>
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                <!-- Panel lateral para agregar artículos -->
                <div class="lg:sticky lg:top-22 h-fit">
                  <div class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-sm">
                    <h3 class="mb-5 text-lg font-semibold text-[#2C2C2C]">Agregar artículo</h3>
                    <button 
                      class="mb-4 w-full cursor-pointer rounded-xl border-none bg-[#5DA271] py-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
                      @click="openAddItemModal"
                    >
                      Buscar productos
                    </button>
                    <button 
                      v-if="currentListId && shoppingItems.length > 0"
                      @click="completeList"
                      class="w-full cursor-pointer rounded-xl border border-[#5DA271] bg-transparent py-4 text-sm font-medium text-[#5DA271] transition-all duration-200 hover:bg-[#5DA271] hover:text-white"
                    >
                      Marcar lista como completada
                    </button>
                    <p class="mt-4 text-center text-xs leading-relaxed text-[#6C7A6C]">
                      Usa el buscador visual para agregar productos a tu lista
                    </p>
                  </div>
=======
                <div v-else class="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                  <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <span class="iconify w-16 h-16" data-icon="mdi:cart-outline"></span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Tu lista está vacía</h3>
                  <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    Comienza agregando productos que necesitas comprar
                  </p>
                  <button 
                    class="bg-emerald-600 text-white border-none px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Agregar productos
                  </button>
                </div>
              </div>

              <!-- Panel lateral para agregar artículos -->
              <div class="lg:sticky lg:top-22.5 h-fit">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-5">Agregar artículo</h3>
                  <button 
                    class="w-full bg-emerald-600 text-white border-none py-4 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 mb-4 hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg"
                    @click="openAddItemModal"
                  >
                    Buscar productos
                  </button>
                  <p class="text-xs text-gray-500 text-center leading-relaxed">
                    Usa el buscador visual para agregar productos a tu lista
                  </p>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else-if="currentListId && shoppingItems.length === 0" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-12 text-center shadow-sm">
              <div class="mx-auto mb-4 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:cart-outline"></span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-[#2C2C2C]">Tu lista está vacía</h3>
              <p class="mx-auto mb-6 max-w-md text-sm text-[#6C7A6C]">
                Comienza agregando productos que necesitas comprar
              </p>
              <button 
                class="cursor-pointer rounded-xl border-none bg-[#5DA271] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
                @click="openAddItemModal"
              >
                Agregar productos
              </button>
            </div>

            <!-- Selección de lista inicial -->
            <div v-else-if="!currentListId && shoppingLists.length > 0" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-12 text-center shadow-sm">
              <div class="mx-auto mb-4 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:cart-outline"></span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-[#2C2C2C]">Selecciona una lista</h3>
              <p class="mx-auto mb-6 max-w-md text-sm text-[#6C7A6C]">
                Elige una lista existente o crea una nueva para comenzar
              </p>
              <button 
                @click="createNewList"
                class="cursor-pointer rounded-xl border-none bg-[#5DA271] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
              >
                Crear nueva lista
              </button>
            </div>

            <!-- Sin listas -->
            <div v-else-if="shoppingLists.length === 0" class="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-12 text-center shadow-sm">
              <div class="mx-auto mb-4 text-[#6C7A6C]">
                <span class="iconify h-16 w-16" data-icon="mdi:cart-outline"></span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-[#2C2C2C]">No tienes listas de compras</h3>
              <p class="mx-auto mb-6 max-w-md text-sm text-[#6C7A6C]">
                Crea tu primera lista de compras para comenzar
              </p>
              <button 
                @click="createNewList"
                class="cursor-pointer rounded-xl border-none bg-[#5DA271] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
              >
                Crear primera lista
              </button>
            </div>

            <!-- Modal para agregar productos -->
<<<<<<< HEAD
            <div v-if="showAddItemModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeAddItemModal">
              <div class="flex max-h-[80vh] w-full max-w-200 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
                <div class="relative border-b border-[rgba(0,0,0,0.08)] bg-white p-6">
                  <h3 class="mb-1 text-lg font-semibold text-[#2C2C2C]">Buscar productos</h3>
                  <p class="text-sm text-[#6C7A6C]">Agrega productos a tu lista de compras</p>
                  <button class="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#6C7A6C] transition-all duration-200 hover:bg-[#D8EBD0]" @click="closeAddItemModal">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="px-6 pb-0 pt-5">
                  <div class="relative">
                    <span class="iconify absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6C7A6C]" data-icon="mdi:magnify"></span>
=======
            <div v-if="showAddItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-5 backdrop-blur-sm" @click="closeAddItemModal">
              <div class="bg-white rounded-xl w-full max-w-200 max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200" @click.stop>
                <div class="p-6 border-b border-gray-200 relative bg-white">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Buscar productos</h3>
                  <p class="text-sm text-gray-500">Agrega productos a tu lista de compras</p>
                  <button class="absolute top-5 right-5 w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-gray-400 transition-all duration-200 hover:bg-gray-100" @click="closeAddItemModal">
                    <span class="iconify w-5 h-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="pt-5 px-6 pb-0">
                  <div class="relative">
                    <span class="iconify absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" data-icon="mdi:magnify"></span>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                    <input 
                      type="text" 
                      v-model="searchQuery"
                      placeholder="Buscar productos..."
<<<<<<< HEAD
                      class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-3.5 pl-12 pr-5 text-sm text-[#2C2C2C] transition-all duration-200 focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                      @input="filterIngredients"
=======
                      class="w-full py-3.5 pl-12 pr-5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm transition-all duration-200 focus:outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"
                      @input="filterProducts"
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                    >
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
<<<<<<< HEAD
                  <div class="mb-5 flex flex-wrap gap-2">
=======
                  <div class="flex gap-2 mb-5 flex-wrap">
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                    <button 
                      v-for="category in ingredientCategories" 
                      :key="category.key"
                      :class="[
<<<<<<< HEAD
                        'cursor-pointer whitespace-nowrap rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2 text-xs font-medium text-[#2C2C2C] transition-all duration-200 hover:border-[#5DA271] hover:text-[#5DA271]',
                        { 'border-[#5DA271] bg-[#5DA271] text-white hover:bg-[rgba(93,162,113,0.9)]': activeCategory === category.key }
=======
                        'px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap hover:border-emerald-600 hover:text-emerald-600',
                        { 'bg-emerald-600 text-white border-emerald-600': activeCategory === category.key }
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                      ]"
                      @click="setActiveCategory(category.key)"
                    >
                      {{ category.name }}
                    </button>
                  </div>

<<<<<<< HEAD
                  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div 
                      v-for="ingredient in filteredIngredients" 
                      :key="ingredient.id"
                      class="cursor-pointer overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#5DA271] hover:shadow-lg"
                      @click="openQuantityModal(ingredient)"
                    >
                      <div class="relative h-28 overflow-hidden">
                        <img :src="ingredient.image_url || defaultImage" :alt="ingredient.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute left-2 top-2 rounded bg-[#5DA271] px-2 py-1 text-[10px] font-medium text-white">
                          {{ getCategoryName(ingredient.category) }}
                        </div>
                      </div>
                      <div class="p-3">
                        <h4 class="mb-1 text-sm font-medium text-[#2C2C2C]">{{ ingredient.name }}</h4>
                        <p class="text-xs font-semibold text-[#5DA271]">{{ ingredient.default_unit }}</p>
=======
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div 
                      v-for="product in filteredProducts" 
                      :key="product.id"
                      class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-600"
                      @click="addProductToList(product)"
                    >
                      <div class="relative h-28 overflow-hidden">
                        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" @error="handleImageError">
                        <div class="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium">
                          {{ product.category }}
                        </div>
                      </div>
                      <div class="p-3">
                        <h4 class="text-sm font-medium text-gray-900 mb-1">{{ product.name }}</h4>
                        <p class="text-xs text-emerald-600 font-semibold">{{ product.price }}</p>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal para cantidad -->
            <div v-if="showQuantityModal" class="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm" @click="closeQuantityModal">
              <div class="w-full max-w-md rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-2xl" @click.stop>
                <div class="relative border-b border-[rgba(0,0,0,0.08)] bg-white p-6">
                  <h3 class="mb-1 text-lg font-semibold text-[#2C2C2C]">Agregar {{ selectedIngredient?.name }}</h3>
                  <p class="text-sm text-[#6C7A6C]">Especifica la cantidad que necesitas</p>
                  <button class="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#6C7A6C] transition-all duration-200 hover:bg-[#D8EBD0]" @click="closeQuantityModal">
                    <span class="iconify h-5 w-5" data-icon="mdi:close"></span>
                  </button>
                </div>

                <div class="p-6">
                  <div class="mb-6">
                    <label class="mb-2 block text-sm font-medium text-[#2C2C2C]">Cantidad</label>
                    <div class="flex gap-3">
                      <input 
                        type="number" 
                        v-model="itemQuantity"
                        step="0.5"
                        min="0.5"
                        class="flex-1 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-sm text-[#2C2C2C] focus:border-[#5DA271] focus:outline-none"
                      >
                      <select 
                        v-model="itemUnit"
                        class="w-28 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-sm text-[#2C2C2C] focus:border-[#5DA271] focus:outline-none"
                      >
                        <option value="unidades">unidades</option>
                        <option value="gramos">gramos</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="litros">litros</option>
                        <option value="tazas">tazas</option>
                        <option value="cucharadas">cucharadas</option>
                      </select>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button @click="closeQuantityModal" class="flex-1 cursor-pointer rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent px-4 py-3 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:bg-[#D8EBD0]">
                      Cancelar
                    </button>
                    <button @click="addToList" class="flex-1 cursor-pointer rounded-xl bg-[#5DA271] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
                      Agregar a la lista
                    </button>
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
  name: 'ListaComprasView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMobileMenuOpen = ref(false)
    const loading = ref(true)
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&h=200'
    
    // Listas de compras
    const shoppingLists = ref([])
    const currentListId = ref('')
    const shoppingItems = ref([])
    
    // Ingredientes disponibles
    const allIngredients = ref([])
    const ingredientCategories = [
      { key: 'all', name: 'Todos' },
      { key: 'verduras', name: 'Verduras' },
      { key: 'frutas', name: 'Frutas' },
      { key: 'proteínas', name: 'Proteínas' },
      { key: 'granos', name: 'Granos' },
      { key: 'lácteos', name: 'Lácteos' },
      { key: 'condimentos', name: 'Condimentos' },
      { key: 'bebidas', name: 'Bebidas' },
      { key: 'otros', name: 'Otros' }
    ]
    
    // Modal de agregar producto
    const showAddItemModal = ref(false)
    const searchQuery = ref('')
    const activeCategory = ref('all')
    const filteredIngredients = ref([])
    
    // Modal de cantidad
    const showQuantityModal = ref(false)
    const selectedIngredient = ref(null)
    const itemQuantity = ref(1)
    const itemUnit = ref('unidades')
    
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

    const getCategoryName = (category) => {
      const cat = ingredientCategories.find(c => c.key === category)
      return cat ? cat.name : category
    }

    const loadShoppingLists = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_lists')
          .select('*')
          .eq('user_id', authStore.user?.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        shoppingLists.value = data || []
        
        // Si hay una lista activa, seleccionarla automáticamente
        const activeList = shoppingLists.value.find(list => list.status === 'active')
        if (activeList && !currentListId.value) {
          currentListId.value = activeList.id
          await loadShoppingList()
        }
        
      } catch (error) {
        console.error('Error cargando listas:', error)
        showNotification('error', 'Error', 'No se pudieron cargar tus listas')
      }
    }

    const loadShoppingList = async () => {
      if (!currentListId.value) return
      
      try {
        loading.value = true
        
        // CORREGIDO: Usar 'added_at' en lugar de 'created_at'
        const { data, error } = await supabase
          .from('shopping_list_items')
          .select(`
            id,
            quantity,
            unit,
            is_purchased,
            notes,
            ingredient:ingredients (
              id,
              name,
              category,
              image_url
            )
          `)
          .eq('list_id', currentListId.value)
          .order('added_at', { ascending: true })

        if (error) throw error
        
        // Transformar datos para manejar caso donde ingredient es null
        shoppingItems.value = (data || []).map(item => ({
          id: item.id,
          quantity: item.quantity,
          unit: item.unit,
          is_purchased: item.is_purchased,
          notes: item.notes,
          ingredient_id: item.ingredient?.id || null,
          ingredient_name: item.ingredient?.name || 'Ingrediente',
          ingredient_category: item.ingredient?.category || 'otros',
          ingredient_image: item.ingredient?.image_url || defaultImage
        }))
        
      } catch (error) {
        console.error('Error cargando lista:', error)
        showNotification('error', 'Error', 'No se pudo cargar la lista de compras')
        shoppingItems.value = []
      } finally {
        loading.value = false
      }
    }

    const loadIngredients = async () => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('*')
          .order('name')

        if (error) throw error
        
        allIngredients.value = data || []
        filteredIngredients.value = [...allIngredients.value]
        
      } catch (error) {
        console.error('Error cargando ingredientes:', error)
        showNotification('error', 'Error', 'No se pudieron cargar los productos')
      }
    }

    const createNewList = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: authStore.user?.id,
            name: `Lista ${new Date().toLocaleDateString()}`,
            status: 'active'
          })
          .select()
          .single()

        if (error) throw error
        
        shoppingLists.value.unshift(data)
        currentListId.value = data.id
        await loadShoppingList()
        showNotification('success', 'Éxito', 'Nueva lista creada')
        
      } catch (error) {
        console.error('Error creando lista:', error)
        showNotification('error', 'Error', 'No se pudo crear la lista')
      }
    }

    const completeList = async () => {
      try {
        const { error } = await supabase
          .from('shopping_lists')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', currentListId.value)

        if (error) throw error
        
        // Actualizar estado local
        const listIndex = shoppingLists.value.findIndex(l => l.id === currentListId.value)
        if (listIndex !== -1) {
          shoppingLists.value[listIndex].status = 'completed'
        }
        
        currentListId.value = ''
        shoppingItems.value = []
        
        showNotification('success', 'Éxito', 'Lista marcada como completada')
        
      } catch (error) {
        console.error('Error completando lista:', error)
        showNotification('error', 'Error', 'No se pudo completar la lista')
      }
    }

    const togglePurchased = async (itemId) => {
      try {
        const item = shoppingItems.value.find(i => i.id === itemId)
        if (!item) return
        
        const newStatus = !item.is_purchased
        
        const { error } = await supabase
          .from('shopping_list_items')
          .update({ 
            is_purchased: newStatus,
            purchased_at: newStatus ? new Date().toISOString() : null
          })
          .eq('id', itemId)

        if (error) throw error
        
        item.is_purchased = newStatus
        
      } catch (error) {
        console.error('Error actualizando estado:', error)
        showNotification('error', 'Error', 'No se pudo actualizar el estado')
      }
    }

    const removeFromShoppingList = async (itemId) => {
      try {
        const { error } = await supabase
          .from('shopping_list_items')
          .delete()
          .eq('id', itemId)

        if (error) throw error
        
        shoppingItems.value = shoppingItems.value.filter(item => item.id !== itemId)
        showNotification('success', 'Eliminado', 'Producto eliminado de la lista')
        
      } catch (error) {
        console.error('Error eliminando producto:', error)
        showNotification('error', 'Error', 'No se pudo eliminar el producto')
      }
    }

    const addToList = async () => {
      // CORREGIDO: Verificar que selectedIngredient existe y tiene id
      if (!selectedIngredient.value || !selectedIngredient.value.id) {
        showNotification('error', 'Error', 'No se pudo identificar el producto')
        return
      }
      
      if (!currentListId.value) {
        showNotification('warning', 'Advertencia', 'Primero selecciona o crea una lista')
        return
      }
      
      try {
        const { error } = await supabase
          .from('shopping_list_items')
          .insert({
            list_id: currentListId.value,
            ingredient_id: selectedIngredient.value.id,
            quantity: parseFloat(itemQuantity.value),
            unit: itemUnit.value,
            is_purchased: false
          })

        if (error) throw error
        
        await loadShoppingList()
        closeQuantityModal()
        showNotification('success', 'Agregado', `${selectedIngredient.value.name} agregado a la lista`)
        
      } catch (error) {
        console.error('Error agregando a la lista:', error)
        showNotification('error', 'Error', 'No se pudo agregar el producto')
      }
    }

    const openAddItemModal = () => {
      if (!currentListId.value) {
        showNotification('warning', 'Advertencia', 'Primero selecciona o crea una lista')
        return
      }
      showAddItemModal.value = true
      searchQuery.value = ''
      activeCategory.value = 'all'
      filteredIngredients.value = [...allIngredients.value]
    }

    const closeAddItemModal = () => {
      showAddItemModal.value = false
    }

    const openQuantityModal = (ingredient) => {
      selectedIngredient.value = ingredient
      itemQuantity.value = 1
      itemUnit.value = ingredient.default_unit || 'unidades'
      closeAddItemModal()
      showQuantityModal.value = true
    }

    const closeQuantityModal = () => {
      showQuantityModal.value = false
      selectedIngredient.value = null
    }

    const setActiveCategory = (category) => {
      activeCategory.value = category
      filterIngredients()
    }

    const filterIngredients = () => {
      let filtered = [...allIngredients.value]

      if (activeCategory.value !== 'all') {
        filtered = filtered.filter(ing => ing.category === activeCategory.value)
      }

      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(ing => 
          ing.name.toLowerCase().includes(query)
        )
      }

      filteredIngredients.value = filtered
    }

    // Computed properties
    const checkedCount = computed(() => {
      return shoppingItems.value.filter(item => item.is_purchased).length
    })

    const totalCount = computed(() => {
      return shoppingItems.value.length
    })

    const progress = computed(() => {
      return totalCount.value > 0 ? (checkedCount.value / totalCount.value) * 100 : 0
    })

    const groupedItems = computed(() => {
      const groups = {}
      shoppingItems.value.forEach(item => {
        const category = item.ingredient_category || 'otros'
        const categoryName = getCategoryName(category)
        if (!groups[categoryName]) {
          groups[categoryName] = []
        }
        groups[categoryName].push(item)
      })
      return groups
    })

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
        await Promise.all([
          loadShoppingLists(),
          loadIngredients()
        ])
        loading.value = false
      }
    })

<<<<<<< HEAD
=======
    const totalCount = computed(() => {
      return shoppingList.value.length
    })

    const progress = computed(() => {
      return totalCount.value > 0 ? (checkedCount.value / totalCount.value) * 100 : 0
    })

    const groupedItems = computed(() => {
      const groups = {}
      shoppingList.value.forEach(item => {
        if (!groups[item.category]) {
          groups[item.category] = []
        }
        groups[item.category].push(item)
      })
      return groups
    })

    // Modal functions
    const openAddItemModal = () => {
      showAddItemModal.value = true
      searchQuery.value = ''
      activeCategory.value = 'all'
      filteredProducts.value = [...allProducts.value]
    }

    const closeAddItemModal = () => {
      showAddItemModal.value = false
    }

    const setActiveCategory = (category) => {
      activeCategory.value = category
      filterProducts()
    }

    const filterProducts = () => {
      let filtered = [...allProducts.value]

      if (activeCategory.value !== 'all') {
        filtered = filtered.filter(product => product.category === activeCategory.value)
      }

      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      filteredProducts.value = filtered
    }

    const addProductToList = (product) => {
      const exists = shoppingList.value.some(item => 
        item.name.toLowerCase() === product.name.toLowerCase()
      )

      if (!exists) {
        addToShoppingList({
          name: product.name,
          category: product.category,
          quantity: '1 unidad',
          checked: false
        })
        
        closeAddItemModal()
      } else {
        alert(`${product.name} ya está en tu lista de compras`)
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWYxIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI2UxZThlMCIvPgo8L3N2Zz4='
    }

>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
    return {
      isMobileMenuOpen,
      loading,
      shoppingLists,
      currentListId,
      shoppingItems,
      allIngredients,
      ingredientCategories,
      showAddItemModal,
      searchQuery,
      activeCategory,
      filteredIngredients,
      showQuantityModal,
      selectedIngredient,
      itemQuantity,
      itemUnit,
      defaultImage,
      showToast,
      toastType,
      toastTitle,
      toastMessage,
      toastIcon,
      checkedCount,
      totalCount,
      progress,
      groupedItems,
      getCategoryName,
      loadShoppingList,
      createNewList,
      completeList,
      togglePurchased,
      removeFromShoppingList,
      addToList,
      openAddItemModal,
      closeAddItemModal,
      openQuantityModal,
      closeQuantityModal,
      setActiveCategory,
      filterIngredients,
      handleImageError,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
<<<<<<< HEAD
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
=======
</script>
>>>>>>> ec65ee023f3fc08687042d4e58aca71ea0448877
