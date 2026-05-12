'use client'

import { useEffect } from 'react'
import { motion, useAnimation, type AnimationControls } from 'framer-motion'
import { RevixLogo } from '@/components/logo/RevixLogo'

interface LoginTransitionProps {
  onComplete: () => void
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const motoControls      = useAnimation()
  const logoControls      = useAnimation()
  const bgControls        = useAnimation()
  const frontShadow       = useAnimation()
  const rearShadow        = useAnimation()

  useEffect(() => {
    const run = async () => {
      // 1 — Moto entra desde abajo con rebote
      await motoControls.start({
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 18 },
      })

      await new Promise(r => setTimeout(r, 220))

      // 2 — Caballito: levanta la rueda delantera + sombra delantera desaparece
      await Promise.all([
        motoControls.start({
          rotate: -14, y: 10,
          transition: { type: 'spring', stiffness: 280, damping: 13 },
        }),
        frontShadow.start({
          opacity: 0, scaleX: 0.15, x: 20,
          transition: { duration: 0.32, ease: 'easeOut' },
        }),
        rearShadow.start({
          scaleX: 0.85, opacity: 0.55,
          transition: { duration: 0.3 },
        }),
      ])

      await new Promise(r => setTimeout(r, 120))

      // 3 — Sale disparada hacia la derecha
      await Promise.all([
        motoControls.start({
          rotate: -5, x: '140vw', y: -18, scale: 0.82,
          transition: { duration: 0.52, ease: [0.38, 0, 0.85, 1] },
        }),
        frontShadow.start({ x: '140vw', transition: { duration: 0.52 } }),
        rearShadow.start({ x: '140vw', transition: { duration: 0.52 } }),
      ])

      // 4 — Fade out y redirige
      await bgControls.start({ opacity: 0, transition: { duration: 0.22 } })
      onComplete()
    }

    logoControls.start({
      opacity: [0, 1, 1, 0],
      scale: [0.88, 1, 1, 0.96],
      transition: { times: [0, 0.18, 0.72, 1], duration: 2.3, delay: 0.35 },
    })

    run()
  }, [motoControls, logoControls, bgControls, frontShadow, rearShadow, onComplete])

  return (
    <motion.div
      animate={bgControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-bg-base flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Resplandor ambiental */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[320px] bg-gradient-radial from-accent-blue/10 to-transparent rounded-full blur-[90px]" />
      </div>

      {/* Logo */}
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.88 }}
        className="absolute top-14 flex items-center gap-3"
      >
        <RevixLogo size={26} />
        <span className="text-label-lg text-content-primary uppercase tracking-[0.22em]">Revix</span>
      </motion.div>

      {/* Moto + líneas de velocidad */}
      <motion.div
        animate={motoControls}
        initial={{ opacity: 0, y: 70, scale: 0.82 }}
        style={{ originX: 0.28, originY: 0.92 }}
        className="relative"
      >
        {/* Líneas de velocidad (aparecen justo antes de salir) */}
        <motion.div
          className="absolute top-[45%] -left-40 flex flex-col gap-2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.38, 0], scaleX: [0, 1, 1] }}
          transition={{ delay: 1.38, duration: 0.48, ease: 'easeOut' }}
          style={{ originX: 1 }}
        >
          {[88, 52, 70, 38, 58, 30].map((w, i) => (
            <div key={i} className="h-px bg-white/30 rounded-full" style={{ width: w }} />
          ))}
        </motion.div>

        <DirtBikeSilhouette frontShadow={frontShadow} rearShadow={rearShadow} />
      </motion.div>

      {/* Texto inferior */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.38 }}
        className="absolute bottom-12 text-label-sm text-content-muted uppercase tracking-[0.22em]"
      >
        Honda XR150L 2025
      </motion.p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SILUETA — Honda XR150L (moto montañera / enduro)
───────────────────────────────────────────────────────────── */
function DirtBikeSilhouette({
  frontShadow,
  rearShadow,
}: {
  frontShadow: AnimationControls
  rearShadow: AnimationControls
}) {
  const spokes = [0, 60, 120, 180, 240, 300]

  return (
    <svg width="340" height="198" viewBox="0 0 340 198" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ══ SOMBRAS EN EL SUELO ══════════════════════════════ */}
      {/* Sombra rueda trasera */}
      <motion.ellipse
        animate={rearShadow}
        initial={{ opacity: 0.18 }}
        cx={82} cy={188} rx={32} ry={5}
        fill="white"
        style={{ originX: '82px', originY: '188px' }}
      />
      {/* Sombra rueda delantera */}
      <motion.ellipse
        animate={frontShadow}
        initial={{ opacity: 0.18 }}
        cx={256} cy={188} rx={32} ry={5}
        fill="white"
        style={{ originX: '256px', originY: '188px' }}
      />

      {/* ══ RUEDA TRASERA ════════════════════════════════════ */}
      {/* Costado del neumático */}
      <circle cx={82} cy={146} r={30} stroke="white" strokeWidth="5.5" />
      {/* Tacos del neumático (patrón de enduro) */}
      <circle cx={82} cy={146} r={34} stroke="white" strokeWidth="4.5" strokeDasharray="7.5 5.5" />
      {/* Buje */}
      <circle cx={82} cy={146} r={9} fill="white" />
      {/* Rayos */}
      {spokes.map(deg => {
        const r = (deg * Math.PI) / 180
        return (
          <line key={deg}
            x1={82 + 9 * Math.cos(r)} y1={146 + 9 * Math.sin(r)}
            x2={82 + 25 * Math.cos(r)} y2={146 + 25 * Math.sin(r)}
            stroke="white" strokeWidth="1.5" opacity="0.55"
          />
        )
      })}

      {/* ══ RUEDA DELANTERA ══════════════════════════════════ */}
      <circle cx={256} cy={146} r={30} stroke="white" strokeWidth="5.5" />
      <circle cx={256} cy={146} r={34} stroke="white" strokeWidth="4.5" strokeDasharray="7.5 5.5" />
      <circle cx={256} cy={146} r={9} fill="white" />
      {spokes.map(deg => {
        const r = (deg * Math.PI) / 180
        return (
          <line key={deg}
            x1={256 + 9 * Math.cos(r)} y1={146 + 9 * Math.sin(r)}
            x2={256 + 25 * Math.cos(r)} y2={146 + 25 * Math.sin(r)}
            stroke="white" strokeWidth="1.5" opacity="0.55"
          />
        )
      })}

      {/* ══ CHASIS ═══════════════════════════════════════════ */}
      {/* Brazo oscilante */}
      <line x1={82} y1={144} x2={156} y2={108} stroke="white" strokeWidth="5" strokeLinecap="round" />
      {/* Riel del asiento (tubo superior) */}
      <path d="M 112 78 L 200 72" stroke="white" strokeWidth="9" strokeLinecap="round" />
      {/* Tubo inferior */}
      <line x1={156} y1={108} x2={198} y2={76} stroke="white" strokeWidth="4.5" strokeLinecap="round" />
      {/* Sección trasera (tubo del asiento + vaina) */}
      <path d="M 112 78 L 96 108 L 82 146"
        stroke="white" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Amortiguador trasero (enduro) */}
      <line x1={118} y1={82} x2={105} y2={115}
        stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* ══ MOTOR ════════════════════════════════════════════ */}
      <rect x={140} y={100} width={46} height={30} rx={4} fill="white" />
      <rect x={146} y={106} width={14} height={9} rx={2} fill="#080810" opacity="0.65" />
      <rect x={165} y={106} width={14} height={9} rx={2} fill="#080810" opacity="0.65" />

      {/* Placa deslizante (skid plate — típico de enduro) */}
      <path d="M 138 130 Q 160 142 188 130" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* ══ TUBO DE DIRECCIÓN ════════════════════════════════ */}
      <line x1={208} y1={56} x2={215} y2={88} stroke="white" strokeWidth="11" strokeLinecap="round" />

      {/* ══ HORQUILLA DELANTERA (largo recorrido, enduro) ════ */}
      <line x1={207} y1={80} x2={240} y2={146} stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      <line x1={217} y1={78} x2={250} y2={144} stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      {/* Protectores de horquilla */}
      <line x1={210} y1={96} x2={223} y2={112} stroke="white" strokeWidth="9" strokeLinecap="round" opacity="0.45" />

      {/* ══ GUARDABARROS DELANTERO (GRANDE — estilo enduro) ══ */}
      <path d="M 216 82 Q 238 54 272 68 Q 286 82 280 106 Q 266 118 252 110 Q 246 92 234 86 Z"
        fill="white" />
      {/* Línea de detalle del guardabarros */}
      <path d="M 244 88 Q 252 76 268 76" stroke="#080810" strokeWidth="2" opacity="0.4" fill="none" />

      {/* ══ GUARDABARROS TRASERO ════════════════════════════ */}
      <path d="M 55 112 Q 64 84 100 96"
        stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 98 90 Q 104 78 112 76"
        stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* ══ ESCAPE (montura media — XR150L) ════════════════ */}
      <path d="M 158 122 Q 128 130 102 140 Q 86 146 74 141"
        stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Protector térmico */}
      <path d="M 122 128 Q 110 133 98 138"
        stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.35" />

      {/* ══ TANQUE ═══════════════════════════════════════════ */}
      <path d="M 132 74 Q 152 62 194 68 L 196 78 Q 164 84 134 82 Z" fill="white" />

      {/* ══ MANILLAR ANCHO (enduro) ══════════════════════════ */}
      <path d="M 158 64 Q 206 57 230 62" stroke="white" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      {/* Barra cruzada del manillar */}
      <line x1={180} y1={62} x2={214} y2={61} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      {/* Protectores de mano */}
      <path d="M 158 64 L 152 59 L 155 69 Z" fill="white" opacity="0.8" />
      <path d="M 230 62 L 237 57 L 233 67 Z" fill="white" opacity="0.8" />

      {/* ══════════════════ PILOTO ═══════════════════════════ */}

      {/* === CASCO ENDURO (con visera de pico) === */}
      {/* Cúpula principal */}
      <ellipse cx={196} cy={28} rx={25} ry={22} fill="white" />
      {/* PICO / VISERA (característica principal del enduro) */}
      <path d="M 184 10 Q 202 3 224 10 L 220 19 Q 200 13 182 18 Z" fill="white" />
      {/* Apertura de googles */}
      <path d="M 178 27 Q 186 19 212 23 Q 216 31 212 37 Q 194 42 176 36 Z" fill="#080810" />
      {/* Reflejo de la lente */}
      <path d="M 182 23 Q 192 17 206 21" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Correa de los googles */}
      <line x1={171} y1={28} x2={178} y2={28} stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Mentón */}
      <path d="M 174 35 Q 180 48 198 48 Q 216 48 220 37"
        stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* === CUELLO / HOMBROS === */}
      <path d="M 188 50 L 220 58" stroke="white" strokeWidth="11" strokeLinecap="round" />

      {/* === TORSO CON PETO PROTECTOR (enduro) === */}
      <path d="M 126 82 L 188 52 L 226 62 L 216 88 L 176 97 L 146 94 Z" fill="white" />
      {/* Detalle del peto */}
      <path d="M 162 60 L 170 84 M 180 58 L 186 82"
        stroke="#080810" strokeWidth="2" opacity="0.4" />
      {/* Hombrera derecha */}
      <ellipse cx={222} cy={60} rx={7} ry={5} fill="white" opacity="0.7" />

      {/* === BRAZOS (codos hacia afuera — postura enduro) === */}
      {/* Brazo derecho */}
      <path d="M 224 62 Q 238 55 230 64" stroke="white" strokeWidth="8.5" strokeLinecap="round" fill="none" />
      {/* Brazo izquierdo */}
      <path d="M 188 54 Q 182 62 158 65" stroke="white" strokeWidth="8.5" strokeLinecap="round" fill="none" />

      {/* === PIERNAS (postura de pie en estribos — enduro) === */}
      {/* Pierna derecha */}
      <path d="M 216 88 L 228 116 L 220 134"
        stroke="white" strokeWidth="9.5" strokeLinecap="round" fill="none" strokeLinejoin="round" />
      {/* Rodillera derecha */}
      <ellipse cx={226} cy={115} rx={6} ry={5} fill="white" opacity="0.55" />
      {/* Bota derecha */}
      <path d="M 220 134 L 238 138" stroke="white" strokeWidth="8" strokeLinecap="round" />

      {/* Pierna izquierda */}
      <path d="M 146 94 L 138 120 L 128 135"
        stroke="white" strokeWidth="9.5" strokeLinecap="round" fill="none" strokeLinejoin="round" />
      {/* Rodillera izquierda */}
      <ellipse cx={138} cy={119} rx={6} ry={5} fill="white" opacity="0.55" />
      {/* Bota izquierda */}
      <path d="M 128 135 L 112 139" stroke="white" strokeWidth="8" strokeLinecap="round" />

    </svg>
  )
}
