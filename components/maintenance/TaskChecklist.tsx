'use client'

import { motion } from 'framer-motion'
import { TaskItem } from './TaskItem'
import type { MaintenanceTask } from '@/types/maintenance'

interface TaskChecklistProps {
  tasks: MaintenanceTask[]
  completedTaskIds: Set<string>
  onToggleTask: (taskId: string) => void
  disabled?: boolean
}

export function TaskChecklist({
  tasks,
  completedTaskIds,
  onToggleTask,
  disabled = false,
}: TaskChecklistProps) {
  return (
    <motion.div
      className="flex flex-col gap-0.5"
      initial={false}
    >
      {tasks.map((task, i) => (
        <TaskItem
          key={task.id}
          task={task}
          completed={completedTaskIds.has(task.id)}
          onToggle={() => onToggleTask(task.id)}
          disabled={disabled}
          index={i}
        />
      ))}
    </motion.div>
  )
}
