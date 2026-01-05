import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Verificar variables
console.log('🔧 Supabase URL:', supabaseUrl)
console.log('🔧 Supabase Key present:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR CRÍTICO: Faltan variables de entorno')
  alert('Error de configuración: Verifica las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test de conexión inmediato
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Error de conexión a Supabase:', error.message)
  } else {
    console.log('✅ Conexión a Supabase exitosa')
    console.log('📊 Sesión actual:', data.session ? 'ACTIVA' : 'INACTIVA')
  }
})