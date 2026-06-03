"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, MapPin, Zap, Sparkles } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string; location: string }) => void;
};

// Grouped taxonomy from your list for clean grid rendering
const roles = [
  { 
    id: "Visual Creatives", 
    label: "Visual & Design", 
    icon: "🎨",
    subRoles: ["Graphic Designers", "UI/UX Designers", "Illustrators", "Painters", "Digital Artists", "Animators", "3D Artists", "Motion Designers", "Photographers", "Photo Editors/Retouchers", "Cinematographers", "Videographers", "Video Editors", "VFX Artists", "Art Directors", "Creative Directors"]
  },
  { 
    id: "Music & Audio", 
    label: "Music & Audio", 
    icon: "🎹",
    subRoles: ["Singers/Vocalists", "Rappers", "Songwriters", "Music Producers", "Beat Makers", "Composers", "Instrumentalists", "Sound Engineers", "DJs", "Podcasters", "Voice-over Artists"]
  },
  { 
    id: "Writing & Storytelling", 
    label: "Writing & Stories", 
    icon: "✍️",
    subRoles: ["Authors", "Poets", "Screenwriters", "Scriptwriters", "Copywriters", "Bloggers", "Journalists", "Content Writers", "Technical Writers", "Editors", "Storyboard Artists"]
  },
  { 
    id: "Fashion & Beauty", 
    label: "Fashion & Beauty", 
    icon: "✂️",
    subRoles: ["Fashion Designers", "Stylists", "Makeup Artists", "Hair Stylists", "Nail Artists", "Jewelry Designers", "Textile Designers", "Costume Designers", "Fashion Photographers", "Models"]
  },
  { 
    id: "Performance Creatives", 
    label: "Performance Arts", 
    icon: "🎭",
    subRoles: ["Actors", "Dancers", "Choreographers", "Comedians", "Spoken Word Artists", "Theatre Performers", "Magicians", "Hosts/Presenters", "Streamers"]
  },
  { 
    id: "Tech & Digital", 
    label: "Tech & Digital", 
    icon: "💻",
    subRoles: ["Web Designers", "Front-end Developers", "Creative Developers", "Game Designers", "Game Artists", "Level Designers", "AR/VR Creatives", "App Designers", "Product Designers"]
  },
  { 
    id: "Social & Content", 
    label: "Content & Social", 
    icon: "📱",
    subRoles: ["Content Creators", "YouTubers", "TikTok Creators", "Influencers", "Streamers", "Meme Creators", "Social Media Managers", "Brand Strategists", "Community Managers"]
  },
  { 
    id: "Business & Brand", 
    label: "Brand & Business", 
    icon: "💼",
    subRoles: ["Brand Designers", "Marketing Creatives", "Advertising Creatives", "Creative Strategists", "Event Designers", "Experience Designers"]
  },
  { 
    id: "Craft & Handmade", 
    label: "Craft & Handmade", 
    icon: "🪵",
    subRoles: ["Sculptors", "Potters", "Woodworkers", "Leatherworkers", "Calligraphers", "Candle Makers", "Resin Artists", "Floral Designers", "Interior Decorators"]
  },
  { 
    id: "Architecture & Space", 
    label: "Spatial Design", 
    icon: "🏛️",
    subRoles: ["Architects", "Interior Designers", "Landscape Designers", "Set Designers", "Exhibition Designers"]
  },
  { 
    id: "Emerging & Modern", 
    label: "Emerging Tech/Web3", 
    icon: "🚀",
    subRoles: ["AI Artists", "NFT Artists", "Virtual Influencers", "Prompt Designers", "Digital Collectible Creators", "Creative Technologists", "Metaverse Designers"]
  }
];

export default function OnboardingModal({ isOpen, onClose, onSubmit }: Props) {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur for that premium look */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[32px] bg-[#0d0f0d] border border-emerald-900/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top Tactical Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            
            <div className="p-8 sm:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                    <Sparkles size={12} />
                    Protocol Initialization
                  </div>
                  <h2 className="text-3xl font-medium text-white tracking-tight">
                    Find your <span className="text-emerald-50">Creative Ally.</span>
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Role Grid */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
                    <Target size={12} className="text-emerald-900" />
                    Target Specialization
                  </label>
                  {/* Grid layout for your updated list. Max height added to keep things perfectly proportioned. */}
                  <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 border-b border-zinc-900/50 pb-4 scrollbar-thin scrollbar-thumb-zinc-800">
                    {roles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id)}
                        className={`group relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 ${
                          role === item.id
                            ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-tight text-left ${role === item.id ? "text-white" : "text-zinc-500"}`}>
                          {item.label}
                        </span>
                        {role === item.id && (
                          <motion.div layoutId="activeGlow" className="absolute inset-0 rounded-2xl border border-emerald-500/50 pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
                    <MapPin size={12} className="text-emerald-900" />
                    Geographic Node
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="e.g. Lagos, Nigeria or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/40 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-10 flex items-center justify-between gap-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors"
                >
                  Bypass
                </button>

                <button
                  type="button"
                  onClick={() => onSubmit({ role, location })}
                  disabled={!role}
                  className="relative group flex items-center gap-3 px-8 py-4 bg-emerald-500 disabled:bg-zinc-800 text-black disabled:text-zinc-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-400 active:scale-95 overflow-hidden"
                >
                  <Zap size={16} fill="currentColor" />
                  Search Network
                  {role && (
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  )}
                </button>
              </div>
            </div>

            {/* Aesthetic Detail: HUD Corner Brackets */}
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-500/20 rounded-br-lg pointer-events-none" />
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-500/20 rounded-tl-lg pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}