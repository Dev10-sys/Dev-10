"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";

export function Skills() {
  const skills = site.profile.skills;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">Core Technologies</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([category, items], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="modern-card p-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, j) => (
                <span
                  key={j}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-foreground transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
