"use client";

import { useForm, ValidationError } from "@formspree/react";
import { motion } from "framer-motion";
import site from "@/data/site.json";
import { Mail, Github, Send, MessageSquare, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [state, handleSubmit] = useForm("xpqogjzo");
  const email = site.contact.email;
  const displayEmail = email.replace("mailto:", "");

  if (state.succeeded) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="os-window p-12 text-center max-w-2xl mx-auto border-green-500/20"
          style={{ boxShadow: "0 0 40px rgba(40,202,66,0.1)" }}
        >
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-foreground mb-4">Message Sent</h3>
          <p className="text-muted-foreground text-sm mb-8">
            Thanks for reaching out! I'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-bold text-sm transition-all"
            style={{
              background: "rgba(40,202,66,0.1)",
              border: "1px solid rgba(40,202,66,0.3)",
              color: "#28ca42",
            }}
          >
            Send another message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="font-mono text-xs text-primary/50 tracking-[0.3em] uppercase">05 /</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Contact</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(248,147,26,0.3), transparent)" }} />
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Side: Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="os-window p-8 space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Whether you have a question, a project idea, or just want to say hi, feel free to drop a message.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <a
                href={email}
                className="group flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary group-hover:text-black" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground/50 mb-0.5">Email me directly</div>
                  <div className="font-bold text-sm text-foreground/90">{displayEmail}</div>
                </div>
              </a>

              <a
                href={site.contact.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Github className="w-5 h-5 text-foreground/70 group-hover:text-black" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground/50 mb-0.5">Check out my code</div>
                  <div className="font-bold text-sm text-foreground/90">{site.contact.github.split("/").pop()}</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <div className="os-window h-full flex flex-col">
            <div className="p-8 flex-1">
              <div className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                Send a message
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-muted-foreground block">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-400" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-muted-foreground block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="What's on your mind?"
                    required
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-400" />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="group relative flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, #f7931a, #ffbd2e)",
                      boxShadow: "0 0 20px rgba(247,147,26,0.3)",
                    }}
                  >
                    <span className="relative z-10">{state.submitting ? "Sending..." : "Send Message"}</span>
                    <Send className="w-4 h-4 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
