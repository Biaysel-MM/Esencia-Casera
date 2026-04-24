<template>
  <header class="fixed top-0 left-65 right-0 z-900 flex h-17.5 items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-white px-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out max-lg:left-0 max-lg:right-0 max-lg:h-16 max-lg:px-4">
    <div class="flex items-center gap-5">
      <!-- Hamburger Menu Button -->
      <button class="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-2.5 text-[#2C2C2C] transition-all duration-200 hover:scale-105 hover:bg-[#D8EBD0] max-lg:flex rounded-lg" @click="toggleMobileMenu">
        <i class="iconify text-xl" data-icon="mdi:menu"></i>
      </button>

      <!-- Search Bar -->
      <div class="relative w-100 max-lg:hidden max-xl:w-75">
        <span class="iconify absolute left-3.5 top-1/2 z-1 -translate-y-1/2 text-xl text-[#6C7A6C]" data-icon="mdi:magnify"></span>
        <input 
          type="text" 
          placeholder="Buscar recetas, ingredientes..."
          class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-3 pl-11.5 pr-5 text-[15px] font-normal text-[#2C2C2C] transition-all duration-200 placeholder:text-[#6C7A6C] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.1)]"
          v-model="searchQuery"
        />
      </div>
    </div>
    
    <div class="flex items-center gap-5 max-lg:gap-3">
      <!-- Weather Widget -->
      <div class="flex cursor-pointer items-center gap-2.5 rounded-xl bg-linear-to-br from-[rgba(93,162,113,0.1)] to-[rgba(139,177,116,0.1)] px-3.5 py-2 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-lg:hidden">
        <span class="iconify text-2.5 text-[#5DA271]" data-icon="mdi:partly-cloudy"></span>
        <div class="flex flex-col">
          <span class="text-[15px] font-bold leading-tight text-[#2C2C2C]">22°C</span>
          <span class="text-xs leading-tight text-[#6C7A6C]">Madrid</span>
        </div>
      </div>
      
      <!-- Notifications -->
      <div class="relative">
        <button class="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-[#2C2C2C] transition-all duration-200 hover:scale-105 hover:bg-[#D8EBD0]" @click="toggleNotifications">
          <span class="iconify text-2xl" data-icon="mdi:bell-outline"></span>
          <span class="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-[#d4183d] to-[#dc2626] text-[11px] font-bold text-white">3</span>
        </button>
        
        <div v-if="showNotifications" class="absolute right-0 top-full z-1000 mt-2.5 w-80 overflow-hidden rounded-md border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-sm:w-70 max-sm:-right-2.5">
          <div class="flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
            <h3 class="m-0 text-base font-semibold text-[#2C2C2C]">Notificaciones</h3>
            <button class="cursor-pointer rounded-1.5 border-none bg-transparent px-2 py-1 text-[13px] font-medium text-[#5DA271] transition-colors hover:bg-[rgba(93,162,113,0.1)]">Marcar todas</button>
          </div>
          <div class="notifications-list">
            <!-- Notification items here -->
          </div>
        </div>
      </div>
      
      <!-- User Avatar -->
      <div class="relative cursor-pointer" @click="toggleUserMenu">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#5DA271] to-[#8BB174] transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_12px_rgba(93,162,113,0.3)]">
          <i class="iconify text-2xl text-white" data-icon="mdi:account-circle"></i>
        </div>
        <div v-if="showUserMenu" class="absolute right-0 top-full z-1000 mt-2.5 w-55 overflow-hidden rounded-md border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-sm:w-50 max-sm:-right-2.5">
          <div class="border-b border-[rgba(0,0,0,0.08)] p-4">
            <p class="m-0 mb-1.5 text-[13px] font-normal text-[#6C7A6C]">{{ userEmail }}</p>
            <p class="inline-block rounded-xl px-2.5 py-1 text-[11px] font-bold uppercase" :class="userRole === 'admin' ? 'bg-[rgba(93,162,113,0.15)] text-[#5DA271]' : 'bg-[rgba(139,177,116,0.15)] text-[#8BB174]'">
              {{ userRole === 'admin' ? 'Administrador' : 'Familiar' }}
            </p>
          </div>
          <button class="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-3.5 text-[14px] font-medium text-[#2C2C2C] transition-colors hover:bg-[#D8EBD0]" @click="handleLogout">
            <span class="iconify text-lg text-[#6C7A6C]" data-icon="mdi:logout"></span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default {
  name: 'Header',
  props: {
    sidebarVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-mobile-menu', 'logout'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const { user, userRole } = storeToRefs(authStore)
    
    const searchQuery = ref('')
    const showNotifications = ref(false)
    const showUserMenu = ref(false)
    
    const userEmail = user.value?.email || 'usuario@ejemplo.com'
    
    const toggleMobileMenu = () => {
      emit('toggle-mobile-menu')
    }
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      showUserMenu.value = false
    }
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showNotifications.value = false
    }
    
    const handleLogout = async () => {
      try {
        await authStore.logout()
        window.location.href = '/login'
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    return {
      searchQuery,
      showNotifications,
      showUserMenu,
      userEmail,
      userRole,
      toggleMobileMenu,
      toggleNotifications,
      toggleUserMenu,
      handleLogout
    }
  }
}
</script>