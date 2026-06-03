'use client';

import React from 'react';
import { 
  Compass, 
  MessageSquare, 
  Zap, 
  Wallet, 
  Settings, 
  Leaf,
  ShieldCheck,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const primaryNav = [
  { icon: Compass, label: "Feed", href: "/Feed" },
  { icon: MessageSquare, label: "Messages", href: "/Messaging", badge: "3" },
  { icon: Zap, label: "Missions", href: "/dashboard/missions" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-emerald-500/10 bg-[#060706] h-screen flex flex-col hidden lg:flex relative z-50">
      
      {/* --- Brand Architecture --- */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2 group cursor-pointer">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform duration-500">
            <Leaf size={20} className="text-black" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black tracking-[0.4em] text-white uppercase leading-none italic">Naija</h1>
            <p className="text-[9px] text-emerald-500/60 font-bold tracking-[0.2em] uppercase mt-1">Collab.OS</p>
          </div>
        </div>

        {/* --- Tactical Search --- */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search System..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-[10px] text-zinc-300 focus:outline-none focus:border-emerald-500/30 transition-all font-medium placeholder:text-zinc-800 uppercase tracking-widest"
          />
        </div>
      </div>
      
      {/* --- Main Navigation Hub --- */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide hover:scrollbar-default transition-all">
        
        <nav className="space-y-1 mb-10">
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] mb-4 px-4 flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Network
          </p>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} className="block relative group">
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-500 ${
                  isActive ? "bg-emerald-500/5 text-emerald-400" : "text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.02]"
                }`}>
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-emerald-500" : "group-hover:text-emerald-400 transition-colors"} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="relative z-10 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded italic">
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-emerald-500/5 border-l-2 border-emerald-500 rounded-xl"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* --- Active Node Stream --- */}
        <div className="mb-10">
          <div className="flex items-center justify-between px-4 mb-4">
            <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">Nodes Online</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="space-y-1">
            <ActiveAvatar name="Tomi.D" status="In Session" isOnline />
            <ActiveAvatar name="Kelechi.OS" status="Idle" isOnline />
            <ActiveAvatar name="Seyi_V3" status="Offline" />
          </div>
        </div>

        {/* --- The Vault Interface --- */}
        <div className="px-4 pb-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 rounded-2xl p-5 group hover:border-emerald-500/30 transition-all cursor-crosshair">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet size={14} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-black">+₦12,400 today</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Treasury_Balance</p>
            <p className="text-xl font-mono text-white font-medium tracking-tighter">₦4,250,000</p>
          </div>
        </div>
      </div>

      {/* --- System Footer & Profile --- */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer group border border-transparent hover:border-white/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-emerald-500/20 overflow-hidden flex items-center justify-center text-emerald-500 font-black italic text-xs">
              EG
            </div>
            <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-[#060706]">
              <ShieldCheck size={10} className="text-black" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-200 font-black uppercase tracking-tighter truncate group-hover:text-emerald-400 transition-colors">Emioluwa G.</p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest truncate">Sys_Architect</p>
          </div>
          <button className="relative p-2">
             <Bell size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
             <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-black" />
          </button>
        </div>
        
        <Link href="/settings" className="flex items-center justify-between px-4 py-3 mt-2 group">
          <div className="flex items-center gap-3 text-[9px] font-black text-zinc-700 group-hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors">
            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-700" />
            System Control
          </div>
          <ChevronRight size={12} className="text-zinc-800 group-hover:text-emerald-500 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}

function ActiveAvatar({ name, status, isOnline }: { name: string, status: string, isOnline?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.02] cursor-pointer group transition-all">
      <div className="relative">
        <div className={`w-8 h-8 rounded-lg border transition-all duration-500 group-hover:scale-110 ${
          isOnline ? 'border-emerald-500/30 bg-zinc-900' : 'border-zinc-800 bg-zinc-950 opacity-40'
        }`} />
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060706]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${isOnline ? 'text-zinc-300 group-hover:text-emerald-400' : 'text-zinc-700'}`}>
          {name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-bold uppercase tracking-tighter ${isOnline ? 'text-zinc-600' : 'text-zinc-800'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}