"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { GitPullRequest, Github, ExternalLink, Network, CheckCircle2 } from "lucide-react";

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

      <div className="space-y-6">
        {orgs.map((org, i) => {
          const isGsoc = org.name === "SugarLabs";
          const isLfx = org.name === "Web3j (LFDT)";
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`os-window p-8 border ${isGsoc ? 'border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]' : isLfx ? 'border-[#f7931a]/20 shadow-[0_0_30px_rgba(247,147,26,0.05)]' : 'border-white/5'}`}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Header & Meta */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background border border-primary/20 flex items-center justify-center shadow-lg shrink-0">
                      {isGsoc ? <img src="/images/profile.png" className="w-8 h-8 object-cover rounded-md opacity-80" alt="SugarLabs" /> : <Github className="w-6 h-6 text-foreground/80" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground">{org.name}</h3>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1 tracking-widest">{org.tech?.join(" · ")}</div>
                    </div>
                  </div>
                  
                  {isGsoc && (
                    <div className="inline-block px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                      🏆 GSoC 2026 Contributor
                    </div>
                  )}
                  {isLfx && (
                    <div className="inline-block px-3 py-1 rounded bg-[#f7931a]/10 border border-[#f7931a]/20 text-[#f7931a] font-mono text-[10px] uppercase tracking-widest font-bold">
                      🏆 LFX Mentorship
                    </div>
                  )}

                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    {org.tagline}
                  </p>
                  
                  <a
                    href={org.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
                  >
                    <Github className="w-3.5 h-3.5" />
                    View Author PRs <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Contributions list */}
                <div className="lg:w-2/3 border-l border-white/5 pl-0 lg:pl-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                      <Network className="w-3 h-3 text-primary/60" />
                      Key Commits & Implementations
                    </div>
                    {org.contributions.map((cont, j) => (
                      <div key={j} className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-green-400/60 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80 leading-relaxed font-medium">
                          {cont}
                        </span>
                      </div>
                    ))}
                  </div>

                  {org.links && org.links.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                        <GitPullRequest className="w-3 h-3 text-primary/60" />
                        Direct PR Links
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {org.links.map((prLink, j) => {
                          const prNum = prLink.split("/").pop();
                          return (
                            <a
                              key={j}
                              href={prLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-primary font-mono text-[11px] hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                            >
                              #{prNum} <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
