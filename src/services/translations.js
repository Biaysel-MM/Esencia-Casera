// src/services/translations.js

// Diccionario completo de traducciones
const translations = {
  // ========== UNIDADES DE MEDIDA ==========
  'tablespoon': 'cucharada',
  'tablespoons': 'cucharadas',
  'tbsp': 'cucharada',
  'tbsps': 'cucharadas',
  'teaspoon': 'cucharadita',
  'teaspoons': 'cucharaditas',
  'tsp': 'cucharadita',
  'tsps': 'cucharaditas',
  'cup': 'taza',
  'cups': 'tazas',
  'ml': 'ml',
  'milliliter': 'mililitro',
  'milliliters': 'mililitros',
  'liter': 'litro',
  'liters': 'litros',
  'l': 'litro',
  'gram': 'gramo',
  'grams': 'gramos',
  'g': 'gramos',
  'kg': 'kg',
  'kilogram': 'kilogramo',
  'kilograms': 'kilogramos',
  'ounce': 'onza',
  'ounces': 'onzas',
  'oz': 'onzas',
  'pound': 'libra',
  'pounds': 'libras',
  'lb': 'libra',
  'lbs': 'libras',
  'piece': 'unidad',
  'pieces': 'unidades',
  'slice': 'rebanada',
  'slices': 'rebanadas',
  'clove': 'diente',
  'cloves': 'dientes',
  'handful': 'puñado',
  'pinch': 'pizca',
  'dash': 'pizca',
  'bunch': 'manojo',
  'bunches': 'manojos',
  'large': 'grande',
  'medium': 'mediano',
  'small': 'pequeño',
  'fresh': 'fresco',
  'dried': 'seco',
  'old fashioned': 'antiguo',
  'rolled oats': 'avena en hojuelas',
  'semisweet': 'semiamargo',
  'chocolate chips': 'chispas de chocolate',
  'baking powder': 'polvo de hornear',
  'baking soda': 'bicarbonato de sodio',
  'vanilla extract': 'extracto de vainilla',
  'granulated sugar': 'azúcar granulada',
  'brown sugar': 'azúcar morena',
  'kosher salt': 'sal kosher',
  'egg yolk': 'yema de huevo',
  'egg yolks': 'yemas de huevo',
  'all-purpose flour': 'harina de trigo',
  'whole wheat flour': 'harina integral',
  'bread flour': 'harina de pan',
  'coconut oil': 'aceite de coco',
  'sesame oil': 'aceite de sésamo',
  'soy sauce': 'salsa de soya',
  'fish sauce': 'salsa de pescado',
  'worcestershire sauce': 'salsa inglesa',
  'hot sauce': 'salsa picante',
  'maple syrup': 'jarabe de arce',
  'corn syrup': 'jarabe de maíz',
  'molasses': 'melaza',
  'honey': 'miel',
  'yeast': 'levadura',
  
  // ========== INGREDIENTES COMUNES ==========
  'basil': 'albahaca',
  'garlic': 'ajo',
  'onion': 'cebolla',
  'tomato': 'tomate',
  'potato': 'papa',
  'carrot': 'zanahoria',
  'broccoli': 'brócoli',
  'spinach': 'espinaca',
  'lettuce': 'lechuga',
  'cucumber': 'pepino',
  'bell pepper': 'pimiento morrón',
  'zucchini': 'calabacín',
  'mushroom': 'champiñón',
  'celery': 'apio',
  'eggplant': 'berenjena',
  'asparagus': 'espárrago',
  'chicken': 'pollo',
  'beef': 'carne de res',
  'pork': 'cerdo',
  'fish': 'pescado',
  'salmon': 'salmón',
  'shrimp': 'camarones',
  'prawns': 'langostinos',
  'egg': 'huevo',
  'eggs': 'huevos',
  'milk': 'leche',
  'butter': 'mantequilla',
  'cheese': 'queso',
  'cream': 'crema',
  'rice': 'arroz',
  'pasta': 'pasta',
  'flour': 'harina',
  'sugar': 'azúcar',
  'salt': 'sal',
  'pepper': 'pimienta',
  'olive oil': 'aceite de oliva',
  'vegetable oil': 'aceite vegetal',
  'vinegar': 'vinagre',
  'apple cider vinegar': 'vinagre de manzana',
  'lemon': 'limón',
  'lime': 'lima',
  'orange': 'naranja',
  'parsley': 'perejil',
  'cilantro': 'cilantro',
  'oregano': 'orégano',
  'thyme': 'tomillo',
  'rosemary': 'romero',
  'feta': 'queso feta',
  'parmesan': 'queso parmesano',
  'mozzarella': 'queso mozzarella',
  'cheddar': 'queso cheddar',
  'gouda': 'queso gouda',
  'ricotta': 'queso ricotta',
  'cream cheese': 'queso crema',
  'cottage cheese': 'queso cottage',
  'goat cheese': 'queso de cabra',
  'blue cheese': 'queso azul',
  'gambas': 'gambas',
  'scallops': 'vieiras',
  'mussels': 'mejillones',
  'clams': 'almejas',
  'squid': 'calamar',
  'octopus': 'pulpo',
  'lobster': 'langosta',
  'crab': 'cangrejo',
  'baguette': 'baguette',
  'bread': 'pan',
  'pumpkin': 'calabaza',
  'apple': 'manzana',
  'banana': 'plátano',
  'strawberry': 'fresa',
  'blueberry': 'arándano',
  'raspberry': 'frambuesa',
  'avocado': 'aguacate',
  'tomatoes': 'tomates',
  'onions': 'cebollas',
  'carrots': 'zanahorias',
  'potatoes': 'papas',
  'mushrooms': 'champiñones',
  'cranberries': 'arándanos rojos',
  'cranberry': 'arándano rojo',
  'chocolate': 'chocolate',
  'oat': 'avena',
  'oats': 'avena',
  'nut': 'nuez',
  'nuts': 'nueces',
  'almond': 'almendra',
  'almonds': 'almendras',
  'walnut': 'nuez',
  'walnuts': 'nueces',
  'pecan': 'pacana',
  'pecans': 'pacanas',
  'peanut': 'maní',
  'peanuts': 'maníes',
  'cashew': 'marañón',
  'cashews': 'marañones',
  
  // ========== VERBOS DE COCINA ==========
  'heat': 'calienta',
  'preheat': 'precalienta',
  'add': 'agrega',
  'mix': 'mezcla',
  'stir': 'revuelve',
  'whisk': 'bate',
  'beat': 'bate',
  'blend': 'licua',
  'chop': 'pica',
  'slice': 'rebanada',
  'dice': 'corta en cubos',
  'mince': 'pica finamente',
  'grate': 'ralla',
  'peel': 'pela',
  'cut': 'corta',
  'place': 'coloca',
  'pour': 'vierte',
  'cook': 'cocina',
  'bake': 'hornea',
  'roast': 'asa',
  'grill': 'asala',
  'fry': 'fríe',
  'sauté': 'saltea',
  'boil': 'hierve',
  'simmer': 'cocina a fuego lento',
  'steam': 'cocina al vapor',
  'season': 'sazona',
  'serve': 'sirve',
  'remove': 'retira',
  'let': 'deja',
  'rest': 'reposar',
  'enjoy': 'disfruta',
  'reserve': 'reserva',
  'set aside': 'reserva',
  'brush': 'pincela',
  'drizzle': 'rocía',
  'toss': 'mezcla',
  'coat': 'cubre',
  'roll': 'enrolla',
  'wrap': 'envuelve',
  'cover': 'tapa',
  'uncover': 'destapa',
  'check': 'verifica',
  'taste': 'prueba',
  'line': 'forra',
  'spoon': 'cuchara',
  'spoonful': 'cucharada',
  'heaping': 'colmada',
  'level': 'rasa',
  'sprinkle': 'espolvorea',
  'dust': 'espolvorea',
  'knead': 'amasa',
  'proof': 'deja levar',
  'ferment': 'fermenta',
  'glaze': 'glasea',
  'frost': 'cubre con glaseado',
  'dip': 'sumerge',
  'drain': 'escurre',
  'pat': 'palmaditas',
  'dry': 'seca',
  'wash': 'lava',
  'rinse': 'enjuaga',
  'soak': 'remoja',
  'marinate': 'marina',
  'brine': 'salmuera',
  'smoke': 'ahuma',
  'sear': 'sella',
  'brown': 'dora',
  'caramelize': 'carameliza',
  'toast': 'tuesta',
  'grind': 'muele',
  'crush': 'aplasta',
  'mash': 'machaca',
  'puree': 'puré',
  'strain': 'cuela',
  'sift': 'tamiza',
  'fold': 'involucra',
  'cream': 'crema',
  
  // ========== CONECTORES ==========
  'and': 'y',
  'or': 'o',
  'with': 'con',
  'in': 'en',
  'on': 'sobre',
  'over': 'sobre',
  'into': 'en',
  'to': 'a',
  'for': 'por',
  'until': 'hasta que',
  'while': 'mientras',
  'then': 'luego',
  'after': 'después',
  'before': 'antes',
  'when': 'cuando',
  'if': 'si',
  'the': '',
  'a': '',
  'an': '',
  'of': 'de',
  'from': 'de',
  'by': 'por',
  'with': 'con',
  'about': 'aproximadamente',
  'around': 'alrededor de',
  'between': 'entre',
  'among': 'entre',
  'during': 'durante',
  'through': 'a través de',
  'throughout': 'durante todo',
  'within': 'dentro de',
  'without': 'sin',
  
  // ========== TIEMPO ==========
  'minute': 'minuto',
  'minutes': 'minutos',
  'hour': 'hora',
  'hours': 'horas',
  'second': 'segundo',
  'seconds': 'segundos',
  'day': 'día',
  'days': 'días',
  'week': 'semana',
  'weeks': 'semanas',
  'month': 'mes',
  'months': 'meses',
  
  // ========== TEMPERATURA ==========
  'degree': 'grado',
  'degrees': 'grados',
  'fahrenheit': 'fahrenheit',
  'celsius': 'celsius',
  'hot': 'caliente',
  'cold': 'frío',
  'warm': 'tibio',
  'cool': 'frío',
  'room temperature': 'temperatura ambiente',
  
  // ========== ADJETIVOS ==========
  'golden': 'dorado',
  'brown': 'dorado',
  'tender': 'tierno',
  'soft': 'suave',
  'crispy': 'crujiente',
  'crunchy': 'crujiente',
  'cooked': 'cocido',
  'raw': 'crudo',
  'fresh': 'fresco',
  'frozen': 'congelado',
  'done': 'listo',
  'ready': 'listo',
  'smooth': 'suave',
  'creamy': 'cremoso',
  'thick': 'espeso',
  'thin': 'claro',
  'liquid': 'líquido',
  'solid': 'sólido',
  'melted': 'derretido',
  'softened': 'ablandado',
  'room temperature': 'temperatura ambiente',
  'chilled': 'enfriado',
  'warm': 'tibio',
  
  // ========== UTENSILIOS ==========
  'bowl': 'tazón',
  'pan': 'sartén',
  'pot': 'olla',
  'skillet': 'sartén',
  'baking sheet': 'bandeja para hornear',
  'baking dish': 'molde para horno',
  'oven': 'horno',
  'stove': 'estufa',
  'microwave': 'microondas',
  'blender': 'licuadora',
  'mixer': 'batidora',
  'whisk': 'batidor',
  'spatula': 'espátula',
  'ladle': 'cucharón',
  'colander': 'colador',
  'strainer': 'colador',
  'knife': 'cuchillo',
  'cutting board': 'tabla de cortar',
  'rolling pin': 'rodillo',
  'parchment paper': 'papel pergamino',
  'aluminum foil': 'papel aluminio',
  'plastic wrap': 'papel film',
  'cooling rack': 'rejilla de enfriamiento',
  
  // ========== FRASES COMPLETAS ==========
  'to taste': 'al gusto',
  'salt and pepper to taste': 'sal y pimienta al gusto',
  'salt and pepper': 'sal y pimienta',
  'for a few minutes': 'por unos minutos',
  'for about': 'por aproximadamente',
  'until golden brown': 'hasta que esté dorado',
  'until tender': 'hasta que esté tierno',
  'remove from heat': 'retira del fuego',
  'remove from oven': 'retira del horno',
  'let cool': 'deja enfriar',
  'let rest': 'deja reposar',
  'set aside': 'reserva',
  'serve immediately': 'sirve inmediatamente',
  'serve warm': 'sirve tibio',
  'serve hot': 'sirve caliente',
  'mix well': 'mezcla bien',
  'stir well': 'revuelve bien',
  'beat until smooth': 'bate hasta que esté suave',
  'beat until creamy': 'bate hasta que esté cremoso',
  'beat until fluffy': 'bate hasta que esté esponjoso',
  'in a medium bowl': 'en un tazón mediano',
  'in a large bowl': 'en un tazón grande',
  'in a small bowl': 'en un tazón pequeño',
  'baking powder': 'polvo de hornear',
  'baking soda': 'bicarbonato de sodio',
  'vanilla extract': 'extracto de vainilla',
  'old fashioned rolled oats': 'avena en hojuelas tradicional',
  'semisweet chocolate chips': 'chispas de chocolate semiamargo',
  'granulated sugar': 'azúcar granulada',
  'brown sugar': 'azúcar morena',
  'kosher salt': 'sal kosher',
  'egg yolk': 'yema de huevo'
}

// Obtener todas las claves ordenadas por longitud (más largas primero)
const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length)

/**
 * Traduce texto usando diccionario local
 */
export const translateText = async (text, targetLang = 'es') => {
  if (!text || text.trim() === '') return ''
  
  let translated = String(text)
  
  for (const eng of sortedKeys) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi')
    translated = translated.replace(regex, translations[eng])
  }
  
  // Limpiar espacios múltiples y puntuación
  translated = translated.replace(/\s+/g, ' ').trim()
  translated = translated.replace(/\s+([.,!?:;])/g, '$1')
  
  // Capitalizar primera letra de cada oración
  translated = translated.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, letter) => {
    return separator + letter.toUpperCase()
  })
  
  return translated
}

/**
 * Traduce y formatea un ingrediente
 */
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

export const clearTranslationCache = () => {
  console.log('🗑️ Cache de traducciones limpiado')
}