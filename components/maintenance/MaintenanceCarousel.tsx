'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { MaintenanceCard } from './MaintenanceCard'
import { useMaintenanceStore } from '@/store/useMaintenanceStore'
import { cn } from '@/lib/utils'

const CARD_WIDTH = 320
const CARD_GAP = 14
const CARD_STEP = CARD_WIDTH + CARD_GAP
const DRAG_BUFFER = 50

interface MaintenanceCarouselProps {
  onToggleTask: (taskId: string) => void
  onComplete: () => void
}

export function MaintenanceCarousel({ onToggleTask, onComplete }: MaintenanceCarouselProps) {
  const cards = useMaintenanceStore((s) => s.cards)
  const activeCardIndex = useMaintenanceStore((s) => s.activeCardIndex)
  const completedTaskIds = useMaintenanceStore((s) => s.completedTaskIds)
  const setActiveCardIndex = useMaintenanceStore((s) => s.setActiveCardIndex)

  const x = useMotionValue(0)
  const isDragging = useRef(false)

  const snapTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, cards.length - 1))
      setActiveCardIndex(clamped)
      animate(x, -(clamped * CARD_STEP), {
        type: 'spring',
        stiffness: 320,
        damping: 30,
        mass: 0.8,
      })
    },
    [cards.length, setActiveCardIndex, x]
  )

  const handleDragStart = useCallback(() => {
    isDragging.current = true
  }, [])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDragging.current = false
      const offset = info.offset.x
      const velocity = info.velocity.x

      if (offset < -DRAG_BUFFER || velocity < -300) {
        snapTo(activeCardIndex + 1)
      } else if (offset > DRAG_BUFFER || velocity > 300) {
        snapTo(activeCardIndex - 1)
      } else {
        snapTo(activeCardIndex)
      }
    },
    [activeCardIndex, snapTo]
  )

  if (cards.length === 0) return null

  return (
    <div className="w-full">
      {/* Carousel track */}
      <div className="overflow-hidden w-full px-6">
        <motion.div
          className="flex gap-[14px] cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -((cards.length - 1) * CARD_STEP),
            right: 0,
          }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {cards.map((card, index) => (
            <MaintenanceCard
              key={card.id}
              card={card}
              isCurrentlyActive={index === activeCardIndex}
              completedTaskIds={completedTaskIds}
              onToggleTask={onToggleTask}
              onComplete={onComplete}
              width={CARD_WIDTH}
            />
          ))}
        </motion.div>
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center gap-2 mt-5">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => snapTo(index)}
            aria-label={`Go to card ${index + 1}`}
            className={cn(
              'rounded-full transition-all duration-300',
              index === activeCardIndex
                ? 'w-5 h-1.5 bg-accent-blue'
                : card.isCompleted
                ? 'w-1.5 h-1.5 bg-accent-green/40'
                : card.isLocked
                ? 'w-1.5 h-1.5 bg-content-dim'
                : 'w-1.5 h-1.5 bg-content-muted/40'
            )}
          />
        ))}
      </div>
    </div>
  )
}
