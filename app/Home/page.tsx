"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/app/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Users, 
  Zap, 
  UserPlus,
  Compass
} from "lucide-react";
import OnboardingModal from "@/app/components/OnboardingModak";

type User = {
  id: number;
  name: string;
  role: string;
  location: string;
  isTrending?: boolean;
};

const dummyUsers: User[] = [
  { id: 1, name: "Tunde Beats", role: "Music Producer", location: "Lagos", isTrending: true },
  { id: 2, name: "Amaka Designs", role: "Brand Architect", location: "Abuja", isTrending: true },
  { id: 3, name: "Zino Vibez", role: "Visual Artist", location: "Lekki", isTrending: false },
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasSeen = localStorage.getItem("seenOnboarding");
    if (!hasSeen) setShowModal(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("seenOnboarding", "true");
    setShowModal(false);
  };

  const handleSubmit = (data: { role: string; location: string }) => {
    localStorage.setItem("seenOnboarding", "true");
    router.push(`/matches?role=${data.role}&location=${data.location}`);
  };

  return (
    <div className="flex min-h-screen bg-[#060706] text-zinc-400 font-sans">
      <Sidebar />

      <main className="flex-1 px-8 lg:px-16 py-12 overflow-y-auto">
        {/* HERO SECTION */}
        <header className="mb-16 relative">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-500 mb-6 text-xs font-bold uppercase tracking-[0.3em]"
            >
              <Sparkles size={14} />
              The Creative Pulse
            </motion.div>
            
            <h1 className="text-5xl font-light text-white tracking-tight leading-tight mb-8">
              Forge connections with <br />
              <span className="font-semibold italic text-emerald-50">Naija's Elite Creators.</span>
            </h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="group flex items-center gap-3 px-6 py-4 bg-emerald-500 text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
              >
                Initiate Matchmaking
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 px-4 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <Users size={16} />
                <span>12.4k Online</span>
              </div>
            </div>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          {/* LEFT: PRIMARY FEED */}
          <section className="xl:col-span-8 space-y-12">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-emerald-900/10 pb-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  Live Opportunities
                </h3>
                <span className="text-[10px] text-zinc-600 font-mono italic">Tailored to your profile</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {dummyUsers.map((user) => (
                  <MatchCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: TRENDING & METRICS */}
          <aside className="xl:col-span-4 space-y-12">
            <div>
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Zap size={14} className="text-emerald-500" />
                Trending Now
              </h3>
              
              <div className="space-y-6">
                {dummyUsers.filter(u => u.isTrending).map((user) => (
                  <TrendingItem key={user.id} user={user} />
                ))}
              </div>

              <button className="w-full mt-10 py-4 border border-emerald-900/30 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/5 transition-all">
                <Compass size={14} />
                Explore Global Feed
              </button>
            </div>
          </aside>
        </div>
      </main>

      <OnboardingModal
        isOpen={showModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// --- Internal UI Components ---

function MatchCard({ user }: { user: User }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative p-6 bg-zinc-900/20 border border-emerald-900/10 rounded-3xl hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          <UserPlus size={20} />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-bold uppercase">
          <MapPin size={10} className="text-emerald-900" />
          {user.location}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-white group-hover:text-emerald-400 transition-colors">{user.name}</h4>
        <p className="text-xs text-zinc-500 mt-1">{user.role}</p>
      </div>

      <button className="w-full py-3 bg-zinc-900/50 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-white group-hover:text-black transition-all">
        Inspect Profile
      </button>
    </motion.div>
  );
}

function TrendingItem({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-900 to-zinc-950 border border-emerald-500/10" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-semibold truncate leading-none mb-1 group-hover:text-emerald-400 transition-colors">
          {user.name}
        </p>
        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
          {user.role} • <span className="text-emerald-900">Rising</span>
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs font-mono text-emerald-500">+42%</div>
      </div>
    </div>
  );
}