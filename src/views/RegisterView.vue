<template>
  <div class="min-h-screen bg-linear-to-br from-[rgba(93,162,113,0.15)] via-[rgba(139,177,116,0.15)] to-[rgba(168,213,186,0.15)] flex items-center justify-center p-5">
    <div class="w-full max-w-md">
      <!-- Logo and Welcome with Animation -->
      <div class="mb-8 text-center animate-fade-in">
        <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[#5DA271] to-[#8BB174] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <span class="iconify text-5xl text-white" data-icon="mdi:chef-hat"></span>
        </div>
        <h1 class="mb-2 text-4xl font-bold bg-linear-to-r from-[#5DA271] to-[#8BB174] bg-clip-text text-transparent">Esencia Casera</h1>
        <p class="text-sm text-[#6C7A6C]">Únete a tu familia</p>
      </div>

      <!-- Register Card -->
      <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8">
        <h2 class="mb-6 text-center text-2xl font-semibold text-[#2C2C2C]">Crear Cuenta</h2>

        <!-- Tabs -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-1 rounded-lg bg-[rgba(156,163,175,0.1)] p-1">
            <button 
              class="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200"
              :class="role === 'admin' 
                ? 'bg-white text-[#2C2C2C] shadow-sm' 
                : 'text-[#6C7A6C] hover:bg-white/50'"
              @click="role = 'admin'"
              type="button"
            >
              Crear Familia
            </button>
            <button 
              class="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200"
              :class="role === 'familiar' 
                ? 'bg-white text-[#2C2C2C] shadow-sm' 
                : 'text-[#6C7A6C] hover:bg-white/50'"
              @click="role = 'familiar'"
              type="button"
            >
              Unirse
            </button>
          </div>
          
          <div class="mt-4 text-center">
            <p v-if="role === 'admin'" class="text-sm text-[#6C7A6C] leading-relaxed">
              Crea una nueva familia y obtén un código para invitar a tus familiares
            </p>
            <p v-if="role === 'familiar'" class="text-sm text-[#6C7A6C] leading-relaxed">
              Únete a una familia existente usando el código de invitación
            </p>
          </div>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
          <!-- Mensaje de éxito -->
          <div v-if="successMessage" class="flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] p-3 text-sm font-medium text-[#10b981]">
            <span class="iconify shrink-0 text-xl" data-icon="mdi:check-circle"></span>
            <span class="flex-1">{{ successMessage }}</span>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] p-3 text-sm font-medium text-[#ef4444]">
            <span class="iconify shrink-0 text-xl" data-icon="mdi:alert-circle"></span>
            <span class="flex-1" v-html="error"></span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Nombre completo</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:account"></span>
              <input 
                type="text" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                placeholder="María Contreras"
                v-model="form.name"
                required
                autocomplete="name"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Email</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:email"></span>
              <input 
                type="email" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                placeholder="tu@email.com"
                v-model="form.email"
                required
                autocomplete="email"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Contraseña</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:lock"></span>
              <input 
                type="password" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                placeholder="••••••••"
                v-model="form.password"
                required
                minlength="6"
                autocomplete="new-password"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-xs text-[#6C7A6C]">Mínimo 6 caracteres</p>
          </div>

          <!-- Family code solo para "Unirse" -->
          <div v-if="role === 'familiar'" class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Código de familia</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:pound"></span>
              <input 
                type="text" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] uppercase transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                placeholder="FAM-2024-ABC"
                v-model="form.familyCode"
                @input="formatFamilyCode"
                :required="role === 'familiar'"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-xs text-[#6C7A6C]">
              Pide el código al administrador de tu familia
            </p>
          </div>

          <button 
            type="submit" 
            class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#5DA271] to-[#8BB174] py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="iconify animate-spin text-xl" data-icon="mdi:loading"></span>
            <span v-else>{{ role === 'admin' ? 'Crear Familia' : 'Unirse a Familia' }}</span>
          </button>
        </form>

        <div class="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-6 text-center">
          <p class="text-sm text-[#6C7A6C]">
            ¿Ya tienes cuenta? 
            <button type="button" class="cursor-pointer font-semibold text-[#5DA271] transition-colors hover:text-[#8BB174] hover:underline" @click="goToLogin" :disabled="isLoading">
              Inicia sesión
            </button>
          </p>
        </div>

        <!-- Demo Info Card -->
        <div class="mt-6 rounded-xl bg-[rgba(93,162,113,0.05)] p-4 border border-[rgba(93,162,113,0.2)]">
          <p class="text-center text-xs font-semibold uppercase tracking-wide text-[#6C7A6C]">¿Cómo funciona?</p>
          <p class="mt-2 text-center text-xs text-[#6C7A6C] leading-relaxed">
            <span class="font-medium text-[#5DA271]">Crear Familia:</span> Serás administrador y podrás invitar a otros.<br>
            <span class="font-medium text-[#5DA271]">Unirse:</span> Necesitas un código de invitación de un administrador.
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
    
    const formatFamilyCode = (event) => {
      form.value.familyCode = event.target.value.toUpperCase()
    }
    
    const handleRegister = async () => {
      console.log('📝 Iniciando registro...')
      
      // Reset messages
      error.value = ''
      successMessage.value = ''
      
      // Validación básica
      if (!form.value.email || !form.value.password || !form.value.name) {
        error.value = 'Por favor completa todos los campos obligatorios'
        return
      }
      
      // Validar contraseña
      if (form.value.password.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
      }
      
      try {
        // Registrar en Supabase
        const result = await authStore.register(
          form.value.email,
          form.value.password,
          form.value.name,
          role.value,
          role.value === 'familiar' ? form.value.familyCode : null
        )
        
        console.log('📊 Resultado:', result)
        
        if (result.success) {
          if (result.needsEmailConfirmation) {
            // Email de confirmación enviado
            successMessage.value = '✅ ¡Registro exitoso! Revisa tu email para confirmar tu cuenta.'
            
            // Limpiar formulario
            form.value.email = ''
            form.value.password = ''
            form.value.name = ''
            form.value.familyCode = ''
            
            // Redirigir a login después de 3 segundos
            setTimeout(() => {
              router.push('/login')
            }, 3000)
            
          } else {
            // Sesión automática
            successMessage.value = `✅ ¡Bienvenido ${form.value.name}! Cuenta creada exitosamente.`
            
            // Redirigir según rol
            setTimeout(() => {
              if (result.role === 'admin') {
                router.push('/home')
              } else {
                router.push('/familiar-dashboard')
              }
            }, 2000)
          }
        } else {
          // Mostrar error
          error.value = result.error || 'Error al crear la cuenta'
          
          // Sugerencias según error
          if (result.error?.includes('already registered')) {
            error.value = 'Este email ya está registrado. <a href="/login" class="text-[#5DA271] hover:underline">Inicia sesión aquí</a>'
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