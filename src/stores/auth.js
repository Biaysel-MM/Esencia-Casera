import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    profile: null,
    userRole: 'familiar'
  }),

  actions: {
    async initAuth() {
      try {
        console.log('🔄 Inicializando auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error)
          return
        }
        
        if (session?.user) {
          this.user = session.user
          this.isAuthenticated = true
          console.log('✅ Sesión activa para:', this.user.email)
          
          // Obtener perfil sin crear automáticamente
          await this.getUserProfile()
        }
      } catch (error) {
        console.error('❌ Error en initAuth:', error)
      }
    },

    async login(email, password) {
      try {
        console.log('🔑 Login con:', email)
        this.isLoading = true
        this.error = null
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })
        
        if (error) throw error
        
        if (data?.user) {
          this.user = data.user
          this.isAuthenticated = true
          
          // Obtener perfil existente
          await this.getUserProfile()
          
          console.log('✅ Login exitoso, rol:', this.userRole)
          return { success: true, user: data.user }
        }
        
        throw new Error('No se recibieron datos del usuario')
        
      } catch (error) {
        console.error('❌ Error en login:', error)
        this.error = error.message
        
        return {
          success: false,
          error: error.message.includes('Invalid login credentials') 
            ? 'Email o contraseña incorrectos' 
            : error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    // NUEVO: Obtener perfil SIN crear automáticamente
    async getUserProfile() {
      try {
        if (!this.user) {
          console.warn('⚠️ No hay usuario para obtener perfil')
          return null
        }
        
        console.log('🔍 Buscando perfil para usuario:', this.user.id)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .maybeSingle()  // Usar maybeSingle en lugar de single
        
        if (error) {
          console.error('❌ Error obteniendo perfil:', error)
          // Si no existe, no crear automáticamente
          this.userRole = 'familiar'
          return null
        }
        
        if (data) {
          this.profile = data
          this.userRole = data.role || 'familiar'
          console.log('✅ Perfil encontrado:', data)
          return data
        } else {
          console.log('ℹ️ Perfil no existe aún')
          this.userRole = this.user.user_metadata?.role || 'familiar'
          return null
        }
        
      } catch (error) {
        console.error('❌ Error en getUserProfile:', error)
        this.userRole = 'familiar'
        return null
      }
    },

    // NUEVO: Crear perfil MANUALMENTE (solo cuando sea necesario)
    async createProfileManually(fullName, role = 'familiar', familyCode = null) {
      try {
        if (!this.user) {
          throw new Error('No hay usuario autenticado')
        }
        
        console.log('🛠️ Creando perfil manualmente...')
        
        // Usar la función RPC de debug
        const { data, error } = await supabase.rpc('debug_create_profile', {
          user_id: this.user.id,
          user_full_name: fullName,
          user_role: role,
          user_family_code: familyCode
        })
        
        if (error) {
          console.error('❌ Error RPC:', error)
          throw error
        }
        
        console.log('📊 Respuesta RPC:', data)
        
        if (data?.success) {
          this.userRole = role
          return { success: true, data }
        } else {
          throw new Error(data?.error || 'Error desconocido')
        }
        
      } catch (error) {
        console.error('❌ Error creando perfil manualmente:', error)
        throw error
      }
    },

    async register(email, password, fullName, role = 'familiar', familyCode = null) {
      try {
        console.log('='.repeat(60))
        console.log('📝 REGISTRO - Paso 1: Registrando en Auth...')
        
        this.isLoading = true
        this.error = null
        
        // 1. Validaciones básicas
        if (!email || !password || !fullName) {
          throw new Error('Todos los campos son requeridos')
        }
        
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres')
        }
        
        // 2. Crear usuario en Supabase Auth SIN metadata compleja
        console.log('🔄 Creando usuario en Auth...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: {
              // Metadata MINIMA para evitar problemas
              full_name: fullName.trim()
            }
          }
        })
        
        if (authError) {
          console.error('❌ Error Auth:', authError)
          
          let errorMessage = authError.message
          if (authError.message.includes('User already registered')) {
            errorMessage = 'Este email ya está registrado'
          }
          
          throw new Error(errorMessage)
        }
        
        if (!authData?.user) {
          throw new Error('No se pudo crear el usuario')
        }
        
        console.log('✅ Usuario creado en Auth:', authData.user.id)
        
        // 3. Si hay sesión automática, crear perfil manualmente
        if (authData.session) {
          console.log('🎉 Sesión automática activa')
          
          this.user = authData.user
          this.isAuthenticated = true
          
          try {
            // Intentar crear perfil manualmente
            console.log('🔄 Intentando crear perfil manualmente...')
            await this.createProfileManually(fullName.trim(), role, familyCode)
            
            return {
              success: true,
              user: authData.user,
              session: authData.session,
              role: role,
              needsEmailConfirmation: false,
              message: '¡Registro exitoso! Bienvenido/a.'
            }
            
          } catch (profileError) {
            console.warn('⚠️ Error creando perfil, pero usuario registrado:', profileError)
            
            // Usuario registrado pero perfil no creado - continuar igual
            this.userRole = role
            
            return {
              success: true,
              user: authData.user,
              session: authData.session,
              role: role,
              needsEmailConfirmation: false,
              warning: 'Perfil no creado, pero usuario registrado',
              message: '¡Registro exitoso! (Perfil pendiente)'
            }
          }
          
        } else {
          // 4. Requiere confirmación de email
          console.log('📧 Email de confirmación enviado')
          
          return {
            success: true,
            user: authData.user,
            session: null,
            role: role,
            needsEmailConfirmation: true,
            message: '¡Registro exitoso! Revisa tu email para confirmar.'
          }
        }
        
      } catch (error) {
        console.error('❌ ERROR en registro:', error)
        this.error = error.message
        
        return {
          success: false,
          error: error.message,
          needsEmailConfirmation: false
        }
      } finally {
        console.log('🏁 Registro finalizado')
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        this.user = null
        this.profile = null
        this.userRole = 'familiar'
        this.isAuthenticated = false
        
        console.log('✅ Sesión cerrada')
        return true
      } catch (error) {
        console.error('❌ Error en logout:', error)
        return false
      }
    },

    // Método de diagnóstico
    async testConnection() {
      try {
        console.log('🔍 Probando conexión a Supabase...')
        
        const { data, error } = await supabase.auth.getSession()
        console.log('📊 Sesión:', data?.session ? 'Activa' : 'Inactiva')
        console.log('🔗 Conexión:', error ? '❌ Error' : '✅ OK')
        
        return !error
      } catch (error) {
        console.error('❌ Error en test:', error)
        return false
      }
    }
  },

  getters: {
    userName: (state) => {
      return state.user?.user_metadata?.full_name || 
             state.user?.email?.split('@')[0] || 
             'Usuario'
    },
    userEmail: (state) => state.user?.email || '',
    isAdmin: (state) => state.userRole === 'admin',
    isFamilyMember: (state) => state.userRole === 'familiar'
  }
})