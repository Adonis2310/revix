'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createAdminClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function createUserAction(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const admin = getAdminClient()

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // confirma directamente, sin enviar email
  })

  if (error) return { error: error.message }
  return { error: null }
}
