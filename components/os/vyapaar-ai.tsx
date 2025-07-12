"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, ExternalLink, Cpu, Database, Zap, FileText, Package,
  ChevronRight, Terminal, ArrowRight, Code2, Layers
} from "lucide-react";

const TECH_STACK = [
  { label: "Runtime", value: "Node.js TypeScript", color: "#3b82f6" },
  { label: "AI Engine", value: "Claude 3.5 Sonnet", color: "#a855f7" },
  { label: "Queue", value: "BullMQ + Redis", color: "#ef4444" },
  { label: "Database", value: "PostgreSQL + Drizzle", color: "#22c55e" },
  { label: "PDF Gen", value: "PDFKit GST-compliant", color: "#f59e0b" },
  { label: "API", value: "Express Hono REST", color: "#06b6d4" },
];

const PIPELINE_STEPS = [
  {
    id: "webhook",
    icon: Zap,
    label: "WhatsApp Webhook",
    desc: "Incoming message received via webhook from WhatsApp Business API. PII scrubbed before storage.",
    code: `POST /webhook/whatsapp
{ "from": "919876543210",
  "text": "bhai 5 kg aata 2 kg daal bhej
           200 rs wala" }`,
    color: "#f59e0b",
  },
  {
    id: "queue",
    icon: Database,
    label: "BullMQ Job Queued",
    desc: "Job is pushed to the order-extraction BullMQ queue with exponential backoff retry strategy.",
    code: `extractionQueue.add("order-extraction", {
  type: "single_message",
  orgId: "org_xyz",
  message: rawText,
  webhookUrl: org.webhookUrl
}, { attempts: 3, backoff: "exponential" })`,
    color: "#3b82f6",
  },
  {
    id: "ai",
    icon: Cpu,
    label: "Claude 3.5 Extraction",
    desc: "AI engine calls Claude via tool-calling API with custom extraction schema. Tiktoken sliding window applied.",
    code: `// Tool-call structured extraction
tools: [{ type: "function",
  function: { name: "record_order",
    parameters: {
      customerName, items: [{
        name, quantity, unit,
        pricePerUnit, totalPrice
      }], totalAmount, confidence
    }
  }
}]`,
    color: "#a855f7",
  },
  {
    id: "parse",
    icon: FileText,
    label: "Structured JSON Output",
    desc: "Parsed and validated ExtractedOrder object stored in Drizzle ORM with confidence score.",
    code: `{
  "id": "uuid-v4",
  "customerName": "Ramesh",
  "items": [
    { "name": "Aata", "quantity": 5,
      "unit": "kg", "pricePerUnit": 40,
      "totalPrice": 200 },
    { "name": "Daal", "quantity": 2,
      "unit": "kg", "pricePerUnit": null }
  ],
  "currency": "INR",
  "confidence": 0.92,
  "status": "pending"
}`,
    color: "#22c55e",
  },
  {
    id: "invoice",
    icon: Package,
    label: "GST PDF Invoice",
    desc: "PDFKit generates a GST-compliant invoice with CGST+SGST breakdown and QR code for digital verification.",
    code: `// invoiceService.ts
const pdf = await generateInvoice({
  invoiceNumber: "INV-2026-00142",
  gstin: org.gstin,
  items, subtotal, cgst, sgst,
  grandTotal: subtotal + cgst + sgst
});
// Returns PDF buffer streamed to client`,
    color: "#f59e0b",
  },
];

const CODE_SNIPPETS: Record<string, { title: string; lang: string; code: string }> = {
  aiService: {
    title: "aiService.ts - Core Extraction Engine",
    lang: "typescript",
    code: `export async function extractOrderFromMessage(
  rawMessage: string
): Promise<ExtractedOrder> {
  const systemPrompt = getPrompt("SINGLE_MESSAGE_EXTRACT", "v1");

  // Tiktoken sliding window - keeps last N tokens
  const optimized = applySlidingWindow(messages, 8000);

  const parsed = await extractWithTool(
    env.AI_MODEL_SMART,
    systemPrompt,
    rawMessage,
    "record_order",
    toolSchema
  );

  return {
    id: randomUUID(),
    items: parsed.items.map(item => ({
      name: String(item.name),
      quantity: Number(item.quantity),
      pricePerUnit: item.pricePerUnit ?? undefined,
    })),
    confidence: Math.min(1, Math.max(0, Number(parsed.confidence))),
    currency: "INR",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}`,
  },
  queueService: {
    title: "queueService.ts - BullMQ Worker",
    lang: "typescript",
    code: `const worker = new Worker(
  "order-extraction",
  async (job: Job<ExtractionJobData>) => {
    const { type, orgId, message, messages } = job.data;

    let order: ExtractedOrder | ExtractedChatOrder;

    if (type === "single_message" && message) {
      order = await extractOrderFromMessage(message);
      await storage.saveOrder(orgId, order);
    } else if (type === "chat_log" && messages) {
      order = await extractOrderFromChat(messages);
      await storage.saveChatOrder(orgId, order);
    }

    if (job.data.webhookUrl) {
      await webhookQueue.add("deliver-result", {
        url: job.data.webhookUrl,
        payload: order
      });
    }
    return { orderId: order.id };
  },
  { connection, concurrency: 5 }
);`,
  },
  schema: {
    title: "schema.ts - Drizzle ORM Schema",
    lang: "typescript",
    code: `export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: varchar("org_id", { length: 128 }).notNull(),
  customerId: uuid("customer_id").references(
    () => customersTable.id
  ),
  totalAmount: numeric("total_amount", {
    precision: 10, scale: 2
  }),
  currency: varchar("currency", { length: 3 })
    .default("INR"),
  status: orderStatusEnum("status").default("pending"),
  rawAiResponse: jsonb("raw_ai_response"),
  confidence: numeric("confidence", {
    precision: 4, scale: 3
  }),
  createdAt: timestamp("created_at")
    .defaultNow().notNull(),
});`,
  },
};

type SnippetKey = keyof typeof CODE_SNIPPETS;

export function VyapaarAI() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<SnippetKey>("aiService");

  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-slate-200 font-mono overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/8 bg-[#161b22] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Cpu size={14} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">VyapaarAI</h2>
            <p className="text-[10px] text-slate-500">AI-powered revenue recovery for Indian WhatsApp businesses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
            Production Grade
          </span>
          <a
            href="https://github.com/Dev10-sys/VyapaarAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] bg-white/6 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 px-2.5 py-1 rounded-lg transition-all"
          >
            <GitBranch size={10} />
            View Repo
            <ExternalLink size={9} />
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Tech Stack Grid */}
        <div className="px-5 py-4 border-b border-white/8">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Stack</p>
          <div className="grid grid-cols-3 gap-2">
            {TECH_STACK.map((t) => (
              <div
                key={t.label}
                className="bg-white/3 border border-white/6 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <div>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider">{t.label}</p>
                  <p className="text-[11px] text-slate-300 font-medium">{t.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Flow */}
        <div className="px-5 py-4 border-b border-white/8">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Processing Pipeline</p>
          <div className="space-y-1.5">
            {PIPELINE_STEPS.map((step, i) => {
              const isOpen = activeStep === step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative">
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="absolute left-4 top-10 w-px h-3 bg-white/8 z-0" />
                  )}
                  <button
                    onClick={() => setActiveStep(isOpen ? null : step.id)}
                    className="relative z-10 w-full flex items-center gap-3 bg-white/3 hover:bg-white/6 border border-white/6 rounded-lg px-3 py-2.5 transition-all text-left"
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}20`, border: `1px solid ${step.color}35` }}
                    >
                      <Icon size={12} style={{ color: step.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-200 font-medium truncate">{step.label}</p>
                      <p className="text-[10px] text-slate-600 truncate">{step.desc.split(".")[0]}</p>
                    </div>
                    <ChevronRight
                      size={12}
                      className={`text-slate-600 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mx-1 mb-1.5 bg-[#161b22] border border-white/6 rounded-b-lg px-3 pt-3 pb-3">
                          <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{step.desc}</p>
                          <pre className="text-[10px] text-emerald-300/80 bg-black/40 rounded-lg p-2.5 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
                            {step.code}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="px-5 py-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Source Code</p>
          <div className="flex gap-2 mb-3">
            {(Object.keys(CODE_SNIPPETS) as SnippetKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSnippet(key)}
                className={`text-[10px] px-2.5 py-1 rounded-lg transition-colors ${
                  activeSnippet === key
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-white/4 text-slate-500 border border-white/8 hover:text-slate-300"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="bg-[#161b22] border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/6">
              <Code2 size={11} className="text-slate-600" />
              <span className="text-[10px] text-slate-500">{CODE_SNIPPETS[activeSnippet].title}</span>
            </div>
            <pre className="text-[11px] text-slate-300 p-4 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
              {CODE_SNIPPETS[activeSnippet].code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
