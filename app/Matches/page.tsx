"use client";
 
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, MapPin, Zap, Star,
  MessageCircle, UserPlus, X, ChevronDown, Sparkles,
  Music, Code, Palette, Camera, Video, Cpu, Check
} from "lucide-react";
 
// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
// Centralised so every component reads from the same source
 
const T = {
  // Typography
  fontSans: "'DM Sans', sans-serif",
  fontDisplay: "'Syne', sans-serif",
 
  // Text colours
  textPrimary: "#F0EDE6",
  textMuted: "rgba(240,237,230,0.45)",
  textFaint: "rgba(240,237,230,0.28)",
 
  // Surface colours
  surfaceBase: "#080808",
  surfaceCard: "rgba(255,255,255,0.025)",
  surfaceCardHover: "rgba(255,255,255,0.04)",
  surfaceInput: "rgba(255,255,255,0.04)",
 
  // Border colours
  borderDefault: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.05)",
  borderActive: "rgba(34,197,94,0.45)",
 
  // Brand
  green: "#22C55E",
  greenDim: "rgba(34,197,94,0.12)",
  greenBorder: "rgba(34,197,94,0.3)",
  greenGlow: "rgba(34,197,94,0.08)",
 
  // Radii
  radiusSm: 8,
  radiusMd: 10,
  radiusLg: 14,
  radiusXl: 18,
  radiusPill: 100,
 
  // Spacing scale
  gap4: "0.25rem",
  gap6: "0.375rem",
  gap8: "0.5rem",
  gap12: "0.75rem",
  gap16: "1rem",
  gap20: "1.25rem",
  gap24: "1.5rem",
};
 
// ─── TYPES ──────────────────────────────────────────────────────────────────
 
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
 
// ─── DATA ───────────────────────────────────────────────────────────────────
 
const ALL_CREATIVES: Creative[] = [
  {
    id: 1, name: "Tunde Adeyemi", initials: "TA", role: "Sound Producer",
    roleIcon: <Music size={11} />, location: "Lagos, NG",
    tags: ["Afrobeats", "Mixing", "Pro Tools"],
    matchScore: 98, accentColor: "#22C55E",
    bio: "Award-winning producer behind 3 charting Afrobeats records. Looking for vocalists and lyricists ready to go big.",
    collab: 14, rating: 4.9, online: true,
  },
  {
    id: 2, name: "Chisom Obi", initials: "CO", role: "UI/UX Designer",
    roleIcon: <Palette size={11} />, location: "Abuja, NG",
    tags: ["Figma", "Motion", "Branding"],
    matchScore: 94, accentColor: "#EAB308",
    bio: "Design lead at a Lagos startup. Obsessed with interfaces that feel alive. Let's build something people actually love.",
    collab: 9, rating: 4.8, online: true,
  },
  {
    id: 3, name: "Emeka Nwosu", initials: "EN", role: "Full-Stack Dev",
    roleIcon: <Code size={11} />, location: "Port Harcourt, NG",
    tags: ["React", "Node.js", "Web3"],
    matchScore: 91, accentColor: "#3B82F6",
    bio: "Building the infrastructure for the next wave of Nigerian tech. Need a designer or product thinker to partner with.",
    collab: 22, rating: 4.7, online: false,
  },
  {
    id: 4, name: "Seun Balogun", initials: "SB", role: "Videographer",
    roleIcon: <Video size={11} />, location: "Ibadan, NG",
    tags: ["Cinematography", "Color Grading", "Docs"],
    matchScore: 85, accentColor: "#F97316",
    bio: "Director of photography for short films and music videos. Currently building a documentary series on Nigerian youth culture.",
    collab: 7, rating: 4.6, online: false,
  },
  {
    id: 5, name: "Dayo Okonkwo", initials: "DO", role: "Sound Producer",
    roleIcon: <Music size={11} />, location: "Lagos, NG",
    tags: ["Amapiano", "Sampling", "Ableton"],
    matchScore: 79, accentColor: "#22C55E",
    bio: "Amapiano specialist. Released 2 EPs independently. Currently looking for vocalists and visual artists for my next project.",
    collab: 5, rating: 4.5, online: true,
  },
  {
    id: 6, name: "Ngozi Eze", initials: "NE", role: "Full-Stack Dev",
    roleIcon: <Code size={11} />, location: "Enugu, NG",
    tags: ["Python", "AI/ML", "Product"],
    matchScore: 76, accentColor: "#3B82F6",
    bio: "AI engineer and product thinker. Building tools for African creatives. Looking for designers and storytellers.",
    collab: 11, rating: 4.7, online: false,
  }
];
 
const ROLE_FILTERS = [
  { label: "All",          icon: <Sparkles size={12} /> },
  { label: "Producer",     icon: <Music size={12} /> },
  { label: "Designer",     icon: <Palette size={12} /> },
  { label: "Developer",    icon: <Code size={12} /> },
  { label: "Photographer", icon: <Camera size={12} /> },
  { label: "Videographer", icon: <Video size={12} /> },
  { label: "Artist",       icon: <Cpu size={12} /> },
];
 
// ─── SHARED PRIMITIVES ──────────────────────────────────────────────────────
 
/** Pill badge: role tag, filter button, location chip — same shape everywhere */
function Pill({
  children, active = false, accent, onClick, style,
}: {
  children: React.ReactNode;
  active?: boolean;
  accent?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const activeColor = accent ?? T.green;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px",
        background: active ? `${activeColor}12` : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? `${activeColor}40` : T.borderDefault}`,
        borderRadius: T.radiusPill,
        color: active ? activeColor : T.textMuted,
        fontFamily: T.fontSans, fontSize: "0.72rem", fontWeight: active ? 500 : 400,
        cursor: onClick ? "pointer" : "default",
        whiteSpace: "nowrap",
        transition: "all 0.18s",
        ...(style ?? {}),
      }}
    >
      {children}
    </button>
  );
}
 
/** Divider used inside stat rows */
function Divider() {
  return <div style={{ width: 1, height: 12, background: T.borderSubtle, flexShrink: 0 }} />;
}
 
/** Online dot — one consistent component used everywhere */
function OnlineDot({ size = 8 }: { size?: number }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size, borderRadius: "50%",
      background: T.green, boxShadow: `0 0 ${size}px ${T.green}`,
      flexShrink: 0,
    }} />
  );
}
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", ...style }} />;
}
 
// ─── MATCH CARD ────────────────────────────────────────────────────────────
 
function MatchCard({
  creative, index, onConnect, onMessage, connected,
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? T.surfaceCardHover : T.surfaceCard,
        border: `1px solid ${hovered ? `${creative.accentColor}28` : T.borderDefault}`,
        borderRadius: T.radiusXl,
        padding: T.gap24,
        cursor: "default",
        transition: "background 0.22s, border-color 0.22s, transform 0.22s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        overflow: "hidden",
        display: "flex", flexDirection: "column", gap: T.gap16,
      }}
    >
      {/* Top edge glow */}
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
        background: `linear-gradient(90deg, transparent, ${creative.accentColor}55, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
        pointerEvents: "none",
      }} />
 
      {/* ── HEADER ROW ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: T.gap12 }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: `${creative.accentColor}22`,
            border: `1.5px solid ${creative.accentColor}38`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.fontDisplay, fontWeight: 800,
            fontSize: "0.82rem", color: creative.accentColor,
          }}>
            {creative.initials}
          </div>
          {creative.online && (
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              padding: 2, borderRadius: "50%", background: T.surfaceBase,
            }}>
              <OnlineDot size={8} />
            </div>
          )}
        </div>
 
        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: T.fontDisplay, fontWeight: 700,
            fontSize: "0.92rem", color: T.textPrimary,
            letterSpacing: "-0.02em", marginBottom: 5,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {creative.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {/* Role pill */}
            <Pill active accent={creative.accentColor}>
              <span style={{ display: "flex" }}>{creative.roleIcon}</span>
              {creative.role}
            </Pill>
            {/* Location */}
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.72rem", color: T.textFaint }}>
              <MapPin size={10} />
              {creative.location}
            </span>
          </div>
        </div>
 
        {/* Match score badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
          background: `${creative.accentColor}12`,
          border: `1px solid ${creative.accentColor}30`,
          borderRadius: T.radiusPill, padding: "3px 9px",
        }}>
          <Zap size={9} fill={creative.accentColor} color={creative.accentColor} />
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: creative.accentColor, letterSpacing: "0.04em" }}>
            {creative.matchScore}%
          </span>
        </div>
      </div>
 
      {/* ── BIO ── */}
      <p style={{
        fontSize: "0.82rem", color: T.textMuted,
        fontWeight: 300, lineHeight: 1.65,
        display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical", overflow: "hidden",
        margin: 0,
      }}>
        {creative.bio}
      </p>
 
      {/* ── TAGS ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {creative.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>
 
      {/* ── STATS ROW ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: T.gap12,
        paddingBottom: T.gap16,
        borderBottom: `1px solid ${T.borderSubtle}`,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>
          <Star size={11} fill="#EAB308" color="#EAB308" />
          <span style={{ fontWeight: 600, color: T.textPrimary }}>{creative.rating}</span>
        </span>
        <Divider />
        <span style={{ fontSize: "0.73rem", color: T.textMuted, fontWeight: 300 }}>
          <strong style={{ color: "rgba(240,237,230,0.7)", fontWeight: 600 }}>{creative.collab}</strong> collabs
        </span>
        {creative.online && (
          <>
            <Divider />
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: T.green }}>
              <OnlineDot size={6} />
              Online now
            </span>
          </>
        )}
      </div>
 
      {/* ── ACTIONS ── */}
      <div style={{ display: "flex", gap: T.gap8 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onMessage(creative)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "0.6rem 0",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.borderDefault}`,
            borderRadius: T.radiusMd,
            color: T.textMuted,
            fontFamily: T.fontSans, fontSize: "0.78rem", fontWeight: 400,
            cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = T.textPrimary; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = T.borderDefault; }}
        >
          <MessageCircle size={13} /> Message
        </motion.button>
 
        <motion.button
          whileHover={!connected ? { scale: 1.02, boxShadow: `0 0 20px ${creative.accentColor}28` } : {}}
          whileTap={!connected ? { scale: 0.97 } : {}}
          onClick={() => !connected && onConnect(creative.id)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "0.6rem 0",
            background: connected ? `${T.green}14` : `linear-gradient(135deg, ${creative.accentColor}, ${creative.accentColor}cc)`,
            border: connected ? `1px solid ${T.greenBorder}` : "1px solid transparent",
            borderRadius: T.radiusMd,
            color: connected ? T.green : "#080808",
            fontFamily: T.fontSans, fontSize: "0.78rem", fontWeight: connected ? 400 : 600,
            cursor: connected ? "default" : "pointer",
            transition: "all 0.22s",
          }}
        >
          {connected ? <><Check size={13} /> Connected</> : <><UserPlus size={13} /> Connect</>}
        </motion.button>
      </div>
    </motion.div>
  );
}
 
// ─── MESSAGE DRAWER ──────────────────────────────────────────────────────────
 
function MessageDrawer({ creative, onClose }: { creative: Creative | null; onClose: () => void }) {
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 80 }}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 90,
              width: 380, background: "#0d0d0d",
              borderLeft: `1px solid ${T.borderDefault}`,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ padding: T.gap24, borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: T.gap12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `${creative.accentColor}22`, border: `1.5px solid ${creative.accentColor}38`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: T.fontDisplay, fontWeight: 800, fontSize: "0.75rem", color: creative.accentColor,
                }}>
                  {creative.initials}
                </div>
                <div>
                  <p style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: "0.88rem", color: T.textPrimary, margin: 0 }}>{creative.name}</p>
                  <p style={{ fontSize: "0.72rem", color: T.textFaint, fontWeight: 300, margin: 0 }}>{creative.role} · {creative.location}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${T.borderDefault}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: T.textMuted, transition: "background 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = T.textPrimary; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = T.textMuted; }}
              >
                <X size={15} />
              </button>
            </div>
 
            {/* Body */}
            <div style={{ flex: 1, padding: T.gap24, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textFaint, marginBottom: T.gap12 }}>
                Quick starters
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: T.gap8 }}>
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
                      background: T.surfaceInput, border: `1px solid ${T.borderDefault}`,
                      borderRadius: T.radiusMd, color: T.textMuted,
                      fontFamily: T.fontSans, fontSize: "0.8rem", fontWeight: 300,
                      cursor: "pointer", transition: "background 0.18s, color 0.18s, border-color 0.18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = T.textPrimary; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surfaceInput; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = T.borderDefault; }}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
 
            {/* Input */}
            <div style={{ padding: `${T.gap16} ${T.gap24} ${T.gap24}`, borderTop: `1px solid ${T.borderSubtle}` }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", padding: T.gap16, color: T.green, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Check size={15} /> Message sent!
                  </motion.div>
                ) : (
                  <motion.div key="input" style={{ display: "flex", gap: T.gap8 }}>
                    <input
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSend()}
                      placeholder={`Message ${creative.name.split(" ")[0]}…`}
                      style={{
                        flex: 1, padding: "0.72rem 0.9rem",
                        background: T.surfaceInput, border: `1px solid ${T.borderDefault}`,
                        borderRadius: T.radiusMd, color: T.textPrimary,
                        fontFamily: T.fontSans, fontSize: "0.85rem", outline: "none",
                        transition: "border-color 0.18s",
                      }}
                      onFocus={e => e.target.style.borderColor = T.borderActive}
                      onBlur={e => e.target.style.borderColor = T.borderDefault}
                    />
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      style={{
                        width: 42, height: 42, borderRadius: T.radiusMd, flexShrink: 0,
                        background: msg.trim() ? `linear-gradient(135deg, ${T.green}, #16A34A)` : "rgba(255,255,255,0.05)",
                        border: "none", cursor: msg.trim() ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: msg.trim() ? "#080808" : "rgba(240,237,230,0.2)",
                        transition: "background 0.2s",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
 
// ─── MAIN PAGE ────────────────────────────────────────────-──────────────────
 
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
      const q = search.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
      const matchesRole = activeFilter === "All" || c.role.toLowerCase().includes(activeFilter.toLowerCase());
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
 
  return (
    <div style={{ minHeight: "100vh", background: T.surfaceBase, color: T.textPrimary, fontFamily: T.fontSans, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
 
      {/* Background orbs */}
      <Orb style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent)", top: -100, left: -100 }} />
      <Orb style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(234,179,8,0.05), transparent)", bottom: "20%", right: -80, animation: "float 8s ease-in-out infinite" }} />
 
      {/* Grid texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
 
      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 2.5rem",
        background: "rgba(8,8,8,0.88)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.borderSubtle}`,
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: T.textPrimary }}>
            Naija<span style={{ color: T.green }}>Collab</span>
          </span>
        </a>
 
        {/* Nav tabs */}
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderDefault}`, borderRadius: T.radiusLg, padding: 3 }}>
          {["Matches", "Projects", "Messages", "Profile"].map((item) => {
            const isActive = item === "Matches";
            return (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  padding: "0.42rem 0.95rem", borderRadius: T.radiusMd,
                  fontSize: "0.78rem", fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#080808" : T.textMuted,
                  background: isActive ? T.green : "transparent",
                  textDecoration: "none", transition: "all 0.18s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.textPrimary; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.textMuted; }}
              >
                {item}
              </a>
            );
          })}
        </div>
 
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `${T.green}22`, border: `1.5px solid ${T.green}38`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: "0.68rem", color: T.green,
        }}>
          YOU
        </div>
      </nav>
 
      {/* ── MAIN ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem" }}>
 
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.5rem" }}>
            <Zap size={13} fill={T.green} color={T.green} />
            <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: T.green }}>
              {filtered.length} matches found
            </span>
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.04em", color: T.textPrimary, marginBottom: "0.35rem" }}>
            Your Creative Matches
          </h1>
          <p style={{ fontSize: "0.875rem", color: T.textMuted, fontWeight: 300 }}>
            Ranked by compatibility with your profile and goals.
          </p>
        </div>
 
        {/* ── SEARCH + FILTERS ── */}
        <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: T.gap12 }}>
 
          {/* Search row */}
          <div style={{ display: "flex", gap: T.gap12 }}>
            <div style={{
              flex: 1, position: "relative",
              border: `1px solid ${searchFocused ? T.borderActive : T.borderDefault}`,
              borderRadius: T.radiusLg, background: T.surfaceInput,
              transition: "border-color 0.2s",
              boxShadow: searchFocused ? `0 0 0 3px ${T.greenGlow}` : "none",
            }}>
              <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textFaint }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by name, role, or skill…"
                style={{
                  width: "100%", padding: "0.75rem 1rem 0.75rem 2.6rem",
                  background: "transparent", border: "none", outline: "none",
                  color: T.textPrimary, fontFamily: T.fontSans, fontSize: "0.875rem",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.textFaint, display: "flex", padding: 2 }}>
                  <X size={13} />
                </button>
              )}
            </div>
 
            {/* Filter toggle — same radius/padding as role pills but rectangular */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 1.1rem",
                background: showFilters ? T.greenDim : T.surfaceInput,
                border: `1px solid ${showFilters ? T.borderActive : T.borderDefault}`,
                borderRadius: T.radiusLg,
                color: showFilters ? T.green : T.textMuted,
                fontFamily: T.fontSans, fontSize: "0.8rem", fontWeight: showFilters ? 500 : 400,
                cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap",
              }}
            >
              <SlidersHorizontal size={13} />
              Filters
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </motion.button>
          </div>
 
          {/* Role filters — pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ROLE_FILTERS.map((f) => (
              <motion.div key={f.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Pill active={activeFilter === f.label} onClick={() => setActiveFilter(f.label)}>
                  <span style={{ display: "flex" }}>{f.icon}</span>
                  {f.label}
                </Pill>
              </motion.div>
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
                  padding: T.gap20, background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.borderDefault}`, borderRadius: T.radiusLg,
                  display: "flex", gap: "2rem", flexWrap: "wrap",
                }}>
                  {[
                    { label: "Location", options: locations, value: locationFilter, set: setLocationFilter },
                    { label: "Sort by", options: sortOptions, value: sortBy, set: setSortBy },
                  ].map(({ label, options, value, set }) => (
                    <div key={label}>
                      <p style={{ fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: T.textFaint, marginBottom: T.gap8 }}>
                        {label}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {options.map(opt => (
                          <Pill key={opt} active={value === opt} onClick={() => set(opt)}>{opt}</Pill>
                        ))}
                      </div>
                    </div>
                  ))}
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "5rem 0" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: T.gap16 }}>🔍</div>
              <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>No matches found</h3>
              <p style={{ fontSize: "0.85rem", color: T.textMuted, fontWeight: 300 }}>Try adjusting your filters or search terms</p>
              <button
                onClick={() => { setSearch(""); setActiveFilter("All"); setLocationFilter("All"); }}
                style={{ marginTop: T.gap24, padding: "0.6rem 1.4rem", background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: T.radiusMd, color: T.green, fontFamily: T.fontSans, fontSize: "0.82rem", cursor: "pointer" }}
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: T.gap20 }}
            >
              {filtered.map((creative, i) => (
                <MatchCard
                  key={creative.id}
                  creative={creative}
                  index={i}
                  onConnect={(id) => setConnectedIds(prev => [...prev, id])}
                  onMessage={setActiveCreative}
                  connected={connectedIds.includes(creative.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Connections toast */}
        <AnimatePresence>
          {connectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{
                position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: T.gap12,
                background: "#0d0f0d", border: `1px solid ${T.greenBorder}`,
                borderRadius: T.radiusPill, padding: "0.55rem 1.2rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(34,197,94,0.08)",
                zIndex: 40,
              }}
            >
              <div style={{ display: "flex" }}>
                {connectedIds.slice(0, 3).map((id, i) => {
                  const c = ALL_CREATIVES.find(cr => cr.id === id)!;
                  return (
                    <div key={id} style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: `${c.accentColor}22`, border: `1.5px solid ${c.accentColor}45`,
                      marginLeft: i === 0 ? 0 : -6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.52rem", fontWeight: 700, color: c.accentColor,
                      fontFamily: T.fontDisplay,
                    }}>{c.initials}</div>
                  );
                })}
              </div>
              <span style={{ fontSize: "0.78rem", color: T.textMuted, fontWeight: 300 }}>
                <strong style={{ color: T.green, fontWeight: 600 }}>{connectedIds.length}</strong> connection{connectedIds.length > 1 ? "s" : ""} made
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      <MessageDrawer creative={activeCreative} onClose={() => setActiveCreative(null)} />
    </div>
  );
}
 