"use client";

import { motion } from "framer-motion";
import { GitPullRequest, GitMerge, ExternalLink } from "lucide-react";
import site from "@/data/site.json";

export function OpenSourcePreview() {
  const oss = site.openSource;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Open Source</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 max-w-3xl"
      >
        <p className="text-xl text-muted-foreground leading-relaxed">
          {oss.summary}
        </p>
        
        <div className="flex flex-wrap gap-6 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GitMerge className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{oss.stats.mergedPRs}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Merged PRs</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <GitPullRequest className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{oss.stats.orgs}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Organizations</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oss.organizations.map((org, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="modern-card p-6 flex flex-col group h-full"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {org.logo && (
                  <img 
                    src={org.logo} 
                    alt={`${org.name} logo`} 
                    className="w-12 h-12 rounded-lg object-cover bg-white" 
                  />
                )}
                <div>
                  <h3 className="text-lg font-black text-foreground">{org.name}</h3>
                  <div className="text-xs font-bold text-primary uppercase tracking-wide">{org.role}</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 flex-1">
              {org.tagline}
            </p>

            <div className="mb-6 space-y-2 flex-1">
              <h4 className="text-xs font-bold text-foreground mb-3">Key Contributions</h4>
              {org.contributions.slice(0, 2).map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <a
              href={org.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors mt-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              My Contributions
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
