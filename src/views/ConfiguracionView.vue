<!-- src/views/ConfiguracionView.vue -->
<template>
  <div class="configuracion-container" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="sidebar-fixed" />

    <!-- Main Content Area -->
    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': !isMobileMenuOpen }">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="header-fixed" />

      <!-- Scrollable Content -->
      <main class="content-main">
        <div class="content-container">
          <div class="configuracion-view">
            <!-- Header -->
            <div class="config-header">
              <div class="header-section">
                <div class="header-icon">
                  <span class="iconify" data-icon="mdi:cog"></span>
                </div>
                <div>
                  <h1 class="section-title">Configuración</h1>
                  <p class="section-subtitle">Personaliza tu experiencia en Esencia Casera</p>
                </div>
              </div>
            </div>

            <div class="settings-grid">
              <!-- Main Settings -->
              <div class="main-settings">
                <!-- Profile Settings -->
                <div class="settings-card">
                  <div class="settings-card-header">
                    <div class="settings-icon">
                      <span class="iconify" data-icon="mdi:account"></span>
                    </div>
                    <h3 class="settings-title">Información personal</h3>
                  </div>

                  <div class="settings-form">
                    <div class="form-group">
                      <label for="name" class="form-label">Nombre completo</label>
                      <input
                        id="name"
                        type="text"
                        v-model="userName"
                        class="form-input"
                      />
                    </div>

                    <div class="form-group">
                      <label for="email" class="form-label">Email</label>
                      <input
                        id="email"
                        type="email"
                        v-model="userEmail"
                        class="form-input"
                      />
                    </div>

                    <div v-if="userRole === 'admin' && familyCode" class="form-group">
                      <label class="form-label">Código de familia</label>
                      <div class="family-code-container">
                        <p class="family-code">{{ familyCode }}</p>
                        <p class="family-code-description">
                          Comparte este código con tus familiares para que se unan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notifications Settings -->
                <div class="settings-card">
                  <div class="settings-card-header">
                    <div class="settings-icon">
                      <span class="iconify" data-icon="mdi:bell"></span>
                    </div>
                    <h3 class="settings-title">Notificaciones</h3>
                  </div>

                  <div class="settings-form">
                    <div class="toggle-group">
                      <div class="toggle-label-group">
                        <label for="notifications" class="toggle-label">Notificaciones push</label>
                        <p class="toggle-description">Recibe alertas sobre ingredientes y recetas</p>
                      </div>
                      <div class="toggle-switch">
                        <input
                          id="notifications"
                          type="checkbox"
                          v-model="notificationsEnabled"
                          class="toggle-input"
                        />
                        <label for="notifications" class="toggle-slider"></label>
                      </div>
                    </div>

                    <div class="separator"></div>

                    <div class="toggle-group">
                      <div class="toggle-label-group">
                        <label for="email-reminders" class="toggle-label">Recordatorios por email</label>
                        <p class="toggle-description">Recibe resúmenes semanales de tu menú</p>
                      </div>
                      <div class="toggle-switch">
                        <input
                          id="email-reminders"
                          type="checkbox"
                          v-model="emailReminders"
                          class="toggle-input"
                        />
                        <label for="email-reminders" class="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Preferences -->
                <div class="settings-card">
                  <div class="settings-card-header">
                    <div class="settings-icon">
                      <span class="iconify" data-icon="mdi:food"></span>
                    </div>
                    <h3 class="settings-title">Preferencias</h3>
                  </div>

                  <div class="settings-form">
                    <div class="form-group">
                      <label for="servings" class="form-label">Porciones predeterminadas</label>
                      <div class="select-container">
                        <select 
                          id="servings" 
                          v-model="defaultServings"
                          class="select-input"
                        >
                          <option value="1">1 persona</option>
                          <option value="2">2 personas</option>
                          <option value="4" selected>4 personas</option>
                          <option value="6">6 personas</option>
                        </select>
                        <div class="select-arrow">
                          <span class="iconify" data-icon="mdi:chevron-down"></span>
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="difficulty" class="form-label">Nivel de dificultad de recetas</label>
                      <div class="select-container">
                        <select 
                          id="difficulty" 
                          v-model="recipeDifficulty"
                          class="select-input"
                        >
                          <option value="all" selected>Todas</option>
                          <option value="easy">Fácil</option>
                          <option value="medium">Intermedio</option>
                          <option value="hard">Avanzado</option>
                        </select>
                        <div class="select-arrow">
                          <span class="iconify" data-icon="mdi:chevron-down"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Settings Sidebar -->
              <div class="sidebar-settings">
                <!-- Theme Settings -->
                <div class="settings-card">
                  <div class="settings-card-header">
                    <div class="settings-icon">
                      <span class="iconify" data-icon="mdi:palette"></span>
                    </div>
                    <h3 class="settings-title">Apariencia</h3>
                  </div>

                  <div class="settings-form">
                    <div class="toggle-group">
                      <div class="toggle-label-group">
                        <label for="dark-mode" class="toggle-label">Modo oscuro</label>
                      </div>
                      <div class="toggle-switch">
                        <input
                          id="dark-mode"
                          type="checkbox"
                          v-model="darkMode"
                          class="toggle-input"
                          @change="toggleDarkMode"
                        />
                        <label for="dark-mode" class="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dietary Restrictions -->
                <div class="settings-card">
                  <div class="settings-card-header">
                    <div class="settings-icon">
                      <span class="iconify" data-icon="mdi:food-apple"></span>
                    </div>
                    <h3 class="settings-title">Restricciones</h3>
                  </div>

                  <div class="settings-form">
                    <div class="restriction-group">
                      <label for="vegetarian" class="restriction-label">Vegetariano</label>
                      <div class="toggle-switch">
                        <input
                          id="vegetarian"
                          type="checkbox"
                          v-model="vegetarian"
                          class="toggle-input"
                        />
                        <label for="vegetarian" class="toggle-slider"></label>
                      </div>
                    </div>

                    <div class="restriction-group">
                      <label for="vegan" class="restriction-label">Vegano</label>
                      <div class="toggle-switch">
                        <input
                          id="vegan"
                          type="checkbox"
                          v-model="vegan"
                          class="toggle-input"
                        />
                        <label for="vegan" class="toggle-slider"></label>
                      </div>
                    </div>

                    <div class="restriction-group">
                      <label for="gluten-free" class="restriction-label">Sin gluten</label>
                      <div class="toggle-switch">
                        <input
                          id="gluten-free"
                          type="checkbox"
                          v-model="glutenFree"
                          class="toggle-input"
                        />
                        <label for="gluten-free" class="toggle-slider"></label>
                      </div>
                    </div>

                    <div class="restriction-group">
                      <label for="lactose-free" class="restriction-label">Sin lactosa</label>
                      <div class="toggle-switch">
                        <input
                          id="lactose-free"
                          type="checkbox"
                          v-model="lactoseFree"
                          class="toggle-input"
                        />
                        <label for="lactose-free" class="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="save-section">
              <button @click="handleSave" class="save-btn">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

export default {
  name: 'ConfiguracionView',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    
    // Layout state
    const isMobileMenuOpen = ref(false)
    
    // User data
    const userName = ref('María García')
    const userEmail = ref('maria@ejemplo.com')
    const userRole = ref('admin') // 'admin' or 'familiar'
    const familyCode = ref('FAM-1234-ABCD')
    
    // Settings state
    const notificationsEnabled = ref(true)
    const emailReminders = ref(true)
    const darkMode = ref(false)
    const defaultServings = ref('4')
    const recipeDifficulty = ref('all')
    
    // Dietary restrictions
    const vegetarian = ref(false)
    const vegan = ref(false)
    const glutenFree = ref(false)
    const lactoseFree = ref(false)
    
    // Load saved config on mount
    onMounted(() => {
      loadSavedConfig()
    })
    
    const loadSavedConfig = () => {
      const saved = localStorage.getItem('esencia-casera-config')
      if (saved) {
        try {
          const config = JSON.parse(saved)
          
          notificationsEnabled.value = config.notificationsEnabled ?? true
          emailReminders.value = config.emailReminders ?? true
          darkMode.value = config.darkMode ?? false
          userName.value = config.userName || 'María García'
          userEmail.value = config.userEmail || 'maria@ejemplo.com'
          defaultServings.value = config.defaultServings || '4'
          recipeDifficulty.value = config.recipeDifficulty || 'all'
          vegetarian.value = config.vegetarian || false
          vegan.value = config.vegan || false
          glutenFree.value = config.glutenFree || false
          lactoseFree.value = config.lactoseFree || false
          
          // Apply dark mode if saved
          if (darkMode.value) {
            document.documentElement.classList.add('dark')
          }
        } catch (error) {
          console.error('Error loading config:', error)
        }
      }
    }
    
    const toggleDarkMode = () => {
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    const handleSave = () => {
      // Save to localStorage
      localStorage.setItem('esencia-casera-config', JSON.stringify({
        notificationsEnabled: notificationsEnabled.value,
        emailReminders: emailReminders.value,
        darkMode: darkMode.value,
        userName: userName.value,
        userEmail: userEmail.value,
        defaultServings: defaultServings.value,
        recipeDifficulty: recipeDifficulty.value,
        vegetarian: vegetarian.value,
        vegan: vegan.value,
        glutenFree: glutenFree.value,
        lactoseFree: lactoseFree.value
      }))
      
      // Show success message
      alert('✅ Configuración guardada correctamente')
    }
    
    // Layout functions
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }
    
    const handleLogout = async () => {
      // Aquí iría la lógica de logout
      console.log('Logout')
      router.push('/login')
    }
    
    return {
      isMobileMenuOpen,
      userName,
      userEmail,
      userRole,
      familyCode,
      notificationsEnabled,
      emailReminders,
      darkMode,
      defaultServings,
      recipeDifficulty,
      vegetarian,
      vegan,
      glutenFree,
      lactoseFree,
      toggleDarkMode,
      handleSave,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Layout - Igual que las otras vistas */
.configuracion-container {
  min-height: 100vh;
  background-color: var(--background);
}

.sidebar-fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  z-index: 1000;
  background-color: var(--card);
  border-right: 1px solid var(--border);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 70px;
  z-index: 900;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: left 0.3s ease-in-out;
}

.main-content-wrapper {
  margin-left: 260px;
  min-height: 100vh;
  background-color: var(--background);
  transition: margin-left 0.3s ease;
}

.content-main {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  overflow-y: auto;
  background-color: var(--background);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* Configuración View Styles */
.configuracion-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.config-header {
  margin-bottom: 32px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon .iconify {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .settings-grid {
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }
}

/* Settings Cards */
.settings-card {
  background-color: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.settings-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.settings-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(93, 162, 113, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon .iconify {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

/* Form Styles */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.form-input::placeholder {
  color: var(--muted-foreground);
}

/* Family Code */
.family-code-container {
  padding: 16px;
  background-color: rgba(93, 162, 113, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(93, 162, 113, 0.2);
}

.family-code {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 4px;
}

.family-code-description {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.4;
}

/* Toggle Switch Styles */
.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-label-group {
  flex: 1;
}

.toggle-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 2px;
}

.toggle-description {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.4;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--muted);
  border-radius: 24px;
  transition: .4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--primary);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 1px var(--primary);
}

/* Separator */
.separator {
  height: 1px;
  background-color: var(--border);
  margin: 16px 0;
}

/* Select Styles */
.select-container {
  position: relative;
  width: 100%;
}

.select-input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-size: 15px;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

.select-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(93, 162, 113, 0.1);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--muted-foreground);
}

.select-arrow .iconify {
  width: 20px;
  height: 20px;
}

/* Restriction Toggles */
.restriction-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.restriction-group:last-child {
  margin-bottom: 0;
}

.restriction-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

/* Save Button */
.save-section {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 14px 32px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  background-color: rgba(93, 162, 113, 0.9);
}

/* Responsive Styles */
@media (max-width: 768px) {
  /* Layout responsive */
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s ease;
  }
  
  .mobile-menu-open .sidebar-fixed {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }
  
  .header-fixed {
    left: 0;
    right: 0;
  }
  
  .main-content-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .content-container {
    padding: 16px;
  }
  
  /* Responsive específico */
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .settings-card {
    padding: 20px;
  }
  
  .settings-card-header {
    margin-bottom: 20px;
  }
  
  .save-section {
    justify-content: center;
  }
  
  .save-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 20px;
  }
  
  .settings-title {
    font-size: 16px;
  }
  
  .form-input,
  .select-input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .toggle-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .restriction-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Dark mode support */
:root.dark {
  --background: #1a1a1a;
  --foreground: #f8f9fa;
  --card: #2d2d2d;
  --primary: #5DA271;
  --secondary: #8BB174;
  --muted: #3a3a3a;
  --muted-foreground: #a0a0a0;
  --border: #404040;
  --input-background: #363636;
}
</style>