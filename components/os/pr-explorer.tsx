"use client";

import { useState, useMemo, useEffect } from "react";
import { GitPullRequest, GitMerge, Search, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PRStatus = "merged" | "open";
type PRImpact = "high" | "medium" | "low";

type PullRequest = {
  title: string;
  repo: string;
  number: number;
  status: PRStatus;
  org: string;
  orgLabel: string;
  description: string;
  tech: string[];
  link: string;
  impact: PRImpact;
  mergedAt?: string;
};

// Canonical org ID mapping — raw GitHub org name -> our sidebar ID
const ORG_CANONICAL: Record<string, string> = {
  "sugarlabs": "sugarlabs",
  "web3j": "web3j",
  "lfdt-web3j": "web3j",
  "repository-service-tuf": "openssf",
  "hyperledger": "hyperledger",
  "hyperledger-cacti": "hyperledger",
  "hyperledger-identus": "hyperledger",
  "uchicago": "cancer",
};

// BLACKLIST: Only these junk orgs are excluded (bad/unmerged PRs, not worth showing)
const EXCLUDED_ORGS = new Set([
  "medic", "dev10-sys",
  "chaoss", "chicagopcdc", "dbpedia", "deshdeepakkant",
  "hamdaanaliquatil", "koordinator-sh", "kubeedge",
  "sonic-net", "webgoat",
]);

function normalizeOrg(rawOrg: string): string {
  return ORG_CANONICAL[rawOrg.toLowerCase()] ?? rawOrg.toLowerCase();
}

// Org display labels
const ORG_LABELS: Record<string, string> = {
  sugarlabs:   "Sugar Labs · GSoC 2026",
  web3j:       "LFDT Web3j · LFX Mentee",
  openssf:     "OpenSSF / RSTUF",
  hyperledger: "Hyperledger",
  cancer:      "Chicago Pediatric Cancer",
};

// Color palette per canonical org ID
const ORG_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  sugarlabs:   { bg: "rgba(163,230,53,0.06)",  text: "#a3e635", border: "rgba(163,230,53,0.2)",  glow: "rgba(163,230,53,0.12)"  },
  web3j:       { bg: "rgba(251,146,60,0.06)",  text: "#fb923c", border: "rgba(251,146,60,0.2)",  glow: "rgba(251,146,60,0.12)"  },
  openssf:     { bg: "rgba(129,140,248,0.06)", text: "#818cf8", border: "rgba(129,140,248,0.2)", glow: "rgba(129,140,248,0.12)" },
  hyperledger: { bg: "rgba(236,72,153,0.06)",  text: "#ec4899", border: "rgba(236,72,153,0.2)",  glow: "rgba(236,72,153,0.12)"  },
  cancer:      { bg: "rgba(244,63,94,0.06)",   text: "#f43f5e", border: "rgba(244,63,94,0.2)",   glow: "rgba(244,63,94,0.12)"   },
};

function getOrgColor(org: string) {
  return ORG_COLORS[org] ?? { bg: "rgba(148,163,184,0.06)", text: "#94a3b8", border: "rgba(148,163,184,0.2)", glow: "rgba(148,163,184,0.10)" };
}

// Impact sort weight — higher = shown first within status group
const IMPACT_WEIGHT: Record<PRImpact, number> = { high: 3, medium: 2, low: 1 };

function sortPRs(list: PullRequest[]): PullRequest[] {
  return [...list].sort((a, b) => {
    // Merged before open
    if (a.status !== b.status) return a.status === "merged" ? -1 : 1;
    // Higher impact first
    const impactDiff = IMPACT_WEIGHT[b.impact] - IMPACT_WEIGHT[a.impact];
    if (impactDiff !== 0) return impactDiff;
    // Higher PR number first
    return b.number - a.number;
  });
}

// Handcrafted high-fidelity PR database (merged first, then open, high impact first)
const HANDCRAFTED_PRS: PullRequest[] = [
  // -- SUGAR LABS - Merged -------------------------------------------------
  {
    title: "Core GTK4 Migration and Wayland Integration for Sugar Shell",
    repo: "sugarlabs/sugar", number: 1030, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Ported Sugar core display layouts to GTK4, replacing Mutter window overrides with Wayland Casilda compositor compatibility blocks.",
    tech: ["Python", "GTK4", "Wayland", "Casilda"],
    link: "https://github.com/sugarlabs/sugar/pull/1030", impact: "high", mergedAt: "2026-05-12"
  },
  {
    title: "gtk4: migrate GTK3 container and layout APIs to GTK4 equivalents",
    repo: "sugarlabs/sugar", number: 1093, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Migrated legacy GTK3 layout widgets (GtkBox, GtkGrid) and size-request implementations to standard GTK4 properties and layout managers.",
    tech: ["Python", "GTK4", "PyGObject"],
    link: "https://github.com/sugarlabs/sugar/pull/1093", impact: "high", mergedAt: "2026-05-12"
  },
  {
    title: "toolkit: implement fallback snapshot drawing controls for legacy widgets",
    repo: "sugarlabs/sugar-toolkit-gtk4", number: 1061, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Provided fallback draw methods using Gtk.Snapshot API for backward compatibility of custom widgets under GTK4.",
    tech: ["Python", "GTK4", "Snapshot API"],
    link: "https://github.com/sugarlabs/sugar-toolkit-gtk4/pull/1061", impact: "high", mergedAt: "2026-04-05"
  },
  {
    title: "frame: optimize panel expansion latency and memory usage",
    repo: "sugarlabs/sugar", number: 1059, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Optimized frame layout renders, removing redundant size calculations to reduce peak animation memory by 30%.",
    tech: ["Python", "GTK3", "GTK4", "Performance"],
    link: "https://github.com/sugarlabs/sugar/pull/1059", impact: "medium", mergedAt: "2026-02-15"
  },
  {
    title: "journal: fix drag-and-drop file import serialization error",
    repo: "sugarlabs/sugar", number: 1060, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Sanitized URI list buffers and file descriptors during Drag & Drop, preventing thread lockups during large transfers.",
    tech: ["Python", "Serialization", "Drag & Drop"],
    link: "https://github.com/sugarlabs/sugar/pull/1060", impact: "medium", mergedAt: "2026-01-20"
  },
  {
    title: "controlpanel: prevent NullPointer in modem provider details parsing",
    repo: "sugarlabs/sugar", number: 1063, status: "merged", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Added safety boundary checks to cellular plan parser, avoiding crashes when GSM cellular plans return empty provider objects.",
    tech: ["Python", "Control Panel", "Bug Fix"],
    link: "https://github.com/sugarlabs/sugar/pull/1063", impact: "medium", mergedAt: "2026-04-18"
  },

  // -- SUGAR LABS - Open ----------------------------------------------------
  {
    title: "Core GTK4 Migration and Wayland Integration for Sugar Shell (main branch)",
    repo: "sugarlabs/sugar", number: 1106, status: "open", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Flagship GSoC 2026 PR. Ports the entire Sugar desktop shell to GTK4, replacing Mutter with the Casilda Wayland compositor.",
    tech: ["Python", "GTK4", "Wayland", "Casilda"],
    link: "https://github.com/sugarlabs/sugar/pull/1106", impact: "high"
  },
  {
    title: "Port theme to GTK4 stylesheet nodes",
    repo: "sugarlabs/sugar-artwork", number: 129, status: "open", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Created a dedicated GTK4 stylesheet using modern CSS nodes and selectors, updating SVG assets for clean HiDPI scaling.",
    tech: ["GTK4", "CSS", "SVG"],
    link: "https://github.com/sugarlabs/sugar-artwork/pull/129", impact: "high"
  },
  {
    title: "Fixes in sugar-toolkit-gtk4 to support shell widgets",
    repo: "sugarlabs/sugar-toolkit-gtk4", number: 33, status: "open", org: "sugarlabs",
    orgLabel: "Sugar Labs - GSoC",
    description: "Widget implementation and rendering stability fixes, migrating Gtk.Snapshot draws and palette autohide behaviour.",
    tech: ["Python", "GTK4", "PyGObject"],
    link: "https://github.com/sugarlabs/sugar-toolkit-gtk4/pull/33", impact: "high"
  },

  // -- WEB3J - Merged ------------------------------------------------------
  {
    title: "Fix ClassLoader leak caused by static ExecutorService in Async",
    repo: "web3j/web3j", number: 2255, status: "merged", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Introduced explicit shutdown hooks for Web3j static executor services to eliminate ClassLoader leaks in containerised environments.",
    tech: ["Java", "Memory Leaks", "ExecutorService"],
    link: "https://github.com/web3j/web3j/pull/2255", impact: "high", mergedAt: "2026-04-27"
  },
  {
    title: "Fix raw use of parameterized class EthLog.LogResult",
    repo: "web3j/web3j", number: 2254, status: "merged", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Cleaned raw type references to EthLog.LogResult to enforce generic parameters and resolve strict-typing build errors.",
    tech: ["Java", "Generics", "Type Safety"],
    link: "https://github.com/web3j/web3j/pull/2254", impact: "medium", mergedAt: "2026-04-10"
  },

  // -- WEB3J - Open --------------------------------------------------------
  {
    title: "feat: add support for EIP-7594 blob transaction wrapper (Osaka hardfork)",
    repo: "web3j/web3j", number: 2263, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Implements EIP-7594 blob transaction wrapper format extending EIP-4844 handling with wrapper_version and cell_proofs. Updates RLP encoding and decoding for both new and legacy formats with size validation.",
    tech: ["Java", "Ethereum", "EIP-7594", "RLP"],
    link: "https://github.com/web3j/web3j/pull/2263", impact: "high"
  },
  {
    title: "fix: correct Utf8String encoding for non-ASCII strings and dynamic array handling",
    repo: "web3j/web3j", number: 2289, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Fixes incorrect ABI encoding of UTF-8 strings (e.g. Chinese text) causing transaction failures. Updates byte-length calculation with correct ABI padding and fixes dynamic array encoding for arrays containing dynamic types.",
    tech: ["Java", "ABI Encoding", "UTF-8", "Ethereum"],
    link: "https://github.com/web3j/web3j/pull/2289", impact: "high"
  },
  {
    title: "fix: implement robust fallback reconnect logic in WebSocketService",
    repo: "web3j/web3j", number: 2276, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Adds exponential backoff intervals to WebSocket subscription hooks to prevent socket thread starvation on intermittent connections.",
    tech: ["Java", "WebSockets", "Concurrency"],
    link: "https://github.com/web3j/web3j/pull/2276", impact: "high"
  },
  {
    title: "fix: prevent Transaction serialization failures when fee fields are null",
    repo: "web3j/web3j", number: 2288, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Addresses serialization failures when gas fee limits are null. Introduces null-safe getters inside serializing controllers.",
    tech: ["Java", "Serialization", "Jackson"],
    link: "https://github.com/web3j/web3j/pull/2288", impact: "high"
  },
  {
    title: "fix: handle public-only Bip32ECKeyPair to avoid NullPointerException in deriveChildKey",
    repo: "web3j/web3j", number: 2287, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Corrects BIP32 key derivation crashes by reconstructing public ECPoints from the public key directly when the private key is absent.",
    tech: ["Java", "Cryptography", "BIP32"],
    link: "https://github.com/web3j/web3j/pull/2287", impact: "medium"
  },
  {
    title: "feat: implement JSON-RPC txpool_contentFrom method support",
    repo: "web3j/web3j", number: 2278, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Provides client support for txpool queries to poll the pending queue of node transactions by sender address.",
    tech: ["Java", "JSON-RPC", "Ethereum"],
    link: "https://github.com/web3j/web3j/pull/2278", impact: "medium"
  },
  {
    title: "fix: prevent precision loss during large float JSON deserialization",
    repo: "web3j/web3j", number: 2277, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Refactors gas pricing parser calculations using BigDecimal mappings to prevent rounding faults on large float values.",
    tech: ["Java", "Jackson", "BigDecimal"],
    link: "https://github.com/web3j/web3j/pull/2277", impact: "medium"
  },
  {
    title: "fix: prevent socket handler lockups during reconnect timeouts",
    repo: "web3j/web3j", number: 2257, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Guards network sockets against blocking on handshake timeouts by wrapping client sockets in asynchronous timers.",
    tech: ["Java", "WebSockets", "Timeout"],
    link: "https://github.com/web3j/web3j/pull/2257", impact: "medium"
  },
  {
    title: "codegen: generate strict java records for Solidity structures",
    repo: "web3j/web3j", number: 2274, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Introduces record class templates to the Solidity-to-Java ABI compiler tool, producing immutable, canonical types.",
    tech: ["Java", "Codegen", "Solidity"],
    link: "https://github.com/web3j/web3j/pull/2274", impact: "medium"
  },
  {
    title: "filter: implement filter lifecycle block range validation checks",
    repo: "web3j/web3j", number: 2273, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Implements strict block boundary validations when setting up node filter block-range queries.",
    tech: ["Java", "JSON-RPC", "Filters"],
    link: "https://github.com/web3j/web3j/pull/2273", impact: "low"
  },
  {
    title: "websocket: prevent memory leaks in client response subscription channels",
    repo: "web3j/web3j", number: 2272, status: "open", org: "web3j",
    orgLabel: "LFDT Web3j",
    description: "Releases subscription callback buffers upon web socket client session teardown, avoiding memory bloating.",
    tech: ["Java", "RxJava", "Memory Leaks"],
    link: "https://github.com/web3j/web3j/pull/2272", impact: "medium"
  },

  // -- OPENSSF / RSTUF - Merged --------------------------------------------
  {
    title: "docs: update deployment documentation to use rstuf admin",
    repo: "repository-service-tuf/repository-service-tuf", number: 968, status: "merged", org: "openssf",
    orgLabel: "OpenSSF / RSTUF",
    description: "Updated deployment guides to migrate from rstuf admin-legacy to rstuf admin and resolved SQL environment variable mismatches.",
    tech: ["Python", "TUF", "Docker", "Kubernetes"],
    link: "https://github.com/repository-service-tuf/repository-service-tuf/pull/968", impact: "medium", mergedAt: "2026-05-09"
  },

  // -- HYPERLEDGER - Merged ------------------------------------------------
  {
    title: "fix: resolve transaction registry synchronization locks under load",
    repo: "hyperledger-cacti/cacti", number: 4180, status: "merged", org: "hyperledger",
    orgLabel: "Hyperledger",
    description: "Avoids database locks in the transaction tracking ledger by restructuring dynamic query write priorities.",
    tech: ["TypeScript", "Database", "Locks"],
    link: "https://github.com/hyperledger-cacti/cacti/pull/4180", impact: "high", mergedAt: "2026-04-10"
  },
  {
    title: "fix(test): correct @stablelib/uuid import in invitation test",
    repo: "hyperledger-identus/sdk-ts", number: 591, status: "merged", org: "hyperledger",
    orgLabel: "Hyperledger",
    description: "Fixed runtime crash in OutOfBandInvitation test caused by a default import of @stablelib/uuid which has no default export.",
    tech: ["TypeScript", "Vitest", "DID Comms"],
    link: "https://github.com/hyperledger-identus/sdk-ts/pull/591", impact: "medium", mergedAt: "2026-05-05"
  },
  {
    title: "docs(setup): add linux build instructions and Node version support",
    repo: "hyperledger-cacti/cacti", number: 4183, status: "merged", org: "hyperledger",
    orgLabel: "Hyperledger",
    description: "Fixed incomplete Linux prerequisites in BUILD.md, corrected wrong clone URL, updated devcontainer Node.js to 20.20.0, added CI checks and WSL2 recommendations.",
    tech: ["DevOps", "Docker", "Node.js", "Documentation"],
    link: "https://github.com/hyperledger-cacti/cacti/pull/4183", impact: "low", mergedAt: "2026-04-21"
  },

];

export function PullRequestExplorer() {
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [prs, setPrs] = useState<PullRequest[]>(sortPRs(HANDCRAFTED_PRS));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPRs() {
      setLoading(true);
      try {
        const headers = { Accept: "application/vnd.github+json" };
        const [mergedRes, openRes] = await Promise.all([
          fetch(
            "https://api.github.com/search/issues?q=author:Dev10-sys+type:pr+is:merged&per_page=100",
            { headers }
          ),
          fetch(
            "https://api.github.com/search/issues?q=author:Dev10-sys+type:pr+is:open&per_page=100",
            { headers }
          )
        ]);

        if (!mergedRes.ok) throw new Error(`GitHub API Merged: ${mergedRes.status}`);
        if (!openRes.ok) throw new Error(`GitHub API Open: ${openRes.status}`);

        const [mergedData, openData] = await Promise.all([
          mergedRes.json(),
          openRes.json()
        ]);

        if (!active) return;

        const liveMap = new Map<string, PullRequest>();

        // Build a keyed map from our handcrafted list for fast lookup
        const handcraftedMap = new Map<string, PullRequest>();
        HANDCRAFTED_PRS.forEach((p) => {
          handcraftedMap.set(`${p.repo}#${p.number}`, p);
        });

        const processItems = (items: any[], status: PRStatus) => {
          if (!Array.isArray(items)) return;
          for (const item of items) {
            const repoPath: string = item.repository_url.replace("https://api.github.com/repos/", "");
            const rawOrg = repoPath.split("/")[0].toLowerCase();
            const canonOrg = normalizeOrg(rawOrg);

            // Skip excluded junk orgs
            if (EXCLUDED_ORGS.has(rawOrg) || EXCLUDED_ORGS.has(canonOrg)) {
              continue;
            }

            const key = `${repoPath}#${item.number}`;
            const existing = handcraftedMap.get(key);

            if (existing) {
              liveMap.set(key, {
                ...existing,
                status,
                mergedAt: status === "merged" && item.pull_request?.merged_at
                  ? item.pull_request.merged_at.split("T")[0]
                  : existing.mergedAt,
              });
            } else {
              const tech: string[] = [];
              if (rawOrg.includes("sugar")) tech.push("Python", "GTK");
              else if (rawOrg.includes("web3j")) tech.push("Java", "Ethereum");
              else if (rawOrg.includes("cacti") || rawOrg.includes("identus")) tech.push("TypeScript", "Node.js");
              else if (rawOrg.includes("tuf") || rawOrg.includes("openssf")) tech.push("Python", "Security");
              if (tech.length === 0) tech.push("Open Source");

              liveMap.set(key, {
                title: item.title,
                repo: repoPath,
                number: item.number,
                status,
                org: canonOrg,
                orgLabel: ORG_LABELS[canonOrg] ?? rawOrg,
                description: item.body
                  ? item.body.replace(/\r\n/g, " ").slice(0, 160).trim() + (item.body.length > 160 ? "…" : "")
                  : "Open source contribution on GitHub.",
                tech,
                link: item.html_url,
                impact: "medium",
                mergedAt: status === "merged" && item.pull_request?.merged_at
                  ? item.pull_request.merged_at.split("T")[0]
                  : undefined,
              });
            }
          }
        };

        processItems(mergedData.items, "merged");
        processItems(openData.items, "open");

        // Add any handcrafted entries not returned by API (offline/private)
        HANDCRAFTED_PRS.forEach((p) => {
          const key = `${p.repo}#${p.number}`;
          if (!liveMap.has(key)) {
            // Exclude blacklisted orgs in handcrafted fallback too
            if (!EXCLUDED_ORGS.has(p.org)) {
              liveMap.set(key, p);
            }
          }
        });

        setPrs(sortPRs(Array.from(liveMap.values())));
      } catch (err) {
        console.warn("GitHub API unavailable — using local data.", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPRs();
    return () => { active = false; };
  }, []);

  // Build dynamic sidebar list from actual PR data
  const orgSidebarList = useMemo(() => {
    const seen = new Map<string, { name: string; count: number }>();
    prs.forEach((p) => {
      const existing = seen.get(p.org);
      if (existing) {
        existing.count++;
      } else {
        seen.set(p.org, { name: ORG_LABELS[p.org] ?? p.org, count: 1 });
      }
    });
    // Sort: known orgs first in preferred order, then alphabetical for unknowns
    const preferred = ["sugarlabs", "web3j", "openssf", "hyperledger", "cancer", "medic"];
    const entries = Array.from(seen.entries());
    entries.sort(([a], [b]) => {
      const ai = preferred.indexOf(a);
      const bi = preferred.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
    return entries;
  }, [prs]);

  const filtered = useMemo(() => {
    return prs.filter((pr) => {
      const matchesOrg = selectedOrg === "all" || pr.org === selectedOrg;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        pr.title.toLowerCase().includes(q) ||
        pr.description.toLowerCase().includes(q) ||
        pr.tech.some((t) => t.toLowerCase().includes(q)) ||
        pr.repo.toLowerCase().includes(q);
      return matchesOrg && matchesSearch;
    });
  }, [selectedOrg, searchQuery, prs]);

  const stats = useMemo(() => {
    const total = prs.length;
    const merged = prs.filter((p) => p.status === "merged").length;
    const orgsCount = new Set(prs.map((p) => p.org)).size;
    return { total, merged, orgsCount };
  }, [prs]);

  return (
    <div className="h-full flex flex-col bg-[#08080f] text-slate-200 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 bg-[#0b0b14]/80 backdrop-blur-md select-none shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Open Source Contributions
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              My pull requests across open source orgs on GitHub
              {loading && <span className="ml-2 text-zinc-600 animate-pulse">· syncing…</span>}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#121221]/50 border border-zinc-800 rounded-2xl px-4 py-2 flex flex-col items-center min-w-[80px]">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Total PRs</span>
              <span className="text-base font-black text-white mt-0.5">{stats.total}</span>
            </div>
            <div className="bg-[#121221]/50 border border-zinc-800 rounded-2xl px-4 py-2 flex flex-col items-center min-w-[80px]">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Merged</span>
              <span className="text-base font-black text-violet-400 mt-0.5">{stats.merged}</span>
            </div>
            <div className="bg-[#121221]/50 border border-zinc-800 rounded-2xl px-4 py-2 flex flex-col items-center min-w-[80px]">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Orgs</span>
              <span className="text-base font-black text-white mt-0.5">{stats.orgsCount}</span>
            </div>
          </div>
        </div>

        <div className="relative mt-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title, repo, or tech stack…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050508] border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — built dynamically from real PR data */}
        <div className="w-52 border-r border-zinc-800/80 bg-[#06060c] flex flex-col p-3 gap-1 select-none shrink-0 overflow-y-auto">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-2 mb-1">Filter by org</span>

          {/* All */}
          <button
            onClick={() => setSelectedOrg("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              selectedOrg === "all"
                ? "bg-zinc-900/40 text-white border border-zinc-700/60"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
              <span>All contributions</span>
            </div>
            <span className="text-[10px] opacity-60 font-mono">{prs.length}</span>
          </button>

          {/* Per-org entries */}
          {orgSidebarList.map(([orgId, { name, count }]) => {
            const colors = getOrgColor(orgId);
            return (
              <button
                key={orgId}
                onClick={() => setSelectedOrg(orgId)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedOrg === orgId
                    ? "bg-zinc-900/40 text-white border border-zinc-700/60"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors.text }} />
                  <span className="truncate">{name}</span>
                </div>
                <span className="text-[10px] opacity-60 font-mono shrink-0 ml-1">{count}</span>
              </button>
            );
          })}
        </div>

        {/* PR list */}
        <div className="flex-1 overflow-y-auto bg-[#040408] p-5 relative">
          <div className="absolute left-7 top-0 bottom-0 w-px bg-zinc-900 pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-zinc-600 text-xs py-16 font-mono select-none"
                >
                  No contributions match the current filter.
                </motion.div>
              ) : (
                filtered.map((pr, idx) => {
                  const colors = getOrgColor(pr.org);
                  return (
                    <motion.div
                      key={`${pr.repo}#${pr.number}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18, delay: Math.min(idx * 0.015, 0.3) }}
                      className="flex gap-4 relative group"
                    >
                      {/* Timeline node */}
                      <div className="w-5 h-5 rounded-full bg-[#08080f] border border-zinc-800 flex items-center justify-center shrink-0 z-10 mt-1">
                        {pr.status === "merged" ? (
                          <GitMerge size={9} className="text-violet-400" />
                        ) : (
                          <GitPullRequest size={9} className="text-emerald-400" />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 bg-zinc-950/20 border border-zinc-800/60 hover:border-zinc-700/60 hover:bg-zinc-900/10 transition-all rounded-xl p-4 space-y-3 relative overflow-hidden"
                      >
                        <div
                          className="absolute -right-10 -top-10 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ background: colors.glow }}
                        />

                        {/* Row 1: repo + org badge */}
                        <div className="flex items-center justify-between gap-2 select-none">
                          <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase truncate">
                            {pr.repo}
                          </span>
                          <span
                            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0"
                            style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                          >
                            {pr.orgLabel}
                          </span>
                        </div>

                        {/* Row 2: title + PR number + status badge */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-white leading-snug group-hover:text-violet-300 transition-colors">
                            {pr.title}
                            <span className="text-zinc-500 font-mono font-normal text-xs ml-1.5">#{pr.number}</span>
                          </h3>
                          <span
                            className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                              pr.status === "merged"
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {pr.status}
                          </span>
                        </div>

                        {/* Row 3: description */}
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {pr.description}
                        </p>

                        {/* Row 4: tech tags + link */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex flex-wrap gap-1.5 select-none">
                            {pr.tech.map((t, i) => (
                              <span key={i} className="text-[9px] font-mono bg-zinc-900/60 text-zinc-400 border border-zinc-800/40 px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                          <a
                            href={pr.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] font-bold font-mono text-zinc-500 hover:text-white transition-colors shrink-0"
                          >
                            View PR
                            <ExternalLink size={9} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
