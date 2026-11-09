import React from 'react';

export const Radio = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} style={style}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2"/></svg>
);

export const LayoutGrid = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

export const MapPin = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export const Calendar = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
);

export const Users = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export const Bookmark = ({ size = 18, color, fill = "none", className, style }) => (
  <svg viewBox="0 0 24 24" fill={fill} stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
);

export const PlusCircle = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
);

export const Compass = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);

export const Trophy = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

export const Globe2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
);

export const Users2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-3M16 5a4 4 0 0 1 0 8"/></svg>
);

export const Sparkles = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
);

export const Search = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export const SlidersHorizontal = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
);

export const RotateCcw = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

export const Laptop = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.37 20H3.63a1 1 0 0 1-.91-1.45L4 16"/></svg>
);

export const Building2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>
);

export const ArrowRight = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export const X = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M18 6 6 18M6 6l12 12"/></svg>
);

export const ChevronLeft = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m15 18-6-6 6-6"/></svg>
);

export const ChevronRight = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m9 18 6-6-6-6"/></svg>
);

export const ExternalLink = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);

export const Share2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
);

export const Check = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M20 6 9 17l-5-5"/></svg>
);

export const Download = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
);

export const Award = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);

export const Building = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
);

export const Trash2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
);

export const SearchX = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m13.5 8.5-5 5M8.5 8.5l5 5M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"/></svg>
);

export const Globe = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
);

export const Heart = ({ size = 18, color, fill = "none", className, style }) => (
  <svg viewBox="0 0 24 24" fill={fill} stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export const Plus = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M5 12h14M12 5v14"/></svg>
);

export const Mail = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export const Code = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

export const Send = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

export const Clock = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const AlertTriangle = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);

export const Flame = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

export const GraduationCap = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);

export const Zap = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

export const ArrowLeft = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m12 19-7-7 7-7M19 12H5"/></svg>
);

export const ShieldCheck = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export const CheckCircle2 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} style={style}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

export const User = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const LogOut = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

export const Lock = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export const Edit3 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

export const Save = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);

export const BarChart3 = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
);

export const Activity = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} style={style}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export const Cpu = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"/></svg>
);

export const Layers = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-9.17 4.16a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-9.17 4.16a2 2 0 0 1-1.66 0L2 17.5"/></svg>
);

export const Terminal = ({ size = 18, color, className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" width={size} height={size} className={className} style={style}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);
