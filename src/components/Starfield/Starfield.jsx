import './Starfield.css'
import { useEffect, useRef } from 'react'

// Lightweight canvas particles with pointer parallax. Static when reduced motion is on.
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let w = 0
    let h = 0
    let stars = []
    let cosmicDust = []
    let dust = []
    let cursorTrail = []
    let shootingStars = []
    let raf = 0
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    let lastTime = 0
    let nextShootingStar = 3500 + Math.random() * 5000
    const cursor = { x: 0, y: 0, tx: 0, ty: 0, visible: false }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(420, Math.max(120, Math.round((w * h) / 5200)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        color: Math.random() > 0.86 ? '#a6b7ff' : Math.random() > 0.72 ? '#75d8ff' : '#ffffff',
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        pulse: Math.random() * 0.018 + 0.006,
      }))
      cosmicDust = Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00004 + Math.random() * 0.00008,
        depth: 0.35 + Math.random() * 0.65,
        size: Math.random() * 1.1 + 0.35,
        color: Math.random() > 0.5 ? '#7899ff' : '#9b72d1',
      }))
    }

    const drawNebula = (time) => {
      const clouds = [
        { x: 0.2, y: 0.18, size: 0.42, color: 'rgba(71, 56, 150, 0.09)', drift: 0.00008 },
        { x: 0.82, y: 0.64, size: 0.5, color: 'rgba(22, 105, 153, 0.08)', drift: -0.00007 },
        { x: 0.52, y: 0.94, size: 0.34, color: 'rgba(111, 52, 155, 0.065)', drift: 0.00006 },
      ]
      for (const cloud of clouds) {
        const drift = Math.sin(time * cloud.drift) * 34
        const x = w * cloud.x + drift
        const y = h * cloud.y + Math.cos(time * cloud.drift) * 12
        const radius = Math.max(w, h) * cloud.size
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, cloud.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      }
    }

    const drawCosmicDust = (time) => {
      ctx.globalCompositeOperation = 'lighter'
      for (const particle of cosmicDust) {
        const angle = time * particle.speed + particle.phase
        const x = particle.x + Math.sin(angle) * 34 * particle.depth
        const y = particle.y + Math.cos(angle * 0.8) * 24 * particle.depth
        ctx.globalAlpha = 0.08 + particle.depth * 0.12
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(x, y, particle.size * particle.depth, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const addDust = (x, y, amount = 1) => {
      if (reduce || !finePointer) return
      for (let i = 0; i < amount; i += 1) {
        dust.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          life: 1,
          size: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? '#75d8ff' : '#ffffff',
        })
      }
      if (dust.length > 90) dust.splice(0, dust.length - 90)
    }

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * w * 0.9 + w * 0.1,
        y: Math.random() * h * 0.35,
        vx: -(3.2 + Math.random() * 2.2),
        vy: 1.8 + Math.random() * 1.5,
        length: 10 + Math.random() * 18,
        life: 1,
      })
    }

    const draw = (time = 0) => {
      const delta = lastTime ? Math.min(40, time - lastTime) : 16.67
      lastTime = time
      ctx.clearRect(0, 0, w, h)
      drawNebula(time)
      drawCosmicDust(time)
      px += (tx - px) * 0.05
      py += (ty - py) * 0.05
      if (!reduce) {
        cursor.x += (cursor.tx - cursor.x) * 0.16
        cursor.y += (cursor.ty - cursor.y) * 0.16
        if (finePointer && cursor.visible && Math.random() > 0.55) addDust(cursor.x, cursor.y)
        if (time > nextShootingStar) {
          spawnShootingStar()
          nextShootingStar = time + 5000 + Math.random() * 8000
        }
      }

      const points = []
      for (const s of stars) {
        if (!reduce) {
          const depthSpeed = 0.45 + s.z * 1.35
          const frameScale = delta / 16.67
          s.x += s.vx * frameScale * depthSpeed
          s.y += s.vy * frameScale * depthSpeed
          s.phase += s.pulse * frameScale
          if (s.x < -12) s.x = w + 12
          if (s.x > w + 12) s.x = -12
          if (s.y < -12) s.y = h + 12
          if (s.y > h + 12) s.y = -12
        }
        const x = s.x + px * s.z * 28
        const y = s.y + py * s.z * 28
        points.push({ x, y })
      }

      // Fine connecting threads add depth without turning the background into a grid.
      const connectionCellSize = 105
      const connectionGrid = new Map()
      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        const cellX = Math.floor(point.x / connectionCellSize)
        const cellY = Math.floor(point.y / connectionCellSize)
        const key = `${cellX},${cellY}`
        const cell = connectionGrid.get(key)
        if (cell) cell.push(i)
        else connectionGrid.set(key, [i])
      }

      ctx.lineWidth = 0.5
      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        const cellX = Math.floor(point.x / connectionCellSize)
        const cellY = Math.floor(point.y / connectionCellSize)
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            const nearby = connectionGrid.get(`${cellX + offsetX},${cellY + offsetY}`)
            if (!nearby) continue
            for (const j of nearby) {
              if (j <= i || (i + j) % 8 !== 0) continue
              const dx = point.x - points[j].x
              const dy = point.y - points[j].y
              const distance = Math.hypot(dx, dy)
              if (distance > connectionCellSize) continue
              ctx.globalAlpha = (1 - distance / connectionCellSize) * 0.16
              ctx.strokeStyle = '#75d8ff'
              ctx.beginPath()
              ctx.moveTo(point.x, point.y)
              ctx.lineTo(points[j].x, points[j].y)
              ctx.stroke()
            }
          }
        }
      }

      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i]
        const point = points[i]
        const pulse = 0.82 + Math.sin(time * 0.001 + s.phase) * 0.18
        const radius = s.r * (0.82 + s.z) * pulse
        ctx.globalAlpha = (0.11 + s.z * 0.18) * pulse
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius * 3.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 0.36 + s.z * 0.5
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = shootingStars.length - 1; i >= 0; i -= 1) {
        const star = shootingStars[i]
        star.x += star.vx
        star.y += star.vy
        star.life -= 0.018
        ctx.globalAlpha = Math.max(0, star.life) * 0.7
        ctx.strokeStyle = '#d8f6ff'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length)
        ctx.stroke()
        if (star.life <= 0) shootingStars.splice(i, 1)
      }

      for (let i = dust.length - 1; i >= 0; i -= 1) {
        const particle = dust[i]
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life = Math.max(0, particle.life - 0.035)
        ctx.globalAlpha = Math.max(0, particle.life) * 0.75
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
        ctx.fill()
        if (particle.life <= 0) dust.splice(i, 1)
      }

      if (finePointer && cursor.visible && !reduce) {
        cursorTrail.push({ x: cursor.x, y: cursor.y, life: 1 })
        if (cursorTrail.length > 14) cursorTrail.shift()
      }
      for (let i = cursorTrail.length - 1; i >= 0; i -= 1) {
        const trail = cursorTrail[i]
        trail.life *= 0.78
        ctx.globalAlpha = trail.life * 0.18
        ctx.fillStyle = '#75d8ff'
        ctx.beginPath()
        ctx.arc(trail.x, trail.y, 2 + trail.life * 5, 0, Math.PI * 2)
        ctx.fill()
        if (trail.life < 0.03) cursorTrail.splice(i, 1)
      }
      if (finePointer && cursor.visible && !reduce) {
        const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 26)
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        glow.addColorStop(0.14, 'rgba(117, 216, 255, 0.55)')
        glow.addColorStop(1, 'rgba(117, 216, 255, 0)')
        ctx.globalAlpha = 0.9
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cursor.x, cursor.y, 26, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = 0
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      if (!finePointer || (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
      cursor.tx = e.clientX
      cursor.ty = e.clientY
      cursor.visible = true
      addDust(e.clientX, e.clientY, 2)
    }
    const onLeave = () => { cursor.visible = false }
    const stop = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }
    const start = () => {
      if (reduce || document.hidden || raf) return
      raf = requestAnimationFrame(draw)
    }
    const onVisibility = () => {
      stop()
      start()
    }

    resize()
    if (reduce) draw(0)
    else start()
    window.addEventListener('resize', resize)
    if (finePointer && !reduce) {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerleave', onLeave)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      if (finePointer && !reduce) {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerleave', onLeave)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas className="starfield" ref={ref} aria-hidden="true" />
}
