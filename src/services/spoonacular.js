// src/services/spoonacular.js - VERSIÓN COMPLETA CORREGIDA

import { translateIngredient, translateTag, translateInstructions, translateTitle } from './translations'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const BASE_URL = 'https://api.spoonacular.com'

// Cache en memoria para evitar llamadas repetidas
const memoryCache = new Map()

// Contador de puntos usados hoy
let pointsUsedToday = 0

const canMakeRequest = (estimatedPoints = 1) => {
  return (pointsUsedToday + estimatedPoints) <= 150
}

const recordPoints = (points) => {
  pointsUsedToday += points
  console.log(`📊 Spoonacular: ${pointsUsedToday}/150 puntos usados hoy`)
}

const mapDishTypeToCategory = (dishTypes = []) => {
  if (dishTypes.includes('breakfast')) return 'desayuno'
  if (dishTypes.includes('lunch') || dishTypes.includes('main course')) return 'almuerzo'
  if (dishTypes.includes('dinner')) return 'cena'
  return 'almuerzo'
}

const parseInstructions = (analyzedInstructions = []) => {
  if (!analyzedInstructions.length) return []
  const steps = []
  for (const instruction of analyzedInstructions) {
    for (const step of instruction.steps || []) {
      steps.push(step.step)
    }
  }
  return steps
}

// Transformación ASYNC con traducción
const transformSpoonacularRecipe = async (recipe) => {
  // Transformar ingredientes con formato mejorado
  const ingredientsPromises = (recipe.extendedIngredients || []).map(async ing => {
    const translated = await translateIngredient({
      name: ing.name,
      quantity: ing.amount,
      unit: ing.unit
    })
    
    return {
      id: ing.id,
      name: translated.name,
      original: ing.original,
      quantity: translated.quantity !== null ? translated.quantity : ing.amount,
      unit: translated.unit || ing.unit,
      image: ing.image
    }
  })
  const ingredients = await Promise.all(ingredientsPromises)
  
  // Transformar tags
  const tagsPromises = (recipe.dishTypes || []).map(async tag => await translateTag(tag))
  let tags = await Promise.all(tagsPromises)
  
  // Dietas como tags
  const dietPromises = []
  if (recipe.vegetarian) dietPromises.push(translateTag('vegetarian'))
  if (recipe.vegan) dietPromises.push(translateTag('vegan'))
  if (recipe.glutenFree) dietPromises.push(translateTag('gluten free'))
  if (recipe.dairyFree) dietPromises.push(translateTag('dairy free'))
  if (recipe.veryHealthy) dietPromises.push(translateTag('healthy'))
  if (recipe.cheap) dietPromises.push(translateTag('cheap'))
  
  const dietTags = await Promise.all(dietPromises)
  tags = [...tags, ...dietTags]
  const uniqueTags = [...new Set(tags.filter(t => t && t !== ''))]

  // Instrucciones
  const stepsPromises = parseInstructions(recipe.analyzedInstructions).map(async step => 
    await translateInstructions(step)
  )
  const steps = await Promise.all(stepsPromises)

  return {
    id: `spoon_${recipe.id}`,
    spoonacular_id: recipe.id,
    title: await translateTitle(recipe.title),
    description: recipe.summary?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
    image_url: recipe.image,
    total_time: recipe.readyInMinutes || null,
    servings: recipe.servings || null,
    category: mapDishTypeToCategory(recipe.dishTypes),
    tags: uniqueTags,
    steps: steps,
    ingredients: ingredients,
    isExternal: true,
    source: 'spoonacular',
    calories_per_serving: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || null,
    rating: recipe.spoonacularScore ? Math.round(recipe.spoonacularScore / 20) : null,
    vegetarian: recipe.vegetarian || false,
    vegan: recipe.vegan || false,
    glutenFree: recipe.glutenFree || false,
    dairyFree: recipe.dairyFree || false,
    veryHealthy: recipe.veryHealthy || false,
    cheap: recipe.cheap || false,
    veryPopular: recipe.veryPopular || false,
    sustainable: recipe.sustainable || false,
    instructions: recipe.instructions ? await translateInstructions(recipe.instructions) : null,
    sourceUrl: recipe.sourceUrl || null
  }
}

// FUNCIONES EXPORTADAS
export const getRandomRecipes = async (number = 10) => {
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `random_${number}`
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/random?number=${number}&apiKey=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipesPromises = data.recipes.map(transformSpoonacularRecipe)
    const transformedRecipes = await Promise.all(transformedRecipesPromises)
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
  } catch (error) {
    console.error('Error en getRandomRecipes:', error)
    return []
  }
}

export const searchRecipes = async (query, number = 12) => {
  if (!query || query.trim() === '') return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `search_${query.toLowerCase().trim()}_${number}`
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  try {
    const encodedQuery = encodeURIComponent(query)
    const url = `${BASE_URL}/recipes/complexSearch?query=${encodedQuery}&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipesPromises = (data.results || []).map(transformSpoonacularRecipe)
    const transformedRecipes = await Promise.all(transformedRecipesPromises)
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
  } catch (error) {
    console.error('Error en searchRecipes:', error)
    return []
  }
}

export const searchRecipesByIngredients = async (ingredients, number = 12) => {
  if (!ingredients || ingredients.length === 0) return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const ingredientsStr = ingredients.join(',')
  const cacheKey = `by_ingredients_${ingredientsStr.slice(0, 100)}_${number}`
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  try {
    const encodedIngredients = encodeURIComponent(ingredientsStr)
    const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${encodedIngredients}&number=${number}&apiKey=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipes = (data || []).map(recipe => ({
      id: `spoon_${recipe.id}`,
      spoonacular_id: recipe.id,
      title: recipe.title,
      image_url: recipe.image,
      total_time: null,
      servings: null,
      category: mapDishTypeToCategory(recipe.dishTypes),
      tags: [],
      steps: [],
      ingredients: [],
      isExternal: true,
      source: 'spoonacular',
      match_percentage: Math.round((recipe.usedIngredientCount / (recipe.missedIngredientCount || 1)) * 100),
      available_ingredients: recipe.usedIngredientCount,
      total_ingredients: recipe.usedIngredientCount + recipe.missedIngredientCount,
      missed_ingredients: recipe.missedIngredients?.map(i => i.name) || []
    }))
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
  } catch (error) {
    console.error('Error en searchRecipesByIngredients:', error)
    return []
  }
}

export const getRecipesByCategory = async (category, number = 12) => {
  const typeMap = { desayuno: 'breakfast', almuerzo: 'main course', cena: 'dinner' }
  const dishType = typeMap[category]
  if (!dishType) return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `category_${category}_${number}`
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/complexSearch?type=${dishType}&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipesPromises = (data.results || []).map(transformSpoonacularRecipe)
    const transformedRecipes = await Promise.all(transformedRecipesPromises)
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
  } catch (error) {
    console.error('Error en getRecipesByCategory:', error)
    return []
  }
}

export const getRecipeDetails = async (id) => {
  const cleanId = id.toString().replace('spoon_', '')
  if (!canMakeRequest(1)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return null
  }

  const cacheKey = `details_${cleanId}`
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/${cleanId}/information?apiKey=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const recipe = await response.json()
    recordPoints(1)
    
    const transformedRecipe = await transformSpoonacularRecipe(recipe)
    
    memoryCache.set(cacheKey, transformedRecipe)
    setTimeout(() => memoryCache.delete(cacheKey), 86400000)
    
    return transformedRecipe
  } catch (error) {
    console.error('Error en getRecipeDetails:', error)
    return null
  }
}

export const resetPointsCounter = () => {
  pointsUsedToday = 0
  console.log('🔄 Contador de puntos Spoonacular reiniciado')
}

// Reiniciar contador cada día
const today = new Date().toDateString()
let lastResetDate = today
setInterval(() => {
  const now = new Date().toDateString()
  if (now !== lastResetDate) {
    resetPointsCounter()
    lastResetDate = now
  }
}, 60000)