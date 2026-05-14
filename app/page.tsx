"use client";
 
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
 
const TAGS = [
  { label: "Musicians", emoji: "🎤" },
  { label: "Developers", emoji: "💻" },
  { label: "Designers", emoji: "🎨" },
  { label: "Photographers", emoji: "📸" },
  { label: "Videographers", emoji: "🎬" },
  { label: "Creatives", emoji: "🧠" },
];
 
const FEATURES = [
  {
    num: "01",
    title: "Smart Matching",
    desc: "Our algorithm reads your vibe, your stack, your style — and surfaces the exact collaborators who complement your energy.",
    accent: "#22C55E",
  },
  {
    num: "02",
    title: "Project Spaces",
    desc: "Spin up a shared workspace in seconds. Manage ideas, files, and timelines without ever leaving the platform.",
    accent: "#EAB308",
  },
  {
    num: "03",
    title: "Showcase Yourself",
    desc: "Your portfolio lives here. Attract inbound opportunities, build reputation, and let your work do the talking.",
    accent: "#22C55E",
  },
];
 
const STEPS = [
  { n: "1", label: "Create your profile", sub: "Tell us who you are and what you make" },
  { n: "2", label: "Get matched", sub: "We surface the right collaborators for you" },
  { n: "3", label: "Build together", sub: "From idea to shipped — inside one place" },
];
 
const TESTIMONIALS = [
  { name: "Tunde Ayo", role: "Music Producer · Lagos", quote: "Met my entire current band through NaijaCollab. We dropped an EP six weeks later.", color: "#22C55E", initials: "TA" },
  { name: "Chisom Ike", role: "UI Designer · Abuja", quote: "The platform actually understands the way we work here. It doesn't feel imported.", color: "#EAB308", initials: "CI" },
  { name: "Femi Okafor", role: "Dev & Filmmaker · PH", quote: "Finally stopped working alone. Blew up my first collab project on Instagram in a week.", color: "#22C55E", initials: "FO" },
];
 
function NoiseOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
 
function Orb({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(90px)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
 
function Counter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
 
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
 
  return <span ref={ref}>{count.toLocaleString()}</span>;
}
 
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
 
  return (
    <main style={{ background: "#080808", color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #22C55E40; border-radius: 2px; }
        .tag-pill {
          position: relative;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(240,237,230,0.75);
          cursor: default;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .tag-pill:hover {
          background: rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.4);
          color: #fff;
        }
        .feat-card {
          padding: 2.5rem;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feat-card:hover {
          border-color: rgba(34,197,94,0.3);
        }
        .feat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feat-card:hover::before { opacity: 1; }
        .step-line {
          position: absolute;
          top: 27px;
          left: calc(50% + 27px);
          right: calc(-50% + 27px);
          height: 1px;
          background: linear-gradient(90deg, rgba(34,197,94,0.5), rgba(34,197,94,0.1));
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
 
      <NoiseOverlay />
 
      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 3rem",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.03em" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
 
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Features", "How it works", "Join"].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, "")}`} style={{
              fontSize: "0.85rem", color: "rgba(240,237,230,0.5)", textDecoration: "none", fontWeight: 400,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#F0EDE6"}
              onMouseLeave={e => e.target.style.color = "rgba(240,237,230,0.5)"}
            >{link}</a>
          ))}
        </div>
 
        <button style={{
          background: "#22C55E", color: "#080808",
          padding: "0.6rem 1.5rem", borderRadius: "8px",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: "0.85rem", border: "none", cursor: "pointer",
          transition: "background 0.2s, transform 0.15s",
        }}
          onMouseEnter={e => { e.target.style.background = "#16A34A"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = "#22C55E"; e.target.style.transform = "translateY(0)"; }}
        >Get Started</button>
      </nav>
 
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center", overflow: "hidden" }}>
        {/* Orbs */}
        <Orb style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(34,197,94,0.18), transparent)", top: -150, left: "50%", transform: "translateX(-50%)" }} />
        <Orb style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(234,179,8,0.12), transparent)", bottom: 100, right: "10%", animation: "float 6s ease-in-out infinite" }} />
        <Orb style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(34,197,94,0.1), transparent)", bottom: 200, left: "8%", animation: "float 8s ease-in-out infinite 2s" }} />
 
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }} />
 
        <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 2, padding: "0 1.5rem", maxWidth: 900, width: "100%" }}>
 
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: "2rem" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 8px #22C55E" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#22C55E", letterSpacing: "0.06em", textTransform: "uppercase" }}>Nigeria's Creative Network</span>
          </motion.div>
 
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}
          >
            Where Nigerian<br />
            Creatives{" "}
            <span style={{ position: "relative", display: "inline-block", color: "#22C55E" }}>
              Find Their People
              <svg style={{ position: "absolute", bottom: -8, left: 0, width: "100%", overflow: "visible" }} height="8" viewBox="0 0 300 8">
                <path d="M0 6 Q75 0 150 6 Q225 0 300 6" stroke="#22C55E" strokeWidth="2" fill="none" strokeOpacity="0.5" />
              </svg>
            </span>
          </motion.h1>
 
          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(240,237,230,0.5)", maxWidth: 560, margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.7 }}
          >
            Musicians, designers, developers, videographers — stop working alone. Find your tribe. Build something big. <strong style={{ color: "rgba(240,237,230,0.8)", fontWeight: 400 }}>Blow together.</strong>
          </motion.p>
 
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem", marginBottom: "2.5rem" }}
          >
            {TAGS.map((tag, i) => (
              <motion.span
                key={i}
                className="tag-pill"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                whileHover={{ y: -3, scale: 1.04 }}
              >
                {tag.emoji} {tag.label}
              </motion.span>
            ))}
          </motion.div>
 
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#080808", padding: "0.9rem 2.2rem",
                borderRadius: "10px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, fontSize: "0.95rem", border: "none",
                cursor: "pointer", boxShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}
            >
              Join the Movement 🚀
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "transparent", color: "rgba(240,237,230,0.7)",
                padding: "0.9rem 2.2rem", borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: "0.95rem", cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onHoverStart={e => { }}
            >
              See How It Works
            </motion.button>
          </motion.div>
        </motion.div>
 
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            position: "relative", zIndex: 2,
            display: "flex", gap: "0", marginTop: "5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden",
          }}
        >
          {[
            { val: 12000, suffix: "+", label: "Creatives" },
            { val: 3400, suffix: "+", label: "Collabs Started" },
            { val: 36, suffix: "", label: "States Represented" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "1.5rem 3rem",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#22C55E", letterSpacing: "-0.04em" }}>
                <Counter target={s.val} />{s.suffix}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.4)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 400 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>
 
      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "7rem 3rem", position: "relative" }}>
        <Orb style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(234,179,8,0.08), transparent)", top: "10%", right: "-5%" }} />
 
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22C55E", marginBottom: "1rem" }}>What you get</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            Built for the way<br /><span style={{ color: "rgba(240,237,230,0.35)" }}>we create here.</span>
          </h2>
        </motion.div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "rgba(255,255,255,0.05)", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "1.5rem" }}>{f.num}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: f.accent, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{f.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(240,237,230,0.5)", fontWeight: 300, lineHeight: 1.75 }}>{f.desc}</p>
              <div style={{ marginTop: "1.5rem", width: 40, height: 2, background: `linear-gradient(90deg, ${f.accent}, transparent)`, borderRadius: 2 }} />
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* ── HOW IT WORKS ── */}
      <section id="howit works" style={{ padding: "7rem 3rem", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22C55E", marginBottom: "1rem" }}>The Process</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.04em" }}>Three steps to your next big collab</h2>
        </motion.div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Connector lines */}
          <div style={{ position: "absolute", top: 28, left: "calc(16.6% + 20px)", right: "calc(16.6% + 20px)", height: 1, background: "linear-gradient(90deg, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.5) 50%, rgba(34,197,94,0.5) 100%)", zIndex: 0 }} />
 
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ textAlign: "center", position: "relative", zIndex: 1 }}
            >
              <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Pulse ring */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "1px solid rgba(34,197,94,0.3)",
                  animation: "pulse-ring 2.5s ease-out infinite",
                  animationDelay: `${i * 0.6}s`,
                }} />
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "1.1rem", color: "#080808",
                  boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                }}>
                  {s.n}
                </div>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F0EDE6", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{s.label}</h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.4)", fontWeight: 300, lineHeight: 1.6 }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "7rem 3rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22C55E", marginBottom: "1rem" }}>Voices</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.04em" }}>They already blew up 🔥</h2>
        </motion.div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{
                padding: "2rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Quote mark */}
              <div style={{ fontFamily: "Georgia, serif", fontSize: "5rem", lineHeight: 0.8, color: "rgba(34,197,94,0.1)", position: "absolute", top: 12, right: 20 }}>"</div>
 
              <p style={{ fontSize: "0.9rem", color: "rgba(240,237,230,0.65)", fontWeight: 300, lineHeight: 1.75, marginBottom: "1.5rem", fontStyle: "italic", position: "relative" }}>
                "{t.quote}"
              </p>
 
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`,
                  border: `1px solid ${t.color}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: "0.75rem", color: t.color,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F0EDE6", letterSpacing: "-0.01em" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(240,237,230,0.35)", fontWeight: 300 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* ── CTA ── */}
      <section id="join" style={{ padding: "8rem 3rem", textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Orb style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
 
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
        }} />
 
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "1.5rem" }}>
            Don't build<br />
            <span style={{ color: "#22C55E" }}>alone</span> anymore.
          </h2>
 
          <p style={{ fontSize: "1rem", color: "rgba(240,237,230,0.45)", fontWeight: 300, maxWidth: 400, margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
            Your next big collaboration is waiting. Join thousands of Nigerian creatives already building together.
          </p>
 
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(34,197,94,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, #22C55E, #16A34A)",
              color: "#080808", padding: "1.1rem 3rem",
              borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, fontSize: "1.05rem", border: "none",
              cursor: "pointer", boxShadow: "0 0 30px rgba(34,197,94,0.25)",
              transition: "box-shadow 0.3s",
            }}
          >
            Get Started Now 🚀
          </motion.button>
 
          <p style={{ marginTop: "1.2rem", fontSize: "0.78rem", color: "rgba(240,237,230,0.25)", fontWeight: 300 }}>Free to join · No credit card needed</p>
        </motion.div>
      </section>
 
      {/* ── FOOTER ── */}
      <footer style={{
        padding: "2rem 3rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em" }}>
          Naija<span style={{ color: "#22C55E" }}>Collab</span>
        </span>
        <span style={{ fontSize: "0.8rem", color: "rgba(240,237,230,0.25)", fontWeight: 300 }}>Built for Nigerian creatives 🇳🇬 · © {new Date().getFullYear()}</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Twitter", "Instagram", "Discord"].map(s => (
            <a key={s} href="#" style={{ fontSize: "0.78rem", color: "rgba(240,237,230,0.3)", textDecoration: "none", fontWeight: 400, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#22C55E"}
              onMouseLeave={e => e.target.style.color = "rgba(240,237,230,0.3)"}
            >{s}</a>
          ))}
        </div>
      </footer>
    </main>
  );
}