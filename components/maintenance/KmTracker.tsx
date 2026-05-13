'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'
import { useMaintenance } from '@/hooks/useMaintenance'
import { formatKm } from '@/lib/utils'

export function KmDisplay() {
  const profile = useMaintenanceStore((s) => s.profile)
  const setKmInputOpen = useMaintenanceStore((s) => s.setKmInputOpen)

  if (!profile) return null

  return (
    <button
      onClick={() => setKmInputOpen(true)}
      className="group relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl hover:bg-white/[0.03] transition-colors"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.current_km}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-display-xl tabular-nums font-extralight text-content-primary tracking-tight"
          style={{ fontWeight: 200 }}
        >
          {formatKm(profile.current_km)}
        </motion.span>
      </AnimatePresence>

      <div className="flex items-center gap-1.5">
        <span className="text-label-md text-content-muted uppercase tracking-[0.14em]">
          Kilómetros
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          <EditIcon />
        </span>
      </div>
    </button>
  )
}

export function KmUpdateModal() {
  const isOpen = useMaintenanceStore((s) => s.isKmInputOpen)
  const setKmInputOpen = useMaintenanceStore((s) => s.setKmInputOpen)
  const profile = useMaintenanceStore((s) => s.profile)
  const { updateKm } = useMaintenance()

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus sin scroll — evita que iOS baje la página al abrir el modal
  useEffect(() => {
    if (!isOpen) return
    const id = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 80)
    return () => clearTimeout(id)
  }, [isOpen])

  const handleSubmit = async () => {
    const km = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (isNaN(km) || km < 0 || km > 999999) {
      setError('Ingresa una lectura de odómetro válida')
      return
    }
    if (profile && km < profile.last_service_km) {
      setError(`No puede ser menor al último servicio (${formatKm(profile.last_service_km)} km)`)
      return
    }
    setError('')
    setLoading(true)
    await updateKm(km)
    setLoading(false)
    setValue('')
    setKmInputOpen(false)
  }

  const handleClose = () => {
    setValue('')
    setError('')
    setKmInputOpen(false)
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="p-6">
        <p className="text-label-sm text-content-muted uppercase tracking-widest mb-1">Actualizar Odómetro</p>
        <h3 className="text-heading-xl text-content-primary mb-5">Kilómetros Actuales</h3>

        <div
          className={`relative flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-bg-surface border transition-colors ${
            error ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/60'
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={profile ? profile.current_km.toString() : '0'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 min-w-0 bg-transparent text-heading-xl font-light text-content-primary tabular-nums outline-none placeholder:text-content-dim"
          />
          <span className="text-label-md text-content-muted uppercase tracking-widest flex-shrink-0">km</span>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-label-md text-accent-red"
          >
            {error}
          </motion.p>
        )}

        {profile && (
          <p className="mt-3 text-label-sm text-content-muted">
            Lectura actual: {formatKm(profile.current_km)} km
          </p>
        )}

        <div className="flex gap-2 mt-5">
          <Button variant="ghost" size="lg" className="flex-1" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            loading={loading}
            disabled={!value}
            onClick={handleSubmit}
          >
            Actualizar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-content-muted">
      <path
        d="M 8.5 1.5 L 10.5 3.5 L 4 10 L 1.5 10.5 L 2 8 L 8.5 1.5 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
