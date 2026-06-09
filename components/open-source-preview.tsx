"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { GitPullRequest, Github, ExternalLink, Network, FileDiff } from "lucide-react";

export function OpenSourcePreview() {
  const { openSource } = site;
  const orgs = openSource.organizations;

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
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">04 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Open Source</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total PRs", value: openSource.stats.totalPRs, color: "#f7931a" },
          { label: "Merged", value: openSource.stats.mergedPRs, color: "#28ca42" },
          { label: "Organizations", value: openSource.stats.orgs, color: "#7c3aed" },
          { label: "Network", value: "Active", color: "#06b6d4" },
        ].map((stat, i) => (
          <div key={i} className="os-window p-4 flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="font-black text-2xl" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="os-window h-full">
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">git-log --graph --oneline</span>
            </div>
            <div className="p-6 relative timeline-line pl-8 ml-4 space-y-12 my-4">
              {orgs.map((org, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -left-[42px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary/40 group-hover:border-primary group-hover:bg-primary/20 transition-all flex items-center justify-center shadow-[0_0_10px_rgba(248,147,26,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="font-black text-xl text-foreground group-hover:text-primary transition-colors">
                        {org.name}
                      </div>
                      {org.name === "SugarLabs" && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-green-400/10 text-green-400 border border-green-400/20">
                          GSoC '26
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground/80">{org.tagline}</div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {org.contributions.slice(0, 2).map((cont, j) => (
                        <div key={j} className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/50">
                          <FileDiff className="w-3 h-3 text-primary/40" />
                          {cont.length > 40 ? cont.slice(0, 40) + "..." : cont}
                        </div>
                      ))}
                    </div>

                    <a href={org.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 font-mono text-[10px] text-primary hover:text-primary/70 transition-colors">
                      View all PRs <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Graph / Deep Dive */}
        <div className="lg:col-span-7 space-y-6">
          <div className="os-window overflow-hidden h-full">
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">network-topology.svg</span>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] relative">
              <div className="absolute inset-0 noise-bg" />
              
              <Network className="w-16 h-16 text-primary/20 mb-6 animate-pulse" />
              <h3 className="text-2xl font-black text-foreground mb-4">Ecosystem Impact</h3>
              <p className="text-center text-muted-foreground max-w-md text-sm leading-relaxed mb-8">
                {openSource.summary} Deep contributions to system reliability, package security, and blockchain infrastructure.
              </p>

              {/* Fake visual nodes */}
              <div className="w-full relative h-[150px]">
                {orgs.slice(0, 5).map((org, i) => {
                  const x = 50 + 35 * Math.cos((i * 2 * Math.PI) / 5);
                  const y = 50 + 35 * Math.sin((i * 2 * Math.PI) / 5);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-background border border-primary/30 flex items-center justify-center text-xs shadow-[0_0_15px_rgba(248,147,26,0.15)] group-hover:border-primary transition-colors cursor-pointer">
                        {org.name.charAt(0)}
                      </div>
                      <span className="font-mono text-[9px] text-muted-foreground/60 uppercase">{org.name}</span>
                    </motion.div>
                  );
                })}
                {/* Center node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(248,147,26,0.3)]"
                >
                  <Github className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
