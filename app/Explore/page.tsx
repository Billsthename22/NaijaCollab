"use client";
 
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Music, Palette, Code, Camera, Video,
  Zap, Users, FolderOpen, MessageCircle, BookOpen,
  Settings, LogOut, TrendingUp, Flame, Star, Sparkles,
  Clock, ArrowUpRight, ChevronRight, Hash, Play,
  Headphones, MapPin, Check, Plus, UserPlus, Radio,
  Filter, Grid, List, Mic, Globe, Award, Heart
} from "lucide-react";
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
type SearchCategory = "all" | "people" | "projects" | "posts" | "collabs" | "tags";
 
interface Creative {
  id: number; name: string; initials: string; role: string;
  location: string; accentColor: string; matchScore: number;
  online: boolean; verified: boolean; followers: number;
  roleIcon: React.ReactNode; tags: string[];
}
 
interface Project {
  id: number; name: string; category: string; accentColor: string;
  members: number; progress: number; status: string;
  symbol: string; gradient: string; tags: string[];
}
 
interface CollabPost {
  id: number; title: string; role: string; author: string;
  authorInitials: string; accentColor: string; paid: boolean;
  slots: number; location: string; tags: string[];
}
 
interface TrackPost {
  id: number; title: string; artist: string; artistInitials: string;
  accentColor: string; plays: number; gradient: string; duration: string;
}
 
// ─── DATA ─────────────────────────────────────────────────────────────────────
 
const ALL_CREATIVES: Creative[] = [
  { id: 1, name: "Tunde Adeyemi", initials: "TA", role: "Sound Producer", location: "Lagos", accentColor: "#22C55E", matchScore: 98, online: true, verified: true, followers: 2400, roleIcon: <Music size={12} />, tags: ["Afrobeats", "Mixing", "Pro Tools"] },
  { id: 2, name: "Chisom Obi", initials: "CO", role: "UI/UX Designer", location: "Abuja", accentColor: "#EAB308", matchScore: 94, online: true, verified: false, followers: 1870, roleIcon: <Palette size={12} />, tags: ["Figma", "Branding", "Motion"] },
  { id: 3, name: "Emeka Nwosu", initials: "EN", role: "Full-Stack Dev", location: "Port Harcourt", accentColor: "#3B82F6", matchScore: 91, online: false, verified: false, followers: 980, roleIcon: <Code size={12} />, tags: ["React", "Node.js", "Web3"] },
  { id: 4, name: "Amara Sule", initials: "AS", role: "Photographer", location: "Lagos", accentColor: "#EC4899", matchScore: 88, online: true, verified: true, followers: 5200, roleIcon: <Camera size={12} />, tags: ["Editorial", "Portrait", "Brand"] },
  { id: 5, name: "Seun Balogun", initials: "SB", role: "Videographer", location: "Ibadan", accentColor: "#F97316", matchScore: 85, online: false, verified: false, followers: 740, roleIcon: <Video size={12} />, tags: ["Cinematography", "Color Grading"] },
  { id: 6, name: "Funke Adesanya", initials: "FA", role: "Visual Artist", location: "Remote", accentColor: "#A855F7", matchScore: 82, online: true, verified: true, followers: 3100, roleIcon: <Sparkles size={12} />, tags: ["Digital Art", "NFT", "Illustration"] },
  { id: 7, name: "Dayo Okonkwo", initials: "DO", role: "Sound Producer", location: "Lagos", accentColor: "#22C55E", matchScore: 79, online: true, verified: false, followers: 610, roleIcon: <Music size={12} />, tags: ["Amapiano", "Sampling"] },
  { id: 8, name: "Ngozi Eze", initials: "NE", role: "Backend Dev", location: "Enugu", accentColor: "#3B82F6", matchScore: 76, online: false, verified: false, followers: 420, roleIcon: <Code size={12} />, tags: ["Python", "AI/ML", "APIs"] },
];
 
const ALL_PROJECTS: Project[] = [
  { id: 1, name: "Beat Street EP", category: "Music", accentColor: "#22C55E", members: 3, progress: 72, status: "Active", symbol: "♪", gradient: "linear-gradient(135deg,#052e16,#22C55E)", tags: ["Afrobeats", "EP"] },
  { id: 2, name: "Lagos Youth Brand Film", category: "Film", accentColor: "#F97316", members: 2, progress: 35, status: "Planning", symbol: "▶", gradient: "linear-gradient(135deg,#1c0700,#F97316)", tags: ["Film", "Branding"] },
  { id: 3, name: "Naija Sounds App", category: "Tech", accentColor: "#3B82F6", members: 3, progress: 88, status: "Review", symbol: "⌖", gradient: "linear-gradient(135deg,#030712,#3B82F6)", tags: ["Streaming", "Mobile"] },
  { id: 4, name: "Arise — EP Artwork", category: "Design", accentColor: "#EC4899", members: 2, progress: 60, status: "Active", symbol: "◈", gradient: "linear-gradient(135deg,#1a0010,#EC4899)", tags: ["Branding", "Art"] },
];
 
const ALL_COLLABS: CollabPost[] = [
  { id: 1, title: "Eko Portraits — Short Film", role: "Sound Designer + Graphic Artist", author: "Seun Balogun", authorInitials: "SB", accentColor: "#F97316", paid: true, slots: 2, location: "Lagos", tags: ["Film", "Paid", "Collab"] },
  { id: 2, title: "Afrobeats EP — Seeking Vocalist", role: "Lead Vocalist", author: "Tunde Adeyemi", authorInitials: "TA", accentColor: "#22C55E", paid: true, slots: 1, location: "Lagos", tags: ["Music", "Vocalist", "Paid"] },
  { id: 3, title: "Fashion Brand Identity", role: "Photographer + Creative Director", author: "Chisom Obi", authorInitials: "CO", accentColor: "#EAB308", paid: false, slots: 2, location: "Abuja", tags: ["Fashion", "Design", "Remote OK"] },
  { id: 4, title: "Naija Stories — Podcast", role: "Audio Engineer", author: "Ngozi Eze", authorInitials: "NE", accentColor: "#A855F7", paid: false, slots: 1, location: "Remote", tags: ["Podcast", "Audio", "Remote"] },
];
 
const ALL_TRACKS: TrackPost[] = [
  { id: 1, title: "Midnight Lagos", artist: "Tunde Adeyemi", artistInitials: "TA", accentColor: "#22C55E", plays: 48200, gradient: "linear-gradient(135deg,#052e16,#22C55E)", duration: "3:42" },
  { id: 2, title: "Eko Dawn (Free Beat)", artist: "Dayo Okonkwo", artistInitials: "DO", accentColor: "#EAB308", plays: 19300, gradient: "linear-gradient(135deg,#1c1400,#EAB308)", duration: "4:14" },
  { id: 3, title: "Danfo Stories", artist: "Tunde Adeyemi", artistInitials: "TA", accentColor: "#F97316", plays: 22100, gradient: "linear-gradient(135deg,#1c0700,#F97316)", duration: "4:01" },
];
 
const TRENDING_TAGS = ["#NaijaCreatives", "#AfrobeatsNaija", "#LagosDesign", "#FreeBeat", "#OpenCollab", "#NaijaStartup", "#Amapiano", "#NaijaArt"];
 
const CATEGORIES = [
  { label: "Producers",    icon: <Music size={18} />,    color: "#22C55E",  count: 340 },
  { label: "Designers",    icon: <Palette size={18} />,  color: "#EAB308",  count: 215 },
  { label: "Developers",   icon: <Code size={18} />,     color: "#3B82F6",  count: 180 },
  { label: "Photographers",icon: <Camera size={18} />,   color: "#EC4899",  count: 142 },
  { label: "Videographers",icon: <Video size={18} />,    color: "#F97316",  count: 98  },
  { label: "Visual Artists",icon: <Sparkles size={18} />,color: "#A855F7",  count: 127 },
];
 
const RECENT_SEARCHES = ["Afrobeats producer Lagos", "UI designer open collab", "Tunde Adeyemi", "#FreeBeat"];
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", ...style }} />;
}
 
function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
 
// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
 
function AppSidebar() {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />,          href: "/dashboard" },
    { label: "Feed",      icon: <Radio size={16} />,         href: "/feed" },
    { label: "Explore",   icon: <Search size={16} />,        href: "/explore", active: true },
    { label: "Matches",   icon: <Users size={16} />,         href: "/matches" },
    { label: "Projects",  icon: <FolderOpen size={16} />,    href: "/projects" },
    { label: "Messages",  icon: <MessageCircle size={16} />, href: "/messages" },
    { label: "Portfolio", icon: <BookOpen size={16} />,      href: "/portfolio" },
  ];
  return (
    <div style={{ width: 220, flexShrink: 0, background: "rgba(255,255,255,0.015)", borderRight: "1px solid rgba(255,255,255,0.055)", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", position: "sticky", top: 0, height: "100vh" }}>
      <a href="/" style={{ textDecoration: "none", marginBottom: "2.5rem", paddingLeft: "0.5rem", display: "block" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
      </a>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(item => {
          const isActive = (item as any).active;
          return (
            <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", borderRadius: 10, background: isActive ? "rgba(34,197,94,0.1)" : "transparent", border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : "transparent"}`, color: isActive ? "#22C55E" : "rgba(240,237,230,0.45)", textDecoration: "none", fontSize: "0.845rem", fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 500 : 400, transition: "all 0.2s" }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#F0EDE6"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,230,0.45)"; }}}
            >
              <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {[{ label: "Settings", icon: <Settings size={15} /> }, { label: "Sign Out", icon: <LogOut size={15} /> }].map(item => (
          <button key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: 10, background: "transparent", border: "none", color: "rgba(240,237,230,0.3)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textAlign: "left" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >{item.icon} {item.label}</button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginTop: "0.5rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#22C55E40,#22C55E15)", border: "1.5px solid #22C55E40", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.62rem", color: "#22C55E" }}>YOU</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#F0EDE6" }}>Your Name</div>
            <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Sound Producer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── CREATIVE CARD ────────────────────────────────────────────────────────────
 
function CreativeCard({ c, index, compact = false }: { c: Creative; index: number; compact?: boolean }) {
  const [connected, setConnected] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, borderColor: `${c.accentColor}30` }}
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: compact ? "1rem" : "1.25rem", transition: "all 0.22s", cursor: "default", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,${c.accentColor}80,transparent)` }} />
 
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: compact ? 40 : 46, height: compact ? 40 : 46, borderRadius: "50%", background: `linear-gradient(135deg,${c.accentColor}45,${c.accentColor}15)`, border: `1.5px solid ${c.accentColor}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: compact ? "0.72rem" : "0.8rem", color: c.accentColor }}>
            {c.initials}
          </div>
          {c.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", boxShadow: "0 0 5px #22C55E" }} />}
        </div>
 
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: "0.15rem" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: compact ? "0.85rem" : "0.9rem", color: "#F0EDE6", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
            {c.verified && <div style={{ width: 13, height: 13, borderRadius: "50%", background: c.accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={7} color="#080808" strokeWidth={3} /></div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: compact ? 0 : "0.6rem" }}>
            <span style={{ display: "flex", color: c.accentColor }}>{c.roleIcon}</span>
            <span style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{c.role}</span>
            <span style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.2)" }}>·</span>
            <MapPin size={9} style={{ color: "rgba(240,237,230,0.25)" }} />
            <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>{c.location}</span>
          </div>
 
          {!compact && (
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {c.tags.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: "0.62rem", color: c.accentColor, background: `${c.accentColor}10`, border: `1px solid ${c.accentColor}22`, borderRadius: 5, padding: "1px 7px" }}>{t}</span>
              ))}
            </div>
          )}
 
          {!compact && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={10} fill={c.accentColor} color={c.accentColor} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: c.accentColor }}>{c.matchScore}%</span>
                </div>
                <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>{formatNum(c.followers)} followers</span>
              </div>
              <motion.button
                whileHover={!connected ? { scale: 1.05, boxShadow: `0 0 14px ${c.accentColor}35` } : {}}
                whileTap={!connected ? { scale: 0.96 } : {}}
                onClick={() => setConnected(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.38rem 0.9rem", background: connected ? "rgba(34,197,94,0.08)" : `linear-gradient(135deg,${c.accentColor},${c.accentColor}bb)`, border: connected ? "1px solid rgba(34,197,94,0.25)" : "none", borderRadius: 8, color: connected ? "#22C55E" : "#080808", fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 600, cursor: connected ? "default" : "pointer", transition: "all 0.2s" }}
              >
                {connected ? <><Check size={11} /> Connected</> : <><UserPlus size={11} /> Connect</>}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── COLLAB CARD ─────────────────────────────────────────────────────────────
 
function CollabCard({ c, index }: { c: CollabPost; index: number }) {
  const [applied, setApplied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -2, borderColor: `${c.accentColor}30` }}
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.1rem 1.25rem", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,${c.accentColor}80,transparent)` }} />
 
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>{c.title}</div>
          <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>by {c.author} · {c.location}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
          {c.paid && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "2px 8px" }}>PAID</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 5px #22C55E" }} />
            <span style={{ fontSize: "0.65rem", color: "#22C55E", fontWeight: 500 }}>{c.slots} open</span>
          </div>
        </div>
      </div>
 
      <div style={{ fontSize: "0.78rem", color: c.accentColor, fontWeight: 500, marginBottom: "0.6rem" }}>Seeking: {c.role}</div>
 
      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
        {c.tags.map(t => <span key={t} style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 7px" }}>{t}</span>)}
      </div>
 
      <motion.button
        whileHover={!applied ? { scale: 1.02, boxShadow: "0 0 16px rgba(34,197,94,0.25)" } : {}}
        whileTap={!applied ? { scale: 0.97 } : {}}
        onClick={() => setApplied(true)}
        style={{ width: "100%", padding: "0.6rem", background: applied ? "rgba(34,197,94,0.08)" : "linear-gradient(135deg,#22C55E,#16A34A)", border: applied ? "1px solid rgba(34,197,94,0.25)" : "none", borderRadius: 9, color: applied ? "#22C55E" : "#080808", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: applied ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
      >
        {applied ? <><Check size={12} /> Applied!</> : <><Zap size={12} fill="#080808" /> Apply Now</>}
      </motion.button>
    </motion.div>
  );
}
 
// ─── TRACK CARD ───────────────────────────────────────────────────────────────
 
function TrackCard({ t, index }: { t: TrackPost; index: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -2 }}
      style={{ background: t.gradient, borderRadius: 14, padding: "1.1rem", display: "flex", alignItems: "center", gap: "0.85rem", position: "relative", overflow: "hidden", cursor: "default" }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: "absolute", right: -8, bottom: -8, fontSize: "4rem", color: t.accentColor, opacity: 0.15, userSelect: "none" }}>♪</div>
 
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setPlaying(!playing)}
        style={{ width: 38, height: 38, borderRadius: "50%", background: t.accentColor, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#080808", flexShrink: 0, boxShadow: `0 0 16px ${t.accentColor}60`, position: "relative", zIndex: 1 }}
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </motion.button>
 
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>{t.title}</div>
        <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.5)", fontWeight: 300 }}>{t.artist} · {t.duration}</div>
      </div>
 
      <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
        <Headphones size={11} style={{ color: "rgba(240,237,230,0.4)" }} />
        <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{formatNum(t.plays)}</span>
      </div>
    </motion.div>
  );
}
 
// ─── EXPLORE STATE ────────────────────────────────────────────────────────────
 
function ExploreView({ onTagClick }: { onTagClick: (tag: string) => void }) {
  return (
    <motion.div
      key="explore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
    >
      {/* Category browse */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "1.25rem" }}>
          <Grid size={14} style={{ color: "#22C55E" }} />
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Browse by Role</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ scale: 1.03, borderColor: `${cat.color}40` }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.6rem", padding: "1.1rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, cursor: "pointer", transition: "all 0.22s", textAlign: "left", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,${cat.color}80,transparent)` }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${cat.color}15`, border: `1px solid ${cat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color }}>
                {cat.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>{cat.label}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{cat.count} creatives</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
 
      {/* Trending tags */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "1.25rem" }}>
          <TrendingUp size={14} style={{ color: "#22C55E" }} />
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Trending Tags</h3>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {TRENDING_TAGS.map((tag, i) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onTagClick(tag)}
              style={{ padding: "0.5rem 1rem", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, color: "#22C55E", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
 
      {/* Featured creatives */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Star size={14} fill="#EAB308" color="#EAB308" />
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Featured This Week</h3>
          </div>
          <a href="/matches" style={{ fontSize: "0.72rem", color: "#22C55E", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>See all <ChevronRight size={12} /></a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {ALL_CREATIVES.slice(0, 4).map((c, i) => <CreativeCard key={c.id} c={c} index={i} />)}
        </div>
      </div>
 
      {/* Hot collabs */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Flame size={14} style={{ color: "#F97316" }} />
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Open Collabs</h3>
          </div>
          <a href="/matches" style={{ fontSize: "0.72rem", color: "#22C55E", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>See all <ChevronRight size={12} /></a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {ALL_COLLABS.map((c, i) => <CollabCard key={c.id} c={c} index={i} />)}
        </div>
      </div>
 
      {/* Latest drops */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "1.25rem" }}>
          <Headphones size={14} style={{ color: "#22C55E" }} />
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Latest Drops</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {ALL_TRACKS.map((t, i) => <TrackCard key={t.id} t={t} index={i} />)}
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── SEARCH RESULTS ───────────────────────────────────────────────────────────
 
function SearchResults({ query, activeCategory, setActiveCategory }: { query: string; activeCategory: SearchCategory; setActiveCategory: (c: SearchCategory) => void }) {
  const q = query.toLowerCase().trim();
 
  const matchedCreatives = ALL_CREATIVES.filter(c =>
    c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
  );
  const matchedProjects = ALL_PROJECTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
  const matchedCollabs = ALL_COLLABS.filter(c =>
    c.title.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) ||
    c.author.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
  );
  const matchedTracks = ALL_TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  );
  const matchedTags = TRENDING_TAGS.filter(t => t.toLowerCase().includes(q));
 
  const totalResults = matchedCreatives.length + matchedProjects.length + matchedCollabs.length + matchedTracks.length;
 
  const CATS: { id: SearchCategory; label: string; count: number }[] = [
    { id: "all",      label: "All",      count: totalResults },
    { id: "people",   label: "People",   count: matchedCreatives.length },
    { id: "collabs",  label: "Collabs",  count: matchedCollabs.length },
    { id: "projects", label: "Projects", count: matchedProjects.length },
    { id: "posts",    label: "Tracks",   count: matchedTracks.length },
    { id: "tags",     label: "Tags",     count: matchedTags.length },
  ];
 
  const noResults = totalResults === 0 && matchedTags.length === 0;
 
  return (
    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
 
      {/* Category tabs */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {CATS.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={activeCategory !== cat.id ? { scale: 1.03 } : {}}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.5rem 1rem", borderRadius: 100, background: activeCategory === cat.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${activeCategory === cat.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`, color: activeCategory === cat.id ? "#22C55E" : "rgba(240,237,230,0.45)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: activeCategory === cat.id ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}
          >
            {cat.label}
            <span style={{ fontSize: "0.62rem", background: activeCategory === cat.id ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)", borderRadius: 100, padding: "1px 6px", color: activeCategory === cat.id ? "#22C55E" : "rgba(240,237,230,0.25)" }}>{cat.count}</span>
          </motion.button>
        ))}
      </div>
 
      {/* No results */}
      {noResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "5rem 0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>No results for "{query}"</h3>
          <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Try different keywords or browse the categories below</p>
        </motion.div>
      )}
 
      {/* Results sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
 
        {/* People */}
        {(activeCategory === "all" || activeCategory === "people") && matchedCreatives.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} style={{ color: "#22C55E" }} />
                <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>People</h4>
                <span style={{ fontSize: "0.65rem", color: "#22C55E", fontWeight: 700, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "1px 8px" }}>{matchedCreatives.length}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
              {matchedCreatives.map((c, i) => <CreativeCard key={c.id} c={c} index={i} />)}
            </div>
          </div>
        )}
 
        {/* Collabs */}
        {(activeCategory === "all" || activeCategory === "collabs") && matchedCollabs.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              <Zap size={14} style={{ color: "#22C55E" }} />
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>Collabs</h4>
              <span style={{ fontSize: "0.65rem", color: "#22C55E", fontWeight: 700, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "1px 8px" }}>{matchedCollabs.length}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
              {matchedCollabs.map((c, i) => <CollabCard key={c.id} c={c} index={i} />)}
            </div>
          </div>
        )}
 
        {/* Projects */}
        {(activeCategory === "all" || activeCategory === "projects") && matchedProjects.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              <FolderOpen size={14} style={{ color: "#22C55E" }} />
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>Projects</h4>
              <span style={{ fontSize: "0.65rem", color: "#22C55E", fontWeight: 700, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "1px 8px" }}>{matchedProjects.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {matchedProjects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -2, borderColor: `${p.accentColor}30` }} style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.9rem 1.1rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: p.accentColor, borderRadius: "0 2px 2px 0" }} />
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{p.symbol}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>{p.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{p.category} · {p.members} members · {p.status}</div>
                  </div>
                  <div style={{ display: "flex", flex: "0 0 80px", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.3)" }}>Progress</span>
                      <span style={{ fontSize: "0.62rem", color: p.accentColor, fontWeight: 700 }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100 }}>
                      <div style={{ width: `${p.progress}%`, height: "100%", background: p.accentColor, borderRadius: 100 }} />
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: "rgba(240,237,230,0.2)", flexShrink: 0 }} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
 
        {/* Tracks */}
        {(activeCategory === "all" || activeCategory === "posts") && matchedTracks.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              <Headphones size={14} style={{ color: "#22C55E" }} />
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>Tracks</h4>
              <span style={{ fontSize: "0.65rem", color: "#22C55E", fontWeight: 700, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "1px 8px" }}>{matchedTracks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {matchedTracks.map((t, i) => <TrackCard key={t.id} t={t} index={i} />)}
            </div>
          </div>
        )}
 
        {/* Tags */}
        {(activeCategory === "all" || activeCategory === "tags") && matchedTags.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              <Hash size={14} style={{ color: "#22C55E" }} />
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>Tags</h4>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {matchedTags.map(tag => (
                <motion.span key={tag} whileHover={{ scale: 1.05 }} style={{ padding: "0.5rem 1.1rem", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, color: "#22C55E", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer" }}>{tag}</motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearching = query.trim().length > 0;
 
  const handleTagClick = (tag: string) => {
    setQuery(tag);
    inputRef.current?.focus();
  };
 
  const clearSearch = () => {
    setQuery("");
    setActiveCategory("all");
    inputRef.current?.focus();
  };
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(240,237,230,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
 
      <AppSidebar />
 
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(34,197,94,0.07),transparent)", top: -100, right: 0 }} />
        <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(234,179,8,0.04),transparent)", bottom: "25%", left: "5%", animation: "float 10s ease-in-out infinite" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)", backgroundSize: "55px 55px" }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
 
          {/* ── HERO SEARCH ── */}
          <div style={{
            position: "sticky", top: 0, zIndex: 30,
            background: "rgba(8,8,8,0.92)", backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "1.25rem 2.5rem",
          }}>
            <AnimatePresence mode="wait">
              {!isSearching ? (
                <motion.div key="header" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Discover</div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.04em" }}>Explore NaijaCollab</h1>
                </motion.div>
              ) : (
                <motion.div key="searching" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Results for</div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.04em", color: "#F0EDE6" }}>
                    "{query}"
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
 
            {/* Search bar */}
            <div style={{
              position: "relative",
              background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.035)",
              border: `1px solid ${focused ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 14, transition: "all 0.25s",
              boxShadow: focused ? "0 0 0 3px rgba(34,197,94,0.08), 0 8px 32px rgba(0,0,0,0.3)" : "none",
            }}>
              <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: focused ? "#22C55E" : "rgba(240,237,230,0.35)", transition: "color 0.2s" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveCategory("all"); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search creatives, projects, tracks, collabs, tags…"
                style={{ width: "100%", padding: "0.95rem 3rem 0.95rem 2.85rem", background: "transparent", border: "none", outline: "none", color: "#F0EDE6", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 300 }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.6)" }}
                  >
                    <X size={12} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
 
            {/* Recent searches — shown when focused and no query */}
            <AnimatePresence>
              {focused && !query && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.25)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> Recent:
                  </span>
                  {RECENT_SEARCHES.map(s => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setQuery(s)}
                      style={{ padding: "0.3rem 0.85rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 300, cursor: "pointer", transition: "all 0.18s" }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          {/* ── CONTENT ── */}
          <div style={{ padding: "2rem 2.5rem" }}>
            <AnimatePresence mode="wait">
              {isSearching ? (
                <SearchResults key="search" query={query} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              ) : (
                <ExploreView key="explore" onTagClick={handleTagClick} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
 