'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { MaintenanceTask } from '@/types/maintenance'

const categoryColors: Record<string, string> = {
  engine: 'text-accent-orange',
  drivetrain: 'text-accent-cyan',
  brakes: 'text-accent-red',
  tires: 'text-[#A0A0FF]',
  electrical: 'text-[#FFD60A]',
  inspection: 'text-content-muted',
}

const categoryLabels: Record<string, string> = {
  engine: 'Motor',
  drivetrain: 'Transmisión',
  brakes: 'Frenos',
  tires: 'Llantas',
  electrical: 'Eléctrico',
  inspection: 'Inspección',
}

interface TaskItemProps {
  task: MaintenanceTask
  completed: boolean
  onToggle: () => void
  disabled?: boolean
  index: number
}

export function TaskItem({ task, completed, onToggle, disabled = false, index }: TaskItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 26 }}
    >
      <button
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        className={cn(
          'group w-full flex items-start gap-3 p-3 rounded-2xl transition-all duration-150',
          'text-left select-none',
          !disabled && 'hover:bg-white/[0.03] active:bg-white/[0.05] cursor-pointer',
          disabled && 'cursor-default',
          completed && 'opacity-60'
        )}
      >
        {/* Checkbox */}
        <div className="relative mt-0.5 flex-shrink-0">
          <motion.div
            className={cn(
              'w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center transition-colors duration-200',
              completed
                ? 'bg-accent-green border-accent-green'
                : 'border-line-strong group-hover:border-content-muted bg-transparent'
            )}
            animate={{
              scale: completed ? [1, 1.18, 1] : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <motion.svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              initial={false}
              animate={{ opacity: completed ? 1 : 0, scale: completed ? 1 : 0.5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <path
                d="M 1 4 L 3.8 7 L 9 1"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-body-md font-medium leading-snug transition-colors',
                completed ? 'text-content-muted line-through' : 'text-content-primary'
              )}
            >
              {task.title}
            </span>
            <span
              className={cn(
                'text-[9px] font-semibold uppercase tracking-[0.1em] flex-shrink-0',
                categoryColors[task.category] ?? 'text-content-muted'
              )}
            >
              {categoryLabels[task.category] ?? task.category}
            </span>
          </div>

          {task.specification && (
            <p
              className={cn(
                'mt-0.5 text-[11px] font-mono text-content-muted leading-snug transition-opacity',
                completed && 'opacity-50'
              )}
            >
              {task.specification}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  )
}
