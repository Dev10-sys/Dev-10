"use client";

import React from "react";

// 1. Google Chrome Icon
export const ChromeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
    <circle cx="12" cy="12" r="10" fill="#facc15" />
    <path d="M12 2C9.5 2 7.2 2.9 5.5 4.5L9.5 11.5L12 2Z" fill="#ef4444" />
    <path d="M12 2L9.5 11.5L2 12C2 6.5 6.5 2 12 2Z" fill="#ef4444" />
    <path d="M5.5 4.5C3.3 6.4 2 9.1 2 12L9.5 11.5L5.5 4.5Z" fill="#facc15" />
    <path d="M2 12C2 17.5 6.5 22 12 22C14.5 22 16.8 21.1 18.5 19.5L14.5 12.5L2 12Z" fill="#22c55e" />
    <path d="M12 22L14.5 12.5L22 12C22 17.5 17.5 22 12 22Z" fill="#22c55e" />
    <path d="M18.5 19.5C20.7 17.6 22 14.9 22 12L14.5 12.5L18.5 19.5Z" fill="#facc15" />
    <path d="M22 12L14.5 12.5L12 22L22 12Z" fill="#facc15" />
    <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
    <circle cx="12" cy="12" r="3.5" fill="#3b82f6" />
  </svg>
);

// 2. Spotify Icon
export const SpotifyIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
    <circle cx="12" cy="12" r="11" fill="#1db954" />
    <path d="M17.5 8.2C15 6.7 10.8 6.5 8.3 7.3C7.9 7.4 7.5 7.2 7.4 6.8C7.3 6.4 7.5 6 7.9 5.9C10.8 5 15.4 5.2 18.3 6.9C18.7 7.1 18.8 7.6 18.6 8C18.4 8.3 17.9 8.4 17.5 8.2Z" fill="#121212" />
    <path d="M16.2 10.6C14.1 9.3 10.8 8.9 8.4 9.6C8 9.7 7.6 9.5 7.5 9.1C7.4 8.7 7.6 8.3 8 8.2C10.8 7.4 14.4 7.8 16.8 9.3C17.2 9.5 17.3 10 17.1 10.4C16.9 10.7 16.5 10.8 16.2 10.6Z" fill="#121212" />
    <path d="M15 12.8C13.2 11.7 10.7 11.4 8.5 12C8.1 12.1 7.8 11.9 7.7 11.5C7.6 11.1 7.8 10.8 8.2 10.7C10.7 10 13.5 10.4 15.6 11.7C16 11.9 16.1 12.4 15.9 12.8C15.6 13.1 15.2 13.1 15 12.8Z" fill="#121212" />
  </svg>
);

// 3. Notepad Icon
export const NotepadIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
    {/* Page base */}
    <path d="M4 3C4 2.45 4.45 2 5 2H19C19.55 2 20 2.45 20 3V21C20 21.55 19.55 22 19 22H5C4.45 22 4 21.55 4 21V3Z" fill="#fef08a" />
    {/* Binding top strip */}
    <path d="M4 2H20V5H4V2Z" fill="#b45309" />
    {/* Lined page markings */}
    <path d="M7 9H17" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 12H17" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 15H17" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 18H13" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    {/* Left margin red line */}
    <path d="M6.5 5V22" stroke="#f43f5e" strokeWidth="1" />
  </svg>
);

// 4. Dev's Terminal Icon
export const TerminalIconCustom = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(163,230,53,0.3)]">
    <rect x="2" y="3" width="20" height="18" rx="3" fill="#1e1e2e" stroke="#a3e635" strokeWidth="1.5" />
    <path d="M2 3H22V7H2V3Z" fill="#11111b" />
    <circle cx="5" cy="5" r="1" fill="#ef4444" />
    <circle cx="8" cy="5" r="1" fill="#facc15" />
    <circle cx="11" cy="5" r="1" fill="#22c55e" />
    <path d="M6 10L9 12L6 14" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 14H15" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 5. My Profile Icon
export const ProfileIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(167,139,250,0.3)]">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#profile-grad)" />
    <circle cx="12" cy="9.5" r="3.5" fill="#ffffff" />
    <path d="M6 18C6 15 8.7 13.5 12 13.5C15.3 13.5 18 15 18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="profile-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Blogs / Engineering Logs Icon
export const BlogsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(34,211,238,0.3)]">
    <path d="M4 4C4 2.9 4.9 2 6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4Z" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" />
    {/* Screen code block inside book */}
    <rect x="7" y="5" width="10" height="8" rx="1.5" fill="#0f172a" />
    <path d="M9 8L11 9L9 10" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10H15" stroke="#38bdf8" strokeWidth="1" />
    {/* Page lines */}
    <path d="M7 16H17" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 19H14" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 7. Contact Me Icon
export const ContactIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
    <rect x="2" y="4" width="20" height="16" rx="4" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
    <path d="M3 6L12 13L21 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2.5" fill="#059669" stroke="#10b981" strokeWidth="1" />
  </svg>
);

// 8. Projects (Folder Explorer) Icon
export const ProjectsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]">
    {/* Folder Back */}
    <path d="M2 19V6C2 4.9 2.9 4 4 4H10L12 6H20C21.1 6 22 6.9 22 8V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19Z" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
    {/* Inner Paper sheet popping out */}
    <path d="M5 8V18H19V8H5Z" fill="#10b981" opacity="0.3" />
    <rect x="4" y="8" width="16" height="11" rx="2" fill="#0f766e" stroke="#34d399" strokeWidth="1.2" />
    {/* Git branch logo on front folder panel */}
    <circle cx="9" cy="15" r="1.5" fill="#34d399" />
    <circle cx="15" cy="11" r="1.5" fill="#34d399" />
    <path d="M9 13.5V11C9 10 10 9 11 9H13.5" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 9L13.5 7.5L15 9" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 9. Experience (Git Merge Timeline) Icon
export const ExperienceIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(129,140,248,0.3)]">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
    {/* Git merge lane */}
    <line x1="8" y1="4" x2="8" y2="20" stroke="#4f46e5" strokeWidth="2.5" />
    <circle cx="8" cy="8" r="3" fill="#818cf8" stroke="#1e1b4b" strokeWidth="1.5" />
    <circle cx="8" cy="16" r="3" fill="#818cf8" stroke="#1e1b4b" strokeWidth="1.5" />
    {/* Branch curve */}
    <path d="M8 8C12 8 16 10 16 13V20" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="14" r="3" fill="#ec4899" stroke="#1e1b4b" strokeWidth="1.5" />
  </svg>
);

// 10. Skills Hub (CPU Motherboard Chip) Icon
export const SkillsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(251,146,60,0.3)]">
    {/* Processor base */}
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2d1500" stroke="#fb923c" strokeWidth="1.5" />
    <rect x="7" y="7" width="10" height="10" rx="2" fill="#431407" stroke="#fb923c" strokeWidth="1" />
    <circle cx="12" cy="12" r="2.5" fill="#f97316" />
    {/* Gold pins around chip */}
    <path d="M5 2V5M9 2V5M13 2V5M17 2V5M19 2V5" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 19V22M9 19V22M13 19V22M17 19V22M19 19V22" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M2 5H5M2 9H5M2 13H5M2 17H5M2 19H5" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M19 5H22M19 9H22M19 13H22M19 17H22M19 19H22" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 11. Trash Bin Icon
export const TrashIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">
    <rect x="6" y="6" width="12" height="14" rx="2" fill="#270e13" stroke="#f43f5e" strokeWidth="1.5" />
    <path d="M4 6H20" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 3H15" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="10" x2="10" y2="16" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="10" x2="14" y2="16" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 12. Nova Strike Game (Arcade Controller) Icon
export const GameIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">
    <rect x="2" y="6" width="20" height="12" rx="4" fill="#310c14" stroke="#f43f5e" strokeWidth="1.5" />
    {/* D-Pad cross */}
    <path d="M6 12H10M8 10V14" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
    {/* Action buttons */}
    <circle cx="15" cy="13" r="1.5" fill="#f43f5e" />
    <circle cx="17.5" cy="10.5" r="1.5" fill="#3b82f6" />
    {/* Start/Select pills */}
    <line x1="11" y1="15" x2="13" y2="15" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 13. resume.pdf Icon
export const ResumePdfIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
    <rect x="3" y="2" width="18" height="20" rx="3" fill="#2d1d00" stroke="#f59e0b" strokeWidth="1.5" />
    {/* Red PDF banner */}
    <path d="M3 5V8H21V5H3Z" fill="#b45309" />
    <text x="6" y="7.5" fill="#ffffff" fontSize="3" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">PDF</text>
    {/* Simulated lines */}
    <line x1="6" y1="12" x2="18" y2="12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="15" x2="18" y2="15" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="18" x2="12" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
