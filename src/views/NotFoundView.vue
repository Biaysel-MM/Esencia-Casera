<!-- src/views/NotFoundView.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">
        <iconify-icon icon="mdi:alert-circle" class="icon"></iconify-icon>
      </div>
      <h1 class="error-title">404</h1>
      <h2 class="error-subtitle">Página no encontrada</h2>
      <p class="error-message">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <button @click="goHome" class="btn btn-primary">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-color) 0%, var(--accent-color) 100%);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 28rem;
}

.error-icon {
  font-size: 6rem;
  color: var(--muted-color);
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.error-subtitle {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--muted-color);
  margin-bottom: 2rem;
  line-height: 1.6;
}
</style>