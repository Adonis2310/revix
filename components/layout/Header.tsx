'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RevixWordmark } from '@/components/logo/RevixLogo'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const profile = useMaintenanceStore((s) => s.profile)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 bg-bg-base/80 backdrop-blur-xl border-b border-line" />

      <div className="relative flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <RevixWordmark size="md" />

        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-elevated border border-line">
              <span className="text-label-md text-content-muted uppercase tracking-widest">km</span>
              <span className="text-[13px] font-semibold text-content-primary tabular-nums">
                {profile.current_km.toLocaleString()}
              </span>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-bg-elevated border border-line flex items-center justify-center hover:border-line-strong transition-colors"
              aria-label="Menu"
            >
              <AccountIcon />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute right-0 top-10 z-20 w-48 py-1.5 rounded-2xl bg-bg-elevated border border-line shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                  >
                    <div className="px-3 py-2 border-b border-line mb-1">
                      <p className="text-label-sm uppercase text-content-muted">Honda XR150L 2025</p>

                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-body-md text-content-secondary hover:text-content-primary hover:bg-bg-card transition-colors rounded-xl mx-1 w-[calc(100%-8px)]"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

function AccountIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" className="text-content-secondary" />
      <path
        d="M 2 12.5 C 2 9.5 12 9.5 12 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="text-content-secondary"
      />
    </svg>
  )
}
