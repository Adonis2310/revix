'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateMaintenanceCards } from '@/lib/maintenance/logic'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'
import type { MaintenanceSession } from '@/types/maintenance'

export function useMaintenance() {
  const store = useMaintenanceStore()
  const supabase = createClient()

  const loadPendingTasks = useCallback(
    async (milestoneKm: number, userId: string) => {
      const { data } = await supabase
        .from('pending_tasks')
        .select('task_id')
        .eq('user_id', userId)
        .eq('milestone_km', milestoneKm)

      if (data) {
        store.setCompletedTaskIds(new Set(data.map((r) => r.task_id)))
      }
    },
    [supabase, store]
  )

  const toggleTask = useCallback(
    async (taskId: string, milestoneKm: number) => {
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId) return

      const wasCompleted = store.completedTaskIds.has(taskId)
      store.toggleTask(taskId)

      if (wasCompleted) {
        await supabase
          .from('pending_tasks')
          .delete()
          .eq('user_id', userId)
          .eq('milestone_km', milestoneKm)
          .eq('task_id', taskId)
      } else {
        await supabase.from('pending_tasks').upsert({
          user_id: userId,
          milestone_km: milestoneKm,
          task_id: taskId,
        })
      }
    },
    [supabase, store]
  )

  const completeService = useCallback(
    async (milestoneKm: number, serviceType: string, notes?: string) => {
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId || !store.profile) return null

      const currentKm = store.profile.current_km

      // Insert session
      const { data: session, error } = await supabase
        .from('maintenance_sessions')
        .insert({
          user_id: userId,
          milestone_km: milestoneKm,
          completed_km: currentKm,
          service_type: serviceType,
          notes: notes ?? null,
        })
        .select()
        .single()

      if (error || !session) return null

      // Update profile last_service_km
      await supabase
        .from('profiles')
        .update({
          last_service_km: milestoneKm,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      // Clean up pending tasks for this milestone
      await supabase
        .from('pending_tasks')
        .delete()
        .eq('user_id', userId)
        .eq('milestone_km', milestoneKm)

      store.addSession(session as MaintenanceSession)
      store.setCompletedTaskIds(new Set())

      // Update profile in store
      store.setProfile({
        ...store.profile,
        last_service_km: milestoneKm,
        updated_at: new Date().toISOString(),
      })

      // Regenerate cards
      const completedMilestones = [
        ...store.sessions.map((s) => s.milestone_km),
        milestoneKm,
      ]
      const newCards = generateMaintenanceCards(
        milestoneKm,
        currentKm,
        [],
        6
      )
      store.setCards(newCards)
      store.setActiveCardIndex(0)

      return session as MaintenanceSession
    },
    [supabase, store]
  )

  const updateKm = useCallback(
    async (km: number) => {
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId) return

      await supabase
        .from('profiles')
        .update({ current_km: km, updated_at: new Date().toISOString() })
        .eq('id', userId)

      await supabase.from('km_logs').insert({ user_id: userId, km })

      store.updateCurrentKm(km)
    },
    [supabase, store]
  )

  return { loadPendingTasks, toggleTask, completeService, updateKm }
}
