"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { ExternalLink, Github, Terminal, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ProjectsPreview() {
  const projects = site.projects || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-16"
      >
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">03 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Projects</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      <div className="space-y-16">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="os-window group relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_0_40px_rgba(247,147,26,0.08)]"
          >
            {/* Window Header */}
            <div className="os-window-header justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-2">
                  <div className="os-dot os-dot-red" />
                  <div className="os-dot os-dot-yellow" />
                  <div className="os-dot os-dot-green" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/40">
                  {project.title.toLowerCase().replace(/\s+/g, "-")}.exe
                </span>
              </div>
              <div className="flex gap-3">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1.5 font-mono text-[10px]"
                  >
                    <Github className="w-3 h-3" />
                    Source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1.5 font-mono text-[10px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Live
                  </a>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2">
              {/* Left Side: Info */}
              <div className="p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-border/40">
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    {project.title}
                    <Terminal className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-muted-foreground/80 leading-relaxed text-base">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map((tech, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 rounded-md font-mono text-[10px] uppercase tracking-wider"
                      style={{
                        background: "rgba(248,147,26,0.05)",
                        border: "1px solid rgba(248,147,26,0.15)",
                        color: "rgba(232,232,240,0.6)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Highlights Terminal */}
              <div className="p-6 relative bg-[#020202]/30">
                <div className="absolute top-4 right-4 font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">
                  Execution Log
                </div>
                <div className="space-y-4 mt-6">
                  {project.highlights.map((highlight, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + j * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5 opacity-60" />
                      <span className="font-mono text-xs text-foreground/70 leading-relaxed">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + project.highlights.length * 0.1 }}
                    className="flex items-center gap-2 pt-2"
                  >
                    <span className="text-primary cursor-blink">█</span>
                    <span className="font-mono text-[10px] text-muted-foreground/30">Process completed with exit code 0</span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Hover Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(248,147,26,0.06), transparent 40%)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
