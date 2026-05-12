'use client'

import { motion } from 'framer-motion'
import { cn, formatKm } from '@/lib/utils'
import { getCompletionStats } from '@/lib/maintenance/logic'
import { SERVICE_LABELS } from '@/lib/maintenance/schedule'
import { TaskChecklist } from './TaskChecklist'
import { Button } from '@/components/ui/Button'
import type { MaintenanceCard as MaintenanceCardType } from '@/types/maintenance'

interface MaintenanceCardProps {
  card: MaintenanceCardType
  isCurrentlyActive?: boolean
  completedTaskIds: Set<string>
  onToggleTask: (taskId: string) => void
  onComplete: () => void
  width: number
}

export function MaintenanceCard({
  card,
  completedTaskIds,
  onToggleTask,
  onComplete,
  width,
}: MaintenanceCardProps) {
  const relevantCompleted = card.isActive
    ? new Set([...completedTaskIds].filter((id) => card.tasks.some((t) => t.id === id)))
    : new Set<string>()

  const completedCount = card.isCompleted
    ? card.tasks.length
    : relevantCompleted.size

  const stats = getCompletionStats(card.tasks.length, completedCount)
  const allTasksDone = completedCount === card.tasks.length && card.tasks.length > 0

  if (card.isLocked) {
    return (
      <LockedCard card={card} width={width} />
    )
  }

  if (card.isCompleted) {
    return (
      <CompletedCard card={card} width={width} completedCount={card.tasks.length} />
    )
  }

  // Active card
  return (
    <motion.div
      style={{ width }}
      className={cn(
        'flex-shrink-0 relative overflow-hidden',
        'rounded-3xl border border-line',
        'bg-bg-card',
        'shadow-card',
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      {/* Active blue accent stripe */}
      <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-accent-blue via-accent-blue/40 to-transparent" />

      <div className="p-5 pb-4">
        {/* Card header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-label-sm text-content-muted uppercase tracking-[0.14em] mb-1">
              {SERVICE_LABELS[card.serviceType]}
            </p>
            <h2 className="text-[28px] font-light tracking-tight text-content-primary tabular-nums">
              {formatKm(card.milestoneKm)}
              <span className="text-label-md text-content-muted ml-1.5 font-medium normal-case tracking-normal">km</span>
            </h2>
          </div>

          {/* Progress ring */}
          <ProgressBadge
            percent={stats.percent}
            label={stats.label}
            allDone={allTasksDone}
          />
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 bg-bg-surface rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'h-full rounded-full',
                allTasksDone ? 'bg-accent-green' : 'bg-accent-blue'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${stats.percent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 24, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-line mb-3" />

        {/* Task list */}
        <TaskChecklist
          tasks={card.tasks}
          completedTaskIds={relevantCompleted}
          onToggleTask={onToggleTask}
        />

        {/* Complete button */}
        <div className="mt-4 pt-3 border-t border-line">
          <motion.div
            animate={allTasksDone ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ repeat: allTasksDone ? Infinity : 0, duration: 2, ease: 'easeInOut' }}
          >
            <Button
              variant="success"
              size="lg"
              fullWidth
              disabled={!allTasksDone}
              onClick={onComplete}
              className={cn(
                'transition-all duration-300',
                allTasksDone && 'shadow-glow-green border-accent-green/40 bg-accent-green/15 text-accent-green'
              )}
            >
              {allTasksDone ? 'Completar Servicio' : `${card.tasks.length - completedCount} tareas pendientes`}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function ProgressBadge({
  percent,
  label,
  allDone,
}: {
  percent: number
  label: string
  allDone: boolean
}) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
          <circle
            cx="24" cy="24" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2.5"
          />
          <motion.circle
            cx="24" cy="24" r={r}
            fill="none"
            stroke={allDone ? '#00D97E' : '#0A5FFF'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-[10px] font-bold tabular-nums',
            allDone ? 'text-accent-green' : 'text-content-primary'
          )}>
            {percent}%
          </span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-content-muted">{label}</span>
    </div>
  )
}

function LockedCard({
  card,
  width,
}: {
  card: MaintenanceCardType
  width: number
}) {
  return (
    <motion.div
      style={{ width }}
      className={cn(
        'flex-shrink-0 relative overflow-hidden',
        'rounded-3xl border border-line',
        'bg-bg-card',
      )}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Blurred content */}
      <div className="p-5 blur-[2px] select-none pointer-events-none opacity-40">
        <p className="text-label-sm text-content-muted uppercase tracking-[0.14em] mb-1">
          {SERVICE_LABELS[card.serviceType]}
        </p>
        <h2 className="text-[28px] font-light tracking-tight text-content-primary tabular-nums mb-4">
          {formatKm(card.milestoneKm)}
          <span className="text-label-md text-content-muted ml-1.5">km</span>
        </h2>
        <div className="flex flex-col gap-2">
          {card.tasks.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-line" />
              <div className="h-2.5 bg-bg-elevated rounded-full flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-card/70 backdrop-blur-[1px]">
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-2xl bg-bg-elevated border border-line flex items-center justify-center">
            <LockIcon />
          </div>
          <div className="text-center">
            <p className="text-label-md text-content-muted uppercase tracking-widest mb-1">Bloqueado</p>
            <p className="text-label-sm text-content-dim">
              Se desbloquea tras el servicio de {formatKm(card.milestoneKm - 2000)} km
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CompletedCard({
  card,
  width,
  completedCount,
}: {
  card: MaintenanceCardType
  width: number
  completedCount: number
}) {
  return (
    <motion.div
      style={{ width }}
      className={cn(
        'flex-shrink-0 relative overflow-hidden',
        'rounded-3xl border border-accent-green/20',
        'bg-bg-card opacity-60',
      )}
    >
      <div className="absolute top-0 left-0 w-0.5 h-full bg-accent-green/40" />

      <div className="p-5">
        <p className="text-label-sm text-content-muted uppercase tracking-[0.14em] mb-1">
          {SERVICE_LABELS[card.serviceType]}
        </p>
        <h2 className="text-[28px] font-light tracking-tight text-content-primary tabular-nums mb-4">
          {formatKm(card.milestoneKm)}
          <span className="text-label-md text-content-muted ml-1.5">km</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-accent-green flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M 1 4 L 3.8 7 L 9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-label-md text-accent-green uppercase tracking-widest">Completado</span>
        </div>
        <p className="mt-1 text-label-sm text-content-muted">{completedCount} tareas registradas</p>
      </div>
    </motion.div>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <rect x="2" y="8" width="12" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4" className="text-content-muted" />
      <path d="M 4 8 L 4 5.5 C 4 3.0 12 3.0 12 5.5 L 12 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-content-muted" />
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor" className="text-content-muted" />
    </svg>
  )
}
