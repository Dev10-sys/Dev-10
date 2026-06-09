"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { MapPin, GraduationCap, Code2, ExternalLink } from "lucide-react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function About() {
  const profile = site.profile;

  const systemInfo = [
    { key: "OS", value: "Ubuntu / Arch (daily driver)" },
    { key: "Role", value: "Full-Stack + Systems Dev" },
    { key: "Focus", value: "Blockchain · Security · AI" },
    { key: "Status", value: "Open to Opportunities", highlight: true },
    { key: "Location", value: profile.location },
    { key: "Education", value: "B.Tech CS (AI/ML specialization)" },
  ];

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
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">01 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">About</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left — Profile + System info panel */}
        <div className="space-y-6">
          {/* Profile image window */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="os-window overflow-hidden"
          >
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">profile.png — Preview</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/profile.png"
                alt="Dev10-sys"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(5,5,8,0.8) 0%, rgba(5,5,8,0.1) 50%, transparent 100%)",
                }}
              />
              {/* Bottom info */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="font-black text-xl text-foreground">Dev</div>
                  <div className="font-mono text-xs text-primary/70">@Dev10-sys</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/Dev10-sys"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all hover:scale-105"
                    style={{ background: "rgba(13,13,20,0.9)", border: "1px solid rgba(248,147,26,0.2)", color: "rgba(248,147,26,0.8)" }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System info panel */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="os-window overflow-hidden"
          >
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">system-info — neofetch</span>
            </div>
            <div className="p-5 font-mono text-xs space-y-2">
              {systemInfo.map(({ key, value, highlight }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-primary/60 w-20 shrink-0">{key}</span>
                  <span className="text-muted-foreground/30">:</span>
                  <span className={highlight ? "text-green-400" : "text-foreground/70"}>
                    {highlight && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />}
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — Bio + Highlights */}
        <div className="space-y-6">
          {/* Bio window */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="os-window overflow-hidden"
          >
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">bio.md — Editor</span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.2em] mb-3">// about me</div>
                <p className="text-foreground/80 leading-relaxed text-base font-medium">
                  {profile.shortBio}
                </p>
              </div>
              <div className="h-px" style={{ background: "rgba(248,147,26,0.1)" }} />
              <p className="text-muted-foreground leading-relaxed">
                {profile.longBio}
              </p>
            </div>
          </motion.div>

          {/* Achievement timeline */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="os-window overflow-hidden"
          >
            <div className="os-window-header">
              <div className="os-dot os-dot-red" />
              <div className="os-dot os-dot-yellow" />
              <div className="os-dot os-dot-green" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground/40">achievements.log</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                {
                  year: "2026",
                  title: "Google Summer of Code",
                  org: "Sugar Labs",
                  desc: "Selected contributor. Linux Desktop (Python/GTK/D-Bus).",
                  color: "#EA4335",
                  badge: "GSoC",
                },
                {
                  year: "2025",
                  title: "LFX Mentorship",
                  org: "OpenSSF / RSTUF",
                  desc: "Security hardening across distributed services. Non-root container enforcement.",
                  color: "#f7931a",
                  badge: "LFX",
                },
                {
                  year: "2024–25",
                  title: "Open Source Contributions",
                  org: "11+ Organizations",
                  desc: "100+ PRs across Web3j, Hyperledger, SONiC, CHAOSS, Chicago PCDC and more.",
                  color: "#7c3aed",
                  badge: "OSS",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[9px] font-black"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}
                    >
                      {item.badge}
                    </div>
                    {i < 2 && (
                      <div className="w-px flex-1" style={{ background: "rgba(248,147,26,0.1)" }} />
                    )}
                  </div>
                  <div className="pb-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground/40">{item.year}</span>
                      <div
                        className="font-black text-sm"
                        style={{ color: item.color }}
                      >
                        {item.title}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground/50">{item.org}</div>
                    <p className="text-foreground/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-3"
          >
            <a
              href="#projects"
              className="flex-1 py-3 rounded-xl text-center font-bold text-sm transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(248,147,26,0.15), rgba(248,147,26,0.05))",
                border: "1px solid rgba(248,147,26,0.2)",
                color: "#f7931a",
              }}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="flex-1 py-3 rounded-xl text-center font-bold text-sm transition-all hover:scale-105"
              style={{
                background: "rgba(13,13,20,0.6)",
                border: "1px solid rgba(248,147,26,0.1)",
                color: "rgba(232,232,240,0.6)",
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
