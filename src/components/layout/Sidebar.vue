
<template>
  <aside class="sidebar" :class="{ 'mobile-open': isMobileOpen }">
    <!-- Close button for mobile -->
    <button v-if="isMobileOpen" class="sidebar-close" @click="closeSidebar">
      <span class="iconify" data-icon="mdi:close"></span>
    </button>

    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <span class="iconify" data-icon="mdi:chef-hat"></span>
      </div>
      <h2 class="logo-text">Esencia Casera</h2>
    </div>

    <!-- User Info -->
    <div class="sidebar-user">
      <div class="user-avatar">
        <span class="iconify" data-icon="mdi:account-circle"></span>
      </div>
      <div class="user-info">
        <p class="user-name">{{ userName || 'Usuario' }}</p>
        <p class="user-role" :class="userRole">
          {{ userRole === 'admin' ? 'Administrador' : 'Familiar' }}
        </p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <!-- Inicio para ambos roles -->
        <li class="nav-item">
          <router-link 
            :to="userRole === 'admin' ? '/home' : '/familiar-dashboard'" 
            class="nav-link"
            :class="{ 'active': $route.path === (userRole === 'admin' ? '/home' : '/familiar-dashboard') }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:home"></span>
            <span class="nav-text">Inicio</span>
          </router-link>
        </li>

        <!-- Solo para admin -->
        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            to="/planificador" 
            class="nav-link"
            :class="{ 'active': $route.path === '/planificador' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:calendar"></span>
            <span class="nav-text">Planificador</span>
          </router-link>
        </li>

        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            to="/lista-compras" 
            class="nav-link"
            :class="{ 'active': $route.path === '/lista-compras' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:cart"></span>
            <span class="nav-text">Lista de Compras</span>
            <span class="nav-badge">3</span>
          </router-link>
        </li>

        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            to="/recetas" 
            class="nav-link"
            :class="{ 'active': $route.path === '/recetas' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:book-open"></span>
            <span class="nav-text">Recetas</span>
          </router-link>
        </li>

        <!-- Para ambos roles -->
        <li class="nav-item">
          <router-link 
            to="/favoritas" 
            class="nav-link"
            :class="{ 'active': $route.path === '/favoritas' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:heart"></span>
            <span class="nav-text">Favoritas</span>
          </router-link>
        </li>

        <!-- Solo para admin -->
        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            to="/familia" 
            class="nav-link"
            :class="{ 'active': $route.path === '/familia' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:account-group"></span>
            <span class="nav-text">Familia</span>
          </router-link>
        </li>

        <!-- Para ambos roles -->
        <li class="nav-item">
          <router-link 
            to="/configuracion" 
            class="nav-link"
            :class="{ 'active': $route.path === '/configuracion' }"
            @click="closeSidebarOnMobile"
          >
            <span class="iconify nav-icon" data-icon="mdi:cog"></span>
            <span class="nav-text">Configuración</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <span class="iconify" data-icon="mdi:logout"></span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
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
    const authStore = useAuthStore()
    
    const { userName, userRole } = storeToRefs(authStore)

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
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    return {
      userName,
      userRole,
      closeSidebar,
      closeSidebarOnMobile,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Sidebar Base Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, var(--card) 0%, color-mix(in srgb, var(--card) 95%, black) 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Logo */
.sidebar-logo {
  padding: 24px 20px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon .iconify {
  font-size: 24px;
  color: white;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* User Info */
.sidebar-user {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar .iconify {
  font-size: 28px;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
}

.user-role.admin {
  background-color: rgba(93, 162, 113, 0.15);
  color: var(--primary);
}

.user-role.familiar {
  background-color: rgba(139, 177, 116, 0.15);
  color: var(--secondary);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--foreground);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background-color: var(--muted);
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(93, 162, 113, 0.1) 0%, rgba(93, 162, 113, 0.05) 100%);
  color: var(--primary);
  border-right: 3px solid var(--primary);
}

.nav-link.active .nav-icon {
  color: var(--primary);
}

.nav-icon {
  font-size: 22px;
  color: var(--muted-foreground);
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.nav-badge {
  background-color: var(--destructive);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Logout Button */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, var(--destructive) 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-btn .iconify {
  font-size: 18px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    width: 40px;
  height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--foreground);
    z-index: 10;
  }

  .sidebar-close:hover {
    background-color: var(--muted);
  }

  .sidebar-close .iconify {
    font-size: 24px;
  }
}
</style>
