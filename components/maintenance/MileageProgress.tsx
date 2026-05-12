'use client'

import { motion } from 'framer-motion'
import { formatKm, getProgressPercent } from '@/lib/utils'
import { getKmRemaining } from '@/lib/maintenance/logic'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'

export function MileageProgress() {
  const profile = useMaintenanceStore((s) => s.profile)
  const cards = useMaintenanceStore((s) => s.cards)

  if (!profile) return null

  const activeCard = cards.find((c) => c.isActive)
  const nextServiceKm = activeCard?.milestoneKm ?? profile.last_service_km + 2000
  const progress = getProgressPercent(profile.last_service_km, profile.current_km, nextServiceKm)
  const kmRemaining = getKmRemaining(profile.current_km, nextServiceKm)
  const isOverdue = profile.current_km >= nextServiceKm

  return (
    <div className="px-6 py-4">
      {/* Km label row */}
      <div className="flex items-end justify-between mb-2.5 text-label-sm">
        <div>
          <p className="text-content-muted uppercase tracking-widest mb-0.5">Last Service</p>
          <p className="text-content-secondary font-mono tabular-nums">
            {formatKm(profile.last_service_km)} km
          </p>
        </div>
        <div className="text-right">
          <p className="text-content-muted uppercase tracking-widest mb-0.5">Next Service</p>
          <p
            className={
              isOverdue
                ? 'text-accent-red font-mono tabular-nums'
                : 'text-content-secondary font-mono tabular-nums'
            }
          >
            {formatKm(nextServiceKm)} km
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-bg-elevated rounded-full overflow-hidden border border-line">
        <motion.div
          className={isOverdue ? 'h-full bg-accent-red rounded-full' : 'h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full'}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.3 }}
        />

        {/* Glow pulse on progress head */}
        {progress > 2 && progress < 100 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/80"
            style={{ left: `calc(${progress}% - 4px)` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px] text-content-muted font-mono">
          {progress.toFixed(1)}% complete
        </p>
        <p
          className={`text-[11px] font-mono ${
            isOverdue
              ? 'text-accent-red'
              : kmRemaining < 300
              ? 'text-accent-orange'
              : 'text-content-muted'
          }`}
        >
          {isOverdue
            ? `${formatKm(profile.current_km - nextServiceKm)} km overdue`
            : `${formatKm(kmRemaining)} km remaining`}
        </p>
      </div>
    </div>
  )
}
