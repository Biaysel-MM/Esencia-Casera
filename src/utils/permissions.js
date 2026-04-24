// src/utils/permissions.js
import { supabase } from '@/supabase'

export const Permissions = {
  /**
   * Verifica si un usuario puede editar/eliminar una receta
   * @param {Object} recipe - Objeto de la receta
   * @param {Object} currentUser - Usuario actual (de authStore.user)
   * @returns {boolean}
   */
  canModifyRecipe(recipe, currentUser) {
    if (!recipe || !currentUser) return false
    // Solo el creador puede modificar
    return recipe.created_by === currentUser.id
  },
  
  /**
   * Verifica si un usuario puede ver una receta
   */
  canViewRecipe(recipe, currentUser) {
    if (!recipe) return false
    // Las recetas públicas son visibles para todos
    if (recipe.is_public) return true
    // Las privadas solo para el creador
    return recipe.created_by === currentUser?.id
  },
  
  /**
   * Verifica si el usuario es admin (para otras funcionalidades)
   */
  isAdmin(user) {
    return user?.role === 'admin'
  }
}