<template>
  <router-view />
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  mounted() {
    // Inicializar autenticación cuando la app se monta
    const authStore = useAuthStore()
    authStore.initAuth()
  }
}
</script>