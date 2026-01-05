import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    profile: null,
    userRole: 'familiar' // Valor por defecto
  }),

  actions: {
    // Inicialización con roles
    async initAuth() {
      try {
        console.log('🔄 Inicializando auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error.message)
          throw error
        }
        
        if (session) {
          this.user = session.user
          this.isAuthenticated = true
          console.log('✅ Sesión activa para:', this.user.email)
          await this.fetchUserProfile()
        } else {
          console.log('ℹ️ No hay sesión activa')
        }
      } catch (error) {
        console.error('❌ Error en initAuth:', error.message)
        this.error = error.message
      }
    },

    // Login con roles
    async login(email, password) {
      try {
        console.log('🔑 Intentando login con:', email)
        this.isLoading = true
        this.error = null
        
        // Validación básica
        if (!email || !password) {
          throw new Error('Email y contraseña son requeridos')
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })
        
        if (error) {
          console.error('❌ Error de Supabase en login:', error.message)
          throw error
        }
        
        if (data?.user) {
          this.user = data.user
          this.isAuthenticated = true
          console.log('✅ Login exitoso:', data.user.email)
          
          // Obtener perfil del usuario
          await this.fetchUserProfile()
          
          return {
            success: true,
            user: data.user
          }
        }
        
        throw new Error('No se recibieron datos del usuario')
        
      } catch (error) {
        console.error('❌ Error completo en login:', error)
        this.error = error.message
        
        // Mensajes más amigables
        let userMessage = error.message
        if (error.message.includes('Invalid login credentials')) {
          userMessage = 'Email o contraseña incorrectos'
        } else if (error.message.includes('Email not confirmed')) {
          userMessage = 'Confirma tu email antes de iniciar sesión'
        } else if (error.message.includes('Failed to fetch')) {
          userMessage = 'Error de conexión. Verifica tu internet o configuración de Supabase'
        }
        
        return {
          success: false,
          error: userMessage,
          rawError: error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    // Crear perfil de usuario con rol
    async createUserProfile(role = 'familiar', familyCode = null) {
      try {
        if (!this.user) {
          console.warn('⚠️ No hay usuario para crear perfil')
          return null
        }
        
        console.log('🔄 Creando/actualizando perfil con rol:', role)
        
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: this.user.id,
            full_name: this.user.user_metadata?.full_name || this.user.email?.split('@')[0],
            role: role,
            family_code: familyCode,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) {
          console.error('❌ Error creando perfil:', error.message)
          // Si es error de duplicado, probablemente ya existe
          if (error.code === '23505') {
            console.log('ℹ️ Perfil ya existe, obteniendo...')
            await this.fetchUserProfile()
            return this.profile
          }
          throw error
        }
        
        this.profile = data
        this.userRole = data.role || 'familiar'
        console.log('✅ Perfil creado/actualizado:', data)
        return data
        
      } catch (error) {
        console.error('❌ Error en createUserProfile:', error.message)
        return null
      }
    },

    // Obtener perfil de usuario
    async fetchUserProfile() {
      try {
        if (!this.user) {
          console.warn('⚠️ No hay usuario para obtener perfil')
          return null
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()
        
        if (error) {
          console.error('❌ Error obteniendo perfil:', error.message)
          // Si no existe, intentar crearlo como familiar
          if (error.code === 'PGRST116') {
            console.log('ℹ️ Perfil no encontrado, creando como familiar...')
            return await this.createUserProfile()
          }
          throw error
        }
        
        this.profile = data
        this.userRole = data.role || 'familiar'
        console.log('✅ Perfil obtenido:', data)
        return data
        
      } catch (error) {
        console.error('❌ Error en fetchUserProfile:', error.message)
        return null
      }
    },

    // Función register mejorada con roles
    async register(email, password, fullName, role = 'familiar', familyCode = null) {
      try {
        console.log('='.repeat(60))
        console.log('📝 REGISTRO DEBUG - Iniciando proceso de registro...')
        console.log('📝 Datos recibidos:', {
          email: email,
          fullName: fullName,
          role: role,
          familyCode: familyCode
        })
        
        this.isLoading = true
        this.error = null
        
        // 🔍 Validación de campos
        console.log('🔍 Validando campos...')
        
        if (!email) {
          throw new Error('El email es requerido')
        }
        if (!password) {
          throw new Error('La contraseña es requerida')
        }
        if (!fullName) {
          throw new Error('El nombre completo es requerido')
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
          throw new Error('Formato de email inválido. Ejemplo: nombre@ejemplo.com')
        }
        
        // Validar contraseña
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres')
        }
        
        console.log('✅ Validación de campos completada')
        
        // Limpiar datos
        const cleanEmail = email.trim().toLowerCase()
        const cleanName = fullName.trim()
        
        // Preparar opciones para Supabase
        const signUpOptions = {
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              role: role, // Guardar rol en metadata temporal
              family_code: familyCode // Guardar código de familia temporal
            },
            emailRedirectTo: `${window.location.origin}/login`
          }
        }
        
        console.log('🔄 Enviando solicitud a Supabase Auth...')
        
        // Registrar en Supabase Auth
        const { data, error } = await supabase.auth.signUp(signUpOptions)
        
        console.log('📊 RESPUESTA DE SUPABASE AUTH:', {
          usuario_creado: data?.user ? '✅ Sí' : '❌ No',
          email_usuario: data?.user?.email || 'N/A',
          session_creada: data?.session ? '✅ Sí' : '❌ No'
        })
        
        if (error) {
          console.error('❌ Error de Supabase Auth:', error)
          
          let errorMessage = error.message
          
          if (error.message.includes('User already registered')) {
            errorMessage = 'Este email ya está registrado. ¿Ya tienes cuenta?'
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres'
          } else if (error.message.includes('Invalid email')) {
            errorMessage = 'Email inválido. Intenta con un formato como: nombre.apellido@ejemplo.com'
          }
          
          throw new Error(errorMessage)
        }
        
        // Verificar si el usuario fue creado
        if (!data?.user) {
          console.warn('⚠️ No se recibió objeto user en la respuesta')
          throw new Error('No se pudo crear el usuario. Por favor, intenta nuevamente.')
        }
        
        console.log('✅ Usuario creado en Auth:', {
          id: data.user.id,
          email: data.user.email
        })
        
        // Si hay sesión automática, establecer usuario y crear perfil
        if (data.session) {
          console.log('🎉 SESIÓN AUTOMÁTICA ACTIVADA')
          
          this.user = data.user
          this.isAuthenticated = true
          
          // Crear perfil en la base de datos con rol
          await this.createUserProfile(role, familyCode)
          
          return {
            success: true,
            user: data.user,
            session: data.session,
            role: role,
            needsEmailConfirmation: false,
            message: '¡Registro exitoso! Bienvenido/a.'
          }
          
        } else {
          // Requiere confirmación de email
          console.log('📧 EMAIL DE CONFIRMACIÓN ENVIADO')
          
          return {
            success: true,
            user: data.user,
            session: null,
            role: role,
            needsEmailConfirmation: true,
            message: '¡Registro exitoso! Por favor revisa tu email para confirmar tu cuenta.'
          }
        }
        
      } catch (error) {
        console.error('❌ ERROR COMPLETO EN REGISTRO:', error.message)
        
        this.error = error.message
        
        return {
          success: false,
          error: error.message,
          needsEmailConfirmation: false
        }
        
      } finally {
        console.log('🏁 Registro finalizado.')
        this.isLoading = false
      }
    },

    // Logout
    async logout() {
      try {
        console.log('🚪 Cerrando sesión...')
        const { error } = await supabase.auth.signOut()
        
        if (error) throw error
        
        this.user = null
        this.profile = null
        this.userRole = 'familiar'
        this.isAuthenticated = false
        
        console.log('✅ Sesión cerrada exitosamente')
        return true
      } catch (error) {
        console.error('❌ Error en logout:', error.message)
        return false
      }
    },

    // Método para actualizar rol temporalmente (sin base de datos)
    setUserRole(role) {
      this.userRole = role
      console.log(`🔄 Rol actualizado a: ${role}`)
    }
  },

  getters: {
    userName: (state) => {
      if (state.user?.user_metadata?.full_name) {
        return state.user.user_metadata.full_name
      }
      return state.user?.email?.split('@')[0] || 'Usuario'
    },
    userEmail: (state) => state.user?.email || '',
    isAdmin: (state) => state.userRole === 'admin',
    isFamilyMember: (state) => state.userRole === 'familiar'
  }
})