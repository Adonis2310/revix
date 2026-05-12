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

      await Promise.all([
        motoControls.start({
          rotate: -5, x: '140vw', y: -18, scale: 0.82,
          transition: { duration: 0.52, ease: [0.38, 0, 0.85, 1] },
        }),
        frontShadow.start({ x: '140vw', transition: { duration: 0.52 } }),
        rearShadow.start({ x: '140vw', transition: { duration: 0.52 } }),
      ])

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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[320px] bg-gradient-radial from-accent-blue/10 to-transparent rounded-full blur-[90px]" />
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
        initial={{ opacity: 0, y: 70, scale: 0.82 }}
        style={{ originX: 0.28, originY: 0.92 }}
        className="relative"
      >
        {/* Speed lines */}
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
   SILUETA — Motocross / Enduro con piloto en caballito
───────────────────────────────────────────────────────────── */
function DirtBikeSilhouette({
  frontShadow,
  rearShadow,
}: {
  frontShadow: AnimationControls
  rearShadow: AnimationControls
}) {
  const nSpokes = 14
  const spokeAngles = Array.from(
    { length: nSpokes },
    (_, i) => (i * (360 / nSpokes) * Math.PI) / 180
  )

  const RW = { x: 82,  y: 150 }
  const FW = { x: 262, y: 150 }

  return (
    <svg width="360" height="204" viewBox="0 0 360 204" fill="none">

      {/* ══ SOMBRAS EN EL SUELO ══ */}
      <motion.ellipse
        animate={rearShadow}
        initial={{ opacity: 0.22 }}
        cx={RW.x} cy={194} rx={34} ry={5}
        fill="white"
        style={{ originX: `${RW.x}px`, originY: '194px' }}
      />
      <motion.ellipse
        animate={frontShadow}
        initial={{ opacity: 0.22 }}
        cx={FW.x} cy={194} rx={34} ry={5}
        fill="white"
        style={{ originX: `${FW.x}px`, originY: '194px' }}
      />

      {/* ══ RUEDA TRASERA ══ */}
      {/* Carcasa del neumático */}
      <circle cx={RW.x} cy={RW.y} r={30} stroke="white" strokeWidth="9" fill="none" />
      {/* Bloques de taco principales */}
      <circle cx={RW.x} cy={RW.y} r={36} stroke="white" strokeWidth="3.5" strokeDasharray="9 5.5" fill="none" />
      {/* Fila de tacos intercalada */}
      <circle cx={RW.x} cy={RW.y} r={34.5} stroke="white" strokeWidth="1.5"
        strokeDasharray="3.5 11" strokeDashoffset="7.25" fill="none" opacity="0.5" />
      {/* Plato del buje */}
      <circle cx={RW.x} cy={RW.y} r={10} fill="white" />
      <circle cx={RW.x} cy={RW.y} r={5}  fill="#07070f" />
      <circle cx={RW.x} cy={RW.y} r={2}  fill="white" />
      {/* 14 rayos delgados */}
      {spokeAngles.map((a, i) => (
        <line key={`rs${i}`}
          x1={RW.x + 11 * Math.cos(a)} y1={RW.y + 11 * Math.sin(a)}
          x2={RW.x + 27 * Math.cos(a)} y2={RW.y + 27 * Math.sin(a)}
          stroke="white" strokeWidth="0.9" opacity="0.72"
        />
      ))}

      {/* ══ RUEDA DELANTERA ══ */}
      <circle cx={FW.x} cy={FW.y} r={30} stroke="white" strokeWidth="9" fill="none" />
      <circle cx={FW.x} cy={FW.y} r={36} stroke="white" strokeWidth="3.5" strokeDasharray="9 5.5" fill="none" />
      <circle cx={FW.x} cy={FW.y} r={34.5} stroke="white" strokeWidth="1.5"
        strokeDasharray="3.5 11" strokeDashoffset="7.25" fill="none" opacity="0.5" />
      {/* Disco de freno (segmentos = perforaciones del disco) */}
      <circle cx={FW.x} cy={FW.y} r={21} stroke="white" strokeWidth="2.8"
        strokeDasharray="11 5" fill="none" opacity="0.85" />
      {/* Aro portadisco */}
      <circle cx={FW.x} cy={FW.y} r={14} stroke="white" strokeWidth="1.5" fill="none" opacity="0.45" />
      {/* Buje */}
      <circle cx={FW.x} cy={FW.y} r={10} fill="white" />
      <circle cx={FW.x} cy={FW.y} r={5}  fill="#07070f" />
      <circle cx={FW.x} cy={FW.y} r={2}  fill="white" />
      {/* 14 rayos delgados */}
      {spokeAngles.map((a, i) => (
        <line key={`fs${i}`}
          x1={FW.x + 11 * Math.cos(a)} y1={FW.y + 11 * Math.sin(a)}
          x2={FW.x + 27 * Math.cos(a)} y2={FW.y + 27 * Math.sin(a)}
          stroke="white" strokeWidth="0.9" opacity="0.72"
        />
      ))}

      {/* ══ BRAZO OSCILANTE ══ */}
      <line x1={RW.x} y1={RW.y - 2} x2={154} y2={112}
        stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      {/* Refuerzo del brazo oscilante */}
      <line x1={108} y1={138} x2={132} y2={122}
        stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.48" />

      {/* ══ CHASIS PRINCIPAL ══ */}
      {/* Tubo superior (columna vertebral) */}
      <path d="M 118 78 L 216 72" stroke="white" strokeWidth="9" strokeLinecap="round" />
      {/* Tubo de bajada */}
      <line x1={216} y1={75} x2={154} y2={112}
        stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      {/* Vaina trasera + soporte del asiento */}
      <path d="M 118 78 L 97 112 L 82 150"
        stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Amortiguador trasero */}
      <line x1={126} y1={84} x2={112} y2={118}
        stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* Cuerpo del amortiguador (sección gruesa) */}
      <line x1={122} y1={96} x2={116} y2={108}
        stroke="white" strokeWidth="6.5" strokeLinecap="round" opacity="0.42" />

      {/* ══ MOTOR ══ */}
      {/* Cabeza de cilindro */}
      <rect x={154} y={94} width={30} height={12} rx={3} fill="white" />
      {/* Bloque del motor */}
      <rect x={144} y={104} width={48} height={30} rx={5} fill="white" />
      {/* Aletas del motor */}
      <line x1={152} y1={110} x2={152} y2={128} stroke="#07070f" strokeWidth="1.5" opacity="0.38" />
      <line x1={160} y1={110} x2={160} y2={128} stroke="#07070f" strokeWidth="1.5" opacity="0.38" />
      <line x1={168} y1={110} x2={168} y2={128} stroke="#07070f" strokeWidth="1.5" opacity="0.38" />
      <line x1={176} y1={110} x2={176} y2={128} stroke="#07070f" strokeWidth="1.5" opacity="0.38" />
      {/* Placa deslizante */}
      <path d="M 142 134 Q 168 150 198 134"
        stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ══ CABEZA DE DIRECCIÓN ══ */}
      <rect x={210} y={64} width={13} height={25} rx={4} fill="white" />

      {/* ══ HORQUILLA DELANTERA (largo recorrido) ══ */}
      <line x1={210} y1={82} x2={246} y2={150}
        stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      <line x1={221} y1={80} x2={257} y2={148}
        stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      {/* Protector de horquilla */}
      <rect x={214} y={100} width={9} height={20} rx={3} fill="white" opacity="0.4" />
      {/* Abrazadera del eje */}
      <line x1={246} y1={150} x2={258} y2={148}
        stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* ══ GUARDABARROS DELANTERO (grande, angulado) ══ */}
      <path d="M 220 86 Q 242 55 276 70 Q 292 86 285 110 Q 272 122 256 114 Q 248 95 236 88 Z"
        fill="white" />
      <path d="M 246 92 Q 258 78 272 80"
        stroke="#07070f" strokeWidth="2" opacity="0.3" fill="none" />

      {/* ══ GUARDABARROS TRASERO ══ */}
      <path d="M 52 113 Q 64 83 101 97"
        stroke="white" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M 99 91 Q 108 79 118 76"
        stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ══ TANQUE ══ */}
      <path d="M 130 74 Q 154 60 202 68 L 204 78 Q 168 84 132 82 Z" fill="white" />

      {/* ══ ESCAPE ══ */}
      <path d="M 160 126 Q 128 136 102 146 Q 85 152 74 147"
        stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Protector térmico */}
      <path d="M 126 134 Q 112 139 100 144"
        stroke="white" strokeWidth="8.5" strokeLinecap="round" opacity="0.27" />

      {/* ══ MANILLAR ANCHO (separado del carenado) ══ */}
      <path d="M 158 60 Q 210 52 234 58"
        stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Barra cruzada */}
      <line x1={180} y1={57} x2={220} y2={56}
        stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      {/* Protectores de mano */}
      <path d="M 158 60 L 150 55 L 154 65 Z" fill="white" opacity="0.82" />
      <path d="M 234 58 L 242 53 L 239 63 Z" fill="white" opacity="0.82" />

      {/* ══════════════ PILOTO ══════════════ */}

      {/* BOTAS */}
      <path d="M 118 142 L 99  146" stroke="white" strokeWidth="10" strokeLinecap="round" />
      <path d="M 163 138 L 180 141" stroke="white" strokeWidth="10" strokeLinecap="round" />

      {/* PIERNAS */}
      {/* Pierna izquierda (hacia atrás) */}
      <path d="M 114 86 Q 106 118 118 142"
        stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Pierna derecha (hacia adelante) */}
      <path d="M 140 82 Q 154 112 163 138"
        stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* RODILLERAS */}
      <ellipse cx={107} cy={118} rx={9}  ry={6.5} fill="white" opacity="0.6" />
      <ellipse cx={154} cy={113} rx={9}  ry={6.5} fill="white" opacity="0.6" />

      {/* TORSO + PETO (piloto inclinado hacia atrás — postura de caballito) */}
      <path d="M 108 86 L 130 82 L 147 77 L 152 74 L 152 50 L 122 44 L 102 52 L 102 80 Z"
        fill="white" />
      {/* Líneas del peto */}
      <path d="M 120 54 L 118 74 M 135 52 L 133 72"
        stroke="#07070f" strokeWidth="1.5" opacity="0.3" />
      {/* Hombreras */}
      <ellipse cx={150} cy={52} rx={9}  ry={6} fill="white" opacity="0.68" />
      <ellipse cx={102} cy={54} rx={7.5} ry={5} fill="white" opacity="0.68" />

      {/* BRAZOS (extendidos hacia el manillar) */}
      {/* Brazo izquierdo: hombro → codo → puño izquierdo */}
      <path d="M 104 53 Q 134 45 158 62"
        stroke="white" strokeWidth="10.5" strokeLinecap="round" fill="none" />
      {/* Brazo derecho: hombro → codo → puño derecho */}
      <path d="M 150 51 Q 190 43 230 60"
        stroke="white" strokeWidth="10.5" strokeLinecap="round" fill="none" />

      {/* CUELLO */}
      <line x1={118} y1={45} x2={109} y2={31}
        stroke="white" strokeWidth="11" strokeLinecap="round" />

      {/* ══ CASCO MOTOCROSS (visera pronunciada) ══ */}
      {/* Cúpula principal */}
      <ellipse cx={104} cy={22} rx={23} ry={21} fill="white" />
      {/* VISERA pronunciada — se extiende hacia adelante (derecha) */}
      <path d="M 120 11 Q 142 4 154 11 L 150 22 Q 135 15 120 20 Z" fill="white" />
      {/* Barboquejo / mentonera */}
      <path d="M 80 30 Q 82 49 99 53 Q 117 58 126 47"
        stroke="white" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      {/* Apertura de gafas (oscura) */}
      <path d="M 86 22 Q 96 13 120 17 Q 129 26 119 35 Q 100 40 84 32 Z"
        fill="#07070f" />
      {/* Reflejo de la lente */}
      <path d="M 93 17 Q 109 10 120 14"
        stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Correa de las gafas */}
      <line x1={81} y1={25} x2={86} y2={25}
        stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Ventilaciones del casco */}
      <path d="M 96 5 L 96 12"  stroke="#07070f" strokeWidth="2.5" strokeLinecap="round" opacity="0.36" />
      <path d="M 104 4 L 104 11" stroke="#07070f" strokeWidth="2.5" strokeLinecap="round" opacity="0.36" />
      <path d="M 112 5 L 112 12" stroke="#07070f" strokeWidth="2.5" strokeLinecap="round" opacity="0.36" />
      {/* Franja gráfica del casco */}
      <path d="M 84 19 Q 102 9 122 12"
        stroke="#07070f" strokeWidth="2" opacity="0.22" fill="none" />

    </svg>
  )
}
