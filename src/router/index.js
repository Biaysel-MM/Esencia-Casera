import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
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

// Guardia de navegación MÁS SIMPLE
router.beforeEach(async (to, from, next) => {
  console.log(`🛡️ Navegando a: ${to.name}`)
  
  const authStore = useAuthStore()
  
  // Si no hemos inicializado la autenticación, hazlo
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initAuth()
  }
  
  // Si la ruta requiere autenticación y no estamos autenticados
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login')
    next('/login')
  } 
  // Si estamos autenticados y tratamos de ir a login/register
  else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    console.log('✅ Ya autenticado, redirigiendo a home')
    next('/home')
  } 
  // Todo bien, permite la navegación
  else {
    console.log('✅ Navegación permitida')
    next()
  }
})

export default router