"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Zap, FileCode, Network, Fingerprint } from "lucide-react";

export function ExtendedCapabilities() {
  const capabilities = [
    {
      title: "Security Hardening",
      desc: "Container execution analysis, API validation, and non-root enforcements for distributed microservices.",
      icon: Shield,
      color: "#f43f5e",
    },
    {
      title: "Protocol Integration",
      desc: "Deep integration with Ethereum (JSON-RPC, Web3j) and Bitcoin (Lightning, NWC) protocols.",
      icon: Network,
      color: "#f7931a",
    },
    {
      title: "Systems Engineering",
      desc: "Linux desktop environments, Wayland/X11 compositors, D-Bus communication, and GTK tooling.",
      icon: Terminal,
      color: "#06b6d4",
    },
    {
      title: "Technical Auditing",
      desc: "Deep-dive analysis of execution pipelines and open-source infrastructure for stability improvements.",
      icon: FileCode,
      color: "#10b981",
    },
    {
      title: "Identity & Cryptography",
      desc: "Client-side generation engines, Verifiable Credentials (SSI), and DIDComm implementations.",
      icon: Fingerprint,
      color: "#7c3aed",
    },
    {
      title: "Performance Optimization",
      desc: "Execution engine schedulers, JVM classloader memory leak resolution, and test stability.",
      icon: Zap,
      color: "#ffbd2e",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 mb-16"
      >
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">06 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Capabilities</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="os-window group relative p-6 h-[280px] flex flex-col hover:border-primary/40 hover:shadow-[0_0_30px_rgba(247,147,26,0.08)] transition-all cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-all group-hover:scale-110" style={{ background: `${cap.color}15`, border: `1px solid ${cap.color}30` }}>
              <cap.icon className="w-6 h-6" style={{ color: cap.color }} />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{cap.title}</h3>
            
            <p className="text-muted-foreground/80 text-sm leading-relaxed flex-1">
              {cap.desc}
            </p>

            <div className="mt-4 font-mono text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] flex items-center justify-between">
              Module Active
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cap.color }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
