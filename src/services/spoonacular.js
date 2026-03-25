// src/services/spoonacular.js

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const BASE_URL = 'https://api.spoonacular.com'

// Cache en memoria para evitar llamadas repetidas
const memoryCache = new Map()

// Contador de puntos usados hoy (para monitoreo)
let pointsUsedToday = 0

/**
 * Verifica si podemos hacer una llamada (rate limit simple)
 * Spoonacular: 150 puntos/día
 */
const canMakeRequest = (estimatedPoints = 1) => {
  return (pointsUsedToday + estimatedPoints) <= 150
}

/**
 * Registra puntos usados
 */
const recordPoints = (points) => {
  pointsUsedToday += points
  console.log(`📊 Spoonacular: ${pointsUsedToday}/150 puntos usados hoy`)
}

/**
 * Obtiene recetas aleatorias
 * @param {number} number - Cantidad de recetas (default: 10)
 * @returns {Promise<Array>} - Array de recetas transformadas
 */
export const getRandomRecipes = async (number = 10) => {
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `random_${number}`
  
  // Verificar cache en memoria
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Usando cache para recetas aleatorias')
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/random?number=${number}&apiKey=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    recordPoints(number)
    
    // Transformar datos al formato de tu app
    const transformedRecipes = data.recipes.map(transformSpoonacularRecipe)
    
    // Guardar en cache (expira en 1 hora)
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
    
  } catch (error) {
    console.error('Error en getRandomRecipes:', error)
    return []
  }
}

/**
 * Busca recetas por nombre
 * @param {string} query - Término de búsqueda
 * @param {number} number - Cantidad de resultados (default: 12)
 * @returns {Promise<Array>} - Array de recetas transformadas
 */
export const searchRecipes = async (query, number = 12) => {
  if (!query || query.trim() === '') return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `search_${query.toLowerCase().trim()}_${number}`
  
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Usando cache para búsqueda:', query)
    return memoryCache.get(cacheKey)
  }

  try {
    const encodedQuery = encodeURIComponent(query)
    const url = `${BASE_URL}/recipes/complexSearch?query=${encodedQuery}&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipes = (data.results || []).map(transformSpoonacularRecipe)
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
    
  } catch (error) {
    console.error('Error en searchRecipes:', error)
    return []
  }
}

/**
 * Busca recetas por ingredientes disponibles (para filtro "con tus ingredientes")
 * @param {Array<string>} ingredients - Array de nombres de ingredientes que tienes
 * @param {number} number - Cantidad de resultados (default: 12)
 * @returns {Promise<Array>} - Array de recetas transformadas
 */
export const searchRecipesByIngredients = async (ingredients, number = 12) => {
  if (!ingredients || ingredients.length === 0) return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const ingredientsStr = ingredients.join(',')
  const cacheKey = `by_ingredients_${ingredientsStr.slice(0, 100)}_${number}`
  
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Usando cache para búsqueda por ingredientes')
    return memoryCache.get(cacheKey)
  }

  try {
    const encodedIngredients = encodeURIComponent(ingredientsStr)
    const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${encodedIngredients}&number=${number}&apiKey=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    recordPoints(number)
    
    // Transformar y calcular porcentaje de compatibilidad
    const transformedRecipes = (data || []).map(recipe => ({
      id: `spoon_${recipe.id}`,
      spoonacular_id: recipe.id,
      title: recipe.title,
      image_url: recipe.image,
      total_time: null, // Esta búsqueda no da tiempo
      servings: null,
      category: mapDishTypeToCategory(recipe.dishTypes),
      tags: [],
      steps: [],
      isExternal: true,
      source: 'spoonacular',
      match_percentage: Math.round((recipe.usedIngredientCount / recipe.missedIngredientCount) * 100),
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

/**
 * Obtiene recetas por categoría (desayuno/almuerzo/cena)
 * @param {string} category - 'desayuno', 'almuerzo', 'cena'
 * @param {number} number - Cantidad de resultados (default: 12)
 * @returns {Promise<Array>} - Array de recetas transformadas
 */
export const getRecipesByCategory = async (category, number = 12) => {
  // Mapear categoría de tu app a tipo de plato de Spoonacular
  const typeMap = {
    desayuno: 'breakfast',
    almuerzo: 'main course',
    cena: 'dinner'
  }
  
  const dishType = typeMap[category]
  if (!dishType) return []
  if (!canMakeRequest(number)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return []
  }

  const cacheKey = `category_${category}_${number}`
  
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Usando cache para categoría:', category)
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/complexSearch?type=${dishType}&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    recordPoints(number)
    
    const transformedRecipes = (data.results || []).map(transformSpoonacularRecipe)
    
    memoryCache.set(cacheKey, transformedRecipes)
    setTimeout(() => memoryCache.delete(cacheKey), 3600000)
    
    return transformedRecipes
    
  } catch (error) {
    console.error('Error en getRecipesByCategory:', error)
    return []
  }
}

/**
 * Obtiene detalles completos de una receta por ID
 * @param {number|string} id - ID de Spoonacular (puede venir con prefijo 'spoon_')
 * @returns {Promise<Object|null>} - Receta transformada o null
 */
export const getRecipeDetails = async (id) => {
  // Limpiar ID si tiene prefijo
  const cleanId = id.toString().replace('spoon_', '')
  
  if (!canMakeRequest(1)) {
    console.warn('⚠️ Límite de API Spoonacular alcanzado')
    return null
  }

  const cacheKey = `details_${cleanId}`
  
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Usando cache para detalles de receta:', cleanId)
    return memoryCache.get(cacheKey)
  }

  try {
    const url = `${BASE_URL}/recipes/${cleanId}/information?apiKey=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const recipe = await response.json()
    recordPoints(1)
    
    const transformedRecipe = transformSpoonacularRecipe(recipe)
    
    memoryCache.set(cacheKey, transformedRecipe)
    setTimeout(() => memoryCache.delete(cacheKey), 86400000) // 24 horas
    
    return transformedRecipe
    
  } catch (error) {
    console.error('Error en getRecipeDetails:', error)
    return null
  }
}

/**
 * Transforma una receta de Spoonacular al formato de tu app
 */

// En src/services/spoonacular.js, actualizar importaciones
import { translateIngredient, translateTag, translateInstructions, translateTitle } from './translations'

// Reemplazar la función transformSpoonacularRecipe
const transformSpoonacularRecipe = (recipe) => {
  // Transformar ingredientes correctamente
  const ingredients = (recipe.extendedIngredients || []).map(ing => ({
    id: ing.id,
    name: translateIngredient(ing.name), // Traducir nombre del ingrediente
    original: ing.original,
    quantity: ing.amount,
    unit: ing.unit,
    image: ing.image
  }))

  // Transformar tags (traducidos)
  const tags = (recipe.dishTypes || []).map(tag => translateTag(tag))
  
  // También incluir dietas como tags
  if (recipe.vegetarian) tags.push(translateTag('vegetarian'))
  if (recipe.vegan) tags.push(translateTag('vegan'))
  if (recipe.glutenFree) tags.push(translateTag('gluten free'))
  if (recipe.dairyFree) tags.push(translateTag('dairy free'))
  if (recipe.veryHealthy) tags.push(translateTag('healthy'))
  if (recipe.cheap) tags.push(translateTag('cheap'))
  
  // Eliminar tags duplicados y vacíos
  const uniqueTags = [...new Set(tags.filter(t => t && t !== ''))]

  // Parsear instrucciones y traducirlas
  const steps = parseInstructions(recipe.analyzedInstructions).map(step => 
    translateInstructions(step)
  )

  return {
    id: `spoon_${recipe.id}`,
    spoonacular_id: recipe.id,
    title: translateTitle(recipe.title), // Traducir título
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
    instructions: recipe.instructions ? translateInstructions(recipe.instructions) : null,
    sourceUrl: recipe.sourceUrl || null
  }
}
/**
 * Convierte los dishTypes de Spoonacular a tus categorías
 */
const mapDishTypeToCategory = (dishTypes = []) => {
  if (dishTypes.includes('breakfast')) return 'desayuno'
  if (dishTypes.includes('lunch') || dishTypes.includes('main course')) return 'almuerzo'
  if (dishTypes.includes('dinner')) return 'cena'
  return 'almuerzo' // default
}

/**
 * Parsea las instrucciones de Spoonacular a un array simple
 */
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

/**
 * Transforma ingredientes de Spoonacular al formato de tu app
 */
const transformIngredients = (extendedIngredients = []) => {
  return extendedIngredients.map(ing => ({
    id: ing.id,
    name: ing.name,
    original: ing.original,
    quantity: ing.amount,
    unit: ing.unit,
    image: ing.image
  }))
}

/**
 * Resetea el contador de puntos (llamar al inicio del día)
 */
export const resetPointsCounter = () => {
  pointsUsedToday = 0
  console.log('🔄 Contador de puntos Spoonacular reiniciado')
}

// Inicializar contador al inicio del día
const today = new Date().toDateString()
let lastResetDate = today
setInterval(() => {
  const now = new Date().toDateString()
  if (now !== lastResetDate) {
    resetPointsCounter()
    lastResetDate = now
  }
}, 60000) // Revisar cada minuto