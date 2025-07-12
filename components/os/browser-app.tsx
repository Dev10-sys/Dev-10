"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft, ArrowRight, RotateCw, X, Globe,
  ExternalLink, Search, Lock, Loader2, AlertTriangle
} from "lucide-react";

type LoadStatus = "idle" | "loading" | "loaded" | "blocked";

function parseUrl(raw: string): { url: string; isSearch: boolean } {
  raw = raw.trim();
  if (!raw) return { url: "", isSearch: false };
  if (/^https?:\/\//i.test(raw)) return { url: raw, isSearch: false };
  const domainLike = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/|$|:|\?)/;
  const simpleDomain = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  if (domainLike.test(raw) || simpleDomain.test(raw)) return { url: "https://" + raw, isSearch: false };
  return { url: `https://www.google.com/search?q=${encodeURIComponent(raw)}`, isSearch: true };
}

function extractYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname === "/watch") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&rel=0`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (u.pathname.startsWith("/embed/")) return url;
  } catch { }
  return null;
}

function FaviconIcon({ domain, size = 16 }: { domain: string; size?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return error ? (
    <Globe size={size} className="text-white/40" />
  ) : (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt=""
      width={size}
      height={size}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={`transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

interface HistoryEntry {
  src: string;       // actual iframe src
  displayUrl: string;
  isYoutube?: boolean;
}

const QUICK_LINKS = [
  { label: "GitHub",       url: "https://github.com/Dev10-sys",          domain: "github.com" },
  { label: "YouTube",      url: "https://www.youtube.com",               domain: "youtube.com" },
  { label: "Wikipedia",    url: "https://en.wikipedia.org/wiki/Main_Page", domain: "wikipedia.org" },
  { label: "LinkedIn",     url: "https://linkedin.com",                  domain: "linkedin.com" },
  { label: "Dev.to",       url: "https://dev.to",                        domain: "dev.to" },
  { label: "MDN Web Docs", url: "https://developer.mozilla.org",         domain: "developer.mozilla.org" },
  { label: "Stack Overflow", url: "https://stackoverflow.com",           domain: "stackoverflow.com" },
  { label: "Hacker News", url: "https://news.ycombinator.com",          domain: "ycombinator.com" },
];

// Sites known to block iframe — open in new tab immediately
const BLOCKED_DOMAINS = new Set([
  "github.com", "google.com", "accounts.google.com",
  "www.google.com", "twitter.com", "x.com", "facebook.com",
  "instagram.com", "tiktok.com", "netflix.com", "twitch.tv",
  "linkedin.com", "www.linkedin.com",
]);

function isKnownBlocked(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return BLOCKED_DOMAINS.has(hostname) || BLOCKED_DOMAINS.has("www." + hostname);
  } catch { return false; }
}

export function BrowserApp() {
  const [urlInput, setUrlInput] = useState("https://en.wikipedia.org/wiki/Main_Page");
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [currentDisplayUrl, setCurrentDisplayUrl] = useState("about:newtab");
  const [urlFocused, setUrlFocused] = useState(false);
  const [isYoutubeEmbed, setIsYoutubeEmbed] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [isOffline, setIsOffline] = useState(false);

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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback((rawUrl: string) => {
    const { url: parsed, isSearch } = parseUrl(rawUrl);
    if (!parsed) return;

    // Search queries: open Google in real browser tab since Google blocks iframe
    if (isSearch) {
      window.open(parsed, "_blank");
      return;
    }

    // Known blocked sites: open in real tab immediately
    if (isKnownBlocked(parsed)) {
      window.open(parsed, "_blank");
      return;
    }

    const ytEmbed = extractYouTubeEmbedUrl(parsed);
    const finalSrc = ytEmbed || parsed;
    const isYt = !!ytEmbed;

    setStatus("loading");
    setIframeSrc(finalSrc);
    setCurrentDisplayUrl(parsed);
    setUrlInput(parsed);
    setIsYoutubeEmbed(isYt);

    setHistory(prev => {
      const newHistory = prev.slice(0, histIdx + 1);
      newHistory.push({ src: finalSrc, displayUrl: parsed, isYoutube: isYt });
      setHistIdx(newHistory.length - 1);
      return newHistory;
    });

    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setStatus(prev => prev === "loading" ? "blocked" : prev);
    }, 10000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [histIdx]);

  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // Listen for global 'browser-navigate' events
  useEffect(() => {
    const handler = (e: Event) => {
      const url = (e as CustomEvent).detail?.url;
      if (url) navigateRef.current(url);
    };
    window.addEventListener("browser-navigate", handler);
    return () => window.removeEventListener("browser-navigate", handler);
  }, []);

  const handleBack = () => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      const entry = history[newIdx];
      setHistIdx(newIdx);
      setIframeSrc(entry.src);
      setCurrentDisplayUrl(entry.displayUrl);
      setUrlInput(entry.displayUrl);
      setIsYoutubeEmbed(!!entry.isYoutube);
      setStatus("loading");
    }
  };

  const handleForward = () => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      const entry = history[newIdx];
      setHistIdx(newIdx);
      setIframeSrc(entry.src);
      setCurrentDisplayUrl(entry.displayUrl);
      setUrlInput(entry.displayUrl);
      setIsYoutubeEmbed(!!entry.isYoutube);
      setStatus("loading");
    }
  };

  const handleRefresh = () => {
    if (!iframeSrc) return;
    setStatus("loading");
    const src = iframeSrc;
    setIframeSrc(null);
    setTimeout(() => setIframeSrc(src), 50);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setStatus(prev => prev === "loading" ? "blocked" : prev);
    }, 10000);
  };

  const handleIframeLoad = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    try {
      const loc = iframeRef.current?.contentWindow?.location?.href;
      setStatus(!loc || loc === "about:blank" ? "blocked" : "loaded");
    } catch {
      setStatus("loaded"); // cross-origin = loaded fine
    }
  };

  const handleIframeError = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setStatus("blocked");
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    urlInputRef.current?.blur();
    setUrlFocused(false);
    navigate(urlInput);
  };

  const openInNewTab = () => window.open(currentDisplayUrl, "_blank");

  const isHttps = currentDisplayUrl.startsWith("https://");
  const displayDomain = currentDisplayUrl.replace(/^https?:\/\//, "").split("/")[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    // Open Google search in real browser tab
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#181a1b" }}>
      {/* Browser chrome / toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0 border-b"
        style={{ background: "#252628", borderColor: "#3a3c3e" }}
      >
        {/* Nav buttons */}
        <button
          onClick={handleBack}
          disabled={histIdx <= 0}
          className="p-1.5 rounded-full transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#c9cdd4" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <ArrowLeft size={15} />
        </button>
        <button
          onClick={handleForward}
          disabled={histIdx >= history.length - 1}
          className="p-1.5 rounded-full transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#c9cdd4" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <ArrowRight size={15} />
        </button>
        <button
          onClick={handleRefresh}
          disabled={!iframeSrc}
          className="p-1.5 rounded-full transition-colors disabled:opacity-25"
          style={{ color: "#c9cdd4" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {status === "loading" ? <X size={15} /> : <RotateCw size={15} />}
        </button>

        {/* URL bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all"
            style={{
              background: "#303235",
              border: urlFocused ? "1px solid #8ab4f8" : "1px solid transparent",
            }}
          >
            {/* Protocol / favicon */}
            <div className="shrink-0 flex items-center">
              {iframeSrc && status === "loaded" ? (
                <FaviconIcon domain={displayDomain} size={13} />
              ) : isHttps ? (
                <Lock size={12} style={{ color: "#81c995" }} />
              ) : (
                <Globe size={12} style={{ color: "rgba(255,255,255,0.35)" }} />
              )}
            </div>
            <input
              ref={urlInputRef}
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onFocus={() => { setUrlFocused(true); urlInputRef.current?.select(); }}
              onBlur={() => setUrlFocused(false)}
              className="flex-1 bg-transparent outline-none font-mono"
              style={{ fontSize: 13, color: "#e8eaed", caretColor: "#8ab4f8" }}
              placeholder="Search or enter URL — YouTube & Wikipedia load inside"
              spellCheck={false}
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput("")}
                className="p-0.5 rounded-full transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                <X size={11} />
              </button>
            )}
            <button type="submit" className="p-0.5" style={{ color: "#8ab4f8" }}>
              <Search size={11} />
            </button>
          </div>
        </form>

        {/* Open in real tab */}
        <button
          onClick={openInNewTab}
          title="Open in real browser tab"
          className="p-1.5 rounded-full transition-colors"
          style={{ color: "rgba(255,255,255,0.45)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e8eaed")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Progress bar */}
      {status === "loading" && (
        <div className="h-0.5 shrink-0 overflow-hidden" style={{ background: "#303235" }}>
          <div
            className="h-full"
            style={{
              background: "linear-gradient(90deg, #4285f4, #8ab4f8)",
              animation: "browser-progress 2.2s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Chrome Offline Page */}
        {isOffline && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-25 gap-4 px-8 text-left"
            style={{ background: "#202124" }}
          >
            <div className="max-w-md w-full">
              <div className="text-4xl mb-4 select-none">🦖</div>
              <h2 className="text-xl font-semibold mb-2 text-white">
                No internet
              </h2>
              <p className="text-sm mb-4 text-zinc-400">
                Try:
              </p>
              <ul className="text-sm list-disc pl-5 mb-6 space-y-1 text-zinc-400">
                <li>Checking the network cables, modem, and router</li>
                <li>Reconnecting to Wi-Fi inside the Control Center</li>
              </ul>
              <p className="text-xs text-zinc-600">
                ERR_INTERNET_DISCONNECTED
              </p>
            </div>
          </div>
        )}

        {/* New Tab Page */}
        {status === "idle" && !iframeSrc && (
          <div
            className="absolute inset-0 flex flex-col items-center pt-14 px-6 overflow-y-auto"
            style={{ background: "#202124" }}
          >
            {/* Google logo */}
            <div className="text-5xl font-black tracking-tight mb-7 select-none">
              <span style={{ color: "#4285f4" }}>G</span>
              <span style={{ color: "#ea4335" }}>o</span>
              <span style={{ color: "#fbbc05" }}>o</span>
              <span style={{ color: "#4285f4" }}>g</span>
              <span style={{ color: "#34a853" }}>l</span>
              <span style={{ color: "#ea4335" }}>e</span>
            </div>

            {/* Search bar → opens Google in real tab */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-10">
              <div
                className="flex items-center gap-3 rounded-full px-5 py-3 transition-all"
                style={{
                  background: "#303134",
                  border: "1px solid #5f6368",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.3)",
                }}
              >
                <Search size={16} style={{ color: "#9aa0a6", flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 15, color: "#e8eaed" }}
                  placeholder="Search Google"
                  autoFocus
                />
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  type="submit"
                  className="px-5 py-2 rounded text-sm transition-colors"
                  style={{ background: "#303134", color: "#e8eaed", border: "1px solid transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#5f6368")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
                >
                  Google Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (searchInput.trim()) {
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchInput)}&btnI=1`, "_blank");
                    }
                  }}
                  className="px-5 py-2 rounded text-sm transition-colors"
                  style={{ background: "#303134", color: "#e8eaed", border: "1px solid transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#5f6368")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
                >
                  I&apos;m Feeling Lucky
                </button>
              </div>
            </form>

            {/* Quick links — no emojis, real favicons */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
              {QUICK_LINKS.map(link => (
                <button
                  key={link.url}
                  onClick={() => navigate(link.url)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors group"
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: "#303134" }}
                  >
                    <FaviconIcon domain={link.domain} size={20} />
                  </div>
                  <span className="text-[11px] text-center leading-tight" style={{ color: "#9aa0a6" }}>
                    {link.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs mt-8 opacity-40" style={{ color: "#9aa0a6" }}>
              YouTube &amp; Wikipedia load inside this browser · Other sites open in a real tab
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {status === "loading" && iframeSrc && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3"
            style={{ background: "#202124" }}
          >
            <Loader2 size={28} className="animate-spin" style={{ color: "#8ab4f8" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Loading {displayDomain}...
            </p>
          </div>
        )}

        {/* Blocked page — Chrome ERR_BLOCKED_BY_RESPONSE style */}
        {status === "blocked" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4 px-8 text-center"
            style={{ background: "#202124" }}
          >
            <AlertTriangle size={52} style={{ color: "#ea4335", opacity: 0.8 }} />
            <div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "#e8eaed" }}>
                This site can&apos;t be embedded
              </h2>
              <p className="text-sm mb-1" style={{ color: "#9aa0a6" }}>
                <span className="font-mono" style={{ color: "#8ab4f8" }}>{displayDomain}</span>
                {" "}has blocked embedding for security reasons.
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                ERR_BLOCKED_BY_RESPONSE · X-Frame-Options: SAMEORIGIN
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={openInNewTab}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
                style={{ background: "#8ab4f8", color: "#202124" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#aecbfa")}
                onMouseLeave={e => (e.currentTarget.style.background = "#8ab4f8")}
              >
                <ExternalLink size={14} />
                Open in New Tab
              </button>
              <button
                onClick={() => { setStatus("idle"); setIframeSrc(null); setCurrentDisplayUrl("about:newtab"); setUrlInput(""); }}
                className="px-5 py-2.5 rounded-full text-sm transition-colors"
                style={{ background: "#303134", color: "#9aa0a6", border: "1px solid #5f6368" }}
              >
                New Tab
              </button>
            </div>
          </div>
        )}

        {/* Iframe */}
        {iframeSrc && (
          <iframe
            ref={iframeRef}
            key={iframeSrc}
            src={iframeSrc}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="absolute inset-0 w-full h-full border-none transition-opacity duration-300"
            style={{ opacity: status === "loaded" ? 1 : 0 }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation allow-pointer-lock"
            allow="camera *; microphone *; autoplay *; fullscreen *; payment *; accelerometer *; gyroscope *; clipboard-write *"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      <style>{`
        @keyframes browser-progress {
          0%   { width: 0%;   margin-left: 0%; }
          40%  { width: 60%;  margin-left: 20%; }
          70%  { width: 30%;  margin-left: 60%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
