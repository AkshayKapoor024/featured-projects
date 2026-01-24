import { Code2, Swords, BarChart, Globe, Trophy, ShieldCheck } from 'lucide-react';

const feats = [
  { icon: <Code2 />, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "Multi-Language Support", desc: "Python, JavaScript, C++, Java, Go, Rust, and more. Code in your preferred language." },
  { icon: <Swords />, color: "text-orange-400", bg: "bg-orange-500/10", title: "Real Competition", desc: "No MCQs. No boring practice. Live 1v1 battles against real opponents." },
  { icon: <BarChart />, color: "text-purple-400", bg: "bg-purple-500/10", title: "ELO Rating System", desc: "Chess-style rating. Fair matchmaking. Track your progress and climb the ranks." },
  { icon: <Globe />, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Global Leaderboards", desc: "Compete with coders worldwide. Regional and global rankings updated live." },
  { icon: <Trophy />, color: "text-yellow-400", bg: "bg-yellow-500/10", title: "Interview-Ready Skills", desc: "Build skills that matter. Our problems mirror real technical interviews." },
  { icon: <ShieldCheck />, color: "text-pink-400", bg: "bg-pink-500/10", title: "Anti-Cheat System", desc: "Fair play guaranteed. Advanced detection ensures a level playing field." },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6 bg-[#020617]">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
          Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CodeArena?</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-lg">This isn't your average coding platform. We're built for competition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto mb-16 md:mb-24">
        {feats.map((f, i) => (
          <div key={i} className="bg-[#0b1221] border border-white/5 p-6 md:p-8 rounded-2xl hover:bg-[#0f172a] transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-lg ${f.bg} flex items-center justify-center ${f.color} mb-4 md:mb-6`}>
              {f.icon}
            </div>
            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{f.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Trusted By (Adaptive Layout) */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl md:rounded-full py-6 md:py-4 px-6 md:px-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-50">
           <span className="text-xs text-gray-500 uppercase font-bold tracking-widest w-full md:w-auto text-center md:text-left">Trusted by developers at</span>
           <span className="text-gray-300 font-bold">Google</span>
           <span className="text-gray-300 font-bold">Meta</span>
           <span className="text-gray-300 font-bold">Amazon</span>
           <span className="text-gray-300 font-bold">Microsoft</span>
           <span className="text-gray-300 font-bold">Apple</span>
        </div>
      </div>
    </section>
  );
};

export default Features;