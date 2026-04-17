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
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/planificador',
    name: 'planificador',
    component: () => import('@/views/PlanificadorView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/lista-compras',
    name: 'lista de compras',
    component: () => import('@/views/ListaComprasView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/recetas',
    name: 'recetas',
    component: () => import('@/views/RecetasView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/favoritas',
    name: 'favoritas',
    component: () => import('@/views/FavoritasView.vue'),
    meta: { requiresAuth: true } // Accesible para ambos roles
  },
  {
    path: '/familia',
    name: 'familia',
    component: () => import('@/views/FamiliaView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/configuracion',
    name: 'configuracion',
    component: () => import('@/views/ConfiguracionView.vue'),
    meta: { requiresAuth: true } // Accesible para ambos roles
  },
  {
    path: '/familiar-dashboard',
    name: 'familiar dashboard',
    component: () => import('@/views/FamiliarDashboardView.vue'),
    meta: { requiresAuth: true, requiresFamily: true }
  }, {
    path: '/crear-receta',
    name: 'crear-receta',
    component: () => import('@/views/CrearRecetaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/receta/:id',
    name: 'ver-receta',
    component: () => import('@/views/VerRecetaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guardia de navegación con roles
router.beforeEach(async (to, from, next) => {
  console.log(`🛡️ Navegando a: ${to.name}`)

  const authStore = useAuthStore()

  // Si no hemos inicializado la autenticación, hazlo
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initAuth()
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login')
    next('/login')
    return
  }

  // Verificar si está autenticado y trata de ir a login/register
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    console.log('✅ Ya autenticado, redirigiendo según rol')
    if (authStore.userRole === 'admin') {
      next('/home')
    } else {
      next('/familiar-dashboard')
    }
    return
  }

  // Verificar permisos de admin
  if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
    console.log('❌ Acceso denegado: Se requiere rol de admin')
    alert('No tienes permisos para acceder a esta sección')
    next('/familiar-dashboard')
    return
  }

  // Verificar permisos de familiar (si se especifica)
  if (to.meta.requiresFamily && authStore.userRole !== 'familiar') {
    console.log('❌ Acceso denegado: Se requiere rol de familiar')
    alert('Esta sección es solo para familiares')
    next('/home')
    return
  }

  // Todo bien, permite la navegación
  console.log('✅ Navegación permitida')
  next()
})

export default router