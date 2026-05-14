"use client";

import { Sidebar } from "@/app/components/Sidebar";
import { 
  Play, 
  Film, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Layers, 
  Video,

  Clapperboard
} from "lucide-react";
import { motion } from "framer-motion";

export default function DirectorProfilePage() {
  const user = {
    name: "Bolaji 'Director B' Wells",
    initial: "B",
    role: "Cinematic Director",
    location: "Lekki, NG",
    bio: "Visual storyteller focused on high-contrast Afrofuturist aesthetics. Specialized in music videos and luxury brand commercials with a focus on color grading and lighting architecture.",
    kit: ["RED V-Raptor", "Arri Alexa Mini", "Davinci Resolve", "Unreal Engine 5"],
    metrics: [
      { label: "Productions", value: "84" },
      { label: "Awards", value: "12" },
      { label: "Client Ret.", value: "98%" }
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#060706] text-zinc-400 font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* UNIFORM LEFT COLUMN: THE DOSSIER */}
        <section className="w-full lg:w-[400px] border-r border-emerald-900/10 p-8 lg:p-12 overflow-y-auto no-scrollbar bg-[#080908]">
          <div className="sticky top-0">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center mb-6 group overflow-hidden">
                <span className="text-4xl font-black text-white tracking-tighter group-hover:text-emerald-500 transition-colors">
                  {user.initial}
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-1/2 w-full animate-scan" />
              </div>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                <ShieldCheck size={12} />
                Verified Director
              </div>
              <h1 className="text-3xl font-medium text-white tracking-tight leading-none mb-1">{user.name}</h1>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">{user.role}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {user.metrics.map((m) => (
                <div key={m.label} className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-xl text-center">
                  <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">{m.label}</p>
                  <p className="text-sm font-mono font-bold text-emerald-500">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">Creative Directive</p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">"{user.bio}"</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">Production Kit</p>
                <div className="flex flex-wrap gap-2">
                  {user.kit.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button className="w-full py-4 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                <Film size={14} fill="currentColor" /> Book Director
              </button>
              <button className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={14} /> Open Secure Link
              </button>
            </div>
          </div>
        </section>

        {/* UNIFORM RIGHT COLUMN: THE ARCHIVE (Video Specialized) */}
        <section className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar">
          <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-end mb-12">
              <div>
                <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  <Clapperboard size={12} />
                  Production Archive
                </div>
                <h2 className="text-4xl font-medium text-white tracking-tight">Showcase <span className="text-zinc-800">Reels</span></h2>
              </div>
              <div className="flex gap-4">
                <SocialLink icon={Video} />
              </div>
            </header>

            {/* CINEMATIC GRID */}
            <div className="grid grid-cols-1 gap-12">
              <VideoCard 
                title="Neon Lagos: After Hours" 
                category="MUSIC VIDEO / 4K" 
                img="https://images.unsplash.com/photo-1492691523569-44058a23472e?auto=format&fit=crop&q=80&w=1200"
              />
              <VideoCard 
                title="Estate.OS Commercial" 
                category="BRAND / CORPORATE" 
                img="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function VideoCard({ title, category, img }: { title: string, category: string, img: string }) {
  return (
    <motion.div whileHover={{ scale: 0.99 }} className="group cursor-pointer">
      <div className="relative aspect-video rounded-[40px] overflow-hidden border border-zinc-900 mb-6">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Play Icon - Central UI Element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            <Play size={24} fill="black" />
          </div>
        </div>

        <div className="absolute bottom-8 left-10">
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">{category}</p>
           <h3 className="text-2xl font-bold text-white tracking-tighter">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function SocialLink({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-12 h-12 rounded-xl border border-zinc-900 flex items-center justify-center text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
      <Icon size={20} />
    </button>
  );
}