"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Zap, Server, Code2, Terminal } from "lucide-react";

const BOOT_LINES = [
  { text: "BIOS v2.6.0 — Initializing kernel modules...", delay: 0 },
  { text: "Loading: linux_core.ko — [OK]", delay: 150 },
  { text: "Loading: full_stack_web.ko — [OK]", delay: 300 },
  { text: "Loading: blockchain_protocols.ko — [OK]", delay: 450 },
  { text: "System ready. Contributor online.", delay: 600 },
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
    }, 800);
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

export function Hero() {
  const [booted, setBooted] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background atmosphere */}
      <div className="absolute rounded-full pointer-events-none opacity-10 filter blur-[80px]" style={{ left: "-10%", top: "10%", width: "600px", height: "600px", background: "#f7931a" }} />
      <div className="absolute rounded-full pointer-events-none opacity-10 filter blur-[80px]" style={{ left: "60%", top: "60%", width: "500px", height: "500px", background: "#7c3aed" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />

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
              <div className="p-4 min-h-[120px]">
                <BootTerminal onDone={() => setBooted(true)} />
                {booted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-xs text-muted-foreground/50 space-y-1"
                  >
                    <div><span className="text-primary">dev@machine</span><span className="text-muted-foreground/30">:</span><span className="text-cyan-400">~</span><span className="text-muted-foreground/30">$</span> <span className="text-foreground/60">whoami --skills</span></div>
                    <div className="text-green-400/70 pl-2">→ Full Stack · Web Development · Linux · Blockchain</div>
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
                  Systems · Security · Full Stack
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
                B.Tech CS (AI/ML) · Bangalore, India. Focused on reliability, high-performance web development, Linux infrastructure, and production-grade open source.
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
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </motion.div>
          </div>

          {/* Right — Technical Core & GitHub Chart */}
          <div className="space-y-4">
            
            {/* Core Competencies Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: "Linux Systems", icon: Terminal, color: "#10b981", sub: "Wayland / CLI / D-Bus" },
                { label: "Web Development", icon: Code2, color: "#7c3aed", sub: "React / Node / APIs" },
                { label: "Full Stack", icon: Server, color: "#06b6d4", sub: "Postgres / Next.js" },
                { label: "Blockchain", icon: Zap, color: "#f7931a", sub: "Lightning / Web3j" },
              ].map((skill, i) => (
                <div key={i} className="os-window p-5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <skill.icon className="w-6 h-6 mb-3" style={{ color: skill.color }} />
                  <div className="font-bold text-foreground mb-1">{skill.label}</div>
                  <div className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">{skill.sub}</div>
                </div>
              ))}
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { n: "100+", label: "PRs Merged", color: "#10b981", icon: "⚡" },
                { n: "11+", label: "OSS Orgs", color: "#7c3aed", icon: "🏛️" },
                { n: "2×", label: "Program Wins", color: "#f7931a", icon: "🏆" },
              ].map((stat, i) => (
                <div key={i} className="os-window p-4 text-center group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="font-black text-xl" style={{ color: stat.color }}>{stat.n}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* GitHub chart */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.8 }}
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
    </section>
  );
}
