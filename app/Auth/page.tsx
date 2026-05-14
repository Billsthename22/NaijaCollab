"use client";
 
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Target, MapPin, Zap, Sparkles } from "lucide-react";
 
// ─── ONBOARDING MODAL ────────────────────────────────────────────────────────
 
const ONBOARDING_ROLES = [
  { id: "Artist", label: "Visual Artist", icon: "🎨" },
  { id: "Producer", label: "Sound Producer", icon: "🎹" },
  { id: "Designer", label: "UI/UX Designer", icon: "📐" },
  { id: "Developer", label: "Software Dev", icon: "💻" },
  { id: "Photographer", label: "Photographer", icon: "📸" },
  { id: "Videographer", label: "Videographer", icon: "🎬" },
];
 
function OnboardingModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string; location: string }) => void;
}) {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
 
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          />
 
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: 520,
              background: "#0d0f0d",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 0 80px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.05)",
            }}
          >
            {/* Top glow line */}
            <div style={{ height: 1, width: "100%", background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)" }} />
 
            {/* HUD corner brackets */}
            <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: "2px solid rgba(34,197,94,0.25)", borderLeft: "2px solid rgba(34,197,94,0.25)", borderRadius: "4px 0 0 0", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: "2px solid rgba(34,197,94,0.25)", borderRight: "2px solid rgba(34,197,94,0.25)", borderRadius: "0 0 4px 0", pointerEvents: "none" }} />
 
            <div style={{ padding: "2.5rem 2.5rem 2rem" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.6rem" }}>
                    <Sparkles size={11} />
                    One last thing
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.04em", color: "#F0EDE6", lineHeight: 1.1 }}>
                    Find your <span style={{ color: "#22C55E" }}>Creative Ally.</span>
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,237,230,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#F0EDE6"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,230,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <X size={18} />
                </button>
              </div>
 
              {/* Role picker */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.85rem" }}>
                  <Target size={11} style={{ color: "#22C55E" }} />
                  Your Specialization
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
                  {ONBOARDING_ROLES.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole(item.id)}
                      style={{
                        position: "relative",
                        display: "flex", flexDirection: "column", alignItems: "flex-start",
                        padding: "0.85rem 0.85rem",
                        borderRadius: 12,
                        background: role === item.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${role === item.id ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.07)"}`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: role === item.id ? "0 0 16px rgba(34,197,94,0.1)" : "none",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{item.icon}</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: role === item.id ? 600 : 400, color: role === item.id ? "#22C55E" : "rgba(240,237,230,0.45)", lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
 
              {/* Location */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: "0.85rem" }}>
                  <MapPin size={11} style={{ color: "#22C55E" }} />
                  Your Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lagos, Nigeria or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: "100%", padding: "0.85rem 1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, color: "#F0EDE6",
                    fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
 
              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={onClose}
                  style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,237,230,0.25)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,237,230,0.55)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,230,0.25)")}
                >
                  Skip for now
                </button>
 
                <motion.button
                  whileHover={role ? { scale: 1.03, boxShadow: "0 0 28px rgba(34,197,94,0.3)" } : {}}
                  whileTap={role ? { scale: 0.97 } : {}}
                  onClick={() => role && onSubmit({ role, location })}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.85rem 1.75rem",
                    background: role ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)",
                    color: role ? "#080808" : "rgba(240,237,230,0.2)",
                    border: "none", borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase",
                    cursor: role ? "pointer" : "not-allowed",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <Zap size={14} fill={role ? "currentColor" : "none"} />
                  Search Network
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
 
// ─── INPUT FIELD ─────────────────────────────────────────────────────────────
 
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  rightEl?: React.ReactNode;
}
 
function InputField({ label, type = "text", placeholder, value, onChange, icon, rightEl }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{
        display: "block", fontSize: "0.75rem", fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "rgba(240,237,230,0.4)", marginBottom: "0.5rem",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.4, pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: icon ? "0.85rem 1rem 0.85rem 2.75rem" : "0.85rem 1rem",
            paddingRight: rightEl ? "3rem" : "1rem",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${focused ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10, color: "#F0EDE6",
            fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(34,197,94,0.08)" : "none",
          }}
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightEl}
          </div>
        )}
      </div>
    </div>
  );
}
 
// ─── ORB ─────────────────────────────────────────────────────────────────────
 
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", ...style }} />;
}
 
// ─── SIGNUP PAGE ─────────────────────────────────────────────────────────────
 
export default function SignUp() {
  const router = useRouter();
 
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
 
  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });
 
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      // Small delay so the success flash shows before modal opens
      setTimeout(() => setShowOnboarding(true), 600);
    }, 1600);
  };
 
  const handleOnboardingSubmit = ({ role, location }: { role: string; location: string }) => {
    console.log("Profile:", { ...form, role, location });
    // Save to backend here
    setShowOnboarding(false);
    router.push("/matches"); // ← goes to matches page
  };
 
// Replace handleOnboardingClose:
const handleOnboardingClose = () => {
    setShowOnboarding(false);
    router.push("/dashboard"); // ← skip goes to dashboard
  };
 
  return (
    <>
      {/* ── ONBOARDING MODAL (portal-style, rendered above everything) ── */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onSubmit={handleOnboardingSubmit}
      />
 
      <div style={{
        minHeight: "100vh", background: "#080808", color: "#F0EDE6",
        fontFamily: "'DM Sans', sans-serif", display: "flex",
        alignItems: "stretch", overflow: "hidden",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input::placeholder { color: rgba(240,237,230,0.2); }
          input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0f0f0f inset; -webkit-text-fill-color: #F0EDE6; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes checkPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        `}</style>
 
        {/* ── LEFT PANEL ── */}
        <div style={{
          flex: "0 0 44%", position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "3rem", background: "rgba(34,197,94,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}>
          <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.2), transparent)", top: -100, left: -100 }} />
          <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(234,179,8,0.1), transparent)", bottom: 50, right: -50, animation: "float 7s ease-in-out infinite" }} />
 
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse 80% 80% at 30% 30%, black, transparent)",
          } as React.CSSProperties} />
 
          {/* Logo */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.03em", color: "#F0EDE6" }}>
                Naija<span style={{ color: "#22C55E" }}>Collab</span>
              </span>
            </a>
          </div>
 
          {/* Middle */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 100, padding: "5px 14px", marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E", display: "inline-block" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#22C55E" }}>Join 12,000+ creatives</span>
            </div>
 
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1rem" }}>
              Your tribe is<br />waiting for you.
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, lineHeight: 1.75, maxWidth: 320 }}>
              Connect with musicians, designers, devs, and creatives across Nigeria. Build together. Blow together.
            </p>
 
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { text: "Smart creative matching", icon: "🎯" },
                { text: "Project workspaces & collab tools", icon: "🛠️" },
                { text: "Build your portfolio as you work", icon: "✨" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0,
                  }}>{item.icon}</div>
                  <span style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.6)", fontWeight: 300 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
 
          {/* Bottom avatars */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex" }}>
              {(["#22C55E", "#EAB308", "#3B82F6", "#EF4444"] as string[]).map((c, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c}60, ${c}30)`,
                  border: `2px solid ${c}50`,
                  marginLeft: i === 0 ? 0 : -8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.6rem", fontWeight: 700, color: c,
                }}>
                  {["TN", "AM", "LK", "FO"][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>Joined this week</span>
          </div>
        </div>
 
        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "3rem 2rem", position: "relative",
        }}>
          <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(34,197,94,0.06), transparent)", top: "20%", right: "10%" }} />
 
          <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2 }}>
 
            {/* ── SUCCESS STATE ── */}
            <AnimatePresence>
              {done && !showOnboarding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "3rem 0" }}
                >
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem", fontSize: "2rem",
                    animation: "checkPop 0.5s ease",
                  }}>✅</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>
                    You're in! 🎉
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(240,237,230,0.45)", fontWeight: 300, lineHeight: 1.7 }}>
                    Setting up your profile…
                  </p>
                  {/* Subtle loading bar */}
                  <div style={{ marginTop: "1.5rem", height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", maxWidth: 200, margin: "1.5rem auto 0" }}>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      style={{ height: "100%", background: "linear-gradient(90deg, #22C55E, #16A34A)", borderRadius: 2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
 
            {/* ── FORM (single step now) ── */}
            {!done && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.04em", marginBottom: "0.4rem" }}>
                  Create your account
                </h1>
                <p style={{ fontSize: "0.85rem", color: "rgba(240,237,230,0.35)", fontWeight: 300, marginBottom: "2rem" }}>
                  Already have one?{" "}
                  <a href="/login" style={{ color: "#22C55E", textDecoration: "none", fontWeight: 400 }}>Sign in</a>
                </p>
 
                {/* Google OAuth */}
                <button
                  style={{
                    width: "100%", padding: "0.85rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, color: "#F0EDE6",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                    fontSize: "0.9rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                    marginBottom: "1.75rem", transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
 
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.25)" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>
 
                <InputField label="Full Name" placeholder="e.g. Tunde Ayo" icon="👤" value={form.name} onChange={update("name")} />
                <InputField label="Email Address" type="email" placeholder="you@example.com" icon="✉️" value={form.email} onChange={update("email")} />
                <InputField label="Password" type="password" placeholder="Min. 8 characters" icon="🔒" value={form.password} onChange={update("password")} />
 
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,197,94,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: "100%", marginTop: "0.5rem", padding: "0.95rem",
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    color: "#080808", border: "none", borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid rgba(8,8,8,0.3)", borderTopColor: "#080808", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Creating account…
                    </>
                  ) : "Join NaijaCollab 🚀"}
                </motion.button>
 
                <p style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "rgba(240,237,230,0.2)", textAlign: "center", lineHeight: 1.6 }}>
                  By signing up you agree to our{" "}
                  <a href="#" style={{ color: "rgba(240,237,230,0.4)", textDecoration: "none" }}>Terms</a>{" "}
                  and{" "}
                  <a href="#" style={{ color: "rgba(240,237,230,0.4)", textDecoration: "none" }}>Privacy Policy</a>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
 