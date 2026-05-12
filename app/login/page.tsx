'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RevixLogo } from '@/components/logo/RevixLogo'
import { Button } from '@/components/ui/Button'

type AuthMode = 'magic' | 'password'
type AuthStep = 'input' | 'sent'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('magic')
  const [step, setStep] = useState<AuthStep>('input')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleMagicLink = async () => {
    if (!email) return setError('Enter your email address')
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setStep('sent')
    }
  }

  const handlePasswordAuth = async () => {
    if (!email) return setError('Enter your email address')
    if (!password) return setError('Enter your password')
    setError('')
    setLoading(true)

    // Try sign in first, then sign up
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError?.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
      setStep('sent')
    } else if (signInError) {
      setError(signInError.message)
    } else {
      window.location.href = '/dashboard'
    }

    setLoading(false)
  }

  const handleSubmit = () => {
    if (mode === 'magic') handleMagicLink()
    else handlePasswordAuth()
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambiance */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-accent-blue/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gradient-radial from-accent-cyan/4 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[380px] relative z-10">
        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
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
                <h2 className="text-heading-md text-content-primary mb-1">Sign in</h2>
                <p className="text-body-md text-content-secondary mb-5">
                  Your maintenance history lives in the cloud.
                </p>

                {/* Mode toggle */}
                <div className="flex gap-1 p-1 rounded-xl bg-bg-surface border border-line mb-4">
                  {(['magic', 'password'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError('') }}
                      className={`flex-1 py-1.5 rounded-lg text-label-md transition-all duration-200 ${
                        mode === m
                          ? 'bg-bg-elevated text-content-primary border border-line shadow-sm'
                          : 'text-content-secondary hover:text-content-primary'
                      }`}
                    >
                      {m === 'magic' ? 'Magic Link' : 'Password'}
                    </button>
                  ))}
                </div>

                {/* Email input */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-3 rounded-xl bg-bg-surface border transition-colors mb-3 ${
                    error && !password ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
                  }`}
                >
                  <MailIcon />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-transparent text-body-md text-content-primary placeholder:text-content-dim outline-none"
                  />
                </div>

                {/* Password input (password mode only) */}
                <AnimatePresence>
                  {mode === 'password' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mb-3"
                    >
                      <div
                        className={`flex items-center gap-2 px-3.5 py-3 rounded-xl bg-bg-surface border transition-colors ${
                          error ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
                        }`}
                      >
                        <LockIcon />
                        <input
                          type="password"
                          autoComplete="current-password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                          className="flex-1 bg-transparent text-body-md text-content-primary placeholder:text-content-dim outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
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
                  onClick={handleSubmit}
                >
                  {mode === 'magic' ? 'Send Magic Link' : 'Continue'}
                </Button>
              </motion.div>

              <p className="text-center text-label-sm text-content-dim mt-5">
                Revix · Honda XR150L Maintenance Tracker
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mb-5">
                <MailSentIcon />
              </div>
              <h2 className="text-heading-xl text-content-primary mb-2">Check your email</h2>
              <p className="text-body-md text-content-secondary mb-1">
                We sent a {mode === 'magic' ? 'magic link' : 'confirmation'} to
              </p>
              <p className="text-body-md font-medium text-content-primary mb-6">{email}</p>
              <Button
                variant="ghost"
                size="md"
                onClick={() => { setStep('input'); setError('') }}
              >
                Use a different email
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-content-muted flex-shrink-0">
      <rect x="1" y="1" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M 1.5 2 L 8 7 L 14.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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

function MailSentIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-accent-blue">
      <rect x="1" y="1" width="26" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M 1.5 3 L 14 13 L 26.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
