"use client";

import { useState, useRef, useEffect } from "react";

type LogEntry = {
  command: string;
  output: React.ReactNode;
};

type ThemeKey = "classic" | "amber" | "matrix" | "cyan" | "white";

export function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogEntry[]>([
    {
      command: "system --boot",
      output: (
        <div className="space-y-1">
          <div className="text-zinc-500">Initializing Dev's Terminal Environment...</div>
          <div className="text-zinc-400">Loading system modules: React [OK], NextJS [OK], Framer Motion [OK].</div>
          <div className="text-zinc-500 text-[10px]">Head: 6d411817f3e315424a9da68b032938025d536367</div>
          <div className="text-green-500 font-bold mt-1">System ready. Type 'help' to list available commands.</div>
        </div>
      )
    }
  ]);
  
  const [theme, setTheme] = useState<ThemeKey>("classic");
  const [sudoMode, setSudoMode] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingTarget, setPingTarget] = useState("");

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const focusTerminal = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    if (pinging) return;

    let output: React.ReactNode = "";
    const parts = cmd.split(" ");
    const baseCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    if (sudoMode) {
      setSudoMode(false);
      output = (
        <div className="text-green-400 font-mono">
          <div>[sudo] access granted for developer group.</div>
          <div>Initializing root operations... OK.</div>
        </div>
      );
      setHistory((prev) => [...prev, { command: "*******", output }]);
      setInput("");
      return;
    }

    switch (baseCmd) {
      case "help":
        output = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-zinc-300 font-mono">
            <div><span className="text-emerald-400 font-bold">whoami</span> - Developer profile summary</div>
            <div><span className="text-emerald-400 font-bold">neofetch</span> - System specs & ASCII logo</div>
            <div><span className="text-emerald-400 font-bold">ls</span> - List virtual files & logs</div>
            <div><span className="text-emerald-400 font-bold">cat [file]</span> - Render file contents</div>
            <div><span className="text-emerald-400 font-bold">git log</span> - View recent repository commits</div>
            <div><span className="text-emerald-400 font-bold">ping [host]</span> - Test latency parameters</div>
            <div><span className="text-emerald-400 font-bold">theme [color]</span> - Set skin (classic, amber, matrix, cyan, white)</div>
            <div><span className="text-emerald-400 font-bold">date</span> - Print user local timestamp</div>
            <div><span className="text-emerald-400 font-bold">sudo [cmd]</span> - Execute privileged command</div>
            <div><span className="text-emerald-400 font-bold">clear</span> - Clear history buffer</div>
          </div>
        );
      case "whoami":
        output = (
          <div className="text-zinc-300 font-mono space-y-1">
            <div><span className="text-emerald-400 font-bold">User:</span> Dev (Dev10-sys)</div>
            <div><span className="text-emerald-400 font-bold">Role:</span> Open Source Systems Engineer</div>
            <div><span className="text-emerald-400 font-bold">Focus:</span> Display Compositors (Wayland/GTK4), Ethereum Tooling (Web3j), Supply Chain Security (SBOMit)</div>
            <div><span className="text-emerald-400 font-bold">Status:</span> Coding...</div>
          </div>
        );
        break;
      case "neofetch": {
        const uptimeStr = typeof window !== "undefined" ? 
          (() => {
            const upSecs = Math.floor(performance.now() / 1000);
            const m = Math.floor(upSecs / 60);
            const s = upSecs % 60;
            return m > 0 ? `${m}m ${s}s` : `${s}s`;
          })() : "0s";
          
        const getOS = () => {
          if (typeof navigator === "undefined") return "Unknown";
          const ua = navigator.userAgent;
          if (ua.includes("Win")) return "Windows";
          if (ua.includes("Mac")) return "macOS";
          if (ua.includes("Linux")) return "Linux";
          if (ua.includes("Android")) return "Android";
          if (ua.includes("iOS")) return "iOS";
          return "Casilda Desktop Environment (v10.0)"; // Fallback
        };

        const mem = typeof navigator !== "undefined" && (navigator as any).deviceMemory 
          ? `${(navigator as any).deviceMemory} GB+` 
          : "Unknown";

        const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : "Unknown";

        output = (
          <div className="flex flex-col md:flex-row gap-6 font-mono leading-relaxed text-xs">
            <pre className="text-emerald-500 font-bold hidden md:block">
{`      /\\
     /  \\
    /\\   \\
   /  \\   \\
  /    \\   \\
 /______\\   \\
/        \\   \\
/__________\\___\\`}
            </pre>
            <div className="space-y-0.5 text-zinc-300">
              <div className="text-emerald-400 font-black">dev10-sys@ubuntu</div>
              <div className="text-zinc-500">----------------</div>
              <div><span className="text-emerald-400 font-bold">OS:</span> {getOS()} Web Engine</div>
              <div><span className="text-emerald-400 font-bold">Host:</span> {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Browser'}</div>
              <div><span className="text-emerald-400 font-bold">Cores:</span> {cores} Logical Processors</div>
              <div><span className="text-emerald-400 font-bold">Uptime:</span> {uptimeStr}</div>
              <div><span className="text-emerald-400 font-bold">Resolution:</span> {typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "1536x730"}</div>
              <div><span className="text-emerald-400 font-bold">Shell:</span> dev-sh v1.2</div>
              <div><span className="text-emerald-400 font-bold">Theme:</span> {theme.toUpperCase()}</div>
              <div><span className="text-emerald-400 font-bold">Language:</span> {typeof navigator !== "undefined" ? navigator.language : "en-US"}</div>
              <div><span className="text-emerald-400 font-bold">Memory:</span> {mem} Allocated (Browser Limit)</div>
            </div>
          </div>
        );
        break;
      }
      case "ls":
        output = (
          <div className="flex flex-wrap gap-4 text-emerald-400 font-bold font-mono">
            <span>about.md</span>
            <span>projects.json</span>
            <span>github_prs.txt</span>
            <span>secret.sh</span>
            <span>resume.pdf</span>
          </div>
        );
        break;
      case "cat":
        if (!arg) {
          output = <span className="text-red-400 font-mono">Error: cat expects a file name. Usage: cat [file]</span>;
        } else if (arg === "about.md") {
          output = (
            <div className="text-zinc-300 leading-relaxed font-mono">
              # About Dev10-sys
              Systems engineer specializing in display compositors (Wayland, GTK4), Ethereum library compilers (Web3j), and secure container supply chain architectures (SBOMit).
            </div>
          );
        } else if (arg === "projects.json") {
          output = (
            <div className="text-zinc-300 font-mono space-y-1">
              {"["}
              <div className="pl-4">{"{ \"name\": \"OpenSSF tooling\", \"type\": \"Security Infrastructure\" },"}</div>
              <div className="pl-4">{"{ \"name\": \"Hyperledger Identus\", \"type\": \"Digital Identity SDK\" },"}</div>
              <div className="pl-4">{"{ \"name\": \"Casilda OS\", \"type\": \"Web Desktop Environment\" }"}</div>
              {"]"}
            </div>
          );
        } else if (arg === "github_prs.txt") {
          output = (
            <div className="text-zinc-300 font-mono space-y-1">
              <div>- <span className="text-purple-400 font-bold">[Merged]</span> web3j/web3j - Fixed core dependencies & ABI encoders</div>
              <div>- <span className="text-purple-400 font-bold">[Merged]</span> sugarlabs/sugar-toolkit-gtk4 - GTK4 bindings migration</div>
              <div>- <span className="text-purple-400 font-bold">[Merged]</span> LFX Mentee - Core infrastructure updates</div>
            </div>
          );
        } else if (arg === "secret.sh") {
          output = (
            <div className="text-yellow-500 font-mono space-y-1">
              <div>$ echo "Coffee input -> Code output"</div>
              <div>(c[_] )  --&gt;  [  Systems Code  ]</div>
            </div>
          );
        } else if (arg === "resume.pdf") {
          output = <span className="text-blue-400 font-mono">resume.pdf is a binary file. Use the 'resume' shortcut on the desktop to download.</span>;
        } else {
          output = <span className="text-red-400 font-mono">Error: File '{arg}' not found. Type 'ls' to see files.</span>;
        }
        break;
      case "git":
        if (arg === "log") {
          output = (
            <div className="space-y-3 text-zinc-300 font-mono">
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-yellow-500 font-bold">commit b649c5ad8438ea52e638c3c7d9bf26e4277b7e94</div>
                <div>Author: Dev10-sys &lt;dev10.sys@gmail.com&gt;</div>
                <div className="text-zinc-500">Date:   Wed Jul 15 03:26:59 2026 +0530</div>
                <div className="text-white mt-1">terminal: make neofetch dynamic based on real browser hardware APIs</div>
              </div>
              <div className="border-l-2 border-zinc-700 pl-3">
                <div className="text-yellow-500/80 font-bold">commit 56fb293f1628d617555a46cc7a14c00e933ca640</div>
                <div>Author: Dev10-sys &lt;dev10.sys@gmail.com&gt;</div>
                <div className="text-zinc-500">Date:   Wed Jul 15 03:26:18 2026 +0530</div>
                <div className="text-white/80 mt-1">terminal: make ping fully real and dynamic based on network latency</div>
              </div>
            </div>
          );
        } else {
          output = <span className="text-zinc-500 font-mono">Usage: git log</span>;
        }
        break;
      case "date": {
        const localDate = new Date();
        output = (
          <div className="text-zinc-300 font-mono">
            {localDate.toString()}
          </div>
        );
        break;
      }
      case "theme":
        if (["classic", "amber", "matrix", "cyan", "white"].includes(arg.toLowerCase())) {
          setTheme(arg.toLowerCase() as ThemeKey);
          output = <span className="text-zinc-300 font-mono">Terminal theme updated to {arg}.</span>;
        } else {
          output = <span className="text-red-400 font-mono">Usage: theme [classic | amber | matrix | cyan | white]</span>;
        }
        break;
      case "sudo":
        setSudoMode(true);
        output = <span className="text-zinc-400 font-mono">[sudo] password for dev10-sys: </span>;
        break;
      case "ping":
        if (!arg) {
          output = <span className="text-red-400 font-mono">Usage: ping [host] (e.g. ping google.com)</span>;
        } else {
          setPinging(true);
          setPingTarget(arg);
          setInput("");
          return;
        }
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        output = <span className="text-red-400 font-mono">Command not found: '{baseCmd}'. Type 'help' for options.</span>;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInput("");
  };

  useEffect(() => {
    if (!pinging) return;

    let count = 0;
    let latencies: number[] = [];
    
    // Validate target (basic domain check)
    const targetUrl = pingTarget.startsWith('http') ? pingTarget : `https://${pingTarget}`;
    let ip = "142.250.190.46"; // Fallback pseudo IP

    const doPing = async () => {
      const startTime = performance.now();
      try {
        await fetch(targetUrl, { mode: 'no-cors', cache: 'no-cache' });
      } catch (e) {
        // Even if it fails (CORS, offline), we measure the time it took to fail
      }
      const endTime = performance.now();
      const latency = (endTime - startTime).toFixed(1);
      latencies.push(Number(latency));

      const pingLine = (
        <div className="text-zinc-300 font-mono">
          64 bytes from {pingTarget}: icmp_seq={count + 1} ttl=116 time={latency} ms
        </div>
      );

      setHistory((prev) => {
        if (count === 0) {
          return [
            ...prev,
            {
              command: `ping ${pingTarget}`,
              output: (
                <div className="space-y-1">
                  <div className="text-zinc-400">PING {pingTarget} ({ip}) 56(84) bytes of data.</div>
                  {pingLine}
                </div>
              )
            }
          ];
        }
        return [...prev, { command: "", output: pingLine }];
      });

      count++;
      if (count >= 4) {
        setPinging(false);
        const min = Math.min(...latencies).toFixed(1);
        const max = Math.max(...latencies).toFixed(1);
        const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
        
        setHistory((prev) => [
          ...prev,
          {
            command: "",
            output: (
              <div className="text-zinc-400 font-mono mt-1">
                --- {pingTarget} ping statistics ---<br/>
                4 packets transmitted, 4 received, 0% packet loss, time {(latencies.reduce((a, b) => a + b, 0)).toFixed(0)}ms<br/>
                rtt min/avg/max = {min}/{avg}/{max} ms
              </div>
            )
          }
        ]);
      } else {
        setTimeout(doPing, 1000);
      }
    };

    doPing();
  }, [pinging, pingTarget]);

  const themeColors: Record<ThemeKey, { text: string; bg: string; border: string; prompt: string }> = {
    classic: { text: "text-emerald-400", bg: "bg-black/95", border: "border-emerald-500/20", prompt: "text-white" },
    amber: { text: "text-amber-500", bg: "bg-[#180f05]/98", border: "border-amber-500/20", prompt: "text-amber-200" },
    matrix: { text: "text-[#00ff00]", bg: "bg-[#030a03]/98", border: "border-[#00ff00]/20", prompt: "text-[#00cc00]" },
    cyan: { text: "text-cyan-400", bg: "bg-[#051015]/98", border: "border-cyan-500/20", prompt: "text-white" },
    white: { text: "text-slate-100", bg: "bg-[#18181c]/98", border: "border-zinc-700/50", prompt: "text-zinc-400" }
  };

  const activeTheme = themeColors[theme];

  return (
    <div 
      onClick={focusTerminal}
      className={`h-full ${activeTheme.bg} ${activeTheme.text} font-mono text-[11px] p-4 flex flex-col overflow-hidden select-text border-t ${activeTheme.border}`}
    >
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.map((entry, index) => (
          <div key={index} className="space-y-1.5">
            {entry.command && (
              <div className="flex items-center gap-1.5 text-white/95 select-none">
                <span className={activeTheme.prompt}>dev10-sys@ubuntu:~$</span>
                <span className="font-semibold">{entry.command}</span>
              </div>
            )}
            <div className="pl-3 text-zinc-300 whitespace-pre-wrap">{entry.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-zinc-900 pt-3 mt-2 shrink-0 select-none">
        <span className={`${activeTheme.prompt} shrink-0`}>dev10-sys@ubuntu:~$</span>
        <input
          ref={inputRef}
          type={sudoMode ? "password" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pinging}
          className={`flex-1 bg-transparent border-none outline-none font-mono text-[11px] focus:ring-0 focus:border-transparent p-0 ${activeTheme.text}`}
          autoFocus
          placeholder={pinging ? "Ping operational..." : sudoMode ? "Enter password..." : "Type help, neofetch, ls, git log..."}
        />
      </form>
    </div>
  );
}
