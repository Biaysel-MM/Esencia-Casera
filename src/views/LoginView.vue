<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Logo and Welcome -->
      <div class="logo-section">
        <div class="logo-circle">
          <span class="iconify" data-icon="mdi:chef-hat"></span>
        </div>
        <h1 class="app-name">Esencia Casera</h1>
        <p class="app-tagline">Tu cocina inteligente</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <h2 class="login-title">Iniciar Sesión</h2>

        <form class="login-form" @submit.prevent="handleLogin">
          <div v-if="error" class="error-message">
            <span class="iconify" data-icon="mdi:alert-circle"></span>
            <span class="error-text">{{ error }}</span>
          </div>

          <div class="input-group">
            <label class="input-label">Email</label>
            <div class="input-with-icon">
              <span class="iconify input-left-icon" data-icon="mdi:email"></span>
              <input 
                type="email" 
                class="text-input"
                placeholder="tu@email.com"
                v-model="form.email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <div class="input-with-icon">
              <span class="iconify input-left-icon" data-icon="mdi:lock"></span>
              <input 
                type="password" 
                class="text-input"
                placeholder="••••••••"
                v-model="form.password"
                required
                autocomplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            class="submit-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="iconify spin-icon" data-icon="mdi:loading"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <div class="register-link">
          <p class="register-text">
            ¿No tienes cuenta? 
            <button type="button" class="link-button" @click="goToRegister">
              Regístrate aquí
            </button>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { isLoading, error } = storeToRefs(authStore)
    
    // CAMBIAR ESTO: Eliminar valores por defecto
    const form = ref({
      email: '',  // Ahora vacío
      password: ''
    })
    
    const handleLogin = async () => {
      console.log('Login form submitted')
      const success = await authStore.login(form.value.email, form.value.password)
      
      if (success) {
        console.log('Login successful, redirecting...')
        router.push('/home')
      } else {
        console.log('Login failed')
      }
    }
    
    const goToRegister = () => {
      console.log('Going to register')
      router.push('/register')
    }
    
    return {
      form,
      isLoading,
      error,
      handleLogin,
      goToRegister
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.15) 0%,
      rgba(245, 158, 11, 0.15) 50%,
      rgba(139, 92, 246, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 450px;
}

/* Logo Section */
.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background-color: #10b981;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.logo-circle .iconify {
  font-size: 48px;
  color: white;
}

.app-name {
  font-size: 36px;
  color: #10b981;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.app-tagline {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* Login Card */
.login-card {
  background-color: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .login-card {
    padding: 32px;
  }
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin: 0 0 24px 0;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
}

.error-message .iconify {
  font-size: 20px;
  flex-shrink: 0;
}

.error-text {
  font-size: 14px;
  font-weight: 500;
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 500;
}

.input-with-icon {
  position: relative;
}

.input-left-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #9ca3af;
}

.text-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #111827;
  font-size: 16px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.text-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.text-input::placeholder {
  color: #9ca3af;
}

/* Submit Button */
.submit-button {
  width: 100%;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  background-color: #0da271;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin-icon {
  animation: spin 1s linear infinite;
  font-size: 20px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Register Link */
.register-link {
  margin-top: 24px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.register-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.link-button {
  color: #10b981;
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.link-button:hover {
  text-decoration: underline;
}

/* Demo Credentials */
.demo-credentials {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.demo-title {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-account {
  background-color: rgba(245, 158, 11, 0.1);
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  line-height: 1.4;
}

.demo-role {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #111827;
}

.demo-email,
.demo-password {
  margin: 2px 0;
  color: #374151;
}

.admin-account {
  background-color: rgba(16, 185, 129, 0.1);
}

.familiar-account {
  background-color: rgba(139, 92, 246, 0.1);
}
</style>