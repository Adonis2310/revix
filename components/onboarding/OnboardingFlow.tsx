'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { RevixLogo } from '@/components/logo/RevixLogo'
import { useProfile } from '@/hooks/useProfile'

export function OnboardingFlow() {
  const { createProfile } = useProfile()
  const [step, setStep] = useState<'km' | 'service'>('km')
  const [currentKm, setCurrentKm] = useState('8663')
  const [lastServiceKm, setLastServiceKm] = useState('8500')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ km?: string; service?: string }>({})

  const validateKm = () => {
    const km = parseInt(currentKm.replace(/[^0-9]/g, ''), 10)
    if (isNaN(km) || km < 0) {
      setErrors({ km: 'Enter a valid odometer reading' })
      return false
    }
    setErrors({})
    return true
  }

  const validateService = () => {
    const km = parseInt(currentKm.replace(/[^0-9]/g, ''), 10)
    const svc = parseInt(lastServiceKm.replace(/[^0-9]/g, ''), 10)
    if (isNaN(svc) || svc < 0) {
      setErrors({ service: 'Enter a valid service km' })
      return false
    }
    if (svc >= km) {
      setErrors({ service: 'Last service must be less than current km' })
      return false
    }
    setErrors({})
    return true
  }

  const handleNext = () => {
    if (!validateKm()) return
    setStep('service')
  }

  const handleFinish = async () => {
    if (!validateService()) return
    setLoading(true)
    const km = parseInt(currentKm.replace(/[^0-9]/g, ''), 10)
    const svc = parseInt(lastServiceKm.replace(/[^0-9]/g, ''), 10)
    await createProfile(km, svc)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 py-12">
      {/* Background radial */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <RevixLogo size={40} glow />
          <p className="mt-4 text-label-sm text-content-muted uppercase tracking-[0.2em]">
            Honda XR150L 2025
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'km' ? (
            <motion.div
              key="km-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="mb-6">
                <p className="text-label-sm text-content-muted uppercase tracking-[0.12em] mb-1.5">
                  Step 1 of 2
                </p>
                <h1 className="text-heading-xl text-content-primary mb-1">
                  Current odometer
                </h1>
                <p className="text-body-md text-content-secondary">
                  Enter your XR150L&apos;s current kilometer reading.
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-4 rounded-2xl bg-bg-elevated border transition-colors ${
                  errors.km ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
                }`}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  value={currentKm}
                  onChange={(e) => {
                    setCurrentKm(e.target.value)
                    setErrors({})
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  autoFocus
                  className="flex-1 bg-transparent text-[32px] font-light text-content-primary tabular-nums outline-none"
                />
                <span className="text-label-lg text-content-muted uppercase tracking-widest">km</span>
              </div>

              {errors.km && (
                <p className="mt-2 text-label-md text-accent-red">{errors.km}</p>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-5"
                onClick={handleNext}
              >
                Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="service-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="mb-6">
                <p className="text-label-sm text-content-muted uppercase tracking-[0.12em] mb-1.5">
                  Step 2 of 2
                </p>
                <h1 className="text-heading-xl text-content-primary mb-1">
                  Last service
                </h1>
                <p className="text-body-md text-content-secondary">
                  When was your last oil change or full service?
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-4 rounded-2xl bg-bg-elevated border transition-colors ${
                  errors.service ? 'border-accent-red/50' : 'border-line focus-within:border-accent-blue/50'
                }`}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  value={lastServiceKm}
                  onChange={(e) => {
                    setLastServiceKm(e.target.value)
                    setErrors({})
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
                  autoFocus
                  className="flex-1 bg-transparent text-[32px] font-light text-content-primary tabular-nums outline-none"
                />
                <span className="text-label-lg text-content-muted uppercase tracking-widest">km</span>
              </div>

              {errors.service && (
                <p className="mt-2 text-label-md text-accent-red">{errors.service}</p>
              )}

              <p className="mt-2.5 text-label-sm text-content-muted">
                Current: {parseInt(currentKm || '0').toLocaleString()} km
              </p>

              <div className="flex gap-2 mt-5">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep('km')}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={loading}
                  onClick={handleFinish}
                >
                  Start Tracking
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
