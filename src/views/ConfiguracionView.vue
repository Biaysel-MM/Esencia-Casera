<template>
  <div class="min-h-screen bg-[#F6F9F6]" :class="{ 'max-md:overflow-hidden': isMobileMenuOpen }">
    <!-- Sidebar - Fixed position -->
    <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" class="fixed left-0 top-0 z-1000 h-screen w-65 border-r border-[rgba(0,0,0,0.08)] bg-white transition-transform duration-300 ease-in-out max-md:w-70 max-md:-translate-x-full" :class="{ 'max-md:translate-x-0': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="min-h-screen bg-[#F6F9F6] transition-all duration-300 max-md:ml-0 md:ml-65">
      <Header @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" class="fixed left-65 right-0 top-0 z-900 h-17.5 border-b border-[rgba(0,0,0,0.08)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 max-md:left-0 max-md:h-16" />

      <!-- Scrollable Content -->
      <main class="min-h-[calc(100vh-70px)] overflow-y-auto bg-[#F6F9F6] pt-17.5 max-md:pt-16">
        <div class="mx-auto w-full max-w-300 p-5 md:p-6">
          <div class="mx-auto max-w-300">
            <!-- Header -->
            <div class="mb-8">
              <div class="flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(93,162,113,0.2)]">
                  <span class="iconify h-6 w-6 text-[#5DA271]" data-icon="mdi:cog"></span>
                </div>
                <div>
                  <h1 class="mb-1 text-2xl font-semibold text-[#2C2C2C]">Configuración</h1>
                  <p class="text-sm text-[#6C7A6C]">Personaliza tu experiencia en Esencia Casera</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <!-- Main Settings -->
              <div class="lg:col-span-2">
                <!-- Profile Settings -->
                <div class="mb-6 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(93,162,113,0.2)]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:account"></span>
                    </div>
                    <h3 class="text-lg font-semibold text-[#2C2C2C]">Información personal</h3>
                  </div>

                  <div class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                      <label for="name" class="text-sm font-medium text-[#2C2C2C]">Nombre completo</label>
                      <input
                        id="name"
                        type="text"
                        v-model="userName"
                        class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-[15px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#6C7A6C] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                      />
                    </div>

                    <div class="flex flex-col gap-2">
                      <label for="email" class="text-sm font-medium text-[#2C2C2C]">Email</label>
                      <input
                        id="email"
                        type="email"
                        v-model="userEmail"
                        class="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-[15px] text-[#2C2C2C] transition-all duration-200 placeholder:text-[#6C7A6C] focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                      />
                    </div>

                    <div v-if="userRole === 'admin' && familyCode" class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-[#2C2C2C]">Código de familia</label>
                      <div class="rounded-xl border border-[rgba(93,162,113,0.2)] bg-[rgba(93,162,113,0.1)] p-4">
                        <p class="mb-1 text-base font-semibold text-[#5DA271]">{{ familyCode }}</p>
                        <p class="text-xs text-[#6C7A6C] leading-relaxed">
                          Comparte este código con tus familiares para que se unan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notifications Settings -->
                <div class="mb-6 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(93,162,113,0.2)]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:bell"></span>
                    </div>
                    <h3 class="text-lg font-semibold text-[#2C2C2C]">Notificaciones</h3>
                  </div>

                  <div class="flex flex-col gap-6">
                    <div class="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                      <div class="flex-1">
                        <label for="notifications" class="block text-sm font-medium text-[#2C2C2C]">Notificaciones push</label>
                        <p class="text-xs text-[#6C7A6C] leading-relaxed">Recibe alertas sobre ingredientes y recetas</p>
                      </div>
                      <div class="relative h-6 w-11">
                        <input
                          id="notifications"
                          type="checkbox"
                          v-model="notificationsEnabled"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="notifications" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>

                    <div class="h-px bg-[rgba(0,0,0,0.08)]"></div>

                    <div class="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                      <div class="flex-1">
                        <label for="email-reminders" class="block text-sm font-medium text-[#2C2C2C]">Recordatorios por email</label>
                        <p class="text-xs text-[#6C7A6C] leading-relaxed">Recibe resúmenes semanales de tu menú</p>
                      </div>
                      <div class="relative h-6 w-11">
                        <input
                          id="email-reminders"
                          type="checkbox"
                          v-model="emailReminders"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="email-reminders" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Preferences -->
                <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(93,162,113,0.2)]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:food"></span>
                    </div>
                    <h3 class="text-lg font-semibold text-[#2C2C2C]">Preferencias</h3>
                  </div>

                  <div class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                      <label for="servings" class="text-sm font-medium text-[#2C2C2C]">Porciones predeterminadas</label>
                      <div class="relative">
                        <select 
                          id="servings" 
                          v-model="defaultServings"
                          class="w-full appearance-none rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pr-10 text-[15px] text-[#2C2C2C] transition-all duration-200 focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                        >
                          <option value="1">1 persona</option>
                          <option value="2">2 personas</option>
                          <option value="4">4 personas</option>
                          <option value="6">6 personas</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6C7A6C]">
                          <span class="iconify h-5 w-5" data-icon="mdi:chevron-down"></span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col gap-2">
                      <label for="difficulty" class="text-sm font-medium text-[#2C2C2C]">Nivel de dificultad de recetas</label>
                      <div class="relative">
                        <select 
                          id="difficulty" 
                          v-model="recipeDifficulty"
                          class="w-full appearance-none rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 pr-10 text-[15px] text-[#2C2C2C] transition-all duration-200 focus:border-[#5DA271] focus:outline-none focus:ring-3 focus:ring-[rgba(93,162,113,0.2)]"
                        >
                          <option value="all">Todas</option>
                          <option value="easy">Fácil</option>
                          <option value="medium">Intermedio</option>
                          <option value="hard">Avanzado</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6C7A6C]">
                          <span class="iconify h-5 w-5" data-icon="mdi:chevron-down"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Settings Sidebar -->
              <div class="lg:col-span-1">
                <!-- Theme Settings -->
                <div class="mb-6 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(93,162,113,0.2)]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:palette"></span>
                    </div>
                    <h3 class="text-lg font-semibold text-[#2C2C2C]">Apariencia</h3>
                  </div>

                  <div class="flex items-center justify-between">
                    <label for="dark-mode" class="text-sm font-medium text-[#2C2C2C]">Modo oscuro</label>
                    <div class="relative h-6 w-11">
                      <input
                        id="dark-mode"
                        type="checkbox"
                        v-model="darkMode"
                        class="absolute h-0 w-0 opacity-0"
                        @change="toggleDarkMode"
                      />
                      <label for="dark-mode" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                    </div>
                  </div>
                </div>

                <!-- Dietary Restrictions -->
                <div class="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(93,162,113,0.2)]">
                      <span class="iconify h-4 w-4 text-[#5DA271]" data-icon="mdi:food-apple"></span>
                    </div>
                    <h3 class="text-lg font-semibold text-[#2C2C2C]">Restricciones</h3>
                  </div>

                  <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                      <label for="vegetarian" class="text-sm font-medium text-[#2C2C2C]">Vegetariano</label>
                      <div class="relative h-6 w-11">
                        <input
                          id="vegetarian"
                          type="checkbox"
                          v-model="vegetarian"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="vegetarian" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <label for="vegan" class="text-sm font-medium text-[#2C2C2C]">Vegano</label>
                      <div class="relative h-6 w-11">
                        <input
                          id="vegan"
                          type="checkbox"
                          v-model="vegan"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="vegan" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <label for="gluten-free" class="text-sm font-medium text-[#2C2C2C]">Sin gluten</label>
                      <div class="relative h-6 w-11">
                        <input
                          id="gluten-free"
                          type="checkbox"
                          v-model="glutenFree"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="gluten-free" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <label for="lactose-free" class="text-sm font-medium text-[#2C2C2C]">Sin lactosa</label>
                      <div class="relative h-6 w-11">
                        <input
                          id="lactose-free"
                          type="checkbox"
                          v-model="lactoseFree"
                          class="absolute h-0 w-0 opacity-0"
                        />
                        <label for="lactose-free" class="absolute inset-0 cursor-pointer rounded-full bg-[#D8EBD0] transition-all duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-[#5DA271] peer-checked:before:translate-x-5"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="mt-8 flex justify-end max-md:justify-center">
              <button @click="handleSave" class="cursor-pointer rounded-xl bg-[#5DA271] px-8 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-[rgba(93,162,113,0.9)]">
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
    const userRole = ref('admin')
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