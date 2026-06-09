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
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">07 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Resources</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
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
            className="os-window p-6 group flex flex-col justify-between hover:border-primary/50 transition-all hover:-translate-y-1 h-[180px]"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <link.icon className="w-5 h-5 text-primary group-hover:text-black" />
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="mt-4 space-y-1">
              <div className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{link.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground/60">{link.sub}</div>
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
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 px-8 py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(248,147,26,0.1)",
            border: "1px solid rgba(248,147,26,0.3)",
            color: "#f7931a",
          }}
        >
          <Download className="w-4 h-4" />
          Download Resume.pdf
        </a>
      </motion.div>
    </div>
  );
}
