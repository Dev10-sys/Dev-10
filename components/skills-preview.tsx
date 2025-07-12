"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";

const CATEGORY_ICONS: Record<string, string> = {
  "Systems & Infrastructure": "⚙️",
  "Security": "🔒",
  "Blockchain": "⛓",
  "Languages": "{ }",
  "Frameworks": "⬡",
  "Databases": "◈",
  "Tools": "▲",
};

// Category accent colors
const ACCENT: Record<string, string> = {
  "Systems & Infrastructure": "#38bdf8",
  "Security":                 "#f472b6",
  "Blockchain":               "#a78bfa",
  "Languages":                "#fbbf24",
  "Frameworks":               "#34d399",
  "Databases":                "#fb923c",
  "Tools":                    "#60a5fa",
};

export function SkillsPreview() {
  const skills = site.profile.skills as Record<string, string[]>;
  const categories = Object.entries(skills);

  return (
    <div className="w-full h-full overflow-y-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">Skills</h2>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 font-mono">
          {categories.reduce((acc, [, v]) => acc + v.length, 0)} technologies
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {categories.map(([category, items], i) => {
          const accent = ACCENT[category] ?? "#94a3b8";
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl border p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: `${accent}28`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-1.5 h-5 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-sm font-semibold" style={{ color: accent }}>
                  {category}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {items.map((skill, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-default"
                    style={{
                      background: `${accent}12`,
                      color: "rgba(255,255,255,0.75)",
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
