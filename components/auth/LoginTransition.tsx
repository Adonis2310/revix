'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { RevixLogo } from '@/components/logo/RevixLogo'

interface LoginTransitionProps {
  onComplete: () => void
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const mountRef    = useRef<HTMLDivElement>(null)
  const logoRef     = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    /* ─── Dimensions ─── */
    const W = window.innerWidth
    const H = window.innerHeight

    /* ─── Renderer ─── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    /* ─── Orthographic camera — reliable sizing on all screens ─── */
    const H_UNITS = 10                      // visible scene height in world units
    const W_UNITS = H_UNITS * (W / H)       // world width scales with aspect ratio
    const camera  = new THREE.OrthographicCamera(
      -W_UNITS / 2, W_UNITS / 2,   // left / right
       H_UNITS / 2, -H_UNITS / 2,  // top  / bottom
      0.1, 100
    )
    camera.position.z = 5

    /* ─── Scene ─── */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#050507')

    /* ─── Responsive moto size ─── */
    const motoW = Math.min(W_UNITS * 0.88, 7.2)  // 88 % of screen width, max 7.2
    const motoH = motoW * (212 / 370)             // preserve SVG aspect ratio

    /* ─── Wheel world positions (from SVG coords) ─── */
    // SVG: rear wheel at (88, 158), front at (272, 158), viewBox 370×212
    const RX =  (88  / 370 - 0.5) * motoW   // ~−0.262 × motoW
    const FX =  (272 / 370 - 0.5) * motoW   // ~+0.235 × motoW
    const WY = -(158 / 212 - 0.5) * motoH   // ~−0.245 × motoH (y flipped in Three)

    /* ─── Particles ─── */
    const PC   = 100
    const pPos = new Float32Array(PC * 3)
    for (let i = 0; i < PC; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * W_UNITS * 1.1
      pPos[i * 3 + 1] = (Math.random() - 0.5) * H_UNITS * 1.1
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.03,
      transparent: true, opacity: 0, sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    /* ─── Mist planes ─── */
    const mistTex = buildMistTexture()
    const mists: THREE.Mesh[] = []
    for (let i = 0; i < 2; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: mistTex, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W_UNITS * 1.4, H_UNITS * 0.9), mat)
      mesh.position.set((i - 0.5) * W_UNITS * 0.3, 0, -1.5 + i * 0.8)
      scene.add(mesh)
      mists.push(mesh)
    }

    /* ─── Motorcycle silhouette ─── */
    const motoTex = buildMotoTexture()
    const motoMat = new THREE.MeshBasicMaterial({
      map: motoTex, transparent: true, opacity: 0, depthWrite: false,
    })
    const motoMesh = new THREE.Mesh(new THREE.PlaneGeometry(motoW, motoH), motoMat)
    motoMesh.position.set(0, 0, 0)
    scene.add(motoMesh)

    /* ─── Scan line (sweeps full width) ─── */
    const lineTex = buildLineTexture()
    const lineMat = new THREE.MeshBasicMaterial({
      map: lineTex, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const lineW    = W_UNITS + 4
    const lineMesh = new THREE.Mesh(new THREE.PlaneGeometry(lineW, 0.012), lineMat)
    lineMesh.position.set(-W_UNITS - 2, WY, 0.1)  // start offscreen left
    scene.add(lineMesh)

    /* ─── Wheel & body glow planes ─── */
    const wheelRadius = (42 / 370) * motoW
    const glowSize    = wheelRadius * 4.0
    const bodyGlowSz  = motoW * 1.15

    const rearGlowMat  = buildGlowMat(false)
    const frontGlowMat = buildGlowMat(true)
    const bodyGlowMat  = buildGlowMat(false)

    const rearGlow  = makePlane(rearGlowMat,  RX, WY, 0.05, glowSize,   glowSize)
    const frontGlow = makePlane(frontGlowMat, FX, WY, 0.05, glowSize * 0.82, glowSize * 0.82)
    const bodyGlow  = makePlane(bodyGlowMat,  0,  0,  -0.1, bodyGlowSz, motoH * 1.4)
    scene.add(rearGlow, frontGlow, bodyGlow)

    function makePlane(
      mat: THREE.MeshBasicMaterial,
      x: number, y: number, z: number,
      w: number, h: number,
    ) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
      m.position.set(x, y, z)
      return m
    }

    /* ─── Render loop ─── */
    let raf = 0, tick = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      tick += 0.014
      particles.position.y = Math.sin(tick * 0.12) * 0.06
      particles.rotation.z = tick * 0.008
      mists.forEach((m, i) => {
        m.position.x = Math.sin(tick * 0.14 + i * 1.6) * W_UNITS * 0.06
      })
      renderer.render(scene, camera)
    }
    render()

    /* ─── GSAP timeline ─── */
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        gsap.to(mount, {
          opacity: 0, duration: 0.32, ease: 'power2.inOut',
          onComplete: () => {
            cancelAnimationFrame(raf)
            dispose()
            onComplete()
          },
        })
      },
    })

    // 0.0 – Particles fade in
    tl.to(pMat, { opacity: 0.3, duration: 0.5 }, 0)

    // 0.05 – Mist fades in
    mists.forEach((m, i) =>
      tl.to((m.material as THREE.MeshBasicMaterial), { opacity: 0.06, duration: 0.7 }, 0.05 + i * 0.1)
    )

    // 0.25 – Scan line sweeps right
    tl.to(lineMat, { opacity: 1, duration: 0.05 }, 0.25)
    tl.to(lineMesh.position, { x: W_UNITS + 2, duration: 0.58, ease: 'power2.inOut' }, 0.25)
    tl.to(lineMat, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0.73)

    // 0.4 – Moto reveals as line passes over it
    tl.to(motoMat, { opacity: 1, duration: 0.55 }, 0.38)

    // 0.65 – Wheel glows pulse in
    tl.to((rearGlow.material  as THREE.MeshBasicMaterial), { opacity: 0.5,  duration: 0.6 }, 0.62)
    tl.to((frontGlow.material as THREE.MeshBasicMaterial), { opacity: 0.36, duration: 0.6 }, 0.70)
    tl.to((bodyGlow.material  as THREE.MeshBasicMaterial), { opacity: 0.045, duration: 0.8 }, 0.45)

    // Camera drift — gentle ortho pan
    tl.to(camera.position, { x: W_UNITS * 0.02, duration: 2.2, ease: 'power1.inOut' }, 0.35)

    // 1.1 – REVIX logo
    if (logoRef.current) {
      tl.fromTo(logoRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' },
        1.05,
      )
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.38 },
        1.30,
      )
    }

    // Hold → then onComplete triggers mount fade-out above
    tl.to({}, { duration: 0.48 }, 1.82)

    /* ─── Cleanup ─── */
    function dispose() {
      pGeo.dispose(); pMat.dispose()
      mistTex.dispose(); motoTex.dispose(); lineTex.dispose()
      mists.forEach(m => (m.material as THREE.MeshBasicMaterial).dispose())
      rearGlowMat.map?.dispose();  rearGlowMat.dispose()
      frontGlowMat.map?.dispose(); frontGlowMat.dispose()
      bodyGlowMat.map?.dispose();  bodyGlowMat.dispose()
      motoMat.dispose(); lineMat.dispose()
      renderer.dispose()
      mount?.removeChild(renderer.domElement)
    }

    return () => {
      tl.kill()
      cancelAnimationFrame(raf)
      try { dispose() } catch (_) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={mountRef} className="fixed inset-0 z-50" style={{ background: '#050507' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none">
        <div ref={logoRef} style={{ opacity: 0 }} className="flex items-center gap-3">
          <RevixLogo size={26} glow />
          <span className="text-label-lg text-content-primary uppercase tracking-[0.22em]">
            Revix
          </span>
        </div>
        <p
          ref={subtitleRef}
          style={{ opacity: 0 }}
          className="mt-3 text-label-sm text-content-muted uppercase tracking-[0.18em]"
        >
          Honda XR150L 2025
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Texture builders — all synchronous, canvas-based
════════════════════════════════════════════════════════════ */

/** Cinematic dark silhouette with glowing edges. Transparent bg. */
function buildMotoTexture(): THREE.CanvasTexture {
  const W = 740, H = 424          // 2× the SVG's native 370×212
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  ctx.scale(2, 2)                  // work in SVG coordinate space

  const drawBody = () => {
    // ── Rear wheel
    ctx.beginPath()
    ctx.arc(88, 158, 42, 0, Math.PI * 2)
    ctx.fill()

    // ── Front wheel (slightly larger visual — 21" front vs 18" rear on real XR)
    ctx.beginPath()
    ctx.arc(272, 158, 43, 0, Math.PI * 2)
    ctx.fill()

    // ── Complete outer silhouette — one clockwise connected path, no seams
    // Traces: rear fender → seat → tank hump → head tube → fork crown
    //         → front fender (aggressive enduro tip) → lower fork → ground → back
    ctx.beginPath()
    // Rear fender: sweeps up and back above rear wheel
    ctx.moveTo(36, 106)
    ctx.bezierCurveTo(36, 86, 48, 74, 66, 70)
    // Rear subframe meets seat
    ctx.bezierCurveTo(74, 68, 82, 66, 90, 66)
    // Seat — long and relatively flat (signature XR150L profile)
    ctx.lineTo(192, 68)
    // Tank — distinct hump rising above seat line
    ctx.bezierCurveTo(202, 66, 218, 54, 232, 56)
    // Steering head (slightly canted forward)
    ctx.lineTo(244, 52)
    ctx.lineTo(250, 56)
    // Head tube body (short, vertical)
    ctx.lineTo(254, 76)
    // Fork crown — transition to long-travel suspension
    ctx.bezierCurveTo(257, 84, 260, 90, 263, 96)
    // Front fender — aggressive XR enduro shape, sweeps forward past wheel
    ctx.bezierCurveTo(274, 86, 304, 72, 330, 88)
    ctx.bezierCurveTo(348, 108, 344, 142, 324, 154)
    // Lower fork legs converge at front axle
    ctx.bezierCurveTo(314, 158, 300, 160, 272, 158)
    // Ground
    ctx.lineTo(272, 196)
    ctx.lineTo(88, 196)
    // Rear axle / lower fender
    ctx.lineTo(88, 158)
    ctx.lineTo(36, 138)
    ctx.closePath()
    ctx.fill()

    // ── Rider helmet — motocross style, elongated, positioned correctly over tank
    ctx.beginPath()
    ctx.ellipse(146, 15, 26, 22, -0.06, 0, Math.PI * 2)
    ctx.fill()
    // Visor peak — pronounced forward protrusion (XR/motocross characteristic)
    ctx.beginPath()
    ctx.moveTo(160, 4)
    ctx.bezierCurveTo(183, -4, 198, 5, 194, 15)
    ctx.bezierCurveTo(190, 24, 165, 20, 161, 12)
    ctx.closePath()
    ctx.fill()

    // ── Rider torso — attack position: back upright, slight forward lean
    ctx.beginPath()
    ctx.moveTo(122, 28)           // upper back / neck base
    ctx.bezierCurveTo(120, 50, 124, 64, 138, 68) // down the spine
    ctx.lineTo(174, 68)           // across the lap at seat level
    ctx.bezierCurveTo(180, 52, 176, 38, 164, 29) // chest front (forward lean)
    ctx.bezierCurveTo(156, 22, 138, 18, 120, 22) // shoulder / collar
    ctx.closePath()
    ctx.fill()
  }

  const drawLines = () => {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // ── Fork tubes — long-travel suspension (two visible parallel tubes)
    //    This is one of the most distinctive visual elements of an enduro bike
    ctx.lineWidth = 5
    ctx.beginPath(); ctx.moveTo(250, 80); ctx.lineTo(272, 156); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(262, 78); ctx.lineTo(284, 154); ctx.stroke()

    // ── Handlebars — wide enduro crossbar design
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(170, 50)
    ctx.bezierCurveTo(196, 44, 226, 45, 258, 49)
    ctx.stroke()
    // Crossbrace (characteristic feature of motocross bars)
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(188, 47); ctx.lineTo(242, 47); ctx.stroke()

    // ── Arms — reaching forward at natural attack-stance angle
    ctx.lineWidth = 11
    ctx.beginPath()
    ctx.moveTo(124, 29)
    ctx.bezierCurveTo(150, 24, 178, 36, 200, 46)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(162, 28)
    ctx.bezierCurveTo(190, 22, 224, 35, 250, 45)
    ctx.stroke()

    // ── Legs — bent at knee (standing/attack stance on footpegs)
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(138, 66)
    ctx.bezierCurveTo(132, 98, 116, 122, 106, 150)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(168, 66)
    ctx.bezierCurveTo(167, 98, 163, 122, 165, 150)
    ctx.stroke()

    // ── Exhaust — high-mount enduro routing, exits mid-rear
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.moveTo(180, 136)
    ctx.bezierCurveTo(156, 145, 128, 152, 92, 152)
    ctx.stroke()
  }

  /* Pass 1 — broad white glow (heaviest blur) */
  ctx.save()
  ctx.fillStyle   = 'rgba(255,255,255,0.6)'
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.filter = 'blur(14px)'
  drawBody(); drawLines()
  ctx.restore()

  /* Pass 2 — red accent on front wheel + subtle on exhaust exit */
  ctx.save()
  ctx.filter    = 'blur(20px)'
  ctx.fillStyle = 'rgba(255,59,48,0.3)'
  ctx.beginPath(); ctx.arc(272, 158, 60, 0, Math.PI * 2); ctx.fill()
  // Subtle red hint at exhaust exit (rear lower)
  ctx.fillStyle = 'rgba(255,80,20,0.12)'
  ctx.beginPath(); ctx.arc(92, 152, 28, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  /* Pass 3 — tighter secondary glow */
  ctx.save()
  ctx.fillStyle   = 'rgba(255,255,255,0.38)'
  ctx.strokeStyle = 'rgba(255,255,255,0.38)'
  ctx.filter = 'blur(5px)'
  drawBody(); drawLines()
  ctx.restore()

  /* Pass 4 — dark silhouette fill (creates the cinematic "blocked" body) */
  ctx.save()
  ctx.filter      = 'none'
  ctx.fillStyle   = '#030308'
  ctx.strokeStyle = '#030308'
  drawBody(); drawLines()
  ctx.restore()

  /* Pass 5 — crisp structural edge detail (very low opacity, no fill) */
  ctx.save()
  ctx.filter      = 'none'
  ctx.fillStyle   = 'rgba(0,0,0,0)'
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineCap     = 'round'

  // Wheel rim rings
  ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.arc(88,  158, 40, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(272, 158, 41, 0, Math.PI * 2); ctx.stroke()

  // Tank top edge (subtle surface line)
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(144, 68); ctx.bezierCurveTo(178, 58, 210, 54, 232, 56); ctx.stroke()

  // Seat surface line
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(90, 66); ctx.lineTo(192, 68); ctx.stroke()

  // Swingarm line (from rear axle to frame pivot)
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(88, 158); ctx.bezierCurveTo(100, 146, 124, 130, 152, 118); ctx.stroke()

  // Fork guard band (horizontal detail on upper fork)
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(249, 106); ctx.lineTo(258, 105); ctx.stroke()

  ctx.restore()

  /* Pass 6 — wheel spokes */
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.lineWidth   = 0.65
  const N = 12
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    for (const [cx, cy] of [[88, 158], [272, 158]] as const) {
      ctx.beginPath()
      ctx.moveTo(cx + 9  * Math.cos(a), cy + 9  * Math.sin(a))
      ctx.lineTo(cx + 34 * Math.cos(a), cy + 34 * Math.sin(a))
      ctx.stroke()
    }
  }
  ctx.restore()

  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function buildMistTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 64, 0, 128, 64, 128)
  g.addColorStop(0,   'rgba(50,50,80,0.55)')
  g.addColorStop(0.5, 'rgba(20,20,50,0.15)')
  g.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function buildLineTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 8
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 512, 0)
  g.addColorStop(0,   'rgba(255,255,255,0)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.1)')
  g.addColorStop(0.5, 'rgba(255,255,255,1)')
  g.addColorStop(0.7, 'rgba(255,255,255,0.1)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 8)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function buildGlowMat(red: boolean): THREE.MeshBasicMaterial {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  if (red) {
    g.addColorStop(0,    'rgba(255,180,160,0.9)')
    g.addColorStop(0.25, 'rgba(255,70,40,0.5)')
    g.addColorStop(0.6,  'rgba(200,30,20,0.15)')
    g.addColorStop(1,    'rgba(0,0,0,0)')
  } else {
    g.addColorStop(0,    'rgba(255,255,255,0.9)')
    g.addColorStop(0.25, 'rgba(200,215,255,0.45)')
    g.addColorStop(0.6,  'rgba(100,130,255,0.12)')
    g.addColorStop(1,    'rgba(0,0,0,0)')
  }
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return new THREE.MeshBasicMaterial({
    map: tex, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
}
