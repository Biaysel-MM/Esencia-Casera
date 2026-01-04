<template>
  <div class="register-container">
    <div class="register-wrapper">
      <!-- Logo and Welcome -->
      <div class="logo-section">
        <div class="logo-circle">
          <span class="iconify" data-icon="mdi:chef-hat"></span>
        </div>
        <h1 class="app-name">Esencia Casera</h1>
        <p class="app-tagline">Únete a tu familia</p>
      </div>

      <!-- Register Card -->
      <div class="register-card">
        <h2 class="register-title">Crear Cuenta</h2>

        <!-- Tabs -->
        <div class="tabs-wrapper">
          <div class="tabs">
            <button 
              class="tab-button" 
              :class="{ 'active': role === 'admin' }"
              @click="role = 'admin'"
              type="button"
            >
              Crear Familia
            </button>
            <button 
              class="tab-button" 
              :class="{ 'active': role === 'familiar' }"
              @click="role = 'familiar'"
              type="button"
            >
              Unirse
            </button>
          </div>
          
          <div class="tab-content">
            <p v-if="role === 'admin'" class="tab-description">
              Crea una nueva familia y obtén un código para invitar a tus familiares
            </p>
            <p v-if="role === 'familiar'" class="tab-description">
              Únete a una familia existente usando el código de invitación
            </p>
          </div>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div v-if="error" class="error-message">
            <span class="iconify" data-icon="mdi:alert-circle"></span>
            <span class="error-text">{{ error }}</span>
          </div>

          <div class="input-group">
            <label class="input-label">Nombre completo</label>
            <div class="input-with-icon">
              <span class="iconify input-left-icon" data-icon="mdi:account"></span>
<input 
  type="text" 
  class="text-input"
  placeholder="María Contreras"
  v-model="form.name"
  required
  autocomplete="name"
/>
            </div>
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
  minlength="6"
  autocomplete="new-password"
/>
            </div>
          </div>

          <div v-if="role === 'familiar'" class="input-group">
            <label class="input-label">Código de familia</label>
            <div class="input-with-icon">
              <span class="iconify input-left-icon" data-icon="mdi:pound"></span>
              <input 
                type="text" 
                class="text-input"
                placeholder="FAM-2024-ABC"
                :value="familyCode"
                @input="formatFamilyCode"
                :required="role === 'familiar'"
              />
            </div>
            <p class="input-hint">
              Pide el código al administrador de tu familia
            </p>
          </div>

          <button 
            type="submit" 
            class="submit-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="iconify spin-icon" data-icon="mdi:loading"></span>
            <span v-else>Crear Cuenta</span>
          </button>
        </form>

        <div class="login-link">
          <p class="login-text">
            ¿Ya tienes cuenta? 
            <button type="button" class="link-button" @click="goToLogin">
              Inicia sesión
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
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { isLoading, error } = storeToRefs(authStore)
    
    const form = ref({
      email: '',
      password: '',
      name: '',
      familyCode: ''
    })
    
    const role = ref('admin')
    
    const formatFamilyCode = (event) => {
      form.value.familyCode = event.target.value.toUpperCase()
    }
    
    const handleRegister = async () => {
      const success = await authStore.register(
        form.value.email,
        form.value.password,
        form.value.name,
        role.value,
        role.value === 'familiar' ? form.value.familyCode : null
      )
      
      if (success) {
        // Mostrar mensaje de éxito y redirigir a login
        alert('¡Registro exitoso! Por favor inicia sesión.')
        router.push('/login')
      }
    }
    
    const goToLogin = () => {
      router.push('/login')
    }
    
    return {
      form,
      role,
      isLoading,
      error,
      formatFamilyCode,
      handleRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.15) 0%,
    rgba(245, 158, 11, 0.15) 50%,
    rgba(139, 92, 246, 0.15) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-wrapper {
  width: 100%;
  max-width: 450px;
}

/* Logo Section (reutilizado de Login) */
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

/* Register Card */
.register-card {
  background-color: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .register-card {
    padding: 32px;
  }
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin: 0 0 24px 0;
}

/* Tabs */
.tabs-wrapper {
  margin-bottom: 24px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  background-color: rgba(156, 163, 175, 0.1);
  padding: 4px;
  border-radius: 8px;
}

.tab-button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background-color: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-button:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.5);
}

.tab-content {
  margin-top: 16px;
}

.tab-description {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* Form (reutilizado de Login con modificaciones) */
.register-form {
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

.input-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 0;
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Login Link */
.login-link {
  margin-top: 24px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.login-text {
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
</style>