import { Sword, ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 text-center bg-[#020617] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-cyan-500/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Icon Container */}
      <div className="mb-6 w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center text-[#020617] mx-auto shadow-2xl shadow-emerald-500/20">
        <Sword size={28} className="rotate-45 md:w-10 md:h-10" />
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Duel?</span>
      </h2>
      
      {/* Subtext */}
      <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-2 max-w-lg mx-auto">
        Prove your coding speed. Climb the ranks. Become legendary.
      </p>
      <p className="text-white font-bold text-base md:text-lg mb-8 md:mb-12">
        Your first match is waiting.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto">
        <a href="#modes" className="w-full sm:w-auto">
           <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#020617] px-8 md:px-12 py-3.5 md:py-4 rounded-lg font-black text-sm flex justify-center items-center gap-2 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] hover:-translate-y-1 transition-all uppercase tracking-widest">
             ENTER THE ARENA <ChevronRight size={16} />
           </button>
        </a>
        <button className="w-full sm:w-auto border border-cyan-500/30 text-cyan-400 px-8 md:px-12 py-3.5 md:py-4 rounded-lg font-black text-sm hover:bg-cyan-900/10 transition-all uppercase tracking-widest">
          WATCH A MATCH
        </button>
      </div>

      {/* Footer Text */}
      <p className="mt-8 md:mt-12 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4">
        Free to play. No credit card required. <span className="block sm:inline mt-1 sm:mt-0 text-cyan-400 cursor-pointer">Start competing in seconds.</span>
      </p>
    </section>
  );
};

export default CTA;