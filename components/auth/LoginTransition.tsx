'use client'

import { useEffect } from 'react'
import { motion, useAnimation, type AnimationControls } from 'framer-motion'
import { RevixLogo } from '@/components/logo/RevixLogo'

interface LoginTransitionProps {
  onComplete: () => void
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const motoControls = useAnimation()
  const logoControls = useAnimation()
  const bgControls   = useAnimation()
  const frontShadow  = useAnimation()
  const rearShadow   = useAnimation()

  useEffect(() => {
    const run = async () => {
      await motoControls.start({
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 18 },
      })

      await new Promise(r => setTimeout(r, 220))

      await Promise.all([
        motoControls.start({
          rotate: -16, y: 12,
          transition: { type: 'spring', stiffness: 260, damping: 14 },
        }),
        frontShadow.start({
          opacity: 0, scaleX: 0.1, x: 28,
          transition: { duration: 0.34, ease: 'easeOut' },
        }),
        rearShadow.start({
          scaleX: 0.88, opacity: 0.5,
          transition: { duration: 0.32 },
        }),
      ])

      await new Promise(r => setTimeout(r, 130))

      await Promise.all([
        motoControls.start({
          rotate: -6, x: '145vw', y: -20, scale: 0.8,
          transition: { duration: 0.5, ease: [0.4, 0, 0.9, 1] },
        }),
        frontShadow.start({ x: '145vw', transition: { duration: 0.5 } }),
        rearShadow.start({ x: '145vw', transition: { duration: 0.5 } }),
      ])

      await bgControls.start({ opacity: 0, transition: { duration: 0.2 } })
      onComplete()
    }

    logoControls.start({
      opacity: [0, 1, 1, 0],
      scale: [0.88, 1, 1, 0.96],
      transition: { times: [0, 0.18, 0.72, 1], duration: 2.4, delay: 0.3 },
    })

    run()
  }, [motoControls, logoControls, bgControls, frontShadow, rearShadow, onComplete])

  return (
    <motion.div
      animate={bgControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-bg-base flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[540px] h-[340px] bg-gradient-radial from-accent-blue/10 to-transparent rounded-full blur-[90px]" />
      </div>

      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.88 }}
        className="absolute top-14 flex items-center gap-3"
      >
        <RevixLogo size={26} />
        <span className="text-label-lg text-content-primary uppercase tracking-[0.22em]">Revix</span>
      </motion.div>

      <motion.div
        animate={motoControls}
        initial={{ opacity: 0, y: 72, scale: 0.82 }}
        style={{ originX: 0.26, originY: 0.94 }}
        className="relative"
      >
        {/* Speed lines */}
        <motion.div
          className="absolute top-[48%] -left-44 flex flex-col gap-2.5 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.4, 0], scaleX: [0, 1, 1] }}
          transition={{ delay: 1.42, duration: 0.46, ease: 'easeOut' }}
          style={{ originX: 1 }}
        >
          {[90, 54, 72, 40, 60, 28].map((w, i) => (
            <div key={i} className="h-px bg-white/28 rounded-full" style={{ width: w }} />
          ))}
        </motion.div>

        <WheelieMotocross frontShadow={frontShadow} rearShadow={rearShadow} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.36 }}
        className="absolute bottom-12 text-label-sm text-content-muted uppercase tracking-[0.22em]"
      >
        Honda XR150L 2025
      </motion.p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Silueta fiel a la referencia: moto enduro en caballito
   Rueda trasera en tierra · delantera elevada por la animación
   Piloto inclinado atrás · casco con visera · 20 rayos finos
───────────────────────────────────────────────────────────── */
function WheelieMotocross({
  frontShadow,
  rearShadow,
}: {
  frontShadow: AnimationControls
  rearShadow: AnimationControls
}) {
  const N = 20
  const spokes = Array.from({ length: N }, (_, i) => (i * (360 / N) * Math.PI) / 180)

  // Centros de rueda — ambas al mismo nivel (la animación hace el wheelie)
  const R = { x: 88,  y: 158 }   // rueda trasera
  const F = { x: 272, y: 158 }   // rueda delantera

  function Spokes({ cx, cy }: { cx: number; cy: number }) {
    return (
      <>
        {spokes.map((a, i) => (
          <line
            key={i}
            x1={cx + 12 * Math.cos(a)} y1={cy + 12 * Math.sin(a)}
            x2={cx + 28 * Math.cos(a)} y2={cy + 28 * Math.sin(a)}
            stroke="white" strokeWidth="0.82" opacity="0.78"
          />
        ))}
      </>
    )
  }

  return (
    <svg width="370" height="212" viewBox="0 0 370 212" fill="none">

      {/* ══ SOMBRAS ══ */}
      <motion.ellipse
        animate={rearShadow} initial={{ opacity: 0.22 }}
        cx={R.x} cy={200} rx={36} ry={5} fill="white"
        style={{ originX: `${R.x}px`, originY: '200px' }}
      />
      <motion.ellipse
        animate={frontShadow} initial={{ opacity: 0.22 }}
        cx={F.x} cy={200} rx={36} ry={5} fill="white"
        style={{ originX: `${F.x}px`, originY: '200px' }}
      />

      {/* ══ RUEDA TRASERA ══ */}
      {/* Neumático */}
      <circle cx={R.x} cy={R.y} r={31} stroke="white" strokeWidth="10" fill="none" />
      {/* Bloques de taco externos */}
      <circle cx={R.x} cy={R.y} r={37} stroke="white" strokeWidth="3.8" strokeDasharray="10 6" fill="none" />
      {/* Fila interna de tacos intercalada */}
      <circle cx={R.x} cy={R.y} r={36} stroke="white" strokeWidth="2"
        strokeDasharray="4 12" strokeDashoffset="8" fill="none" opacity="0.48" />
      {/* Corona / sprocket */}
      <circle cx={R.x} cy={R.y} r={19} stroke="white" strokeWidth="1.8"
        strokeDasharray="5 3" fill="none" opacity="0.32" />
      {/* Buje */}
      <circle cx={R.x} cy={R.y} r={11} fill="white" />
      <circle cx={R.x} cy={R.y} r={5.5} fill="#06060e" />
      <circle cx={R.x} cy={R.y} r={2} fill="white" />
      <Spokes cx={R.x} cy={R.y} />

      {/* ══ RUEDA DELANTERA ══ */}
      <circle cx={F.x} cy={F.y} r={31} stroke="white" strokeWidth="10" fill="none" />
      <circle cx={F.x} cy={F.y} r={37} stroke="white" strokeWidth="3.8" strokeDasharray="10 6" fill="none" />
      <circle cx={F.x} cy={F.y} r={36} stroke="white" strokeWidth="2"
        strokeDasharray="4 12" strokeDashoffset="8" fill="none" opacity="0.48" />
      {/* Disco de freno */}
      <circle cx={F.x} cy={F.y} r={22} stroke="white" strokeWidth="3"
        strokeDasharray="12 5" fill="none" opacity="0.88" />
      <circle cx={F.x} cy={F.y} r={14.5} stroke="white" strokeWidth="1.5" fill="none" opacity="0.42" />
      {/* Buje */}
      <circle cx={F.x} cy={F.y} r={11} fill="white" />
      <circle cx={F.x} cy={F.y} r={5.5} fill="#06060e" />
      <circle cx={F.x} cy={F.y} r={2} fill="white" />
      <Spokes cx={F.x} cy={F.y} />

      {/* ══ BRAZO OSCILANTE (doble tubo) ══ */}
      <line x1={R.x + 2} y1={R.y - 4} x2={158} y2={116}
        stroke="white" strokeWidth="6.5" strokeLinecap="round" />
      <line x1={R.x + 4} y1={R.y + 3} x2={156} y2={122}
        stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

      {/* ══ CHASIS PRINCIPAL ══ */}
      {/* Tubo superior (columna) */}
      <path d="M 120 80 L 224 73" stroke="white" strokeWidth="9.5" strokeLinecap="round" />
      {/* Tubo de bajada */}
      <line x1={224} y1={76} x2={158} y2={118} stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      {/* Vaina trasera */}
      <path d="M 120 80 L 98 118 L 88 158"
        stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Eslabón de la vaina */}
      <line x1={98} y1={118} x2={118} y2={120} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

      {/* Amortiguador trasero */}
      <line x1={128} y1={86} x2={113} y2={122} stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0.72" />
      <line x1={124} y1={99} x2={118} y2={111} stroke="white" strokeWidth="7.5" strokeLinecap="round" opacity="0.38" />

      {/* ══ MOTOR ══ */}
      <rect x={154} y={97} width={32} height={13} rx={3} fill="white" />
      <rect x={146} y={108} width={52} height={32} rx={5} fill="white" />
      {/* Aletas */}
      {[154, 163, 172, 181, 190].map(x => (
        <line key={x} x1={x} y1={113} x2={x} y2={134} stroke="#06060e" strokeWidth="1.4" opacity="0.36" />
      ))}
      {/* Placa deslizante */}
      <path d="M 144 140 Q 170 157 202 140" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* ══ CABEZA DE DIRECCIÓN ══ */}
      <rect x={217} y={63} width={15} height={28} rx={4.5} fill="white" />

      {/* ══ HORQUILLA (largo recorrido) ══ */}
      <line x1={217} y1={84} x2={254} y2={158} stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1={229} y1={82} x2={266} y2={156} stroke="white" strokeWidth="6" strokeLinecap="round" />
      {/* Protector de horquilla */}
      <rect x={221} y={104} width={10} height={22} rx={3.5} fill="white" opacity="0.4" />
      {/* Abrazadera del eje */}
      <line x1={254} y1={158} x2={267} y2={156} stroke="white" strokeWidth="5.5" strokeLinecap="round" opacity="0.58" />

      {/* ══ GUARDABARROS DELANTERO (grande) ══ */}
      <path d="M 228 90 Q 252 58 290 74 Q 307 91 299 118 Q 284 132 267 122 Q 258 101 244 93 Z"
        fill="white" />
      <path d="M 255 98 Q 268 83 283 86" stroke="#06060e" strokeWidth="2" opacity="0.26" fill="none" />

      {/* ══ GUARDABARROS TRASERO ══ */}
      <path d="M 48 110 Q 62 78 106 96" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 104 89 Q 114 78 123 76" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* ══ TANQUE ══ */}
      <path d="M 132 76 Q 157 60 212 69 L 214 79 Q 172 86 134 84 Z" fill="white" />

      {/* ══ ESCAPE ══ */}
      <path d="M 165 132 Q 130 142 104 153 Q 86 159 74 153"
        stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 130 140 Q 114 145 102 151" stroke="white" strokeWidth="9.5" strokeLinecap="round" opacity="0.24" />

      {/* ══ MANILLAR ANCHO ══ */}
      <path d="M 162 65 Q 216 56 242 62"
        stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Barra cruzada */}
      <line x1={184} y1={62} x2={226} y2={61} stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.48" />
      {/* Protectores de mano */}
      <path d="M 162 65 L 153 59 L 157 70 Z" fill="white" opacity="0.85" />
      <path d="M 242 62 L 251 56 L 248 67 Z" fill="white" opacity="0.85" />

      {/* ══════════════ PILOTO ══════════════ */}

      {/* BOTAS */}
      <path d="M 115 148 L  94 152" stroke="white" strokeWidth="12" strokeLinecap="round" />
      <path d="M 159 144 L 178 147" stroke="white" strokeWidth="12" strokeLinecap="round" />

      {/* PIERNAS */}
      {/* Pierna izquierda — cadera atrás → rodilla → pie en estribo */}
      <path d="M 112 90 Q 103 124 115 148" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Pierna derecha */}
      <path d="M 140 86 Q 153 118 159 144" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />

      {/* RODILLERAS */}
      <ellipse cx={104} cy={123} rx={10.5} ry={7.5} fill="white" opacity="0.58" />
      <ellipse cx={153} cy={120} rx={10.5} ry={7.5} fill="white" opacity="0.58" />

      {/* TORSO / PETO (piloto inclinado hacia atrás — wheelie) */}
      {/* La silueta muestra un tronco ancho con protección de pecho */}
      <path d="M 108 90 L 134 86 L 153 81 L 158 78
               L 158 51 L 125 44 L 100 54 L 100 84 Z"
        fill="white" />
      {/* Líneas del peto */}
      <path d="M 122 56 L 120 78 M 139 53 L 137 75"
        stroke="#06060e" strokeWidth="1.6" opacity="0.28" />
      {/* Hombros */}
      <ellipse cx={156} cy={54} rx={10}  ry={7}   fill="white" opacity="0.62" />
      <ellipse cx={100} cy={57} rx={8.5} ry={6}   fill="white" opacity="0.62" />

      {/* BRAZOS */}
      {/* Brazo izquierdo: hombro izq → codo → puño izquierdo del manillar */}
      <path d="M 102 56 Q 134 47 162 67"
        stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Brazo derecho: hombro der → codo → puño derecho del manillar */}
      <path d="M 155 53 Q 196 44 238 64"
        stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* CUELLO */}
      <line x1={120} y1={45} x2={110} y2={30} stroke="white" strokeWidth="12" strokeLinecap="round" />

      {/* ══ CASCO MOTOCROSS ══ */}
      {/* Cúpula principal */}
      <ellipse cx={107} cy={22} rx={24} ry={22} fill="white" />
      {/* VISERA PRONUNCIADA — se extiende hacia adelante (derecha) */}
      <path d="M 123 10 Q 148 2 161 10 L 157 23 Q 140 15 123 20 Z" fill="white" />
      {/* Mentonera / chin guard */}
      <path d="M 82 32 Q 84 52 101 57 Q 120 62 130 50"
        stroke="white" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      {/* Apertura de gafas (oscura) */}
      <path d="M 87 23 Q 97 13 123 18 Q 132 28 122 37 Q 102 43 85 34 Z" fill="#06060e" />
      {/* Reflejo de la lente */}
      <path d="M 94 18 Q 112 10 123 14"
        stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
      {/* Correa lateral de las gafas */}
      <line x1={82} y1={27} x2={87} y2={27} stroke="white" strokeWidth="4.5" strokeLinecap="round" />
      {/* Ventilaciones superiores del casco */}
      <path d="M 98  5 L 98  13" stroke="#06060e" strokeWidth="2.8" strokeLinecap="round" opacity="0.34" />
      <path d="M 107 4 L 107 12" stroke="#06060e" strokeWidth="2.8" strokeLinecap="round" opacity="0.34" />
      <path d="M 116 5 L 116 13" stroke="#06060e" strokeWidth="2.8" strokeLinecap="round" opacity="0.34" />

    </svg>
  )
}
