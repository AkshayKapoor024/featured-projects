import React, { useState, useEffect } from "react";
import { XCircle, Wifi, Globe, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const RapidDuel = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [dots, setDots] = useState(".");

  // UI animation
  useEffect(() => {
    const messages = [
      "Connecting to US-East-1...",
      "Handshaking with node...",
      "Verifying ELO integrity...",
      "Searching for opponents (±50 rating)...",
      "Pinging Frankfurt relay...",
      "Optimizing connection route...",
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
  }, []);

  // matchmaking
  useEffect(() => {
    console.log("RapidDuel mounted. socket.connected =", socket.connected, "id =", socket.id);

    if (!socket.connected) socket.connect();

    const startFind = () => {
      console.log("✅ emitting match:find");
      socket.emit("match:find", { mode: "rapidDuel" });
    };

    if (socket.connected) startFind();
    else socket.once("connect", startFind);

    const onQueued = () => {
      console.log("🟡 match:queued");
      setLogs((prev) => [...prev.slice(-4), "> Added to matchmaking queue..."]);
    };

    const onFound = (data) => {
      console.log("🟢 match:found", data);
      setLogs((prev) => [...prev.slice(-4), `> Match Found! Room: ${data.roomId}`]);

      navigate(`/rapid-duel/play/${data.matchId}`, { state: data });
    };

    const onError = (data) => {
      console.log("🔴 match:error", data);
      setLogs((prev) => [...prev.slice(-4), `> ERROR: ${data.message}`]);
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
  }, [navigate]);

  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden bg-[#020617]">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="z-10 text-center w-full max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/50 border border-cyan-500/30 rounded-full text-cyan-400 font-bold mb-8 animate-pulse">
          <Wifi size={16} /> LIVE MATCHMAKING
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">
          Finding{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Opponent{dots}
          </span>
        </h1>

        <p className="text-gray-500 font-mono text-sm mb-12">ESTIMATED WAIT: 12s</p>

        <div className="relative bg-[#0f172a]/90 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-1 md:p-12 max-w-2xl mx-auto shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_20px_#22d3ee] animate-[scan_3s_ease-in-out_infinite]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 relative z-10">
            <div className="relative w-40 h-40 flex-shrink-0">
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-dashed border-cyan-500/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-cyan-600 w-16 h-16 opacity-50" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent origin-left animate-[spin_2s_linear_infinite]" />
            </div>

            <div className="flex-1 text-left bg-black/40 rounded-xl p-4 font-mono text-xs h-40 w-full border border-white/5 flex flex-col justify-end">
              <div className="text-cyan-500 font-bold mb-2 flex items-center gap-2">
                <Cpu size={14} /> SYSTEM_LOGS
              </div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <p key={i} className="text-cyan-300/80 animate-fade-in truncate">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              socket.emit("match:cancel", { mode: "rapidDuel" });
              navigate("/");
            }}
            className="mt-8 w-full md:w-auto px-12 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest mx-auto"
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

export default RapidDuel;
