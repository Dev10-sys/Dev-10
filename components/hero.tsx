"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Zap, Server, Code2, Terminal } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12">
      {/* Background atmosphere */}
      <div className="absolute rounded-full pointer-events-none opacity-10 filter blur-[80px]" style={{ left: "-10%", top: "10%", width: "600px", height: "600px", background: "#f7931a" }} />
      <div className="absolute rounded-full pointer-events-none opacity-10 filter blur-[80px]" style={{ left: "60%", top: "60%", width: "500px", height: "500px", background: "#7c3aed" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Main content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for new opportunities
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1]"
              >
                Hi, I'm <span className="text-primary">Dev</span>.
                <br />
                I build robust software.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl"
              >
                I'm a B.Tech CS student specializing in AI/ML, based in Bangalore. 
                I focus on full-stack web development, Linux infrastructure, and contributing to open source projects that are used in production.
              </motion.p>
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <a
                href="#projects"
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f7931a, #ffbd2e)",
                  boxShadow: "0 4px 20px rgba(247,147,26,0.3)",
                }}
              >
                <Zap className="w-4 h-4" />
                View My Work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="https://github.com/Dev10-sys"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-card/60 backdrop-blur border border-border/80 hover:border-primary/50 text-foreground"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </motion.div>
          </div>

          {/* Right — Clean Tech Overview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Linux Systems", icon: Terminal, color: "#10b981", sub: "Wayland / CLI / D-Bus" },
                { label: "Web Development", icon: Code2, color: "#7c3aed", sub: "React / Node / APIs" },
                { label: "Full Stack", icon: Server, color: "#06b6d4", sub: "Postgres / Next.js" },
                { label: "Blockchain", icon: Zap, color: "#f7931a", sub: "Lightning / Web3j" },
              ].map((skill, i) => (
                <div key={i} className="os-window p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
                  <skill.icon className="w-6 h-6 mb-3" style={{ color: skill.color }} />
                  <div className="font-bold text-foreground mb-1">{skill.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">{skill.sub}</div>
                </div>
              ))}
            </div>

            <div className="os-window overflow-hidden">
              <div className="os-window-header border-b border-white/5 pb-3">
                <div className="os-dot os-dot-red" />
                <div className="os-dot os-dot-yellow" />
                <div className="os-dot os-dot-green" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground/50">github-activity</span>
              </div>
              <div className="p-4 bg-background/50">
                <img
                  src="https://ghchart.rshah.org/F7931A/Dev10-sys"
                  alt="GitHub contribution chart"
                  className="w-full rounded opacity-90"
                  style={{ filter: "brightness(0.9) contrast(1.1)" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
