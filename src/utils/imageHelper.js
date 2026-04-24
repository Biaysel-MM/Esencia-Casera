// src/utils/imageHelper.js

// Imagen por defecto
const DEFAULT_IMAGE = 'https://www.canadianturkey.ca/wp-content/uploads/2025/06/banner-recipe-default.jpg'

// Transformaciones por tamaño
const transformations = {
  tiny: { w: 150, h: 100, q: 50 },
  small: { w: 300, h: 200, q: 60 },
  medium: { w: 600, h: 400, q: 70 },
  large: { w: 1200, h: 800, q: 80 },
  xlarge: { w: 1600, h: 1000, q: 85 }
}

/**
 * Verifica si una URL es de tipo data:image (base64)
 */
function isBase64Image(url) {
  return url && (url.startsWith('data:image') || url.startsWith('blob:'))
}

/**
 * Optimiza una imagen para responsive
 * @param {string} url - URL original de la imagen
 * @param {string} size - Tamaño: 'tiny', 'small', 'medium', 'large', 'xlarge'
 * @returns {string} URL optimizada
 */
export function getOptimizedImageUrl(url, size = 'medium') {
  // Si no hay URL o es la imagen por defecto
  if (!url || url.includes('banner-recipe-default') || url.includes('default')) {
    return DEFAULT_IMAGE
  }
  
  // Si es imagen base64, devolverla directamente (no se puede optimizar con CDN)
  if (isBase64Image(url)) {
    return url
  }
  
  const baseUrl = url.split('?')[0]
  const t = transformations[size]
  
  if (!t) return url
  
  // Para Unsplash
  if (baseUrl.includes('unsplash.com') || baseUrl.includes('cocinadominicana.com')) {
    return `${baseUrl}?w=${t.w}&h=${t.h}&fit=crop&q=${t.q}&auto=format`
  }
  
  // Para otras URLs externas (usar weserv.nl solo si es HTTPS)
  if (baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
    const encodedUrl = encodeURIComponent(baseUrl)
    return `https://images.weserv.nl/?url=${encodedUrl}&w=${t.w}&h=${t.h}&fit=cover&q=${t.q}`
  }
  
  // Para imágenes locales o que no se pueden procesar, devolver original
  return baseUrl
}

/**
 * Genera srcset para responsive
 * @param {string} url - URL original
 * @returns {string} atributo srcset
 */
export function getSrcSet(url) {
  if (!url || url.includes('default') || isBase64Image(url)) return ''
  
  const baseUrl = url.split('?')[0]
  
  // Si es Unsplash
  if (baseUrl.includes('unsplash.com') || baseUrl.includes('cocinadominicana.com')) {
    return `
      ${baseUrl}?w=300&h=200&fit=crop&q=60 300w,
      ${baseUrl}?w=600&h=400&fit=crop&q=70 600w,
      ${baseUrl}?w=900&h=600&fit=crop&q=80 900w
    `
  }
  
  // Para URLs externas
  if (baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
    const encodedUrl = encodeURIComponent(baseUrl)
    return `
      https://images.weserv.nl/?url=${encodedUrl}&w=300&h=200&fit=cover&q=60 300w,
      https://images.weserv.nl/?url=${encodedUrl}&w=600&h=400&fit=cover&q=70 600w,
      https://images.weserv.nl/?url=${encodedUrl}&w=900&h=600&fit=cover&q=80 900w
    `
  }
  
  return ''
}

export default {
  getOptimizedImageUrl,
  getSrcSet
}