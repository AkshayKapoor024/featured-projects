import React, { useEffect, useState } from "react";
import { XCircle, Wifi, Globe, Cpu, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const ComplexityDuel = () => {
  const navigate = useNavigate();

  // ===== FUNCTIONAL STATE (UNCHANGED) =====
  const [logs, setLogs] = useState([]);
  const [dots, setDots] = useState(".");
  const [searching, setSearching] = useState(false);

  /* =========================
     UI ANIMATION (LOGS + DOTS)
  ========================== */
  useEffect(() => {
    if (!searching) return;

    const messages = [
      "Booting Complexity Engine...",
      "Calibrating Big-O detector...",
      "Syncing rating bracket...",
      "Searching for opponents (±50 rating)...",
      "Benchmarking relay nodes...",
      "Locking match seed...",
    ];

    let delay = 0;
    const timers = [];

    messages.forEach((msg) => {
      delay += Math.random() * 800 + 400;
      const t = setTimeout(() => {
        setLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
      }, delay);
      timers.push(t);
    });

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(dotInterval);
    };
  }, [searching]);

  /* =========================
     MATCHMAKING SOCKET LOGIC
     (UNCHANGED & AUTHORITATIVE)
  ========================== */
  useEffect(() => {
    if (!searching) return;

    if (!socket.connected) socket.connect();

    const startFind = () => {
      setLogs((prev) => [...prev.slice(-4), "> Requesting matchmaking..."]);
      socket.emit("match:find", { mode: "complexityDuel" });
    };

    if (socket.connected) startFind();
    else socket.once("connect", startFind);

    const onQueued = (data) => {
      setLogs((prev) => [
        ...prev.slice(-4),
        `> Queued (rating: ${data?.myRating ?? "?"})...`,
      ]);
    };

    const onFound = (data) => {
      setLogs((prev) => [
        ...prev.slice(-4),
        `> Match Found! Room: ${data.roomId}`,
      ]);

      navigate(`/complexity-duel/play/${data.matchId}`, { state: data });
    };

    const onError = (data) => {
      setLogs((prev) => [...prev.slice(-4), `> ERROR: ${data?.message}`]);
      setSearching(false);
    };

    socket.on("match:queued", onQueued);
    socket.on("match:found", onFound);
    socket.on("match:error", onError);

    return () => {
      socket.off("match:queued", onQueued);
      socket.off("match:found", onFound);
      socket.off("match:error", onError);
      socket.off("connect", startFind);
    };
  }, [navigate, searching]);

  /* =========================
     ACTIONS
  ========================== */
  const start = () => {
    setLogs([]);
    setDots(".");
    setSearching(true);
  };

  const abort = () => {
    socket.emit("match:cancel", { mode: "complexityDuel" });
    setSearching(false);
    setLogs([]);
  };

  /* =========================
     UI (FROM INCOMING FILE)
  ========================== */
  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden bg-[#020617]">
      
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="z-10 text-center w-full max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-8">
          <BarChart3 size={16} /> BIG-O BATTLE
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">
          {searching ? (
            <>
              Finding{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                Opponent{dots}
              </span>
            </>
          ) : (
            <>
              Optimize or{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                Die
              </span>
            </>
          )}
        </h1>

        <p className="text-gray-500 font-mono text-sm mb-10">
          {searching ? "ESTIMATED WAIT: ~10s" : "Brute force gets rejected."}
        </p>

        {/* HUD */}
        <div className="relative bg-[#0f172a]/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-1 md:p-10 max-w-2xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.12)] overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 animate-[scan_3s_ease-in-out_infinite]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 relative z-10">
            
            {/* Radar */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-dashed border-emerald-500/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-emerald-600 w-16 h-16 opacity-50" />
              </div>
            </div>

            {/* Logs */}
            <div className="flex-1 text-left bg-black/40 rounded-xl p-4 font-mono text-xs h-40 w-full border border-white/5 flex flex-col justify-end">
              <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Cpu size={14} /> SYSTEM_LOGS
              </div>

              <div className="space-y-1">
                {(logs.length ? logs : ["> Ready. Click START MATCHMAKING."]).map(
                  (log, i) => (
                    <p key={i} className="text-emerald-200/80 animate-fade-in truncate">
                      {log}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {!searching ? (
            <button
              onClick={start}
              className="mt-2 w-full md:w-auto px-12 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-black rounded-lg hover:bg-emerald-500 hover:text-black transition-all uppercase text-xs tracking-widest mx-auto flex items-center justify-center gap-2"
            >
              <Wifi size={16} /> START MATCHMAKING
            </button>
          ) : (
            <button
              onClick={abort}
              className="mt-2 w-full md:w-auto px-12 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-black rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase text-xs tracking-widest mx-auto flex items-center justify-center gap-2"
            >
              <XCircle size={16} /> ABORT SEARCH
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ComplexityDuel;
