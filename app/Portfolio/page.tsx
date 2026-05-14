"use client";
 
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Plus, Edit3, Trash2, ExternalLink, Play, Music, Pause,
  Image as ImageIcon, FileText, Link, Upload, X, Check,
  Star, Eye, Heart, Share2, Download, Zap, Users,
  FolderOpen, MessageCircle, BookOpen, Settings, LogOut,
  ChevronRight, Award, TrendingUp, MoreHorizontal,
  Mic, Headphones, Radio, Grid, List, Filter,
  Globe, ChevronDown
} from "lucide-react";
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
type WorkType = "track" | "visual" | "project" | "collab";
 
interface PortfolioWork {
  id: number;
  type: WorkType;
  title: string;
  description: string;
  tags: string[];
  year: string;
  featured: boolean;
  plays?: number;
  likes: number;
  views: number;
  accentColor: string;
  collaborators?: { initials: string; color: string; name: string }[];
  duration?: string;
  coverGradient: string;
  symbol: string;
}
 
interface Skill {
  label: string;
  level: number;
  color: string;
}
 
// ─── MOCK DATA ────────────────────────────────────────────────────────────────
 
const WORKS: PortfolioWork[] = [
  {
    id: 1, type: "track", title: "Midnight Lagos",
    description: "An Afrobeats banger capturing the restless energy of Lagos at 2AM. Featured on Apple Music New Music Daily.",
    tags: ["Afrobeats", "Production", "Mixing"], year: "2025", featured: true,
    plays: 48200, likes: 1240, views: 62000,
    accentColor: "#22C55E", duration: "3:42",
    coverGradient: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)",
    symbol: "♪", collaborators: [{ initials: "TA", color: "#22C55E", name: "Tunde A." }],
  },
  {
    id: 2, type: "track", title: "Danfo Stories",
    description: "Street-level Afrobeats produced entirely on an iPad. A love letter to Lagos commuters.",
    tags: ["Afrobeats", "Street", "Mobile Production"], year: "2024", featured: false,
    plays: 22100, likes: 890, views: 31000,
    accentColor: "#EAB308", duration: "4:01",
    coverGradient: "linear-gradient(135deg, #1c1400 0%, #422006 40%, #78350f 100%)",
    symbol: "♬",
  },
  {
    id: 3, type: "visual", title: "Arise — EP Artwork",
    description: "Full visual identity for the Beat Street EP. Cover art, merch mockups, and digital assets.",
    tags: ["Branding", "Art Direction", "EP"], year: "2025", featured: true,
    likes: 430, views: 8800,
    accentColor: "#EC4899", duration: undefined,
    coverGradient: "linear-gradient(135deg, #1a0010 0%, #500030 40%, #831843 100%)",
    symbol: "◈", collaborators: [{ initials: "CO", color: "#EAB308", name: "Chisom O." }],
  },
  {
    id: 4, type: "collab", title: "Naija Sounds App",
    description: "Music streaming platform built for underground Nigerian artists. 400+ beta users in 2 weeks.",
    tags: ["Product", "Tech", "Music"], year: "2025", featured: true,
    likes: 620, views: 14200,
    accentColor: "#3B82F6", duration: undefined,
    coverGradient: "linear-gradient(135deg, #030712 0%, #1e3a5f 40%, #1d4ed8 100%)",
    symbol: "⌖", collaborators: [
      { initials: "EN", color: "#3B82F6", name: "Emeka N." },
      { initials: "IM", color: "#EAB308", name: "Ike M." },
    ],
  },
  {
    id: 5, type: "track", title: "Eko Sunrise",
    description: "Sunrise session beats. Mellow and introspective — a different side of the Lagos sound.",
    tags: ["Beats", "Instrumental", "Ambient"], year: "2024", featured: false,
    plays: 9800, likes: 340, views: 12500,
    accentColor: "#F97316", duration: "5:14",
    coverGradient: "linear-gradient(135deg, #1c0700 0%, #431407 40%, #7c2d12 100%)",
    symbol: "◎",
  },
  {
    id: 6, type: "project", title: "Beat Street EP",
    description: "6-track debut EP. Afrobeats meets contemporary production. Features top Lagos vocalists.",
    tags: ["EP Release", "Afrobeats", "Debut"], year: "2025", featured: false,
    plays: 91000, likes: 3100, views: 148000,
    accentColor: "#A855F7", duration: "22:18",
    coverGradient: "linear-gradient(135deg, #0d0014 0%, #2e1065 40%, #6b21a8 100%)",
    symbol: "⬡", collaborators: [
      { initials: "TA", color: "#22C55E", name: "Tunde A." },
      { initials: "CO", color: "#EAB308", name: "Chisom O." },
      { initials: "AS", color: "#EC4899", name: "Amara S." },
    ],
  },
];
 
const SKILLS: Skill[] = [
  { label: "Beat Production", level: 96, color: "#22C55E" },
  { label: "Mixing & Mastering", level: 88, color: "#EAB308" },
  { label: "Sound Design", level: 82, color: "#3B82F6" },
  { label: "Afrobeats", level: 95, color: "#EC4899" },
  { label: "Ableton Live", level: 90, color: "#F97316" },
  { label: "Pro Tools", level: 78, color: "#A855F7" },
];
 
const STATS = [
  { label: "Total Plays",   value: "171K", icon: <Headphones size={14} />, color: "#22C55E" },
  { label: "Works",         value: "24",   icon: <Grid size={14} />,      color: "#EAB308" },
  { label: "Collaborations", value: "12",  icon: <Users size={14} />,     color: "#3B82F6" },
  { label: "Profile Views", value: "8.4K", icon: <Eye size={14} />,       color: "#EC4899" },
];
 
const TYPE_FILTERS: { label: string; value: WorkType | "all"; icon: React.ReactNode }[] = [
  { label: "All Work",    value: "all",     icon: <Grid size={12} /> },
  { label: "Tracks",      value: "track",   icon: <Music size={12} /> },
  { label: "Visuals",     value: "visual",  icon: <ImageIcon size={12} /> },
  { label: "Projects",    value: "project", icon: <FolderOpen size={12} /> },
  { label: "Collabs",     value: "collab",  icon: <Users size={12} /> },
];
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", ...style }} />;
}
 
function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
 
// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
 
function AppSidebar() {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />,          href: "/dashboard" },
    { label: "Matches",   icon: <Users size={16} />,         href: "/matches" },
    { label: "Projects",  icon: <FolderOpen size={16} />,    href: "/projects" },
    { label: "Messages",  icon: <MessageCircle size={16} />, href: "/messages" },
    { label: "Portfolio", icon: <BookOpen size={16} />,      href: "/portfolio" },
  ];
  return (
    <div style={{ width: 220, flexShrink: 0, background: "rgba(255,255,255,0.015)", borderRight: "1px solid rgba(255,255,255,0.055)", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", position: "sticky", top: 0, height: "100vh" }}>
      <Link href="/" style={{ textDecoration: "none", marginBottom: "2.5rem", paddingLeft: "0.5rem", display: "block" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
</Link>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = item.label === "Portfolio";
          return (
            <a key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.65rem 0.85rem", borderRadius: 10,
              background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : "transparent"}`,
              color: isActive ? "#22C55E" : "rgba(240,237,230,0.45)",
              textDecoration: "none", fontSize: "0.845rem",
              fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 500 : 400, transition: "all 0.2s",
            }}
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
          <button key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: 10, background: "transparent", border: "none", color: "rgba(240,237,230,0.3)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "all 0.2s", textAlign: "left" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >{item.icon} {item.label}</button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginTop: "0.5rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #22C55E40, #22C55E15)", border: "1.5px solid #22C55E40", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.62rem", color: "#22C55E" }}>YOU</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#F0EDE6" }}>Your Name</div>
            <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Sound Producer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── ADD WORK MODAL ───────────────────────────────────────────────────────────
 
function AddWorkModal({ onClose, onAdd }: { onClose: () => void; onAdd: (w: PortfolioWork) => void }) {
  const [form, setForm] = useState({ title: "", description: "", type: "track" as WorkType, tags: "", year: new Date().getFullYear().toString() });
  const types: { value: WorkType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "track",   label: "Track / Beat",  icon: <Music size={14} />,      color: "#22C55E" },
    { value: "visual",  label: "Visual / Art",   icon: <ImageIcon size={14} />,  color: "#EC4899" },
    { value: "project", label: "Project / EP",   icon: <FolderOpen size={14} />, color: "#A855F7" },
    { value: "collab",  label: "Collab Work",    icon: <Users size={14} />,      color: "#3B82F6" },
  ];
  const selected = types.find(t => t.value === form.type)!;
  const gradients: Record<WorkType, string> = {
    track: "linear-gradient(135deg, #052e16, #166534)",
    visual: "linear-gradient(135deg, #1a0010, #831843)",
    project: "linear-gradient(135deg, #0d0014, #6b21a8)",
    collab: "linear-gradient(135deg, #030712, #1d4ed8)",
  };
  const symbols: Record<WorkType, string> = { track: "♪", visual: "◈", project: "⬡", collab: "⌖" };
 
  const handleAdd = () => {
    if (!form.title) return;
    onAdd({
      id: Date.now(), type: form.type, title: form.title,
      description: form.description, year: form.year,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      featured: false, likes: 0, views: 0,
      accentColor: selected.color,
      coverGradient: gradients[form.type],
      symbol: symbols[form.type],
    });
    onClose();
  };
 
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 520, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
      >
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.7), transparent)" }} />
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.3rem" }}>Portfolio</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.04em", color: "#F0EDE6" }}>Add new work</h2>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)" }}><X size={15} /></button>
          </div>
 
          {/* Type picker */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.6rem" }}>Work Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {types.map(t => (
                <motion.button key={t.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setForm({ ...form, type: t.value })} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.9rem", borderRadius: 10, cursor: "pointer", background: form.type === t.value ? `${t.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${form.type === t.value ? `${t.color}45` : "rgba(255,255,255,0.07)"}`, color: form.type === t.value ? t.color : "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: form.type === t.value ? 500 : 400, transition: "all 0.2s" }}>
                  <span style={{ display: "flex", color: "inherit" }}>{t.icon}</span> {t.label}
                </motion.button>
              ))}
            </div>
          </div>
 
          {/* Title */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Midnight Lagos" style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
          </div>
 
          {/* Description */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tell the story behind this work…" rows={2} style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", resize: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
          </div>
 
          {/* Tags + Year */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Tags</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Afrobeats, EP, Collab" style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Year</label>
              <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2025" style={{ width: 80, padding: "0.8rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>
          </div>
 
          {/* Upload zone */}
          <div style={{ border: "1.5px dashed rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.25rem", textAlign: "center", marginBottom: "1.5rem", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; e.currentTarget.style.background = "rgba(34,197,94,0.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "transparent"; }}
          >
            <Upload size={20} style={{ color: "rgba(240,237,230,0.25)", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Drop file here or <span style={{ color: "#22C55E", cursor: "pointer" }}>browse</span></p>
            <p style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.2)", marginTop: "0.2rem" }}>MP3, WAV, PNG, JPG, PDF up to 50MB</p>
          </div>
 
          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(34,197,94,0.25)" }} whileTap={{ scale: 0.97 }} onClick={handleAdd} style={{ width: "100%", padding: "0.9rem", background: form.title ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)", color: form.title ? "#080808" : "rgba(240,237,230,0.25)", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: form.title ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Add to Portfolio
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
 
// ─── WORK CARD ────────────────────────────────────────────────────────────────
 
function WorkCard({ work, index, onDelete, featured }: { work: PortfolioWork; index: number; onDelete: (id: number) => void; featured?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
 
  const typeLabel: Record<WorkType, string> = { track: "Track", visual: "Visual", project: "EP / Project", collab: "Collab" };
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowMenu(false); }}
      style={{
        position: "relative", borderRadius: 20,
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? `${work.accentColor}30` : "rgba(255,255,255,0.07)"}`,
        overflow: "hidden", transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      {/* Cover art area */}
      <div style={{ height: featured ? 200 : 160, background: work.coverGradient, position: "relative", overflow: "hidden" }}>
        {/* Noise texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
 
        {/* Big symbol */}
        <div style={{ position: "absolute", right: -10, bottom: -20, fontSize: featured ? "8rem" : "6rem", fontWeight: 900, color: work.accentColor, opacity: 0.12, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
          {work.symbol}
        </div>
 
        {/* Type badge */}
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${work.accentColor}40`, borderRadius: 100, padding: "3px 10px" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: work.accentColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{typeLabel[work.type]}</span>
        </div>
 
        {/* Featured star */}
        {work.featured && (
          <div style={{ position: "absolute", top: 12, right: 46, background: "rgba(234,179,8,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(234,179,8,0.4)", borderRadius: 100, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={10} fill="#EAB308" color="#EAB308" />
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: "#EAB308" }}>Featured</span>
          </div>
        )}
 
        {/* Menu button */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.6)", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
            <MoreHorizontal size={13} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, overflow: "hidden", minWidth: 150, boxShadow: "0 12px 40px rgba(0,0,0,0.7)", zIndex: 20 }}>
                {[
                  { icon: <Edit3 size={12} />, label: "Edit" },
                  { icon: <Star size={12} />, label: "Toggle Featured" },
                  { icon: <Share2 size={12} />, label: "Share" },
                  { icon: <Trash2 size={12} />, label: "Delete", danger: true },
                ].map(item => (
                  <button key={item.label} onClick={() => { if (item.label === "Delete") onDelete(work.id); setShowMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.9rem", background: "transparent", border: "none", cursor: "pointer", color: (item as any).danger ? "#EF4444" : "rgba(240,237,230,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 300, textAlign: "left", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >{item.icon} {item.label}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* Play button (tracks only) */}
        {work.type === "track" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            onClick={() => setPlaying(!playing)}
            style={{
              position: "absolute", bottom: 12, right: 12,
              width: 40, height: 40, borderRadius: "50%",
              background: work.accentColor, border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#080808",
              boxShadow: `0 0 20px ${work.accentColor}60`,
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </motion.button>
        )}
 
        {/* Duration */}
        {work.duration && (
          <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: "0.65rem", color: "rgba(240,237,230,0.5)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: 6, padding: "2px 7px", fontFamily: "'DM Sans', sans-serif" }}>
            {work.duration}
          </div>
        )}
      </div>
 
      {/* Card body */}
      <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#F0EDE6", letterSpacing: "-0.02em", lineHeight: 1.2, flex: 1, marginRight: "0.5rem" }}>{work.title}</h3>
          <span style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.3)", fontWeight: 300, flexShrink: 0 }}>{work.year}</span>
        </div>
 
        <p style={{ fontSize: "0.775rem", color: "rgba(240,237,230,0.45)", fontWeight: 300, lineHeight: 1.6, marginBottom: "0.85rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {work.description}
        </p>
 
        {/* Tags */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          {work.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 7px" }}>{tag}</span>
          ))}
        </div>
 
        {/* Collaborators */}
        {work.collaborators && work.collaborators.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem" }}>
            <div style={{ display: "flex" }}>
              {work.collaborators.map((c, i) => (
                <div key={i} title={c.name} style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}50, ${c.color}20)`, border: `1.5px solid ${c.color}40`, marginLeft: i === 0 ? 0 : -5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.48rem", fontWeight: 700, color: c.color }}>
                  {c.initials}
                </div>
              ))}
            </div>
            <span style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>
              w/ {work.collaborators.map(c => c.name).join(", ")}
            </span>
          </div>
        )}
 
        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "0.9rem" }}>
            {work.plays !== undefined && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Headphones size={11} style={{ color: "rgba(240,237,230,0.3)" }} />
                <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{formatNum(work.plays)}</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Eye size={11} style={{ color: "rgba(240,237,230,0.3)" }} />
              <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{formatNum(work.views)}</span>
            </div>
          </div>
 
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLiked(!liked)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: 6 }}
          >
            <Heart size={13} fill={liked ? "#EC4899" : "none"} color={liked ? "#EC4899" : "rgba(240,237,230,0.3)"} style={{ transition: "all 0.2s" }} />
            <span style={{ fontSize: "0.68rem", color: liked ? "#EC4899" : "rgba(240,237,230,0.4)", fontWeight: 300 }}>{formatNum(work.likes + (liked ? 1 : 0))}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── SKILL BAR ────────────────────────────────────────────────────────────────
 
function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.07, duration: 0.4 }}
      style={{ marginBottom: "1rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.7)", fontWeight: 400 }}>{skill.label}</span>
        <span style={{ fontSize: "0.72rem", color: skill.color, fontWeight: 700 }}>{skill.level}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: 0.6 + index * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`, borderRadius: 100 }}
        />
      </div>
    </motion.div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function PortfolioPage() {
  const [works, setWorks] = useState<PortfolioWork[]>(WORKS);
  const [filter, setFilter] = useState<WorkType | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState("Award-winning producer from Lagos. I craft sounds that sit between street culture and elevated artistry — Afrobeats with depth. Currently working on my debut EP and open to collab with vocalists, visual artists & developers who move with intention.");
  const [bioInput, setBioInput] = useState(bio);
 
  const filtered = filter === "all" ? works : works.filter(w => w.type === filter);
  const featured = works.filter(w => w.featured);
 
  const handleDelete = (id: number) => setWorks(prev => prev.filter(w => w.id !== id));
  const handleAdd = (w: PortfolioWork) => setWorks(prev => [w, ...prev]);
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
 
      <AppSidebar />
 
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* Background */}
        <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent)", top: -100, right: 0 }} />
        <Orb style={{ width: 350, height: 350, background: "radial-gradient(circle, rgba(168,85,247,0.05), transparent)", bottom: "30%", left: "5%", animation: "float 10s ease-in-out infinite" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
 
          {/* ── TOP BAR ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30 }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Creative Showcase</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>My Portfolio</h1>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "rgba(240,237,230,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>
                <Share2 size={13} /> Share Portfolio
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 10, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 16px rgba(34,197,94,0.2)" }}>
                <Plus size={14} /> Add Work
              </motion.button>
            </div>
          </div>
 
          <div style={{ padding: "2rem 2.5rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
 
            {/* ── LEFT: MAIN CONTENT ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
 
              {/* Profile hero */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "relative", background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 50%, transparent 100%)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 22, padding: "2rem", marginBottom: "2rem", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />
                <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(34,197,94,0.12), transparent)", top: -80, right: -50 }} />
 
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", position: "relative", zIndex: 1 }}>
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E50, #22C55E20)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#22C55E", boxShadow: "0 0 30px rgba(34,197,94,0.2)" }}>
                      YOU
                    </div>
                    <div style={{ position: "absolute", bottom: 3, right: 3, width: 12, height: 12, borderRadius: "50%", background: "#22C55E", border: "2px solid #080808", boxShadow: "0 0 8px #22C55E", animation: "pulse 2s ease-in-out infinite" }} />
                  </div>
 
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.04em", color: "#F0EDE6", marginBottom: "0.2rem" }}>Your Name</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "3px 10px" }}>
                            <Music size={10} style={{ color: "#22C55E" }} />
                            <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#22C55E" }}>Sound Producer</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, display: "flex", alignItems: "center", gap: 4 }}>
                            📍 Lagos, Nigeria
                          </span>
                        </div>
                      </div>
                   
                    </div>
 
                    {/* Bio */}
                    <div style={{ marginTop: "0.75rem" }}>
                      {editBio ? (
                        <div>
                          <textarea value={bioInput} onChange={e => setBioInput(e.target.value)} rows={3} style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.7, outline: "none", resize: "none", marginBottom: "0.5rem" }} />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => { setBio(bioInput); setEditBio(false); }} style={{ padding: "0.4rem 1rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 8, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>Save</button>
                            <button onClick={() => { setBioInput(bio); setEditBio(false); }} style={{ padding: "0.4rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                          <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.55)", fontWeight: 300, lineHeight: 1.75, flex: 1 }}>{bio}</p>
                          <button onClick={() => setEditBio(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.25)", flexShrink: 0, marginTop: 2, transition: "color 0.2s", padding: "0.25rem" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#22C55E"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(240,237,230,0.25)"}
                          ><Edit3 size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
 
                {/* Stats */}
                <div style={{ display: "flex", gap: "0", marginTop: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
                  {STATS.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }} style={{ flex: 1, padding: "0.9rem 1rem", borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}15`, border: `1px solid ${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.04em", color: "#F0EDE6", lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, marginTop: 2 }}>{s.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
 
              {/* Filter bar */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {TYPE_FILTERS.map(f => (
                  <motion.button key={f.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setFilter(f.value)} style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.5rem 1.1rem", borderRadius: 100, cursor: "pointer",
                    background: filter === f.value ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${filter === f.value ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: filter === f.value ? "#22C55E" : "rgba(240,237,230,0.45)",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                    fontWeight: filter === f.value ? 500 : 400, transition: "all 0.2s",
                  }}>
                    <span style={{ display: "flex", color: "inherit" }}>{f.icon}</span>
                    {f.label}
                    <span style={{ fontSize: "0.62rem", color: filter === f.value ? "#22C55E" : "rgba(240,237,230,0.25)", marginLeft: 2 }}>
                      {f.value === "all" ? works.length : works.filter(w => w.type === f.value).length}
                    </span>
                  </motion.button>
                ))}
              </div>
 
              {/* Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}
                >
                  {filtered.map((work, i) => (
                    <WorkCard key={work.id} work={work} index={i} onDelete={handleDelete} featured={work.featured} />
                  ))}
 
                  {/* Add work CTA card */}
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: filtered.length * 0.07, duration: 0.45 }}
                    onClick={() => setShowAddModal(true)}
                    style={{ borderRadius: 20, border: "1.5px dashed rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", cursor: "pointer", gap: "0.75rem", minHeight: 200, transition: "all 0.2s" }}
                    whileHover={{ borderColor: "rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.03)" }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Plus size={20} color="#22C55E" />
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, textAlign: "center" }}>Add new work to your portfolio</p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
 
            {/* ── RIGHT: SIDEBAR ── */}
            <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "5rem" }}>
 
              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "1.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Skills</h4>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.3)", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#22C55E"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(240,237,230,0.3)"}
                  ><Edit3 size={13} /></button>
                </div>
                {SKILLS.map((skill, i) => <SkillBar key={skill.label} skill={skill} index={i} />)}
              </motion.div>
 
              {/* Featured works */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "1.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.1rem" }}>
                  <Star size={13} fill="#EAB308" color="#EAB308" />
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Featured</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {featured.map((work, i) => (
                    <motion.div key={work.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.08 }} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.65rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${work.accentColor}25`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: work.coverGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                        {work.symbol}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#F0EDE6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{work.title}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{work.year}</div>
                      </div>
                      <ChevronRight size={12} style={{ color: "rgba(240,237,230,0.2)", flexShrink: 0 }} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
 
              {/* Portfolio link */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 16, padding: "1.25rem", textAlign: "center" }}
              >
                <Globe size={20} style={{ color: "#22C55E", margin: "0 auto 0.6rem" }} />
                <p style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.5)", fontWeight: 300, marginBottom: "0.85rem", lineHeight: 1.6 }}>Share your public portfolio with collaborators</p>
                <button style={{ width: "100%", padding: "0.65rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 9, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ExternalLink size={12} /> Copy Portfolio Link
                </button>
              </motion.div>
 
            </div>
          </div>
        </div>
      </div>
 
      {/* Add work modal */}
      <AnimatePresence>
        {showAddModal && <AddWorkModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
 