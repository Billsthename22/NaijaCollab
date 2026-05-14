"use client";
 
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, FolderOpen, Users, Clock, ChevronRight,
  MoreHorizontal, Zap, Music, Palette, Code, Camera,
  Video, Check, X, ArrowUpRight, Flame, Star,
  PenLine, Trash2, UserPlus, MessageCircle, Settings,
  LogOut, BookOpen, TrendingUp, Bell, Grid3X3, List,
  Circle, AlertCircle, CheckCircle2, Filter
} from "lucide-react";
 
// ─── TYPES ───────────────────────────────────────────────────────────────────
 
type ProjectStatus = "active" | "planning" | "review" | "completed" | "paused";
type ViewMode = "grid" | "list";
 
interface Member {
  initials: string;
  color: string;
  name: string;
  role: string;
}
 
interface Task {
  id: number;
  text: string;
  done: boolean;
  assignee?: string;
}
 
interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryIcon: React.ReactNode;
  categoryColor: string;
  status: ProjectStatus;
  progress: number;
  members: Member[];
  tasks: Task[];
  due: string;
  created: string;
  tags: string[];
  pinned?: boolean;
}
 
// ─── DATA ────────────────────────────────────────────────────────────────────
 
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Beat Street EP",
    description: "A 6-track Afrobeats EP blending street culture with contemporary sound design. Features 3 collaborating vocalists and a visual identity.",
    category: "Music", categoryIcon: <Music size={13} />, categoryColor: "#22C55E",
    status: "active", progress: 72,
    members: [
      { initials: "TA", color: "#22C55E", name: "Tunde Adeyemi", role: "Producer" },
      { initials: "CO", color: "#EAB308", name: "Chisom Obi", role: "Designer" },
      { initials: "AS", color: "#EC4899", name: "Amara Sule", role: "Photographer" },
    ],
    tasks: [
      { id: 1, text: "Finalise track 4 mix", done: true, assignee: "TA" },
      { id: 2, text: "Deliver artwork files to printer", done: true, assignee: "CO" },
      { id: 3, text: "Record outro vocals", done: false, assignee: "TA" },
      { id: 4, text: "Shoot cover art session", done: false, assignee: "AS" },
      { id: 5, text: "Submit to distribution", done: false },
    ],
    due: "Jun 14, 2025", created: "Mar 2, 2025",
    tags: ["Afrobeats", "EP", "Visual Identity"],
    pinned: true,
  },
  {
    id: 2,
    name: "Lagos Youth Brand Film",
    description: "A 12-minute documentary-style brand film capturing the energy and creativity of Lagos youth culture for a global fashion label.",
    category: "Film", categoryIcon: <Video size={13} />, categoryColor: "#F97316",
    status: "planning", progress: 35,
    members: [
      { initials: "SB", color: "#F97316", name: "Seun Balogun", role: "Cinematographer" },
      { initials: "FA", color: "#A855F7", name: "Funke Adesanya", role: "Art Director" },
    ],
    tasks: [
      { id: 1, text: "Finalise shot list", done: true, assignee: "SB" },
      { id: 2, text: "Scout Balogun Market location", done: true, assignee: "FA" },
      { id: 3, text: "Confirm talent lineup", done: false },
      { id: 4, text: "Equipment hire & logistics", done: false, assignee: "SB" },
      { id: 5, text: "Storyboard approval from client", done: false },
    ],
    due: "Jul 2, 2025", created: "Apr 10, 2025",
    tags: ["Documentary", "Branding", "Fashion"],
  },
  {
    id: 3,
    name: "Naija Sounds App",
    description: "A mobile-first streaming app surfacing underground Nigerian artists. Currently in beta with 400+ early signups.",
    category: "Tech", categoryIcon: <Code size={13} />, categoryColor: "#3B82F6",
    status: "review", progress: 88,
    members: [
      { initials: "EN", color: "#3B82F6", name: "Emeka Nwosu", role: "Lead Dev" },
      { initials: "NE", color: "#60A5FA", name: "Ngozi Eze", role: "Backend" },
      { initials: "IM", color: "#EAB308", name: "Ike Martins", role: "Designer" },
    ],
    tasks: [
      { id: 1, text: "Fix onboarding flow bugs", done: true, assignee: "EN" },
      { id: 2, text: "Implement push notifications", done: true, assignee: "NE" },
      { id: 3, text: "Final QA pass", done: true, assignee: "EN" },
      { id: 4, text: "App Store submission", done: false, assignee: "IM" },
      { id: 5, text: "Press release & launch email", done: false },
    ],
    due: "May 22, 2025", created: "Jan 15, 2025",
    tags: ["Mobile", "Streaming", "Beta"],
  },
  {
    id: 4,
    name: "Abuja Arts Exhibition",
    description: "A group showcase of 8 digital artists exploring identity, technology, and African futurism. Venue secured at Terra Kulture.",
    category: "Art", categoryIcon: <Palette size={13} />, categoryColor: "#A855F7",
    status: "completed", progress: 100,
    members: [
      { initials: "FA", color: "#A855F7", name: "Funke Adesanya", role: "Lead Artist" },
      { initials: "AS", color: "#EC4899", name: "Amara Sule", role: "Photographer" },
    ],
    tasks: [
      { id: 1, text: "Curate final artwork selection", done: true },
      { id: 2, text: "Print & frame all pieces", done: true },
      { id: 3, text: "Event night coordination", done: true },
      { id: 4, text: "Post-event media coverage", done: true },
    ],
    due: "Apr 5, 2025", created: "Feb 1, 2025",
    tags: ["Exhibition", "Digital Art", "AfroFuturism"],
  },
  {
    id: 5,
    name: "Streetwear Lookbook",
    description: "Seasonal lookbook shoot for an emerging Lagos streetwear label. Targeting 30 editorial images across 3 locations.",
    category: "Photography", categoryIcon: <Camera size={13} />, categoryColor: "#EC4899",
    status: "paused", progress: 20,
    members: [
      { initials: "AS", color: "#EC4899", name: "Amara Sule", role: "Photographer" },
    ],
    tasks: [
      { id: 1, text: "Mood board sign-off", done: true },
      { id: 2, text: "Model casting", done: false },
      { id: 3, text: "Location permits", done: false },
    ],
    due: "Aug 1, 2025", created: "May 1, 2025",
    tags: ["Fashion", "Lookbook", "Editorial"],
  },
];
 
const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  active:    { label: "Active",     color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)",   icon: <Flame size={11} /> },
  planning:  { label: "Planning",   color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)",  icon: <Circle size={11} /> },
  review:    { label: "In Review",  color: "#EAB308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)",   icon: <AlertCircle size={11} /> },
  completed: { label: "Completed",  color: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.25)",  icon: <CheckCircle2 size={11} /> },
  paused:    { label: "Paused",     color: "#6B7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)", icon: <Clock size={11} /> },
};
 
const FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Planning", value: "planning" },
  { label: "In Review", value: "review" },
  { label: "Completed", value: "completed" },
  { label: "Paused", value: "paused" },
];
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", ...style }} />;
}
 
function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: "0.65rem", fontWeight: 600, color: s.color,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 100, padding: "3px 9px", letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}>
      {s.icon} {s.label}
    </span>
  );
}
 
// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
 
function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />, href: "/dashboard" },
    { label: "Matches",   icon: <Users size={16} />, href: "/matches" },
    { label: "Projects",  icon: <FolderOpen size={16} />, href: "/projects" },
    { label: "Messages",  icon: <MessageCircle size={16} />, href: "/messages" },
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
      <a href="/" style={{ textDecoration: "none", marginBottom: "2.5rem", paddingLeft: "0.5rem", display: "block" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
      </a>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = item.label === "Projects";
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
          <button key={item.label} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.6rem 0.85rem", borderRadius: 10,
            background: "transparent", border: "none", color: "rgba(240,237,230,0.3)",
            cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400, transition: "all 0.2s", textAlign: "left",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >{item.icon} {item.label}</button>
        ))}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.75rem 0.85rem", background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginTop: "0.5rem",
        }}>
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
 
// ─── NEW PROJECT MODAL ────────────────────────────────────────────────────────
 
function NewProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Project) => void }) {
  const [form, setForm] = useState({ name: "", description: "", category: "Music", due: "", tags: "" });
  const [step, setStep] = useState(1);
  const categories = [
    { label: "Music", icon: <Music size={15} />, color: "#22C55E" },
    { label: "Film", icon: <Video size={15} />, color: "#F97316" },
    { label: "Tech", icon: <Code size={15} />, color: "#3B82F6" },
    { label: "Art", icon: <Palette size={15} />, color: "#A855F7" },
    { label: "Photography", icon: <Camera size={15} />, color: "#EC4899" },
  ];
  const selectedCat = categories.find(c => c.label === form.category)!;
 
  const handleCreate = () => {
    const catMap: Record<string, React.ReactNode> = { Music: <Music size={13}/>, Film: <Video size={13}/>, Tech: <Code size={13}/>, Art: <Palette size={13}/>, Photography: <Camera size={13}/> };
    const colorMap: Record<string, string> = { Music: "#22C55E", Film: "#F97316", Tech: "#3B82F6", Art: "#A855F7", Photography: "#EC4899" };
    onCreate({
      id: Date.now(), name: form.name, description: form.description,
      category: form.category, categoryIcon: catMap[form.category], categoryColor: colorMap[form.category],
      status: "planning", progress: 0,
      members: [{ initials: "YOU", color: colorMap[form.category], name: "You", role: "Owner" }],
      tasks: [], due: form.due || "TBD", created: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };
 
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 500, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
      >
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.7), transparent)" }} />
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.3rem" }}>Step {step} of 2</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.04em", color: "#F0EDE6" }}>
                {step === 1 ? "Name your project" : "Set the details"}
              </h2>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)" }}><X size={16} /></button>
          </div>
 
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                {/* Project name */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Project Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Beat Street EP" style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>
 
                {/* Description */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What are you building together?" rows={3} style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", resize: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>
 
                {/* Category */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.75rem" }}>Category</label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {categories.map(cat => (
                      <motion.button key={cat.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setForm({ ...form, category: cat.label })} style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.5rem 1rem", borderRadius: 100, cursor: "pointer",
                        background: form.category === cat.label ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.category === cat.label ? `${cat.color}45` : "rgba(255,255,255,0.07)"}`,
                        color: form.category === cat.label ? cat.color : "rgba(240,237,230,0.45)",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: form.category === cat.label ? 500 : 400,
                        transition: "all 0.2s",
                      }}>
                        <span style={{ display: "flex", color: "inherit" }}>{cat.icon}</span> {cat.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
 
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => form.name && setStep(2)} style={{
                  width: "100%", padding: "0.9rem", background: form.name ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)",
                  color: form.name ? "#080808" : "rgba(240,237,230,0.25)", border: "none", borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem",
                  cursor: form.name ? "pointer" : "not-allowed", transition: "all 0.2s",
                }}>Continue →</motion.button>
              </motion.div>
            )}
 
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Due Date (optional)</label>
                  <input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", colorScheme: "dark" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.5rem" }}>Tags <span style={{ color: "rgba(240,237,230,0.2)", textTransform: "none", letterSpacing: 0 }}>comma-separated</span></label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. Afrobeats, EP, Collab" style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>
 
                {/* Preview pill */}
                <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${selectedCat.color}15`, border: `1px solid ${selectedCat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: selectedCat.color }}>
                    {selectedCat.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6" }}>{form.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.35)" }}>{form.category} · Planning · Just started</div>
                  </div>
                </div>
 
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "0.9rem 1.2rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", cursor: "pointer" }}>←</button>
                  <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(34,197,94,0.25)" }} whileTap={{ scale: 0.97 }} onClick={handleCreate} style={{ flex: 1, padding: "0.9rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#080808", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                    Create Project 🚀
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
 
// ─── PROJECT DETAIL PANEL ─────────────────────────────────────────────────────
 
function ProjectPanel({ project, onClose, onUpdateTask }: { project: Project; onClose: () => void; onUpdateTask: (projectId: number, taskId: number) => void }) {
  const [newTask, setNewTask] = useState("");
  const completedTasks = project.tasks.filter(t => t.done).length;
  const s = STATUS_CONFIG[project.status];
 
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 80 }} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 90,
          width: 440, background: "#0d0d0d",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${project.categoryColor}80, transparent)`, flexShrink: 0 }} />
 
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${project.categoryColor}15`, border: `1px solid ${project.categoryColor}25`, display: "flex", alignItems: "center", justifyContent: "center", color: project.categoryColor }}>
                {project.categoryIcon}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>{project.name}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{project.category} · Created {project.created}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)", flexShrink: 0 }}><X size={15} /></button>
          </div>
 
          <p style={{ fontSize: "0.82rem", color: "rgba(240,237,230,0.5)", fontWeight: 300, lineHeight: 1.65, marginBottom: "1rem" }}>{project.description}</p>
 
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
            <StatusBadge status={project.status} />
            {project.tags.map(tag => (
              <span key={tag} style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "2px 8px" }}>{tag}</span>
            ))}
          </div>
 
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={12} style={{ color: "rgba(240,237,230,0.3)" }} />
              <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>Due {project.due}</span>
            </div>
            <div style={{ display: "flex" }}>
              {project.members.map((m, i) => (
                <div key={i} title={m.name} style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${m.color}50, ${m.color}20)`,
                  border: `1.5px solid ${m.color}40`,
                  marginLeft: i === 0 ? 0 : -6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontWeight: 700, color: m.color,
                }}>{m.initials}</div>
              ))}
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", marginLeft: -6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Plus size={10} color="rgba(240,237,230,0.5)" />
              </div>
            </div>
          </div>
        </div>
 
        {/* Progress */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, letterSpacing: "0.08em", textTransform: "uppercase" }}>Overall Progress</span>
            <span style={{ fontSize: "0.72rem", color: project.categoryColor, fontWeight: 700 }}>{project.progress}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${project.categoryColor}, ${project.categoryColor}80)`, borderRadius: 100 }}
            />
          </div>
        </div>
 
        {/* Tasks */}
        <div style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Tasks</h4>
            <span style={{ fontSize: "0.68rem", color: project.categoryColor, fontWeight: 600 }}>{completedTasks}/{project.tasks.length} done</span>
          </div>
 
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {project.tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.7rem 0.9rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, transition: "background 0.2s" }}
                whileHover={{ background: "rgba(255,255,255,0.04)" }}
              >
                <button onClick={() => onUpdateTask(project.id, task.id)} style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: task.done ? `${project.categoryColor}20` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${task.done ? project.categoryColor : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  {task.done && <Check size={11} color={project.categoryColor} strokeWidth={2.5} />}
                </button>
                <span style={{ flex: 1, fontSize: "0.82rem", color: task.done ? "rgba(240,237,230,0.35)" : "rgba(240,237,230,0.75)", fontWeight: 300, textDecoration: task.done ? "line-through" : "none", lineHeight: 1.4 }}>
                  {task.text}
                </span>
                {task.assignee && (
                  <span style={{ fontSize: "0.62rem", color: "rgba(240,237,230,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>{task.assignee}</span>
                )}
              </motion.div>
            ))}
          </div>
 
          {/* Add task */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Add a task…"
              style={{ flex: 1, padding: "0.65rem 0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.35)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
            />
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }} style={{ width: 36, height: 36, borderRadius: 10, background: newTask ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.05)", border: "none", cursor: newTask ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", color: newTask ? "#080808" : "rgba(240,237,230,0.2)", transition: "background 0.2s", flexShrink: 0 }}>
              <Plus size={16} />
            </motion.button>
          </div>
        </div>
 
        {/* Actions footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "0.6rem", flexShrink: 0 }}>
          <button style={{ flex: 1, padding: "0.7rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <UserPlus size={13} /> Invite
          </button>
          <button style={{ flex: 1, padding: "0.7rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <MessageCircle size={13} /> Chat
          </button>
          <button style={{ flex: 1, padding: "0.7rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <PenLine size={13} /> Edit
          </button>
        </div>
      </motion.div>
    </>
  );
}
 
// ─── PROJECT GRID CARD ────────────────────────────────────────────────────────
 
function ProjectGridCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const completedTasks = project.tasks.filter(t => t.done).length;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: "relative", padding: "1.5rem",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? `${project.categoryColor}30` : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18, cursor: "pointer",
        transition: "all 0.22s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${project.categoryColor}80, transparent)`, borderRadius: "18px 18px 0 0" }} />
 
      {/* Pinned indicator */}
      {project.pinned && (
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <Star size={13} fill="#EAB308" color="#EAB308" />
        </div>
      )}
 
      {/* Category icon + name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", marginBottom: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${project.categoryColor}15`, border: `1px solid ${project.categoryColor}20`, display: "flex", alignItems: "center", justifyContent: "center", color: project.categoryColor, flexShrink: 0 }}>
          {project.categoryIcon}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: project.pinned ? "1.5rem" : "0" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{project.name}</div>
          <StatusBadge status={project.status} />
        </div>
      </div>
 
      {/* Description */}
      <p style={{ fontSize: "0.79rem", color: "rgba(240,237,230,0.45)", fontWeight: 300, lineHeight: 1.6, marginBottom: "1.1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {project.description}
      </p>
 
      {/* Progress */}
      <div style={{ marginBottom: "1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.67rem", color: "rgba(240,237,230,0.3)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.08em" }}>Progress</span>
          <span style={{ fontSize: "0.67rem", color: project.categoryColor, fontWeight: 700 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: 0.3 + index * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${project.categoryColor}, ${project.categoryColor}70)`, borderRadius: 100 }}
          />
        </div>
      </div>
 
      {/* Tags */}
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.1rem", flexWrap: "wrap" }}>
        {project.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 7px" }}>{tag}</span>
        ))}
      </div>
 
      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex" }}>
          {project.members.map((m, i) => (
            <div key={i} title={m.name} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}50, ${m.color}20)`, border: `1.5px solid ${m.color}40`, marginLeft: i === 0 ? 0 : -6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.52rem", fontWeight: 700, color: m.color }}>{m.initials}</div>
          ))}
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>
            {project.tasks.length > 0 ? `${completedTasks}/${project.tasks.length} tasks` : "No tasks yet"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "rgba(240,237,230,0.3)" }}>
            <Clock size={11} />
            <span style={{ fontSize: "0.67rem", fontWeight: 300 }}>{project.due}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── PROJECT LIST ROW ─────────────────────────────────────────────────────────
 
function ProjectListRow({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "1rem 1.25rem",
        background: hovered ? "rgba(255,255,255,0.035)" : "transparent",
        border: `1px solid ${hovered ? `${project.categoryColor}20` : "rgba(255,255,255,0.05)"}`,
        borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${project.categoryColor}15`, border: `1px solid ${project.categoryColor}20`, display: "flex", alignItems: "center", justifyContent: "center", color: project.categoryColor, flexShrink: 0 }}>
        {project.categoryIcon}
      </div>
 
      <div style={{ flex: 2, minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#F0EDE6", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{project.name}</div>
        <div style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{project.category}</div>
      </div>
 
      <div style={{ flex: 1 }}><StatusBadge status={project.status} /></div>
 
      <div style={{ flex: 2, minWidth: 120 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "0.65rem", color: project.categoryColor, fontWeight: 700 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: project.categoryColor, borderRadius: 100 }}
          />
        </div>
      </div>
 
      <div style={{ flex: 1, display: "flex" }}>
        {project.members.slice(0, 3).map((m, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}50, ${m.color}20)`, border: `1.5px solid ${m.color}40`, marginLeft: i === 0 ? 0 : -5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 700, color: m.color }}>{m.initials}</div>
        ))}
      </div>
 
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <Clock size={11} style={{ color: "rgba(240,237,230,0.3)" }} />
        <span style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{project.due}</span>
      </div>
 
      <ChevronRight size={14} style={{ color: "rgba(240,237,230,0.2)", flexShrink: 0 }} />
    </motion.div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
 
  const filtered = projects.filter(p => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
 
  const pinnedProjects = filtered.filter(p => p.pinned);
  const otherProjects = filtered.filter(p => !p.pinned);
 
  const handleUpdateTask = (projectId: number, taskId: number) => {
    setProjects(prev => prev.map(p => p.id === projectId
      ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
      : p
    ));
    if (activeProject?.id === projectId) {
      setActiveProject(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      } : null);
    }
  };
 
  const handleCreate = (p: Project) => {
    setProjects(prev => [p, ...prev]);
  };
 
  const stats = [
    { label: "Total",     value: projects.length,                                    color: "#F0EDE6" },
    { label: "Active",    value: projects.filter(p => p.status === "active").length,    color: "#22C55E" },
    { label: "Review",    value: projects.filter(p => p.status === "review").length,    color: "#EAB308" },
    { label: "Done",      value: projects.filter(p => p.status === "completed").length, color: "#A855F7" },
  ];
 
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
      `}</style>
 
      <Sidebar />
 
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent)", top: -100, right: 0 }} />
        <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(168,85,247,0.05), transparent)", bottom: "20%", left: "10%", animation: "float 10s ease-in-out infinite" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30 }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Workspace</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>My Projects</h1>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* View toggle */}
              <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "0.25rem", gap: "0.2rem" }}>
                {([["grid", <Grid3X3 size={14} />], ["list", <List size={14} />]] as [ViewMode, React.ReactNode][]).map(([v, icon]) => (
                  <button key={v} onClick={() => setView(v)} style={{ width: 30, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "rgba(34,197,94,0.15)" : "transparent", border: `1px solid ${view === v ? "rgba(34,197,94,0.3)" : "transparent"}`, color: view === v ? "#22C55E" : "rgba(240,237,230,0.35)", cursor: "pointer", transition: "all 0.2s" }}>
                    {icon}
                  </button>
                ))}
              </div>
 
              {/* New project button */}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowNewModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 10, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 16px rgba(34,197,94,0.2)", whiteSpace: "nowrap" }}>
                <Plus size={14} /> New Project
              </motion.button>
            </div>
          </div>
 
          <div style={{ padding: "2rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
 
            {/* Stats row */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }} style={{ padding: "0.85rem 1.5rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.05em", color: s.color, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, lineHeight: 1.3 }}>{s.label}<br />Projects</span>
                </motion.div>
              ))}
            </div>
 
            {/* Search + filter */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative", background: "rgba(255,255,255,0.03)", border: `1px solid ${searchFocused ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, transition: "border-color 0.2s", boxShadow: searchFocused ? "0 0 0 3px rgba(34,197,94,0.07)" : "none" }}>
                <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,230,0.3)" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Search projects, tags…" style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.6rem", background: "transparent", border: "none", outline: "none", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }} />
                {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.3)", display: "flex" }}><X size={13} /></button>}
              </div>
 
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {FILTERS.map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} style={{
                    padding: "0.5rem 1rem", borderRadius: 100, fontSize: "0.75rem",
                    background: filter === f.value ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${filter === f.value ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: filter === f.value ? "#22C55E" : "rgba(240,237,230,0.45)",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: filter === f.value ? 500 : 400,
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}>{f.label}</button>
                ))}
              </div>
            </div>
 
            {/* Pinned */}
            {pinnedProjects.length > 0 && filter === "all" && !search && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                  <Star size={12} fill="#EAB308" color="#EAB308" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EAB308" }}>Pinned</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr", gap: "1rem" }}>
                  {pinnedProjects.map((p, i) =>
                    view === "grid"
                      ? <ProjectGridCard key={p.id} project={p} index={i} onClick={() => setActiveProject(p)} />
                      : <ProjectListRow key={p.id} project={p} index={i} onClick={() => setActiveProject(p)} />
                  )}
                </div>
              </div>
            )}
 
            {/* All projects */}
            <div>
              {pinnedProjects.length > 0 && filter === "all" && !search && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                  <FolderOpen size={12} style={{ color: "rgba(240,237,230,0.3)" }} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)" }}>All Projects</span>
                </div>
              )}
 
              {otherProjects.length === 0 && pinnedProjects.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "5rem 0" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📁</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>No projects found</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, marginBottom: "1.5rem" }}>Try a different filter or start a new collab</p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowNewModal(true)} style={{ padding: "0.75rem 1.75rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 10, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                    <Plus size={14} style={{ display: "inline", marginRight: 6 }} /> Start a Project
                  </motion.button>
                </motion.div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr", gap: "1rem" }}>
                  {otherProjects.map((p, i) =>
                    view === "grid"
                      ? <ProjectGridCard key={p.id} project={p} index={i + pinnedProjects.length} onClick={() => setActiveProject(p)} />
                      : <ProjectListRow key={p.id} project={p} index={i + pinnedProjects.length} onClick={() => setActiveProject(p)} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {/* Detail panel */}
      <AnimatePresence>
        {activeProject && (
          <ProjectPanel
            project={activeProject}
            onClose={() => setActiveProject(null)}
            onUpdateTask={handleUpdateTask}
          />
        )}
      </AnimatePresence>
 
      {/* New project modal */}
      <AnimatePresence>
        {showNewModal && (
          <NewProjectModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  );
}
 