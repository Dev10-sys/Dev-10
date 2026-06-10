"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { Github, Twitter, Linkedin, Terminal, Download, ExternalLink } from "lucide-react";

export function ImportantLinks() {
  const L = site.contact;

  const links = [
    { label: "GitHub Profile", href: L.github, icon: Github, sub: "Source control & contributions" },
    { label: "LinkedIn Network", href: L.linkedin, icon: Linkedin, sub: "Professional connections" },
    { label: "X (Twitter)", href: L.twitter, icon: Twitter, sub: "Tech posts & updates" },
    { label: "Portfolio Repo", href: "https://github.com/Dev10-sys/personal-potfolio", icon: Terminal, sub: "Inspect website source code" },
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
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Resources</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="modern-card p-8 group flex flex-col items-center text-center justify-center hover:border-primary/50 transition-all hover:-translate-y-2 h-[220px] relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
            
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 mb-5 shadow-inner group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <link.icon className="w-10 h-10 text-primary group-hover:text-black transition-colors" />
            </div>
            
            <div className="space-y-1.5">
              <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{link.label}</div>
              <div className="font-mono text-xs text-muted-foreground/60">{link.sub}</div>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center"
      >
        <a
          href="https://drive.google.com/file/d/1X-AJpMGv7sig5BlHjEczVPKYBIyCOojN/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 px-8 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
        >
          <ExternalLink className="w-4 h-4" />
          View Resume
        </a>
      </motion.div>
    </div>
  );
}
