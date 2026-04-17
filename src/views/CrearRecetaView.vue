<!-- src/views/CrearRecetaView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
        <!-- Botón volver atrás -->
        <div class="max-w-5xl mx-auto my-4 flex justify-end">
          <button @click="$router.back()"
            class="flex items-center gap-2 transition-colors bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <Icon icon="mdi:arrow-left" class="text-xl" />
            <span>Volver</span>
          </button>
        </div>
        <div class="max-w-5xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Icon icon="mdi:plus-circle" class="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Crear Nueva Receta</h1>
              <p class="text-sm text-gray-500">Comparte tu receta dominicana con la comunidad</p>
            </div>
          </div>

          <form @submit.prevent="submitRecipe" class="space-y-6">
            <!-- Información básica -->
            <div class="bg-white rounded-xl border p-6 space-y-5">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <Icon icon="mdi:information" class="w-5 h-5 text-emerald-600" />
                Información básica
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium mb-1">Título de la receta *</label>
                  <input v-model="form.title" type="text" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Categoría *</label>
                  <select v-model="form.category" class="w-full px-4 py-3 rounded-xl border border-gray-200">
                    <option value="desayuno">Desayuno</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                    <option value="postre">Postre</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Descripción breve *</label>
                <textarea v-model="form.description" rows="3" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"></textarea>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Dificultad</label>
                  <select v-model="form.difficulty" class="w-full px-4 py-3 rounded-xl border border-gray-200">
                    <option value="fácil">Fácil</option>
                    <option value="medio">Medio</option>
                    <option value="difícil">Difícil</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Tiempo total (min) *</label>
                  <input v-model="form.total_time" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Porciones *</label>
                  <input v-model="form.servings" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Calorías por porción</label>
                  <input v-model="form.calories" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200">
                </div>
              </div>

              <!-- Imagen principal con previsualización -->
              <div>
                <label class="block text-sm font-medium mb-1">Imagen principal</label>
                <div class="flex flex-wrap gap-3">
                  <input v-model="form.image_url" type="text" placeholder="https://..."
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200">
                  <label class="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                    <Icon icon="mdi:folder-upload" class="inline mr-2" />
                    Subir archivo
                    <input type="file" accept="image/*" @change="uploadImage" class="hidden">
                  </label>
                  <button type="button" @click="generateImageWithAI" 
                    class="px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                    <Icon icon="mdi:robot" class="inline mr-2" />
                    Generar con IA
                  </button>
                </div>
                
                <!-- Previsualización -->
                <div v-if="form.image_preview" class="mt-3">
                  <img :src="form.image_preview" class="w-40 h-40 object-cover rounded-xl border">
                  <button type="button" @click="form.image_preview = null; form.image_url = ''" class="text-red-500 text-sm mt-1">Eliminar</button>
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium mb-1">Etiquetas</label>
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
                  <button type="button" @click="addTag" class="px-4 py-2 rounded-xl bg-gray-100">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Ingredientes con búsqueda como en HomeView -->
            <div class="bg-white rounded-xl border p-6 space-y-5">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                  <Icon icon="mdi:food-apple" class="w-5 h-5 text-emerald-600" />
                  Ingredientes
                </h2>
                <button type="button" @click="openIngredientModal" 
                  class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm">
                  <Icon icon="mdi:plus" class="inline mr-1" /> Buscar ingrediente
                </button>
              </div>

              <div v-for="(ing, idx) in form.ingredients" :key="idx" class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                <div class="flex-1">
                  <p class="font-medium">{{ ing.name }}</p>
                </div>
                <div class="w-24">
                  <input v-model="ing.quantity" type="number" placeholder="Cantidad" class="w-full px-3 py-2 rounded-lg border">
                </div>
                <div class="w-28">
                  <select v-model="ing.unit" class="w-full px-3 py-2 rounded-lg border">
                    <option value="unidades">unidades</option>
                    <option value="gramos">gramos</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="tazas">tazas</option>
                    <option value="cucharadas">cucharadas</option>
                    <option value="cucharaditas">cucharaditas</option>
                  </select>
                </div>
                <button type="button" @click="removeIngredient(idx)" class="text-red-500 p-2">
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
            </div>

            <!-- Pasos de preparación -->
            <div class="bg-white rounded-xl border p-6 space-y-5">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                  <Icon icon="mdi:format-list-numbered" class="w-5 h-5 text-emerald-600" />
                  Pasos de preparación
                </h2>
                <button type="button" @click="addStep" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm">
                  <Icon icon="mdi:plus" class="inline mr-1" /> Agregar paso
                </button>
              </div>

              <div v-for="(step, idx) in form.steps" :key="idx" class="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">{{ idx + 1 }}</div>
                <div class="flex-1">
                  <textarea v-model="step.description" rows="2" placeholder="Describe el paso..."
                    class="w-full px-3 py-2 rounded-lg border"></textarea>
                  <div class="flex gap-2 mt-2">
                    <input v-model="step.image" placeholder="URL de imagen (opcional)" class="flex-1 px-3 py-2 rounded-lg border text-sm">
                    <label class="cursor-pointer px-3 py-2 rounded-lg border text-sm bg-white">
                      Subir
                      <input type="file" accept="image/*" @change="uploadStepImage($event, idx)" class="hidden">
                    </label>
                    <input v-model="step.time_estimate" type="number" placeholder="min" class="w-20 px-3 py-2 rounded-lg border text-sm">
                  </div>
                  <div v-if="step.image_preview" class="mt-2">
                    <img :src="step.image_preview" class="w-32 h-24 object-cover rounded-lg">
                  </div>
                </div>
                <button type="button" @click="removeStep(idx)" class="text-red-500 p-2">
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
            </div>

            <!-- Video y extras -->
            <div class="bg-white rounded-xl border p-6 space-y-5">
              <h2 class="text-lg font-semibold">Extras (opcional)</h2>
              
              <div>
                <label class="block text-sm font-medium mb-1">URL de YouTube</label>
                <input v-model="form.youtube_url" placeholder="https://youtube.com/watch?v=..." 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200">
                <div v-if="form.youtube_preview" class="mt-2 text-sm text-emerald-600">
                  ✅ ID del video: {{ form.youtube_embed_id }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Notas adicionales</label>
                <textarea v-model="form.additional_notes" rows="3" placeholder="Consejos, variaciones, sustituciones..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Utensilios necesarios</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="utensil in form.utensils_needed" :key="utensil"
                    class="px-3 py-1 rounded-full text-sm bg-gray-100 flex items-center gap-1">
                    {{ utensil }}
                    <button type="button" @click="removeUtensil(utensil)" class="hover:text-red-500">×</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="newUtensil" @keyup.enter="addUtensil" placeholder="Ej: olla, sartén, cuchillo"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200">
                  <button type="button" @click="addUtensil" class="px-4 py-2 rounded-xl bg-gray-100">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Botones finales -->
            <div class="flex gap-4 justify-end">
              <button type="button" @click="cancel" class="px-6 py-3 rounded-xl border border-gray-300">Cancelar</button>
              <button type="submit" :disabled="submitting"
                class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                {{ submitting ? 'Publicando...' : 'Publicar receta' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>

    <!-- Modal de búsqueda de ingredientes -->
    <div v-if="showIngredientModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showIngredientModal = false">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" @click.stop>
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold">Buscar ingrediente</h3>
          <button @click="showIngredientModal = false" class="text-gray-500">&times;</button>
        </div>
        <div class="p-4">
          <input type="text" v-model="ingredientSearch" placeholder="Buscar..."
            class="w-full px-4 py-2 rounded-xl border border-gray-200 mb-4">
          <div class="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            <div v-for="ing in filteredIngredients" :key="ing.id"
              @click="selectIngredient(ing)"
              class="p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
              {{ ing.name }}
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
import { Icon } from '@iconify/vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

export default {
  name: 'CrearRecetaView',
  components: { Icon, Sidebar, Header },
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
      const { data } = await supabase.from('ingredients').select('id, name').order('name')
      this.allIngredients = data || []
    },
    openIngredientModal() {
      this.ingredientSearch = ''
      this.showIngredientModal = true
    },
    selectIngredient(ing) {
      this.form.ingredients.push({
        id: ing.id,
        name: ing.name,
        quantity: 1,
        unit: 'unidades'
      })
      this.showIngredientModal = false
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
      this.toast('Imagen de prueba generada')
    },
    async submitRecipe() {
      if (!this.form.title || !this.form.description || !this.form.total_time || !this.form.servings) {
        this.toast('Completa los campos requeridos')
        return
      }

      if (this.form.ingredients.length === 0) {
        this.toast('Agrega al menos un ingrediente')
        return
      }

      this.submitting = true

      try {
        // Extraer YouTube ID
        let youtubeEmbedId = null
        if (this.form.youtube_url) {
          const match = this.form.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          if (match) {
            youtubeEmbedId = match[1]
            this.form.youtube_embed_id = youtubeEmbedId
            this.form.youtube_preview = true
          }
        }

        // Preparar pasos
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

        // Insertar ingredientes
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

        this.toast('¡Receta publicada exitosamente!')
        setTimeout(() => this.$router.push('/recetas'), 1500)

      } catch (error) {
        console.error('Error:', error)
        this.toast('Error al publicar la receta')
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