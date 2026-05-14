"use client";
 
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Plus, Paperclip, Smile, MoreHorizontal,
  Phone, Video, Info, Check, CheckCheck, Circle,
  Zap, Users, FolderOpen, MessageCircle, BookOpen,
  Settings, LogOut, Music, Palette, Code, Camera,
  X, ArrowLeft, Mic, Image, FileText, Star,
  ChevronDown, Pin, Trash2, BellOff, UserPlus
} from "lucide-react";
 
// ─── TYPES ───────────────────────────────────────────────────────────────────
 
interface Message {
  id: number;
  senderId: "me" | number;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "collab-invite" | "file";
  fileName?: string;
  replyTo?: number;
}
 
interface Conversation {
  id: number;
  name: string;
  initials: string;
  role: string;
  location: string;
  accentColor: string;
  roleIcon: React.ReactNode;
  online: boolean;
  lastSeen?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  pinned?: boolean;
  messages: Message[];
  matchScore: number;
}
 
// ─── DATA ─────────────────────────────────────────────────────────────────────
 
const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Tunde Adeyemi", initials: "TA", role: "Sound Producer",
    location: "Lagos", accentColor: "#22C55E", roleIcon: <Music size={11} />,
    online: true, lastMessage: "Bro the mix is 🔥🔥 send me the stems",
    lastTime: "2m", unread: 2, pinned: true, matchScore: 98,
    messages: [
      { id: 1, senderId: 1, text: "Yo! Saw your profile on NaijaCollab. Your sound is different, I rate it.", time: "Yesterday 10:14", status: "read", type: "text" },
      { id: 2, senderId: "me", text: "Appreciate it bro 🙏 I've been working on this Afrobeats EP for a minute. Tryna get the right people on it.", time: "Yesterday 10:18", status: "read", type: "text" },
      { id: 3, senderId: 1, text: "Say less. I produce everything — beats, mixing, mastering. Lemme hear what you have so far.", time: "Yesterday 10:21", status: "read", type: "text" },
      { id: 4, senderId: "me", text: "Sending you a rough cut of track 3 now. It's still raw but you'll hear the vision.", time: "Yesterday 11:04", status: "read", type: "text" },
      { id: 5, senderId: "me", text: "BeatStreet_Track3_rough.mp3", time: "Yesterday 11:05", status: "read", type: "file", fileName: "BeatStreet_Track3_rough.mp3" },
      { id: 6, senderId: 1, text: "Bro the mix is 🔥🔥 send me the stems", time: "2m ago", status: "read", type: "text" },
    ],
  },
  {
    id: 2, name: "Chisom Obi", initials: "CO", role: "UI/UX Designer",
    location: "Abuja", accentColor: "#EAB308", roleIcon: <Palette size={11} />,
    online: true, lastMessage: "I'll have the artwork mockups by Friday 💛", lastTime: "18m", unread: 0, matchScore: 94,
    messages: [
      { id: 1, senderId: "me", text: "Hey Chisom! I need a visual identity for my EP. Saw your work — the Kaya Labs branding was clean.", time: "Mon 09:00", status: "read", type: "text" },
      { id: 2, senderId: 2, text: "Hi! Yes I remember that project 😊 I'd love to help. What's the vibe you're going for?", time: "Mon 09:15", status: "read", type: "text" },
      { id: 3, senderId: "me", text: "Street meets luxury. Lagos at night energy. Think neon, dark backgrounds, gold accents.", time: "Mon 09:22", status: "read", type: "text" },
      { id: 4, senderId: 2, text: "Okay I can visualise that already. Let me pull some references and send you a mood board today.", time: "Mon 10:00", status: "read", type: "text" },
      { id: 5, senderId: 2, text: "I'll have the artwork mockups by Friday 💛", time: "18m ago", status: "read", type: "text" },
    ],
  },
  {
    id: 3, name: "Amara Sule", initials: "AS", role: "Photographer",
    location: "Lagos", accentColor: "#EC4899", roleIcon: <Camera size={11} />,
    online: false, lastSeen: "1h ago", lastMessage: "Saturday works! Let's lock it in 📸", lastTime: "1h", unread: 1, matchScore: 88,
    messages: [
      { id: 1, senderId: 3, text: "Your NaijaCollab profile mentioned you need a photographer for an EP cover? I'm very interested.", time: "Sun 14:00", status: "read", type: "text" },
      { id: 2, senderId: "me", text: "Yes! I've been following your work for a while. Your editorial shots are exactly the style I'm after.", time: "Sun 14:30", status: "read", type: "text" },
      { id: 3, senderId: 3, text: "I'm honoured 🙏 When are you thinking for the shoot? I have a studio in VI with the perfect setup.", time: "Sun 15:00", status: "read", type: "text" },
      { id: 4, senderId: "me", text: "Can we do this Saturday? Early morning light would be perfect.", time: "Sun 15:10", status: "read", type: "text" },
      { id: 5, senderId: 3, text: "Saturday works! Let's lock it in 📸", time: "1h ago", status: "read", type: "text" },
    ],
  },
  {
    id: 4, name: "Emeka Nwosu", initials: "EN", role: "Full-Stack Dev",
    location: "Port Harcourt", accentColor: "#3B82F6", roleIcon: <Code size={11} />,
    online: false, lastSeen: "3h ago", lastMessage: "The API is ready. You can test it now.", lastTime: "3h", unread: 0, matchScore: 91,
    messages: [
      { id: 1, senderId: "me", text: "Emeka I need a dev to build out the artist page for my EP. Nothing too complex but it needs to be fire.", time: "Fri 16:00", status: "read", type: "text" },
      { id: 2, senderId: 4, text: "I'm in. What stack are you using or do you want me to choose?", time: "Fri 16:10", status: "read", type: "text" },
      { id: 3, senderId: "me", text: "Next.js, keep it simple. The design is coming from Chisom.", time: "Fri 16:15", status: "read", type: "text" },
      { id: 4, senderId: 4, text: "Perfect. Send me the Figma when it's ready and I'll get started.", time: "Fri 16:30", status: "read", type: "text" },
      { id: 5, senderId: 4, text: "The API is ready. You can test it now.", time: "3h ago", status: "read", type: "text" },
    ],
  },
  {
    id: 5, name: "Seun Balogun", initials: "SB", role: "Videographer",
    location: "Ibadan", accentColor: "#F97316", roleIcon: <Camera size={11} />,
    online: true, lastMessage: "Can we hop on a quick call?", lastTime: "Yesterday", unread: 0, matchScore: 85,
    messages: [
      { id: 1, senderId: 5, text: "I want to pitch you something. A short film that ties into the EP release. 3-4 minutes, cinematic.", time: "Wed 11:00", status: "read", type: "text" },
      { id: 2, senderId: "me", text: "Now you're talking. Send me your treatment doc.", time: "Wed 11:20", status: "read", type: "text" },
      { id: 3, senderId: 5, text: "EP_ShortFilm_Treatment_v1.pdf", time: "Wed 11:25", status: "read", type: "file", fileName: "EP_ShortFilm_Treatment_v1.pdf" },
      { id: 4, senderId: 5, text: "Can we hop on a quick call?", time: "Yesterday", status: "read", type: "text" },
    ],
  },
  {
    id: 6, name: "Funke Adesanya", initials: "FA", role: "Visual Artist",
    location: "Remote", accentColor: "#A855F7", roleIcon: <Palette size={11} />,
    online: false, lastSeen: "2d ago", lastMessage: "Sent you 3 concepts. Let me know which direction.", lastTime: "2d", unread: 0, matchScore: 82,
    messages: [
      { id: 1, senderId: "me", text: "Funke your digital art is incredible. I want to commission something for the EP — like a visual world for the music.", time: "Mon 09:00", status: "read", type: "text" },
      { id: 2, senderId: 6, text: "I love this brief. Music-to-visual translation is what I do best. What's the emotional core of the EP?", time: "Mon 10:00", status: "read", type: "text" },
      { id: 3, senderId: "me", text: "Resilience, coming up, Lagos hustle, but told with beauty not pain.", time: "Mon 10:15", status: "read", type: "text" },
      { id: 4, senderId: 6, text: "Sent you 3 concepts. Let me know which direction.", time: "2d ago", status: "read", type: "text" },
    ],
  },
];
 
// ─── HELPERS ──────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", ...style }} />;
}
 
function MessageStatusIcon({ status }: { status: Message["status"] }) {
  if (status === "read") return <CheckCheck size={12} style={{ color: "#22C55E" }} />;
  if (status === "delivered") return <CheckCheck size={12} style={{ color: "rgba(240,237,230,0.3)" }} />;
  return <Check size={12} style={{ color: "rgba(240,237,230,0.3)" }} />;
}
 
// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
 
function AppSidebar() {
  const navItems = [
    { label: "Dashboard", icon: <Zap size={16} />, href: "/dashboard" },
    { label: "Matches",   icon: <Users size={16} />, href: "/matches" },
    { label: "Projects",  icon: <FolderOpen size={16} />, href: "/projects" },
    { label: "Messages",  icon: <MessageCircle size={16} />, href: "/messages" },
    { label: "Portfolio", icon: <BookOpen size={16} />, href: "/portfolio" },
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
          const isActive = item.label === "Messages";
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
              {item.label === "Messages" && (
                <span style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#080808" }}>3</span>
              )}
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
 
// ─── CONVERSATION LIST ────────────────────────────────────────────────────────
 
function ConversationList({
  conversations, activeId, onSelect, search, onSearchChange,
}: {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const pinned = conversations.filter(c => c.pinned);
  const others = conversations.filter(c => !c.pinned);
  const [searchFocused, setSearchFocused] = useState(false);
 
  const filtered = (list: Conversation[]) =>
    list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
    );
 
  return (
    <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.055)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.04em", color: "#F0EDE6" }}>Messages</h2>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#22C55E" }}>
            <Plus size={15} />
          </motion.button>
        </div>
        {/* Search */}
        <div style={{ position: "relative", background: "rgba(255,255,255,0.04)", border: `1px solid ${searchFocused ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, transition: "border-color 0.2s" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,230,0.3)" }} />
          <input
            value={search} onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            placeholder="Search conversations…"
            style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.2rem", background: "transparent", border: "none", outline: "none", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}
          />
        </div>
      </div>
 
      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.6rem" }}>
        {/* Pinned */}
        {filtered(pinned).length > 0 && (
          <div style={{ marginBottom: "0.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.5rem 0.6rem 0.35rem", marginBottom: "0.1rem" }}>
              <Pin size={10} style={{ color: "rgba(240,237,230,0.25)" }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,230,0.25)" }}>Pinned</span>
            </div>
            {filtered(pinned).map((c, i) => <ConvItem key={c.id} conv={c} index={i} isActive={activeId === c.id} onClick={() => onSelect(c.id)} />)}
          </div>
        )}
 
        {/* All */}
        {filtered(others).length > 0 && (
          <div>
            {filtered(pinned).length > 0 && (
              <div style={{ padding: "0.5rem 0.6rem 0.35rem" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,230,0.2)" }}>All Messages</span>
              </div>
            )}
            {filtered(others).map((c, i) => <ConvItem key={c.id} conv={c} index={i + filtered(pinned).length} isActive={activeId === c.id} onClick={() => onSelect(c.id)} />)}
          </div>
        )}
 
        {filtered(pinned).length === 0 && filtered(others).length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
            <p style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
 
function ConvItem({ conv, index, isActive, onClick }: { conv: Conversation; index: number; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.75rem 0.75rem", borderRadius: 12, cursor: "pointer",
        background: isActive ? "rgba(34,197,94,0.1)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : "transparent"}`,
        marginBottom: "0.15rem", transition: "all 0.18s",
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: `linear-gradient(135deg, ${conv.accentColor}45, ${conv.accentColor}18)`,
          border: `1.5px solid ${conv.accentColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.78rem", color: conv.accentColor,
        }}>{conv.initials}</div>
        {conv.online && (
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", boxShadow: "0 0 5px #22C55E" }} />
        )}
      </div>
 
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.84rem", color: "#F0EDE6", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "65%" }}>{conv.name}</span>
          <span style={{ fontSize: "0.62rem", color: conv.unread > 0 ? "#22C55E" : "rgba(240,237,230,0.25)", fontWeight: 300, flexShrink: 0 }}>{conv.lastTime}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}>{conv.lastMessage}</span>
          {conv.unread > 0 && (
            <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 700, color: "#080808", flexShrink: 0 }}>{conv.unread}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── CHAT WINDOW ─────────────────────────────────────────────────────────────
 
function ChatWindow({
  conv,
  onBack,
  onSend,
}: {
  conv: Conversation;
  onBack: () => void;
  onSend: (convId: number, text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const EMOJIS = ["🔥", "💛", "🙏", "😊", "💯", "🎵", "🎨", "💻", "🚀", "👀", "✅", "💪"];
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv.messages]);
 
  // Simulate typing indicator
  useEffect(() => {
    if (conv.online) {
      const t = setTimeout(() => setIsTyping(true), 2000);
      const t2 = setTimeout(() => setIsTyping(false), 5000);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [conv.id, conv.online]);
 
  const handleSend = () => {
    if (!input.trim()) return;
    onSend(conv.id, input.trim());
    setInput("");
    setShowEmoji(false);
  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
 
  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  conv.messages.forEach(msg => {
    const dateStr = msg.time.includes("Yesterday") ? "Yesterday" : msg.time.includes("ago") ? "Today" : msg.time.split(" ")[0];
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== dateStr) groupedMessages.push({ date: dateStr, messages: [msg] });
    else last.messages.push(msg);
  });
 
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      {/* Background subtle orb */}
      <Orb style={{ width: 400, height: 400, background: `radial-gradient(circle, ${conv.accentColor}06, transparent)`, top: "10%", right: "10%", pointerEvents: "none" }} />
 
      {/* ── CHAT HEADER ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 20, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          {/* Back (mobile) */}
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.4)", display: "flex", padding: "0.25rem" }}>
            <ArrowLeft size={18} />
          </button>
 
          <div style={{ position: "relative" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${conv.accentColor}45, ${conv.accentColor}18)`, border: `1.5px solid ${conv.accentColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.78rem", color: conv.accentColor }}>
              {conv.initials}
            </div>
            {conv.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #080808", boxShadow: "0 0 5px #22C55E" }} />}
          </div>
 
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: "0.1rem" }}>{conv.name}</div>
            <div style={{ fontSize: "0.7rem", color: conv.online ? "#22C55E" : "rgba(240,237,230,0.35)", fontWeight: 300, display: "flex", alignItems: "center", gap: 5 }}>
              {conv.online ? (
                <><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 5px #22C55E" }} /> Online now</>
              ) : `Last seen ${conv.lastSeen}`}
            </div>
          </div>
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {/* Match score pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: `${conv.accentColor}12`, border: `1px solid ${conv.accentColor}25`, borderRadius: 100, padding: "4px 12px", marginRight: "0.5rem" }}>
            <Zap size={10} fill={conv.accentColor} color={conv.accentColor} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: conv.accentColor }}>{conv.matchScore}% match</span>
          </div>
 
          {[
            { icon: <Phone size={16} />, tip: "Call" },
            { icon: <Video size={16} />, tip: "Video" },
            { icon: <Info size={16} />, tip: "Info", onClick: () => setShowInfo(!showInfo) },
          ].map((btn) => (
            <motion.button key={btn.tip} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={btn.onClick} title={btn.tip} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.5)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              {btn.icon}
            </motion.button>
          ))}
        </div>
      </div>
 
      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0" }}>
        {groupedMessages.map(({ date, messages }) => (
          <div key={date}>
            {/* Date divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.25rem 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,230,0.25)", whiteSpace: "nowrap" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>
 
            {messages.map((msg, i) => {
              const isMe = msg.senderId === "me";
              const prevMsg = i > 0 ? messages[i - 1] : null;
              const isConsecutive = prevMsg && prevMsg.senderId === msg.senderId;
 
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: isConsecutive ? "0.25rem" : "0.85rem",
                    paddingLeft: isMe ? "15%" : "0",
                    paddingRight: isMe ? "0" : "15%",
                  }}
                >
                  {/* Avatar for other person (only show on first of consecutive) */}
                  {!isMe && !isConsecutive && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${conv.accentColor}40, ${conv.accentColor}15)`, border: `1px solid ${conv.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.58rem", color: conv.accentColor, flexShrink: 0, alignSelf: "flex-end", marginRight: "0.6rem" }}>
                      {conv.initials}
                    </div>
                  )}
                  {!isMe && isConsecutive && <div style={{ width: 28, marginRight: "0.6rem", flexShrink: 0 }} />}
 
                  <div style={{ maxWidth: "100%" }}>
                    {/* File message */}
                    {msg.type === "file" ? (
                      <div style={{
                        display: "flex", alignItems: "center", gap: "0.65rem",
                        padding: "0.7rem 1rem",
                        background: isMe ? `linear-gradient(135deg, ${conv.accentColor}25, ${conv.accentColor}12)` : "rgba(255,255,255,0.06)",
                        border: `1px solid ${isMe ? `${conv.accentColor}35` : "rgba(255,255,255,0.09)"}`,
                        borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: isMe ? `${conv.accentColor}25` : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileText size={14} color={isMe ? conv.accentColor : "rgba(240,237,230,0.6)"} />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.78rem", color: "#F0EDE6", fontWeight: 500 }}>{msg.fileName}</div>
                          <div style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>Tap to download</div>
                        </div>
                      </div>
                    ) : (
                      /* Text message */
                      <div style={{
                        padding: "0.65rem 0.95rem",
                        background: isMe
                          ? `linear-gradient(135deg, ${conv.accentColor}28, ${conv.accentColor}15)`
                          : "rgba(255,255,255,0.06)",
                        border: `1px solid ${isMe ? `${conv.accentColor}30` : "rgba(255,255,255,0.08)"}`,
                        borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      }}>
                        <p style={{ fontSize: "0.875rem", color: "#F0EDE6", fontWeight: 300, lineHeight: 1.55, margin: 0, wordBreak: "break-word" }}>{msg.text}</p>
                      </div>
                    )}
 
                    {/* Time + status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: isMe ? "flex-end" : "flex-start", marginTop: "0.2rem", paddingLeft: "0.2rem", paddingRight: "0.2rem" }}>
                      <span style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.22)", fontWeight: 300 }}>{msg.time}</span>
                      {isMe && <MessageStatusIcon status={msg.status} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
 
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: "flex", alignItems: "flex-end", gap: "0.6rem", marginBottom: "0.75rem" }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${conv.accentColor}40, ${conv.accentColor}15)`, border: `1px solid ${conv.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.58rem", color: conv.accentColor }}>
                {conv.initials}
              </div>
              <div style={{ padding: "0.65rem 0.95rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px 14px 14px 4px", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} style={{ width: 5, height: 5, borderRadius: "50%", background: conv.accentColor, opacity: 0.7 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        <div ref={bottomRef} />
      </div>
 
      {/* ── INPUT BAR ── */}
      <div style={{ padding: "0.85rem 1.25rem 1rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.9)", backdropFilter: "blur(20px)", flexShrink: 0, position: "relative" }}>
 
        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "1.25rem", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "0.75rem", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.4rem", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
            >
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { setInput(prev => prev + e); setShowEmoji(false); }} style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                  onMouseEnter={e2 => (e2.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={e2 => (e2.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                >{e}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Attach popup */}
        <AnimatePresence>
          {showAttach && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "3.5rem", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", minWidth: 160 }}
            >
              {[
                { icon: <Image size={14} />, label: "Photo / Video", color: "#EC4899" },
                { icon: <FileText size={14} />, label: "Document", color: "#3B82F6" },
                { icon: <Music size={14} />, label: "Audio file", color: "#22C55E" },
              ].map(item => (
                <button key={item.label} onClick={() => setShowAttach(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1rem", background: "transparent", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300, textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color: item.color, display: "flex" }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
 
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Attach */}
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }} style={{ width: 36, height: 36, borderRadius: 10, background: showAttach ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${showAttach ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: showAttach ? "#22C55E" : "rgba(240,237,230,0.45)", transition: "all 0.2s", flexShrink: 0 }}>
            <Paperclip size={15} />
          </motion.button>
 
          {/* Input */}
          <div style={{ flex: 1, position: "relative", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, display: "flex", alignItems: "center", transition: "border-color 0.2s" }}
            onFocus={() => { const el = document.querySelector(".msg-input") as HTMLElement; if (el) el.closest("div")!.style.borderColor = "rgba(34,197,94,0.4)"; }}
          >
            <input
              ref={inputRef}
              className="msg-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${conv.name.split(" ")[0]}…`}
              style={{ flex: 1, padding: "0.7rem 0.9rem", background: "transparent", border: "none", outline: "none", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem" }}
            />
            {/* Emoji btn inside */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }} style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: showEmoji ? "#EAB308" : "rgba(240,237,230,0.3)", marginRight: "0.3rem", transition: "color 0.2s", flexShrink: 0 }}>
              <Smile size={16} />
            </motion.button>
          </div>
 
          {/* Send / Mic */}
          <AnimatePresence mode="wait">
            {input.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                whileHover={{ scale: 1.06, boxShadow: `0 0 18px ${conv.accentColor}40` }}
                whileTap={{ scale: 0.93 }}
                onClick={handleSend}
                style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${conv.accentColor}, ${conv.accentColor}bb)`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#080808", flexShrink: 0 }}
              >
                <Send size={16} />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)", flexShrink: 0 }}
              >
                <Mic size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
 
// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
 
function EmptyState() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
      <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent)", top: "20%", left: "30%" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>
          💬
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.04em", color: "#F0EDE6", marginBottom: "0.5rem" }}>
          Pick a conversation
        </h3>
        <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, maxWidth: 280, lineHeight: 1.65 }}>
          Select a message on the left to start chatting, or connect with a new creative from your matches.
        </p>
        <motion.a href="/matches" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1.5rem", padding: "0.7rem 1.5rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#080808", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem" }}>
          <UserPlus size={14} /> Find Collabs
        </motion.a>
      </motion.div>
    </div>
  );
}
 
// ─── INFO PANEL ──────────────────────────────────────────────────────────────
 
function InfoPanel({ conv, onClose }: { conv: Conversation; onClose: () => void }) {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 260, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}
    >
      <div style={{ width: 260, height: "100vh", overflowY: "auto", padding: "1.5rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,237,230,0.4)" }}><X size={13} /></button>
        </div>
 
        {/* Profile */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${conv.accentColor}45, ${conv.accentColor}18)`, border: `2px solid ${conv.accentColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: conv.accentColor, margin: "0 auto 0.85rem" }}>
            {conv.initials}
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", letterSpacing: "-0.02em" }}>{conv.name}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: "0.3rem" }}>
            <span style={{ color: conv.accentColor, display: "flex" }}>{conv.roleIcon}</span>
            <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.4)", fontWeight: 300 }}>{conv.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: "0.2rem" }}>
            <span style={{ fontSize: "0.65rem", color: conv.online ? "#22C55E" : "rgba(240,237,230,0.3)" }}>
              {conv.online ? "● Online" : `Last seen ${conv.lastSeen}`}
            </span>
          </div>
        </div>
 
        {/* Match score */}
        <div style={{ padding: "0.85rem 1rem", background: `${conv.accentColor}10`, border: `1px solid ${conv.accentColor}20`, borderRadius: 12, marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.5)", fontWeight: 300 }}>Match Score</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Zap size={11} fill={conv.accentColor} color={conv.accentColor} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: conv.accentColor }}>{conv.matchScore}%</span>
          </div>
        </div>
 
        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
          {[
            { icon: <UserPlus size={13} />, label: "View Profile" },
            { icon: <FolderOpen size={13} />, label: "Start a Project" },
            { icon: <BellOff size={13} />, label: "Mute Notifications" },
            { icon: <Pin size={13} />, label: "Pin Conversation" },
            { icon: <Trash2 size={13} />, label: "Delete Conversation", danger: true },
          ].map(item => (
            <button key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 9, color: (item as any).danger ? "#EF4444" : "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 300, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = (item as any).danger ? "#EF4444" : "#F0EDE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = (item as any).danger ? "#EF4444" : "rgba(240,237,230,0.55)"; }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
 
        {/* Shared files stub */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,230,0.25)", marginBottom: "0.75rem" }}>Shared Files</div>
          {conv.messages.filter(m => m.type === "file").map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.65rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: "0.35rem" }}>
              <FileText size={12} style={{ color: conv.accentColor, flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.5)", fontWeight: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.fileName}</span>
            </div>
          ))}
          {conv.messages.filter(m => m.type === "file").length === 0 && (
            <p style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.2)", fontWeight: 300 }}>No files shared yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);
 
  const activeConv = conversations.find(c => c.id === activeId) ?? null;
 
  const handleSend = (convId: number, text: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const newMsg: Message = {
        id: c.messages.length + 1,
        senderId: "me",
        text,
        time: "Just now",
        status: "sent",
        type: "text",
      };
      return { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: "now", unread: 0 };
    }));
  };
 
  const handleSelect = (id: number) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowInfo(false);
  };
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
 
      <AppSidebar />
 
      {/* Conversation list */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        search={search}
        onSearchChange={setSearch}
      />
 
      {/* Chat area */}
      {activeConv ? (
        <>
          <ChatWindow
            conv={activeConv}
            onBack={() => setActiveId(null)}
            onSend={handleSend}
          />
          <AnimatePresence>
            {showInfo && <InfoPanel conv={activeConv} onClose={() => setShowInfo(false)} />}
          </AnimatePresence>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
 