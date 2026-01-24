import { Gamepad2, Users, Code, Send, TrendingUp } from 'lucide-react';

const steps = [
  { icon: <Gamepad2 size={32} />, label: "Choose Mode", sub: "Pick your battle type" },
  { icon: <Users size={32} />, label: "Get Matched", sub: "ELO-based pairing" },
  { icon: <Code size={32} />, label: "Code Live", sub: "Real-time battle" },
  { icon: <Send size={32} />, label: "Submit First", sub: "Speed + accuracy wins" },
  { icon: <TrendingUp size={32} />, label: "Rank Up", sub: "Climb the ladder" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6 text-center bg-[#020617] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full"></div>
      </div>

      <h2 className="text-3xl md:text-5xl font-black mb-4 text-white relative z-10">
        How <span className="text-cyan-400 text-shadow-cyan">It Works</span>
      </h2>
      <p className="text-gray-400 mb-12 md:mb-20 text-base md:text-lg max-w-2xl mx-auto relative z-10">
        From signup to victory in minutes. Simple. Fast. Addictive.
      </p>

      {/* Timeline Container */}
      <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
        
        {/* Connection Line (Desktop - Horizontal) */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 z-0"></div>

        {/* Connection Line (Mobile - Vertical) */}
        <div className="md:hidden absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500/30 via-purple-500/30 to-pink-500/30 z-0"></div>

        {steps.map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center flex-1 group w-full max-w-[200px] md:max-w-none">
            
            {/* Icon Wrapper (Relative for Badge positioning) */}
            <div className="relative mb-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-[#0f172a] border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl shadow-cyan-900/10 group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/20 group-hover:-translate-y-1 transition-all duration-300">
                   {step.icon}
                </div>

                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#1e293b] text-white text-[10px] font-black flex items-center justify-center border border-white/10 shadow-lg z-20 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                  {i + 1}
                </div>
            </div>
            
            <h4 className="font-bold text-white text-lg md:text-xl mb-1">{step.label}</h4>
            <p className="text-gray-500 text-sm leading-snug">{step.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 md:mt-20 inline-block bg-[#0f172a] border border-white/5 px-6 py-3 rounded-full text-xs md:text-sm font-bold text-gray-400 relative z-10">
        Average match time: <span className="text-cyan-400 ml-2 animate-pulse">4 min 23 sec</span>
      </div>
    </section>
  );
};

export default HowItWorks;