"use client";
 
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Shield, Palette, Link2, CreditCard,
  Zap, Users, FolderOpen, MessageCircle, BookOpen,
  Settings, LogOut, ChevronRight, Check, X, Eye,
  EyeOff, Upload, Trash2, AlertTriangle, Music,
  Code, Camera, Video, Globe, Mic, Save, RefreshCw, Lock, Mail,
  Smartphone, Monitor, Moon, Sun, Volume2, BellOff,
  BellRing, UserX, Download, ExternalLink, Plus,
  MapPin, Badge, ToggleLeft, ToggleRight, Info
} from "lucide-react";
 import Link from "next/link";
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
type SettingsSection =
  | "profile"
  | "account"
  | "notifications"
  | "privacy"
  | "appearance"
  | "connections"
  | "danger";
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", ...style }} />;
}
 
function Toggle({ on, onChange, color = "#22C55E" }: { on: boolean; onChange: () => void; color?: string }) {
  return (
    <motion.button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 100,
        background: on ? color : "rgba(255,255,255,0.1)",
        border: `1px solid ${on ? color : "rgba(255,255,255,0.12)"}`,
        position: "relative", cursor: "pointer",
        transition: "background 0.25s, border-color 0.25s",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
      />
    </motion.button>
  );
}
 
function SettingRow({
  label, description, children, danger,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 1.25rem",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      gap: "1rem",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.875rem", color: danger ? "#EF4444" : "#F0EDE6", fontWeight: 400, marginBottom: description ? "0.2rem" : 0 }}>{label}</div>
        {description && <div style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, lineHeight: 1.5 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}
 
function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}
 
function SectionTitle({ label, description }: { label: string; description?: string }) {
  return (
    <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#F0EDE6", letterSpacing: "-0.02em", marginBottom: description ? "0.2rem" : 0 }}>{label}</h3>
      {description && <p style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{description}</p>}
    </div>
  );
}
 
function InputField({
  label, value, onChange, type = "text", placeholder, hint, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.45rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={isPassword && !show ? "password" : "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: isPassword ? "0.8rem 2.75rem 0.8rem 1rem" : "0.8rem 1rem",
            background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${focused ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: 10, color: disabled ? "rgba(240,237,230,0.35)" : "#F0EDE6",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(34,197,94,0.08)" : "none",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {isPassword && (
          <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(240,237,230,0.3)", display: "flex" }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <p style={{ fontSize: "0.68rem", color: "rgba(240,237,230,0.25)", marginTop: "0.35rem", fontWeight: 300 }}>{hint}</p>}
    </div>
  );
}
 
// ─── SIDEBAR NAV ─────────────────────────────────────────────────────────────
 
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
        {navItems.map((item) => (
          <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", borderRadius: 10, background: "transparent", border: "1px solid transparent", color: "rgba(240,237,230,0.45)", textDecoration: "none", fontSize: "0.845rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#F0EDE6"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,230,0.45)"; }}
          >
            <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {[{ label: "Settings", icon: <Settings size={15} />, active: true }, { label: "Sign Out", icon: <LogOut size={15} /> }].map(item => (
          <button key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: 10, background: (item as any).active ? "rgba(34,197,94,0.1)" : "transparent", border: `1px solid ${(item as any).active ? "rgba(34,197,94,0.2)" : "transparent"}`, color: (item as any).active ? "#22C55E" : "rgba(240,237,230,0.3)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif", fontWeight: (item as any).active ? 500 : 400, transition: "all 0.2s", textAlign: "left" }}
            onMouseEnter={e => { if (!(item as any).active) { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
            onMouseLeave={e => { if (!(item as any).active) { e.currentTarget.style.color = "rgba(240,237,230,0.3)"; e.currentTarget.style.background = "transparent"; }}}
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
 
// ─── SETTINGS NAV ─────────────────────────────────────────────────────────────
 
const SETTINGS_NAV: { id: SettingsSection; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "profile",       label: "Profile",       icon: <User size={15} /> },
  { id: "account",       label: "Account",       icon: <Lock size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} />, badge: "3" },
  { id: "privacy",       label: "Privacy",       icon: <Shield size={15} /> },
  { id: "appearance",    label: "Appearance",    icon: <Palette size={15} /> },
  { id: "connections",   label: "Connections",   icon: <Link2 size={15} /> },
  { id: "danger",        label: "Danger Zone",   icon: <AlertTriangle size={15} /> },
];
 
// ─── PROFILE SECTION ─────────────────────────────────────────────────────────
 
function ProfileSection() {
  const [profile, setProfile] = useState({
    name: "Your Name", username: "yourname", email: "you@example.com",
    role: "Sound Producer", location: "Lagos, Nigeria",
    bio: "Award-winning producer from Lagos. Afrobeats with depth.",
    website: "https://yoursite.com",
  });
  const [saved, setSaved] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Sound Producer");
 
  const roles = [
    { label: "Sound Producer", icon: <Music size={12} />, color: "#22C55E" },
    { label: "Developer",      icon: <Code size={12} />,  color: "#3B82F6" },
    { label: "Designer",       icon: <Mic size={12} />,   color: "#EAB308" },
    { label: "Photographer",   icon: <Camera size={12} />, color: "#EC4899" },
    { label: "Videographer",   icon: <Video size={12} />, color: "#F97316" },
  ];
 
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
 
      {/* Avatar */}
      <SectionCard>
        <SectionTitle label="Profile Picture" description="This is how other creatives will see you" />
        <div style={{ padding: "1.5rem 1.25rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E50, #22C55E18)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#22C55E", boxShadow: "0 0 24px rgba(34,197,94,0.15)" }}>
              YOU
            </div>
            <button style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#22C55E", border: "2px solid #080808", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Upload size={10} color="#080808" />
            </button>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", color: "rgba(240,237,230,0.6)", fontWeight: 300, marginBottom: "0.75rem", lineHeight: 1.6 }}>Upload a photo — JPG, PNG or GIF, max 5MB</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ padding: "0.45rem 1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, color: "#22C55E", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <Upload size={12} /> Upload Photo
              </button>
              <button style={{ padding: "0.45rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </SectionCard>
 
      {/* Basic info */}
      <SectionCard>
        <SectionTitle label="Basic Information" />
        <div style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <InputField label="Full Name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} placeholder="Your name" />
            <InputField label="Username" value={profile.username} onChange={v => setProfile({ ...profile, username: v })} placeholder="@handle" hint="naijancollab.co/@yourname" />
          </div>
          <InputField label="Email Address" value={profile.email} onChange={v => setProfile({ ...profile, email: v })} type="email" placeholder="you@example.com" />
          <InputField label="Location" value={profile.location} onChange={v => setProfile({ ...profile, location: v })} placeholder="City, Country" />
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,230,0.35)", marginBottom: "0.45rem" }}>Bio</label>
            <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} placeholder="Tell creatives who you are…" style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", resize: "none", lineHeight: 1.65 }}
              onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.3rem" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(240,237,230,0.25)" }}>{profile.bio.length}/250</span>
            </div>
          </div>
          <InputField label="Website" value={profile.website} onChange={v => setProfile({ ...profile, website: v })} placeholder="https://yoursite.com" />
        </div>
      </SectionCard>
 
      {/* Role */}
      <SectionCard>
        <SectionTitle label="Creative Role" description="This shapes who you match with on NaijaCollab" />
        <div style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem" }}>
            {roles.map(r => (
              <motion.button key={r.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedRole(r.label)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", borderRadius: 10, cursor: "pointer", background: selectedRole === r.label ? `${r.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${selectedRole === r.label ? `${r.color}45` : "rgba(255,255,255,0.07)"}`, color: selectedRole === r.label ? r.color : "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: selectedRole === r.label ? 500 : 400, transition: "all 0.2s" }}>
                <span style={{ display: "flex", color: "inherit" }}>{r.icon}</span> {r.label}
                {selectedRole === r.label && <Check size={11} style={{ marginLeft: "auto", color: r.color }} />}
              </motion.button>
            ))}
          </div>
        </div>
      </SectionCard>
 
      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.25)" }} whileTap={{ scale: 0.97 }} onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", background: "linear-gradient(135deg, #22C55E, #16A34A)", border: "none", borderRadius: 10, color: "#080808", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s" }}>
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={14} /> Saved!
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Save size={14} /> Save Changes
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
 
// ─── ACCOUNT SECTION ─────────────────────────────────────────────────────────
 
function AccountSection() {
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
 
  const sessions = [
    { device: "MacBook Pro", location: "Lagos, Nigeria", time: "Active now", icon: <Monitor size={13} />, current: true },
    { device: "iPhone 15 Pro", location: "Lagos, Nigeria", time: "2 hours ago", icon: <Smartphone size={13} />, current: false },
    { device: "Chrome — Windows", location: "Abuja, Nigeria", time: "3 days ago", icon: <Globe size={13} />, current: false },
  ];
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Change password */}
      <SectionCard>
        <SectionTitle label="Change Password" description="Use a strong password with at least 12 characters" />
        <div style={{ padding: "1.25rem" }}>
          <InputField label="Current Password" type="password" value={passwords.current} onChange={v => setPasswords({ ...passwords, current: v })} placeholder="Enter current password" />
          <InputField label="New Password" type="password" value={passwords.newPass} onChange={v => setPasswords({ ...passwords, newPass: v })} placeholder="Min. 12 characters" hint="Use letters, numbers, and symbols" />
          <InputField label="Confirm New Password" type="password" value={passwords.confirm} onChange={v => setPasswords({ ...passwords, confirm: v })} placeholder="Repeat new password" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ padding: "0.7rem 1.5rem", background: passwords.current && passwords.newPass ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: passwords.current && passwords.newPass ? "#080808" : "rgba(240,237,230,0.25)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
            {saved ? <><Check size={14} /> Updated!</> : <><Lock size={14} /> Update Password</>}
          </motion.button>
        </div>
      </SectionCard>
 
      {/* 2FA */}
      <SectionCard>
        <SectionTitle label="Two-Factor Authentication" description="Add an extra layer of security to your account" />
        <SettingRow label="Enable 2FA" description="Get a code via SMS or authenticator app each time you sign in">
          <Toggle on={twoFA} onChange={() => setTwoFA(!twoFA)} />
        </SettingRow>
        {twoFA && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ padding: "1rem 1.25rem", background: "rgba(34,197,94,0.05)", borderTop: "1px solid rgba(34,197,94,0.1)" }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.5)", fontWeight: 300, display: "flex", alignItems: "center", gap: 6 }}>
              <Info size={13} style={{ color: "#22C55E", flexShrink: 0 }} />
              Scan the QR code with your authenticator app to complete setup.
            </p>
          </motion.div>
        )}
      </SectionCard>
 
      {/* Active sessions */}
      <SectionCard>
        <SectionTitle label="Active Sessions" description="Devices currently signed into your account" />
        <div>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.9rem 1.25rem", borderBottom: i < sessions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: s.current ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${s.current ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.current ? "#22C55E" : "rgba(240,237,230,0.4)", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.15rem" }}>
                  <span style={{ fontSize: "0.83rem", color: "#F0EDE6", fontWeight: 400 }}>{s.device}</span>
                  {s.current && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "1px 7px" }}>This device</span>}
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.3)", fontWeight: 300 }}>{s.location} · {s.time}</div>
              </div>
              {!s.current && (
                <button style={{ padding: "0.35rem 0.8rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, color: "#EF4444", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", cursor: "pointer", transition: "all 0.2s" }}>
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
 
// ─── NOTIFICATIONS SECTION ────────────────────────────────────────────────────
 
function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    newMatch: true, message: true, projectUpdate: true,
    collab: true, marketing: false, weeklyDigest: true,
    pushEnabled: true, emailEnabled: true, smsEnabled: false,
  });
 
  const toggle = (key: keyof typeof notifs) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Channels */}
      <SectionCard>
        <SectionTitle label="Notification Channels" description="How you want to receive notifications" />
        <SettingRow label="Push Notifications" description="In-app and browser alerts">
          <Toggle on={notifs.pushEnabled} onChange={() => toggle("pushEnabled")} />
        </SettingRow>
        <SettingRow label="Email Notifications" description="Delivered to you@example.com">
          <Toggle on={notifs.emailEnabled} onChange={() => toggle("emailEnabled")} />
        </SettingRow>
        <SettingRow label="SMS Notifications" description="Text messages to your phone">
          <Toggle on={notifs.smsEnabled} onChange={() => toggle("smsEnabled")} color="#EAB308" />
        </SettingRow>
      </SectionCard>
 
      {/* Activity */}
      <SectionCard>
        <SectionTitle label="Activity Alerts" />
        {[
          { key: "newMatch" as const,      label: "New Match",           desc: "When a new creative matches your profile",           color: "#22C55E" },
          { key: "message" as const,       label: "New Messages",        desc: "When someone sends you a direct message",            color: "#3B82F6" },
          { key: "projectUpdate" as const, label: "Project Updates",     desc: "Changes and activity in your projects",              color: "#EAB308" },
          { key: "collab" as const,        label: "Collaboration Requests", desc: "When someone wants to collaborate with you",      color: "#EC4899" },
        ].map(item => (
          <SettingRow key={item.key} label={item.label} description={item.desc}>
            <Toggle on={notifs[item.key]} onChange={() => toggle(item.key)} color={item.color} />
          </SettingRow>
        ))}
      </SectionCard>
 
      {/* Marketing */}
      <SectionCard>
        <SectionTitle label="Updates & Marketing" />
        <SettingRow label="Weekly Digest" description="A summary of your matches, activity, and platform news">
          <Toggle on={notifs.weeklyDigest} onChange={() => toggle("weeklyDigest")} />
        </SettingRow>
        <SettingRow label="Product Updates & Tips" description="New features, tutorials, and platform announcements">
          <Toggle on={notifs.marketing} onChange={() => toggle("marketing")} color="#A855F7" />
        </SettingRow>
      </SectionCard>
    </div>
  );
}
 
// ─── PRIVACY SECTION ─────────────────────────────────────────────────────────
 
function PrivacySection() {
  const [privacy, setPrivacy] = useState({
    profilePublic: true, showLocation: true,
    showOnline: true, allowMessages: "everyone",
    showInSearch: true, dataCollection: false,
  });
 
  const toggle = (key: keyof typeof privacy) => {
    if (typeof privacy[key] === "boolean") {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <SectionCard>
        <SectionTitle label="Profile Visibility" />
        <SettingRow label="Public Profile" description="Anyone on NaijaCollab can view your profile and portfolio">
          <Toggle on={privacy.profilePublic as boolean} onChange={() => toggle("profilePublic")} />
        </SettingRow>
        <SettingRow label="Show Location" description="Display your city on your profile">
          <Toggle on={privacy.showLocation as boolean} onChange={() => toggle("showLocation")} />
        </SettingRow>
        <SettingRow label="Show Online Status" description="Let others see when you're active">
          <Toggle on={privacy.showOnline as boolean} onChange={() => toggle("showOnline")} />
        </SettingRow>
        <SettingRow label="Appear in Search Results" description="Allow your profile to be discovered through search and matching">
          <Toggle on={privacy.showInSearch as boolean} onChange={() => toggle("showInSearch")} />
        </SettingRow>
      </SectionCard>
 
      <SectionCard>
        <SectionTitle label="Messaging" />
        <SettingRow label="Who can message you" description="Control who can start a conversation">
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {["everyone", "matches", "nobody"].map(opt => (
              <button key={opt} onClick={() => setPrivacy({ ...privacy, allowMessages: opt })} style={{ padding: "0.35rem 0.75rem", borderRadius: 100, fontSize: "0.72rem", background: privacy.allowMessages === opt ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${privacy.allowMessages === opt ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, color: privacy.allowMessages === opt ? "#22C55E" : "rgba(240,237,230,0.45)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
                {opt}
              </button>
            ))}
          </div>
        </SettingRow>
      </SectionCard>
 
      <SectionCard>
        <SectionTitle label="Data & Analytics" />
        <SettingRow label="Usage Analytics" description="Allow NaijaCollab to collect anonymous data to improve the platform">
          <Toggle on={privacy.dataCollection as boolean} onChange={() => toggle("dataCollection")} color="#EAB308" />
        </SettingRow>
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer" }}>
            <Download size={13} /> Download My Data
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
 
// ─── APPEARANCE SECTION ───────────────────────────────────────────────────────
 
function AppearanceSection() {
  const [accent, setAccent] = useState("#22C55E");
  const [density, setDensity] = useState("comfortable");
  const [font, setFont] = useState("DM Sans");
 
  const accents = [
    { color: "#22C55E", label: "Naija Green" },
    { color: "#3B82F6", label: "Ocean Blue" },
    { color: "#EAB308", label: "Gold" },
    { color: "#EC4899", label: "Lagos Pink" },
    { color: "#F97316", label: "Sunset" },
    { color: "#A855F7", label: "Lagos Violet" },
  ];
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Theme */}
      <SectionCard>
        <SectionTitle label="Theme" description="NaijaCollab currently uses a dark theme" />
        <div style={{ padding: "1.25rem", display: "flex", gap: "0.75rem" }}>
          {[
            { label: "Dark",   icon: <Moon size={18} />,    active: true },
            { label: "Light",  icon: <Sun size={18} />,     active: false },
            { label: "System", icon: <Monitor size={18} />, active: false },
          ].map(t => (
            <div key={t.label} style={{ flex: 1, padding: "1rem", background: t.active ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${t.active ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: t.active ? "default" : "pointer", transition: "all 0.2s" }}>
              <span style={{ color: t.active ? "#22C55E" : "rgba(240,237,230,0.4)" }}>{t.icon}</span>
              <span style={{ fontSize: "0.75rem", color: t.active ? "#22C55E" : "rgba(240,237,230,0.4)", fontWeight: t.active ? 500 : 400 }}>{t.label}</span>
              {t.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />}
            </div>
          ))}
        </div>
      </SectionCard>
 
      {/* Accent color */}
      <SectionCard>
        <SectionTitle label="Accent Color" description="Your personal color throughout the app" />
        <div style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {accents.map(a => (
              <motion.button key={a.color} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setAccent(a.color)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: a.color, border: accent === a.color ? `3px solid ${a.color}` : "3px solid transparent", boxShadow: accent === a.color ? `0 0 0 2px #080808, 0 0 0 4px ${a.color}` : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {accent === a.color && <Check size={16} color="#080808" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: "0.62rem", color: accent === a.color ? a.color : "rgba(240,237,230,0.35)", fontWeight: accent === a.color ? 500 : 300 }}>{a.label}</span>
              </motion.button>
            ))}
          </div>
          <div style={{ marginTop: "1rem", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, flexShrink: 0 }} />
            <span style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.5)", fontWeight: 300 }}>Preview — buttons, highlights, and badges will use this color</span>
          </div>
        </div>
      </SectionCard>
 
      {/* Density */}
      <SectionCard>
        <SectionTitle label="Display Density" description="How compact the interface feels" />
        <div style={{ padding: "1.25rem", display: "flex", gap: "0.6rem" }}>
          {["compact", "comfortable", "spacious"].map(d => (
            <button key={d} onClick={() => setDensity(d)} style={{ flex: 1, padding: "0.65rem", background: density === d ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${density === d ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, color: density === d ? "#22C55E" : "rgba(240,237,230,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: density === d ? 500 : 400, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
              {d}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
 
// ─── CONNECTIONS SECTION ──────────────────────────────────────────────────────
 
function ConnectionsSection() {
  const [connected, setConnected] = useState({ spotify: true, soundcloud: false, instagram: true, twitter: false, github: false, youtube: false });
  const toggle = (key: keyof typeof connected) => setConnected(prev => ({ ...prev, [key]: !prev[key] }));
 
  const platforms = [
    { key: "spotify" as const,     label: "Spotify",     icon: "🎵", color: "#1DB954", desc: "Showcase your music stats" },
    { key: "soundcloud" as const,  label: "SoundCloud",  icon: "☁️", color: "#FF5500", desc: "Display your tracks" },
    { key: "instagram" as const,   label: "Instagram",   icon: "📸", color: "#E1306C", desc: "Link your visual portfolio" },
    { key: "twitter" as const,     label: "X (Twitter)", icon: "🐦", color: "#1DA1F2", desc: "Show your creative presence" },
    { key: "github" as const,      label: "GitHub",      icon: "💻", color: "#6E40C9", desc: "Link your code portfolio" },
    { key: "youtube" as const,     label: "YouTube",     icon: "▶️", color: "#FF0000", desc: "Embed your video work" },
  ];
 
  return (
    <SectionCard>
      <SectionTitle label="Connected Platforms" description="Link your creative accounts to enrich your profile" />
      {platforms.map((p, i) => (
        <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.9rem 1.25rem", borderBottom: i < platforms.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${p.color}18`, border: `1px solid ${p.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
            {p.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", color: "#F0EDE6", fontWeight: 400, marginBottom: "0.15rem" }}>{p.label}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{p.desc}</div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggle(p.key)} style={{ padding: "0.4rem 1rem", borderRadius: 8, fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", border: "none", background: connected[p.key] ? "rgba(255,255,255,0.06)" : `${p.color}18`, color: connected[p.key] ? "rgba(240,237,230,0.5)" : p.color, transition: "all 0.2s" }}>
            {connected[p.key] ? "Disconnect" : "Connect"}
          </motion.button>
        </div>
      ))}
    </SectionCard>
  );
}
 
// ─── DANGER SECTION ───────────────────────────────────────────────────────────
 
function DangerSection() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ padding: "1rem 1.25rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14, display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <AlertTriangle size={16} style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: "0.82rem", color: "rgba(240,237,230,0.55)", fontWeight: 300, lineHeight: 1.65 }}>
          Actions in this section are irreversible. Please proceed with caution.
        </p>
      </div>
 
      <SectionCard>
        <SectionTitle label="Export Data" description="Download a copy of all your NaijaCollab data" />
        <div style={{ padding: "1rem 1.25rem" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "rgba(240,237,230,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>
            <Download size={14} /> Export All Data
          </button>
        </div>
      </SectionCard>
 
      <SectionCard>
        <SectionTitle label="Deactivate Account" description="Temporarily disable your account. You can reactivate anytime." />
        <div style={{ padding: "1rem 1.25rem" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.65rem 1.25rem", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 10, color: "#EAB308", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>
            <UserX size={14} /> Deactivate Account
          </button>
        </div>
      </SectionCard>
 
      <SectionCard>
        <SectionTitle label="Delete Account" description="Permanently delete your account and all associated data" />
        <div style={{ padding: "1.25rem" }}>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.65rem 1.25rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, color: "#EF4444", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.16)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            >
              <Trash2 size={14} /> Delete My Account
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "1.25rem" }}>
              <p style={{ fontSize: "0.82rem", color: "#F0EDE6", fontWeight: 400, marginBottom: "0.5rem" }}>
                This action <strong>cannot be undone.</strong> All your projects, matches, messages, and portfolio will be permanently deleted.
              </p>
              <p style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.45)", marginBottom: "1rem", fontWeight: 300 }}>
                Type <strong style={{ color: "#EF4444" }}>DELETE MY ACCOUNT</strong> to confirm.
              </p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE MY ACCOUNT" style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", outline: "none", marginBottom: "0.85rem", letterSpacing: "0.02em" }} />
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button onClick={() => { setConfirmDelete(false); setDeleteInput(""); }} style={{ padding: "0.6rem 1.1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, color: "rgba(240,237,230,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button disabled={deleteInput !== "DELETE MY ACCOUNT"} style={{ padding: "0.6rem 1.25rem", background: deleteInput === "DELETE MY ACCOUNT" ? "#EF4444" : "rgba(239,68,68,0.15)", border: "none", borderRadius: 9, color: deleteInput === "DELETE MY ACCOUNT" ? "#fff" : "rgba(239,68,68,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, cursor: deleteInput === "DELETE MY ACCOUNT" ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                  Permanently Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
 
// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
 
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
 
  const SECTION_COMPONENTS: Record<SettingsSection, React.ReactNode> = {
    profile:       <ProfileSection />,
    account:       <AccountSection />,
    notifications: <NotificationsSection />,
    privacy:       <PrivacySection />,
    appearance:    <AppearanceSection />,
    connections:   <ConnectionsSection />,
    danger:        <DangerSection />,
  };
 
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: rgba(240,237,230,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 2px; }
      `}</style>
 
      <AppSidebar />
 
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.06), transparent)", top: -100, right: 0 }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
 
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30 }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.15rem" }}>Account</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>Settings</h1>
            </div>
          </div>
 
          <div style={{ display: "flex", padding: "2rem 2.5rem", gap: "2rem", alignItems: "flex-start" }}>
 
            {/* Settings nav */}
            <div style={{ width: 220, flexShrink: 0, position: "sticky", top: "5.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                {SETTINGS_NAV.map((item, i) => (
                  <motion.button
                    key={item.id}
                    whileHover={activeSection !== item.id ? { x: 2 } : {}}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "0.7rem",
                      padding: "0.85rem 1rem",
                      background: activeSection === item.id
                        ? item.id === "danger" ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)"
                        : "transparent",
                      border: "none",
                      borderBottom: i < SETTINGS_NAV.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      color: activeSection === item.id
                        ? item.id === "danger" ? "#EF4444" : "#22C55E"
                        : item.id === "danger" ? "rgba(239,68,68,0.6)" : "rgba(240,237,230,0.5)",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.845rem",
                      fontWeight: activeSection === item.id ? 500 : 400,
                      cursor: "pointer", textAlign: "left", transition: "all 0.18s",
                    }}
                  >
                    <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 700, color: "#080808" }}>{item.badge}</span>
                    )}
                    {activeSection === item.id && (
                      <div style={{ width: 3, height: 16, borderRadius: 100, background: item.id === "danger" ? "#EF4444" : "#22C55E", flexShrink: 0 }} />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
 
            {/* Section content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  {SECTION_COMPONENTS[activeSection]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 