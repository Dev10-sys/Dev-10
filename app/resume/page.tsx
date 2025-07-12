"use client";

export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #fff !important;
          color: #000 !important;
        }

        #resume-container {
          font-family: 'Source Serif 4', 'Georgia', 'Times New Roman', serif;
          font-size: 10pt;
          line-height: 1.35;
          color: #000;
          background: #fff;
          max-width: 210mm;
          margin: 0 auto;
          padding: 15mm 20mm;
        }

        /* Centered Name & Links */
        .header {
          text-align: center;
          margin-bottom: 14px;
        }

        .header h1 {
          font-size: 26pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }

        .contact-info {
          font-size: 8.5pt;
          color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0 6px;
        }

        .contact-info a {
          color: #000;
          text-decoration: none;
        }

        .contact-info a:hover {
          text-decoration: underline;
        }

        .pipe {
          color: #000;
          font-weight: normal;
        }

        /* Section Title (LaTeX Style) */
        .section-title {
          font-size: 10.5pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 0.8px solid #000;
          padding-bottom: 1.5px;
          margin-top: 14px;
          margin-bottom: 8px;
        }

        /* Text Block */
        .text-block {
          font-size: 9.5pt;
          text-align: justify;
          margin-bottom: 8px;
        }

        /* Experience Entry */
        .entry {
          margin-bottom: 8px;
        }

        .entry-title-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 10pt;
        }

        .entry-subtitle-row {
          display: flex;
          justify-content: space-between;
          font-style: italic;
          font-size: 9pt;
          margin-top: 1px;
          margin-bottom: 3px;
        }

        .entry-subtitle-row a {
          color: #000;
          text-decoration: none;
        }

        .entry-subtitle-row a:hover {
          text-decoration: underline;
        }

        /* List Items */
        .bullets {
          list-style: none;
          padding-left: 0;
        }

        .bullets li {
          font-size: 9pt;
          position: relative;
          padding-left: 14px;
          margin-bottom: 2px;
          text-align: justify;
        }

        .bullets li::before {
          content: "-";
          position: absolute;
          left: 0;
          top: 0;
          color: #000;
        }

        .bullets li a {
          color: #000;
          text-decoration: none;
          font-weight: 600;
        }

        .bullets li a:hover {
          text-decoration: underline;
        }

        /* Project Entry */
        .project-title-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 10pt;
          margin-top: 6px;
        }

        .project-title-row a {
          color: #000;
          text-decoration: none;
        }

        .project-title-row a:hover {
          text-decoration: underline;
        }

        .project-meta-desc {
          font-size: 9pt;
          font-style: italic;
          color: #000;
          margin-top: 1px;
          margin-bottom: 2px;
        }

        /* Technical Skills List */
        .skills-list {
          font-size: 9pt;
          line-height: 1.4;
        }

        .skill-group {
          margin-bottom: 2px;
        }

        .skill-label {
          font-weight: 700;
        }

        /* Print Button Floating */
        .print-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: system-ui, -apple-system, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .print-btn:hover {
          background: #222;
        }

        @media print {
          .print-btn {
            display: none !important;
          }
          #resume-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>
        Print / Save PDF
      </button>

      <div id="resume-container">
        
        {/* HEADER */}
        <div className="header">
          <h1>Dev</h1>
          <div className="contact-info">
            <a href="mailto:dev10.sys@gmail.com">dev10.sys@gmail.com</a>
            <span className="pipe">|</span>
            <span>+91 8077907751</span>
            <span className="pipe">|</span>
            <span>Bangalore, India</span>
            <span className="pipe">|</span>
            <a href="https://github.com/Dev10-sys" target="_blank" rel="noreferrer">Dev10-sys</a>
            <span className="pipe">|</span>
            <a href="https://linkedin.com/in/dev10-sys" target="_blank" rel="noreferrer">LinkedIn</a>
            <span className="pipe">|</span>
            <a href="https://devs-portfolio.pages.dev" target="_blank" rel="noreferrer">Dev's Portfolio</a>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="section-title">Summary</div>
        <div className="text-block">
          I am Dev, having B.Tech in Computer Science with specialization in AI/ML and a software developer focused on Web Development, blockchain infrastructure, Linux desktop internals, and open source software. Selected as a Google Summer of Code 2026 Contributor at Sugar Labs for the GTK3 to GTK4 Linux Desktop Migration Project. Also selected as an LFX Linux Foundation Mentee at LFDT Web3j for Ethereum protocol development and blockchain infrastructure contributions.
        </div>

        {/* EXPERIENCE */}
        <div className="section-title">Experience</div>

        {/* Sugar Labs */}
        <div className="entry">
          <div className="entry-title-row">
            <span>Sugar Labs : Core Desktop Environment</span>
            <span>May 2026 - Present</span>
          </div>
          <div className="entry-subtitle-row">
            <span>GSoC 2026 Contributor</span>
            <a href="https://github.com/sugarlabs/sugar/pulls?q=is%3Apr+author%3ADev10-sys" target="_blank" rel="noreferrer">sugarlabs/sugar</a>
          </div>
          <ul className="bullets">
            <li>Worked on GTK4 migration, Wayland compatibility, D-Bus lifecycle recovery, runtime GDK safety guards, clipboard handling, and Linux desktop stability improvements.</li>
            <li>Fixed multiple runtime crashes and compatibility issues affecting Sugar desktop components across GTK3/GTK4 and Wayland environments.</li>
            <li>Ported the Sugar desktop shell and optimized its display and shell migration to Wayland display server.</li>
            <li>Merged PRs: <a href="https://github.com/sugarlabs/sugar/pull/1106" target="_blank" rel="noreferrer">#1106</a>, <a href="https://github.com/sugarlabs/sugar/pull/1030" target="_blank" rel="noreferrer">#1030</a>, <a href="https://github.com/sugarlabs/sugar/pull/1059" target="_blank" rel="noreferrer">#1059</a>, <a href="https://github.com/sugarlabs/sugar/pull/1060" target="_blank" rel="noreferrer">#1060</a>, <a href="https://github.com/sugarlabs/sugar/pull/1061" target="_blank" rel="noreferrer">#1061</a>, <a href="https://github.com/sugarlabs/sugar/pull/1063" target="_blank" rel="noreferrer">#1063</a>.</li>
          </ul>
        </div>

        {/* Web3j */}
        <div className="entry">
          <div className="entry-title-row">
            <span>LFDT Web3j : Ethereum Protocol</span>
            <span>2025 - Present</span>
          </div>
          <div className="entry-subtitle-row">
            <span>LFX Linux Foundation Mentee</span>
            <a href="https://github.com/LFDT-web3j/web3j/pulls?q=is%3Apr+author%3ADev10-sys" target="_blank" rel="noreferrer">LFDT-web3j/web3j</a>
          </div>
          <ul className="bullets">
            <li>Worked on Ethereum ABI encoding, transaction signing, EIP-7594 blob transaction wrapper (Fusaka hardfork), websocket fallback systems, transaction pipeline correctness, JVM resource handling, and filter lifecycle management inside the core web3j codebase.</li>
            <li>Fixed issues involving EIP-7594 cell proof encoding and blob wrapper serialization (RLP wrapper_version + cell_proofs for Osaka/Fusaka hardfork), EIP-4844 blob transaction signing, Utf8String ABI encoding, nested dynamic array decoding, invalid address recovery, transaction receipt processor shutdown, and ABI struct code generation.</li>
            <li>Merged PRs: <a href="https://github.com/LFDT-web3j/web3j/pull/2255" target="_blank" rel="noreferrer">#2255</a>, <a href="https://github.com/LFDT-web3j/web3j/pull/2254" target="_blank" rel="noreferrer">#2254</a>, <a href="https://github.com/LFDT-web3j/web3j/pull/2257" target="_blank" rel="noreferrer">#2257</a>.</li>
            <li>Open PRs: <a href="https://github.com/LFDT-web3j/web3j/pull/2263" target="_blank" rel="noreferrer">#2263</a> (EIP-7594 Blob Wrapper), #2289, #2288, #2287, #2278, #2277, #2276, #2257, #2274, #2273, #2272.</li>
          </ul>
        </div>

        {/* OpenSSF / Hyperledger */}
        <div className="entry">
          <div className="entry-title-row">
            <span>OpenSSF / Hyperledger Ecosystem</span>
            <span>2024 - 2025</span>
          </div>
          <div className="entry-subtitle-row">
            <span>Contributor</span>
            <span>Supply Chain Security & Enterprise Ledger</span>
          </div>
          <ul className="bullets">
            <li>Contributed to OpenSSF RSTUF security infrastructure, Hyperledger Cacti, and Hyperledger Identus involving container security, deployment hardening, blockchain tooling, SDK reliability, CI workflows, and infrastructure maintenance.</li>
            <li>Merged PRs: RSTUF <a href="https://github.com/repository-service-tuf/repository-service-tuf/pull/968" target="_blank" rel="noreferrer">#968</a>, <a href="https://github.com/repository-service-tuf/repository-service-tuf/pull/950" target="_blank" rel="noreferrer">#950</a>, <a href="https://github.com/repository-service-tuf/repository-service-tuf/pull/934" target="_blank" rel="noreferrer">#934</a>, API <a href="https://github.com/repository-service-tuf/repository-service-tuf-api/pull/919" target="_blank" rel="noreferrer">#919</a>, API <a href="https://github.com/repository-service-tuf/repository-service-tuf-api/pull/916" target="_blank" rel="noreferrer">#916</a>, Worker <a href="https://github.com/repository-service-tuf/repository-service-tuf-worker/pull/854" target="_blank" rel="noreferrer">#854</a>, Worker <a href="https://github.com/repository-service-tuf/repository-service-tuf-worker/pull/850" target="_blank" rel="noreferrer">#850</a>, Helm <a href="https://github.com/repository-service-tuf/helm-charts/pull/57" target="_blank" rel="noreferrer">#57</a>, Helm <a href="https://github.com/repository-service-tuf/helm-charts/pull/56" target="_blank" rel="noreferrer">#56</a>, Cacti <a href="https://github.com/hyperledger-cacti/cacti/pull/4183" target="_blank" rel="noreferrer">#4183</a>, <a href="https://github.com/hyperledger-cacti/cacti/pull/4180" target="_blank" rel="noreferrer">#4180</a>, <a href="https://github.com/hyperledger-cacti/cacti/pull/4182" target="_blank" rel="noreferrer">#4182</a>, <a href="https://github.com/hyperledger-cacti/cacti/pull/4181" target="_blank" rel="noreferrer">#4181</a>, Identus <a href="https://github.com/hyperledger-identus/sdk-ts/pull/591" target="_blank" rel="noreferrer">#591</a>.</li>
            <li>Open PRs: Cacti <a href="https://github.com/hyperledger-cacti/cacti/pull/4179" target="_blank" rel="noreferrer">#4179</a>, <a href="https://github.com/hyperledger-cacti/cacti/pull/4176" target="_blank" rel="noreferrer">#4176</a>.</li>
          </ul>
        </div>

        {/* Chicago Pediatric Cancer Data Commons */}
        <div className="entry">
          <div className="entry-title-row">
            <span>Chicago Pediatric Cancer Data Commons</span>
            <span>2024</span>
          </div>
          <div className="entry-subtitle-row">
            <span>Contributor</span>
            <span>Healthcare Data Commons</span>
          </div>
          <ul className="bullets">
            <li>Worked on ML pipeline debugging and clinical trial matching dashboard improvements.</li>
            <li>PRs: <a href="https://github.com/chicagopcdc/Automated-Matching-of-Patients-to-Clinical-Trials/pull/4" target="_blank" rel="noreferrer">#4</a>, <a href="https://github.com/chicagopcdc/Automated-Matching-of-Patients-to-Clinical-Trials/pull/3" target="_blank" rel="noreferrer">#3</a>.</li>
          </ul>
        </div>

        {/* PROJECTS */}
        <div className="section-title">Projects</div>

        {/* BTC HashFrame */}
        <div className="entry">
          <div className="project-title-row">
            <span>
              <a href="https://github.com/Dev10-sys/btc-hashframe" target="_blank" rel="noreferrer">BTC HashFrame</a>
              <span style={{ fontWeight: 'normal' }}> : Bitcoin Encoding System</span>
            </span>
            <span><a href="https://btc-hashframe.vercel.app" target="_blank" rel="noreferrer">Live Demo</a></span>
          </div>
          <div className="project-meta-desc">Next.js, TypeScript, Cryptography, Bitcoin Infrastructure</div>
          <ul className="bullets">
            <li>Built a client-side Bitcoin encoding platform for air-gapped workflows supporting BIP39, BIP21, PSBT payloads, descriptors, and raw transaction QR generation.</li>
            <li>Designed zero-knowledge browser architecture with deterministic validation and secure export flows ensuring sensitive wallet data never leaves the local device.</li>
          </ul>
        </div>

        {/* NWC Tester */}
        <div className="entry">
          <div className="project-title-row">
            <span>
              <a href="https://github.com/Dev10-sys/nwc-tester" target="_blank" rel="noreferrer">NWC Tester</a>
              <span style={{ fontWeight: 'normal' }}> : Lightning Integration Platform</span>
            </span>
            <span><a href="https://nwc-tester.vercel.app" target="_blank" rel="noreferrer">Live Demo</a></span>
          </div>
          <div className="project-meta-desc">Next.js, TypeScript, Lightning Network, JSON-RPC</div>
          <ul className="bullets">
            <li>Developed a real-time Nostr Wallet Connect (NWC) testing platform with Lightning Network integration, wallet command execution, transaction inspection, and monitoring workflows.</li>
            <li>Integrated Bitcoin Connect and Alby SDK for secure wallet connectivity, invoice handling, payment execution, balance lookup, and responsive debugging dashboards.</li>
          </ul>
        </div>

        {/* SHINRA LABS */}
        <div className="entry">
          <div className="project-title-row">
            <span>
              <a href="https://github.com/Dev10-sys/shinra-labs" target="_blank" rel="noreferrer">SHINRA LABS</a>
              <span style={{ fontWeight: 'normal' }}> : AI Data Platform</span>
            </span>
            <span>Live Demo</span>
          </div>
          <div className="project-meta-desc">React, Supabase, PostgreSQL Distributed Workflow Systems</div>
          <ul className="bullets">
            <li>Built a production-style AI data labeling and dataset marketplace platform with scalable annotation pipelines, QA review systems, workforce routing, and realtime workflow management.</li>
            <li>Integrated Supabase backend infrastructure with authentication, storage, realtime synchronization, and structured company/freelancer dashboards inspired by enterprise AI tooling platforms.</li>
          </ul>
        </div>

        {/* VyapaarAI */}
        <div className="entry">
          <div className="project-title-row">
            <span>
              <a href="https://github.com/Dev10-sys/VyapaarAI" target="_blank" rel="noreferrer">VyapaarAI</a>
              <span style={{ fontWeight: 'normal' }}> : WhatsApp Ordering Pipeline</span>
            </span>
            <span>Live Demo</span>
          </div>
          <div className="project-meta-desc">TypeScript, Claude 3.5, Redis, BullMQ, Drizzle ORM, PDFKit</div>
          <ul className="bullets">
            <li>Built an async pipeline parsing Hinglish WhatsApp business orders into JSON structure and generating GST-compliant PDF invoices.</li>
            <li>Enforced PII redaction rules before external LLM calls, and decoupled worker scaling tiers using BullMQ and Redis.</li>
          </ul>
        </div>

        {/* TECHNICAL SKILLS */}
        <div className="section-title">Technical Skills</div>
        <div className="skills-list">
          <div className="skill-group">
            <span className="skill-label">Languages: </span>
            <span>Java, Kotlin (basic), TypeScript, JavaScript, Python, SQL, Go, C/C++, Bash</span>
          </div>
          <div className="skill-group">
            <span className="skill-label">Blockchain: </span>
            <span>Ethereum, Web3j, JSON-RPC, Smart Contract Integration, Nostr/NWC, Lightning</span>
          </div>
          <div className="skill-group">
            <span className="skill-label">Systems: </span>
            <span>Linux, Wayland, D-Bus, GTK3/GTK4, Runtime Debugging, kernel internals</span>
          </div>
          <div className="skill-group">
            <span className="skill-label">Backend / APIs: </span>
            <span>Node.js, Express, BullMQ, Redis, Spring Boot, REST APIs, Distributed Systems, Gradle</span>
          </div>
          <div className="skill-group">
            <span className="skill-label">Frontend: </span>
            <span>React, Next.js, Tailwind CSS, Vite, Framer Motion</span>
          </div>
          <div className="skill-group">
            <span className="skill-label">DevOps: </span>
            <span>Docker, Kubernetes, GitHub Actions, CI/CD, Container Security, Cloudflare Pages</span>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="section-title">Education</div>
        <div className="entry" style={{ marginBottom: 0 }}>
          <div className="entry-title-row">
            <span>B.Tech Computer Science, AI/ML Specialization</span>
            <span>2022 - 2026</span>
          </div>
          <div className="entry-subtitle-row" style={{ fontStyle: 'normal' }}>
            <span>Bangalore, India</span>
          </div>
        </div>

      </div>
    </>
  );
}
