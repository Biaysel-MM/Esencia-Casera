<!-- src/views/VerRecetaView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <div class="md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />

      <main class="pt-17.5 p-6">
        <!-- Botón volver atrás -->
        <div class="max-w-6xl mx-auto my-4 px-5 flex justify-end">
          <button @click="$router.back()"
            class="flex items-center gap-2 transition-colors bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <Icon icon="mdi:arrow-left" class="text-xl" />
            <span>Volver</span>
          </button>
        </div>
        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="receta" class="max-w-6xl mx-auto px-4 pb-8">
          <div class="rounded-2xl shadow-xl overflow-hidden" style="background-color: var(--card)">
            <!-- Imagen principal -->
            <div class="relative h-96 overflow-hidden">
              <img :src="receta.image_url || defaultImage" :alt="receta.title" class="w-full h-full object-cover"
                @error="handleImageError">
              <div class="absolute top-4 left-4">
                <span class="text-white px-3 py-1 rounded-full text-sm font-semibold capitalize"
                  style="background-color: var(--primary)">
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
              <div class="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 class="text-3xl md:text-4xl font-bold mb-2" style="color: var(--foreground)">{{ receta.title }}
                  </h1>
                  <p class="text-lg" style="color: var(--muted-foreground)">{{ receta.description }}</p>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl" style="background-color: var(--muted)">
                  <img :src="receta.author_avatar || defaultAvatar" class="w-12 h-12 rounded-full object-cover"
                    @error="handleAvatarError">
                  <div>
                    <p class="font-semibold" style="color: var(--foreground)">{{ receta.author_name ||
                      authStore.userName || 'Chef Comunidad' }}</p>
                  </div>
                </div>
              </div>

              <!-- Métricas rápidas -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 py-4 border-y" style="border-color: var(--border)">
                <div class="text-center">
                  <p class="text-2xl font-bold" style="color: var(--primary)">{{ receta.total_time }} min</p>
                  <p class="text-sm" style="color: var(--muted-foreground)">Tiempo total</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold" style="color: var(--primary)">{{ receta.servings }}</p>
                  <p class="text-sm" style="color: var(--muted-foreground)">Porciones</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold" style="color: var(--primary)">{{ receta.calories_per_serving || '--' }}
                  </p>
                  <p class="text-sm" style="color: var(--muted-foreground)">Calorías</p>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="mdi:star" class="text-yellow-500 text-2xl" />
                    <p class="text-2xl font-bold" style="color: var(--primary)">{{ receta.rating || 'Nueva' }}</p>
                  </div>
                  <p class="text-sm" style="color: var(--muted-foreground)">Valoración</p>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mt-6">
                <span v-for="tag in receta.tags" :key="tag" class="px-3 py-1 rounded-full text-sm"
                  style="background-color: var(--accent); color: var(--accent-foreground)">
                  #{{ tag }}
                </span>
              </div>

              <!-- Grid de ingredientes y pasos -->
              <div class="grid md:grid-cols-2 gap-8 mt-8">
                <!-- Ingredientes -->
                <div class="overflow-y-auto max-h-96">
                  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--foreground)">
                    <Icon icon="mdi:leaf" class="text-2xl" style="color: var(--primary)" />
                    Ingredientes
                    <span class="text-sm px-2 py-1 rounded text-white" style="background-color: var(--secondary)">
                      {{ receta.available_ingredients }}/{{ receta.total_ingredients }} disponibles
                    </span>
                  </h2>
                  <div class="space-y-3">
                    <div v-for="(ingredient, idx) in receta.ingredients" :key="idx"
                      class="flex justify-between items-start p-3 rounded-lg" style="background-color: var(--muted)">
                      <div>
                        <p class="font-medium" style="color: var(--foreground)">{{ ingredient.name }}</p>
                      </div>
                      <p class="font-semibold" style="color: var(--primary)">
                        {{ ingredient.quantity }} {{ ingredient.unit }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Pasos -->
                <div class="overflow-y-auto max-h-96">
                  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--foreground)">
                    <Icon icon="mdi:pot-steam" class="text-2xl" style="color: var(--primary)" />
                    Preparación
                  </h2>
                  <div class="space-y-6">
                    <div v-for="(step, idx) in receta.steps" :key="idx" class="flex gap-4">
                      <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                        style="background-color: var(--primary)">
                        {{ step.step_number || idx + 1 }}
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-700">{{ step.description }}</p>
                        <p class="text-sm mt-1 flex items-center gap-1" style="color: var(--muted-foreground)">
                          <Icon icon="mdi:clock-outline" class="text-sm" />
                          {{ step.time_estimate || 5 }} min
                        </p>
                        <img v-if="step.image" :src="step.image" class="mt-2 rounded-lg w-full h-40 object-cover"
                          @error="handleStepImageError">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Utensilios -->
              <div v-if="receta.utensils_needed?.length" class="mt-8 p-4 rounded-xl"
                style="background-color: var(--muted)">
                <h3 class="font-bold mb-2 flex items-center gap-2" style="color: var(--foreground)">
                  <Icon icon="mdi:silverware-fork-knife" class="text-xl" style="color: var(--primary)" />
                  Utensilios necesarios
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="utensil in receta.utensils_needed" :key="utensil"
                    class="px-3 py-1 rounded-full text-sm border"
                    style="background-color: var(--card); color: var(--foreground); border-color: var(--border)">
                    {{ utensil }}
                  </span>
                </div>
              </div>

              <!-- Video de YouTube -->
              <div v-if="receta.youtube_embed_id" class="mt-8">
                <h3 class="font-bold mb-3 flex items-center gap-2" style="color: var(--foreground)">
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
                  <h3 class="text-2xl font-bold flex items-center gap-2" style="color: var(--foreground)">
                    <Icon icon="mdi:comment-multiple-outline" class="text-2xl" style="color: var(--primary)" />
                    Comentarios ({{ comments.length }})
                  </h3>
                  <button @click="showCommentForm = !showCommentForm"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-white"
                    style="background-color: var(--primary)">
                    <Icon icon="mdi:plus" />
                    Agregar comentario
                  </button>
                </div>

                <!-- Formulario de nuevo comentario -->
                <div v-if="showCommentForm" class="mb-6 p-4 rounded-xl" style="background-color: var(--muted)">
                  <div class="mb-3">
                    <label class="block text-sm mb-1" style="color: var(--foreground)">Tu calificación</label>
                    <div class="flex gap-1">
                      <button v-for="star in 5" :key="star" @click="newCommentRating = star" type="button">
                        <Icon :icon="star <= newCommentRating ? 'mdi:star' : 'mdi:star-outline'"
                          class="text-2xl text-yellow-500" />
                      </button>
                    </div>
                  </div>
                  <textarea v-model="newCommentText" placeholder="Escribe tu comentario..." rows="3"
                    class="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                    :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }"></textarea>
                  <div class="flex justify-end gap-2 mt-3">
                    <button @click="showCommentForm = false" class="px-4 py-2 rounded-lg border transition-colors"
                      :style="{ borderColor: 'var(--border)', backgroundColor: 'transparent', color: 'var(--foreground)' }">
                      Cancelar
                    </button>
                    <button @click="addComment" class="px-4 py-2 rounded-lg text-white transition-colors"
                      style="background-color: var(--primary)">
                      Publicar
                    </button>
                  </div>
                </div>

                <!-- Lista de comentarios -->
                <div class="space-y-6">
                  <div v-for="comment in comments" :key="comment.id" class="border-b pb-4"
                    :style="{ borderColor: 'var(--border)' }">
                    <div class="flex items-start gap-3">
                      <img :src="comment.user_avatar || defaultAvatar" class="w-10 h-10 rounded-full object-cover"
                        @error="handleAvatarError">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold" style="color: var(--foreground)">{{ comment.user_name || 'Usuario' }}
                          </p>
                          <p class="text-sm" style="color: var(--muted-foreground)">{{ formatDate(comment.created_at) }}
                          </p>
                          <div class="flex items-center gap-0.5">
                            <Icon v-for="star in 5" :key="star"
                              :icon="star <= comment.rating ? 'mdi:star' : 'mdi:star-outline'"
                              class="text-yellow-500 text-sm" />
                          </div>
                        </div>
                        <p class="mt-1" style="color: var(--foreground)">{{ comment.text }}</p>
                        <div class="flex items-center gap-4 mt-2">
                          <button @click="toggleLike(comment.id)"
                            class="flex items-center gap-1 text-sm transition-colors hover:text-red-500"
                            :class="comment.isLiked ? 'text-red-500' : ''"
                            :style="{ color: comment.isLiked ? '#d4183d' : 'var(--muted-foreground)' }">
                            <Icon :icon="comment.isLiked ? 'mdi:heart' : 'mdi:heart-outline'" />
                            {{ comment.likes }} likes
                          </button>
                          <button @click="toggleReplyForm(comment.id)"
                            class="flex items-center gap-1 text-sm transition-colors"
                            :style="{ color: 'var(--muted-foreground)' }">
                            <Icon icon="mdi:reply-outline" />
                            Responder
                          </button>
                        </div>

                        <!-- Formulario de respuesta -->
                        <div v-if="activeReplyId === comment.id" class="mt-3">
                          <textarea v-model="replyText" placeholder="Escribe tu respuesta..." rows="2"
                            class="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 resize-none text-sm"
                            :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }"></textarea>
                          <div class="flex justify-end gap-2 mt-2">
                            <button @click="activeReplyId = null"
                              class="px-3 py-1 text-sm rounded-lg border transition-colors"
                              :style="{ borderColor: 'var(--border)', backgroundColor: 'transparent', color: 'var(--foreground)' }">
                              Cancelar
                            </button>
                            <button @click="addReply(comment.id)"
                              class="px-3 py-1 text-sm rounded-lg text-white transition-colors"
                              style="background-color: var(--primary)">
                              Responder
                            </button>
                          </div>
                        </div>

                        <!-- Respuestas existentes -->
                        <div v-if="comment.replies?.length" class="ml-8 mt-3 space-y-2">
                          <div v-for="(reply, ridx) in comment.replies" :key="ridx" class="p-3 rounded-lg"
                            style="background-color: var(--muted)">
                            <div class="flex items-center gap-2">
                              <p class="text-sm font-semibold" style="color: var(--foreground)">{{ reply.user_name ||
                                'Usuario' }}</p>
                              <p class="text-xs" style="color: var(--muted-foreground)">{{ formatDate(reply.created_at)
                              }}</p>
                            </div>
                            <p class="text-sm mt-1" style="color: var(--foreground)">{{ reply.text }}</p>
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
          <button @click="$router.push('/recetas')" class="mt-4 px-6 py-2 rounded-xl text-white"
            style="background-color: var(--primary)">
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
      this.loading = true

      try {
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

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

        this.receta = {
          ...recipe,
          steps: recipe.steps || [],
          tags: recipe.tags || [],
          utensils_needed: recipe.utensils_needed || [],
          ingredients: ingredients?.map(i => ({
            name: i.ingredient?.name,
            quantity: i.quantity,
            unit: i.unit
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

      // Obtener nombres de usuario de profiles
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
          .from('comment_replies')
          .select('*')
          .eq('comment_id', comment.id)
          .order('created_at', { ascending: true })

        const { data: like } = await supabase
          .from('comment_likes')
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
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', this.authStore.user?.id)
          comment.isLiked = false
          comment.likes--
        } else {
          await supabase
            .from('comment_likes')
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
          .from('recipe_comments')
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
          .from('comment_replies')
          .insert({
            comment_id: commentId,
            user_id: this.authStore.user?.id,
            text: this.replyText,
            user_name: this.authStore.userName  // ← AGREGAR ESTO
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
  mounted() {
    if (this.authStore.isAuthenticated) {
      this.loadRecipe()
    }
  }
}
</script>