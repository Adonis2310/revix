'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RevixLogo } from '@/components/logo/RevixLogo'
import { Button } from '@/components/ui/Button'
import { createUserAction } from '@/app/actions/auth'

const FAKE_DOMAIN = '@revix.local'

function toEmail(username: string) {
  return username.trim().toLowerCase() + FAKE_DOMAIN
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async () => {
    const u = username.trim()
    const p = password

    if (!u) return setError('Ingresa un nombre de usuario')
    if (p.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')

    setError('')
    setLoading(true)

    const email = toEmail(u)

    // Intenta iniciar sesión primero
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: p })

    if (!signInError) {
      window.location.href = '/dashboard'
      return
    }

    // Si las credenciales no existen, crea la cuenta
    if (signInError.message.toLowerCase().includes('invalid login credentials')) {
      // Crea el usuario desde el servidor sin enviar ningún email
      const { error: createError } = await createUserAction(email, p)
      if (createError) {
        setError(createError)
        setLoading(false)
        return
      }

      // Inicia sesión con la cuenta recién creada
      const { error: retryError } = await supabase.auth.signInWithPassword({ email, password: p })
      if (retryError) {
        setError('Cuenta creada. Intenta iniciar sesión de nuevo.')
        setLoading(false)
        return
      }

      window.location.href = '/dashboard'
      return
    }

    setError('Contraseña incorrecta.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambiance */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-accent-blue/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gradient-radial from-accent-cyan/4 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[380px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
            >
              <RevixLogo size={44} glow />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center"
            >
              <h1 className="text-heading-xl text-content-primary tracking-tight">Revix</h1>
              <p className="text-label-sm text-content-muted uppercase tracking-[0.16em] mt-1">
                Honda XR150L 2025
              </p>
            </motion.div>
          </div>

          {/* Auth card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 26 }}
            className="bg-bg-elevated border border-line rounded-3xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
          >
            <h2 className="text-heading-md text-content-primary mb-1">Acceder</h2>
            <p className="text-body-md text-content-secondary mb-5">
              Si no tienes cuenta, se crea automáticamente.
            </p>

            {/* Username */}
            <div
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-bg-surface border transition-colors mb-3 ${
                error && !password ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
              }`}
            >
              <UserIcon />
              <input
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="Usuario"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-transparent text-body-md text-content-primary placeholder:text-content-dim outline-none"
              />
            </div>

            {/* Password */}
            <div
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-bg-surface border transition-colors mb-4 ${
                error ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
              }`}
            >
              <LockIcon />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-transparent text-body-md text-content-primary placeholder:text-content-dim outline-none"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-label-md text-accent-red mb-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!username || !password}
              onClick={handleSubmit}
            >
              Entrar
            </Button>
          </motion.div>

          <p className="text-center text-label-sm text-content-dim mt-5">
            Revix · Honda XR150L Maintenance Tracker
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-content-muted flex-shrink-0">
      <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M 1.5 14 C 1.5 10.5 13.5 10.5 13.5 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" className="text-content-muted flex-shrink-0">
      <rect x="1.5" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M 3.5 6 L 3.5 4 C 3.5 2 9.5 2 9.5 4 L 9.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
