import React, { useEffect, useState } from "react";
import { Wifi, Globe, Cpu, XCircle, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const BugHuntArena = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [dots, setDots] = useState(".");

  // UI animation logs
  useEffect(() => {
    const messages = [
      "Initializing Bug Hunt Arena...",
      "Loading debugger modules...",
      "Scanning for opponents...",
      "Syncing patch pipelines...",
      "Validating arena rules...",
      "Searching for match...",
    ];

    let delay = 0;
    messages.forEach((msg) => {
      delay += Math.random() * 800 + 400;
      setTimeout(() => {
        setLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
      }, delay);
    });

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // ✅ Socket matchmaking (runs when page opens)
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const startFind = () => socket.emit("match:find", { mode: "bughunter" });

    if (socket.connected) startFind();
    else socket.once("connect", startFind);

    const onQueued = () => {
      setLogs((prev) => [...prev.slice(-4), "> Added to matchmaking queue..."]);
    };

    const onFound = (data) => {
      setLogs((prev) => [...prev.slice(-4), `> Match Found! Room: ${data.roomId}`]);
      navigate(`/bug-hunt/play/${data.matchId}`, { state: data });
    };

    const onError = (data) => {
      setLogs((prev) => [...prev.slice(-4), `> ERROR: ${data.message}`]);
    };

    const onAbandoned = (data) => {
      setLogs((prev) => [...prev.slice(-4), `> ${data.message}`]);
      navigate("/");
    };

    socket.on("match:queued", onQueued);
    socket.on("match:found", onFound);
    socket.on("match:error", onError);
    socket.on("match:abandoned", onAbandoned);

    return () => {
      socket.off("match:queued", onQueued);
      socket.off("match:found", onFound);
      socket.off("match:error", onError);
      socket.off("match:abandoned", onAbandoned);
      socket.off("connect", startFind);
    };
  }, [navigate]);

  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden bg-[#020617]">
      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#ec4899 1px, transparent 1px), linear-gradient(90deg, #ec4899 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="z-10 text-center w-full max-w-4xl">
        {/* Header badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-950/50 border border-pink-500/30 rounded-full text-pink-400 font-bold mb-8 animate-pulse">
          <Bug size={16} /> LIVE MATCHMAKING — BUG HUNT
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">
          Finding{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            Opponent{dots}
          </span>
        </h1>
        <p className="text-gray-500 font-mono text-sm mb-12">ESTIMATED WAIT: 12s</p>

        {/* HUD */}
        <div className="relative bg-[#0f172a]/90 backdrop-blur-md border border-pink-500/20 rounded-3xl p-1 md:p-12 max-w-2xl mx-auto shadow-[0_0_50px_rgba(236,72,153,0.12)] overflow-hidden">
          {/* scanning line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-pink-500/50 shadow-[0_0_20px_#ec4899] animate-[scan_3s_ease-in-out_infinite]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 relative z-10">
            {/* Radar */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-dashed border-pink-500/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-pink-600 w-16 h-16 opacity-50" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent origin-left animate-[spin_2s_linear_infinite]" />
            </div>

            {/* Logs */}
            <div className="flex-1 text-left bg-black/40 rounded-xl p-4 font-mono text-xs h-40 w-full border border-white/5 flex flex-col justify-end">
              <div className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                <Cpu size={14} /> SYSTEM_LOGS
              </div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <p key={i} className="text-pink-300/80 animate-fade-in truncate">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Cancel */}
          <button
            onClick={() => {
              socket.emit("match:cancel", { mode: "bughunter" });
              navigate("/");
            }}
            className="mt-8 w-full md:w-auto px-12 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest mx-auto"
          >
            <XCircle size={16} /> Abort Search
          </button>
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

export default BugHuntArena;
