'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { RevixLogo } from '@/components/logo/RevixLogo'

interface LoginTransitionProps {
  onComplete: () => void
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const motoControls = useAnimation()
  const logoControls = useAnimation()
  const bgControls = useAnimation()

  useEffect(() => {
    const run = async () => {
      // 1. Aparece la moto desde abajo con rebote
      await motoControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 220, damping: 18, duration: 0.5 },
      })

      // 2. Pausa breve — el piloto "asienta" la moto
      await new Promise((r) => setTimeout(r, 180))

      // 3. Levanta la rueda delantera (wheelie)
      await motoControls.start({
        rotate: -12,
        y: 8,
        transition: { type: 'spring', stiffness: 300, damping: 14, duration: 0.35 },
      })

      // 4. Baja y sale disparada hacia la derecha
      await motoControls.start({
        rotate: 0,
        x: '130vw',
        y: -10,
        scale: 0.85,
        transition: { duration: 0.55, ease: [0.4, 0, 0.8, 1] },
      })

      // 5. Fade out general y redirige
      await bgControls.start({
        opacity: 0,
        transition: { duration: 0.25 },
      })

      onComplete()
    }

    // Logo aparece al mismo tiempo que la moto sale
    logoControls.start({
      opacity: [0, 1, 1, 0],
      scale: [0.9, 1, 1, 0.95],
      transition: { times: [0, 0.2, 0.7, 1], duration: 2.2, delay: 0.4 },
    })

    run()
  }, [motoControls, logoControls, bgControls, onComplete])

  return (
    <motion.div
      animate={bgControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-bg-base flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Resplandor de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-gradient-radial from-accent-blue/10 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Logo superior */}
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.9 }}
        className="absolute top-16 flex items-center gap-3"
      >
        <RevixLogo size={28} />
        <span className="text-label-lg text-content-primary uppercase tracking-[0.2em]">Revix</span>
      </motion.div>

      {/* Silueta moto + piloto */}
      <motion.div
        animate={motoControls}
        initial={{ opacity: 0, y: 60, scale: 0.85 }}
        className="relative"
        style={{ originX: 0.5, originY: 0.9 }}
      >
        <MotoSilhouette />

        {/* Línea de velocidad (sale con la moto) */}
        <motion.div
          className="absolute top-1/2 -left-32 flex flex-col gap-1.5 -translate-y-1/2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.4, 0], scaleX: [0, 1, 1] }}
          transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
          style={{ originX: 1 }}
        >
          {[80, 50, 65, 35, 55].map((w, i) => (
            <div
              key={i}
              className="h-0.5 bg-white/30 rounded-full"
              style={{ width: w }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Texto inferior */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute bottom-14 text-label-sm text-content-muted uppercase tracking-[0.2em]"
      >
        Honda XR150L 2025
      </motion.p>
    </motion.div>
  )
}

function MotoSilhouette() {
  return (
    <svg
      width="320"
      height="180"
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── SOMBRA DE PISO ─────────────────────────── */}
      <ellipse cx="158" cy="168" rx="118" ry="7" fill="white" opacity="0.06" />

      {/* ── RUEDA TRASERA ──────────────────────────── */}
      <circle cx="72" cy="128" r="34" stroke="white" strokeWidth="6" />
      <circle cx="72" cy="128" r="9" fill="white" />
      {/* Radios */}
      {[0,45,90,135].map((a) => (
        <line
          key={a}
          x1={72 + 9 * Math.cos((a * Math.PI) / 180)}
          y1={128 + 9 * Math.sin((a * Math.PI) / 180)}
          x2={72 + 28 * Math.cos((a * Math.PI) / 180)}
          y2={128 + 28 * Math.sin((a * Math.PI) / 180)}
          stroke="white"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}

      {/* ── RUEDA DELANTERA ────────────────────────── */}
      <circle cx="238" cy="128" r="34" stroke="white" strokeWidth="6" />
      <circle cx="238" cy="128" r="9" fill="white" />
      {[0,45,90,135].map((a) => (
        <line
          key={a}
          x1={238 + 9 * Math.cos((a * Math.PI) / 180)}
          y1={128 + 9 * Math.sin((a * Math.PI) / 180)}
          x2={238 + 28 * Math.cos((a * Math.PI) / 180)}
          y2={128 + 28 * Math.sin((a * Math.PI) / 180)}
          stroke="white"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}

      {/* ── BRAZO OSCILANTE ────────────────────────── */}
      <line x1="72" y1="126" x2="148" y2="102" stroke="white" strokeWidth="5" strokeLinecap="round" />

      {/* ── CHASIS PRINCIPAL ───────────────────────── */}
      {/* Tubo superior (asiento → tubo de dirección) */}
      <path d="M 118 70 L 188 65" stroke="white" strokeWidth="9" strokeLinecap="round" />
      {/* Tubo inferior (motor → tubo de dirección) */}
      <path d="M 148 102 L 185 72" stroke="white" strokeWidth="4" strokeLinecap="round" />
      {/* Soporte trasero */}
      <path d="M 118 70 L 88 90 L 72 126" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── TUBO DE DIRECCIÓN ──────────────────────── */}
      <line x1="185" y1="52" x2="192" y2="82" stroke="white" strokeWidth="10" strokeLinecap="round" />

      {/* ── HORQUILLA DELANTERA ────────────────────── */}
      <line x1="183" y1="72" x2="222" y2="128" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="193" y1="70" x2="232" y2="126" stroke="white" strokeWidth="5" strokeLinecap="round" />

      {/* ── GUARDABARRO TRASERO ────────────────────── */}
      <path d="M 50 96 Q 55 72 88 86" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ── GUARDABARRO DELANTERO ──────────────────── */}
      <path d="M 210 90 Q 222 74 248 90" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ── MOTOR ──────────────────────────────────── */}
      <rect x="132" y="94" width="46" height="30" rx="4" fill="white" />
      <rect x="138" y="100" width="12" height="8" rx="2" fill="#050507" opacity="0.6" />
      <rect x="155" y="100" width="12" height="8" rx="2" fill="#050507" opacity="0.6" />

      {/* ── ESCAPE ─────────────────────────────────── */}
      <path d="M 148 115 Q 120 120 96 132 Q 78 138 65 133" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* ── TANQUE ─────────────────────────────────── */}
      <path d="M 130 68 Q 148 58 178 62 L 182 72 Q 160 76 132 80 Z" fill="white" />

      {/* ── MANILLAR ───────────────────────────────── */}
      <path d="M 160 58 Q 182 52 202 58" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Espejo izquierdo */}
      <line x1="162" y1="57" x2="155" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Espejo derecho */}
      <line x1="200" y1="57" x2="208" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* ══ PILOTO ════════════════════════════════════ */}

      {/* Casco */}
      <ellipse cx="174" cy="28" rx="24" ry="22" fill="white" />
      {/* Visera */}
      <path d="M 156 30 Q 164 22 186 26 Q 188 34 184 37 Q 170 40 155 36 Z" fill="#0A0A14" />
      {/* Reflejo visera */}
      <path d="M 162 25 Q 170 20 180 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Cuello / hombros */}
      <path d="M 162 46 L 195 54" stroke="white" strokeWidth="10" strokeLinecap="round" />

      {/* Torso (inclinado hacia adelante) */}
      <path d="M 130 74 L 162 48 L 198 56 L 188 80 L 148 86 Z" fill="white" />

      {/* Brazo derecho → manillar */}
      <path d="M 196 56 L 200 58" stroke="white" strokeWidth="7" strokeLinecap="round" />

      {/* Brazo izquierdo → manillar */}
      <path d="M 164 50 L 162 57" stroke="white" strokeWidth="7" strokeLinecap="round" />

      {/* Pierna derecha → reposapiés */}
      <path d="M 188 80 L 196 104 L 190 118" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" strokeLinejoin="round" />

      {/* Pierna izquierda → reposapiés */}
      <path d="M 148 86 L 140 108 L 133 120" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" strokeLinejoin="round" />

      {/* Bota derecha */}
      <path d="M 190 118 L 202 122" stroke="white" strokeWidth="7" strokeLinecap="round" />
      {/* Bota izquierda */}
      <path d="M 133 120 L 120 124" stroke="white" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}
