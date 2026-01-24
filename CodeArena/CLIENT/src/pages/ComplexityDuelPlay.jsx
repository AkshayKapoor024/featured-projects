import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../App";
import { toast } from "react-toastify";
import { Timer, User, Cpu, LogOut, CheckCircle2, XCircle } from "lucide-react";

const PER_Q_TIME = 30;

export default function ComplexityDuelPlay({ user }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const roomId = state?.roomId;
  const questions = state?.questions || [];
  const players = state?.players || [];
  const matchId = state?.matchId;

  const total = questions.length;
  const myId = user?._id?.toString();

  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PER_Q_TIME);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [myCorrect, setMyCorrect] = useState(0);
  const [opCorrect, setOpCorrect] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [result, setResult] = useState(null);
  const [opponentLeft, setOpponentLeft] = useState(false);

  const timerRef = useRef(null);
  const current = questions[idx];

  const opponentId = useMemo(() => {
    if (!players?.length || !myId) return null;
    return players.find((p) => p !== myId) || null;
  }, [players, myId]);

  // =========================
  // Guard
  // =========================
  useEffect(() => {
    if (!roomId || !matchId || !total || !myId) {
      toast.error("Invalid match state. Returning...");
      navigate("/complexity-duel");
    }
  }, [roomId, matchId, total, myId, navigate]);

  // =========================
  // Reset per question + timer
  // =========================
  useEffect(() => {
    setSelected(null);
    setLocked(false);
    setTimeLeft(PER_Q_TIME);
    setWaiting(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx]);

  // =========================
  // Timeout auto-submit
  // =========================
  useEffect(() => {
    if (locked || result) return;
    if (timeLeft > 0) return;

    setLocked(true);

    socket.emit("match:answer", {
      roomId,
      questionIndex: idx,
      selectedIndex: -1,
    });

    toast.error("Time up!");
    goNextAfterDelay();
  }, [timeLeft, locked, result, idx, roomId]);

  // =========================
  // Socket listeners
  // =========================
  useEffect(() => {
    const onAnswerResult = (payload) => {
      if (payload.questionIndex !== idx) return;
      if (payload.isCorrect) setMyCorrect((c) => c + 1);
    };

    const onProgress = ({ userId, correct }) => {
      if (!opponentId) return;
      if (userId === opponentId) setOpCorrect(correct);
    };

    const onResult = (data) => {
      setResult(data);
      setWaiting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const onOpponentLeft = (data) => {
      setOpponentLeft(true);
      toast.warn(data?.message || "Opponent left. Finish remaining questions to win.");
    };

    socket.on("match:answerResult", onAnswerResult);
    socket.on("match:progress", onProgress);
    socket.on("match:result", onResult);
    socket.on("match:opponentLeft", onOpponentLeft);

    return () => {
      socket.off("match:answerResult", onAnswerResult);
      socket.off("match:progress", onProgress);
      socket.off("match:result", onResult);
      socket.off("match:opponentLeft", onOpponentLeft);
    };
  }, [idx, opponentId]);

  // =========================
  // Helpers
  // =========================
  const goNextAfterDelay = () => {
    setTimeout(() => {
      if (idx >= total - 1) {
        setWaiting(true);
        return;
      }
      setIdx((i) => i + 1);
    }, 700);
  };

  const chooseOption = (optIndex) => {
    if (locked || result) return;

    setSelected(optIndex);
    setLocked(true);

    socket.emit("match:answer", {
      roomId,
      questionIndex: idx,
      selectedIndex: optIndex,
    });

    goNextAfterDelay();
  };

  const leaveMatch = () => {
    socket.emit("match:leave", { roomId });
    navigate("/complexity-duel");
  };

  const myResultText = useMemo(() => {
    if (!result || !myId) return null;
    if (!result.winnerId) return "DRAW 🤝";
    if (result.winnerId === myId) return "YOU WON 🏆";
    return "YOU LOST 💀";
  }, [result, myId]);

  // =========================
  // Render option safely
  // =========================
  const renderOption = (opt) => {
    if (typeof opt === "string") return <span className="font-bold">{opt}</span>;

    if (opt && typeof opt === "object") {
      const title =
        opt.title || opt.label || opt.heading || opt.description || opt.approach || "Option";

      const desc =
        opt.description ||
        opt.detail ||
        opt.summary ||
        opt.note ||
        (opt.approach && opt.approach !== title ? opt.approach : "");

      return (
        <div className="space-y-1">
          <div className="text-white font-black leading-snug">{title}</div>
          {desc ? (
            <div className="text-gray-300 text-sm font-semibold leading-snug">{desc}</div>
          ) : (
            <div className="text-gray-400 text-sm font-semibold leading-snug">
              Short description not available.
            </div>
          )}
        </div>
      );
    }

    return <span className="font-bold">Invalid option</span>;
  };

  if (!current) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#020617] text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-black text-xl">
            Complexity Duel <span className="text-emerald-400">Match</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-black">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              Q {idx + 1}/{total}
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              ⏳ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Opponent status */}
        {opponentLeft && !result && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold">
            Opponent left — finish your remaining questions to win automatically.
          </div>
        )}

        {/* Score */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-xs font-bold">YOU</div>
            <div className="text-2xl font-black">{myCorrect}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-xs font-bold">OPPONENT</div>
            <div className="text-2xl font-black">{opCorrect}</div>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-emerald-500/20 shadow-xl">
          <div className="text-emerald-200/70 text-xs font-bold mb-2">
            CATEGORY: {current.category?.toUpperCase?.() || "GENERAL"} •{" "}
            {current.difficulty?.toUpperCase?.() || "MEDIUM"}
          </div>

          <h2 className="text-xl md:text-2xl font-black mb-6">
            {current.title || current.question || "Question"}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {(current.options || []).map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  disabled={locked || result}
                  onClick={() => chooseOption(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all
                    ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }
                    ${locked ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {renderOption(opt)}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={leaveMatch}
              className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black hover:bg-red-500 hover:text-white transition"
            >
              Leave Match
            </button>

            <div className="text-gray-400 text-sm font-bold">Timer auto-submits.</div>
          </div>
        </div>

        {/* Waiting */}
        {waiting && !result && (
          <div className="mt-6 text-center text-gray-300 font-black">
            Waiting for opponent to finish...
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-black mb-3">{myResultText}</div>

            <div className="text-gray-300 font-bold">
              Your score: {result.scores?.[myId]?.correct ?? myCorrect} / {total}
            </div>

            <div className="text-gray-400 font-bold mt-2">
              Opponent score:{" "}
              {opponentId ? result.scores?.[opponentId]?.correct ?? opCorrect : opCorrect} /{" "}
              {total}
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 text-[#020617] font-black hover:opacity-90 transition"
            >
              Back Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
