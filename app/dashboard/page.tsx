import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { generateMaintenanceCards } from '@/lib/maintenance/logic'
import type { Profile, MaintenanceSession } from '@/types/maintenance'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch sessions
  const { data: sessionsData } = await supabase
    .from('maintenance_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  // Fetch pending tasks for the current active milestone
  let initialPendingTasks: string[] = []
  if (profileData) {
    const sessions = (sessionsData ?? []) as MaintenanceSession[]
    const completedMilestones = sessions.map((s) => s.milestone_km)
    const cards = generateMaintenanceCards(
      profileData.last_service_km,
      profileData.current_km,
      completedMilestones,
      6
    )
    const activeCard = cards.find((c) => c.isActive)

    if (activeCard) {
      const { data: pendingData } = await supabase
        .from('pending_tasks')
        .select('task_id')
        .eq('user_id', user.id)
        .eq('milestone_km', activeCard.milestoneKm)

      initialPendingTasks = (pendingData ?? []).map((r) => r.task_id)
    }
  }

  return (
    <DashboardClient
      initialProfile={profileData as Profile | null}
      initialSessions={(sessionsData ?? []) as MaintenanceSession[]}
      initialPendingTasks={initialPendingTasks}
    />
  )
}
