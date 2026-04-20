<template>
  <aside
    class="fixed left-0 top-0 z-1000 flex h-screen w-65 flex-col border-r border-[rgba(0,0,0,0.08)] bg-white bg-linear-to-b from-white to-[rgba(255,255,255,0.95)] transition-transform duration-300 ease-in-out max-md:-translate-x-full max-md:w-70 max-md:shadow-[10px_0_30px_rgba(0,0,0,0.1)]"
    :class="{ 'max-md:translate-x-0': isMobileOpen }">
    <!-- Close button for mobile -->
    <button v-if="isMobileOpen"
      class="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#2C2C2C] transition-colors hover:bg-[#D8EBD0] max-md:flex"
      @click="closeSidebar">
      <span class="iconify text-2" data-icon="mdi:close"></span>
    </button>

    <!-- Logo -->
    <div class="flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] px-5 pb-5 pt-6">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#5DA271] to-[#8BB174]">
        <span class="iconify text-2 text-white" data-icon="mdi:chef-hat"></span>
      </div>
      <h2 class="m-0 bg-linear-to-br from-[#5DA271] to-[#8BB174] bg-clip-text text-xl font-bold text-transparent">
        Esencia Casera</h2>
    </div>

    <!-- User Info -->
    <div class="flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] px-5 py-5">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#A8D5BA] to-[#5DA271]">
        <span class="iconify text-2xl text-white" data-icon="mdi:account-circle"></span>
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[15px] font-semibold text-[#2C2C2C]">{{ userName || 'Usuario' }}</p>
        <p class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          :class="userRole === 'admin' ? 'bg-[rgba(93,162,113,0.15)] text-[#5DA271]' : 'bg-[rgba(139,177,116,0.15)] text-[#8BB174]'">
          {{ userRole === 'admin' ? 'Administrador' : 'Familiar' }}
        </p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="m-0 list-none p-0">
        <!-- Inicio para ambos roles -->
        <li class="mb-1">
          <router-link :to="userRole === 'admin' ? '/home' : '/familiar-dashboard'"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive(userRole === 'admin' ? '/home' : '/familiar-dashboard')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath(userRole === 'admin' ? '/home' : '/familiar-dashboard') }"
              data-icon="mdi:home"></span>
            <span class="flex-1 text-sm font-medium">Inicio</span>
          </router-link>
        </li>

        <!-- Solo para admin -->
        <li v-if="userRole === 'admin'" class="mb-1">
          <router-link to="/planificador"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/planificador')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/planificador') }" data-icon="mdi:calendar"></span>
            <span class="flex-1 text-sm font-medium">Planificador</span>
          </router-link>
        </li>

        <li v-if="userRole === 'admin'" class="mb-1">
          <router-link to="/lista-compras"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/lista-compras')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/lista-compras') }" data-icon="mdi:cart"></span>
            <span class="flex-1 text-sm font-medium">Lista de Compras</span>
          </router-link>
        </li>

        <!-- Para ambos roles -->
        <li class="mb-1">
          <router-link to="/recetas"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/recetas', true)"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/recetas', true) }" data-icon="mdi:book-open"></span>
            <span class="flex-1 text-sm font-medium">Recetas</span>
          </router-link>
        </li>

        <!-- Para ambos roles -->
        <li class="mb-1">
          <router-link to="/favoritas"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/favoritas')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/favoritas') }" data-icon="mdi:heart"></span>
            <span class="flex-1 text-sm font-medium">Favoritas</span>
          </router-link>
        </li>

        <!-- Solo para admin -->
        <li v-if="userRole === 'admin'" class="mb-1">
          <router-link to="/familia"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/familia')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/familia') }" data-icon="mdi:account-group"></span>
            <span class="flex-1 text-sm font-medium">Familia</span>
          </router-link>
        </li>

        <!-- Para ambos roles -->
        <li class="mb-1">
          <router-link to="/configuracion"
            class="relative flex items-center gap-3 px-5 py-3.5 text-[#2C2C2C] no-underline transition-all duration-200 hover:bg-[#D8EBD0]"
            :class="isActive('/configuracion')"
            @click="closeSidebarOnMobile">
            <span class="iconify w-6 text-center text-[22px] text-[#6C7A6C]"
              :class="{ 'text-[#5DA271]': isActivePath('/configuracion') }" data-icon="mdi:cog"></span>
            <span class="flex-1 text-sm font-medium">Configuración</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <div class="border-t border-[rgba(0,0,0,0.08)] p-5">
      <button
        class="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-linear-to-br from-[#d4183d] to-[#dc2626] border-none px-3 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
        @click="handleLogout">
        <span class="iconify text-lg" data-icon="mdi:logout"></span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default {
  name: 'Sidebar',
  props: {
    isMobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    const { userName, userRole } = storeToRefs(authStore)

    // Función para verificar si una ruta está activa (incluyendo rutas anidadas)
    const isActivePath = (path, includeChildren = false) => {
      if (includeChildren) {
        // Para rutas como /recetas, también activa en /receta/123
        return route.path === path || route.path.startsWith(path + '/')
      }
      return route.path === path
    }

    // Función que devuelve las clases CSS para el router-link
    const isActive = (path, includeChildren = false) => {
      const isActiveRoute = includeChildren 
        ? (route.path === path || route.path.startsWith(path + '/'))
        : route.path === path
      
      return isActiveRoute 
        ? 'bg-linear-to-r from-[rgba(93,162,113,0.1)] to-[rgba(93,162,113,0.05)] text-[#5DA271] border-r-3 border-r-[#5DA271]'
        : ''
    }

    const closeSidebar = () => {
      emit('close')
    }

    const closeSidebarOnMobile = () => {
      if (props.isMobileOpen) {
        closeSidebar()
      }
    }

    const handleLogout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
        // No es necesario recargar la página, el router ya maneja la navegación
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    return {
      userName,
      userRole,
      isActive,
      isActivePath,
      closeSidebar,
      closeSidebarOnMobile,
      handleLogout
    }
  }
}
</script>