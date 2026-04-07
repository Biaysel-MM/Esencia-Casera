// src/services/translations.js - VERSIÓN COMPLETA CORREGIDA

// API de traducción gratuita e ilimitada (MyMemory)
export const translateText = async (text, from = 'en', to = 'es') => {
  if (!text || text.trim() === '') return ''
  
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}&de=david.esencia.casera@gmail.com`
    const response = await fetch(url)
    const data = await response.json()
    
    if (data && data.responseData && data.responseData.translatedText) {
      let translated = data.responseData.translatedText
      translated = translated.replace(/\[.*?\]/g, '')
      return translated.trim() || text
    }
    return text
  } catch (error) {
    console.warn('Error en traducción:', error)
    return text
  }
}

export const translateIngredient = async (ingredient) => {
  if (!ingredient) return { name: '', quantity: null, unit: '' }
  
  if (typeof ingredient === 'object') {
    const translatedName = await translateText(ingredient.name || ingredient.ingredient_name || '')
    return {
      name: translatedName,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    }
  }
  
  const translated = await translateText(String(ingredient))
  return { name: translated, quantity: null, unit: '' }
}

export const translateBatch = async (texts) => {
  const results = []
  for (const text of texts) {
    results.push(await translateText(text))
  }
  return results
}

export const translateTag = async (tag) => {
  if (!tag) return ''
  return translateText(tag)
}

export const translateInstructions = async (instructions) => {
  if (!instructions) return ''
  return translateText(instructions)
}

export const translateTitle = async (title) => {
  if (!title) return ''
  return translateText(title)
}

export const formatQuantity = (quantity, unit) => {
  if (!quantity && quantity !== 0) return ''
  const qty = parseFloat(quantity)
  if (isNaN(qty)) return `${quantity} ${unit || ''}`.trim()
  
  if (!unit || unit.trim() === '') {
    if (qty === 1) return `${qty} unidad`
    if (qty > 1) return `${qty} unidades`
    return `${qty}`
  }
  
  const unitMap = {
    'cup': 'taza', 'cups': 'tazas',
    'tablespoon': 'cucharada', 'tablespoons': 'cucharadas', 'tbsp': 'cucharada', 'tbsps': 'cucharadas',
    'teaspoon': 'cucharadita', 'teaspoons': 'cucharaditas', 'tsp': 'cucharadita', 'tsps': 'cucharaditas',
    'gram': 'gramo', 'grams': 'gramos', 'g': 'gramos',
    'kilogram': 'kilogramo', 'kilograms': 'kilogramos', 'kg': 'kg',
    'milliliter': 'mililitro', 'milliliters': 'mililitros', 'ml': 'ml',
    'liter': 'litro', 'liters': 'litros', 'l': 'litro',
    'ounce': 'onza', 'ounces': 'onzas', 'oz': 'onzas',
    'pound': 'libra', 'pounds': 'libras', 'lb': 'libra', 'lbs': 'libras',
    'piece': 'unidad', 'pieces': 'unidades',
    'slice': 'rebanada', 'slices': 'rebanadas',
    'clove': 'diente', 'cloves': 'dientes',
    'handful': 'puñado',
    'pinch': 'pizca', 'dash': 'pizca',
    'bunch': 'manojo', 'bunches': 'manojos'
  }
  
  let translatedUnit = unitMap[unit.toLowerCase()] || unit
  if (qty === 1 && translatedUnit.endsWith('s')) {
    translatedUnit = translatedUnit.slice(0, -1)
  }
  
  const displayQty = Number.isInteger(qty) ? qty : qty.toFixed(1)
  return `${displayQty} ${translatedUnit}`
}

export const getStepText = (step) => {
  if (typeof step === 'string') return step
  if (step && step.step) return step.step
  if (step && step.description) return step.description
  return JSON.stringify(step)
}

export const clearTranslationCache = () => {
  console.log('🗑️ Cache de traducciones limpiado')
}