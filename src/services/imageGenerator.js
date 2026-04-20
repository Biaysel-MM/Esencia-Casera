// En tu archivo de servicios (services/imageGenerator.js)
export const generateRecipeImage = async (recipeData) => {
  // Construir prompt basado en los datos de la receta
  const prompt = `Delicioso plato dominicano de ${recipeData.title}. ${recipeData.description}. 
  Ingredientes: ${recipeData.ingredients.map(i => i.name).join(', ')}. 
  Estilo: fotografía de comida profesional, iluminación natural, presentación elegante, alta calidad, 4k, tendencia en Instagram.`
  
  // Usar Pollinations.ai (gratis, sin API key)
  const encodedPrompt = encodeURIComponent(prompt)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`
  
  return imageUrl
}