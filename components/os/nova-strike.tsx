"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Sparkles } from "lucide-react";
import { sysAudio } from "@/lib/audio";

type GameState = "menu" | "playing" | "gameover";

type Star = { x: number; y: number; r: number; speed: number };
type Bullet = { x: number; y: number; w: number; h: number; speed: number };
type Enemy = { x: number; y: number; w: number; h: number; speed: number; hp: number; maxHp: number; type: "scout" | "fighter" | "boss" };
type Particle = { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number; life: number };

export function NovaStrike() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [mute, setMute] = useState(true);

  // Sync mute state with sysAudio
  useEffect(() => {
    sysAudio.setMute(mute);
  }, [mute]);

  // Mutable game references
  const stateRef = useRef<GameState>("menu");
  const keys = useRef<Record<string, boolean>>({});
  const player = useRef({ x: 200, y: 350, w: 24, h: 24, speed: 5.5, shield: 100, maxShield: 100 });
  const bullets = useRef<Bullet[]>([]);
  const enemyBullets = useRef<Bullet[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const particles = useRef<Particle[]>([]);
  const stars = useRef<Star[]>([]);
  const frame = useRef(0);
  const rafId = useRef(0);

  // Sync state reference
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("nova_strike_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    player.current = {
      x: canvas.width / 2 - 12,
      y: canvas.height - 70,
      w: 24,
      h: 24,
      speed: 6.5,
      shield: 100,
      maxShield: 100,
    };
    bullets.current = [];
    enemyBullets.current = [];
    enemies.current = [];
    particles.current = [];
    setScore(0);
    setGameState("playing");
    sysAudio.playPowerUp();
  };

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (e.key === " " && stateRef.current === "playing") {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main game loop & Resizing handler
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;

    let W = (canvas.width = container.clientWidth || 600);
    let H = (canvas.height = container.clientHeight || 400);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        W = canvas.width = entry.contentRect.width || 600;
        H = canvas.height = entry.contentRect.height || 400;
        
        // Reset player bounds in case window is resized smaller
        player.current.x = Math.max(0, Math.min(W - player.current.w, player.current.x));
        player.current.y = Math.max(0, Math.min(H - player.current.h, player.current.y));
      }
    });
    resizeObserver.observe(container);

    // Init stars
    stars.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 2.0 + 0.5,
    }));

    // Mouse movement steering listener
    const handleMouseMove = (e: MouseEvent) => {
      if (stateRef.current !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Pilot coordinates follow cursor smoothly
      player.current.x = Math.max(0, Math.min(W - player.current.w, mouseX - player.current.w / 2));
      player.current.y = Math.max(0, Math.min(H - player.current.h, mouseY - player.current.h / 2));
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    function spawnExplosion(x: number, y: number, color = "#ff6b6b", count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 2.2 + 0.8,
          color,
          alpha: 1,
          life: 25 + Math.random() * 20,
        });
      }
    }

    function gameLoop() {
      rafId.current = requestAnimationFrame(gameLoop);
      frame.current++;

      // Background clear
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);

      // Draw Starfield
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      stars.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > H) {
          star.y = 0;
          star.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const curState = stateRef.current;

      if (curState === "playing") {
        const p = player.current;

        // Fallback Keyboard steering
        if (keys.current["ArrowLeft"] || keys.current["a"]) p.x = Math.max(0, p.x - p.speed);
        if (keys.current["ArrowRight"] || keys.current["d"]) p.x = Math.min(W - p.w, p.x + p.speed);
        if (keys.current["ArrowUp"] || keys.current["w"]) p.y = Math.max(0, p.y - p.speed);
        if (keys.current["ArrowDown"] || keys.current["s"]) p.y = Math.min(H - p.h, p.y + p.speed);

        // Player shooting
        if (frame.current % 11 === 0) {
          bullets.current.push({
            x: p.x + p.w / 2 - 2,
            y: p.y - 6,
            w: 4,
            h: 11,
            speed: 9.5,
          });
          sysAudio.playLaser();
        }

        // Draw & Update Player ship
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#8b5cf6"; // Violet glow
        
        // Jet thruster tail
        const thrustPulse = Math.sin(frame.current * 0.45) * 5 + 7;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(p.x + p.w / 2 - 4, p.y + p.h);
        ctx.lineTo(p.x + p.w / 2, p.y + p.h + thrustPulse);
        ctx.lineTo(p.x + p.w / 2 + 4, p.y + p.h);
        ctx.fill();

        // Ship body
        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.moveTo(p.x + p.w / 2, p.y);
        ctx.lineTo(p.x, p.y + p.h);
        ctx.lineTo(p.x + p.w, p.y + p.h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Bullet Updates
        ctx.fillStyle = "#60a5fa";
        bullets.current.forEach((b, index) => {
          b.y -= b.speed;
          if (b.y < -15) {
            bullets.current.splice(index, 1);
            return;
          }
          ctx.fillRect(b.x, b.y, b.w, b.h);
        });

        // Enemy Bullet Updates
        ctx.fillStyle = "#f87171";
        enemyBullets.current.forEach((eb, index) => {
          eb.y += eb.speed;
          if (eb.y > H + 15) {
            enemyBullets.current.splice(index, 1);
            return;
          }
          ctx.fillRect(eb.x, eb.y, eb.w, eb.h);

          // Collision with Player
          if (
            eb.x < p.x + p.w &&
            eb.x + eb.w > p.x &&
            eb.y < p.y + p.h &&
            eb.y + eb.h > p.y
          ) {
            enemyBullets.current.splice(index, 1);
            p.shield -= 15;
            spawnExplosion(eb.x, eb.y, "#f87171", 6);
            sysAudio.playExplosion();
            if (p.shield <= 0) {
              spawnExplosion(p.x + p.w / 2, p.y + p.h / 2, "#8b5cf6", 30);
              setGameState("gameover");
              sysAudio.playError();
            }
          }
        });

        // Spawning Enemies
        if (frame.current % 44 === 0) {
          const typeVal = Math.random() < 0.25 ? "fighter" : "scout";
          enemies.current.push({
            x: Math.random() * (W - 35) + 10,
            y: -30,
            w: 24,
            h: 24,
            speed: typeVal === "fighter" ? 2.2 : 3.2,
            hp: typeVal === "fighter" ? 30 : 10,
            maxHp: typeVal === "fighter" ? 30 : 10,
            type: typeVal,
          });
        }

        // Enemy Updates
        enemies.current.forEach((e, eIndex) => {
          e.y += e.speed;
          if (e.y > H + 30) {
            enemies.current.splice(eIndex, 1);
            return;
          }

          // Enemy shooting
          if (e.type === "fighter" && frame.current % 75 === 0 && Math.random() < 0.55) {
            enemyBullets.current.push({
              x: e.x + e.w / 2 - 2,
              y: e.y + e.h,
              w: 4,
              h: 8,
              speed: 4.5,
            });
          }

          // Draw Enemy Ship
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = e.type === "fighter" ? "#fbbf24" : "#ec4899";
          ctx.fillStyle = e.type === "fighter" ? "#fbbf24" : "#ec4899";
          ctx.beginPath();
          ctx.moveTo(e.x + e.w / 2, e.y + e.h);
          ctx.lineTo(e.x, e.y);
          ctx.lineTo(e.x + e.w, e.y);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Collide with Player Ship
          if (
            e.x < p.x + p.w &&
            e.x + e.w > p.x &&
            e.y < p.y + p.h &&
            e.y + e.h > p.y
          ) {
            enemies.current.splice(eIndex, 1);
            p.shield -= 25;
            spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, "#f43f5e", 15);
            sysAudio.playExplosion();
            if (p.shield <= 0) {
              spawnExplosion(p.x + p.w / 2, p.y + p.h / 2, "#8b5cf6", 30);
              setGameState("gameover");
              sysAudio.playError();
            }
          }

          // Collide with Player Bullets
          bullets.current.forEach((b, bIndex) => {
            if (
              b.x < e.x + e.w &&
              b.x + b.w > e.x &&
              b.y < e.y + e.h &&
              b.y + b.h > e.y
            ) {
              bullets.current.splice(bIndex, 1);
              e.hp -= 10;
              spawnExplosion(b.x, b.y, "#60a5fa", 4);
              if (e.hp <= 0) {
                enemies.current.splice(eIndex, 1);
                spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, e.type === "fighter" ? "#fbbf24" : "#ec4899", 12);
                sysAudio.playExplosion();
                setScore((s) => {
                  const gained = e.type === "fighter" ? 25 : 10;
                  const newScore = s + gained;
                  if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem("nova_strike_highscore", newScore.toString());
                  }
                  return newScore;
                });
              }
            }
          });
        });

        // HUD overlay
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px monospace";
        ctx.fillText(`SCORE: ${score}`, 15, 20);
        ctx.fillText(`HI-SCORE: ${highScore}`, 15, 35);

        // Shield bar
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(W - 120, 12, 100, 8);
        ctx.fillStyle = p.shield > 40 ? "#10b981" : p.shield > 20 ? "#f59e0b" : "#ef4444";
        ctx.fillRect(W - 120, 12, Math.max(0, p.shield), 8);
      }

      // Draw Particles
      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.life--;
        if (p.life <= 0 || p.alpha <= 0) {
          particles.current.splice(index, 1);
          return;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    rafId.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafId.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [highScore, score, gameState]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#09090b] text-white flex flex-col justify-between select-none font-mono">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Main menu */}
      {gameState === "menu" && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-8 z-10">
          <div className="flex items-center gap-2 text-violet-400 mb-2">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[10px] tracking-[0.4em] uppercase">Nova Strike</span>
          </div>
          <h2 className="text-2xl font-black tracking-widest text-white mb-6">NOVA STRIKE</h2>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs px-6 py-2.5 rounded-xl border border-violet-400/20 font-bold transition-all shadow-[0_8px_30px_rgba(99,102,241,0.3)]"
          >
            <Play size={12} fill="white" />
            Launch Mission
          </button>
          <div className="mt-8 text-slate-500 text-[10px] space-y-1.5 text-center leading-relaxed">
            <p>Steer: Move your Mouse over the canvas or use WASD/Arrows</p>
            <p>Auto-Fires continuously · Defeat incoming fighters</p>
          </div>
        </div>
      )}

      {/* Gameover screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-8 z-10">
          <h2 className="text-xl font-bold tracking-widest text-red-400 mb-2">MISSION FAILURE</h2>
          <p className="text-xs text-slate-400 mb-6">Fighter Hull Integrity Compromised</p>
          <div className="bg-black/40 border border-red-500/20 rounded-xl px-6 py-4 mb-8 text-center space-y-1">
            <p className="text-[10px] text-slate-500">FINAL SCORE</p>
            <p className="text-2xl font-black text-white">{score}</p>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-6 py-2.5 rounded-xl border border-white/10 font-bold transition-all"
          >
            <RotateCcw size={12} />
            Re-Launch
          </button>
        </div>
      )}

      {/* Top right mute button */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={() => setMute(!mute)}
          className="w-8 h-8 rounded-lg bg-black/45 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {mute ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>
    </div>
  );
}
