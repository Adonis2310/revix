'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'
import { generateMaintenanceCards } from '@/lib/maintenance/logic'
import { Header } from '@/components/layout/Header'
import { KmDisplay, KmUpdateModal } from '@/components/maintenance/KmTracker'
import { MileageProgress } from '@/components/maintenance/MileageProgress'
import { MaintenanceCarousel } from '@/components/maintenance/MaintenanceCarousel'
import { CompletionModal } from '@/components/maintenance/CompletionModal'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { useMaintenance } from '@/hooks/useMaintenance'
import type { Profile, MaintenanceSession } from '@/types/maintenance'

interface DashboardClientProps {
  initialProfile: Profile | null
  initialSessions: MaintenanceSession[]
  initialPendingTasks: string[]
}

export function DashboardClient({
  initialProfile,
  initialSessions,
  initialPendingTasks,
}: DashboardClientProps) {
  const store = useMaintenanceStore()
  const { toggleTask } = useMaintenance()

  // Hydrate store from server-fetched data
  useEffect(() => {
    if (initialProfile) {
      store.setProfile(initialProfile)
      store.setSessions(initialSessions)
      store.setCompletedTaskIds(new Set(initialPendingTasks))

      const completedMilestones = initialSessions.map((s) => s.milestone_km)
      const cards = generateMaintenanceCards(
        initialProfile.last_service_km,
        initialProfile.current_km,
        completedMilestones,
        6
      )
      store.setCards(cards)

      const activeIdx = cards.findIndex((c) => c.isActive)
      store.setActiveCardIndex(activeIdx >= 0 ? activeIdx : 0)
    } else {
      store.setOnboarding(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = store.cards
  const activeCard = cards.find((c) => c.isActive)

  const handleToggleTask = (taskId: string) => {
    if (!activeCard) return
    toggleTask(taskId, activeCard.milestoneKm)
  }

  const handleComplete = () => {
    store.setCompletionModalOpen(true)
  }

  if (store.isOnboarding) {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col max-w-2xl mx-auto">
      {/* Background ambiance */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-radial from-accent-blue/6 to-transparent blur-[100px]" />
      </div>

      <Header />

      <main className="flex-1 relative z-10 pb-safe-bottom">
        {/* Hero KM display */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.05 }}
          className="flex flex-col items-center pt-8 pb-2"
        >
          <p className="text-label-sm text-content-muted uppercase tracking-[0.18em] mb-4">
            Honda XR150L 2025
          </p>
          <KmDisplay />
        </motion.section>

        {/* Mileage progress */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.12 }}
        >
          <MileageProgress />
        </motion.section>

        {/* Divider */}
        <div className="mx-6 border-t border-line my-2" />

        {/* Maintenance schedule section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.18 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between px-6 mb-4">
            <div>
              <p className="text-label-sm text-content-muted uppercase tracking-[0.14em]">
                Maintenance Schedule
              </p>
              {activeCard && (
                <p className="text-label-md text-content-secondary mt-0.5">
                  {activeCard.tasks.length} tasks at {activeCard.milestoneKm.toLocaleString()} km
                </p>
              )}
            </div>
            <ServiceTypeBadge type={activeCard?.serviceType} />
          </div>

          <MaintenanceCarousel
            onToggleTask={handleToggleTask}
            onComplete={handleComplete}
          />
        </motion.section>
      </main>

      {/* Modals */}
      <CompletionModal />
      <KmUpdateModal />
    </div>
  )
}

function ServiceTypeBadge({ type }: { type?: string }) {
  if (!type) return null

  const colors: Record<string, string> = {
    regular: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    intermediate: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    major: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    comprehensive: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/20',
  }

  const labels: Record<string, string> = {
    regular: 'Regular',
    intermediate: 'Intermediate',
    major: 'Major',
    comprehensive: 'Full',
  }

  return (
    <div
      className={`px-2.5 py-1 rounded-xl border text-label-sm uppercase tracking-widest ${
        colors[type] ?? colors.regular
      }`}
    >
      {labels[type] ?? type}
    </div>
  )
}
