import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../App";
import { toast } from "react-toastify";

const PER_Q_TIME = 20;

export default function RapidDuelPlay({ user }) {
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

  // Guards
  useEffect(() => {
    if (!roomId || !matchId || !total) {
      toast.error("Invalid match state. Returning...");
      navigate("/rapid-duel");
    }
  }, [roomId, matchId, total, navigate]);

  // Reset per question + timer
  useEffect(() => {
    setSelected(null);
    setLocked(false);
    setTimeLeft(PER_Q_TIME);
    setWaiting(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx]);

  // Timeout auto-submit
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, locked, result]);

  // Socket listeners
  useEffect(() => {
    const onAnswerResult = (payload) => {
      if (payload.questionIndex !== idx) return;

      if (payload.isCorrect) {
        setMyCorrect((c) => c + 1);
      }
    };

    const onProgress = ({ userId, correct }) => {
      if (!opponentId) return;
      if (userId === opponentId) setOpCorrect(correct);
    };

    const onOpponentLeft = (data) => {
      setOpponentLeft(true);
      toast.warn(data?.message || "Opponent left. Finish to win.");
      // IMPORTANT: If you were waiting, stop waiting
      setWaiting(false);
    };

    const onResult = (data) => {
      setResult(data);
      setWaiting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    socket.on("match:answerResult", onAnswerResult);
    socket.on("match:progress", onProgress);
    socket.on("match:opponentLeft", onOpponentLeft);
    socket.on("match:result", onResult);

    return () => {
      socket.off("match:answerResult", onAnswerResult);
      socket.off("match:progress", onProgress);
      socket.off("match:opponentLeft", onOpponentLeft);
      socket.off("match:result", onResult);
    };
  }, [idx, opponentId]);

  // Helpers
  const goNextAfterDelay = () => {
    setTimeout(() => {
      if (idx >= total - 1) {
        // If opponent left, DO NOT wait forever — server will finalize once you finish
        if (!result) setWaiting(true);
        return;
      }
      setIdx((i) => i + 1);
    }, 800);
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

  const myResultText = useMemo(() => {
    if (!result || !myId) return null;
    if (!result.winnerId) return "DRAW 🤝";
    if (result.winnerId === myId) return "YOU WON 🏆";
    return "YOU LOST 💀";
  }, [result, myId]);

  const leaveMatch = () => {
    // Tell server you left so opponent gets notified
    socket.emit("match:leave", { roomId });
    navigate("/rapid-duel");
  };

  if (!current && !result) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#020617] text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-black text-xl">
            Rapid Duel <span className="text-cyan-400">Match</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              Q {Math.min(idx + 1, total)}/{total}
            </div>
            {!result && (
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                ⏳ {timeLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Opponent left banner */}
        {opponentLeft && !result && (
          <div className="mb-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-black">
            Opponent left/disconnected — finish remaining questions to win.
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
            <div className="text-2xl font-black">
              {opponentLeft ? "—" : opCorrect}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-black mb-3">{myResultText}</div>

            <div className="text-gray-300 font-bold">
              Your score: {result.scores?.[myId]?.correct ?? myCorrect} / {total}
            </div>

            <div className="text-gray-400 font-bold mt-2">
              Opponent score:{" "}
              {opponentId
                ? result.scores?.[opponentId]?.correct ?? opCorrect
                : opCorrect}{" "}
              / {total}
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#020617] font-black hover:opacity-90 transition"
            >
              Back Home
            </button>
          </div>
        )}

        {/* Question card */}
        {!result && current && (
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 shadow-xl">
            <div className="text-gray-400 text-xs font-bold mb-2">
              CATEGORY: {current.category?.toUpperCase?.() || "GENERAL"} •{" "}
              {current.difficulty?.toUpperCase?.() || "EASY"}
            </div>

            <h2 className="text-xl md:text-2xl font-black mb-6">
              {current.question}
            </h2>

            <div className="space-y-3">
              {current.options.map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    disabled={locked || result}
                    onClick={() => chooseOption(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all font-bold
                      ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }
                      ${locked ? "opacity-80 cursor-not-allowed" : ""}
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={leaveMatch}
                className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black hover:bg-red-500 hover:text-white transition"
              >
                Leave Match
              </button>

              <div className="text-gray-400 text-sm font-bold">
                Pick fast — timer auto-submits!
              </div>
            </div>
          </div>
        )}

        {/* Waiting */}
        {waiting && !result && (
          <div className="mt-6 text-center text-gray-300 font-black">
            {opponentLeft
              ? "Finishing & finalizing match..."
              : "Waiting for opponent to finish..."}
          </div>
        )}
      </div>
    </div>
  );
}
