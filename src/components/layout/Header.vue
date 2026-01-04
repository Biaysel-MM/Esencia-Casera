<template>
  <header class="app-header">
    <div class="header-left">
      <!-- Hamburger Menu Button -->
      <button class="hamburger-btn" @click="toggleMobileMenu">
        <span class="iconify" data-icon="mdi:menu"></span>
      </button>

      <!-- Search Bar -->
      <div class="search-bar">
        <span class="iconify search-icon" data-icon="mdi:magnify"></span>
        <input 
          type="text" 
          placeholder="Buscar recetas, ingredientes..."
          class="search-input"
          v-model="searchQuery"
        />
      </div>
    </div>
    
    <div class="header-right">
      <!-- Weather Widget -->
      <div class="weather-widget">
        <span class="iconify weather-icon" data-icon="mdi:partly-cloudy"></span>
        <div class="weather-info">
          <span class="weather-temp">22°C</span>
          <span class="weather-location">Madrid</span>
        </div>
      </div>
      
      <!-- Notifications -->
      <div class="notifications-dropdown">
        <button class="notification-btn" @click="toggleNotifications">
          <span class="iconify" data-icon="mdi:bell-outline"></span>
          <span class="notification-badge">3</span>
        </button>
        
        <div v-if="showNotifications" class="notifications-menu">
          <div class="notifications-header">
            <h3>Notificaciones</h3>
            <button class="mark-all-read">Marcar todas</button>
          </div>
          <div class="notifications-list">
            <!-- Notification items here -->
          </div>
        </div>
      </div>
      
      <!-- User Avatar -->
      <div class="user-avatar-header" @click="toggleUserMenu">
        <div class="avatar-circle">
          <span class="iconify" data-icon="mdi:account-circle"></span>
        </div>
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-menu-header">
            <p class="user-email">{{ userEmail }}</p>
            <p class="user-role-display" :class="userRole">
              {{ userRole === 'admin' ? 'Administrador' : 'Familiar' }}
            </p>
          </div>
          <button class="user-menu-item" @click="handleLogout">
            <span class="iconify" data-icon="mdi:logout"></span>
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
        // Force redirect
        window.location.href = '/login'
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    // Close menus when clicking outside
    const closeMenus = (event) => {
      if (!event.target.closest('.notifications-dropdown')) {
        showNotifications.value = false
      }
      if (!event.target.closest('.user-avatar-header')) {
        showUserMenu.value = false
      }
    }
    
    // Add event listener for clicks outside
    document.addEventListener('click', closeMenus)
    
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

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 70px;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  z-index: 900;
  transition: left 0.3s ease-in-out;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Hamburger Button */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);
  transition: all 0.2s;
}

.hamburger-btn:hover {
  background-color: var(--muted);
  transform: scale(1.05);
}

.hamburger-btn .iconify {
  font-size: 26px;
}

/* Search Bar */
.search-bar {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--muted-foreground);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  font-weight: 400;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.search-input::placeholder {
  color: var(--muted-foreground);
  font-weight: 400;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Weather Widget */
.weather-widget {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(93, 162, 113, 0.1) 0%, rgba(139, 177, 116, 0.1) 100%);
  cursor: pointer;
  transition: all 0.2s;
}

.weather-widget:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.weather-icon {
  font-size: 26px;
  color: var(--primary);
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.2;
}

.weather-location {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.2;
}

/* Notifications */
.notifications-dropdown {
  position: relative;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);
  transition: all 0.2s;
}

.notification-btn:hover {
  background-color: var(--muted);
  transform: scale(1.05);
}

.notification-btn .iconify {
  font-size: 24px;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, var(--destructive) 0%, #dc2626 100%);
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--card);
}

.notifications-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 320px;
  background-color: var(--card);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.notifications-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.mark-all-read:hover {
  background-color: rgba(93, 162, 113, 0.1);
}

/* User Avatar */
.user-avatar-header {
  position: relative;
  cursor: pointer;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.user-avatar-header:hover .avatar-circle {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(93, 162, 113, 0.3);
}

.avatar-circle .iconify {
  font-size: 26px;
  color: white;
}

.user-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 220px;
  background-color: var(--card);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border);
  z-index: 1000;
  overflow: hidden;
}

.user-menu-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.user-email {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0 0 6px 0;
  font-weight: 400;
}

.user-role-display {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.user-role-display.admin {
  background-color: rgba(93, 162, 113, 0.15);
  color: var(--primary);
}

.user-role-display.familiar {
  background-color: rgba(139, 177, 116, 0.15);
  color: var(--secondary);
}

.user-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: none;
  border: none;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-item:hover {
  background-color: var(--muted);
}

.user-menu-item .iconify {
  font-size: 18px;
  color: var(--muted-foreground);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .search-bar {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
    height: 64px;
    left: 0;
    right: 0;
  }

  .hamburger-btn {
    display: flex;
  }

  .search-bar {
    display: none;
  }

  .weather-widget {
    display: none;
  }

  .header-right {
    gap: 12px;
  }

  .notification-btn,
  .avatar-circle {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .notifications-menu {
    width: 280px;
    right: -10px;
  }

  .user-menu {
    width: 200px;
    right: -10px;
  }
}
</style>