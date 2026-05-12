'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateMaintenanceCards } from '@/lib/maintenance/logic'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'

export function useProfile() {
  const store = useMaintenanceStore()
  const supabase = createClient()

  const loadProfile = useCallback(async () => {
    store.setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      store.setLoading(false)
      return null
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      store.setOnboarding(true)
      store.setLoading(false)
      return null
    }

    store.setProfile(profile)

    // Load maintenance sessions
    const { data: sessions } = await supabase
      .from('maintenance_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    const completedMilestones = (sessions ?? []).map((s) => s.milestone_km)
    store.setSessions((sessions ?? []) as Parameters<typeof store.setSessions>[0])

    // Generate cards
    const cards = generateMaintenanceCards(
      profile.last_service_km,
      profile.current_km,
      completedMilestones,
      6
    )
    store.setCards(cards)

    // Find the active card index
    const activeIdx = cards.findIndex((c) => c.isActive)
    store.setActiveCardIndex(activeIdx >= 0 ? activeIdx : 0)

    store.setLoading(false)
    return profile
  }, [supabase, store])

  const createProfile = useCallback(
    async (currentKm: number, lastServiceKm: number) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          current_km: currentKm,
          last_service_km: lastServiceKm,
          bike_model: 'Honda XR150L 2025',
        })
        .select()
        .single()

      if (error || !profile) return null

      // Log initial km
      await supabase.from('km_logs').insert({ user_id: user.id, km: currentKm })

      store.setProfile(profile)

      const cards = generateMaintenanceCards(lastServiceKm, currentKm, [], 6)
      store.setCards(cards)
      store.setActiveCardIndex(0)
      store.setOnboarding(false)

      return profile
    },
    [supabase, store]
  )

  return { loadProfile, createProfile }
}
