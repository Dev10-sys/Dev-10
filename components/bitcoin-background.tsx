"use client"

import { useEffect, useRef } from "react"

type Props = {
  density?: number
  speed?: number
  className?: string
  // new optional layers
  network?: boolean
  coins?: boolean
  sparkles?: boolean
  nodeCount?: number
  coinCount?: number
  sparkleCount?: number
  btcSymbols?: boolean
  symbolCount?: number
}

const BitcoinBackground = ({
  density = 60,
  speed = 0.4,
  className,
  network = true,
  coins = true,
  sparkles = true,
  nodeCount = 28,
  coinCount = 10,
  sparkleCount = 20,
  btcSymbols = true,
  symbolCount = 14,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const color = (token: string, alpha: number, fallback: string) => {
      const bitcoinColors: Record<string, string> = {
        primary: '247, 147, 26', // Bitcoin orange
        accent: '252, 194, 3', // Gold/Yellow
        foreground: '255, 234, 167', // Cream/Yellow
        'muted-foreground': '247, 147, 26' 
      }
      
      const colorValue = bitcoinColors[token] || '247, 147, 26'
      return `rgba(${colorValue}, ${Math.max(0, Math.min(1, alpha))})` || fallback
    }

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const dpr = getDpr()
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      width = w
      height = h
    }

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    resize()

    const handleResize = () => {
      resize()
    }
    window.addEventListener("resize", handleResize)

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const blocks = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      s: 6 + Math.random() * 10, // size
      v: speed * (0.3 + Math.random()), // velocity
      o: 0.06 + Math.random() * 0.12, // opacity
    }))

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * speed * 0.8,
      vy: (Math.random() - 0.5) * speed * 0.8,
      o: 0.08 + Math.random() * 0.15,
    }))

    const circles = Array.from({ length: coinCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      s: 8 + Math.random() * 12,
      vx: (Math.random() - 0.5) * speed * 0.6,
      vy: (Math.random() - 0.5) * speed * 0.6,
      rot: Math.random() * Math.PI * 2,
      o: 0.1 + Math.random() * 0.15,
    }))

    const sparks = Array.from({ length: sparkleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
      size: 0.8 + Math.random() * 1.4,
    }))

    const symbols = Array.from({ length: btcSymbols ? symbolCount : 0 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 18,
      rot: (Math.random() - 0.5) * 0.4,
      vx: (Math.random() - 0.5) * speed * 0.4,
      vy: (Math.random() - 0.5) * speed * 0.4,
      o: 0.12 + Math.random() * 0.2,
    }))

    const wrap = (p: { x: number; y: number }) => {
      if (p.x > width + 20) p.x = -20
      if (p.x < -20) p.x = width + 20
      if (p.y > height + 20) p.y = -20
      if (p.y < -20) p.y = height + 20
    }

    const drawBlocks = () => {
      for (const b of blocks) {
        ctx.strokeStyle = color("primary", b.o * 1.2, `rgba(247,147,26,${b.o * 1.2})`) // much more visible orange stroke
        ctx.fillStyle = color("accent", b.o * 0.6, `rgba(247,147,26,${b.o * 0.6})`) // much more visible orange fill
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.rect(Math.floor(b.x), Math.floor(b.y), b.s, b.s)
        ctx.fill()
        ctx.stroke()

        // hash-like trailing line
        ctx.strokeStyle = color("muted-foreground", b.o * 0.05, `rgba(247,147,26,${b.o * 0.05})`)
        ctx.beginPath()
        ctx.moveTo(b.x, b.y + b.s / 2)
        ctx.lineTo(b.x - b.s * 1.8, b.y + b.s / 2)
        ctx.stroke()

        if (!prefersReduced) {
          b.y += b.v
          b.x += b.v * 0.3
          wrap(b)
        }
      }
    }

    const drawNetwork = () => {
      if (!network) return
      const maxDist = 90
      const time = performance.now() * 0.001
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n1.x - n2.x
          const dy = n1.y - n2.y
          const d2 = dx * dx + dy * dy
          if (d2 < maxDist * maxDist) {
            const a = 1 - Math.sqrt(d2) / maxDist
            // Dynamic pulse for lines
            const linePulse = 0.5 + Math.sin(time + (n1.x + n1.y) * 0.01) * 0.2
            ctx.strokeStyle = color("accent", 0.4 * a * linePulse, `rgba(247,147,26,${0.4 * a * linePulse})`) 
            ctx.lineWidth = 1.5 + a * 2
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        // Subtle pulsing for nodes
        const pulse = 1 + Math.sin(time * 2 + (n.x + n.y) * 0.01) * 0.15
        ctx.fillStyle = color("primary", Math.min(1, n.o * 2 * pulse), `rgba(247,147,26,${Math.min(1, n.o * 2 * pulse)})`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        ctx.fill()
        
        // Add a subtle outer glow for nodes
        ctx.shadowBlur = 8 * pulse
        ctx.shadowColor = `rgba(247, 147, 26, ${0.4 * pulse})`
        ctx.stroke()
        ctx.shadowBlur = 0

        if (!prefersReduced) {
          n.x += n.vx
          n.y += n.vy
          wrap(n)
        }
      }
    }

    // const drawCoins = () => {
    //   if (!coins) return
    //   for (const c of circles) {
    //     // ring
    //     ctx.lineWidth = 2
    //     ctx.strokeStyle = color("primary", Math.min(1, c.o * 1.0), `rgba(247,147,26,${Math.min(1, c.o * 1.0)})`) // very bright orange
    //     ctx.fillStyle = color("accent", c.o * 0.4, `rgba(247,147,26,${c.o * 0.4})`) // very bright fill
    //     ctx.beginPath()
    //     ctx.arc(c.x, c.y, c.s, 0, Math.PI * 2)
    //     ctx.fill()
    //     ctx.stroke()

    //     // inner ring
    //     ctx.beginPath()
    //     ctx.arc(c.x, c.y, c.s * 0.6, 0, Math.PI * 2)
    //     ctx.strokeStyle = color("primary", c.o * 0.8, `rgba(247,147,26,${c.o * 0.8})`)
    //     ctx.stroke()

    //     // highlight
    //     ctx.strokeStyle = color("foreground", c.o * 0.6, `rgba(247,147,26,${c.o * 0.6})`)
    //     ctx.beginPath()
    //     ctx.arc(c.x - c.s * 0.3, c.y - c.s * 0.3, c.s * 0.2, 0, Math.PI * 2)
    //     ctx.stroke()

    //     if (!prefersReduced) {
    //       c.x += c.vx
    //       c.y += c.vy
    //       c.rot += 0.01
    //       wrap(c)
    //     }
    //   }
    // }

    const drawSymbols = () => {
      if (!btcSymbols || symbols.length === 0) return
      for (const s of symbols) {
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rot)
        ctx.font = `400 ${Math.max(10, s.size)}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = color("primary", Math.min(0.4, s.o * 1.5), `rgba(247,147,26,${Math.min(0.4, s.o * 1.5)})`) // much brighter ₿ symbols
        ctx.strokeStyle = color("primary", Math.min(0.5, s.o * 1.8), `rgba(247,147,26,${Math.min(0.5, s.o * 1.8)})`)
        ctx.lineWidth = 0.8
        ctx.fillText("₿", 0, 0)
        ctx.strokeText("₿", 0, 0)
        ctx.restore()

        if (!prefersReduced) {
          s.x += s.vx
          s.y += s.vy
          s.rot += (Math.random() - 0.5) * 0.01
          wrap(s)
        }
      }
    }

    const drawSparkles = (t: number) => {
      if (!sparkles) return
      for (const s of sparks) {
        const phase = s.phase + t * s.speed
        const alpha = 0.4 + (Math.sin(phase) + 1) * 0.4 // very bright sparkles
        ctx.fillStyle = color("foreground", Math.min(1, alpha), `rgba(247,147,26,${Math.min(1, alpha)})`) // very bright orange sparkles
        ctx.fillRect(s.x, s.y, 1, s.size)
        ctx.fillRect(s.x, s.y, s.size, 1)
      }
    }

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height)

      // layering order: network -> blocks -> coins -> symbols -> sparkles
      drawNetwork()
      drawBlocks()
      // drawCoins()
      drawSymbols()
      drawSparkles(time)

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [density, speed, network, coins, sparkles, nodeCount, coinCount, sparkleCount, btcSymbols, symbolCount])

  return <canvas ref={canvasRef} className={className} aria-hidden role="presentation" />
}

export default BitcoinBackground
export { BitcoinBackground }
