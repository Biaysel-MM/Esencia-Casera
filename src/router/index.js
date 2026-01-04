import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'  // Redirigir raíz a login
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/planificador',
    name: 'planificador',
    component: () => import('@/views/PlanificadorView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lista-compras',
    name: 'lista de compras',
    component: () => import('@/views/ListaComprasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recetas',
    name: 'recetas',
    component: () => import('@/views/RecetasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favoritas',
    name: 'favoritas',
    component: () => import('@/views/FavoritasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/familia',
    name: 'familia',
    component: () => import('@/views/FamiliaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracion',
    name: 'configuracion',
    component: () => import('@/views/ConfiguracionView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/familiar-dashboard',
    name: 'familiar dashboard',
    component: () => import('@/views/FamiliarDashboardView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guardia de navegación simplificada
router.beforeEach(async (to, from, next) => {
  console.log('Navigation guard:', to.name)
  
  // Importar el store
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()
  
  // Si no hay usuario y no está cargando, inicializar
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initAuth()
  }
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Redirecting to login (requires auth)')
    next('/login')
  } 
  // Si está autenticado y trata de ir a login/register
  else if (to.meta.hideForAuth && authStore.isAuthenticated) {
    console.log('Redirecting to home (already authenticated)')
    next('/home')
  } 
  else {
    console.log('Navigation allowed')
    next()
  }
})

export default router