"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Disc, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type Track = {
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  url: string;
  isProcedural: boolean;
};

export function SpotifyApp() {
  const tracks: Track[] = [
    {
      title: "Enthusiast (FMA Original)",
      artist: "Tours",
      duration: "4:36",
      bpm: 110,
      url: "/real_song.mp3",
      isProcedural: false,
    },
    {
      title: "Dev's local 8-bit synth generator",
      artist: "Procedural Web Audio API",
      duration: "Procedural",
      bpm: 76,
      url: "procedural",
      isProcedural: true,
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(60);
  const [streamDuration, setStreamDuration] = useState("0:00");
  const [streamProgress, setStreamProgress] = useState("0:00");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleNetwork = (e: Event) => {
      const customEvent = e as CustomEvent;
      const offline = !customEvent.detail.online;
      setIsOffline(offline);
      if (offline) {
        setPlaying(false);
      }
    };
    window.addEventListener("desktop-network-change", handleNetwork);
    if (typeof window !== "undefined") {
      const offline = !!(window as any).__desktopOffline;
      setIsOffline(offline);
      if (offline) setPlaying(false);
    }
    return () => window.removeEventListener("desktop-network-change", handleNetwork);
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);
  const progIntervalRef = useRef<any>(null);
  const activeTrack = tracks[activeIdx];

  // Initialize HTML5 Audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        if (audio.duration) {
          const curPercent = (audio.currentTime / audio.duration) * 100;
          setProgress(curPercent);

          const fmtTime = (seconds: number) => {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? "0" + s : s}`;
          };
          setStreamProgress(fmtTime(audio.currentTime));
          setStreamDuration(fmtTime(audio.duration));
        }
      };

      const handleTrackEnd = () => {
        handleNext();
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleTrackEnd);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleTrackEnd);
      };
    }
  }, []);

  // Update volume of audio element and sync to global desktop volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (typeof window !== "undefined") {
      const currentGlobal = (window as any).__desktopVolume;
      const proposedGlobal = volume / 100;
      if (currentGlobal !== proposedGlobal) {
        (window as any).__desktopVolume = proposedGlobal;
        window.dispatchEvent(new CustomEvent("desktop-volume-change", { detail: volume }));
      }
    }
  }, [volume]);

  // Synchronize with global desktop-wide volume slider
  useEffect(() => {
    const handleGlobalVolume = (e: Event) => {
      const customEvent = e as CustomEvent;
      const vol = customEvent.detail;
      setVolume(vol);
    };
    window.addEventListener("desktop-volume-change", handleGlobalVolume);

    // Initial sync
    if (typeof window !== "undefined" && (window as any).__desktopVolume !== undefined) {
      setVolume(Math.round((window as any).__desktopVolume * 100));
    }

    return () => {
      window.removeEventListener("desktop-volume-change", handleGlobalVolume);
    };
  }, []);

  // Procedural Synth Sequencer inside the browser (Fallback / Local option)
  const playProceduralNotes = (bpm: number) => {
    if (typeof window === "undefined") return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    // Lofi progression notes (frequencies)
    const baseScale = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4, D4, E4, G4, A4
    const intervalSec = 60 / bpm;
    let step = 0;

    synthIntervalRef.current = setInterval(() => {
      if (ctx.state === "suspended") return;
      const now = ctx.currentTime;

      // Note frequency
      const freq = baseScale[step % baseScale.length];
      step++;

      // Synth oscillator
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + intervalSec * 0.9);

      // Volume control scaled by local app volume
      const finalVolume = (volume / 100) * 0.05;
      gain.gain.setValueAtTime(finalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + intervalSec * 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + intervalSec * 0.9);
    }, intervalSec * 1000);
  };

  const stopProceduralNotes = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Main playback state coordinator
  useEffect(() => {
    const audio = audioRef.current;

    if (playing) {
      if (activeTrack.isProcedural) {
        // Stop audio streams if playing
        if (audio) audio.pause();
        playProceduralNotes(activeTrack.bpm);

        // Animate fake progress bar for procedural synth
        progIntervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) return 0;
            return prev + 0.8;
          });
        }, 1000);
      } else {
        stopProceduralNotes();
        if (progIntervalRef.current) {
          clearInterval(progIntervalRef.current);
          progIntervalRef.current = null;
        }

        if (audio) {
          // If audio source URL changed, update it
          if (audio.src !== activeTrack.url) {
            audio.src = activeTrack.url;
            audio.load();
          }
          audio.play().catch((err) => {
            console.error("Audio playback failed: ", err);
          });
        }
      }
    } else {
      stopProceduralNotes();
      if (audio) audio.pause();
      if (progIntervalRef.current) {
        clearInterval(progIntervalRef.current);
        progIntervalRef.current = null;
      }
    }

    return () => {
      stopProceduralNotes();
      if (progIntervalRef.current) clearInterval(progIntervalRef.current);
    };
  }, [playing, activeIdx]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleNext = () => {
    setPlaying(false);
    setProgress(0);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % tracks.length);
      setPlaying(true);
    }, 120);
  };

  const handlePrev = () => {
    setPlaying(false);
    setProgress(0);
    setTimeout(() => {
      setActiveIdx((prev) => (prev - 1 + tracks.length) % tracks.length);
      setPlaying(true);
    }, 120);
  };

  const selectTrack = (idx: number) => {
    setPlaying(false);
    setProgress(0);
    setTimeout(() => {
      setActiveIdx(idx);
      setPlaying(true);
    }, 100);
  };

  return (
    <div className="h-full flex bg-[#0c0c16] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <div className="w-52 bg-[#09090f] border-r border-white/5 p-4 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 font-black tracking-widest text-sm">
            <Music size={16} />
            SPOTIFY
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block px-2 mb-2">Soundtracks</span>
            {tracks.map((track, i) => (
              <button
                key={i}
                onClick={() => selectTrack(i)}
                className={`w-full text-left px-2 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeIdx === i ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Disc size={12} className={activeIdx === i && playing ? "animate-spin" : ""} />
                <span className="truncate">{track.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main player layout */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden">
        {/* Album Artwork & Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={playing ? { rotate: 360 } : {}}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-28 h-28 rounded-full border-[6px] border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden"
            style={{
              background: "radial-gradient(circle, #059669 0%, #064e3b 100%)", // Emerald gradient
              boxShadow: playing ? "0 0 35px rgba(16,185,129,0.3)" : "none",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-zinc-950 border-4 border-zinc-900 z-10" />
            <Music size={18} className="text-emerald-300 absolute animate-pulse" />
          </motion.div>

          <div className="text-center space-y-1 max-w-[280px]">
            <h3 className="text-sm font-bold text-white tracking-wide truncate">{activeTrack.title}</h3>
            <p className="text-xs text-zinc-500 font-semibold truncate">{activeTrack.artist}</p>
            {activeTrack.isProcedural && (
              <span className="inline-block bg-violet-600/30 text-violet-300 border border-violet-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 font-mono">
                No internet required
              </span>
            )}
          </div>

          {/* Interactive Spectrum bars */}
          <div className="flex items-end gap-1.5 h-10 select-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                animate={playing ? { height: [4, 18 + Math.random() * 16, 4] } : { height: 4 }}
                transition={{ duration: 0.8, delay: i * 0.04, repeat: Infinity }}
                className="w-1 rounded-full bg-emerald-500/80"
              />
            ))}
          </div>
        </div>

        {/* Player controls */}
        <div className="space-y-4 border-t border-white/5 pt-4">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 font-bold font-mono">
              <span>{activeTrack.isProcedural ? `0:${Math.floor(progress)}` : streamProgress}</span>
              <span>{activeTrack.isProcedural ? "∞" : streamDuration}</span>
            </div>
          </div>

          {/* Buttons & Volume */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors">
                <SkipBack size={16} />
              </button>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
              >
                {playing ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
              </button>
              <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors">
                <SkipForward size={16} />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 w-32 select-none">
              <Volume2 size={13} className="text-zinc-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
