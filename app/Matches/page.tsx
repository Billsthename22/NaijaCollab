"use client";
 
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, MapPin, Zap, Star,
  MessageCircle, UserPlus, X, ChevronDown, Sparkles,
  Music, Code, Palette, Camera, Video, Cpu, Check
} from "lucide-react";
 
// ─── TYPES ───────────────────────────────────────────────────────────────────
 
interface Creative {
  id: number;
  name: string;
  initials: string;
  role: string;
  roleIcon: React.ReactNode;
  location: string;
  tags: string[];
  matchScore: number;
  accentColor: string;
  bio: string;
  collab: number;
  rating: number;
  online: boolean;
}
 
// ─── DATA ────────────────────────────────────────────────────────────────────
 
const ALL_CREATIVES: Creative[] = [
  {
    id: 1, name: "Tunde Adeyemi", initials: "TA", role: "Sound Producer",
    roleIcon: <Music size={12} />, location: "Lagos, NG",
    tags: ["Afrobeats", "Mixing", "Pro Tools"],
    matchScore: 98, accentColor: "#22C55E", bio: "Award-winning producer behind 3 charting Afrobeats records. Looking for vocalists and lyricists ready to go big.",
    collab: 14, rating: 4.9, online: true,
  },
  {
    id: 2, name: "Chisom Obi", initials: "CO", role: "UI/UX Designer",
    roleIcon: <Palette size={12} />, location: "Abuja, NG",
    tags: ["Figma", "Motion", "Branding"],
    matchScore: 94, accentColor: "#EAB308", bio: "Design lead at a Lagos startup. Obsessed with interfaces that feel alive. Let's build something people actually love.",
    collab: 9, rating: 4.8, online: true,
  },
  {
    id: 3, name: "Emeka Nwosu", initials: "EN", role: "Full-Stack Dev",
    roleIcon: <Code size={12} />, location: "Port Harcourt, NG",
    tags: ["React", "Node.js", "Web3"],
    matchScore: 91, accentColor: "#3B82F6", bio: "Building the infrastructure for the next wave of Nigerian tech. Need a designer or product thinker to partner with.",
    collab: 22, rating: 4.7, online: false,
  },
  {
    id: 4, name: "Amara Sule", initials: "AS", role: "Photographer",
    roleIcon: <Camera size={12} />, location: "Lagos, NG",
    tags: ["Editorial", "Portraiture", "Brand"],
    matchScore: 88, accentColor: "#EC4899", bio: "Visual storyteller. Shot campaigns for 12+ Nigerian brands. Looking for creative directors and stylists to collaborate with.",
    collab: 31, rating: 5.0, online: true,
  },
  {
    id: 5, name: "Seun Balogun", initials: "SB", role: "Videographer",
    roleIcon: <Video size={12} />, location: "Ibadan, NG",
    tags: ["Cinematography", "Color Grading", "Docs"],
    matchScore: 85, accentColor: "#F97316", bio: "Director of photography for short films and music videos. Currently building a documentary series on Nigerian youth culture.",
    collab: 7, rating: 4.6, online: false,
  },
  {
    id: 6, name: "Funke Adesanya", initials: "FA", role: "Visual Artist",
    roleIcon: <Sparkles size={12} />, location: "Remote",
    tags: ["Digital Art", "NFT", "Illustration"],
    matchScore: 82, accentColor: "#A855F7", bio: "Digital artist and illustrator. My work has been featured in 4 international exhibitions. Let's create something that outlasts us.",
    collab: 18, rating: 4.8, online: true,
  },
  {
    id: 7, name: "Dayo Okonkwo", initials: "DO", role: "Sound Producer",
    roleIcon: <Music size={12} />, location: "Lagos, NG",
    tags: ["Amapiano", "Sampling", "Ableton"],
    matchScore: 79, accentColor: "#22C55E", bio: "Amapiano specialist. Released 2 EPs independently. Currently looking for vocalists and visual artists for my next project.",
    collab: 5, rating: 4.5, online: true,
  },
  {
    id: 8, name: "Ngozi Eze", initials: "NE", role: "Full-Stack Dev",
    roleIcon: <Code size={12} />, location: "Enugu, NG",
    tags: ["Python", "AI/ML", "Product"],
    matchScore: 76, accentColor: "#3B82F6", bio: "AI engineer and product thinker. Building tools for African creatives. Looking for designers and storytellers.",
    collab: 11, rating: 4.7, online: false,
  },
  {
    id: 9, name: "Ike Martins", initials: "IM", role: "UI/UX Designer",
    roleIcon: <Palette size={12} />, location: "Remote",
    tags: ["Product Design", "Systems", "Framer"],
    matchScore: 73, accentColor: "#EAB308", bio: "Systems thinker and product designer. 5 years experience across fintech and creative tools. Remote-first.",
    collab: 16, rating: 4.9, online: true,
  },
];
 
const ROLE_FILTERS = [
  { label: "All", icon: <Sparkles size={13} /> },
  { label: "Producer", icon: <Music size={13} /> },
  { label: "Designer", icon: <Palette size={13} /> },
  { label: "Developer", icon: <Code size={13} /> },
  { label: "Photographer", icon: <Camera size={13} /> },
  { label: "Videographer", icon: <Video size={13} /> },
  { label: "Artist", icon: <Cpu size={13} /> },
];
 
// ─── ORB ─────────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", ...style }} />;
}
 
// ─── MATCH CARD ──────────────────────────────────────────────────────────────
 
function MatchCard({
  creative,
  index,
  onConnect,
  onMessage,
  connected,
}: {
  creative: Creative;
  index: number;
  onConnect: (id: number) => void;
  onMessage: (creative: Creative) => void;
  connected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? `${creative.accentColor}30` : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18,
        padding: "1.5rem",
        cursor: "default",
        transition: "background 0.25s, border-color 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        overflow: "hidden",
      }}
    >
      {/* Top glow on hover */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg, transparent, ${creative.accentColor}60, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
      }} />
 
      {/* Match score badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        display: "flex", alignItems: "center", gap: 4,
        background: `${creative.accentColor}15`,
        border: `1px solid ${creative.accentColor}30`,
        borderRadius: 100, padding: "3px 10px",
      }}>
        <Zap size={10} fill={creative.accentColor} color={creative.accentColor} />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: creative.accentColor, letterSpacing: "0.04em" }}>
          {creative.matchScore}% match
        </span>
      </div>
 
      {/* Avatar row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", marginBottom: "1rem" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: `linear-gradient(135deg, ${creative.accentColor}40, ${creative.accentColor}15)`,
            border: `1.5px solid ${creative.accentColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "0.85rem", color: creative.accentColor,
          }}>
            {creative.initials}
          </div>
          {/* Online dot */}
          {creative.online && (
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: 10, height: 10, borderRadius: "50%",
              background: "#22C55E", border: "2px solid #080808",
              boxShadow: "0 0 6px #22C55E",
            }} />
          )}
        </div>
 
        <div style={{ flex: 1, paddingRight: "4rem" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>
            {creative.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: `${creative.accentColor}12`,
              border: `1px solid ${creative.accentColor}25`,
              borderRadius: 6, padding: "2px 8px",
            }}>
              <span style={{ color: creative.accentColor, display: "flex" }}>{creative.roleIcon}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 500, color: creative.accentColor }}>{creative.role}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={10} style={{ color: "rgba(240,237,230,0.3)" }} />
              <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{creative.location}</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Bio */}
      <p style={{
        fontSize: "0.82rem", color: "rgba(240,237,230,0.5)",
        fontWeight: 300, lineHeight: 1.65,
        marginBottom: "1rem",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {creative.bio}
      </p>
 
      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
        {creative.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: "0.7rem", fontWeight: 400,
            color: "rgba(240,237,230,0.4)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 6, padding: "2px 8px",
          }}>{tag}</span>
        ))}
      </div>
 
      {/* Stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Star size={11} fill="#EAB308" color="#EAB308" />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#F0EDE6" }}>{creative.rating}</span>
        </div>
        <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.08)" }} />
        <span style={{ fontSize: "0.73rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>
          <strong style={{ color: "rgba(240,237,230,0.7)", fontWeight: 600 }}>{creative.collab}</strong> collabs
        </span>
        {creative.online && (
          <>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "0.72rem", color: "#22C55E", fontWeight: 400, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              Online now
            </span>
          </>
        )}
      </div>
 
      {/* Actions */}
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onMessage(creative)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "0.65rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, color: "rgba(240,237,230,0.6)",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 400,
            cursor: "pointer", transition: "background 0.2s, border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#F0EDE6"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(240,237,230,0.6)"; }}
        >
          <MessageCircle size={13} /> Message
        </motion.button>
 
        <motion.button
          whileHover={!connected ? { scale: 1.03, boxShadow: `0 0 20px ${creative.accentColor}30` } : {}}
          whileTap={!connected ? { scale: 0.96 } : {}}
          onClick={() => !connected && onConnect(creative.id)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "0.65rem",
            background: connected
              ? "rgba(34,197,94,0.1)"
              : `linear-gradient(135deg, ${creative.accentColor}, ${creative.accentColor}cc)`,
            border: connected ? "1px solid rgba(34,197,94,0.3)" : "none",
            borderRadius: 10,
            color: connected ? "#22C55E" : "#080808",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: connected ? 400 : 600,
            cursor: connected ? "default" : "pointer",
            transition: "all 0.25s",
          }}
        >
          {connected ? <><Check size={13} /> Connected</> : <><UserPlus size={13} /> Connect</>}
        </motion.button>
      </div>
    </motion.div>
  );
}
 
// ─── MESSAGE DRAWER ───────────────────────────────────────────────────────────
 
function MessageDrawer({
  creative,
  onClose,
}: {
  creative: Creative | null;
  onClose: () => void;
}) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
 
  const handleSend = () => {
    if (!msg.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setMsg(""); }, 2000);
  };
 
  return (
    <AnimatePresence>
      {creative && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 80 }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 90,
              width: 380, background: "#0d0d0d",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Drawer header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${creative.accentColor}40, ${creative.accentColor}15)`,
                  border: `1.5px solid ${creative.accentColor}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "0.78rem", color: creative.accentColor,
                }}>
                  {creative.initials}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F0EDE6" }}>{creative.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{creative.role} · {creative.location}</div>
                </div>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)" }}>
                <X size={16} />
              </button>
            </div>
 
            {/* Chat area */}
            <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "0.85rem" }}>
              {/* Starter prompts */}
              <div style={{ marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Quick starters</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    `Hey ${creative.name.split(" ")[0]}, I'd love to collab!`,
                    `Your work is amazing. Are you open to a project?`,
                    `I have an idea I think you'd be perfect for.`,
                  ].map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => setMsg(starter)}
                      style={{
                        textAlign: "left", padding: "0.6rem 0.85rem",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 8, color: "rgba(240,237,230,0.5)",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300,
                        cursor: "pointer", transition: "background 0.2s, color 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#F0EDE6"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(240,237,230,0.5)"; }}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Input */}
            <div style={{ padding: "1rem 1.5rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: "center", padding: "1rem", color: "#22C55E", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Check size={16} /> Message sent!
                  </motion.div>
                ) : (
                  <motion.div key="input" style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSend()}
                      placeholder={`Message ${creative.name.split(" ")[0]}…`}
                      style={{
                        flex: 1, padding: "0.75rem 1rem",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10, color: "#F0EDE6",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
                        outline: "none",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: msg.trim() ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.05)",
                        border: "none", cursor: msg.trim() ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: msg.trim() ? "#080808" : "rgba(240,237,230,0.2)",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function MatchesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [activeCreative, setActiveCreative] = useState<Creative | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Match Score");
  const [searchFocused, setSearchFocused] = useState(false);
 
  const locations = ["All", "Lagos, NG", "Abuja, NG", "Port Harcourt, NG", "Remote"];
  const sortOptions = ["Match Score", "Rating", "Collabs", "Online First"];
 
  const filtered = ALL_CREATIVES
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = activeFilter === "All" ||
        c.role.toLowerCase().includes(activeFilter.toLowerCase());
      const matchesLocation = locationFilter === "All" || c.location === locationFilter;
      return matchesSearch && matchesRole && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === "Match Score") return b.matchScore - a.matchScore;
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Collabs") return b.collab - a.collab;
      if (sortBy === "Online First") return (b.online ? 1 : 0) - (a.online ? 1 : 0);
      return 0;
    });
 
  const handleConnect = (id: number) => {
    setConnectedIds(prev => [...prev, id]);
  };
 
  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#F0EDE6",
      fontFamily: "'DM Sans', sans-serif", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
 
      {/* Background orbs */}
      <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,197,94,0.08), transparent)", top: -100, left: -100 }} />
      <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(234,179,8,0.05), transparent)", bottom: "20%", right: -100, animation: "float 8s ease-in-out infinite" }} />
 
      {/* Grid texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
 
      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
            Naija<span style={{ color: "#22C55E" }}>Collab</span>
          </span>
        </a>
 
        <div style={{ display: "flex", gap: "0.4rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.3rem" }}>
          {["Matches", "Projects", "Messages", "Profile"].map((item) => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{
              padding: "0.45rem 1rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 400,
              color: item === "Matches" ? "#080808" : "rgba(240,237,230,0.45)",
              background: item === "Matches" ? "#22C55E" : "transparent",
              textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (item !== "Matches") e.currentTarget.style.color = "#F0EDE6"; }}
              onMouseLeave={e => { if (item !== "Matches") e.currentTarget.style.color = "rgba(240,237,230,0.45)"; }}
            >{item}</a>
          ))}
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E40, #22C55E15)", border: "1.5px solid #22C55E40", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.7rem", color: "#22C55E" }}>
            YOU
          </div>
        </div>
      </nav>
 
      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem" }}>
 
        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.6rem" }}>
            <Zap size={14} fill="#22C55E" color="#22C55E" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E" }}>
              {filtered.length} Matches Found
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.04em", color: "#F0EDE6", marginBottom: "0.4rem" }}>
            Your Creative Matches
          </h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>
            Ranked by compatibility with your profile and goals.
          </p>
        </div>
 
        {/* ── SEARCH + FILTERS BAR ── */}
        <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
 
          {/* Search row */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{
              flex: 1, position: "relative",
              border: `1px solid ${searchFocused ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, background: "rgba(255,255,255,0.03)",
              transition: "border-color 0.2s",
              boxShadow: searchFocused ? "0 0 0 3px rgba(34,197,94,0.07)" : "none",
            }}>
              <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,230,0.3)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by name, role, or skill…"
                style={{
                  width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem",
                  background: "transparent", border: "none", outline: "none",
                  color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.3)", display: "flex" }}>
                  <X size={14} />
                </button>
              )}
            </div>
 
            {/* Filter toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.8rem 1.25rem",
                background: showFilters ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${showFilters ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12, color: showFilters ? "#22C55E" : "rgba(240,237,230,0.6)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </motion.button>
          </div>
 
          {/* Role filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {ROLE_FILTERS.map((f) => (
              <motion.button
                key={f.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(f.label)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  background: activeFilter === f.label ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeFilter === f.label ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 100, cursor: "pointer",
                  color: activeFilter === f.label ? "#22C55E" : "rgba(240,237,230,0.45)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                  fontWeight: activeFilter === f.label ? 500 : 400,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ display: "flex", color: "inherit" }}>{f.icon}</span>
                {f.label}
              </motion.button>
            ))}
          </div>
 
          {/* Advanced filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  padding: "1.25rem", background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14,
                  display: "flex", gap: "2rem", flexWrap: "wrap",
                }}>
                  {/* Location */}
                  <div>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.6rem" }}>Location</p>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {locations.map(loc => (
                        <button key={loc} onClick={() => setLocationFilter(loc)} style={{
                          padding: "0.35rem 0.85rem", borderRadius: 100, fontSize: "0.75rem",
                          background: locationFilter === loc ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${locationFilter === loc ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
                          color: locationFilter === loc ? "#22C55E" : "rgba(240,237,230,0.45)",
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                        }}>{loc}</button>
                      ))}
                    </div>
                  </div>
 
                  {/* Sort */}
                  <div>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.6rem" }}>Sort By</p>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {sortOptions.map(opt => (
                        <button key={opt} onClick={() => setSortBy(opt)} style={{
                          padding: "0.35rem 0.85rem", borderRadius: 100, fontSize: "0.75rem",
                          background: sortBy === opt ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${sortBy === opt ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
                          color: sortBy === opt ? "#22C55E" : "rgba(240,237,230,0.45)",
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                        }}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* ── GRID ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "5rem 0" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>No matches found</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Try adjusting your filters or search terms</p>
              <button onClick={() => { setSearch(""); setActiveFilter("All"); setLocationFilter("All"); }} style={{ marginTop: "1.5rem", padding: "0.65rem 1.5rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#22C55E", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {filtered.map((creative, i) => (
                <MatchCard
                  key={creative.id}
                  creative={creative}
                  index={i}
                  onConnect={handleConnect}
                  onMessage={setActiveCreative}
                  connected={connectedIds.includes(creative.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Connected count toast */}
        <AnimatePresence>
          {connectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: "0.6rem",
                background: "#0d0f0d", border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 100, padding: "0.6rem 1.25rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(34,197,94,0.1)",
                zIndex: 40,
              }}
            >
              <div style={{ display: "flex" }}>
                {connectedIds.slice(0, 3).map((id, i) => {
                  const c = ALL_CREATIVES.find(cr => cr.id === id)!;
                  return (
                    <div key={id} style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c.accentColor}50, ${c.accentColor}20)`,
                      border: `1.5px solid ${c.accentColor}50`,
                      marginLeft: i === 0 ? 0 : -6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.55rem", fontWeight: 700, color: c.accentColor,
                    }}>{c.initials}</div>
                  );
                })}
              </div>
              <span style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.7)", fontWeight: 300 }}>
                <strong style={{ color: "#22C55E", fontWeight: 600 }}>{connectedIds.length}</strong> connection{connectedIds.length > 1 ? "s" : ""} made
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* ── MESSAGE DRAWER ── */}
      <MessageDrawer creative={activeCreative} onClose={() => setActiveCreative(null)} />
    </div>
  );
}
 