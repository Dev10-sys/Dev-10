"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sysAudio } from "@/lib/audio";

type Props = { onEnter: () => void };

interface NebulaCloud {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  phase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export function BootScreen({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<"idle" | "warp" | "done">("idle");
  const [uiPhase, setUiPhase] = useState<"idle" | "warp" | "done">("idle");
  const scrollAccum = useRef(0);

  // Mouse Parallax coordinates (smoothly interpolated)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const triggerWarp = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "warp";
    setUiPhase("warp");
    sysAudio.playWarp();
    setTimeout(() => {
      phaseRef.current = "done";
      setUiPhase("done");
      onEnter();
    }, 1800);
  }, [onEnter]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current !== "idle") return;
      scrollAccum.current += e.deltaY;
      if (scrollAccum.current > 120) triggerWarp();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", " "].includes(e.key) && phaseRef.current === "idle") triggerWarp();
    };
    const onTouch = () => {
      if (phaseRef.current === "idle") triggerWarp();
    };
    const onMouseMove = (e: MouseEvent) => {
      // Scale mouse position to range [-1, 1]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouch, { once: true });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [triggerWarp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // 1. Twinkling Deep Space Stars
    const starCount = 350;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: 0.2 + Math.random() * 0.8, // Depth factor
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.9,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
    }));

    // 2. Cosmic Nebula Clouds (Background gas layers)
    const nebulas: NebulaCloud[] = [
      { x: -300, y: -200, r: 600, vx: 0.1, vy: 0.05, color: "rgba(220, 38, 38, 0.08)", phase: 0 },   // Deep Red
      { x: 400, y: -100, r: 500, vx: -0.05, vy: 0.08, color: "rgba(124, 58, 237, 0.09)", phase: 2 }, // Purple
      { x: -100, y: 200, r: 550, vx: 0.08, vy: -0.06, color: "rgba(219, 39, 119, 0.08)", phase: 4 }, // Magenta/Pink
      { x: 200, y: 300, r: 480, vx: -0.07, vy: -0.04, color: "rgba(30, 58, 138, 0.12)", phase: 1 },  // Dark Blue
    ];

    // 3. Portal Inner Swirling Nebula (Dynamic Cyan/Teal gas points inside the ring)
    const innerNebulaCount = 24;
    const innerNebula = Array.from({ length: innerNebulaCount }, (_, i) => ({
      angle: (i / innerNebulaCount) * Math.PI * 2,
      dist: Math.random() * 90,
      speed: 0.005 + Math.random() * 0.01,
      size: 40 + Math.random() * 60,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      color: i % 2 === 0 ? "rgba(6, 182, 212, 0.15)" : "rgba(168, 85, 247, 0.12)", // Cyan / Purple
    }));

    // 4. Burning Portal Embers/Sparks
    let sparks: Spark[] = [];
    const maxSparks = 220;

    const spawnSpark = (portalX: number, portalY: number, r: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.2;
      // Spawn slightly inside or outside the ring
      const spawnR = r + (Math.random() - 0.5) * 14;
      const px = portalX + Math.cos(angle) * spawnR;
      const py = portalY + Math.sin(angle) * spawnR;

      sparks.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
        vy: Math.sin(angle) * speed - (0.5 + Math.random() * 1.5), // Drifts slightly upwards
        life: 0,
        maxLife: 40 + Math.random() * 60,
        size: 0.8 + Math.random() * 1.8,
        color: Math.random() < 0.7 ? "rgba(251, 146, 60, " : "rgba(253, 224, 71, ", // Orange / Yellow
      });
    };

    let time = 0;
    let warpFactor = 0;

    function drawScene() {
      time++;
      // Linear interpolation for mouse parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const pxOffset = mouse.x;
      const pyOffset = mouse.y;

      const isWarping = phaseRef.current === "warp";
      if (isWarping) {
        warpFactor = Math.min(1, warpFactor + 0.02);
      }

      // Base cosmic space background
      ctx.fillStyle = "#030206";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      if (isWarping) {
        const shake = warpFactor * 14;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }

      // --- 1. Starfield Layer (Parallax level 1 - slow) ---
      stars.forEach((s) => {
        s.alpha += Math.sin(time * s.twinkleSpeed) * 0.02;
        s.alpha = Math.max(0.1, Math.min(1.0, s.alpha));

        // Parallax shift based on depth
        const sx = W / 2 + s.x - pxOffset * 10 * s.z;
        const sy = H / 2 + s.y - pyOffset * 10 * s.z;

        if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) {
          ctx.beginPath();
          ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.fill();
        }
      });

      // --- 2. Background Nebula Clouds (Parallax level 2 - medium) ---
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      nebulas.forEach((n) => {
        // Slowly drift
        n.x += n.vx;
        n.y += n.vy;
        if (Math.abs(n.x) > 600) n.vx *= -1;
        if (Math.abs(n.y) > 400) n.vy *= -1;

        const nx = W / 2 + n.x - pxOffset * 22;
        const ny = H / 2 + n.y - pyOffset * 22;

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(0.5, n.color.replace("0.0", "0.02"));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // --- 3. Portal Geometry Calculations ---
      const portalCX = W / 2 - pxOffset * 40;
      // Shift portal slightly upwards to leave room for reflection ground
      const portalCY = H / 2 - 50 - pyOffset * 40;
      const portalR = Math.min(W * 0.22, 175) * (1 - warpFactor * 0.95);

      // Trigger sparks
      if (!isWarping && sparks.length < maxSparks && Math.random() < 0.65) {
        spawnSpark(portalCX, portalCY, portalR);
      }

      // --- 4. Render Portal Internal Nebula Swirl (Cyan / Purple wormhole core) ---
      if (!isWarping) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        innerNebula.forEach((inb) => {
          inb.angle += inb.speed;
          const swirlRadius = inb.dist * (1 + Math.sin(time * inb.pulseSpeed) * 0.08);
          const inbX = portalCX + Math.cos(inb.angle) * swirlRadius;
          const inbY = portalCY + Math.sin(inb.angle) * swirlRadius;

          const grad = ctx.createRadialGradient(inbX, inbY, 0, inbX, inbY, inb.size);
          grad.addColorStop(0, inb.color);
          grad.addColorStop(0.5, inb.color.replace("0.1", "0.03"));
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(inbX, inbY, inb.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // --- 5. Draw Portal Ring (Turbulent burning plasma ring) ---
      if (!isWarping) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.shadowBlur = 35;
        ctx.shadowColor = "rgba(251, 146, 60, 0.75)";

        const segments = 180;
        const ringLayers = 4; // Multiple overlapping rings for thickness and density

        for (let layer = 0; layer < ringLayers; layer++) {
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            // Generate turbulent noise along the radius using multiple harmonics
            const noise =
              Math.sin(angle * 7 + time * 0.08 + layer * 1.5) * 5 +
              Math.cos(angle * 13 - time * 0.12) * 3 +
              (Math.random() - 0.5) * 2;

            const r = portalR + noise - layer * 1.5;
            const rx = portalCX + Math.cos(angle) * r;
            const ry = portalCY + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();

          // Outer layers are dark red/orange, inner layers are bright yellow/white
          if (layer === 0) {
            ctx.strokeStyle = "rgba(239, 68, 68, 0.65)"; // Flame Red
            ctx.lineWidth = 9;
          } else if (layer === 1) {
            ctx.strokeStyle = "rgba(251, 146, 60, 0.85)"; // Hot Orange
            ctx.lineWidth = 6;
          } else if (layer === 2) {
            ctx.strokeStyle = "rgba(253, 224, 71, 0.95)"; // Intense Yellow
            ctx.lineWidth = 3.5;
          } else {
            ctx.strokeStyle = "rgba(255, 255, 255, 1.0)"; // White core
            ctx.lineWidth = 1.2;
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- 6. Render Sparks / Embers ---
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      sparks.forEach((sp, idx) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life++;

        // Add slight wind force
        sp.vx += Math.sin(time * 0.05 + idx) * 0.04;

        const ageRatio = sp.life / sp.maxLife;
        const opacity = 1 - ageRatio;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (1 - ageRatio * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `${sp.color}${opacity})`;
        ctx.fill();

        // Kill expired sparks
        if (sp.life >= sp.maxLife) {
          sparks.splice(idx, 1);
        }
      });
      ctx.restore();

      // --- 7. Landscape: Wet Reflective Ground & Side Rocks (Foreground - Parallax level 3 - fast) ---
      const horizonY = H * 0.72 - pyOffset * 55;

      // Draw Mirrored Reflection on Wet Ground first
      if (!isWarping) {
        ctx.save();
        // Mirror vertical viewport relative to horizon
        ctx.translate(0, horizonY * 2);
        ctx.scale(1, -1);

        // Draw mirrored portal inner nebula
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.28; // Wet surface opacity falloff
        innerNebula.forEach((inb) => {
          const swirlRadius = inb.dist * (1 + Math.sin(time * inb.pulseSpeed) * 0.08);
          const inbX = portalCX + Math.cos(inb.angle) * swirlRadius;
          const inbY = portalCY + Math.sin(inb.angle) * swirlRadius;

          const grad = ctx.createRadialGradient(inbX, inbY, 0, inbX, inbY, inb.size * 1.2);
          grad.addColorStop(0, inb.color);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(inbX, inbY, inb.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw mirrored portal ring
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(251, 146, 60, 0.5)";
        ctx.beginPath();
        ctx.arc(portalCX, portalCY, portalR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(251, 146, 60, 0.45)";
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.restore();
      }

      // Add ground overlay gradient to fade reflection
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      groundGrad.addColorStop(0, "rgba(10, 8, 16, 0.85)");
      groundGrad.addColorStop(0.3, "rgba(12, 10, 20, 0.94)");
      groundGrad.addColorStop(1, "rgba(6, 4, 10, 1.0)");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Draw water ripples / reflection wave lines
      if (!isWarping) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const rippleCount = 14;
        for (let i = 0; i < rippleCount; i++) {
          const ry = horizonY + 8 + i * 16;
          const width = portalR * (1.8 + i * 0.35);
          const opacity = 0.08 * (1 - i / rippleCount);
          const waveOffset = Math.sin(time * 0.04 + i) * 3;

          ctx.beginPath();
          ctx.ellipse(portalCX + waveOffset, ry, width, 1.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 146, 60, ${opacity * 1.8})`;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(portalCX + waveOffset, ry + 2, width * 0.8, 1.0, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Silhouette Landscape: Side Rocks (foreground silhouette overlay)
      ctx.save();
      ctx.fillStyle = "#040306";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(0,0,0,0.5)";

      // Left Side jagged rocks
      const leftRockX = W * 0.22 - pxOffset * 55;
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, horizonY - 140);
      ctx.lineTo(leftRockX * 0.3, horizonY - 95);
      ctx.lineTo(leftRockX * 0.7, horizonY - 45);
      ctx.lineTo(leftRockX, horizonY);
      ctx.lineTo(W * 0.3, horizonY);
      ctx.lineTo(W * 0.2, H);
      ctx.closePath();
      ctx.fill();

      // Right Side jagged rocks
      const rightRockX = W * 0.78 - pxOffset * 55;
      ctx.beginPath();
      ctx.moveTo(W, H);
      ctx.lineTo(W, horizonY - 150);
      ctx.lineTo(W - (W - rightRockX) * 0.3, horizonY - 110);
      ctx.lineTo(W - (W - rightRockX) * 0.7, horizonY - 50);
      ctx.lineTo(rightRockX, horizonY);
      ctx.lineTo(W * 0.7, horizonY);
      ctx.lineTo(W * 0.8, H);
      ctx.closePath();
      ctx.fill();

      // Draw Traveler Silhouette standing in center looking at portal
      if (!isWarping) {
        const travelerX = portalCX;
        const travelerY = horizonY + 35;
        const height = 48;

        ctx.fillStyle = "#010103";
        ctx.beginPath();
        // Head
        ctx.arc(travelerX, travelerY - height, 4.2, 0, Math.PI * 2);
        // Neck/Torso/Backpack outline
        ctx.moveTo(travelerX - 3.5, travelerY - height + 4);
        ctx.lineTo(travelerX + 3.5, travelerY - height + 4);
        ctx.lineTo(travelerX + 5, travelerY - height + 16); // Backpack bulge
        ctx.lineTo(travelerX + 4.2, travelerY - height + 30);
        ctx.lineTo(travelerX - 4.2, travelerY - height + 30);
        ctx.lineTo(travelerX - 4.5, travelerY - height + 16);
        ctx.closePath();
        ctx.fill();

        // Legs
        ctx.beginPath();
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = "#010103";
        ctx.lineCap = "round";
        // Left Leg
        ctx.moveTo(travelerX - 2.2, travelerY - height + 28);
        ctx.lineTo(travelerX - 2.8, travelerY);
        // Right Leg
        ctx.moveTo(travelerX + 2.2, travelerY - height + 28);
        ctx.lineTo(travelerX + 2.8, travelerY);
        ctx.stroke();
      }
      ctx.restore();

      // --- 8. Warp Animation effect (4D Time-Travel Speed Tunnel) ---
      if (isWarping) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const cx = portalCX;
        const cy = portalCY;

        // A. Expanding Time-Travel Portal Grid Rings
        const circleCount = 6;
        const maxR = Math.max(W, H) * 0.9;
        for (let i = 0; i < circleCount; i++) {
          const rBase = (time * 8.5 + i * (maxR / circleCount)) % maxR;
          const r = rBase * warpFactor;
          const alpha = Math.max(0, 0.25 * (1 - r / maxR) * warpFactor);
          
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Hexagonal outline overlay for digital quantum look
          ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2 + time * 0.005;
            const hx = cx + Math.cos(angle) * r;
            const hy = cy + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(251, 146, 60, ${alpha * 0.5})`;
          ctx.stroke();
        }

        // B. Dynamic Zooming 3D Warp Streaks
        const streakCount = 140;
        for (let i = 0; i < streakCount; i++) {
          // Use pseudo-random seed based on index
          const angle = (i / streakCount) * Math.PI * 2 + Math.sin(i) * 0.2;
          const speed = 15 + (i % 7) * 4;
          const maxDist = Math.max(W, H) * 1.2;
          
          // Animate distance from center
          const startDist = ((time - 1700) * speed + (i * 45)) % maxDist;
          const endDist = startDist + (speed * 2.8) * warpFactor; // Motion blur length increases with speed

          const sx = cx + Math.cos(angle) * startDist;
          const sy = cy + Math.sin(angle) * startDist;
          const ex = cx + Math.cos(angle) * endDist;
          const ey = cy + Math.sin(angle) * endDist;

          const shaftAlpha = 0.28 * warpFactor * (1 - startDist / maxDist);
          
          const grad = ctx.createLinearGradient(sx, sy, ex, ey);
          grad.addColorStop(0, "rgba(255, 255, 255, 0)");
          grad.addColorStop(0.2, i % 2 === 0 ? `rgba(251, 146, 60, ${shaftAlpha * 0.85})` : `rgba(139, 92, 246, ${shaftAlpha * 0.85})`);
          grad.addColorStop(0.7, `rgba(6, 182, 212, ${shaftAlpha})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.0 + (i % 3) * 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- 9. Lens Flare Flash (Whiteout) ---
      if (isWarping) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.pow(warpFactor, 2.8) * 0.98})`;
        ctx.fillRect(-100, -100, W + 200, H + 200);
      }
      ctx.restore();
    }

    function renderLoop() {
      rafRef.current = requestAnimationFrame(renderLoop);
      drawScene();
    }

    renderLoop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ cursor: "none" }} />

        {/* HUD Overlay HUD top-left */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: uiPhase === "idle" ? 1 : 0, x: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="absolute top-8 left-8 pointer-events-none select-none"
        >
          <div className="font-mono text-[9px] text-white/30 leading-6 tracking-[0.3em] uppercase">
            <div className="text-white/60 text-[12px] font-black mb-1 tracking-[0.55em]">DEV10</div>
            <div>AI SYSTEMS · OPEN SOURCE</div>
            <div>28.6139°N · 77.2090°E · BANGALORE</div>
            <div className="mt-1 text-[8px] text-white/20">PORTAL SYNAPSE: ON</div>
          </div>
        </motion.div>

        {/* HUD top-right */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: uiPhase === "idle" ? 1 : 0, x: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="absolute top-8 right-8 pointer-events-none select-none text-right"
        >
          <div className="font-mono text-[9px] text-white/20 leading-6 tracking-[0.25em] uppercase">
            <div>GSoC 2026 · SUGAR LABS</div>
            <div>LFX MENTEE · LFDT WEB3J</div>
            <div>20+ PRs · 6 ORGS</div>
          </div>
        </motion.div>

        {/* HUD bottom-left: Skills */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: uiPhase === "idle" ? 1 : 0, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="absolute bottom-8 left-8 pointer-events-none select-none"
        >
          <div className="font-mono text-[9px] text-white/20 leading-6 tracking-[0.2em] uppercase">
            <div className="text-white/40 mb-1 tracking-[0.3em] font-bold">SYSTEM PROTOCOLS // SKILLS</div>
            <div className="flex gap-4">
              <div>
                <span className="text-emerald-400/50">SYS:</span> LINUX, WAYLAND, GTK4<br/>
                <span className="text-blue-400/50">LNG:</span> PYTHON, TYPESCRIPT, JAVA, GO
              </div>
              <div>
                <span className="text-orange-400/50">WEB:</span> REACT, NEXT.JS, EXPRESS<br/>
                <span className="text-purple-400/50">DDB:</span> POSTGRESQL, REDIS, SUPABASE
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center scroll hint */}
        <AnimatePresence>
          {uiPhase === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none select-none"
            >
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono text-[10px] text-white/50 tracking-[0.6em] uppercase"
              >
                scroll or click to enter
              </motion.p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
                  <rect x="4" y="0" width="12" height="20" rx="6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <rect x="8.5" y="3" width="3" height="6" rx="1.5" fill="rgba(255,255,255,0.4)" />
                  <path d="M4 26 L10 32 L16 26" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warp enter text */}
        <AnimatePresence>
          {uiPhase === "warp" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.2, 1.5, 3] }}
              transition={{ duration: 1.6, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <p
                className="font-mono font-black text-white tracking-[0.8em] uppercase text-2xl"
                style={{
                  textShadow: "0 0 40px rgba(120,180,255,0.9), 0 0 80px rgba(80,140,255,0.5)",
                }}
              >
                WARPING INTO DEV10
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click fallback */}
        <button
          onClick={triggerWarp}
          className="absolute inset-0 w-full h-full opacity-0"
          aria-label="Enter"
        />
      </motion.div>
    </AnimatePresence>
  );
}
