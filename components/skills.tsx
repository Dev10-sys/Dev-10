"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import site from "@/data/site.json";

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "Systems & Infrastructure": { text: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
  "Security": { text: "#f43f5e", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)" },
  "Blockchain": { text: "#f7931a", bg: "rgba(248,147,26,0.08)", border: "rgba(248,147,26,0.2)" },
  "Languages": { text: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  "Frameworks": { text: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
  "Databases": { text: "#ffbd2e", bg: "rgba(255,189,46,0.08)", border: "rgba(255,189,46,0.2)" },
  "Tools": { text: "#9090b0", bg: "rgba(144,144,176,0.08)", border: "rgba(144,144,176,0.2)" },
};

const ICONS: Record<string, string> = {
  "Systems & Infrastructure": "⚙️",
  "Security": "🛡️",
  "Blockchain": "₿",
  "Languages": "</> ",
  "Frameworks": "🏗️",
  "Databases": "🗄️",
  "Tools": "🔧",
};

export function Skills() {
  const skills = site.profile.skills as Record<string, string[]>;
  const categories = Object.keys(skills);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 mb-16"
      >
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">02 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Engineering Stack</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: "Languages", count: skills["Languages"]?.length, color: "#10b981" },
          { label: "Frameworks", count: (skills["Frameworks"]?.length ?? 0) + (skills["Databases"]?.length ?? 0), color: "#7c3aed" },
          { label: "Security Skills", count: skills["Security"]?.length, color: "#f43f5e" },
          { label: "Blockchain Tech", count: skills["Blockchain"]?.length, color: "#f7931a" },
        ].map((item, i) => (
          <div
            key={i}
            className="os-window p-4 flex flex-col items-center text-center"
          >
            <div className="font-black text-3xl" style={{ color: item.color }}>{item.count}</div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Skills grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const color = CATEGORY_COLORS[cat] || { text: "#9090b0", bg: "rgba(144,144,176,0.08)", border: "rgba(144,144,176,0.2)" };
          const isActive = active === cat;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              onClick={() => setActive(isActive ? null : cat)}
              className="os-window overflow-hidden cursor-pointer transition-all"
              style={{
                border: isActive ? `1px solid ${color.border.replace("0.2)", "0.5)")}` : undefined,
                boxShadow: isActive ? `0 0 30px ${color.bg}` : undefined,
              }}
            >
              <div className="os-window-header">
                <div className="os-dot os-dot-red" />
                <div className="os-dot os-dot-yellow" />
                <div className="os-dot os-dot-green" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                  {cat}
                </span>
              </div>

              <div className="p-5">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{ICONS[cat] || "📦"}</span>
                  <span
                    className="font-black text-sm"
                    style={{ color: color.text }}
                  >
                    {cat}
                  </span>
                  <span
                    className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                  >
                    {skills[cat].length}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {skills[cat].map((skill, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.04 + i * 0.03 }}
                      className="skill-tag px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium"
                      style={{ color: color.text }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Marquee tech strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 overflow-hidden"
      >
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(90deg, #050508, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(-90deg, #050508, transparent)" }} />
          <div className="flex gap-8 marquee-ltr">
            {[...Object.values(skills).flat(), ...Object.values(skills).flat()].map((skill, i) => (
              <span
                key={i}
                className="font-mono text-xs whitespace-nowrap px-4 py-2 rounded-full shrink-0"
                style={{
                  background: "rgba(248,147,26,0.04)",
                  border: "1px solid rgba(248,147,26,0.08)",
                  color: "rgba(232,232,240,0.3)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
