<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />
    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />
      <main class="pt-17.5 p-6">
        <div class="max-w-4xl mx-auto my-4 flex justify-end">
          <button @click="$router.back()" class="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg">
            <Icon icon="mdi:arrow-left" class="text-xl" />
            <span>Volver</span>
          </button>
        </div>
        <div class="max-w-4xl mx-auto">
          <div class="mb-8 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span class="iconify w-6 h-6 text-emerald-600" data-icon="mdi:pencil"></span>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Editar Receta</h1>
              <p class="text-sm text-gray-500">Modifica tu receta dominicana</p>
            </div>
          </div>

          <form @submit.prevent="updateRecipe" class="space-y-6">
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
                  <select v-model="form.category"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600">
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
                  <input v-model="form.total_time" type="number" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Porciones *</label>
                  <input v-model="form.servings" type="number" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Calorías por porción</label>
                  <input v-model="form.calories" type="number"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
              </div>

              <!-- Imagen principal con previsualización -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen principal</label>
                <div class="flex flex-wrap gap-3">
                  <input v-model="form.image_url" type="text" placeholder="https://..."
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200">
                  <label
                    class="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700">
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

                <!-- Previsualización - VERSIÓN CORREGIDA -->
                <div v-if="form.image_preview" class="mt-3">
                  <img :src="form.image_preview" class="w-full h-48 object-cover rounded-xl border">
                  <div class="flex gap-2 mt-2">
                    <button type="button" @click="regenerateImage" class="text-blue-500 text-sm hover:text-blue-700">
                      🔄 Regenerar
                    </button>
                    <button type="button" @click="clearImage" class="text-red-500 text-sm hover:text-red-700">
                      🗑️ Eliminar
                    </button>
                  </div>
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
                  <button type="button" @click="addTag"
                    class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700">Agregar</button>
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
                <button type="button" @click="addStep"
                  class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  <span class="iconify inline mr-1" data-icon="mdi:plus"></span> Agregar paso
                </button>
              </div>

              <div v-for="(step, idx) in form.steps" :key="idx" class="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div
                  class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  {{ idx + 1 }}</div>
                <div class="flex-1 space-y-2">
                  <textarea v-model="step.description" rows="2" placeholder="Describe el paso..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200"></textarea>
                  <div class="flex flex-wrap gap-2">
                    <input v-model="step.image" placeholder="URL de imagen (opcional)"
                      class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <label
                      class="cursor-pointer px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50">
                      <span class="iconify inline mr-1" data-icon="mdi:folder-upload"></span> Subir
                      <input type="file" accept="image/*" @change="uploadStepImage($event, idx)" class="hidden">
                    </label>
                    <div class="flex items-center gap-1">
                      <span class="iconify text-gray-400" data-icon="mdi:clock-outline"></span>
                      <input v-model="step.time_estimate" type="number" placeholder="min"
                        class="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm">
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
                  <button type="button" @click="addUtensil"
                    class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Botones finales -->
            <div class="flex gap-4 justify-end">
              <button type="button" @click="cancel"
                class="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" :disabled="submitting"
                class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                {{ submitting ? 'Publicando...' : 'Publicar receta' }}
              </button>
            </div>
          </form>
        </div>
      </main>
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
  name: 'EditarRecetaView',
  components: { Sidebar, Header, Icon },
  data() {
    return {
      loading: true,
      recipeId: null,
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
        steps: [],
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
    clearImage() {
      this.form.image_url = '';
      this.form.image_preview = null;
    },
    handleImageError(event) {
      // Solo cambia la fuente de la imagen para la vista previa, NO la URL guardada
      event.target.src = this.defaultImage;
      this.toast('⚠️ La imagen no pudo cargarse, pero la URL se guardó correctamente');
    },
    async loadRecipe() {
      this.recipeId = this.$route.params.id
      this.loading = true

      try {
        // Cargar receta
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', this.recipeId)
          .single()

        if (error) throw error

        // Verificar permisos
        if (recipe.created_by !== this.authStore.user?.id && this.authStore.userRole !== 'admin') {
          this.toast('No tienes permiso para editar esta receta')
          this.$router.push(`/recetas/${this.recipeId}`)
          return
        }

        // Cargar ingredientes de la receta
        const { data: recipeIngredients } = await supabase
          .from('recipe_ingredients')
          .select('ingredient_id, quantity, unit, ingredient:ingredients(name, id)')
          .eq('recipe_id', this.recipeId)

        // Cargar todos los ingredientes disponibles
        await this.loadIngredients()

        // Cargar YouTube embed ID
        let youtubeEmbedId = null
        if (recipe.youtube_url) {
          const match = recipe.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          if (match) youtubeEmbedId = match[1]
        }

        this.form = {
          title: recipe.title,
          description: recipe.description,
          category: recipe.category,
          difficulty: recipe.difficulty,
          total_time: recipe.total_time,
          servings: recipe.servings,
          calories: recipe.calories_per_serving || '',
          image_url: recipe.image_url || '',
          image_preview: recipe.image_url || null,
          tags: recipe.tags || [],
          ingredients: recipeIngredients?.map(ri => ({
            id: ri.ingredient_id,
            name: ri.ingredient?.name,
            quantity: ri.quantity,
            unit: ri.unit
          })) || [],
          steps: recipe.steps || [],
          youtube_url: recipe.youtube_url || '',
          youtube_embed_id: youtubeEmbedId,
          youtube_preview: !!youtubeEmbedId,
          additional_notes: recipe.additional_notes || '',
          utensils_needed: recipe.utensils_needed || []
        }

      } catch (error) {
        console.error('Error cargando receta:', error)
        this.toast('Error al cargar la receta')
      } finally {
        this.loading = false
      }
    },
    async regenerateImage() {
      // Agregar un seed diferente para obtener una imagen distinta
      const newSeed = Date.now()
      if (this.form.image_url && this.form.image_url.includes('pollinations.ai')) {
        const newUrl = this.form.image_url.replace(/seed=\d+/, `seed=${newSeed}`)
        this.form.image_preview = newUrl
        this.form.image_url = newUrl
        this.toast('🔄 Imagen regenerada')
      } else {
        this.generateImageWithAI()
      }
    },
    // Función auxiliar para esperar (delay)
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    handleImagePreviewError(event) {
      console.warn('Error cargando imagen, intentando URL original');
      // Si falla el proxy, intentar con la URL original
      if (event.target.src !== this.form.image_url) {
        event.target.src = this.form.image_url;
      } else {
        // Si también falla, mostrar un placeholder
        event.target.src = this.defaultImage;
        this.toast('⚠️ La imagen no pudo cargarse, pero la URL se guardó correctamente');
      }
    },
    // Reemplaza el método generateImageWithAI con este:
    async generateImageWithAI() {
      try {
        this.toast('🎨 Generando imagen con IA...');

        if (!this.form.title) {
          this.toast('❌ Escribe el título primero');
          return;
        }

        // Generar un seed único
        const seed = Date.now();
        const prompt = `${this.form.title} comida dominicana plato tradicional`;
        const encodedPrompt = encodeURIComponent(prompt);

        // URL ORIGINAL (se guarda en la base de datos)
        const originalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true&seed=${seed}`;

        // URL con PROXY (solo para previsualización)
        // const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
        const proxiedUrl = originalUrl;
        console.log('📸 URL de imagen generada:', originalUrl);
        // Guardar la URL original en el campo image_url
        this.form.image_url = originalUrl;

        // Usar la URL con proxy para la previsualización
        this.form.image_preview = proxiedUrl;

        this.toast('✅ Imagen generada correctamente');

      } catch (error) {
        console.error('Error:', error);
        this.toast('❌ Error al generar imagen');
      }
    },

    // Modifica el método handleImageError para que maneje mejor los errores:
    handleImageError(event) {
      console.warn('Error cargando imagen de previsualización');
      // Si la imagen con proxy falla, intentar cargar la original
      if (event.target.src !== this.form.image_url && this.form.image_url) {
        event.target.src = this.form.image_url;
      } else {
        // Si también falla, mostrar placeholder
        event.target.src = this.defaultImage;
      }
    },

    // Modifica el método clearImage para limpiar ambos campos:
    clearImage() {
      this.form.image_url = '';
      this.form.image_preview = null;
      this.toast('🗑️ Imagen eliminada');
    },

    // Añade este método para regenerar la imagen con un nuevo seed:
    async regenerateImage() {
      if (this.form.image_url && this.form.image_url.includes('pollinations.ai')) {
        // Extraer el prompt de la URL actual
        const urlParams = new URLSearchParams(this.form.image_url.split('?')[1]);
        const oldPrompt = this.form.image_url.split('/prompt/')[1]?.split('?')[0];

        if (oldPrompt) {
          const newSeed = Date.now();
          const newOriginalUrl = `https://image.pollinations.ai/prompt/${oldPrompt}?width=768&height=768&nologo=true&seed=${newSeed}`;
          const newProxiedUrl = `https://corsproxy.io/?${encodeURIComponent(newOriginalUrl)}`;

          this.form.image_url = newOriginalUrl;
          this.form.image_preview = newProxiedUrl;
          this.toast('🔄 Imagen regenerada');
        } else {
          this.generateImageWithAI();
        }
      } else {
        this.generateImageWithAI();
      }
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
      this.form.steps.push({ step_number: this.form.steps.length + 1, description: '', image: '', time_estimate: 5 })
    },
    removeStep(idx) {
      this.form.steps.splice(idx, 1)
      // Re-number steps
      this.form.steps.forEach((step, i) => { step.step_number = i + 1 })
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
    uploadStepImage(event, stepIdx) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.steps[stepIdx].image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async updateRecipe() {
      console.log('📸 URL de imagen al guardar:', this.form.image_url);
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
        const steps = this.form.steps.map((step, idx) => ({
          step_number: idx + 1,
          description: step.description,
          image: step.image || null,
          time_estimate: step.time_estimate || 5
        }))

        const updateData = {
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
          youtube_url: this.form.youtube_url || null,
          additional_notes: this.form.additional_notes || null,
          utensils_needed: this.form.utensils_needed,
          updated_at: new Date()
        }

        const { error: updateError } = await supabase
          .from('recipes')
          .update(updateData)
          .eq('id', this.recipeId)

        if (updateError) throw updateError

        // Eliminar ingredientes existentes y volver a insertar
        await supabase.from('recipe_ingredients').delete().eq('recipe_id', this.recipeId)

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
            recipe_id: this.recipeId,
            ingredient_id: ingredientId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit
          })
        }

        this.toast('🎉 ¡Receta actualizada exitosamente!')
        setTimeout(() => this.$router.push(`/recetas/${this.recipeId}`), 1500)

      } catch (error) {
        console.error('Error:', error)
        this.toast('❌ Error al actualizar la receta')
      } finally {
        this.submitting = false
      }
    },
    cancel() {
      this.$router.push(`/recetas/${this.recipeId}`)
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
      this.loadRecipe()
    }
  }
}
</script>