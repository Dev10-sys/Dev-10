"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Zap, Server, Code2, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Main content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
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
                Hi, I'm Dev.
                <br />
                Software Engineer.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl"
              >
                B.Tech CS student based in Bangalore. 
                I focus on full-stack web development, Linux infrastructure, and building open source tools.
              </motion.p>
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/projects"
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm bg-foreground text-background transition-all hover:scale-105 active:scale-95 hover:bg-foreground/90"
              >
                <Zap className="w-4 h-4" />
                View My Work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Linux Systems", icon: Terminal },
                { label: "Web Development", icon: Code2 },
                { label: "Full Stack", icon: Server },
                { label: "Blockchain", icon: Zap },
              ].map((skill, i) => (
                <div key={i} className="modern-card p-6 relative overflow-hidden group flex flex-col items-center justify-center text-center">
                  <skill.icon className="w-8 h-8 mb-4 text-foreground/80 group-hover:text-primary transition-colors" />
                  <div className="font-bold text-foreground text-lg">{skill.label}</div>
                </div>
              ))}
            </div>

            <div className="modern-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <span className="text-sm font-bold text-foreground">GitHub Activity</span>
              </div>
              <div className="p-6 bg-card flex justify-center">
                <img
                  src="https://ghchart.rshah.org/F7931A/Dev10-sys"
                  alt="GitHub contribution chart"
                  className="w-full opacity-90 dark:opacity-80"
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
