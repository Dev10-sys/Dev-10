"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { ExternalLink } from "lucide-react";
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
    { key: "OS", value: "Linux · Fedora / Arch" },
    { key: "Role", value: "Software & Systems Engineer" },
    { key: "Focus", value: "AI/ML Integration · GTK4 · Open Source" },
    { key: "Status", value: "Open to Opportunities", highlight: true },
    { key: "Location", value: profile.location },
    { key: "Degree", value: "B.Tech CS · AI/ML" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Section header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">About Me</h2>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left - Profile Image & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="modern-card overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/profile.png"
                alt="Dev10-sys"
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="font-black text-2xl text-white">Dev</div>
                  <div className="text-sm text-primary font-medium">@Dev10-sys</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="modern-card p-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">Snapshot</h3>
            {systemInfo.map(({ key, value, highlight }, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="text-muted-foreground w-24 shrink-0 font-medium">{key}</span>
                <span className={highlight ? "text-primary font-bold flex items-center gap-2" : "text-foreground font-medium"}>
                  {highlight && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  {value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right - Bio & Milestones */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="modern-card p-8 md:p-10"
          >
            <h3 className="text-2xl font-black text-foreground mb-6">The Journey</h3>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p className="text-foreground font-medium">{profile.shortBio}</p>
              <p>{profile.longBio}</p>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="modern-card p-8 md:p-10"
          >
            <h3 className="text-2xl font-black text-foreground mb-8">Experience</h3>
            <div className="space-y-8">
              {[
                {
                  year: "2026",
                  title: "Google Summer of Code 2026",
                  org: "Sugar Labs",
                  desc: "Porting the Sugar desktop environment from GTK3 to GTK4 with Wayland via Casilda compositor. Accepted project in GSoC 2026.",
                  color: "#eab308",
                  logo: "https://github.com/sugarlabs.png",
                  href: "https://summerofcode.withgoogle.com/programs/2026/projects/Yf2eiaqE"
                },
                {
                  year: "",
                  title: "LFX Mentorship",
                  org: "Web3j (LFDT)",
                  desc: "Core protocol engineering and reliability improvements for Web3j.",
                  color: "#3b82f6", // Blue
                  logo: "https://github.com/web3j.png",
                  href: "https://mentorship.lfx.linuxfoundation.org/mentee/434b0dd4-2d0f-4348-ac23-40165ae406c6"
                },
                {
                  year: "",
                  title: "Open Source Contributions",
                  org: "11+ Organizations",
                  desc: "100+ PRs across Web3j, Hyperledger, SONiC, CHAOSS, Chicago PCDC and more.",
                  color: "#737373", // Gray
                  logo: "https://github.com/github.png",
                  href: "https://github.com/Dev10-sys"
                },
              ].map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div 
                    className="absolute left-0 top-1 w-6 h-6 rounded-full overflow-hidden border border-border bg-background flex items-center justify-center"
                    style={{ borderColor: item.color }}
                  >
                    <img src={item.logo} alt={item.org} className="w-full h-full object-cover" />
                  </div>
                  {i !== 2 && (
                    <div className="absolute left-[11px] top-8 bottom-[-2rem] w-[2px] bg-border" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <a href={item.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 group/link">
                        <h4 className="text-lg font-bold group-hover/link:underline" style={{ color: item.color }}>{item.title}</h4>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </div>
                    <div className="font-bold text-foreground/80">{item.org}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
