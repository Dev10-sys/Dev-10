"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, ArrowLeft, Terminal, Cpu, ShieldCheck, GitCommit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Blog = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  content: React.ReactNode;
};

export function Blogs() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const blogs: Blog[] = [
    {
      id: "web3j",
      title: "Reading the Web3j Codebase",
      subtitle: "What I Learned About Ethereum Transactions",
      date: "Jan 12, 2026",
      readTime: "9 min read",
      tags: ["Ethereum", "Java", "RLP", "EIP-4844", "Blockchain"],
      summary: "A walkthrough of how transactions actually work inside a Java Ethereum library, and the bugs I fixed along the way.",
      content: (
        <div className="space-y-6 text-zinc-300 font-sans leading-relaxed">
          <p className="text-lg text-zinc-200 font-medium font-sans">
            Most developers who work with Ethereum from Java use Web3j but never really open the jar. You call <code className="text-primary bg-zinc-900 px-1.5 py-0.5 rounded font-mono text-sm">contract.transfer(...).send()</code>, it works, and you move on. I was the same for a while.
          </p>
          <p className="font-sans">
            Then I started preparing for the LFDT Web3j mentorship project under the Linux Foundation Decentralized Trust program. The mentorship is about maintaining and improving the Web3j library itself. Specifically, keeping it compatible with the latest Ethereum Improvement Proposals (EIPs), fixing bugs, and generally helping the maintainers who do not have enough time to do all of this alone.
          </p>
          <p className="font-sans">
            So I had to actually understand the library. Not just use it. I had to understand what happens between the line of Java code you write and the moment a transaction lands on the Ethereum network.
          </p>

          {/* Architecture Diagram */}
          <div className="my-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 text-center">Web3j Architecture & Module Stacking</h4>
            <div className="flex flex-col items-center gap-4">
              <div className="px-6 py-2 bg-primary/20 border border-primary text-primary font-bold rounded-lg text-sm text-center w-full max-w-sm shadow-[0_0_15px_rgba(247,147,26,0.1)]">
                Application Code (Smart Contract Wrappers)
              </div>
              <div className="w-px h-6 bg-zinc-700" />
              <div className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg text-sm text-center w-full max-w-sm font-bold">
                web3j-core (Core Client Method Coordinator)
              </div>
              <div className="w-px h-6 bg-zinc-700" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-2xl text-xs font-mono text-center">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                  <span className="text-primary font-bold">web3j-abi</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Smart Contract Call Encoding</p>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                  <span className="text-primary font-bold">web3j-rlp</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Byte Serialization Protocol</p>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                  <span className="text-primary font-bold">web3j-crypto</span>
                  <p className="text-[10px] text-zinc-500 mt-1">ECDSA Signing (Keys & Sign)</p>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                  <span className="text-primary font-bold">web3j-protocol</span>
                  <p className="text-[10px] text-zinc-500 mt-1">JSON-RPC / Web Sockets</p>
                </div>
              </div>
              <div className="w-px h-6 bg-zinc-700" />
              <div className="px-6 py-2 bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono rounded-lg text-xs text-center w-full max-w-sm">
                JSON-RPC over HTTP (e.g., Infura, Alchemy, Local Geth Node)
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2 font-sans">
            <Cpu className="w-5 h-5 text-primary" /> How a Transaction Actually Works Inside Web3j
          </h3>
          <ol className="list-decimal list-inside space-y-3 pl-2 font-sans">
            <li><span className="font-bold text-zinc-200">The contract call:</span> You trigger wrapper code like <code className="text-primary bg-zinc-950 px-1 py-0.5 rounded font-mono">token.transfer(to, amount).send()</code>.</li>
            <li><span className="font-bold text-zinc-200">ABI encoding:</span> <code className="text-zinc-200 font-mono">FunctionEncoder</code> compiles the call into a hex string (4-byte selector + 32-byte padded arguments).</li>
            <li><span className="font-bold text-zinc-200">Raw transaction build:</span> <code className="text-zinc-200 font-mono">RawTransaction.createTransaction()</code> is built with parameters (nonce, gas limit, target, data, value).</li>
            <li><span className="font-bold text-zinc-200">Signing:</span> <code className="text-zinc-200 font-mono">TransactionEncoder.signMessage()</code> hashes the RLP signing payload and applies ECDSA with the private key to compute signature coordinates <code className="font-mono text-zinc-400">r, s, v</code>.</li>
            <li><span className="font-bold text-zinc-200">Final encoding & broadcast:</span> Fields + signatures are RLP-encoded together and POSTed as a Hex payload to <code className="text-zinc-200 font-mono">eth_sendRawTransaction</code>.</li>
          </ol>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 font-sans">RLP Encoding: What It Is and Why It Matters</h3>
          <p className="font-sans">
            RLP stands for Recursive Length Prefix. It is the serialization mechanism Ethereum uses. In Web3j, the RLP module has two classes: <code className="font-mono text-zinc-200">RlpString</code> (for leaf bytes) and <code className="font-mono text-zinc-200">RlpList</code> (for collections).
          </p>
          <p className="font-sans">
            The trickiest part is EIP-4844 (Proto-Danksharding / Type 3 transactions). The signing payload for a Type 3 transaction includes the core fields plus <code className="font-mono text-zinc-200">blobVersionedHashes</code> but does NOT include the actual blobs, commitments, or proofs. Those go only in the final network payload! If your signing payload includes blobs, the hash fails, and the node rejects the transaction with a signature verification failure.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 font-sans">Bugs I Solved in the Upstream Library</h3>
          <div className="grid md:grid-cols-2 gap-4 my-6 font-sans">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-mono text-[10px] font-bold uppercase rounded border border-red-500/30">Memory Leak</span>
              <h5 className="font-bold text-white text-sm">Async Executor Leak</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Web3j's static ExecutorService in the Async utility class kept a reference to the classloader, preventing GC on redeploys. Exposed a clean shutdown hook in Web3j.shutdown() to terminate threads and release classloader reference.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 font-mono text-[10px] font-bold uppercase rounded border border-yellow-500/30">Protocol Fix</span>
              <h5 className="font-bold text-white text-sm">Gas Estimation for Payable Functions</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Web3j did not forward the value (ETH) field in transactions during eth_estimateGas. Simulated payable executions failed require checks due to zero value. Added full value propagation to estimation builder.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold uppercase rounded border border-orange-500/30">RLP Encoding</span>
              <h5 className="font-bold text-white text-sm">EIP-4844 Signing Mismatch</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The signing and network RLP payloads for EIP-4844 Type 3 transactions were not properly decoupled. Web3j was incorrectly signing blobs. Separated paths so that only versioned hashes are signed.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold uppercase rounded border border-purple-500/30">Type Safety</span>
              <h5 className="font-bold text-white text-sm">Raw Type Generics in EthLog</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Corrected legacy raw type generic declarations in the EthLog result parsing class, resolving compiler warnings and restoring type-safe log retrievals.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "sbomit",
      title: "Making Trivy SBOMs Verifiable",
      subtitle: "Securing Software Supply Chain with SBOMit Attestations",
      date: "Dec 08, 2025",
      readTime: "11 min read",
      tags: ["Security", "Trivy", "SBOM", "in-toto", "Witness", "Go"],
      summary: "How to connect filesystem inventories with cryptographic build-time evidence to produce verifiable supply chain records.",
      content: (
        <div className="space-y-6 text-zinc-300 font-sans leading-relaxed">
          <p className="text-lg text-zinc-200 font-medium font-sans">
            The SolarWinds attack in 2020 and XZ Utils in 2024 shared a common pattern: the compromise happened inside the build and distribution pipelines, where traditional scanning tools have zero visibility.
          </p>
          <p className="font-sans">
            Traditional SBOM (Software Bill of Materials) tools scan a final container image retroactively. They guess which packages are installed based on directories and lockfiles. But they have no provenance. They cannot answer if a package was actually downloaded during compile-time or modified afterwards.
          </p>

          {/* Pipeline Diagram */}
          <div className="my-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 text-center">Post-Scan SBOM Enrichment Pipeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs text-center font-mono">
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                <span className="text-primary font-bold">1. Build step</span>
                <p className="text-[10px] text-zinc-500 mt-1">Run witness instruments command, network, and files</p>
              </div>
              <div className="text-zinc-600 text-lg hidden md:block">→</div>
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                <span className="text-primary font-bold">2. Attestation</span>
                <p className="text-[10px] text-zinc-500 mt-1">Signed DSSE statement with hashes & traces</p>
              </div>
              <div className="text-zinc-600 text-lg hidden md:block">→</div>
              <div className="p-3 bg-primary/10 border border-primary/45 rounded-lg col-span-1 md:col-span-1">
                <span className="text-primary font-bold">3. Trivy Enrichment</span>
                <p className="text-[10px] text-zinc-400 mt-1">Matches packages + injects sbomit: properties</p>
              </div>
            </div>
            <div className="text-center text-[10px] text-zinc-500 mt-4">
              Result: An enriched CycloneDX/SPDX SBOM containing standard vulnerability data plus verifiable build-time proof.
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2 font-sans">
            <ShieldCheck className="w-5 h-5 text-primary" /> How SBOMit Solves the Provenance Gap
          </h3>
          <p className="font-sans">
            SBOMit maps the cryptographic evidence from Witness (an in-toto attestation framework) onto standard SBOM structures. Witness records:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 font-sans">
            <li><span className="font-bold text-zinc-200">Materials:</span> Hashes of all files present before the build.</li>
            <li><span className="font-bold text-zinc-200">Command-Run:</span> The exact command run and all files accessed.</li>
            <li><span className="font-bold text-zinc-200">Network-Trace:</span> Outbound URLs, IPs, DNS handshakes.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 font-sans">The Trivy Upstream Integration</h3>
          <p className="font-sans">
            I contributed to integrating SBOMit directly into Trivy (Aqua Security). The implementation runs as a <strong>post-scan enrichment layer</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2 font-sans">
            <li>Trivy scans the artifact and creates a standard package report.</li>
            <li>The enrichment hook matches Trivy's scanned packages against the attestation using a two-level matcher (first by canonical PURL, falling back to name@version).</li>
            <li>It injects custom metadata properties with the <code className="font-mono text-primary bg-zinc-950 px-1 py-0.5 rounded text-xs">sbomit:</code> namespace.</li>
            <li>Any packages that were used in the build but missed by Trivy are appended as unmatched contributions.</li>
          </ol>

          <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2 font-sans">
            <Terminal className="w-5 h-5 text-primary" /> Injected Metadata Properties
          </h3>
          <div className="overflow-x-auto border border-zinc-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono text-zinc-400">
              <thead className="bg-zinc-900/80 text-zinc-300 border-b border-zinc-800">
                <tr>
                  <th className="p-3">Property</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="p-3 text-white">sbomit:attestation-hash</td>
                  <td className="p-3">SHA256 of the Witness statement (enables verification)</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">sbomit:pip-command / sbomit:build-command</td>
                  <td className="p-3">The exact CLI command that spawned the dependency installation</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">sbomit:download-url</td>
                  <td className="p-3">Outbound URL where the module was downloaded from</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">sbomit:download-ip</td>
                  <td className="p-3">Server IP address that resolved the package download</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">sbomit:in-toto-verified</td>
                  <td className="p-3">Flag indicating structural integrity verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  const activeBlog = blogs.find((b) => b.id === selectedBlogId);

  return (
    <div className="flex h-full bg-zinc-950 text-white rounded-lg overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedBlogId === null ? (
          /* Sidebar List */
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full p-6 overflow-y-auto space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white font-sans">Dev's Blogs</h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">My deep dives and quick fixes</p>
              </div>
              <BookOpen className="w-6 h-6 text-primary" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {blogs.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => setSelectedBlogId(blog.id)}
                  className="group text-left p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-[220px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</span>
                    </div>
                    <h3 className="text-lg font-black text-zinc-100 group-hover:text-primary transition-colors leading-tight font-sans">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                      {blog.summary}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Article Content Reader */
          <motion.div
            key="reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col h-full overflow-hidden"
          >
            {/* Header Toolbar */}
            <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 justify-between shrink-0">
              <button
                onClick={() => setSelectedBlogId(null)}
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-sans"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Blogs
              </button>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 rounded font-bold uppercase">
                  Blog Reader v1.0
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
              {activeBlog && (
                <div className="space-y-6">
                  {/* Blog Meta */}
                  <div className="space-y-3 border-b border-zinc-800 pb-6">
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeBlog.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeBlog.readTime}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight font-sans">
                      {activeBlog.title}
                    </h1>
                    <p className="text-lg text-zinc-400 font-medium font-sans">
                      {activeBlog.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {activeBlog.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="pb-16">
                    {activeBlog.content}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
