"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, ExternalLink, Zap, Shield, Code2 } from "lucide-react";

const BOOT_LINES = [
  { text: "BIOS v2.6.0 — Initializing kernel modules...", delay: 0 },
  { text: "Loading: cryptography.ko — [OK]", delay: 150 },
  { text: "Loading: blockchain.ko — [OK]", delay: 300 },
  { text: "Loading: systems-infra.ko — [OK]", delay: 450 },
  { text: "Starting: open-source daemon... — [ACTIVE]", delay: 600 },
  { text: "GSoC 2026 ● Sugar Labs — AUTHENTICATED", delay: 750 },
  { text: "LFX 2025 ● OpenSSF — AUTHENTICATED", delay: 900 },
  { text: "System ready. Contributor online.", delay: 1050 },
];

function BootTerminal({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach(({ text, delay }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, text]);
      }, delay);
    });
    setTimeout(() => {
      setDone(true);
      setTimeout(onDone, 400);
    }, 1300);
  }, []);

  if (done) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="font-mono text-xs text-left space-y-1"
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`${
            line.includes("AUTHENTICATED") ? "text-green-400" :
            line.includes("OK") ? "text-primary/80" :
            "text-muted-foreground/60"
          }`}
        >
          {line.includes("AUTHENTICATED") && <span className="text-green-400 mr-2">✓</span>}
          {line.includes("OK") && <span className="text-primary mr-2">●</span>}
          {!line.includes("AUTHENTICATED") && !line.includes("OK") && <span className="text-muted-foreground/30 mr-2">›</span>}
          {line}
        </motion.div>
      ))}
      {!done && <span className="text-primary cursor-blink">█</span>}
    </motion.div>
  );
}

function FloatingOrb({ x, y, color, size }: { x: string; y: string; color: string; size: string }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: "blur(80px)",
        opacity: 0.12,
      }}
    />
  );
}

export function Hero() {
  const [booted, setBooted] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    if (booted) {
      setTimeout(() => setNameVisible(true), 200);
    }
  }, [booted]);

  const badges = [
    {
      icon: "🌞",
      title: "Google Summer of Code 2026",
      sub: "Sugar Labs • Python / GTK",
      color: "#EA4335",
      glow: "rgba(234,67,53,0.3)",
      href: "/gsoc_acceptance_letter.pdf",
    },
    {
      icon: "⚡",
      title: "LFX Mentorship 2025",
      sub: "OpenSSF RSTUF • Security Hardening",
      color: "#f7931a",
      glow: "rgba(247,147,26,0.3)",
      href: "#open-source",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background atmosphere */}
      <FloatingOrb x="-10%" y="10%" color="#f7931a" size="600px" />
      <FloatingOrb x="60%" y="60%" color="#7c3aed" size="500px" />
      <FloatingOrb x="30%" y="-10%" color="#06b6d4" size="400px" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(248,147,26,0.15), transparent)",
            animation: "none",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Main content */}
          <div className="space-y-8">
            {/* Terminal boot window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="os-window overflow-hidden"
            >
              <div className="os-window-header">
                <div className="os-dot os-dot-red" />
                <div className="os-dot os-dot-yellow" />
                <div className="os-dot os-dot-green" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground/50 tracking-wider">
                  dev10-sys — bash — 80×24
                </span>
              </div>
              <div className="p-4 min-h-[140px]">
                <BootTerminal onDone={() => setBooted(true)} />
                {booted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-xs text-muted-foreground/50 space-y-1"
                  >
                    <div><span className="text-primary">dev@machine</span><span className="text-muted-foreground/30">:</span><span className="text-cyan-400">~</span><span className="text-muted-foreground/30">$</span> <span className="text-foreground/60">whoami --verbose</span></div>
                    <div className="text-green-400/70 pl-2">→ Software Dev · GSoC 2026 · LFX Alum · Open Source Builder</div>
                    <div><span className="text-primary">dev@machine</span><span className="text-muted-foreground/30">:</span><span className="text-cyan-400">~</span><span className="text-muted-foreground/30">$</span> <span className="cursor-blink text-primary">█</span></div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Big glitch name */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="overflow-hidden">
                  <h1
                    className="glitch-text font-black text-[clamp(4rem,12vw,9rem)] leading-none tracking-tighter uppercase text-foreground"
                    data-text="DEV"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    DEV
                  </h1>
                </div>
                <div
                  className="font-mono text-xs tracking-[0.4em] uppercase mt-2 flex items-center gap-3"
                  style={{ color: "rgba(248,147,26,0.6)" }}
                >
                  <span className="w-8 h-px bg-primary/30 inline-block" />
                  Systems · Security · Infrastructure
                  <span className="w-8 h-px bg-primary/30 inline-block" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-2xl md:text-3xl font-bold text-foreground/80 leading-snug"
              >
                I build systems that{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #f7931a, #ffbd2e)" }}
                >
                  stay up.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-xl"
              >
                B.Tech CS (AI/ML) · Bangalore, India. Focused on reliability, cryptography, and open-source infrastructure that ships to production.
              </motion.p>
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm text-black overflow-hidden transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f7931a, #ffbd2e)",
                  boxShadow: "0 4px 24px rgba(247,147,26,0.4), 0 0 0 1px rgba(247,147,26,0.2)",
                }}
              >
                <Zap className="w-4 h-4" />
                View Projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="https://github.com/Dev10-sys"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(13,13,20,0.8)",
                  border: "1px solid rgba(248,147,26,0.15)",
                  color: "rgba(232,232,240,0.7)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,147,26,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#e8e8f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,147,26,0.15)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(232,232,240,0.7)";
                }}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/dev10-sys"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(13,13,20,0.8)",
                  border: "1px solid rgba(248,147,26,0.15)",
                  color: "rgba(232,232,240,0.7)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,147,26,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#e8e8f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,147,26,0.15)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(232,232,240,0.7)";
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right — Achievement badges + stats */}
          <div className="space-y-4">
            {/* Achievement badges */}
            {badges.map((badge, i) => (
              <motion.a
                key={i}
                href={badge.href}
                target={badge.href.startsWith("http") || badge.href.startsWith("/") ? "_blank" : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group block os-window overflow-hidden card-shine relative cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  boxShadow: `0 0 0 1px rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.6)`,
                }}
              >
                <div className="os-window-header">
                  <div className="os-dot os-dot-red" />
                  <div className="os-dot os-dot-yellow" />
                  <div className="os-dot os-dot-green" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">
                    {i === 0 ? "gsoc-2026.json" : "lfx-2025.json"}
                  </span>
                  <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
                </div>
                <div className="p-5 flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${badge.glow}`, border: `1px solid ${badge.color}30` }}
                  >
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="font-black text-base text-foreground group-hover:text-primary transition-colors">
                      {badge.title}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">{badge.sub}</div>
                    <div className="inline-flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-mono text-[10px] text-green-400/70 uppercase tracking-wider">Official Contributor</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { n: "100+", label: "PRs Merged", color: "#10b981", icon: "⚡" },
                { n: "11+", label: "OSS Orgs", color: "#7c3aed", icon: "🏛️" },
                { n: "2×", label: "Program Wins", color: "#f7931a", icon: "🏆" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="os-window p-4 text-center"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-black text-xl" style={{ color: stat.color }}>
                    {stat.n}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* GitHub chart */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="os-window overflow-hidden"
            >
              <div className="os-window-header">
                <div className="os-dot os-dot-red" />
                <div className="os-dot os-dot-yellow" />
                <div className="os-dot os-dot-green" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">github-activity.svg</span>
              </div>
              <div className="p-4">
                <img
                  src="https://ghchart.rshah.org/F7931A/Dev10-sys"
                  alt="GitHub contribution chart"
                  className="w-full rounded opacity-80 hover:opacity-100 transition-opacity"
                  style={{ filter: "brightness(0.9) contrast(1.1)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, rgba(248,147,26,0.5), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
