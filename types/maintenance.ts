export type ServiceType = 'regular' | 'intermediate' | 'major' | 'comprehensive'

export type TaskCategory = 'engine' | 'drivetrain' | 'brakes' | 'tires' | 'electrical' | 'inspection'

export type TaskActionType = 'inspect' | 'replace' | 'adjust' | 'clean' | 'lubricate'

export interface MaintenanceTask {
  id: string
  title: string
  description: string
  category: TaskCategory
  specification?: string
  actionType: TaskActionType
}

export interface MaintenanceCard {
  id: string
  milestoneKm: number
  serviceType: ServiceType
  tasks: MaintenanceTask[]
  isCompleted: boolean
  isActive: boolean
  isLocked: boolean
  completedAt?: string
}

export interface Profile {
  id: string
  current_km: number
  bike_model: string
  last_service_km: number
  created_at: string
  updated_at: string
}

export interface MaintenanceSession {
  id: string
  user_id: string
  milestone_km: number
  completed_km: number
  service_type: ServiceType
  completed_at: string
  notes?: string
  created_at: string
}

export interface PendingTask {
  id: string
  user_id: string
  milestone_km: number
  task_id: string
  completed_at: string
  created_at: string
}

export interface KmLog {
  id: string
  user_id: string
  km: number
  logged_at: string
}
