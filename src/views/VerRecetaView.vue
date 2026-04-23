<!-- src/views/VerRecetaView.vue -->
<template>
  <div class="min-h-screen bg-[#F4F9F4]">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
        <!-- Botón volver atrás -->
        <div class="max-w-6xl mx-auto my-4 px-5 flex justify-end gap-4">
          <!-- Botón Editar (solo para el creador o admin) -->
          <button v-if="canEdit" @click="goToEdit"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white bg-[#4A8B5C] hover:bg-[#3D734D]">
            <Icon icon="mdi:pencil" class="text-xl" />
            <span>Editar</span>
          </button>
          <button @click="$router.back()"
            class="flex items-center gap-2 transition-colors bg-[#4A8B5C] text-white px-4 py-2 rounded-lg hover:bg-[#3D734D]">
            <Icon icon="mdi:arrow-left" class="text-xl" />
            <span>Volver</span>
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="receta" class="max-w-6xl mx-auto px-4 p-8 pt-0">
          <div class="rounded-2xl shadow-xl overflow-hidden bg-white">
            <!-- Imagen principal -->
            <div class="relative h-96 overflow-hidden">
              <img :src="receta.image_url || defaultImage" :alt="receta.title" class="w-full h-full object-cover"
                @error="handleImageError">
              <div class="absolute top-4 left-4">
                <span class="bg-[#4A8B5C] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {{ getCategoryLabel(receta.category) }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <button @click="toggleFavorite"
                  class="bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95">
                  <Icon v-if="receta.is_favorite" icon="mdi:cards-heart" class="text-2xl text-red-500" />
                  <Icon v-else icon="mdi:heart-outline"
                    class="text-2xl text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>

            <!-- Contenido -->
            <div class="p-6 md:p-8">
              <!-- Título y autor -->
              <div>
                <h1 class="text-3xl md:text-4xl font-bold mb-2 text-[#1E2A1E]">{{ receta.title }}</h1>
                <p class="text-lg text-[#5A6E5A] mb-4">{{ receta.description }}</p>

                <!-- Tarjeta del autor (Nuevo diseño) -->
                <div class="flex items-center gap-3 p-3 rounded-xl bg-[#E8F0E5] w-fit">
                  <img :src="receta.author_avatar || defaultAvatar"
                    class="w-12 h-12 rounded-full object-cover ring-2 ring-white" @error="handleAvatarError">
                  <div>
                    <p class="text-xs text-[#5A6E5A] uppercase tracking-wide">Creado por</p>
                    <p class="font-semibold text-[#1E2A1E]">{{ receta.author_name || authStore.userName || 'Chef Comunidad' }}</p>
                  </div>
                </div>
              </div>

              <!-- Métricas rápidas -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 py-4 border-y border-[#E2E8E2]">
                <div class="text-center">
                  <p class="text-2xl font-bold text-[#4A8B5C]">{{ receta.total_time }} min</p>
                  <p class="text-sm text-[#5A6E5A]">Tiempo total</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-[#4A8B5C]">{{ receta.servings }}</p>
                  <p class="text-sm text-[#5A6E5A]">Porciones</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-[#4A8B5C]">{{ receta.calories_per_serving || '--' }}</p>
                  <p class="text-sm text-[#5A6E5A]">Calorías</p>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="mdi:star" class="text-yellow-500 text-2xl" />
                    <p class="text-2xl font-bold text-[#4A8B5C]">{{ receta.rating || 'Nueva' }}</p>
                  </div>
                  <p class="text-sm text-[#5A6E5A]">Valoración</p>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mt-6">
                <span v-for="tag in receta.tags" :key="tag"
                  class="px-3 py-1 rounded-full text-sm bg-[#C5E0B4] text-[#1E2A1E]">
                  #{{ tag }}
                </span>
              </div>

              <!-- Grid de ingredientes y pasos -->
              <div class="grid md:grid-cols-2 gap-8 mt-8">
                <!-- Ingredientes -->
                <div class="overflow-y-auto max-h-96">
                  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 text-[#1E2A1E]">
                    <Icon icon="mdi:leaf" class="text-2xl text-[#4A8B5C]" />
                    Ingredientes
                    <span class="text-sm px-2 py-1 rounded text-white bg-[#7BA86A]">
                      {{ receta.available_ingredients }}/{{ receta.total_ingredients }} disponibles
                    </span>
                  </h2>
                  <div class="space-y-3">
                    <div v-for="(ingredient, idx) in receta.ingredients" :key="idx"
                      class="flex justify-between items-start p-3 rounded-lg bg-[#E8F0E5]">
                      <div>
                        <p class="font-medium text-[#1E2A1E]">{{ ingredient.name }}</p>
                      </div>
                      <p class="font-semibold text-[#4A8B5C]">
                        {{ ingredient.quantity }}
                        <span v-if="ingredient.unit && ingredient.unit !== ''">
                          {{ ingredient.unit }}
                        </span>
                        <span v-else>
                          unidades
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Pasos -->
                <div class="overflow-y-auto max-h-96">
                  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 text-[#1E2A1E]">
                    <Icon icon="mdi:pot-steam" class="text-2xl text-[#4A8B5C]" />
                    Preparación
                  </h2>
                  <div class="space-y-6">
                    <div v-for="(step, idx) in receta.steps" :key="idx" class="flex gap-4">
                      <div
                        class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-[#4A8B5C]">
                        {{ step.step_number || idx + 1 }}
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-700">{{ step.description }}</p>
                        <p class="text-sm mt-1 flex items-center gap-1 text-[#5A6E5A]">
                          <Icon icon="mdi:clock-outline" class="text-sm" />
                          {{ step.time_estimate || 5 }} min
                        </p>
                        <!-- ESTA ES LA PARTE DE LA IMAGEN DEL PASO -->
                        <img v-if="step.image" :src="step.image" class="mt-2 rounded-lg w-full h-40 object-cover"
                          @error="handleStepImageError">
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Utensilios -->
              <div v-if="receta.utensils_needed?.length" class="mt-8 p-4 rounded-xl bg-[#E8F0E5]">
                <h3 class="font-bold mb-2 flex items-center gap-2 text-[#1E2A1E]">
                  <Icon icon="mdi:silverware-fork-knife" class="text-xl text-[#4A8B5C]" />
                  Utensilios necesarios
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="utensil in receta.utensils_needed" :key="utensil"
                    class="px-3 py-1 rounded-full text-sm border bg-white text-[#1E2A1E] border-[#E2E8E2]">
                    {{ utensil }}
                  </span>
                </div>
              </div>

              <!-- Video de YouTube -->
              <div v-if="receta.youtube_embed_id" class="mt-8">
                <h3 class="font-bold mb-3 flex items-center gap-2 text-[#1E2A1E]">
                  <Icon icon="mdi:youtube" class="text-red-600 text-2xl" />
                  Video tutorial
                </h3>
                <div class="relative w-full rounded-xl overflow-hidden" style="aspect-ratio: 16/9;">
                  <iframe :src="`https://www.youtube.com/embed/${receta.youtube_embed_id}`" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen class="absolute top-0 left-0 w-full h-full rounded-xl"></iframe>
                </div>
              </div>

              <!-- Comentarios -->
              <div class="mt-8">
                <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <h3 class="text-2xl font-bold flex items-center gap-2 text-[#1E2A1E]">
                    <Icon icon="mdi:comment-multiple-outline" class="text-2xl text-[#4A8B5C]" />
                    Comentarios ({{ comments.length }})
                  </h3>
                  <button @click="showCommentForm = !showCommentForm"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-white bg-[#4A8B5C]">
                    <Icon icon="mdi:plus" />
                    Agregar comentario
                  </button>
                </div>

                <!-- Formulario de nuevo comentario -->
                <div v-if="showCommentForm" class="mb-6 p-4 rounded-xl bg-[#E8F0E5]">
                  <div class="mb-3">
                    <label class="block text-sm mb-1 text-[#1E2A1E]">Tu calificación</label>
                    <div class="flex gap-1">
                      <button v-for="star in 5" :key="star" @click="newCommentRating = star" type="button">
                        <Icon :icon="star <= newCommentRating ? 'mdi:star' : 'mdi:star-outline'"
                          class="text-2xl text-yellow-500" />
                      </button>
                    </div>
                  </div>
                  <textarea v-model="newCommentText" placeholder="Escribe tu comentario..." rows="3"
                    class="w-full p-3 rounded-lg border border-[#E2E8E2] focus:outline-none focus:ring-2 focus:ring-[#4A8B5C] resize-none bg-white text-[#1E2A1E]"></textarea>
                  <div class="flex justify-end gap-2 mt-3">
                    <button @click="showCommentForm = false"
                      class="px-4 py-2 rounded-lg border border-[#E2E8E2] bg-transparent text-[#1E2A1E] transition-colors">
                      Cancelar
                    </button>
                    <button @click="addComment" class="px-4 py-2 rounded-lg text-white transition-colors bg-[#4A8B5C]">
                      Publicar
                    </button>
                  </div>
                </div>

                <!-- Lista de comentarios -->
                <div class="space-y-6">
                  <div v-for="comment in comments" :key="comment.id" class="border-b pb-4 border-[#E2E8E2]">
                    <div class="flex items-start gap-3">
                      <img :src="comment.user_avatar || defaultAvatar" class="w-10 h-10 rounded-full object-cover"
                        @error="handleAvatarError">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold text-[#1E2A1E]">{{ comment.user_name || 'Usuario' }}</p>
                          <p class="text-sm text-[#5A6E5A]">{{ formatDate(comment.created_at) }}</p>
                          <div class="flex items-center gap-0.5">
                            <Icon v-for="star in 5" :key="star"
                              :icon="star <= comment.rating ? 'mdi:star' : 'mdi:star-outline'"
                              class="text-yellow-500 text-sm" />
                          </div>
                        </div>
                        <p class="mt-1 text-[#1E2A1E]">{{ comment.text }}</p>
                        <div class="flex items-center gap-4 mt-2">
                          <button @click="toggleLike(comment.id)"
                            class="flex items-center gap-1 text-sm transition-colors hover:text-red-500"
                            :class="comment.isLiked ? 'text-red-500' : 'text-[#5A6E5A]'">
                            <Icon :icon="comment.isLiked ? 'mdi:heart' : 'mdi:heart-outline'" />
                            {{ comment.likes }} likes
                          </button>
                          <button @click="toggleReplyForm(comment.id)"
                            class="flex items-center gap-1 text-sm transition-colors text-[#5A6E5A]">
                            <Icon icon="mdi:reply-outline" />
                            Responder
                          </button>
                        </div>

                        <!-- Formulario de respuesta -->
                        <div v-if="activeReplyId === comment.id" class="mt-3">
                          <textarea v-model="replyText" placeholder="Escribe tu respuesta..." rows="2"
                            class="w-full p-2 rounded-lg border border-[#E2E8E2] focus:outline-none focus:ring-2 focus:ring-[#4A8B5C] resize-none text-sm bg-white text-[#1E2A1E]"></textarea>
                          <div class="flex justify-end gap-2 mt-2">
                            <button @click="activeReplyId = null"
                              class="px-3 py-1 text-sm rounded-lg border border-[#E2E8E2] bg-transparent text-[#1E2A1E] transition-colors">
                              Cancelar
                            </button>
                            <button @click="addReply(comment.id)"
                              class="px-3 py-1 text-sm rounded-lg text-white transition-colors bg-[#4A8B5C]">
                              Responder
                            </button>
                          </div>
                        </div>

                        <!-- Respuestas existentes -->
                        <div v-if="comment.replies?.length" class="ml-8 mt-3 space-y-2">
                          <div v-for="(reply, ridx) in comment.replies" :key="ridx" class="p-3 rounded-lg bg-[#E8F0E5]">
                            <div class="flex items-center gap-2">
                              <p class="text-sm font-semibold text-[#1E2A1E]">{{ reply.user_name || 'Usuario' }}</p>
                              <p class="text-xs text-[#5A6E5A]">{{ formatDate(reply.created_at) }}</p>
                            </div>
                            <p class="text-sm mt-1 text-[#1E2A1E]">{{ reply.text }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <Icon icon="mdi:food-off" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900">Receta no encontrada</h3>
          <button @click="$router.push('/recetas')" class="mt-4 px-6 py-2 rounded-xl text-white bg-[#4A8B5C]">
            Volver a recetas
          </button>
        </div>
      </main>
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
  name: 'VerRecetaView',
  components: { Icon, Sidebar, Header },
  data() {
    return {
      loading: true,
      isMobileMenuOpen: false,
      showCommentForm: false,
      newCommentText: '',
      newCommentRating: 5,
      activeReplyId: null,
      replyText: '',
      receta: null,
      comments: [],
      showToast: false,
      toastMessage: '',
      defaultImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
      defaultAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    canEdit() {
      if (!this.receta) return false
      return this.receta.created_by === this.authStore.user?.id || this.authStore.userRole === 'admin'
    }
  },
  methods: {
    showNotification(message, type = 'success') {
      this.toastMessage = message
      this.showToast = true
      setTimeout(() => { this.showToast = false }, 3000)
    },
    getCategoryLabel(cat) {
      const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', postre: 'Postre', snack: 'Snack' }
      return labels[cat] || cat
    },
    goToEdit() {
      this.$router.push(`/recetas/editar/${this.receta.id}`)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    handleImageError(e) {
      e.target.src = this.defaultImage
    },
    handleAvatarError(e) {
      e.target.src = this.defaultAvatar
    },
    handleStepImageError(e) {
      e.target.src = this.defaultImage
    },
    async loadRecipe() {
      const id = this.$route.params.id
      if (!id) return

      this.loading = true

      try {
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (error) throw error

        if (!recipe) {
          this.receta = null
          return
        }

        // CORREGIDO: Asegurar que la unidad se trae correctamente
        const { data: ingredients } = await supabase
          .from('recipe_ingredients')
          .select(`quantity, unit, ingredient:ingredients(name)`)
          .eq('recipe_id', id)

        const { data: pantry } = await supabase
          .from('user_pantry')
          .select('ingredient_id')
          .eq('user_id', this.authStore.user?.id)

        const pantryIds = new Set(pantry?.map(p => p.ingredient_id) || [])

        const { data: recipeIngIds } = await supabase
          .from('recipe_ingredients')
          .select('ingredient_id')
          .eq('recipe_id', id)

        const total = recipeIngIds?.length || 0
        const available = recipeIngIds?.filter(ri => pantryIds.has(ri.ingredient_id)).length || 0

        const { data: fav } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', this.authStore.user?.id)
          .eq('recipe_id', id)
          .maybeSingle()

        // CORREGIDO: Asegurar que la unidad siempre tenga un valor
        this.receta = {
          ...recipe,
          steps: recipe.steps || [],
          tags: recipe.tags || [],
          utensils_needed: recipe.utensils_needed || [],
          ingredients: ingredients?.map(i => ({
            name: i.ingredient?.name,
            quantity: i.quantity,
            unit: i.unit || 'unidades'  // ← FALTA ESTA PARTE: si no hay unidad, pone "unidades"
          })) || [],
          youtube_embed_id: recipe.youtube_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || null,
          total_ingredients: total,
          available_ingredients: available,
          is_favorite: !!fav
        }

        await this.loadComments()

      } catch (error) {
        console.error('Error cargando receta:', error)
        this.receta = null
      } finally {
        this.loading = false
      }
    },
    async loadComments() {
      const recipeId = this.$route.params.id

      const { data: commentsData, error: commentsError } = await supabase
        .from('recipe_comments')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })

      if (commentsError) {
        console.error('Error cargando comentarios:', commentsError)
        return
      }

      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])]
      let userNames = {}
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        userNames = Object.fromEntries(profiles?.map(p => [p.id, p.full_name]) || [])
      }

      const commentsWithReplies = []
      for (const comment of commentsData || []) {
        const { data: replies } = await supabase
          .from('respuestas_de_comentarios')
          .select('*')
          .eq('comment_id', comment.id)
          .order('created_at', { ascending: true })

        const { data: like } = await supabase
          .from('me_gusta_de_los_comentarios')
          .select('id')
          .eq('comment_id', comment.id)
          .eq('user_id', this.authStore.user?.id)
          .maybeSingle()

        commentsWithReplies.push({
          ...comment,
          replies: replies || [],
          isLiked: !!like,
          user_name: userNames[comment.user_id] || 'Usuario',
          user_avatar: this.defaultAvatar
        })
      }

      this.comments = commentsWithReplies
    },
    async toggleFavorite() {
      if (!this.receta) return

      try {
        if (this.receta.is_favorite) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', this.authStore.user?.id)
            .eq('recipe_id', this.receta.id)
          this.receta.is_favorite = false
          this.showNotification('Eliminado de favoritos')
        } else {
          await supabase
            .from('favorites')
            .insert({ user_id: this.authStore.user?.id, recipe_id: this.receta.id })
          this.receta.is_favorite = true
          this.showNotification('Agregado a favoritos')
        }
      } catch (error) {
        console.error('Error:', error)
        this.showNotification('Error al actualizar favoritos', 'error')
      }
    },
    async toggleLike(commentId) {
      try {
        const comment = this.comments.find(c => c.id === commentId)

        if (comment.isLiked) {
          await supabase
            .from('me_gusta_de_los_comentarios')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', this.authStore.user?.id)
          comment.isLiked = false
          comment.likes--
        } else {
          await supabase
            .from('me_gusta_de_los_comentarios')
            .insert({ comment_id: commentId, user_id: this.authStore.user?.id })
          comment.isLiked = true
          comment.likes++
        }
      } catch (error) {
        console.error('Error:', error)
        this.showNotification('Error al dar like', 'error')
      }
    },
    toggleReplyForm(commentId) {
      this.activeReplyId = this.activeReplyId === commentId ? null : commentId
      this.replyText = ''
    },
    async addComment() {
      if (!this.newCommentText.trim()) {
        this.showNotification('Escribe un comentario', 'error')
        return
      }

      try {
        const { data, error } = await supabase
          .from('comentarios_de_la_receta')
          .insert({
            recipe_id: this.receta.id,
            user_id: this.authStore.user?.id,
            rating: this.newCommentRating,
            text: this.newCommentText
          })
          .select()
          .single()

        if (error) throw error

        await this.loadComments()

        this.newCommentText = ''
        this.newCommentRating = 5
        this.showCommentForm = false
        this.showNotification('Comentario publicado')

      } catch (error) {
        console.error('Error al publicar comentario:', error)
        this.showNotification('Error al publicar comentario', 'error')
      }
    },
    async addReply(commentId) {
      if (!this.replyText.trim()) {
        this.showNotification('Escribe una respuesta', 'error')
        return
      }

      try {
        const { error } = await supabase
          .from('respuestas_de_comentarios')
          .insert({
            comment_id: commentId,
            user_id: this.authStore.user?.id,
            text: this.replyText,
            user_name: this.authStore.userName
          })

        if (error) throw error

        await this.loadComments()

        this.replyText = ''
        this.activeReplyId = null
        this.showNotification('Respuesta publicada')

      } catch (error) {
        console.error('Error al responder:', error)
        this.showNotification('Error al responder', 'error')
      }
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
  // ESTO ES CLAVE: Recargar cuando el componente se monta o cuando la ruta cambia
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadRecipe()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.loadRecipe()
    next()
  }, watch: {
    'receta.steps': {
      deep: true,
      handler(steps) {
        console.log('Steps actualizados:', steps);
      }
    },
    '$route.params.id': {
      immediate: true,
      handler() {
        if (this.authStore.isAuthenticated) {
          this.loadRecipe();
        }
      }
    }
  },
  mounted() {
    this.loadRecipe()
  }
}
</script>