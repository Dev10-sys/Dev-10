"use client";

import { useEffect, useRef, useState } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; color: string; size: number };

export function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleInteract = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select");
      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousemove", handleInteract);

    // Init canvas for particle trace trail
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    function tick() {
      rafRef.current = requestAnimationFrame(tick);

      // Lerp ring follow
      const speed = 0.16;
      ring.current.x += (pos.current.x - ring.current.x) * speed;
      ring.current.y += (pos.current.y - ring.current.y) * speed;

      // Update HUD brackets transform
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      // Add particle trace
      if (Math.hypot(pos.current.x - ring.current.x, pos.current.y - ring.current.y) > 2) {
        particles.current.push({
          x: ring.current.x,
          y: ring.current.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          alpha: 0.85,
          color: hovered ? "129,140,248" : "34,211,238", // Indigo vs Cyan
          size: Math.random() * 1.5 + 0.6,
        });
      }

      // Render particle trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          return;
        }
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousemove", handleInteract);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hovered]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[99998] pointer-events-none w-full h-full"
      />
      <div
        ref={containerRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none select-none transition-transform duration-75 ease-out"
        style={{
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          willChange: "transform",
        }}
      >
        {/* HUD Crosshair Center Dot */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: hovered ? "#818cf8" : "#22d3ee",
            boxShadow: hovered 
              ? "0 0 8px #818cf8, 0 0 16px #818cf8" 
              : "0 0 8px #22d3ee, 0 0 16px #22d3ee",
          }}
        />

        {/* HUD Brackets */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            hovered ? "rotate-45 scale-125" : "rotate-0 scale-100"
          }`}
        >
          {/* Top-Left Bracket */}
          <div
            className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px]"
            style={{ borderColor: hovered ? "#818cf8" : "#22d3ee" }}
          />
          {/* Top-Right Bracket */}
          <div
            className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px]"
            style={{ borderColor: hovered ? "#818cf8" : "#22d3ee" }}
          />
          {/* Bottom-Left Bracket */}
          <div
            className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px]"
            style={{ borderColor: hovered ? "#818cf8" : "#22d3ee" }}
          />
          {/* Bottom-Right Bracket */}
          <div
            className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px]"
            style={{ borderColor: hovered ? "#818cf8" : "#22d3ee" }}
          />
        </div>
      </div>
    </>
  );
}
