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

    // ── Front wheel
    ctx.beginPath()
    ctx.arc(272, 158, 42, 0, Math.PI * 2)
    ctx.fill()

    // ── Main chassis + fenders (one compound silhouette)
    ctx.beginPath()
    ctx.moveTo(46, 152)
    ctx.bezierCurveTo(46, 122, 52, 104, 58, 96)
    ctx.bezierCurveTo(68, 80, 92, 76, 120, 80)
    ctx.lineTo(162, 72)
    ctx.bezierCurveTo(178, 62, 210, 66, 222, 72)
    ctx.bezierCurveTo(228, 76, 228, 82, 220, 86)
    ctx.bezierCurveTo(242, 58, 260, 60, 270, 76)
    ctx.bezierCurveTo(312, 88, 308, 124, 276, 132)
    ctx.lineTo(266, 152)
    ctx.lineTo(232, 196)
    ctx.lineTo(128, 196)
    ctx.lineTo(88, 196)
    ctx.lineTo(46, 152)
    ctx.closePath()
    ctx.fill()

    // ── Front fender protrusion
    ctx.beginPath()
    ctx.moveTo(224, 86)
    ctx.bezierCurveTo(248, 56, 296, 70, 310, 102)
    ctx.bezierCurveTo(314, 120, 300, 138, 274, 128)
    ctx.closePath()
    ctx.fill()

    // ── Rider helmet
    ctx.beginPath()
    ctx.ellipse(107, 22, 30, 26, -0.05, 0, Math.PI * 2)
    ctx.fill()

    // ── Rider torso (leaning back)
    ctx.beginPath()
    ctx.moveTo(83, 32)
    ctx.bezierCurveTo(82, 54, 100, 64, 132, 52)
    ctx.bezierCurveTo(156, 44, 162, 66, 155, 82)
    ctx.lineTo(108, 92)
    ctx.lineTo(100, 56)
    ctx.closePath()
    ctx.fill()
  }

  const drawLines = () => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'

    // Arms
    ctx.lineWidth = 11
    ctx.beginPath(); ctx.moveTo(103, 57); ctx.bezierCurveTo(136, 46, 163, 65, 163, 65); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(156, 53); ctx.bezierCurveTo(198, 42, 240, 62, 240, 62); ctx.stroke()

    // Legs
    ctx.lineWidth = 13
    ctx.beginPath(); ctx.moveTo(110, 91); ctx.quadraticCurveTo(102, 124, 114, 148); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(140, 87); ctx.quadraticCurveTo(154, 118, 160, 146); ctx.stroke()

    // Handlebars
    ctx.lineWidth = 7
    ctx.beginPath(); ctx.moveTo(152, 64); ctx.bezierCurveTo(192, 54, 226, 61, 250, 57); ctx.stroke()

    // Exhaust
    ctx.lineWidth = 6.5
    ctx.beginPath(); ctx.moveTo(166, 133); ctx.bezierCurveTo(134, 143, 108, 154, 73, 154); ctx.stroke()
  }

  /* Pass 1 — broad white glow (heaviest blur) */
  ctx.save()
  ctx.fillStyle   = 'rgba(255,255,255,0.6)'
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.filter = 'blur(14px)'
  drawBody(); drawLines()
  ctx.restore()

  /* Pass 2 — red accent on front wheel */
  ctx.save()
  ctx.filter    = 'blur(20px)'
  ctx.fillStyle = 'rgba(255,59,48,0.3)'
  ctx.beginPath(); ctx.arc(272, 158, 58, 0, Math.PI * 2); ctx.fill()
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

  /* Pass 5 — crisp edge detail (very low opacity) */
  ctx.save()
  ctx.filter      = 'none'
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.fillStyle   = 'rgba(0,0,0,0)'
  ctx.lineWidth   = 1.2
  ctx.lineCap     = 'round'
  ctx.beginPath(); ctx.arc(88,  158, 40, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(272, 158, 40, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(132, 76); ctx.bezierCurveTo(172, 62, 208, 68, 218, 72); ctx.stroke()
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
