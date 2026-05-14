"use client";
 
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Play, Pause, Music, Palette, Code, Camera, Video,
  Zap, Users, FolderOpen, BookOpen, Settings, LogOut,
  Plus, Image, FileText, Mic, Send, X, Check,
  TrendingUp, Flame, Star, Bell, Search, RefreshCw,
  ChevronRight, Globe, Radio, Headphones, Award,
  UserPlus, ArrowUpRight, Hash, AtSign, Sparkles,
  Home, LayoutGrid
} from "lucide-react";
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
type PostType = "social" | "activity" | "collab-invite" | "project-drop" | "track-drop";
 
interface FeedPost {
  id: number;
  type: PostType;
  author: {
    name: string;
    initials: string;
    role: string;
    accentColor: string;
    verified?: boolean;
    online?: boolean;
  };
  time: string;
  content: string;
  media?: { type: "audio" | "image" | "gradient"; gradient?: string; symbol?: string; duration?: string; title?: string };
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  bookmarked?: boolean;
  activityMeta?: { action: string; target: string; accentColor: string };
  collabMeta?: { role: string; projectName: string; slots: number };
  matchScore?: number;
}
 
// ─── MOCK DATA ────────────────────────────────────────────────────────────────
 
const INITIAL_FEED: FeedPost[] = [
  {
    id: 1, type: "track-drop",
    author: { name: "Tunde Adeyemi", initials: "TA", role: "Sound Producer", accentColor: "#22C55E", verified: true, online: true },
    time: "4m ago",
    content: "Finally dropped 'Midnight Lagos' 🌃 This one took 6 months. Every beat tells a story of the city at 2AM — the energy, the hustle, the beauty. Stream it now 🔊",
    media: { type: "audio", gradient: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #22C55E 100%)", symbol: "♪", duration: "3:42", title: "Midnight Lagos" },
    tags: ["Afrobeats", "NewMusic", "Lagos"],
    likes: 284, comments: 47, shares: 31, liked: false, bookmarked: false,
  },
  {
    id: 2, type: "activity",
    author: { name: "NaijaCollab", initials: "NC", role: "Platform", accentColor: "#22C55E" },
    time: "12m ago",
    content: "You have 3 new creative matches this week based on your producer profile.",
    activityMeta: { action: "New Matches", target: "View all matches →", accentColor: "#22C55E" },
    likes: 0, comments: 0, shares: 0,
  },
  {
    id: 3, type: "social",
    author: { name: "Chisom Obi", initials: "CO", role: "UI/UX Designer", accentColor: "#EAB308", verified: false, online: true },
    time: "28m ago",
    content: "The way good design can completely transform how music is received 👀 Just finished the visual identity for @TundeAdeyemi's EP and I'm genuinely proud of this one. Dark, luxurious, Lagos-coded. More soon 🔥",
    media: { type: "gradient", gradient: "linear-gradient(135deg, #1a0010 0%, #500030 50%, #EAB308 100%)", symbol: "◈" },
    tags: ["Design", "BrandIdentity", "NaijaCreatives"],
    likes: 156, comments: 23, shares: 18, liked: true, bookmarked: false,
  },
  {
    id: 4, type: "collab-invite",
    author: { name: "Seun Balogun", initials: "SB", role: "Videographer", accentColor: "#F97316", online: false },
    time: "1h ago",
    content: "Looking for a sound designer and a graphic artist to join a short film project. Lagos street culture, cinematic, 3-month timeline. Budget confirmed. Let's build something real.",
    collabMeta: { role: "Sound Designer + Graphic Artist", projectName: "Eko Portraits — Short Film", slots: 2 },
    tags: ["Collab", "FilmMaking", "Paid"],
    likes: 89, comments: 34, shares: 52, liked: false, bookmarked: true,
  },
  {
    id: 5, type: "social",
    author: { name: "Amara Sule", initials: "AS", role: "Photographer", accentColor: "#EC4899", verified: true, online: true },
    time: "2h ago",
    content: "Shot 400 frames at sunrise in Lekki this morning. 12 made the cut. Sometimes the edit is the art. 📸\n\nIf you're working on something and need editorial photography — my DMs are open.",
    media: { type: "gradient", gradient: "linear-gradient(135deg, #1a0010 0%, #831843 50%, #EC4899 100%)", symbol: "⬡" },
    tags: ["Photography", "Editorial", "Lagos"],
    likes: 412, comments: 58, shares: 24, liked: false, bookmarked: false,
  },
  {
    id: 6, type: "activity",
    author: { name: "NaijaCollab", initials: "NC", role: "Platform", accentColor: "#22C55E" },
    time: "3h ago",
    content: "Beat Street EP project hit 88% completion. You're close to the finish line.",
    activityMeta: { action: "Project Update", target: "Open project →", accentColor: "#3B82F6" },
    likes: 0, comments: 0, shares: 0,
  },
  {
    id: 7, type: "project-drop",
    author: { name: "Emeka Nwosu", initials: "EN", role: "Full-Stack Dev", accentColor: "#3B82F6", verified: false, online: false },
    time: "4h ago",
    content: "Naija Sounds App just hit 400 beta users 🚀 Built this in 6 weeks with @IkeMartins and @NgoziEze. A streaming platform made specifically for underground Nigerian artists. We're just getting started.",
    media: { type: "gradient", gradient: "linear-gradient(135deg, #030712 0%, #1e3a5f 50%, #3B82F6 100%)", symbol: "⌖" },
    tags: ["Tech", "Product", "NaijaStartup"],
    likes: 631, comments: 94, shares: 118, liked: false, bookmarked: true,
  },
  {
    id: 8, type: "social",
    author: { name: "Funke Adesanya", initials: "FA", role: "Visual Artist", accentColor: "#A855F7", verified: true, online: false },
    time: "6h ago",
    content: "Digital art is not a lesser art form. It's not easier. It's not 'just Photoshop'. It's a different medium that demands its own mastery.\n\nNigerian creatives — stop underselling your digital work. Price it right. 🧠",
    tags: ["DigitalArt", "CreativeEconomy", "NaijaArt"],
    likes: 847, comments: 112, shares: 203, liked: true, bookmarked: true,
  },
  {
    id: 9, type: "track-drop",
    author: { name: "Dayo Okonkwo", initials: "DO", role: "Sound Producer", accentColor: "#22C55E", verified: false, online: true },
    time: "8h ago",
    content: "New Amapiano beat — free to use for vocalists 🎹 First come first served. Drop your email in the comments and I'll send the stems directly.",
    media: { type: "audio", gradient: "linear-gradient(135deg, #1c1400 0%, #422006 50%, #EAB308 100%)", symbol: "♬", duration: "4:14", title: "Eko Dawn (Free Beat)" },
    tags: ["Amapiano", "FreeBeat", "Vocalists"],
    likes: 193, comments: 67, shares: 45, liked: false, bookmarked: false,
  },
];
 
const TRENDING_TAGS = ["#NaijaCreatives", "#AfrobeatsNaija", "#LagosDesign", "#NaijaCollab", "#FreeBeat", "#OpenCollab"];
const WHO_TO_FOLLOW = [
  { name: "Kemi Adeyemi", initials: "KA", role: "Vocalist", color: "#EC4899", matchScore: 96 },
  { name: "Bayo Osei",    initials: "BO", role: "Motion Designer", color: "#A855F7", matchScore: 91 },
  { name: "Zara Ibe",     initials: "ZI", role: "Developer", color: "#3B82F6", matchScore: 87 },
];
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", ...style }} />;
}
 
function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
 
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
 
// ─── DESKTOP SIDEBAR ─────────────────────────────────────────────────────────
 
function DesktopSidebar() {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />,          href: "/dashboard" },
    { label: "Feed",      icon: <Radio size={16} />,         href: "/feed",      active: true },
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
        {navItems.map((item) => {
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
 
// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
 
function MobileBottomNav() {
  const navItems = [
    { label: "Home",     icon: <Home size={20} />,          href: "/dashboard" },
    { label: "Feed",     icon: <Radio size={20} />,          href: "/feed",     active: true },
    { label: "Matches",  icon: <Users size={20} />,          href: "/matches" },
    { label: "Projects", icon: <FolderOpen size={20} />,     href: "/projects" },
    { label: "Messages", icon: <MessageCircle size={20} />,  href: "/messages" },
  ];
 
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(8,8,8,0.96)", backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      display: "flex", alignItems: "center",
      padding: "0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))",
    }}>
      {navItems.map((item) => {
        const isActive = (item as any).active;
        return (
          <a key={item.label} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: "0.2rem", textDecoration: "none", padding: "0.4rem 0",
            color: isActive ? "#22C55E" : "rgba(240,237,230,0.35)",
            transition: "color 0.2s",
          }}>
            <div style={{ position: "relative" }}>
              {item.icon}
              {isActive && (
                <div style={{
                  position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: "#22C55E",
                  boxShadow: "0 0 6px #22C55E",
                }} />
              )}
            </div>
            <span style={{ fontSize: "0.6rem", fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
 
// ─── MOBILE STORIES ROW ───────────────────────────────────────────────────────
 
function StoriesRow() {
  const stories = [
    { initials: "TA", color: "#22C55E", name: "Tunde", hasNew: true },
    { initials: "CO", color: "#EAB308", name: "Chisom", hasNew: true },
    { initials: "AS", color: "#EC4899", name: "Amara", hasNew: true },
    { initials: "SB", color: "#F97316", name: "Seun", hasNew: false },
    { initials: "EN", color: "#3B82F6", name: "Emeka", hasNew: false },
    { initials: "FA", color: "#A855F7", name: "Funke", hasNew: true },
  ];
 
  return (
    <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
      <div style={{ display: "flex", gap: "0.85rem", overflowX: "auto", paddingBottom: "0.25rem", scrollbarWidth: "none" }}>
        {/* Add story */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px dashed rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Plus size={18} color="#22C55E" />
          </div>
          <span style={{ fontSize: "0.58rem", color: "rgba(240,237,230,0.35)", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>Add</span>
        </div>
 
        {stories.map((s) => (
          <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", flexShrink: 0, cursor: "pointer" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", padding: 2,
              background: s.hasNew
                ? `linear-gradient(135deg, ${s.color}, ${s.color}60)`
                : "rgba(255,255,255,0.1)",
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: `linear-gradient(135deg, ${s.color}45, ${s.color}15)`,
                border: "2px solid #080808",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "0.7rem", color: s.color,
              }}>
                {s.initials}
              </div>
            </div>
            <span style={{ fontSize: "0.58rem", color: s.hasNew ? "#F0EDE6" : "rgba(240,237,230,0.35)", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ─── COMPOSE BOX ─────────────────────────────────────────────────────────────
 
function ComposeBox({ onPost, isMobile }: { onPost: (text: string) => void; isMobile: boolean }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
 
  const handlePost = () => {
    if (!text.trim()) return;
    setPosting(true);
    setTimeout(() => {
      onPost(text.trim());
      setText("");
      setPosting(false);
      setPosted(true);
      setTimeout(() => setPosted(false), 2000);
    }, 800);
  };
 
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${focused ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: isMobile ? 14 : 18,
        padding: isMobile ? "1rem" : "1.25rem",
        marginBottom: "1rem",
        transition: "border-color 0.25s",
      }}
    >
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div style={{ width: isMobile ? 34 : 38, height: isMobile ? 34 : 38, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #22C55E50, #22C55E18)", border: "1.5px solid #22C55E40", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.6rem", color: "#22C55E" }}>YOU</div>
 
        <div style={{ flex: 1 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Share something with the community…"
            rows={focused || text ? 3 : 1}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "0.875rem" : "0.9rem", fontWeight: 300, lineHeight: 1.65, resize: "none", transition: "all 0.2s" }}
          />
 
          <AnimatePresence>
            {(focused || text) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "0.65rem" }}
              >
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[
                    { icon: <Image size={14} />, label: "Photo" },
                    { icon: <Music size={14} />, label: "Track" },
                    { icon: <Hash size={14} />, label: "Tag" },
                  ].map(btn => (
                    <button key={btn.label} title={btn.label} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)" }}>
                      {btn.icon}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.62rem", color: text.length > 240 ? "#EF4444" : "rgba(240,237,230,0.25)" }}>{text.length}/280</span>
                  <motion.button
                    whileHover={text.trim() ? { scale: 1.04 } : {}}
                    whileTap={text.trim() ? { scale: 0.96 } : {}}
                    onClick={handlePost}
                    disabled={!text.trim() || posting}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 1rem", background: text.trim() ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 9, color: text.trim() ? "#080808" : "rgba(240,237,230,0.2)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, cursor: text.trim() ? "pointer" : "not-allowed" }}
                  >
                    {posting ? <><RefreshCw size={11} style={{ animation: "spin 0.8s linear infinite" }} /> Posting…</> : posted ? <><Check size={11} /> Posted!</> : <><Send size={11} /> Post</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
 
function ActivityCard({ post, isMobile }: { post: FeedPost; isMobile: boolean }) {
  const meta = post.activityMeta!;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: `${meta.accentColor}08`,
        border: `1px solid ${meta.accentColor}20`,
        borderRadius: 14, padding: isMobile ? "0.85rem 1rem" : "1rem 1.25rem",
        display: "flex", alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${meta.accentColor}18`, border: `1px solid ${meta.accentColor}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Zap size={13} fill={meta.accentColor} color={meta.accentColor} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.15rem" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: meta.accentColor }}>{meta.action}</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.25)" }}>· {post.time}</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.65)", fontWeight: 300, lineHeight: 1.5 }}>{post.content}</p>
        </div>
      </div>
      <a href="#" style={{ fontSize: "0.72rem", color: meta.accentColor, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 3, marginLeft: isMobile ? 40 : 0 }}>
        {meta.target} <ChevronRight size={11} />
      </a>
    </motion.div>
  );
}
 
// ─── COLLAB INVITE CARD ───────────────────────────────────────────────────────
 
function CollabInviteCard({ post, onLike, isMobile }: { post: FeedPost; onLike: () => void; isMobile: boolean }) {
  const [applied, setApplied] = useState(false);
  const meta = post.collabMeta!;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, ${post.author.accentColor}, transparent)` }} />
      <div style={{ padding: isMobile ? "1rem" : "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${post.author.accentColor}45, ${post.author.accentColor}15)`, border: `1.5px solid ${post.author.accentColor}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.72rem", color: post.author.accentColor, flexShrink: 0 }}>
              {post.author.initials}
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F0EDE6" }}>{post.author.name}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{post.author.role} · {post.time}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "3px 9px" }}>
            <Users size={9} style={{ color: "#22C55E" }} />
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#22C55E" }}>Collab</span>
          </div>
        </div>
 
        <p style={{ fontSize: "0.845rem", color: "rgba(240,237,230,0.7)", fontWeight: 300, lineHeight: 1.7, marginBottom: "0.85rem" }}>{post.content}</p>
 
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.75rem", marginBottom: "0.85rem" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.4rem" }}>Project</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6", marginBottom: "0.3rem" }}>{meta.projectName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.45)", fontWeight: 300 }}>
              Roles: <strong style={{ color: "#F0EDE6", fontWeight: 500 }}>{meta.role}</strong>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 5px #22C55E" }} />
              <span style={{ fontSize: "0.68rem", color: "#22C55E", fontWeight: 500 }}>{meta.slots} open</span>
            </div>
          </div>
        </div>
 
        {post.tags && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontSize: "0.62rem", color: post.author.accentColor, background: `${post.author.accentColor}12`, border: `1px solid ${post.author.accentColor}25`, borderRadius: 5, padding: "1px 7px" }}>#{tag}</span>
            ))}
          </div>
        )}
 
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <ActionBtn icon={<Heart size={13} fill={post.liked ? "#EC4899" : "none"} color={post.liked ? "#EC4899" : "rgba(240,237,230,0.35)"} />} count={formatNum(post.likes)} onClick={onLike} />
            <ActionBtn icon={<MessageCircle size={13} />} count={formatNum(post.comments)} />
          </div>
          <motion.button
            whileHover={!applied ? { scale: 1.03 } : {}}
            whileTap={!applied ? { scale: 0.97 } : {}}
            onClick={() => setApplied(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.5rem 1.1rem", background: applied ? "rgba(34,197,94,0.1)" : "linear-gradient(135deg, #22C55E, #16A34A)", border: applied ? "1px solid rgba(34,197,94,0.3)" : "none", borderRadius: 9, color: applied ? "#22C55E" : "#080808", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, cursor: applied ? "default" : "pointer" }}
          >
            {applied ? <><Check size={11} /> Applied!</> : <><Zap size={11} fill="#080808" /> Apply</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
 
function ActionBtn({ icon, count, onClick }: { icon: React.ReactNode; count?: string; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.38rem 0.65rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, cursor: "pointer", color: "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 300 }}
    >
      {icon}
      {count && <span>{count}</span>}
    </motion.button>
  );
}
 
// ─── POST CARD ────────────────────────────────────────────────────────────────
 
function PostCard({ post, index, onLike, onBookmark, isMobile }: { post: FeedPost; index: number; onLike: (id: number) => void; onBookmark: (id: number) => void; isMobile: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(false);
 
  if (post.type === "activity") return <ActivityCard post={post} isMobile={isMobile} />;
  if (post.type === "collab-invite") return <CollabInviteCard post={post} onLike={() => onLike(post.id)} isMobile={isMobile} />;
 
  const isTrack = post.type === "track-drop";
  const isProject = post.type === "project-drop";
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.022)",
        border: `1px solid ${hovered ? `${post.author.accentColor}22` : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, overflow: "hidden",
        transition: "all 0.22s",
      }}
    >
      <div style={{ height: 1.5, background: `linear-gradient(90deg, ${post.author.accentColor}70, transparent)` }} />
 
      <div style={{ padding: isMobile ? "1rem" : "1.25rem" }}>
        {/* Author */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: isMobile ? 38 : 42, height: isMobile ? 38 : 42, borderRadius: "50%", background: `linear-gradient(135deg, ${post.author.accentColor}45, ${post.author.accentColor}15)`, border: `1.5px solid ${post.author.accentColor}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.72rem", color: post.author.accentColor }}>
                {post.author.initials}
              </div>
              {post.author.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", boxShadow: "0 0 5px #22C55E" }} />}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? "0.875rem" : "0.9rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>{post.author.name}</span>
                {post.author.verified && <div style={{ width: 13, height: 13, borderRadius: "50%", background: post.author.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={7} color="#080808" strokeWidth={3} /></div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{isMobile ? post.author.role.split(" ")[0] : post.author.role}</span>
                <span style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.2)" }}>·</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>{post.time}</span>
              </div>
            </div>
          </div>
 
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {(isTrack || isProject) && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: `${post.author.accentColor}12`, border: `1px solid ${post.author.accentColor}25`, borderRadius: 100, padding: "2px 8px" }}>
                {isTrack ? <Headphones size={9} style={{ color: post.author.accentColor }} /> : <Sparkles size={9} style={{ color: post.author.accentColor }} />}
                {!isMobile && <span style={{ fontSize: "0.58rem", fontWeight: 700, color: post.author.accentColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>{isTrack ? "Track" : "Project"}</span>}
              </div>
            )}
            <button style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.35)" }}>
              <MoreHorizontal size={12} />
            </button>
          </div>
        </div>
 
        {/* Content */}
        <p style={{ fontSize: isMobile ? "0.875rem" : "0.875rem", color: "rgba(240,237,230,0.75)", fontWeight: 300, lineHeight: 1.75, marginBottom: post.media ? "0.85rem" : "0.75rem", whiteSpace: "pre-line" }}>{post.content}</p>
 
        {/* Media */}
        {post.media && (
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "0.85rem" }}>
            {post.media.type === "audio" ? (
              <div style={{ background: post.media.gradient, padding: isMobile ? "1.1rem" : "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
                <div style={{ position: "absolute", right: -10, bottom: -10, fontSize: isMobile ? "5rem" : "7rem", color: post.author.accentColor, opacity: 0.12, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{post.media.symbol}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: post.author.accentColor, marginBottom: "0.2rem", opacity: 0.8 }}>Now Playing</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: isMobile ? "0.95rem" : "1.1rem", color: "#F0EDE6", letterSpacing: "-0.03em", marginBottom: "0.1rem" }}>{post.media.title}</div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.45)", fontWeight: 300 }}>{post.author.name} · {post.media.duration}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", position: "relative", zIndex: 1 }}>
                  {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      {Array.from({ length: 16 }, (_, i) => (
                        <motion.div key={i} animate={playing ? { height: [3, Math.random() * 22 + 3, 3] } : { height: 3 }} transition={{ duration: 0.5 + Math.random() * 0.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.04 }} style={{ width: 2.5, background: post.author.accentColor, borderRadius: 2, opacity: playing ? 1 : 0.4 }} />
                      ))}
                    </div>
                  )}
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setPlaying(!playing)} style={{ width: isMobile ? 40 : 44, height: isMobile ? 40 : 44, borderRadius: "50%", background: post.author.accentColor, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#080808", boxShadow: `0 0 18px ${post.author.accentColor}60`, flexShrink: 0 }}>
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </motion.button>
                </div>
              </div>
            ) : (
              <div style={{ background: post.media.gradient, height: isMobile ? 130 : 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
                <div style={{ fontSize: isMobile ? "4rem" : "5rem", color: post.author.accentColor, opacity: 0.2, userSelect: "none" }}>{post.media.symbol}</div>
              </div>
            )}
          </div>
        )}
 
        {/* Tags */}
        {post.tags && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {post.tags.slice(0, isMobile ? 3 : post.tags.length).map(tag => (
              <span key={tag} style={{ fontSize: "0.62rem", color: post.author.accentColor, background: `${post.author.accentColor}10`, border: `1px solid ${post.author.accentColor}22`, borderRadius: 5, padding: "1px 7px", cursor: "pointer" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
 
        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onLike(post.id)}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.38rem 0.7rem", background: post.liked ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${post.liked ? "rgba(236,72,153,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, cursor: "pointer", color: post.liked ? "#EC4899" : "rgba(240,237,230,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem" }}
            >
              <Heart size={13} fill={post.liked ? "#EC4899" : "none"} />
              <span>{formatNum(post.likes + (post.liked ? 1 : 0))}</span>
            </motion.button>
 
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowComments(!showComments)}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.38rem 0.7rem", background: showComments ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${showComments ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, cursor: "pointer", color: showComments ? "#22C55E" : "rgba(240,237,230,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem" }}
            >
              <MessageCircle size={13} />
              <span>{formatNum(post.comments)}</span>
            </motion.button>
 
            <ActionBtn icon={<Share2 size={13} />} count={formatNum(post.shares)} />
          </div>
 
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onBookmark(post.id)}
            style={{ width: 30, height: 30, borderRadius: 8, background: post.bookmarked ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${post.bookmarked ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: post.bookmarked ? "#EAB308" : "rgba(240,237,230,0.35)" }}
          >
            <Bookmark size={13} fill={post.bookmarked ? "#EAB308" : "none"} />
          </motion.button>
        </div>
 
        {/* Comment box */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div style={{ display: "flex", gap: "0.55rem" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #22C55E40, #22C55E15)", border: "1.5px solid #22C55E35", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.5rem", color: "#22C55E" }}>YOU</div>
                <div style={{ flex: 1, display: "flex", gap: "0.35rem" }}>
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Write a comment…"
                    onKeyDown={e => { if (e.key === "Enter" && comment.trim()) setComment(""); }}
                    style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.35)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                  <button style={{ width: 32, height: 32, borderRadius: 9, background: comment.trim() ? `linear-gradient(135deg, ${post.author.accentColor}, ${post.author.accentColor}bb)` : "rgba(255,255,255,0.04)", border: "none", cursor: comment.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", color: comment.trim() ? "#080808" : "rgba(240,237,230,0.2)", flexShrink: 0 }}>
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
 
// ─── MOBILE EXPLORE SHEET ─────────────────────────────────────────────────────
 
function MobileExploreSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "#0d0d0d", borderRadius: "20px 20px 0 0", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Handle */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 0" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
      </div>
 
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#F0EDE6" }}>Explore</h3>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)" }}><X size={14} /></button>
      </div>
 
      <div style={{ overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Trending */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
            <TrendingUp size={13} style={{ color: "#22C55E" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6" }}>Trending</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {TRENDING_TAGS.map((tag) => (
              <span key={tag} style={{ fontSize: "0.75rem", color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "0.35rem 0.85rem", cursor: "pointer" }}>{tag}</span>
            ))}
          </div>
        </div>
 
        {/* Suggested */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
            <Sparkles size={13} style={{ color: "#EAB308" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6" }}>Suggested Creatives</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {WHO_TO_FOLLOW.map((u) => (
              <div key={u.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${u.color}45, ${u.color}15)`, border: `1.5px solid ${u.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.7rem", color: u.color, flexShrink: 0 }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F0EDE6" }}>{u.name}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.35)" }}>{u.role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.65rem", color: u.color, fontWeight: 700 }}>{u.matchScore}%</span>
                  <button style={{ padding: "0.35rem 0.85rem", background: `${u.color}15`, border: `1px solid ${u.color}30`, borderRadius: 8, color: u.color, fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer" }}>Follow</button>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Hot collabs */}
        <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 14, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.5rem" }}>
            <Flame size={13} style={{ color: "#EAB308" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#EAB308" }}>Hot right now</span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#F0EDE6", fontWeight: 500, marginBottom: "0.25rem" }}>14 open collab requests match you</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(240,237,230,0.4)", marginBottom: "0.85rem" }}>3 added in the last hour</p>
          <a href="/matches" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.55rem 1.1rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", borderRadius: 9, color: "#080808", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}>
            View Collabs <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function FeedPage() {
  const isMobile = useIsMobile();
  const [feed, setFeed] = useState<FeedPost[]>(INITIAL_FEED);
  const [activeTab, setActiveTab] = useState<"all" | "activity" | "social" | "collabs">("all");
  const [loadingMore, setLoadingMore] = useState(false);
  const [newPostsBanner, setNewPostsBanner] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
 
  useEffect(() => {
    const t = setTimeout(() => setNewPostsBanner(true), 8000);
    return () => clearTimeout(t);
  }, []);
 
  const handleLike = (id: number) => setFeed(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  const handleBookmark = (id: number) => setFeed(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  const handlePost = (text: string) => {
    const newPost: FeedPost = {
      id: Date.now(), type: "social",
      author: { name: "Your Name", initials: "YOU", role: "Sound Producer", accentColor: "#22C55E", online: true },
      time: "Just now", content: text,
      likes: 0, comments: 0, shares: 0, liked: false, bookmarked: false,
    };
    setFeed(prev => [newPost, ...prev]);
  };
 
  const filtered = feed.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "activity") return p.type === "activity";
    if (activeTab === "social") return ["social", "track-drop", "project-drop"].includes(p.type);
    if (activeTab === "collabs") return p.type === "collab-invite";
    return true;
  });
 
  const TABS = [
    { id: "all",      label: "All",      count: feed.length },
    { id: "social",   label: "Posts",    count: feed.filter(p => ["social","track-drop","project-drop"].includes(p.type)).length },
    { id: "collabs",  label: "Collabs",  count: feed.filter(p => p.type === "collab-invite").length },
    { id: "activity", label: "Activity", count: feed.filter(p => p.type === "activity").length },
  ] as const;
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar { display: none; }
      `}</style>
 
      {/* Desktop sidebar — hidden on mobile */}
      {!isMobile && <DesktopSidebar />}
 
      <div style={{ flex: 1, overflowY: "auto", position: "relative", paddingBottom: isMobile ? "80px" : 0 }}>
        <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.06), transparent)", top: -100, right: 0 }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
 
          {/* ── TOP BAR ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: isMobile ? "1rem 1rem" : "1.25rem 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)",
            position: "sticky", top: 0, zIndex: 30,
          }}>
            {isMobile ? (
              <>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
                  Naija<span style={{ color: "#22C55E" }}>Collab</span>
                </span>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)" }}><Search size={15} /></button>
                  <button style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)", position: "relative" }}>
                    <Bell size={15} />
                    <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", animation: "pulse 2s ease-in-out infinite" }} />
                  </button>
                  <button
                    onClick={() => setShowExplore(true)}
                    style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)" }}
                  >
                    <LayoutGrid size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Community</div>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>Feed</h1>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)" }}><Search size={15} /></button>
                  <button style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)", position: "relative" }}>
                    <Bell size={15} />
                    <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", animation: "pulse 2s ease-in-out infinite" }} />
                  </button>
                </div>
              </>
            )}
          </div>
 
          {/* ── CONTENT ── */}
          <div style={{ display: "flex", gap: "1.5rem", padding: isMobile ? "1rem 0.875rem" : "1.5rem 2rem", alignItems: "flex-start" }}>
 
            {/* CENTER: Feed */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: isMobile ? "100%" : 640 }}>
 
              {/* Mobile stories */}
              {isMobile && <StoriesRow />}
 
              {/* New posts banner */}
              <AnimatePresence>
                {newPostsBanner && (
                  <motion.button
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16 }}
                    onClick={() => setNewPostsBanner(false)}
                    style={{ width: "100%", padding: "0.6rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, color: "#22C55E", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", marginBottom: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <RefreshCw size={12} /> 4 new posts — tap to refresh
                  </motion.button>
                )}
              </AnimatePresence>
 
              {/* Compose */}
              <ComposeBox onPost={handlePost} isMobile={isMobile} />
 
              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "0.25rem" }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ flex: 1, padding: isMobile ? "0.5rem 0.25rem" : "0.55rem 0.5rem", borderRadius: 9, background: activeTab === tab.id ? "rgba(34,197,94,0.12)" : "transparent", border: `1px solid ${activeTab === tab.id ? "rgba(34,197,94,0.3)" : "transparent"}`, color: activeTab === tab.id ? "#22C55E" : "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "0.7rem" : "0.75rem", fontWeight: activeTab === tab.id ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}
                  >
                    {tab.label}
                    <span style={{ fontSize: "0.58rem", background: activeTab === tab.id ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)", borderRadius: 100, padding: "1px 5px", color: activeTab === tab.id ? "#22C55E" : "rgba(240,237,230,0.3)" }}>{tab.count}</span>
                  </button>
                ))}
              </div>
 
              {/* Posts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <AnimatePresence>
                  {filtered.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} onLike={handleLike} onBookmark={handleBookmark} isMobile={isMobile} />
                  ))}
                </AnimatePresence>
 
                <button
                  onClick={() => { setLoadingMore(true); setTimeout(() => setLoadingMore(false), 1200); }}
                  disabled={loadingMore}
                  style={{ padding: "0.8rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "rgba(240,237,230,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  {loadingMore ? <><RefreshCw size={13} style={{ animation: "spin 0.8s linear infinite" }} /> Loading…</> : "Load more"}
                </button>
              </div>
            </div>
 
            {/* RIGHT sidebar — desktop only */}
            {!isMobile && (
              <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "5rem" }}>
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                    <TrendingUp size={13} style={{ color: "#22C55E" }} />
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6" }}>Trending</h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {TRENDING_TAGS.map((tag, i) => (
                      <motion.button key={tag} whileHover={{ x: 3 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.6rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 9, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      >
                        <span style={{ fontSize: "0.78rem", color: "#22C55E", fontWeight: 500 }}>{tag}</span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.25)" }}>{[284, 156, 142, 98, 73, 61][i]} posts</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
 
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} style={{ color: "#EAB308" }} />
                      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6" }}>Suggested</h4>
                    </div>
                    <a href="/matches" style={{ fontSize: "0.68rem", color: "#22C55E", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>See all <ChevronRight size={11} /></a>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {WHO_TO_FOLLOW.map((u) => (
                      <div key={u.name} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${u.color}45, ${u.color}15)`, border: `1.5px solid ${u.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.65rem", color: u.color, flexShrink: 0 }}>{u.initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#F0EDE6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                          <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{u.role}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.6rem", color: u.color, fontWeight: 700 }}>{u.matchScore}%</span>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: 24, height: 24, borderRadius: "50%", background: `${u.color}15`, border: `1px solid ${u.color}30`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: u.color }}>
                            <Plus size={11} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
 
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.07), rgba(34,197,94,0.02))", border: "1px solid rgba(34,197,94,0.14)", borderRadius: 16, padding: "1.25rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.6rem" }}>
                    <Flame size={13} style={{ color: "#EAB308" }} />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#EAB308" }}>Hot right now</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#F0EDE6", fontWeight: 500, marginBottom: "0.35rem", lineHeight: 1.4 }}>14 open collab requests match your producer profile</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, marginBottom: "1rem" }}>3 added in the last hour</p>
                  <a href="/matches" style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.55rem 1rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", borderRadius: 9, color: "#080808", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}>
                    View Collabs <ArrowUpRight size={12} />
                  </a>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Mobile bottom nav */}
      {isMobile && <MobileBottomNav />}
 
      {/* Mobile explore sheet */}
      <AnimatePresence>
        {showExplore && isMobile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExplore(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 199 }} />
            <MobileExploreSheet onClose={() => setShowExplore(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
 