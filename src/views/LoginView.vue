<template>
  <div v-if="!isLoading" class="min-h-screen bg-linear-to-br from-[rgba(93,162,113,0.15)] via-[rgba(139,177,116,0.15)] to-[rgba(168,213,186,0.15)] flex items-center justify-center p-5">
    <div class="w-full max-w-md">
      <!-- Logo and Welcome with Animation -->
      <div class="mb-8 text-center animate-fade-in">
        <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[#5DA271] to-[#8BB174] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <span class="iconify text-5xl text-white" data-icon="mdi:chef-hat"></span>
        </div>
        <h1 class="mb-2 text-4xl font-bold bg-linear-to-r from-[#5DA271] to-[#8BB174] bg-clip-text text-transparent">Esencia Casera</h1>
        <p class="text-sm text-[#6C7A6C]">Tu cocina inteligente</p>
      </div>

      <!-- Login Card -->
      <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8">
        <h2 class="mb-6 text-center text-2xl font-semibold text-[#2C2C2C]">Iniciar Sesión</h2>

        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <div v-if="error" class="flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] p-3 text-sm font-medium text-[#ef4444]">
            <span class="iconify shrink-0 text-xl" data-icon="mdi:alert-circle"></span>
            <span class="flex-1">{{ error }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Email</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:email"></span>
              <input 
                type="email" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                placeholder="tu@email.com"
                v-model="form.email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#2C2C2C]">Contraseña</label>
            <div class="relative">
              <span class="iconify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#9ca3af]" data-icon="mdi:lock"></span>
              <input 
                type="password" 
                class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pl-10 text-[16px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                placeholder="••••••••"
                v-model="form.password"
                required
                autocomplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#5DA271] to-[#8BB174] py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="iconify animate-spin text-xl" data-icon="mdi:loading"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <div class="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-6 text-center">
          <p class="text-sm text-[#6C7A6C]">
            ¿No tienes cuenta? 
            <button type="button" class="cursor-pointer font-semibold text-[#5DA271] transition-colors hover:text-[#8BB174] hover:underline" @click="goToRegister">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[rgba(93,162,113,0.15)] via-[rgba(139,177,116,0.15)] to-[rgba(168,213,186,0.15)]">
    <div class="flex h-10 w-10 animate-spin rounded-full border-4 border-[#D8EBD0] border-t-[#5DA271]"></div>
    <p class="mt-4 text-sm text-[#6C7A6C]">Cargando...</p>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { onUnmounted } from 'vue'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { isLoading, error, userRole } = storeToRefs(authStore)
    
    const form = ref({
      email: '',
      password: ''
    })

    onUnmounted(() => {
      console.log('LoginView desmontado')
    })
    
    const handleLogin = async () => {
      console.log('Login form submitted')
      const success = await authStore.login(form.value.email, form.value.password)
      
      if (success) {
        console.log('Login successful, redirecting based on role...')
        
        setTimeout(() => {
          if (authStore.userRole === 'admin') {
            router.push('/home')
          } else {
            router.push('/familiar-dashboard')
          }
        }, 100)
      } else {
        console.log('Login failed')
      }
    }
    
    const goToRegister = () => {
      console.log('Going to register')
      router.push('/register')
    }
    
    return {
      form,
      isLoading,
      error,
      handleLogin,
      goToRegister
    }
  }
}
</script>