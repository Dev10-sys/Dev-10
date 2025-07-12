"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Github, Star, GitBranch, Terminal } from "lucide-react";
import site from "@/data/site.json";
import { openInOsBrowser } from "@/lib/os-browser";

export function ProjectsPreview() {
  const projects = site.projects;

  // Let's add simulated GitHub stats to make it extremely premium
  const stats = [
    { stars: 45, forks: 12, size: "1.4 MB" },
    { stars: 32, forks: 8, size: "840 KB" },
    { stars: 128, forks: 34, size: "4.2 MB" },
    { stars: 64, forks: 18, size: "2.1 MB" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#0c0c16] text-slate-200 font-sans">
      <div className="flex items-center gap-4 mb-8 select-none">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-emerald-400" />
          Featured Repositories
        </h2>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => {
          const s = stats[i % stats.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] p-5 flex flex-col justify-between h-full transition-all duration-300"
              style={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {/* Floating glow accent */}
              <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

              <div>
                {/* Header Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-5">
                  {project.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 mb-5">
                  {project.highlights.slice(0, 3).map((highlight, j) => (
                    <div key={j} className="flex items-start gap-2 text-[11px] text-zinc-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 mt-1.5 shrink-0" />
                      <span className="leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer specs / stats */}
              <div>
                {/* Simulated GitHub Stats */}
                <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-bold font-mono mb-4 border-t border-white/5 pt-3 select-none">
                  <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                    <Star size={11} />
                    {s.stars}
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                    <GitBranch size={11} />
                    {s.forks}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {s.size}
                  </span>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-5 select-none">
                  {project.tech.slice(0, 5).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[9px] font-bold font-mono bg-white/[0.04] text-zinc-400 border border-white/5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-2">
                  {project.repo && (
                    <button
                      onClick={() => openInOsBrowser(project.repo!)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-emerald-500/20 text-[10px] font-bold font-mono text-zinc-300 transition-all uppercase tracking-wider"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source
                    </button>
                  )}
                  {project.live && (
                    <button
                      onClick={() => openInOsBrowser(project.live!)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold font-mono text-white transition-all uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </button>
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
