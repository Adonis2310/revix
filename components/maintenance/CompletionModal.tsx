'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'
import { useMaintenance } from '@/hooks/useMaintenance'
import { formatKm } from '@/lib/utils'
import { SERVICE_LABELS } from '@/lib/maintenance/schedule'

interface CompletionModalProps {
  onSuccess?: () => void
}

export function CompletionModal({ onSuccess }: CompletionModalProps) {
  const isOpen = useMaintenanceStore((s) => s.isCompletionModalOpen)
  const setModalOpen = useMaintenanceStore((s) => s.setCompletionModalOpen)
  const cards = useMaintenanceStore((s) => s.cards)
  const profile = useMaintenanceStore((s) => s.profile)
  const completedTaskIds = useMaintenanceStore((s) => s.completedTaskIds)

  const { completeService } = useMaintenance()
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const activeCard = cards.find((c) => c.isActive)
  if (!activeCard || !profile) return null

  const tasksDoneCount = [...completedTaskIds].filter((id) =>
    activeCard.tasks.some((t) => t.id === id)
  ).length

  const handleConfirm = async () => {
    setLoading(true)
    const session = await completeService(
      activeCard.milestoneKm,
      activeCard.serviceType,
      notes || undefined
    )
    setLoading(false)
    if (session) {
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setNotes('')
        setModalOpen(false)
        onSuccess?.()
      }, 1800)
    }
  }

  const handleClose = () => {
    if (!loading && !done) {
      setNotes('')
      setModalOpen(false)
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose} closeOnBackdrop={!loading && !done}>
      <div className="p-6 relative overflow-hidden">
        {/* Success celebration overlay */}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-bg-elevated z-10 rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="w-16 h-16 rounded-full bg-accent-green/15 border border-accent-green/30 flex items-center justify-center mb-4"
            >
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path
                  d="M 2 12 L 9 19 L 26 2"
                  stroke="#00D97E"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-heading-lg text-accent-green font-semibold"
            >
              Servicio Registrado
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-label-md text-content-muted mt-1.5 uppercase tracking-widest"
            >
              {formatKm(activeCard.milestoneKm)} km — odómetro {profile.current_km.toLocaleString()} km
            </motion.p>
          </motion.div>
        )}

        {/* Header */}
        <p className="text-label-sm text-content-muted uppercase tracking-[0.14em] mb-1">
          Confirmar Servicio
        </p>
        <h3 className="text-heading-xl text-content-primary mb-1">
          Servicio {formatKm(activeCard.milestoneKm)} km
        </h3>
        <p className="text-label-md text-content-muted mb-5">
          {SERVICE_LABELS[activeCard.serviceType]} · {tasksDoneCount} tareas completadas
        </p>

        {/* Service summary */}
        <div className="bg-bg-surface border border-line rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-line">
            <span className="text-label-md text-content-muted uppercase tracking-widest">Odómetro</span>
            <span className="text-body-md font-semibold text-content-primary tabular-nums">
              {formatKm(profile.current_km)} km
            </span>
          </div>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-line">
            <span className="text-label-md text-content-muted uppercase tracking-widest">Hito</span>
            <span className="text-body-md font-semibold text-content-primary tabular-nums">
              {formatKm(activeCard.milestoneKm)} km
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-md text-content-muted uppercase tracking-widest">Próximo</span>
            <span className="text-body-md font-semibold text-accent-blue tabular-nums">
              {formatKm(activeCard.milestoneKm + 2000)} km
            </span>
          </div>
        </div>

        {/* Completed tasks list */}
        <div className="mb-4 max-h-36 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {activeCard.tasks.map((task) => {
              const done = completedTaskIds.has(task.id)
              return (
                <div key={task.id} className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-accent-green' : 'bg-bg-surface border border-line'
                    }`}
                  >
                    {done && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M 1 3 L 3 5 L 7 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-body-md ${done ? 'text-content-secondary' : 'text-content-muted line-through'}`}
                  >
                    {task.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <textarea
          placeholder="Agregar notas (opcional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-bg-surface border border-line rounded-2xl px-3 py-2.5 text-body-md text-content-primary placeholder:text-content-dim outline-none focus:border-line-strong resize-none mb-4 transition-colors"
        />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="ghost" size="lg" className="flex-1" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="success" size="lg" className="flex-1" loading={loading} onClick={handleConfirm}>
            Confirmar Servicio
          </Button>
        </div>
      </div>
    </Modal>
  )
}
