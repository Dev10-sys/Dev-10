"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Mail, Twitter, Linkedin, Github } from "lucide-react";
import site from "@/data/site.json";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const contact = site.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Get In Touch</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm always open to discussing new projects, open source collaborations, or opportunities in systems engineering and blockchain.
          </p>

          <div className="space-y-4">
            <a href={contact.email} className="flex items-center gap-4 p-4 modern-card hover:border-primary/50 group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="text-foreground font-medium group-hover:text-primary transition-colors">dev10.sys@gmail.com</div>
              </div>
            </a>
            
            <a href={contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 modern-card hover:border-primary/50 group">
              <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">GitHub</div>
                <div className="text-foreground font-medium group-hover:text-primary transition-colors">@Dev10-sys</div>
              </div>
            </a>

            <div className="flex gap-4 pt-4">
              <a href={contact.twitter} target="_blank" rel="noreferrer" className="p-3 modern-card hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="p-3 modern-card hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="modern-card p-6 md:p-8 space-y-6">
            <h3 className="text-2xl font-black text-foreground mb-6">Send a message</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="How can we work together?"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {status === "idle" && (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
              {status === "sending" && (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Message Sent
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Error Sending
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
