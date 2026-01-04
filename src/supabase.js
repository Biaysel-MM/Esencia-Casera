import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  console.log('URL:', supabaseUrl)
  console.log('KEY:', supabaseKey ? '✅ Presente' : '❌ Faltante')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Verificar conexión
supabase.auth.getSession().then(({ data }) => {
  console.log('🔗 Supabase conectado:', data.session ? '✅ Con sesión' : '✅ Sin sesión')
}).catch(err => {
  console.error('❌ Error conexión Supabase:', err)
})