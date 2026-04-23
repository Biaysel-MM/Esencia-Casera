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

          <div class="space-y-6">
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

              <!-- Imagen principal -->
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
                </div>
                <div v-if="form.image_preview" class="mt-3">
                  <img :src="form.image_preview" class="w-full h-48 object-cover rounded-xl border" />
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

            <!-- Ingredientes -->
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
                <p>No hay ingredientes agregados</p>
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
                      <option value="unidad">unidad</option>
                      <option value="gramos">gramos</option>
                      <option value="gramo">gramo</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="tazas">tazas</option>
                      <option value="taza">taza</option>
                      <option value="cucharadas">cucharadas</option>
                      <option value="cucharada">cucharada</option>
                      <option value="cucharaditas">cucharaditas</option>
                      <option value="cucharadita">cucharadita</option>
                      <option value="libra">libra</option>
                      <option value="Libras">Libras</option>
                      <option value="diente">diente</option>
                      <option value="dientes">dientes</option>
                      <option value="rama">rama</option>
                      <option value="ramas">ramas</option>
                      <option value="hoja">hoja</option>
                      <option value="hojas">hojas</option>
                    </select>
                  </div>
                  <button type="button" @click="removeIngredient(idx)" class="text-red-500 p-2 hover:text-red-700">
                    <span class="iconify w-5 h-5" data-icon="mdi:trash-can-outline"></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Pasos de preparación CON IMAGEN -->
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
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 space-y-2">
                  <textarea v-model="step.description" rows="2" placeholder="Describe el paso..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200"></textarea>

                  <!-- Campo para imagen del paso -->
                  <div class="flex flex-wrap gap-2">
                    <input v-model="step.image" placeholder="URL de imagen (opcional)"
                      class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <label
                      class="cursor-pointer px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50">
                      <span class="iconify inline mr-1" data-icon="mdi:folder-upload"></span>
                      Subir imagen
                      <input type="file" accept="image/*" @change="uploadStepImage($event, idx)" class="hidden">
                    </label>
                    <div class="flex items-center gap-1">
                      <span class="iconify text-gray-400" data-icon="mdi:clock-outline"></span>
                      <input v-model="step.time_estimate" type="number" placeholder="min"
                        class="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    </div>
                  </div>

                  <!-- Previsualización de la imagen del paso -->
                  <div v-if="step.image_preview" class="mt-2">
                    <img :src="step.image_preview" class="w-32 h-24 object-cover rounded-lg border" />
                    <button type="button" @click="clearStepImage(idx)" class="text-red-500 text-xs mt-1">Eliminar
                      imagen</button>
                  </div>
                  <div v-else-if="step.image && step.image.trim() !== ''" class="mt-2">
                    <img :src="step.image" class="w-32 h-24 object-cover rounded-lg border"
                      @error="handleStepImageError(idx)" />
                    <button type="button" @click="clearStepImage(idx)" class="text-red-500 text-xs mt-1">Eliminar
                      imagen</button>
                  </div>
                </div>
                <button type="button" @click="removeStep(idx)" class="text-red-500 p-2 hover:text-red-700">
                  <span class="iconify w-5 h-5" data-icon="mdi:trash-can-outline"></span>
                </button>
              </div>
            </div>

            <!-- Extras (opcional) -->
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
              <button type="button" @click="updateRecipe" :disabled="submitting"
                class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                {{ submitting ? 'Publicando...' : 'Publicar receta' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal de ingredientes -->
    <div v-if="showIngredientModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showIngredientModal = false">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden" @click.stop>
        <div class="p-5 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Buscar ingrediente</h3>
          <button @click="showIngredientModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-5">
          <div class="relative mb-4">
            <Icon icon="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" v-model="ingredientSearch" placeholder="Buscar ingrediente..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200">
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            <div v-for="ing in filteredIngredients" :key="ing.id" @click="selectIngredient(ing)"
              class="border rounded-xl p-3 cursor-pointer hover:border-emerald-600 hover:shadow-lg transition-all">
              <div class="font-medium text-sm text-center">{{ ing.name }}</div>
            </div>
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
        utensils_needed: [],
        loadingImage: false
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
    async loadRecipe() {
      this.recipeId = this.$route.params.id
      this.loading = true

      try {
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', this.recipeId)
          .single()

        if (error) throw error

        const { data: recipeIngredients } = await supabase
          .from('recipe_ingredients')
          .select('ingredient_id, quantity, unit, ingredient:ingredients(name, id)')
          .eq('recipe_id', this.recipeId)

        await this.loadIngredients()

        let youtubeEmbedId = null
        if (recipe.youtube_url) {
          const match = recipe.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          if (match) youtubeEmbedId = match[1]
        }

        // Procesar steps para añadir image_preview
        const stepsWithPreview = (recipe.steps || []).map(step => ({
          ...step,
          image_preview: step.image || null
        }))

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
          steps: stepsWithPreview,
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
    async loadIngredients() {
      const { data } = await supabase.from('ingredients').select('id, name').order('name')
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
      this.form.steps.push({
        description: '',
        image: null,
        image_preview: null,
        time_estimate: 5
      })
    },
    removeStep(idx) {
      this.form.steps.splice(idx, 1)
    },
    clearStepImage(idx) {
      this.form.steps[idx].image = null
      this.form.steps[idx].image_preview = null
      this.toast('🗑️ Imagen del paso eliminada')
    },
    handleStepImageError(idx) {
      console.warn('Error cargando imagen del paso')
      this.form.steps[idx].image_preview = null
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
          this.form.image_url = e.target.result
          this.form.image_preview = e.target.result
          this.toast('✅ Imagen cargada')
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
          this.form.steps[stepIdx].image_preview = e.target.result
          this.toast('✅ Imagen del paso cargada')
        }
        reader.readAsDataURL(file)
      }
    },
    async updateRecipe() {
      console.log('🚀 EJECUTANDO updateRecipe');

      if (!this.form.title || !this.form.description) {
        this.toast('❌ Completa los campos requeridos')
        return
      }

      this.submitting = true;
      this.toast('Guardando...');

      try {
        const steps = this.form.steps.map((step, idx) => ({
          step_number: idx + 1,
          description: step.description,
          image: step.image || null,
          time_estimate: step.time_estimate || 5
        }));

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
          updated_at: new Date().toISOString()
        };

        console.log('📤 Enviando:', updateData);

        const { error: updateError } = await supabase
          .from('recipes')
          .update(updateData)
          .eq('id', this.recipeId);

        if (updateError) throw updateError;

        // Actualizar ingredientes
        await supabase.from('recipe_ingredients').delete().eq('recipe_id', this.recipeId);

        for (const ing of this.form.ingredients) {
          let ingredientId = ing.id;
          if (!ingredientId) {
            const { data: existing } = await supabase
              .from('ingredients')
              .select('id')
              .ilike('name', ing.name)
              .limit(1);
            ingredientId = existing?.[0]?.id;
            if (!ingredientId) {
              const { data: newIng } = await supabase
                .from('ingredients')
                .insert({ name: ing.name })
                .select()
                .single();
              ingredientId = newIng.id;
            }
          }
          await supabase.from('recipe_ingredients').insert({
            recipe_id: this.recipeId,
            ingredient_id: ingredientId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit || 'unidades'
          });
        }

        this.toast('🎉 ¡Receta actualizada!');
        setTimeout(() => {
          this.$router.push(`/recetas/${this.recipeId}`); 
        }, 1000);

      } catch (error) {
        console.error('❌ Error:', error);
        this.toast('Error: ' + error.message);
      } finally {
        this.submitting = false;
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
  watch: {
    'form.image_url': {
      handler(newUrl) {
        if (newUrl && newUrl.trim() !== '') {
          this.form.image_preview = newUrl;
        } else {
          this.form.image_preview = null;
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.authStore.isAuthenticated) {
      this.loadRecipe()
    }
  }
}
</script>