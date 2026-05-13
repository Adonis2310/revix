import { TASKS, SERVICE_TASK_IDS, TASK_INTERVALS } from './schedule'
import type { MaintenanceCard, MaintenanceTask, ServiceType } from '@/types/maintenance'

export const MAINTENANCE_INTERVAL_KM = 2000

// Determines which service tier applies based on position in the sequence
// Position 1 = first service after last completed
// Cycle: regular → intermediate → regular → major → (×2) → intermediate → regular → comprehensive
export function getServiceType(position: number): ServiceType {
  if (position % 8 === 0) return 'comprehensive'
  if (position % 4 === 0) return 'major'
  if (position % 2 === 0) return 'intermediate'
  return 'regular'
}

export function getTasksForServiceType(serviceType: ServiceType) {
  return SERVICE_TASK_IDS[serviceType].map((id) => TASKS[id])
}

export function getTasksForMileage(km: number): MaintenanceTask[] {
  return Object.entries(TASK_INTERVALS)
    .filter(([, interval]) => km % interval === 0)
    .map(([id]) => TASKS[id])
}

export function generateMaintenanceCards(
  lastServiceKm: number,
  currentKm: number,
  completedMilestones: number[],
  count = 6
): MaintenanceCard[] {
  const completedSet = new Set(completedMilestones)
  const cards: MaintenanceCard[] = []
  let firstActiveFound = false

  for (let i = 1; i <= count; i++) {
    const milestoneKm = lastServiceKm + i * MAINTENANCE_INTERVAL_KM
    const serviceType = getServiceType(i)
    const tasks = getTasksForMileage(milestoneKm)
    const isCompleted = completedSet.has(milestoneKm)

    // Active = first non-completed card in the sequence
    const isActive = !isCompleted && !firstActiveFound
    if (isActive) firstActiveFound = true

    const isLocked = !isCompleted && !isActive

    const completedSession = isCompleted
      ? completedMilestones.find((km) => km === milestoneKm)
      : undefined

    cards.push({
      id: `maintenance-${milestoneKm}`,
      milestoneKm,
      serviceType,
      tasks,
      isCompleted,
      isActive,
      isLocked,
      completedAt: completedSession ? new Date().toISOString() : undefined,
    })
  }

  return cards
}

export function getActiveCard(cards: MaintenanceCard[]): MaintenanceCard | null {
  return cards.find((c) => c.isActive) ?? null
}

export function getProgressPercent(
  lastServiceKm: number,
  currentKm: number,
  nextServiceKm: number
): number {
  const range = nextServiceKm - lastServiceKm
  const done = currentKm - lastServiceKm
  return Math.min(Math.max((done / range) * 100, 0), 100)
}

export function getKmRemaining(currentKm: number, nextServiceKm: number): number {
  return Math.max(nextServiceKm - currentKm, 0)
}

export function isServiceOverdue(currentKm: number, nextServiceKm: number): boolean {
  return currentKm >= nextServiceKm
}

export function getCompletionStats(
  totalTasks: number,
  completedCount: number
): { percent: number; label: string } {
  const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  return {
    percent,
    label: `${completedCount} / ${totalTasks}`,
  }
}
