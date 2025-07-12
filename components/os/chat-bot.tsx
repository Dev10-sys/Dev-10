"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Globe, Search } from "lucide-react";

type Msg = {
  role: "user" | "bot";
  text: string;
  searching?: boolean;
};

type LangMode = "hinglish" | "english" | "hindi";

const GEMINI_API_KEY =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY) ||
  "AIzaSyDtZCogzWlcq0Dpt9MEcn8jfvGHBKMK4mk";

const SYSTEM_PROMPT = `You are DEV AI - an intelligent assistant built directly by Dev himself (Dev10-sys) and embedded into his personal OS-themed developer portfolio at devs-portfolio.pages.dev.

===== WHO YOU ARE =====
You were created by Dev as a living proof of his skills. Dev is a developer who doesn't just talk about building AI - he actually built YOU, his own AI assistant, from scratch and integrated you into his portfolio OS. You are the copilot of this desktop. You are not a generic chatbot - you are Dev's personal OS navigator and portfolio guide.

Your creator: Dev (GitHub: Dev10-sys), a Software & Systems Engineer from Bangalore, India.

===== CRITICAL LANGUAGE RULE =====
MIRROR THE USER'S LANGUAGE EXACTLY. This is non-negotiable.
- If user writes in Hinglish (mixed Hindi+English like "bhai kya karta hai tu") -> Reply in Hinglish, casual and real.
- If user writes in pure Hindi (Devanagari or romanized formal Hindi) -> Reply in that same Hindi style.
- If user writes in English -> Reply in clean English. Be sharp, technical, professional.
- If user writes in any other language -> Reply in that language.
- NEVER switch languages mid-conversation unless the user does.
- Match energy: if user is casual/slang, you're casual. If formal, you're formal.
- In Hinglish replies, use natural mix: "yaar ye Project ek real production system hai jisme..."
- In English replies, be concise and technical: "This is a production-grade pipeline that..."

===== YOUR ROLE ON THIS DESKTOP =====
You are the NAVIGATOR of this OS-themed portfolio. When users visit this site, they land on a full desktop environment. Your job is to:
1. Guide them to the right app for what they need
2. Explain Dev's work deeply and accurately
3. Answer any general tech questions (you are a full AI assistant)
4. Help them explore the desktop - open apps on their behalf
5. Tell them about Dev if they're a recruiter, fellow dev, or just curious

===== DESKTOP MAP - KNOW EVERY APP =====
This portfolio runs as a fake OS desktop (like macOS/Linux). Apps are in the DOCK at the bottom and on the DESKTOP icons:

DOCK APPS (bottom bar):
1. Launchpad (grid icon) - Shows all apps overview
2. Projects (folder icon) - Dev's portfolio projects: VyapaarAI, NWC Tester, BTC HashFrame, SHINRA Labs
3. Code Editor (Dev10 icon) - Shows Dev's coding activity and stats
4. Activity Monitor (CPU icon) - Shows dev metrics, contribution stats
5. Google Chrome (browser) - Full working browser with Google search (say "search X" or go to any URL)
6. Spotify (green icon) - Music player with procedural synth beats (click play!)
7. Notepad (yellow icon) - Scratch notepad, text persists locally
8. Nova Strike (game icon) - Space arcade game, fly with WASD/arrow keys

DESKTOP ICONS (left side):
- My Profile - Dev's full bio, photo, background story
- Dev's Blogs - Engineering articles on Medium
- Contact Me - All links: GitHub, LinkedIn, Twitter, email, resume PDF
- Dev's Terminal - Interactive shell (try: help, ls, cat resume.txt, git log)
- resume.pdf - Direct resume download

TOP BAR:
- "Dev's Portfolio" (top left) - Click for about info
- Time + date (center)
- Recruiter Mode toggle (top right) - Switches to clean recruiter-friendly view
- WiFi, Bluetooth, Volume, Brightness controls (top right)
- Power button - Returns to universe/intro screen

HIDDEN FEATURES USERS LOVE:
- Terminal has real commands: help, ls, cat, git log, whoami, uname, neofetch, skills
- Browser has real Google search working
- Spotify plays actual synth music (procedural audio)
- Nova Strike is a real playable game
- Activity Monitor shows Dev's real contribution stats
- Recruiter Mode makes everything clean and professional

===== DEV'S COMPLETE PROFILE =====
Name: Dev | GitHub: Dev10-sys | Location: Bangalore, India
Email: dev10.sys@gmail.com
GitHub: https://github.com/Dev10-sys
LinkedIn: https://linkedin.com/in/dev10-sys
Twitter/X: https://x.com/Dev10_shadow

EDUCATION: B.Tech Computer Science, specialization in AI/ML

CURRENT ROLES:
- GSoC 2026 Contributor at Sugar Labs (Linux Foundation)
  Project: Porting Sugar desktop shell from GTK3 to GTK4 with native Wayland support
  Tech: Python, PyGObject, D-Bus, Casilda Wayland compositor
  Link: summerofcode.withgoogle.com/programs/2026/projects/Yf2eiaqE

- LFX Mentee at Web3j (LFDT / Linux Foundation)
  Role: Core Ethereum protocol library contributor in Java

===== OPEN SOURCE CONTRIBUTIONS (REAL DATA) =====

SUGAR LABS (9+ merged PRs):
- PR #1106: GSoC flagship - GTK4 migration + Wayland integration (23 commits)
- PR #1093: GTK3 container/layout APIs -> GTK4
- PR #1061: Fallback snapshot drawing for legacy widgets (sugar-toolkit-gtk4)
- PR #1059: Frame panel expansion latency (30% memory reduction)
- PR #1060: Drag-and-drop serialization fix in Journal
- PR #1063: NullPointer fix in modem provider parsing
- PR #1030: Core GTK4 migration groundwork
All links: github.com/sugarlabs/sugar/pulls?q=author:Dev10-sys

WEB3J / LFDT (12+ PRs: 2 merged, 10+ open):
MERGED:
- PR #2255: ClassLoader JVM memory leak fix (static ExecutorService thread pools)
- PR #2254: Raw parameterized type fix for EthLog.LogResult type safety
OPEN (active work):
- PR #2263: EIP-7594 PeerDAS blob transaction wrapper (Osaka hardfork)
- PR #2289: UTF-8 ABI encoding fix for non-ASCII string parameters
- PR #2276: WebSocket exponential backoff reconnect logic
- PR #2288: Transaction null field serialization fix
- PR #2287: BIP32 public-only key derivation NullPointerException fix
- PR #2278: JSON-RPC txpool_contentFrom method support
- PR #2277: BigDecimal float precision fix in gas pricing
- PR #2272: Memory leak fix in WebSocket subscription channel cleanup
All: github.com/LFDT-web3j/web3j/pulls?q=author:Dev10-sys

OPENSSF RSTUF (8+ merged PRs):
Contributions across 4 repos: rstuf-api, rstuf-worker, rstuf, helm-charts
- Enforced non-root container execution across all microservices
- API input validation hardening
- Helm chart security improvements
- Service isolation improvements
PRs: #950, #934 (rstuf), #919, #916 (api), #854, #850 (worker), #57, #56 (helm)

HYPERLEDGER CACTI (6 merged PRs):
- PR #4183: Linux build doc + Node.js version compatibility
- PR #4182: Docker CI crash loop fix
- PR #4181, #4180: Transaction registry sync fixes
- PR #4179: ERC6909 multi-token standard support
- PR #4176: Vulnerable dependency updates
All: github.com/hyperledger-cacti/cacti/pulls?q=author:Dev10-sys

HYPERLEDGER IDENTUS (1 merged):
- PR #591: Fixed @stablelib/uuid ES module crash in DIDComm OutOfBandInvitation tests

TOTAL: 65+ PRs across 4 organizations

===== PROJECTS (DEEP DETAIL) =====

1. VYAPAARIAI (github.com/Dev10-sys/VyapaarAI)
   What: Production async order extraction system for WhatsApp Hinglish business conversations
   Problem solved: Indian SMBs lose orders because WhatsApp messages are unstructured Hinglish
   How it works: WhatsApp message -> BullMQ queue -> Claude 3.5 Sonnet extracts order -> PII redacted -> Drizzle ORM/PostgreSQL stores -> PDFKit generates GST invoice
   Stack: TypeScript, Node.js, Express, BullMQ, Redis, Claude 3.5 Sonnet, Drizzle ORM, PostgreSQL, PDFKit, Pino, Sentry

2. NWC TESTER (github.com/Dev10-sys/nwc-tester | live: nwc-tester.vercel.app)
   What: Nostr Wallet Connect (NIP-47) protocol debugger and testing workbench
   Problem solved: Developers building Lightning wallet apps had no proper testing tool
   How it works: Connect wallet via Bitcoin Connect (Alby) or NWC string -> test all JSON-RPC methods -> see real-time relay responses
   Methods tested: get_balance, pay_invoice, keysend, list_transactions, lookup_invoice, get_info
   Stack: Nostr Protocol, Lightning Network, JSON-RPC, Bitcoin Connect, real-time WebSocket logging

3. BTC HASHFRAME (github.com/Dev10-sys/btc-hashframe | live: btc-hashframe.vercel.app)
   What: Client-side Bitcoin PSBT and BIP21 URI validator + QR code generator
   Problem solved: Devs needed a trustless tool to validate Bitcoin payment data without server-side processing
   How it works: All crypto validation happens in browser - no data ever leaves the client
   Supports: BIP21 URIs, PSBTs (Partially Signed Bitcoin Transactions), output descriptors
   Stack: Next.js 15, TypeScript, client-side cryptographic validation, QR generation

4. SHINRA LABS (github.com/Dev10-sys/shinra-labs)
   What: B2B AI data annotation platform with enterprise task lifecycle management
   Problem solved: AI companies need structured data labeling pipelines with role-based access
   How it works: Companies upload datasets -> Freelancers claim tasks -> Submit annotations -> Real-time sync via Supabase
   Stack: React, Vite, Supabase (Auth + Realtime + Storage), PostgreSQL, role-based workflow system

===== SKILLS MAP =====
Languages: Python, TypeScript/JS, Java (protocol-level), Go, C/C++, SQL, Bash
Systems: Linux kernel concepts, GTK4, PyGObject, Wayland protocol, D-Bus IPC, X11, CLI tools
Blockchain: Ethereum RLP/ABI, Web3j, EIP-4844/7594, JSON-RPC, Nostr/NWC, Lightning Network
Backend: Node.js, Express, BullMQ task queues, Redis, Spring Boot
Frontend: React, Next.js, Vite (this portfolio is Next.js 14!)
Databases: PostgreSQL, Redis (caching + queues), Supabase
DevOps: Git, Docker, Kubernetes, GitHub Actions CI/CD
Security: RSTUF/TUF supply chain, container hardening (non-root), SBOMit, Trivy scanning

===== TECH BLOG ARTICLES =====
Published on Medium (medium.com/@dev10-sys):
1. "Reading the Web3j Codebase: RLP, Type 3 Transactions, and Upstream Bugs" - Deep dive into Ethereum transaction serialization, how Dev found and fixed bugs in Web3j
2. "Making Trivy SBOMs Verifiable with In-Toto Attestations" - How to cryptographically sign SBOM reports for supply chain security
3. GSoC 2026 weekly logs - Progress updates on Sugar GTK4 migration

===== OS COPILOT COMMANDS =====
When user asks to open something, trigger the right app. Say "open terminal", "open browser", "open music" etc.
Apps you can open: terminal, browser, spotify/music, projects, prs/experience, blogs, notepad, game/nova strike, about/profile, contact/resume

===== STRICT RULES =====
1. ALWAYS mirror user language. If they write "bhai kya karta hai", reply in Hinglish. Not English.
2. Give REAL PR numbers, REAL GitHub links. Never make up data.
3. You know you were built by Dev. If asked "who made you?", say "Dev khud ne banaya hai mujhe" or "Dev built me himself - I'm part of his portfolio, not an external tool."
4. Be a navigator: if someone seems lost, proactively suggest what to explore next.
5. No em-dashes (—). Use hyphens (-).
6. Keep replies focused: 2-4 short sections max. No endless bullet lists.
7. For general tech questions NOT about Dev, still answer them - you are a capable full AI assistant.
8. If asked about this website/portfolio tech: Next.js 14, TypeScript, Framer Motion, Cloudflare Pages, GitHub CI/CD.`;

function detectLang(text: string): LangMode {
  if (/[\u0900-\u097F]/.test(text)) return "hindi";

  const hinglishMarkers = [
    "kya","hai","bhai","tera","mera","dekh","kaun","kaise","kyun","yaha",
    "wala","nahi","haan","aur","toh","ka","ki","ke","mein","par","ye","tu",
    "kuch","sab","bata","hun","hua","hota","woh","yar","yaar","bhaii","smj",
    "smjh","krr","krde","krdee","nhi","hone","chaiye","chahiye","karo","kro",
    "accha","thik","theek","bahut","jada","zyada","thoda","puchh","batao",
    "dikha","kholo","chal","chalo","ruk","dekho","bata","dede","isko","usko",
    "abhi","ab","lag","rha","rhaa","laga","lge","krta","krte","krti","tha",
    "thi","the","se","ko","ne","pe","ho","jo","jab","tab","phir","fir"
  ];
  const lower = text.toLowerCase();
  const score = hinglishMarkers.filter(w => {
    const re = new RegExp(`(^|\\s)${w}(\\s|$)`);
    return re.test(lower);
  }).length;

  return score >= 2 ? "hinglish" : "english";
}

const GREETINGS: Record<LangMode, string> = {
  hinglish:
    "Hey yaar! Main Dev AI hun - Dev ne khud banaya hai mujhe apne portfolio k liye. Ye pura desktop Dev ne build kiya hai, aur main iska copilot hun. Kuch bhi puchho - projects, PRs, GSoC, ya desktop navigate karna ho toh batao!",
  hindi:
    "नमस्ते! मैं Dev AI हूं - Dev ने मुझे खुद बनाया है। इस पूरे desktop portfolio का navigator हूं मैं। कुछ भी पूछिए!",
  english:
    "Hey! I'm Dev AI - built by Dev himself as part of this OS-themed portfolio. I'm the desktop copilot here. Ask me anything about Dev's work, or say 'guide me' and I'll give you a tour of this desktop!",
};

async function searchWikipedia(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3&srprop=snippet`
    );
    const data = await res.json();
    const results = data?.query?.search ?? [];
    if (!results.length) return "";
    return results
      .slice(0, 2)
      .map((r: { title: string; snippet: string }) => `${r.title}: ${r.snippet.replace(/<[^>]+>/g, "").trim()}`)
      .join("\n");
  } catch {
    return "";
  }
}

async function callGemini(
  userMessage: string,
  history: Msg[],
  detectedLang: LangMode
): Promise<string> {
  const langInstruction =
    detectedLang === "hinglish"
      ? "IMPORTANT: The user is writing in Hinglish. You MUST reply in Hinglish (casual mix of Hindi and English). Do not reply in pure English."
      : detectedLang === "hindi"
      ? "IMPORTANT: The user is writing in Hindi. You MUST reply in Hindi."
      : "IMPORTANT: The user is writing in English. Reply in clear, technical English.";

  const historyText = history
    .filter(m => !m.searching)
    .slice(-6)
    .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
    .join("\n");

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${langInstruction}\n\nConversation history:\n${historyText}\n\nUser: ${userMessage}\nAssistant:`;

  try {
    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`);

    if (!res.ok) return "";
    const text = await res.text();
    return text.trim();
  } catch (err) {
    console.error("AI Error:", err);
    return "";
  }
}

function smartFallback(input: string, lang: LangMode): string {
  const q = input.toLowerCase();

  const hi = (h: string, e: string) =>
    lang === "english" ? e : h;

  if (/who made you|who built you|creator|banaya|kisne|tumhe kisne/.test(q)) {
    return hi(
      "Dev ne khud banaya hai mujhe! Ye sirf ek chatbot nhi hai - Dev ek developer hai jo khud ka AI assistant build karta hai apne portfolio k liye. Proof of skills literally mujhse shuru hoti hai!",
      "Dev built me himself. I'm not an external tool - Dev integrated a full AI assistant into his own portfolio OS as a demonstration of his skills. I'm literally proof of what he can build."
    );
  }
  if (/tour|guide|what can|kya kr skte|kaise use|help|navigate|dikha|start|begin/.test(q)) {
    return hi(
      "Chal main guide karta hun! Ye pura ek fake OS desktop hai. Bottom mein dock hai - Projects dekh, Browser se Google search kr, Terminal mein commands chala (try: neofetch), Spotify pe music sun, ya Nova Strike game khel. Bayan taraf desktop icons hain - My Profile se Dev ka pura background dekh, Contact Me se hire kr skte ho. Main kisi bhi app ko khol sakta hun - bas bol!",
      "Sure, let me guide you! This is a full OS-themed desktop. The dock at the bottom has: Projects (Dev's work), Browser (real Google search), Terminal (try 'neofetch'), Spotify (synth music), Nova Strike (space game). Left side icons: My Profile, Blogs, Contact (hire Dev!), Terminal, Resume. I can open any app - just ask!"
    );
  }
  if (/gsoc|sugar|gtk4|wayland|casilda/.test(q)) {
    return hi(
      "GSoC 2026 mein Dev Sugar Labs k saath kaam kr rha hai - Sugar desktop shell ko GTK3 se GTK4 aur Wayland pr migrate krna hai. Casilda Wayland compositor use ho rha hai Mutter ki jagah. Main PR #1106 hai jo 23 commits ka hai. Link: summerofcode.withgoogle.com/programs/2026/projects/Yf2eiaqE",
      "Under GSoC 2026, Dev is migrating the Sugar desktop environment from GTK3 to GTK4 with native Wayland support via the Casilda compositor. The flagship PR #1106 has 23 commits. Tracker: summerofcode.withgoogle.com/programs/2026/projects/Yf2eiaqE"
    );
  }
  if (/web3j|ethereum|eip|blockchain/.test(q)) {
    return hi(
      "Web3j mein Dev ke 12+ PRs hain - 2 merged, 10+ open. Merged: #2255 (JVM ClassLoader leak fix) aur #2254 (type safety fix). Open mein EIP-7594 blob wrapper (#2263), UTF-8 ABI fix (#2289), WebSocket reconnect (#2276) shamil hain. github.com/LFDT-web3j/web3j",
      "Dev has 12+ PRs in Web3j (Linux Foundation). Merged: #2255 JVM ClassLoader memory leak, #2254 type safety. Active open PRs: #2263 EIP-7594 blob wrappers, #2289 UTF-8 ABI encoding, #2276 WebSocket reconnect. All at github.com/LFDT-web3j/web3j"
    );
  }
  if (/vyapaar|invoice|whatsapp/.test(q)) {
    return hi(
      "VyapaarAI ek production system hai - WhatsApp ke Hinglish messages se automatically orders parse krta hai aur GST invoice generate krta hai. Stack: Claude 3.5 Sonnet, BullMQ, Redis, Express, Drizzle ORM, PDFKit. Repo: github.com/Dev10-sys/VyapaarAI",
      "VyapaarAI is a production async pipeline - parses Hinglish WhatsApp conversations into structured orders and generates GST-compliant PDF invoices. Stack: Claude 3.5 Sonnet, BullMQ, Redis, Express, Drizzle ORM, PDFKit. github.com/Dev10-sys/VyapaarAI"
    );
  }
  if (/project|repo|nwc|btc|hashframe|shinra/.test(q)) {
    return hi(
      "Dev ke 4 main projects hain:\n1. VyapaarAI - WhatsApp Hinglish order parser + GST invoices\n2. NWC Tester - Nostr Wallet Connect debugger (live: nwc-tester.vercel.app)\n3. BTC HashFrame - Client-side Bitcoin PSBT validator (live: btc-hashframe.vercel.app)\n4. SHINRA Labs - B2B AI annotation platform\ngithub.com/Dev10-sys",
      "Dev's 4 main projects:\n1. VyapaarAI - Hinglish WhatsApp order parser + GST invoice engine\n2. NWC Tester - Nostr Wallet Connect NIP-47 debugger (live: nwc-tester.vercel.app)\n3. BTC HashFrame - Client-side Bitcoin PSBT + BIP21 validator (live: btc-hashframe.vercel.app)\n4. SHINRA Labs - B2B AI data annotation platform\ngithub.com/Dev10-sys"
    );
  }
  if (/skill|tech|stack|language/.test(q)) {
    return hi(
      "Dev ki skills: Python (GTK4/D-Bus), TypeScript/Node.js (Express/BullMQ/Redis), Java (Web3j/Ethereum protocol), Go (Kubernetes). Security: RSTUF supply chain, Docker container hardening. DBs: PostgreSQL, Redis, Supabase. Frontend: React, Next.js. Ye portfolio khud Next.js 14 mein bana hai!",
      "Dev's stack: Python (GTK4/D-Bus/PyGObject), TypeScript/Node.js (Express/BullMQ/Redis/Drizzle), Java (Web3j/Ethereum RLP), Go (Kubernetes/NRI). Security: RSTUF/TUF, container hardening, SBOMit. DBs: PostgreSQL, Redis, Supabase. Frontend: React, Next.js 14 (this portfolio!)."
    );
  }
  if (/contact|hire|email|linkedin|job/.test(q)) {
    return hi(
      "Dev se contact karo:\n- GitHub: github.com/Dev10-sys\n- LinkedIn: linkedin.com/in/dev10-sys\n- Twitter: x.com/Dev10_shadow\n- Email: dev10.sys@gmail.com\nMain Contact app bhi khol sakta hun - bas bol!",
      "Contact Dev:\n- GitHub: github.com/Dev10-sys\n- LinkedIn: linkedin.com/in/dev10-sys\n- Twitter/X: x.com/Dev10_shadow\n- Email: dev10.sys@gmail.com\nI can open the Contact app for you - just ask!"
    );
  }
  if (/hello|hi|hey|namaste|hii|sup/.test(q)) {
    return GREETINGS[lang];
  }
  return hi(
    "Yaar thoda aur detail dete - projects, GSoC, Web3j PRs, skills, contact - kuch bhi puchho. Ya 'guide me' bol do toh pura desktop tour deta hun!",
    "Try asking about Dev's projects, open source work, GSoC, skills, or contact. Say 'guide me' for a full desktop tour - I'll walk you through everything!"
  );
}

function handleOsCommand(lower: string): string | null {
  const commands: Array<[RegExp, string, string]> = [
    [/open terminal|launch terminal|terminal (kholo|open|start)/, "terminal", "Terminal khol diya - shell ready hai! Try: help, neofetch, git log"],
    [/open project|projects (app|dekh|dikhao)|show project/, "projects", "Projects window open - Dev ke saare repos yahan hain!"],
    [/open (about|profile|me)|profile (dikha|dekh|show)|about me/, "about", "Profile open - Dev ka pura background, bio, aur milestones yahan hai!"],
    [/open (pr|experience|pull)|pr (dekh|dikhao|explorer)|contributions/, "prs", "PR Explorer open - Dev ke saare open source contributions live!"],
    [/open blog|blog (dekh|dikhao|open)|engineering log/, "blogs", "Blogs open - Dev ke engineering articles padhne ke liye!"],
    [/open browser|launch browser|(internet|web|chrome) (kholo|open)/, "browser", "Browser launch - Google search ready! Kuch bhi search karo."],
    [/open (music|spotify)|gaana (chalao|play)|play (song|music)/, "music", "Spotify open - Play button dabao synth beats k liye!"],
    [/open notepad|notepad (open|kholo)|write (note|notes)/, "notepad", "Notepad open - local mein notes save hoge!"],
    [/open (game|nova strike)|game (khelo|play|open)/, "game", "Nova Strike launch! WASD ya arrow keys se fly karo. Space = shoot!"],
    [/open contact|contact (me|info|open)|resume (dikha|open|download)/, "contact", "Contact + Resume panel open - Dev ke saare links aur resume yahan!"],
    [/shutdown|exit desktop|leave desktop|(wapas|back) (jao|universe)/, "shutdown", "Warp initiate ho rha hai... universe mein wapas jate hain. See you, space cowboy."],
  ];

  for (const [pattern, appId, response] of commands) {
    if (pattern.test(lower)) {
      if (appId === "shutdown") {
        window.dispatchEvent(new CustomEvent("copilot-shutdown"));
      } else {
        window.dispatchEvent(new CustomEvent("copilot-open-app", { detail: { appId } }));
      }
      return response;
    }
  }
  return null;
}

function AnimeMascot({ talking }: { talking: boolean }) {
  return (
    <motion.svg
      width="42" height="42" viewBox="0 0 42 42"
      animate={talking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3, repeat: talking ? Infinity : 0 }}
    >
      <ellipse cx="21" cy="20" rx="14" ry="15" fill="#fde68a" stroke="#f59e0b" strokeWidth="0.5" />
      <path d="M7 16 Q8 6 21 5 Q34 6 35 16 Q32 8 21 8 Q10 8 7 16Z" fill="#1e293b" />
      <path d="M6 16 Q4 10 8 7" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M36 16 Q38 10 34 7" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="15" cy="19" rx="3" ry="3.5" fill="#1e293b" />
      <ellipse cx="27" cy="19" rx="3" ry="3.5" fill="#1e293b" />
      <circle cx="16" cy="18" r="1" fill="white" />
      <circle cx="28" cy="18" r="1" fill="white" />
      <ellipse cx="11" cy="23" rx="3" ry="1.5" fill="rgba(251,113,133,0.45)" />
      <ellipse cx="31" cy="23" rx="3" ry="1.5" fill="rgba(251,113,133,0.45)" />
      {talking ? (
        <ellipse cx="21" cy="27" rx="3" ry="2" fill="#e11d48" />
      ) : (
        <path d="M18 27 Q21 29.5 24 27" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      <path d="M7 18 Q7 8 21 8 Q35 8 35 18" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="4" y="16" width="5" height="7" rx="2.5" fill="#6366f1" />
      <rect x="33" y="16" width="5" height="7" rx="2.5" fill="#6366f1" />
      <text x="33" y="10" fontSize="6" fill="#fbbf24">✦</text>
      <text x="3" y="10" fontSize="5" fill="#a78bfa">✦</text>
    </motion.svg>
  );
}

const LANG_LABEL: Record<LangMode, string> = {
  hinglish: "HI",
  hindi: "HIN",
  english: "EN",
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [talking, setTalking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLang, setCurrentLang] = useState<LangMode>("english");
  const [isOffline, setIsOffline] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);
  const msgsRef = useRef<Msg[]>([]);

  useEffect(() => { msgsRef.current = msgs; }, [msgs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    const handleNetwork = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOffline(!customEvent.detail.online);
    };
    window.addEventListener("desktop-network-change", handleNetwork);
    if (typeof window !== "undefined") {
      setIsOffline(!!(window as any).__desktopOffline);
    }
    return () => window.removeEventListener("desktop-network-change", handleNetwork);
  }, []);

  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      const sysLang = typeof navigator !== "undefined" ? navigator.language : "en";
      const lang: LangMode = sysLang.startsWith("hi") ? "hinglish" : "english";
      setCurrentLang(lang);
      setMsgs([{ role: "bot", text: GREETINGS[lang] }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;

    const lang = detectLang(text);
    setCurrentLang(lang);
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text }]);
    setTyping(true);
    setTalking(true);

    if (isOffline) {
      await new Promise(r => setTimeout(r, 600));
      setMsgs(prev => [...prev, { role: "bot", text: "Connection error: You are offline. Please check your Wi-Fi settings in the top right control center." }]);
      setTyping(false);
      setTalking(false);
      return;
    }

    const lower = text.toLowerCase();

    const osReply = handleOsCommand(lower);
    if (osReply) {
      await new Promise(r => setTimeout(r, 350));
      setMsgs(prev => [...prev, { role: "bot", text: osReply }]);
      setTyping(false);
      setTimeout(() => setTalking(false), 1200);
      return;
    }

    const needsWebSearch =
      /news|latest|current|today|2024|2025|2026|price|weather|what is|explain|search|find|tell me about/.test(lower) &&
      !/gsoc|sugar|web3j|vyapaar|project|btc|nwc|shinra|skill|contact|pr |pull request|portfolio|desktop|terminal|dev10|devs|coordinator|koordinator|rstuf|openssf|cacti|sonic|chaoss/.test(lower);

    let searchContext = "";
    if (needsWebSearch) {
      setIsSearching(true);
      setMsgs(prev => [...prev, { role: "bot", text: lang === "english" ? "Searching web..." : "Web search kr rha hun...", searching: true }]);
      searchContext = await searchWikipedia(text);
      setIsSearching(false);
      setMsgs(prev => prev.filter(m => !m.searching));
    }

    const history = msgsRef.current.filter(m => !m.searching).slice(-12);

    const userWithContext = searchContext
      ? `${text}\n\n[Web search context]:\n${searchContext}`
      : text;

    const geminiReply = await callGemini(userWithContext, history, lang);
    if (geminiReply) {
      setMsgs(prev => [...prev, { role: "bot", text: geminiReply }]);
      setTyping(false);
      setTimeout(() => setTalking(false), 1400);
      return;
    }

    await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    setMsgs(prev => [...prev, { role: "bot", text: smartFallback(text, lang) }]);
    setTyping(false);
    setTimeout(() => setTalking(false), 1200);
  }, [input, typing]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))",
          boxShadow: "0 8px 32px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <AnimeMascot talking={talking} />
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0d1117]"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-44 right-5 z-40 w-[340px] flex flex-col overflow-hidden"
            style={{
              height: 440,
              borderRadius: 20,
              background: "rgba(10,10,18,0.97)",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                borderBottom: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <div className="relative">
                <AnimeMascot talking={talking} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d1117]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Dev AI</p>
                <p className="text-[10px] flex items-center gap-1" style={{ color: isSearching ? "#60a5fa" : "rgba(165,180,252,0.7)" }}>
                  {isSearching ? (
                    <><Globe size={8} className="animate-spin" /> Searching web...</>
                  ) : (
                    "Built by Dev - OS Navigator"
                  )}
                </p>
              </div>
              <div
                className="text-[10px] font-mono px-1.5 py-0.5 rounded text-indigo-400"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                {LANG_LABEL[currentLang]}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors"
              >
                <X size={12} className="text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ scrollbarWidth: "thin" }}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {m.role === "bot" && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {m.searching
                        ? <Search size={10} className="text-blue-400 animate-pulse" />
                        : <Sparkles size={10} className="text-indigo-400" />
                      }
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "text-white rounded-2xl rounded-br-sm"
                        : m.searching
                        ? "text-blue-300 rounded-2xl rounded-bl-sm italic"
                        : "text-slate-200 rounded-2xl rounded-bl-sm"
                    }`}
                    style={
                      m.role === "user"
                        ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && !isSearching && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={10} className="text-indigo-400" />
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <div
              className="flex gap-2 p-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={currentLang === "english" ? "Ask anything..." : "Kuch bhi puchho..."}
                className="flex-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none px-3 py-2 rounded-xl transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              />
              <motion.button
                onClick={send}
                whileTap={{ scale: 0.9 }}
                disabled={typing}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                }}
              >
                <Send size={13} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
