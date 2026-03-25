// src/stores/recipes.js

import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import * as spoonacular from '@/services/spoonacular'

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    // Todas las recetas (locales + externas)
    allRecipes: [],

    // Recetas locales de Supabase
    localRecipes: [],

    // Recetas externas de Spoonacular
    externalRecipes: [],

    // Estado de carga
    loading: {
      local: false,
      external: false,
      combined: false
    },

    // Error
    error: null,

    // Cache de búsquedas
    searchCache: new Map()
  }),

  getters: {
    /**
     * Obtiene todas las recetas combinadas
     */
    getAllRecipes: (state) => state.allRecipes,

    /**
     * Obtiene solo recetas locales
     */
    getLocalRecipes: (state) => state.localRecipes,

    /**
     * Obtiene solo recetas externas
     */
    getExternalRecipes: (state) => state.externalRecipes,

    /**
     * Verifica si una receta es externa
     */
    isExternalRecipe: (state) => (recipeId) => {
      return recipeId?.toString().startsWith('spoon_')
    }
  },

  actions: {
    /**
     * Carga todas las recetas (locales + externas populares)
     */
    async loadAllRecipes() {
      this.loading.combined = true
      this.error = null

      try {
        // Cargar recetas locales primero
        await this.loadLocalRecipes()

        // Cargar recetas externas populares
        await this.loadPopularExternalRecipes()

        // Combinar
        this.combineRecipes()

      } catch (error) {
        console.error('Error cargando recetas:', error)
        this.error = error.message
      } finally {
        this.loading.combined = false
      }
    },
    // Añadir después de los métodos existentes
    async loadExternalRecipesPaginated(offset, limit) {
      this.loading.external = true
      try {
        const randomRecipes = await spoonacular.getRandomRecipes(limit)
        this.externalRecipes = randomRecipes.map(recipe => ({
          ...recipe,
          isExternal: true,
          source: 'spoonacular'
        }))
        return this.externalRecipes
      } catch (error) {
        console.error('Error cargando recetas externas:', error)
        return []
      } finally {
        this.loading.external = false
      }
    },

    /**
     * Carga recetas locales de Supabase
     */
    async loadLocalRecipes() {
      this.loading.local = true

      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Añadir flag para identificar recetas locales
        this.localRecipes = (data || []).map(recipe => ({
          ...recipe,
          isExternal: false,
          source: 'local'
        }))

      } catch (error) {
        console.error('Error cargando recetas locales:', error)
        this.error = error.message
      } finally {
        this.loading.local = false
      }
    },

    /**
     * Carga recetas populares externas (cacheadas)
     */
    async loadPopularExternalRecipes() {
      this.loading.external = true

      try {
        // Intentar cargar desde cache local primero
        const cached = this.getCachedExternalRecipes()
        if (cached && cached.length > 0) {
          this.externalRecipes = cached
          return
        }

        // Si no hay cache, buscar aleatorias
        const randomRecipes = await spoonacular.getRandomRecipes(10)

        this.externalRecipes = randomRecipes.map(recipe => ({
          ...recipe,
          isExternal: true,
          source: 'spoonacular'
        }))

        // Guardar en cache
        this.saveCachedExternalRecipes(this.externalRecipes)

      } catch (error) {
        console.error('Error cargando recetas externas:', error)
        // No fallamos si falla externo, solo continuamos con locales
      } finally {
        this.loading.external = false
      }
    },

    /**
     * Busca recetas por nombre (locales + externas)
     */
    async searchRecipes(query, limit = 20) {
      this.loading.combined = true

      try {
        // 1. Buscar en recetas locales primero
        const localResults = this.localRecipes.filter(recipe =>
          recipe.title?.toLowerCase().includes(query.toLowerCase()) ||
          recipe.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )

        // 2. Buscar en Spoonacular
        let externalResults = []
        try {
          externalResults = await spoonacular.searchRecipes(query, limit - localResults.length)
          externalResults = externalResults.map(r => ({ ...r, isExternal: true, source: 'spoonacular' }))
        } catch (error) {
          console.warn('Error en búsqueda externa:', error)
        }

        // 3. Combinar resultados
        const combined = [...localResults, ...externalResults]

        // 4. Guardar en cache de búsqueda
        const cacheKey = `search_${query}`
        this.searchCache.set(cacheKey, combined)

        return combined

      } catch (error) {
        console.error('Error en búsqueda:', error)
        return []
      } finally {
        this.loading.combined = false
      }
    },

    /**
     * Busca recetas por ingredientes disponibles
     */
    async searchByAvailableIngredients(ingredients, limit = 20) {
      if (!ingredients || ingredients.length === 0) return []

      this.loading.external = true

      try {
        const results = await spoonacular.searchRecipesByIngredients(ingredients, limit)
        return results.map(r => ({ ...r, isExternal: true, source: 'spoonacular' }))
      } catch (error) {
        console.error('Error en búsqueda por ingredientes:', error)
        return []
      } finally {
        this.loading.external = false
      }
    },

    /**
     * Busca recetas por categoría
     */
    async getRecipesByCategory(category, limit = 12) {
      // Filtrar locales primero
      const localResults = this.localRecipes.filter(recipe =>
        recipe.category === category
      )

      // Buscar externas
      let externalResults = []
      try {
        externalResults = await spoonacular.getRecipesByCategory(category, limit - localResults.length)
        externalResults = externalResults.map(r => ({ ...r, isExternal: true, source: 'spoonacular' }))
      } catch (error) {
        console.warn('Error obteniendo recetas externas por categoría:', error)
      }

      return [...localResults, ...externalResults]
    },

    /**
     * Obtiene detalles de una receta (local o externa)
     */
    async getRecipeDetails(recipeId) {
      // Verificar si es externa (empieza con 'spoon_')
      if (recipeId.toString().startsWith('spoon_')) {
        // Buscar en cache local primero
        const cached = this.externalRecipes.find(r => r.id === recipeId)
        if (cached) return cached

        // Si no está en cache, buscar en API
        const details = await spoonacular.getRecipeDetails(recipeId)
        if (details) {
          // Guardar en cache
          this.externalRecipes.push({ ...details, isExternal: true, source: 'spoonacular' })
          this.saveCachedExternalRecipes(this.externalRecipes)
        }
        return details
      }

      // Es receta local, buscar en Supabase
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (error) throw error
      return { ...data, isExternal: false, source: 'local' }
    },

    /**
     * Combina recetas locales y externas
     */
    combineRecipes() {
      this.allRecipes = [...this.localRecipes, ...this.externalRecipes]
    },

    /**
     * Obtiene cache de recetas externas desde localStorage
     */
    getCachedExternalRecipes() {
      try {
        const cached = localStorage.getItem('spoonacular_recipes_cache')
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          // Cache válido por 24 horas
          if (Date.now() - timestamp < 86400000) {
            return data
          }
        }
      } catch (error) {
        console.error('Error leyendo cache:', error)
      }
      return null
    },

    /**
     * Guarda cache de recetas externas en localStorage
     */
    saveCachedExternalRecipes(recipes) {
      try {
        localStorage.setItem('spoonacular_recipes_cache', JSON.stringify({
          data: recipes,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error guardando cache:', error)
      }
    },

    /**
     * Limpia todo el cache
     */
    clearCache() {
      this.searchCache.clear()
      localStorage.removeItem('spoonacular_recipes_cache')
      this.externalRecipes = []
      this.combineRecipes()
    },

    /**
     * Resetea el contador de puntos de Spoonacular
     */
    resetSpoonacularPoints() {
      spoonacular.resetPointsCounter()
    }
  }
})