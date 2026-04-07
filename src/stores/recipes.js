// src/stores/recipes.js - VERSIÓN COMPLETA CORREGIDA

import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import * as spoonacular from '@/services/spoonacular'
import { getStepText } from '@/services/translations'

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    allRecipes: [],
    localRecipes: [],
    externalRecipes: [],
    loading: {
      local: false,
      external: false,
      combined: false
    },
    error: null,
    searchCache: new Map()
  }),

  getters: {
    getAllRecipes: (state) => state.allRecipes,
    getLocalRecipes: (state) => state.localRecipes,
    getExternalRecipes: (state) => state.externalRecipes,
    isExternalRecipe: (state) => (recipeId) => {
      return recipeId?.toString().startsWith('spoon_')
    }
  },

  actions: {
    async loadAllRecipes() {
      this.loading.combined = true
      this.error = null

      try {
        await this.loadLocalRecipes()
        await this.loadPopularExternalRecipes()
        this.combineRecipes()
      } catch (error) {
        console.error('Error cargando recetas:', error)
        this.error = error.message
      } finally {
        this.loading.combined = false
      }
    },

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

    async loadLocalRecipes() {
      this.loading.local = true

      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.localRecipes = (data || []).map(recipe => {
          let steps = recipe.steps
          if (typeof steps === 'string') {
            try { steps = JSON.parse(steps) } catch { steps = [steps] }
          }
          if (Array.isArray(steps)) {
            steps = steps.map(s => getStepText(s))
          }
          
          return {
            ...recipe,
            steps: steps || [],
            tags: recipe.tags || [],
            isExternal: false,
            source: 'local'
          }
        })
      } catch (error) {
        console.error('Error cargando recetas locales:', error)
        this.error = error.message
      } finally {
        this.loading.local = false
      }
    },

    async loadPopularExternalRecipes() {
      this.loading.external = true

      try {
        const cached = this.getCachedExternalRecipes()
        if (cached && cached.length > 0) {
          this.externalRecipes = cached
          return
        }

        const randomRecipes = await spoonacular.getRandomRecipes(10)
        this.externalRecipes = randomRecipes.map(recipe => ({
          ...recipe,
          isExternal: true,
          source: 'spoonacular'
        }))
        this.saveCachedExternalRecipes(this.externalRecipes)
      } catch (error) {
        console.error('Error cargando recetas externas:', error)
      } finally {
        this.loading.external = false
      }
    },

    async searchRecipes(query, limit = 20) {
      this.loading.combined = true

      try {
        const localResults = this.localRecipes.filter(recipe =>
          recipe.title?.toLowerCase().includes(query.toLowerCase()) ||
          recipe.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )

        let externalResults = []
        try {
          externalResults = await spoonacular.searchRecipes(query, limit - localResults.length)
          externalResults = externalResults.map(r => ({ ...r, isExternal: true, source: 'spoonacular' }))
        } catch (error) {
          console.warn('Error en búsqueda externa:', error)
        }

        const combined = [...localResults, ...externalResults]
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

    async getRecipesByCategory(category, limit = 12) {
      const localResults = this.localRecipes.filter(recipe => recipe.category === category)
      let externalResults = []
      try {
        externalResults = await spoonacular.getRecipesByCategory(category, limit - localResults.length)
        externalResults = externalResults.map(r => ({ ...r, isExternal: true, source: 'spoonacular' }))
      } catch (error) {
        console.warn('Error obteniendo recetas externas por categoría:', error)
      }
      return [...localResults, ...externalResults]
    },

    async getRecipeDetails(recipeId) {
      if (recipeId.toString().startsWith('spoon_')) {
        const cached = this.externalRecipes.find(r => r.id === recipeId)
        if (cached) return cached

        const details = await spoonacular.getRecipeDetails(recipeId)
        if (details) {
          this.externalRecipes.push({ ...details, isExternal: true, source: 'spoonacular' })
          this.saveCachedExternalRecipes(this.externalRecipes)
        }
        return details
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (error) throw error
      
      let steps = data.steps
      if (typeof steps === 'string') {
        try { steps = JSON.parse(steps) } catch { steps = [steps] }
      }
      if (Array.isArray(steps)) {
        steps = steps.map(s => getStepText(s))
      }
      
      return { ...data, steps: steps || [], isExternal: false, source: 'local' }
    },

    combineRecipes() {
      this.allRecipes = [...this.localRecipes, ...this.externalRecipes]
    },

    getCachedExternalRecipes() {
      try {
        const cached = localStorage.getItem('spoonacular_recipes_cache')
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < 86400000) {
            return data
          }
        }
      } catch (error) {
        console.error('Error leyendo cache:', error)
      }
      return null
    },

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

    clearCache() {
      this.searchCache.clear()
      localStorage.removeItem('spoonacular_recipes_cache')
      this.externalRecipes = []
      this.combineRecipes()
    },

    resetSpoonacularPoints() {
      spoonacular.resetPointsCounter()
    }
  }
})