"use client";

import { motion } from "framer-motion";
import site from "@/data/site.json";
import { Cpu, Code2, Database, ShieldAlert, Layout } from "lucide-react";

export function SkillsPreview() {
  const categories = [
    {
      name: "Languages",
      icon: Code2,
      skills: ["Python", "C/C++", "Java (Protocol-level)", "TypeScript/JS", "SQL", "Bash"]
    },
    {
      name: "Systems & Infrastructure",
      icon: Cpu,
      skills: ["Linux", "Wayland / X11", "D-Bus", "GTK4", "Execution Engines", "CLI Tools"]
    },
    {
      name: "Web Development",
      icon: Layout,
      skills: ["React/Next.js", "Node.js", "Express.js", "REST APIs", "Spring Boot", "Full Stack"]
    },
    {
      name: "Security & Blockchain",
      icon: ShieldAlert,
      skills: ["Ethereum Protocol", "Container Security", "Secure Software Supply Chain", "JSON-RPC"]
    },
    {
      name: "Databases & Tools",
      icon: Database,
      skills: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "Git"]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Technical Skills</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="modern-card p-6 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground">{category.name}</h3>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              {category.skills.map((skill, j) => (
                <span 
                  key={j} 
                  className="px-3 py-1.5 text-xs font-bold bg-secondary/50 text-secondary-foreground rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default"
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
