"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import site from "@/data/site.json";

export function ProjectsPreview() {
  const projects = site.projects;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Featured Work</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-16">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="modern-card overflow-hidden group"
          >
            <div className="grid lg:grid-cols-12 gap-0">
              {/* Left Side: Details */}
              <div className="p-8 lg:p-12 lg:col-span-7 flex flex-col justify-center">
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {project.tech.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl font-black text-foreground mb-4">
                  {project.title}
                </h3>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {project.description}
                </p>

                <div className="flex gap-4 mt-auto">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground font-bold transition-all"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Right Side: Highlights & Visual */}
              <div className="bg-muted/30 lg:col-span-5 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-center">
                <h4 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider text-muted-foreground">Key Highlights</h4>
                <div className="space-y-4">
                  {project.highlights.map((highlight, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * j, duration: 0.5 }}
                      className="flex items-start gap-3"
                    >
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span className="text-sm text-foreground/80 leading-relaxed">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
