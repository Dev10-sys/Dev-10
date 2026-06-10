"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Github } from "lucide-react";
import site from "@/data/site.json";

export function ProjectsPreview() {
  const projects = site.projects;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Projects</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="modern-card p-6 flex flex-col group h-full relative overflow-hidden"
          >
            {/* Tech Stack subtle background */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">{project.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 flex-1 relative z-10">
              {project.description}
            </p>

            {/* Highlights */}
            <div className="mb-6 space-y-2 flex-1 relative z-10">
              <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider opacity-70">Highlights</h4>
              {project.highlights.slice(0, 3).map((highlight, j) => (
                <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1 shrink-0" />
                  <span className="leading-snug">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
              {project.tech.slice(0, 4).map((t, idx) => (
                <span key={idx} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground rounded-md border border-border/50">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-auto relative z-10">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live App
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
