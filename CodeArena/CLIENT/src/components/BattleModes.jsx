import { Zap, Brain, Bug, BarChart3, ArrowUpRight, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

const modes = [
  {
    title: "Rapid Duel",
    link: "/rapid-duel", 
    subtitle: "Speed & Reflexes",
    desc: "A fast-paced test of logic. Solve 5 problems before the timer hits zero.",
    meta: ["5-10 Min", "Medium"],
    color: "text-cyan-400",
    icon_bg: "bg-cyan-500/10",
    bg_hover: "hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]",
    border_color: "group-hover:border-cyan-500/50",
    icon: <Zap size={24} />,
    accent: "bg-cyan-400"
  },
  {
    title: "Complexity-Duel",
    link: "/complexity-duel",
    subtitle: "Optimization & Logic",
    desc: "Deep algorithmic challenges. Focus on efficiency, graph theory, and dynamic programming.",
    meta: ["15-20 Min", "Hard"],
    color: "text-emerald-400",
    icon_bg: "bg-emerald-500/10",
    bg_hover: "hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
    border_color: "group-hover:border-emerald-500/50",
    icon: <Brain size={24} />,
    accent: "bg-emerald-400"
  },
  {
    title: "Bug Hunt",
    link: "/bug-hunt", 
    subtitle: "Code Review",
    desc: "You are the compiler. Spot syntax errors and logical flaws in broken snippets.",
    meta: ["2-5 Min", "Easy/Med"],
    color: "text-pink-400",
    icon_bg: "bg-pink-500/10",
    bg_hover: "hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]",
    border_color: "group-hover:border-pink-500/50",
    icon: <Bug size={24} />,
    accent: "bg-pink-400"
  },
  {
    title: "Code Duel",
    link: "/code-duel", 
    subtitle: "Big O Analysis",
    desc: "Master time and space complexity. Identify the most optimal solution instantly.",
    meta: ["5-8 Min", "Expert"],
    color: "text-blue-400",
    icon_bg: "bg-blue-500/10",
    bg_hover: "hover:shadow-[0_0_30px_-10px_rgba(96,165,250,0.3)]",
    border_color: "group-hover:border-blue-500/50",
    icon: <BarChart3 size={24} />,
    accent: "bg-blue-400"
  }
];

const BattleModes = () => {
  return (
    <section id="modes" className="py-16 md:py-24 px-4 md:px-6 bg-[#020617]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Battle Mode</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">
              Multiple ways to compete. Each mode tests different skills. Find your arena.
            </p>
          </div>
          
          {/* Server Badge - Adaptive for mobile */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-full border border-white/5 text-xs font-bold text-gray-400 whitespace-nowrap shadow-lg">
            <Crosshair size={14} className="text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">GLOBAL SERVERS ONLINE</span>
            <span className="sm:hidden">SERVERS ONLINE</span>
          </div>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {modes.map((mode, i) => (
            <Link 
              key={i} 
              to={mode.link}
              className={`group relative bg-[#0b1221] border border-white/5 p-6 md:p-8 rounded-3xl transition-all duration-300 ${mode.bg_hover} ${mode.border_color} overflow-hidden hover:-translate-y-1 shadow-md hover:shadow-xl`}
            >
              {/* Top Row: Icon & Arrow */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${mode.color} ${mode.icon_bg} border border-white/5`}>
                  {mode.icon}
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-all group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Middle Row: Content */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                  {mode.title}
                </h3>
                <p className={`text-xs font-bold ${mode.color} uppercase tracking-wider mb-3`}>
                  {mode.subtitle}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300">
                  {mode.desc}
                </p>
              </div>

              {/* Bottom Row: Tags */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {mode.meta.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-[#1e293b] text-[10px] md:text-xs font-bold text-gray-300 border border-white/5 group-hover:border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Decorative Accent Line (Bottom) */}
              <div className={`absolute bottom-0 left-0 w-full h-1 ${mode.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BattleModes;