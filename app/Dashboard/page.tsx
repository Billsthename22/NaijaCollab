"use client";
 
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Users, FolderOpen, MessageCircle, Star, TrendingUp,
  Bell, Search, Plus, ArrowUpRight, ChevronRight, Music,
  Palette, Code, Camera, Video, MapPin, Check, Clock,
  Flame, Award, BookOpen, Settings, LogOut, X, MoreHorizontal
} from "lucide-react";
 
// ─── TYPES ───────────────────────────────────────────────────────────────────
 
interface Activity {
  id: number;
  type: "match" | "message" | "project" | "collab";
  text: string;
  time: string;
  accent: string;
  icon: React.ReactNode;
  read: boolean;
}
 
interface Project {
  id: number;
  name: string;
  role: string;
  members: { initials: string; color: string }[];
  progress: number;
  status: "active" | "review" | "planning";
  due: string;
  accent: string;
}
 
interface Suggestion {
  id: number;
  name: string;
  initials: string;
  role: string;
  location: string;
  matchScore: number;
  accent: string;
  online: boolean;
  roleIcon: React.ReactNode;
}
 
// ─── MOCK DATA ────────────────────────────────────────────────────────────────
 
const ACTIVITIES: Activity[] = [
  { id: 1, type: "match", text: "Tunde Adeyemi wants to collab on your music project", time: "2m ago", accent: "#22C55E", icon: <Zap size={13} />, read: false },
  { id: 2, type: "message", text: "Chisom Obi sent you a message: \"Love your portfolio!\"", time: "18m ago", accent: "#EAB308", icon: <MessageCircle size={13} />, read: false },
  { id: 3, type: "project", text: "Beat Street EP moved to Review stage", time: "1h ago", accent: "#3B82F6", icon: <FolderOpen size={13} />, read: true },
  { id: 4, type: "collab", text: "Amara Sule accepted your collaboration request", time: "3h ago", accent: "#EC4899", icon: <Users size={13} />, read: true },
  { id: 5, type: "match", text: "3 new creatives matched your Sound Producer profile", time: "5h ago", accent: "#22C55E", icon: <Zap size={13} />, read: true },
  { id: 6, type: "message", text: "Emeka Nwosu replied to your project brief", time: "Yesterday", accent: "#F97316", icon: <MessageCircle size={13} />, read: true },
];
 
const PROJECTS: Project[] = [
  {
    id: 1, name: "Beat Street EP", role: "Lead Producer",
    members: [{ initials: "TA", color: "#22C55E" }, { initials: "CO", color: "#EAB308" }, { initials: "AS", color: "#EC4899" }],
    progress: 72, status: "active", due: "Jun 14", accent: "#22C55E",
  },
  {
    id: 2, name: "Lagos Youth Brand Film", role: "Creative Director",
    members: [{ initials: "SB", color: "#F97316" }, { initials: "FA", color: "#A855F7" }],
    progress: 35, status: "planning", due: "Jul 2", accent: "#F97316",
  },
  {
    id: 3, name: "Naija Sounds App", role: "Music Consultant",
    members: [{ initials: "EN", color: "#3B82F6" }, { initials: "NE", color: "#3B82F6" }, { initials: "IM", color: "#EAB308" }],
    progress: 88, status: "review", due: "May 22", accent: "#3B82F6",
  },
];
 
const SUGGESTIONS: Suggestion[] = [
  { id: 1, name: "Kemi Adeyemi", initials: "KA", role: "Vocalist", location: "Lagos", matchScore: 96, accent: "#EC4899", online: true, roleIcon: <Music size={11} /> },
  { id: 2, name: "Bayo Osei", initials: "BO", role: "Motion Designer", location: "Accra", matchScore: 91, accent: "#A855F7", online: false, roleIcon: <Palette size={11} /> },
  { id: 3, name: "Zara Ibe", initials: "ZI", role: "Developer", location: "Remote", matchScore: 87, accent: "#3B82F6", online: true, roleIcon: <Code size={11} /> },
  { id: 4, name: "Fola Akins", initials: "FA", role: "Photographer", location: "Abuja", matchScore: 84, accent: "#F97316", online: true, roleIcon: <Camera size={11} /> },
];
 
const STATS = [
  { label: "Profile Views", value: 284, change: "+18%", icon: <TrendingUp size={16} />, accent: "#22C55E" },
  { label: "Connections", value: 47, change: "+5", icon: <Users size={16} />, accent: "#EAB308" },
  { label: "Active Projects", value: 3, change: "On track", icon: <FolderOpen size={16} />, accent: "#3B82F6" },
  { label: "Match Score", value: "94%", change: "Top 8%", icon: <Zap size={16} />, accent: "#EC4899" },
];
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", ...style }} />;
}
 
function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    active: { label: "Active", color: "#22C55E", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
    review: { label: "In Review", color: "#EAB308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)" },
    planning: { label: "Planning", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
  };
  const s = map[status];
  return (
    <span style={{ fontSize: "0.65rem", fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 100, padding: "2px 8px", letterSpacing: "0.04em" }}>
      {s.label}
    </span>
  );
}
 
function AnimatedNumber({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(0);
  const isNum = typeof value === "number";
 
  useEffect(() => {
    if (!isNum) return;
    let start = 0;
    const end = value as number;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(timer);
  }, [value, isNum]);
 
  return <>{isNum ? display.toLocaleString() : value}</>;
}
 
// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
 
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />, href: "/dashboard" },
    { label: "Matches", icon: <Users size={16} />, href: "/matches" },
    { label: "Projects", icon: <FolderOpen size={16} />, href: "/projects" },
    { label: "Messages", icon: <MessageCircle size={16} />, href: "/messages" },
    { label: "Portfolio", icon: <BookOpen size={16} />, href: "/portfolio" },
  ];
 
  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: "rgba(255,255,255,0.015)",
      borderRight: "1px solid rgba(255,255,255,0.055)",
      display: "flex", flexDirection: "column",
      padding: "1.5rem 1rem",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", marginBottom: "2.5rem", display: "block", paddingLeft: "0.5rem" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
      </a>
 
      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.label === active;
          return (
            <a key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.65rem 0.85rem", borderRadius: 10,
              background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : "transparent"}`,
              color: isActive ? "#22C55E" : "rgba(240,237,230,0.45)",
              textDecoration: "none", fontSize: "0.845rem",
              fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 500 : 400,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#F0EDE6"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,230,0.45)"; } }}
            >
              <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
 
      {/* Bottom */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {[
          { label: "Settings", icon: <Settings size={15} /> },
          { label: "Sign Out", icon: <LogOut size={15} /> },
        ].map(item => (
          <button key={item.label} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.6rem 0.85rem", borderRadius: 10,
            background: "transparent", border: "none",
            color: "rgba(240,237,230,0.3)", cursor: "pointer",
            fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            transition: "all 0.2s", textAlign: "left",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >
            {item.icon} {item.label}
          </button>
        ))}
 
        {/* User chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.75rem 0.85rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, marginTop: "0.5rem",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #22C55E40, #22C55E15)",
            border: "1.5px solid #22C55E40",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.62rem", color: "#22C55E",
          }}>YOU</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#F0EDE6", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Your Name</div>
            <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Sound Producer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── STAT CARD ────────────────────────────────────────────────────────────────
 
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "1.4rem 1.5rem",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? `${stat.accent}30` : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, position: "relative", overflow: "hidden",
        transition: "all 0.25s", cursor: "default",
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${stat.accent}80, transparent)`, borderRadius: "16px 16px 0 0" }} />
 
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${stat.accent}15`, border: `1px solid ${stat.accent}25`,
          display: "flex", alignItems: "center", justifyContent: "center", color: stat.accent,
        }}>
          {stat.icon}
        </div>
        <span style={{
          fontSize: "0.68rem", fontWeight: 600,
          color: stat.accent,
          background: `${stat.accent}12`, border: `1px solid ${stat.accent}25`,
          borderRadius: 100, padding: "2px 8px",
        }}>{stat.change}</span>
      </div>
 
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.9rem", letterSpacing: "-0.05em", color: "#F0EDE6", lineHeight: 1, marginBottom: "0.3rem" }}>
        <AnimatedNumber value={stat.value} />
      </div>
      <div style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{stat.label}</div>
    </motion.div>
  );
}
 
// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
 
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "1.25rem 1.4rem",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? `${project.accent}25` : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14, transition: "all 0.22s", cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>{project.name}</div>
          <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{project.role}</div>
        </div>
        <StatusBadge status={project.status} />
      </div>
 
      {/* Progress bar */}
      <div style={{ marginBottom: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>Progress</span>
          <span style={{ fontSize: "0.68rem", color: project.accent, fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${project.accent}, ${project.accent}80)`, borderRadius: 100 }}
          />
        </div>
      </div>
 
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Member avatars */}
        <div style={{ display: "flex" }}>
          {project.members.map((m, i) => (
            <div key={i} style={{
              width: 24, height: 24, borderRadius: "50%",
              background: `linear-gradient(135deg, ${m.color}50, ${m.color}20)`,
              border: `1.5px solid ${m.color}40`,
              marginLeft: i === 0 ? 0 : -6,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.55rem", fontWeight: 700, color: m.color,
            }}>{m.initials}</div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={11} style={{ color: "rgba(240,237,230,0.25)" }} />
          <span style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>Due {project.due}</span>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
 
export default function Dashboard() {
  const [unreadCount, setUnreadCount] = useState(ACTIVITIES.filter(a => !a.read).length);
  const [showNotifs, setShowNotifs] = useState(false);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [connectedSuggestions, setConnectedSuggestions] = useState<number[]>([]);
  const [greeting, setGreeting] = useState("Good morning");
  const notifRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);
 
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const markAllRead = () => {
    setActivities(prev => prev.map(a => ({ ...a, read: true })));
    setUnreadCount(0);
  };
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.6; transform:scale(0.85)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
 
      {/* Sidebar */}
      <Sidebar active="Dashboard" />
 
      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {/* Background */}
        <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent)", top: -150, right: 0 }} />
        <Orb style={{ width: 350, height: 350, background: "radial-gradient(circle, rgba(234,179,8,0.05), transparent)", bottom: "30%", left: "15%", animation: "float 9s ease-in-out infinite" }} />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
 
          {/* ── TOP BAR ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(8,8,8,0.8)", backdropFilter: "blur(20px)",
            position: "sticky", top: 0, zIndex: 30,
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.15rem" }}>
                {greeting} 👋
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
                Your Dashboard
              </h1>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.55rem 1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, cursor: "text",
              }}>
                <Search size={14} style={{ color: "rgba(240,237,230,0.3)" }} />
                <span style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.25)", fontWeight: 300 }}>Search…</span>
                <kbd style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.2)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "1px 5px" }}>⌘K</kbd>
              </div>
 
              {/* New Project */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.55rem 1rem",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  border: "none", borderRadius: 10,
                  color: "#080808", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                  boxShadow: "0 0 16px rgba(34,197,94,0.2)",
                }}
              >
                <Plus size={14} /> New Project
              </motion.button>
 
              {/* Notifications */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifs(!showNotifs)}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: showNotifs ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${showNotifs ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", position: "relative", color: showNotifs ? "#22C55E" : "rgba(240,237,230,0.6)",
                    transition: "all 0.2s",
                  }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: 6, right: 6,
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#22C55E", border: "1.5px solid #080808",
                      animation: "pulse-dot 2s ease-in-out infinite",
                    }} />
                  )}
                </motion.button>
 
                {/* Notification dropdown */}
                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute", top: "calc(100% + 10px)", right: 0,
                        width: 340, background: "#0d0d0d",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 16, overflow: "hidden",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: "1rem 1.25rem 0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6" }}>Notifications</span>
                        <button onClick={markAllRead} style={{ fontSize: "0.7rem", color: "#22C55E", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Mark all read
                        </button>
                      </div>
                      <div style={{ maxHeight: 320, overflowY: "auto" }}>
                        {activities.map((a) => (
                          <div key={a.id} style={{
                            display: "flex", gap: "0.75rem", alignItems: "flex-start",
                            padding: "0.85rem 1.25rem",
                            background: !a.read ? "rgba(34,197,94,0.04)" : "transparent",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            transition: "background 0.2s",
                          }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                              background: `${a.accent}15`, border: `1px solid ${a.accent}25`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: a.accent, marginTop: 2,
                            }}>
                              {a.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: "0.78rem", color: a.read ? "rgba(240,237,230,0.5)" : "rgba(240,237,230,0.85)", fontWeight: 300, lineHeight: 1.5, marginBottom: "0.2rem" }}>{a.text}</p>
                              <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.25)" }}>{a.time}</span>
                            </div>
                            {!a.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.accent, flexShrink: 0, marginTop: 6 }} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
 
          {/* ── CONTENT ── */}
          <div style={{ padding: "2rem 2.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
 
            {/* ── HERO WELCOME BANNER ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "relative", overflow: "hidden",
                background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 50%, transparent 100%)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 20, padding: "1.75rem 2rem",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(34,197,94,0.12), transparent)", borderRadius: "50%", transform: "translate(30%, -30%)" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />
 
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                  <Flame size={14} color="#EAB308" />
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EAB308" }}>Your streak: 7 days active</span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)", letterSpacing: "-0.04em", color: "#F0EDE6", marginBottom: "0.4rem" }}>
                  You have <span style={{ color: "#22C55E" }}>3 new match requests</span> waiting.
                </h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.45)", fontWeight: 300 }}>
                  Your profile is performing in the top 8% this week. Keep going.
                </p>
              </div>
 
              <motion.a
                href="/matches"
                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(34,197,94,0.3)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.8rem 1.6rem",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  color: "#080808", borderRadius: 12, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: "0.85rem", whiteSpace: "nowrap",
                  position: "relative", zIndex: 1,
                  boxShadow: "0 0 16px rgba(34,197,94,0.2)",
                }}
              >
                View Matches <ArrowUpRight size={14} />
              </motion.a>
            </motion.div>
 
            {/* ── STATS ROW ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
            </div>
 
            {/* ── MAIN 2-COL ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
 
              {/* LEFT COL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
 
                {/* Active Projects */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>Active Projects</h3>
                      <p style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Your ongoing collaborations</p>
                    </div>
                    <a href="/projects" style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: "0.75rem", color: "#22C55E", textDecoration: "none",
                      fontWeight: 500, transition: "gap 0.2s",
                    }}>View all <ChevronRight size={13} /></a>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
                  </div>
                </div>
 
                {/* Activity Feed */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>Recent Activity</h3>
                      <p style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>What's been happening</p>
                    </div>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "2px 10px" }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                    {activities.map((a, i) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
                        style={{
                          display: "flex", gap: "0.85rem", alignItems: "flex-start",
                          padding: "1rem 1.25rem",
                          background: !a.read ? "rgba(34,197,94,0.03)" : "transparent",
                          borderBottom: i < activities.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          transition: "background 0.2s",
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                          background: `${a.accent}15`, border: `1px solid ${a.accent}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: a.accent, marginTop: 1,
                        }}>
                          {a.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "0.82rem", color: a.read ? "rgba(240,237,230,0.5)" : "rgba(240,237,230,0.8)", fontWeight: 300, lineHeight: 1.5, marginBottom: "0.2rem" }}>{a.text}</p>
                          <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.25)" }}>{a.time}</span>
                        </div>
                        {!a.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.accent, flexShrink: 0, marginTop: 5, boxShadow: `0 0 6px ${a.accent}` }} />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
 
              {/* RIGHT COL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "5rem" }}>
 
                {/* Profile strength */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45 }}
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16, padding: "1.4rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                    <Award size={14} color="#EAB308" />
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Profile Strength</h4>
                  </div>
 
                  {/* Ring */}
                  <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 1.25rem" }}>
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="40"
                        fill="none" stroke="url(#grad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.76) }}
                        transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22C55E" />
                          <stop offset="100%" stopColor="#EAB308" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.05em", color: "#F0EDE6" }}>76%</span>
                      <span style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Strong</span>
                    </div>
                  </div>
 
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {[
                      { label: "Add portfolio samples", done: true },
                      { label: "Connect Spotify / SoundCloud", done: true },
                      { label: "Write your bio", done: true },
                      { label: "Add 2 more skills", done: false },
                      { label: "Get your first review", done: false },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          background: item.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${item.done ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {item.done && <Check size={10} color="#22C55E" strokeWidth={2.5} />}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: item.done ? "rgba(240,237,230,0.45)" : "rgba(240,237,230,0.7)", fontWeight: 300, textDecoration: item.done ? "line-through" : "none" }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
 
                {/* Suggested Matches */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.45 }}
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16, padding: "1.4rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Suggested for You</h4>
                    <a href="/matches" style={{ fontSize: "0.7rem", color: "#22C55E", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                      See all <ChevronRight size={12} />
                    </a>
                  </div>
 
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {SUGGESTIONS.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.7rem",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 12, transition: "all 0.2s",
                        }}
                        whileHover={{ background: "rgba(255,255,255,0.04)", borderColor: `${s.accent}25` }}
                      >
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${s.accent}40, ${s.accent}15)`,
                            border: `1.5px solid ${s.accent}35`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Syne', sans-serif", fontWeight: 800,
                            fontSize: "0.68rem", color: s.accent,
                          }}>{s.initials}</div>
                          {s.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", boxShadow: "0 0 5px #22C55E" }} />}
                        </div>
 
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#F0EDE6", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ color: s.accent, display: "flex" }}>{s.roleIcon}</span>
                            <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{s.role}</span>
                          </div>
                        </div>
 
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.65rem", color: s.accent, fontWeight: 600 }}>{s.matchScore}%</span>
                          {connectedSuggestions.includes(s.id) ? (
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Check size={11} color="#22C55E" />
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setConnectedSuggestions(prev => [...prev, s.id])}
                              style={{
                                width: 26, height: 26, borderRadius: "50%",
                                background: `${s.accent}15`, border: `1px solid ${s.accent}30`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: s.accent,
                              }}
                            >
                              <Plus size={11} />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 