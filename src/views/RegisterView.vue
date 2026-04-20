<template>
  <div class="min-h-screen bg-linear-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center p-5">
    <div class="w-full max-w-md">
      <!-- Logo and Welcome -->
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-500 shadow-lg">
          <span class="iconify text-5xl text-white" data-icon="mdi:chef-hat"></span>
        </div>
        <h1 class="mb-2 text-4xl font-bold bg-linear-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Esencia Casera</h1>
        <p class="text-sm text-gray-500">Únete a tu familia</p>
      </div>

      <!-- Register Card -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        <h2 class="mb-6 text-center text-2xl font-semibold text-gray-900">Crear Cuenta</h2>

        <!-- Tabs -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1">
            <button 
              class="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200"
              :class="role === 'admin' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:bg-white/50'"
              @click="role = 'admin'"
              type="button">
              Crear Familia
            </button>
            <button 
              class="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200"
              :class="role === 'familiar' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:bg-white/50'"
              @click="role = 'familiar'"
              type="button">
              Unirse
            </button>
          </div>
          
          <div class="mt-4 text-center">
            <p v-if="role === 'admin'" class="text-sm text-gray-500 leading-relaxed">
              Crea una nueva familia y obtén un código para invitar a tus familiares
            </p>
            <p v-if="role === 'familiar'" class="text-sm text-gray-500 leading-relaxed">
              Únete a una familia existente usando el código de invitación
            </p>
          </div>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
          <!-- Toast-like message (inline) -->
          <div v-if="successMessage" class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            <span class="iconify shrink-0 text-xl" data-icon="mdi:check-circle"></span>
            <span class="flex-1">{{ successMessage }}</span>
          </div>

          <div v-if="error" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            <span class="iconify shrink-0 text-xl" data-icon="mdi:alert-circle"></span>
            <span class="flex-1" v-html="error"></span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">Nombre completo</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" data-icon="mdi:account"></span>
              <input 
                type="text" 
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-3 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="María Contreras"
                v-model="form.name"
                required
                autocomplete="name"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" data-icon="mdi:email"></span>
              <input 
                type="email" 
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-3 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="tu@email.com"
                v-model="form.email"
                required
                autocomplete="email"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">Contraseña</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" data-icon="mdi:lock"></span>
              <input 
                type="password" 
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-3 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="••••••••"
                v-model="form.password"
                required
                minlength="6"
                autocomplete="new-password"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-xs text-gray-400">Mínimo 6 caracteres</p>
          </div>

          <!-- Family code solo para "Unirse" -->
          <div v-if="role === 'familiar'" class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">Código de familia</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" data-icon="mdi:pound"></span>
              <input 
                type="text" 
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-gray-900 uppercase transition-all duration-200 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-3 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="ABC123"
                v-model="form.familyCode"
                @input="formatFamilyCode"
                :required="role === 'familiar'"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-xs text-gray-400">
              Pide el código al administrador de tu familia
            </p>
          </div>

          <button 
            type="submit" 
            class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading">
            <span v-if="isLoading" class="iconify animate-spin text-xl" data-icon="mdi:loading"></span>
            <span v-else>{{ role === 'admin' ? 'Crear Familia' : 'Unirse a Familia' }}</span>
          </button>
        </form>

        <div class="mt-6 border-t border-gray-100 pt-6 text-center">
          <p class="text-sm text-gray-500">
            ¿Ya tienes cuenta? 
            <button type="button" class="cursor-pointer font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline" @click="goToLogin" :disabled="isLoading">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { supabase } from '../supabase'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { isLoading } = storeToRefs(authStore)
    
    const form = ref({
      email: '',
      password: '',
      name: '',
      familyCode: ''
    })
    
    const role = ref('admin')
    const error = ref('')
    const successMessage = ref('')
    
    const generateFamilyCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
      }
      return code
    }
    
    const formatFamilyCode = (event) => {
      form.value.familyCode = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    }
    
    const handleRegister = async () => {
      console.log('📝 Iniciando registro...')
      
      error.value = ''
      successMessage.value = ''
      
      if (!form.value.email || !form.value.password || !form.value.name) {
        error.value = 'Por favor completa todos los campos obligatorios'
        return
      }
      
      if (form.value.password.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
      }
      
      try {
        let familyCode = null
        
        if (role.value === 'admin') {
          // Generate new family code
          familyCode = generateFamilyCode()
        } else {
          // Verify family code exists
          if (!form.value.familyCode) {
            error.value = 'Ingresa el código de familia'
            return
          }
          
          const { data, error: codeError } = await supabase
            .from('profiles')
            .select('family_code')
            .eq('family_code', form.value.familyCode)
            .limit(1)
          
          if (codeError || !data || data.length === 0) {
            error.value = 'Código de familia no válido. Verifica el código e intenta nuevamente.'
            return
          }
          
          familyCode = form.value.familyCode
        }
        
        // Register user
        const result = await authStore.register(
          form.value.email,
          form.value.password,
          form.value.name,
          role.value,
          familyCode
        )
        
        console.log('📊 Resultado:', result)
        
        if (result.success) {
          if (result.needsEmailConfirmation) {
            successMessage.value = '✅ ¡Registro exitoso! Revisa tu email para confirmar tu cuenta.'
            
            form.value.email = ''
            form.value.password = ''
            form.value.name = ''
            form.value.familyCode = ''
            
            setTimeout(() => {
              router.push('/login')
            }, 3000)
            
          } else {
            successMessage.value = `✅ ¡Bienvenido ${form.value.name}! Cuenta creada exitosamente.`
            
            setTimeout(() => {
              if (result.role === 'admin') {
                router.push('/home')
              } else {
                router.push('/familiar-dashboard')
              }
            }, 2000)
          }
        } else {
          error.value = result.error || 'Error al crear la cuenta'
          
          if (result.error?.includes('already registered')) {
            error.value = 'Este email ya está registrado. <a href="/login" class="text-emerald-600 hover:underline">Inicia sesión aquí</a>'
          }
        }
      } catch (err) {
        console.error('❌ Error:', err)
        error.value = 'Error inesperado. Por favor, intenta nuevamente.'
      }
    }
    
    const goToLogin = () => {
      router.push('/login')
    }
    
    return {
      form,
      role,
      isLoading,
      error,
      successMessage,
      formatFamilyCode,
      handleRegister,
      goToLogin
    }
  }
}
</script>