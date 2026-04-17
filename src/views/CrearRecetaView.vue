<!-- src/views/CrearRecetaView.vue - Versión Rediseñada con Tailwind CSS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
        <!-- Botón volver atrás -->
        <div class="max-w-4xl mx-auto my-4 flex justify-end">
          <button @click="$router.back()"
            class="flex items-center gap-2 transition-colors bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <Icon icon="mdi:arrow-left" class="text-xl" />
            <span>Volver</span>
          </button>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:plus-circle"></span>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Crear Nueva Receta</h1>
              <p class="text-sm text-gray-500">Comparte tu receta dominicana con la comunidad</p>
            </div>
          </div>

          <form @submit.prevent="submitRecipe" class="space-y-6">
            <!-- Información básica -->
            <div class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:information"></span>
                Información básica
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Título de la receta *</label>
                  <input v-model="form.title" type="text" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select v-model="form.category" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600">
                    <option value="desayuno">Desayuno</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                    <option value="postre">Postre</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción breve *</label>
                <textarea v-model="form.description" rows="3" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"></textarea>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                  <select v-model="form.difficulty" class="w-full px-4 py-3 rounded-xl border border-gray-200">
                    <option value="fácil">Fácil</option>
                    <option value="medio">Medio</option>
                    <option value="difícil">Difícil</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo total (min) *</label>
                  <input v-model="form.total_time" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Porciones *</label>
                  <input v-model="form.servings" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Calorías por porción</label>
                  <input v-model="form.calories" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
              </div>

              <!-- Imagen principal con previsualización -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen principal</label>
                <div class="flex flex-wrap gap-3">
                  <input v-model="form.image_url" type="text" placeholder="https://..."
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200">
                  <label class="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700">
                    <span class="iconify inline mr-2" data-icon="mdi:folder-upload"></span>
                    Subir archivo
                    <input type="file" accept="image/*" @change="uploadImage" class="hidden">
                  </label>
                  <button type="button" @click="generateImageWithAI" 
                    class="px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                    <span class="iconify inline mr-2" data-icon="mdi:robot"></span>
                    Generar con IA
                  </button>
                </div>
                
                <!-- Previsualización -->
                <div v-if="form.image_preview" class="mt-3">
                  <img :src="form.image_preview" class="w-32 h-32 object-cover rounded-xl border">
                  <button type="button" @click="clearImage" class="text-red-500 text-sm mt-1">Eliminar</button>
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="tag in form.tags" :key="tag"
                    class="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    #{{ tag }}
                    <button type="button" @click="removeTag(tag)" class="hover:text-red-500">×</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="newTag" @keyup.enter="addTag" placeholder="Ej: tradicional, rápido, económico"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200">
                  <button type="button" @click="addTag" class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Ingredientes - Modal estilo HomeView -->
            <div class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:food-apple"></span>
                  Ingredientes
                </h2>
                <button type="button" @click="openIngredientModal" 
                  class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  <span class="iconify inline mr-1" data-icon="mdi:plus"></span> Buscar ingrediente
                </button>
              </div>

              <div v-if="form.ingredients.length === 0" class="text-center py-8 text-gray-400">
                <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:food-outline"></span>
                <p>No hay ingredientes agregados</p>
                <p class="text-sm">Haz clic en "Buscar ingrediente" para agregar</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="(ing, idx) in form.ingredients" :key="idx" 
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ ing.name }}</p>
                  </div>
                  <div class="w-24">
                    <input v-model="ing.quantity" type="number" step="0.5" min="0.5"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-center">
                  </div>
                  <div class="w-28">
                    <select v-model="ing.unit" class="w-full px-3 py-2 rounded-lg border border-gray-200">
                      <option value="unidades">unidades</option>
                      <option value="gramos">gramos</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="tazas">tazas</option>
                      <option value="cucharadas">cucharadas</option>
                      <option value="cucharaditas">cucharaditas</option>
                    </select>
                  </div>
                  <button type="button" @click="removeIngredient(idx)" class="text-red-500 p-2 hover:text-red-700">
                    <span class="iconify w-5 h-5" data-icon="mdi:trash-can-outline"></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Pasos de preparación -->
            <div class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <span class="iconify w-5 h-5 text-emerald-600" data-icon="mdi:format-list-numbered"></span>
                  Pasos de preparación
                </h2>
                <button type="button" @click="addStep" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  <span class="iconify inline mr-1" data-icon="mdi:plus"></span> Agregar paso
                </button>
              </div>

              <div v-for="(step, idx) in form.steps" :key="idx" class="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">{{ idx + 1 }}</div>
                <div class="flex-1 space-y-2">
                  <textarea v-model="step.description" rows="2" placeholder="Describe el paso..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200"></textarea>
                  <div class="flex flex-wrap gap-2">
                    <input v-model="step.image" placeholder="URL de imagen (opcional)" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <label class="cursor-pointer px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50">
                      <span class="iconify inline mr-1" data-icon="mdi:folder-upload"></span> Subir
                      <input type="file" accept="image/*" @change="uploadStepImage($event, idx)" class="hidden">
                    </label>
                    <div class="flex items-center gap-1">
                      <span class="iconify text-gray-400" data-icon="mdi:clock-outline"></span>
                      <input v-model="step.time_estimate" type="number" placeholder="min" class="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    </div>
                  </div>
                  <div v-if="step.image_preview" class="mt-2">
                    <img :src="step.image_preview" class="w-32 h-24 object-cover rounded-lg border">
                  </div>
                </div>
                <button type="button" @click="removeStep(idx)" class="text-red-500 p-2 hover:text-red-700">
                  <span class="iconify w-5 h-5" data-icon="mdi:trash-can-outline"></span>
                </button>
              </div>
            </div>

            <!-- Extras -->
            <div class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 class="text-lg font-semibold text-gray-900">Extras (opcional)</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">URL de YouTube</label>
                <input v-model="form.youtube_url" placeholder="https://youtube.com/watch?v=..." 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200">
                <div v-if="form.youtube_preview" class="mt-2 text-sm text-emerald-600">
                  ✅ ID del video: {{ form.youtube_embed_id }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                <textarea v-model="form.additional_notes" rows="3" placeholder="Consejos, variaciones, sustituciones..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Utensilios necesarios</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="utensil in form.utensils_needed" :key="utensil"
                    class="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 flex items-center gap-1">
                    {{ utensil }}
                    <button type="button" @click="removeUtensil(utensil)" class="hover:text-red-500">×</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="newUtensil" @keyup.enter="addUtensil" placeholder="Ej: olla, sartén, cuchillo"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200">
                  <button type="button" @click="addUtensil" class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Botones finales -->
            <div class="flex gap-4 justify-end">
              <button type="button" @click="cancel" class="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" :disabled="submitting"
                class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                {{ submitting ? 'Publicando...' : 'Publicar receta' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>

    <!-- Modal de búsqueda de ingredientes (estilo HomeView) -->
    <div v-if="showIngredientModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4" @click="showIngredientModal = false">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl" @click.stop>
        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Buscar ingrediente</h3>
            <p class="text-sm text-gray-500">Selecciona un ingrediente para agregar a tu receta</p>
          </div>
          <button @click="showIngredientModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="iconify w-6 h-6" data-icon="mdi:close"></span>
          </button>
        </div>
        <div class="p-5">
          <div class="relative mb-4">
            <span class="iconify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" data-icon="mdi:magnify"></span>
            <input type="text" v-model="ingredientSearch" placeholder="Buscar ingrediente..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            <div v-for="ing in filteredIngredients" :key="ing.id"
              @click="selectIngredient(ing)"
              class="relative rounded-xl border border-gray-200 p-3 flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 hover:border-emerald-600 bg-white">
              <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <img :src="ing.image_url || defaultImage" :alt="ing.name" class="w-full h-full object-cover">
              </div>
              <div class="font-medium text-sm text-center text-gray-900">{{ ing.name }}</div>
              <button class="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700">
                <span class="iconify w-4 h-4" data-icon="mdi:plus"></span>
              </button>
            </div>
          </div>
          <div v-if="filteredIngredients.length === 0" class="text-center py-8 text-gray-400">
            <span class="iconify w-12 h-12 mx-auto mb-2" data-icon="mdi:food-off"></span>
            <p>No se encontraron ingredientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'

export default {
  name: 'CrearRecetaView',
  components: { Sidebar, Header, Icon },
  data() {
    return {
      submitting: false,
      showToast: false,
      toastMessage: '',
      isMobileMenuOpen: false,
      showIngredientModal: false,
      ingredientSearch: '',
      allIngredients: [],
      newTag: '',
      newUtensil: '',
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      form: {
        title: '',
        description: '',
        category: 'almuerzo',
        difficulty: 'fácil',
        total_time: 30,
        servings: 4,
        calories: '',
        image_url: '',
        image_preview: null,
        tags: [],
        ingredients: [],
        steps: [{ description: '', image: '', image_preview: null, time_estimate: 5 }],
        youtube_url: '',
        youtube_embed_id: null,
        youtube_preview: false,
        additional_notes: '',
        utensils_needed: []
      }
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    filteredIngredients() {
      if (!this.ingredientSearch) return this.allIngredients
      return this.allIngredients.filter(i => 
        i.name.toLowerCase().includes(this.ingredientSearch.toLowerCase())
      )
    }
  },
  methods: {
    toast(msg) {
      this.toastMessage = msg
      this.showToast = true
      setTimeout(() => this.showToast = false, 3000)
    },
    async loadIngredients() {
      const { data } = await supabase.from('ingredients').select('id, name, image_url').order('name')
      this.allIngredients = data || []
    },
    openIngredientModal() {
      this.ingredientSearch = ''
      this.showIngredientModal = true
    },
    selectIngredient(ing) {
      if (!this.form.ingredients.some(i => i.id === ing.id)) {
        this.form.ingredients.push({
          id: ing.id,
          name: ing.name,
          quantity: 1,
          unit: 'unidades'
        })
      }
      this.showIngredientModal = false
      this.toast(`✅ ${ing.name} agregado`)
    },
    addTag() {
      if (this.newTag && !this.form.tags.includes(this.newTag)) {
        this.form.tags.push(this.newTag)
        this.newTag = ''
      }
    },
    removeTag(tag) {
      this.form.tags = this.form.tags.filter(t => t !== tag)
    },
    removeIngredient(idx) {
      this.form.ingredients.splice(idx, 1)
    },
    addStep() {
      this.form.steps.push({ description: '', image: '', image_preview: null, time_estimate: 5 })
    },
    removeStep(idx) {
      this.form.steps.splice(idx, 1)
    },
    addUtensil() {
      if (this.newUtensil && !this.form.utensils_needed.includes(this.newUtensil)) {
        this.form.utensils_needed.push(this.newUtensil)
        this.newUtensil = ''
      }
    },
    removeUtensil(utensil) {
      this.form.utensils_needed = this.form.utensils_needed.filter(u => u !== utensil)
    },
    uploadImage(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.image_preview = e.target.result
          this.form.image_url = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    clearImage() {
      this.form.image_preview = null
      this.form.image_url = ''
    },
    uploadStepImage(event, stepIdx) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.steps[stepIdx].image_preview = e.target.result
          this.form.steps[stepIdx].image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    generateImageWithAI() {
      const randomId = Math.floor(Math.random() * 100)
      this.form.image_url = `https://picsum.photos/id/${randomId}/800/600`
      this.form.image_preview = this.form.image_url
      this.toast('🎨 Imagen de prueba generada (puedes cambiarla)')
    },
    async submitRecipe() {
      if (!this.form.title || !this.form.description || !this.form.total_time || !this.form.servings) {
        this.toast('❌ Completa los campos requeridos')
        return
      }

      if (this.form.ingredients.length === 0) {
        this.toast('❌ Agrega al menos un ingrediente')
        return
      }

      this.submitting = true

      try {
        let youtubeEmbedId = null
        if (this.form.youtube_url) {
          const match = this.form.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          if (match) {
            youtubeEmbedId = match[1]
            this.form.youtube_embed_id = youtubeEmbedId
            this.form.youtube_preview = true
          }
        }

        const steps = this.form.steps.map((step, idx) => ({
          step_number: idx + 1,
          description: step.description,
          image: step.image || null,
          time_estimate: step.time_estimate || 5
        }))

        const recipeData = {
          title: this.form.title,
          description: this.form.description,
          category: this.form.category,
          difficulty: this.form.difficulty,
          total_time: parseInt(this.form.total_time),
          servings: parseInt(this.form.servings),
          calories_per_serving: this.form.calories ? parseInt(this.form.calories) : null,
          image_url: this.form.image_url || null,
          tags: this.form.tags,
          steps: steps,
          is_public: true,
          created_by: this.authStore.user?.id,
          youtube_url: this.form.youtube_url || null,
          additional_notes: this.form.additional_notes || null,
          utensils_needed: this.form.utensils_needed,
          author_name: this.authStore.userName,
          author_avatar: null
        }

        const { data: recipe, error: recipeError } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select()
          .single()

        if (recipeError) throw recipeError

        for (const ing of this.form.ingredients) {
          let ingredientId = ing.id

          if (!ingredientId) {
            const { data: existing } = await supabase
              .from('ingredients')
              .select('id')
              .ilike('name', ing.name)
              .limit(1)

            if (existing?.length) {
              ingredientId = existing[0].id
            } else {
              const { data: newIng } = await supabase
                .from('ingredients')
                .insert({ name: ing.name, category: 'otros', default_unit: ing.unit })
                .select()
                .single()
              ingredientId = newIng.id
            }
          }

          await supabase.from('recipe_ingredients').insert({
            recipe_id: recipe.id,
            ingredient_id: ingredientId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit
          })
        }

        this.toast('🎉 ¡Receta publicada exitosamente!')
        setTimeout(() => this.$router.push('/recetas'), 1500)

      } catch (error) {
        console.error('Error:', error)
        this.toast('❌ Error al publicar la receta')
      } finally {
        this.submitting = false
      }
    },
    cancel() {
      this.$router.push('/recetas')
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    async handleLogout() {
      await this.authStore.logout()
      this.$router.push('/login')
    }
  },
  mounted() {
    if (this.authStore.isAuthenticated) {
      this.loadIngredients()
    }
  }
}
</script>