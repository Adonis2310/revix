'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Profile, MaintenanceSession, MaintenanceCard } from '@/types/maintenance'

interface MaintenanceState {
  // Profile
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  updateCurrentKm: (km: number) => void

  // Cards
  cards: MaintenanceCard[]
  setCards: (cards: MaintenanceCard[]) => void
  activeCardIndex: number
  setActiveCardIndex: (index: number) => void

  // In-progress task completions (persisted to Supabase as pending_tasks)
  completedTaskIds: Set<string>
  setCompletedTaskIds: (ids: Set<string>) => void
  toggleTask: (taskId: string) => void

  // Completed sessions
  sessions: MaintenanceSession[]
  setSessions: (sessions: MaintenanceSession[]) => void
  addSession: (session: MaintenanceSession) => void

  // UI
  isCompletionModalOpen: boolean
  setCompletionModalOpen: (open: boolean) => void
  isKmInputOpen: boolean
  setKmInputOpen: (open: boolean) => void
  isOnboarding: boolean
  setOnboarding: (v: boolean) => void
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useMaintenanceStore = create<MaintenanceState>()(
  subscribeWithSelector((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    updateCurrentKm: (km) =>
      set((s) => ({
        profile: s.profile ? { ...s.profile, current_km: km } : null,
      })),

    cards: [],
    setCards: (cards) => set({ cards }),
    activeCardIndex: 0,
    setActiveCardIndex: (index) => set({ activeCardIndex: index }),

    completedTaskIds: new Set(),
    setCompletedTaskIds: (ids) => set({ completedTaskIds: ids }),
    toggleTask: (taskId) =>
      set((s) => {
        const next = new Set(s.completedTaskIds)
        if (next.has(taskId)) {
          next.delete(taskId)
        } else {
          next.add(taskId)
        }
        return { completedTaskIds: next }
      }),

    sessions: [],
    setSessions: (sessions) => set({ sessions }),
    addSession: (session) =>
      set((s) => ({ sessions: [session, ...s.sessions] })),

    isCompletionModalOpen: false,
    setCompletionModalOpen: (open) => set({ isCompletionModalOpen: open }),
    isKmInputOpen: false,
    setKmInputOpen: (open) => set({ isKmInputOpen: open }),
    isOnboarding: false,
    setOnboarding: (v) => set({ isOnboarding: v }),
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
  }))
)
