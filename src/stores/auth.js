import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false
  }),

  actions: {
    async initAuth() {
      try {
        this.isLoading = true
        
        // Obtener sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (session) {
          this.user = session.user
          this.isAuthenticated = true
          
          // OBTENER PERFIL CON ROL
          await this.fetchUserProfile()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // NUEVO: Obtener perfil del usuario
    async fetchUserProfile() {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()
        
        if (error) throw error
        
        this.profile = profile
        return profile
      } catch (error) {
        console.error('Error fetching profile:', error)
        return null
      }
    },

    async login(email, password) {
      try {
        this.isLoading = true
        this.error = null
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        if (data.user) {
          this.user = data.user
          this.isAuthenticated = true
          
          // OBTENER PERFIL
          await this.fetchUserProfile()
          
          return true
        }
        
        return false
      } catch (error) {
        this.error = error.message
        console.error('Login error:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async register(email, password, fullName) {
      try {
        this.isLoading = true
        this.error = null
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          this.user = data.user
          this.isAuthenticated = true
          
          // NOTA: El perfil se crea automáticamente por el trigger
          // Esperar un momento y luego obtener el perfil
          setTimeout(async () => {
            await this.fetchUserProfile()
          }, 1000)
          
          return true
        }
        
        return false
      } catch (error) {
        this.error = error.message
        console.error('Register error:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        this.user = null
        this.profile = null // LIMPIAR PERFIL
        this.isAuthenticated = false
        
        return true
      } catch (error) {
        console.error('Logout error:', error)
        return false
      }
    },

    // NUEVO: Actualizar perfil
    async updateProfile(updates) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', this.user.id)
          .select()
          .single()
        
        if (error) throw error
        
        this.profile = data
        return data
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },

    // NUEVO: Cambiar rol (solo para testing/admin)
    async changeRole(role) {
      if (!['admin', 'familiar'].includes(role)) {
        throw new Error('Role must be admin or familiar')
      }
      
      return this.updateProfile({ role })
    }
  },

  getters: {
    // NUEVO: Getters útiles
    userRole: (state) => state.profile?.role || 'familiar',
    isAdmin: (state) => state.profile?.role === 'admin',
    isFamilyMember: (state) => state.profile?.role === 'familiar',
    userName: (state) => state.profile?.full_name || state.user?.email?.split('@')[0] || 'Usuario',
    userEmail: (state) => state.user?.email || '',
    familyId: (state) => state.profile?.family_id
  }
})