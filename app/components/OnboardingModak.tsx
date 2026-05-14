"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, MapPin, Zap, Sparkles } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string; location: string }) => void;
};

const roles = [
  { id: "Artist", label: "Visual Artist", icon: "🎨" },
  { id: "Producer", label: "Sound Producer", icon: "🎹" },
  { id: "Designer", label: "UI/UX Designer", icon: "📐" },
  { id: "Developer", label: "Software Arch", icon: "💻" },
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
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] bg-[#0d0f0d] border border-emerald-900/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top Tactical Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            
            <div className="p-8 sm:p-10">
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
                  className="p-2 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
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
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setRole(item.id)}
                        className={`group relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 ${
                          role === item.id
                            ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-tight ${role === item.id ? "text-white" : "text-zinc-500"}`}>
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
              <div className="mt-12 flex items-center justify-between gap-6">
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors"
                >
                  Bypass
                </button>

                <button
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