import React, { useState, useEffect } from "react";
import { BarChart3, Play, X, ShieldAlert, Cpu, CheckCircle2, Timer, AlertTriangle, LogOut } from "lucide-react";
import CodeEditor from "../components/CodeEditor";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

const ComplexityDuelMain = ({ user, setUser }) => {
    const navigate = useNavigate();

    const [gameState, setGameState] = useState("lobby");

    const [problem, setProblem] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(`// Write your optimized solution here`);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [runStatus, setRunStatus] = useState("idle");
    const [executionData, setExecutionData] = useState(null);
    const [errorLine, setErrorLine] = useState(null);

    const [submissionData, setSubmissionData] = useState(null);
    const [finalResult, setFinalResult] = useState(null);

    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    /* ==================================================
        SOCKET & LOGIC HANDLERS
    ================================================== */

    const startMatchmaking = () => {
        if (!socket.connected) socket.connect();
        setGameState("searching");
        socket.emit("match:find", { mode: "codeDuel" });
    };

    const cancelMatchmaking = () => {
        socket.emit("match:cancel", { mode: "codeDuel" });
        setGameState("lobby");
    };

    useEffect(() => {
        socket.on("match:found", (data) => {
            setRoomId(data.roomId);
            setGameState("loading_problem");

            setTimeout(() => {
                setProblem(data.questions[0]);
                if (data.questions[0].starterCode?.[language]) {
                    setCode(data.questions[0].starterCode[language]);
                }
                setGameState("playing");
            }, 2000);
        });

        socket.on("match:error", ({ message }) => {
            addToast(message, "error");
            setGameState("lobby");
        });

        socket.on("code:opponentUpdate", () => {
            if (Math.random() > 0.7) {
                addToast("Opponent is typing...", "info");
            }
        });

        socket.on("code:opponentSubmitted", () => {
            addToast("⚠️ OPPONENT HAS SUBMITTED! FINISH FAST!", "warning");
        });

        socket.on("code:judging", ({ message }) => {
            setRunStatus("running");
            addToast(message, "info");
        });

        socket.on("code:runResult", ({ results }) => {
            processRunResults(results);
        });

        socket.on("code:submissionResult", (data) => {
            setSubmissionData(data);
            if (gameState !== "ended") {
                setGameState("waiting");
            }
        });

        socket.on("match:result", (data) => {
            setFinalResult(data);
            setGameState("ended");
        });

        return () => {
            socket.off("match:found");
            socket.off("match:error");
            socket.off("code:opponentUpdate");
            socket.off("code:opponentSubmitted");
            socket.off("code:judging");
            socket.off("code:runResult");
            socket.off("code:submissionResult");
            socket.off("match:result");
        };
    }, [language, gameState]);

    useEffect(() => {
        if (gameState !== "playing") return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    socket.emit("match:timeout", { roomId });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, roomId]);

    useEffect(() => {
        if (gameState !== "playing" || !roomId) return;
        const timer = setTimeout(() => {
            if (code) socket.emit("code:sync", { roomId, code, language });
        }, 1000);
        return () => clearTimeout(timer);
    }, [code, roomId, gameState, language]);

    const runCode = () => {
        if (!code || code.trim().length === 0) return;
        setExecutionData(null);
        setRunStatus("running");
        socket.emit("code:run", { roomId, code, language });
    };

    const initiateSubmit = () => {
        setGameState("confirming");
    };

    const confirmSubmit = () => {
        if (!code) return;
        setIsSubmitting(true); // Start loading
        setRunStatus("running");
        socket.emit("code:submit", { roomId, code, language });
    };

    const cancelSubmit = () => {
        setGameState("playing");
    };

    const abandonMatch = () => {
        if (!roomId) return;
        socket.emit("match:abandon", { roomId });
    };

    const processRunResults = (results) => {
        const processedResults = results.map(res => {
            let cleanError = res.error || "";
            if (cleanError) {
                cleanError = cleanError.replace(/\/piston\/jobs\/[a-z0-9-]+\//g, "line ");
            }
            return { ...res, error: cleanError };
        });

        setExecutionData(processedResults);

        const errorResult = processedResults.find(r => r.status === "error" || (r.error && r.error.length > 0));
        if (errorResult) {
            const lineMatch = errorResult.error.match(/line (\d+)|:(\d+):|(\d+)\n/i);
            const lineNo = lineMatch ? parseInt(lineMatch[1] || lineMatch[2] || lineMatch[3]) : null;
            setErrorLine(lineNo);
            setRunStatus("error");
        } else {
            setErrorLine(null);
            const allPassed = processedResults.every(r => r.status === "passed");
            setRunStatus(allPassed ? "success" : "wrong");
        }
    };

    /* ==================================================
        RENDER HELPERS
    ================================================== */

    if (gameState === "lobby" || gameState === "searching" || gameState === "loading_problem") {
        return (
            <div className="relative pt-24 md:pt-32 pb-20 px-4 md:px-6 min-h-screen flex flex-col items-center overflow-hidden bg-[#0D1117]">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full"></div>
                </div>

                <div className="z-10 text-center max-w-3xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-8 text-sm md:text-base">
                        <BarChart3 size={18} /> Big O Battle
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-tight">
                        Optimize or <span className="text-emerald-500">Die</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-lg mx-auto md:max-w-none">
                        Brute force won't work here. 1 vs 1. One Submission. Fastest Optimized Code Wins.
                    </p>

                    {gameState === "lobby" ? (
                        <button
                            onClick={startMatchmaking}
                            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 px-12 rounded-xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
                        >
                            START MATCHMAKING
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-emerald-400 font-mono text-base md:text-lg animate-pulse text-center">
                                {gameState === "searching" ? "SEARCHING FOR OPPONENT..." : "DECRYPTING PROBLEM DATA..."}
                            </div>
                            {gameState === "searching" && (
                                <button onClick={cancelMatchmaking} className="text-red-400 hover:text-red-300 text-sm font-bold mt-4 underline">
                                    CANCEL
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        // Main Container: Vertical on Mobile (h-auto), Horizontal on Desktop (h-screen)
        <div className="flex flex-col lg:flex-row w-full justify-center items-center min-h-screen lg:h-screen pt-20 lg:pt-16 pb-6 lg:pb-0 gap-6 lg:gap-2 bg-[#0D1117] relative overflow-y-auto lg:overflow-hidden px-4 lg:px-0">

            {/* Toasts: Adjusted position for mobile to not block top nav */}
            <div className="absolute top-20 right-4 lg:top-auto lg:bottom-5 lg:right-5 z-[9999] flex flex-col gap-2 w-full max-w-[300px] pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md border-l-4 transform transition-all duration-300 animate-in slide-in-from-right
              ${toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-900/90 border-blue-500 text-white' : ''}
            `}
                    >
                        <div className="font-bold uppercase text-xs opacity-70 mb-1">{toast.type}</div>
                        <div className="font-medium text-sm">{toast.message}</div>
                    </div>
                ))}
            </div>

            {/* LEFT PANEL: PROBLEM STATEMENT */}
            {/* Mobile: Full Width, Fixed Height with Scroll. Desktop: 55% Width, 95% Height */}
            <div className="w-full lg:w-[55%] h-[500px] lg:h-[95%] bg-[#161b22] rounded-xl shadow-2xl flex flex-col gap-5 justify-start p-4 md:p-6 overflow-y-scroll border border-white/5 custom-scrollbar order-1">
                <div className="text-2xl md:text-3xl font-bold text-[#00D1FF] break-words leading-tight">{problem?.title || "Loading..."}</div>

                <div className="flex flex-wrap gap-3 md:gap-5">
                    <div className={`px-4 py-1 uppercase text-xs font-bold tracking-wider ${problem?.difficulty === "easy" ? 'text-green-400 bg-green-400/10' : ""} ${problem?.difficulty === "medium" ? 'text-yellow-400 bg-yellow-400/10' : ""} ${problem?.difficulty === "hard" ? 'text-red-400 bg-red-400/10' : ""} rounded-full flex items-center justify-center`}>
                        {problem?.difficulty || ""}
                    </div>
                    {problem?.tags.map((e, i) => (
                        <div key={i} className="px-4 py-1 bg-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase rounded-full flex items-center justify-center">{e}</div>
                    ))}
                </div>

                <div className="text-lg md:text-xl font-semibold text-[#94A3B8] flex items-center gap-2 mt-2">
                    Problem Statement
                </div>
                <div className="leading-loose text-gray-300 whitespace-pre-line text-sm md:text-base">{problem?.problemStatement || ''}</div>

                <div className="flex flex-col gap-5 mt-4">
                    {problem?.examples.map((e, idx) => (
                        <div key={idx} className="flex flex-col w-full gap-2 bg-black/20 p-4 rounded-lg border border-white/5 overflow-hidden">
                            <div className="text-sm font-bold text-[#00D1FF] uppercase tracking-wider mb-2">Example {idx + 1}</div>
                            <div className="font-mono text-xs md:text-sm break-words"><b className="text-gray-500">Input:</b> <span className="text-white">{e.input}</span></div>
                            <div className="font-mono text-xs md:text-sm break-words"><b className="text-gray-500">Output:</b> <span className="text-green-400">{e.output}</span></div>
                            {e.explanation && <div className="text-xs md:text-sm text-gray-400 mt-1"><i>{e.explanation}</i></div>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col w-full gap-2 mt-2">
                    <div className="text-lg md:text-xl text-[#94a4b8] font-semibold">Constraints:</div>
                    <ul className="list-disc px-5 md:px-10 flex flex-col gap-2 text-xs md:text-sm text-gray-400 font-mono">
                        {problem?.constraints.map((e, i) => <li key={i} className="break-words">{e}</li>)}
                    </ul>
                </div>
            </div>

            {/* RIGHT PANEL: EDITOR & CONSOLE */}
            {/* Mobile: Full Width, Fixed Height. Desktop: 43% Width, 95% Height */}
            <div className="w-full lg:w-[43%] h-[700px] lg:h-[95%] rounded-xl shadow-2xl flex flex-col gap-2 order-2">

                {/* TOP HALF: CODE EDITOR */}
                <div className="bg-[#161b22] rounded-xl h-[60%] flex flex-col border border-white/5 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#ffffff05] p-2 gap-3 sm:gap-0 rounded-t-xl border-b border-white/5">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                            <div className="flex items-center gap-2 px-2 text-white font-medium text-sm">
                                <Cpu size={16} className="text-emerald-500" /> Code
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-[#0D1117] text-gray-300 text-xs md:text-sm px-2 py-1.5 rounded-md border border-white/10 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                            <button
                                onClick={abandonMatch}
                                title="Abandon Match"
                                disabled={gameState !== "playing"}
                                className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                            </button>

                            <div className={`flex items-center gap-2 font-mono font-bold px-3 py-1.5 rounded-lg text-xs md:text-sm ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-[#0D1117] text-emerald-400'}`}>
                                <Timer size={14} />
                                {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
                            </div>

                            <button
                                onClick={runCode}
                                disabled={gameState !== "playing" || runStatus === "running"}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play size={14} fill="currentColor" /> Run
                            </button>

                            <button
                                onClick={initiateSubmit}
                                disabled={gameState !== "playing" || runStatus === "running"}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs md:text-sm border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                    <CodeEditor language={language} code={code} setCode={setCode} highlightLine={errorLine} />
                </div>

                {/* BOTTOM HALF: TEST RESULTS */}
                <div className="bg-[#161b22] rounded-xl h-[40%] border border-white/5 flex flex-col overflow-hidden">
                    <div className="flex items-center px-4 py-2 bg-[#ffffff05] border-b border-white/5">
                        <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Test Results</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {runStatus === "idle" && (
                            <div className="h-full flex flex-col justify-center items-center text-gray-600 gap-2">
                                <Play size={32} className="opacity-50" />
                                <span className="font-mono text-xs md:text-sm">Run code to check against examples</span>
                            </div>
                        )}

                        {runStatus === "running" && (
                            <div className="h-full flex flex-col justify-center items-center gap-4">
                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="font-mono text-emerald-500 text-sm animate-pulse">Compiling & Judging...</div>
                            </div>
                        )}

                        {runStatus === "error" && (
                            <div className="space-y-2">
                                <div className="text-red-400 font-bold flex items-center gap-2 text-sm">
                                    <AlertTriangle size={16} /> Compilation Error
                                </div>
                                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 font-mono text-xs whitespace-pre-wrap break-words">
                                    {executionData?.find(r => r.error)?.error || "Unknown Error"}
                                </div>
                            </div>
                        )}

                        {(runStatus === "success" || runStatus === "wrong") && executionData && (
                            <>
                                <div className={`mb-4 text-base md:text-lg font-bold flex items-center gap-2 ${runStatus === "success" ? "text-emerald-400" : "text-red-400"}`}>
                                    {runStatus === "success" ? <CheckCircle2 /> : <X />}
                                    {runStatus === "success" ? "Passed Examples" : "Wrong Answer"}
                                </div>

                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                                    {executionData.map((res, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveTab(idx)}
                                            className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === idx
                                                ? 'bg-white/10 border-white/30 text-white'
                                                : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${res.status === 'passed' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            Case {idx + 1}
                                        </button>
                                    ))}
                                </div>

                                {executionData[activeTab] && (
                                    <div className="space-y-3 font-mono text-sm animate-in fade-in slide-in-from-bottom-2">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Input</span>
                                            <div className="bg-black/30 p-2 rounded border border-white/5 text-gray-300 break-all">
                                                {typeof executionData[activeTab].input === 'object'
                                                    ? JSON.stringify(executionData[activeTab].input)
                                                    : executionData[activeTab].input}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Your Output</span>
                                            <div className={`p-2 rounded border border-white/5 break-all ${executionData[activeTab].status === 'passed' ? 'text-emerald-400 bg-emerald-900/10' : 'text-red-400 bg-red-900/10'}`}>
                                                {executionData[activeTab].actual || "null"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Expected Output</span>
                                            <div className="bg-black/30 p-2 rounded border border-white/5 text-gray-300 break-all">
                                                {executionData[activeTab].expected}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CONFIRM MODAL */}
            {gameState === "confirming" && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#161b22] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl transform scale-100 animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-2">
                                <ShieldAlert size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Final Submission?</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                You can only submit <b>ONCE</b>. This will run your code against hidden test cases. You cannot edit your code after this.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                                <button onClick={cancelSubmit} className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors">
                                    Keep Coding
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center min-w-[140px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Submit & Lock"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WAITING SCREEN */}
            {gameState === "waiting" && submissionData && (
                <div className="absolute inset-0 z-50 bg-[#0D1117] flex flex-col items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl p-4 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-emerald-500/30 pb-4 gap-2 sm:gap-0">
                            <h1 className="text-xl md:text-2xl font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                                System Monitor
                            </h1>
                            <div className="font-mono text-gray-500 text-xs md:text-sm">UPLINK_ESTABLISHED</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#161b22] border border-white/10 p-6 rounded-xl text-center sm:text-left">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Your Status</div>
                                <div className="text-3xl md:text-4xl font-black text-white">{submissionData.success ? "SUBMITTED" : "ERROR"}</div>
                            </div>
                            <div className="bg-[#161b22] border border-white/10 p-6 rounded-xl text-center sm:text-left">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Test Coverage</div>
                                <div className="text-3xl md:text-4xl font-black text-emerald-400">{submissionData.passed} / {submissionData.total}</div>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-8 border border-emerald-500/20 flex flex-col items-center gap-6 text-center">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping delay-75"></div>
                                <div className="absolute inset-0 border-4 border-emerald-500/50 rounded-full animate-pulse"></div>
                                <Cpu className="absolute inset-0 m-auto text-emerald-500" size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Waiting for Opponent...</h2>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    Your solution is locked. Match results will be generated as soon as your opponent submits or the timer expires.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={abandonMatch}
                                className="text-red-500 hover:text-red-400 text-sm font-bold tracking-widest uppercase hover:underline"
                            >
                                Abandon Match (Forfeit)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FINAL RESULTS SCREEN */}
            {gameState === "ended" && finalResult && (
                <div className="absolute inset-0 z-50 bg-[#0D1117] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500 overflow-y-auto">
                    {/* Background Glow */}
                    <div className={`fixed inset-0 opacity-20 pointer-events-none ${finalResult.winnerId === user?._id ? 'bg-emerald-500/20' : finalResult.resultType === 'draw' ? 'bg-gray-500/20' : 'bg-red-500/20'
                        }`}></div>

                    <div className="relative z-10 w-full max-w-4xl bg-[#161b22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto">

                        {/* Result Identity Section */}
                        <div className={`p-8 md:p-10 flex flex-col justify-center items-center text-center w-full md:w-1/3 ${finalResult.winnerId === user?._id
                            ? 'bg-gradient-to-b from-emerald-900 to-emerald-950'
                            : finalResult.resultType === 'draw'
                                ? 'bg-gray-800'
                                : 'bg-gradient-to-b from-red-900 to-red-950'
                            }`}>
                            {finalResult.winnerId === user?._id ? (
                                <>
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.6)] mb-4 md:mb-6">
                                        <span className="text-3xl md:text-4xl">🏆</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Victory</h2>
                                    <p className="text-emerald-300 font-mono text-xs md:text-sm">+25 Rating Gained</p>
                                </>
                            ) : finalResult.resultType === 'draw' ? (
                                <>
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-600 rounded-full flex items-center justify-center mb-4 md:mb-6">
                                        <span className="text-3xl md:text-4xl">⚖️</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Draw</h2>
                                    <p className="text-gray-400 font-mono text-xs md:text-sm">No Rating Change</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)] mb-4 md:mb-6">
                                        <span className="text-3xl md:text-4xl">💀</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Defeat</h2>
                                    <p className="text-red-300 font-mono text-xs md:text-sm">-15 Rating Lost</p>
                                </>
                            )}
                        </div>

                        {/* Stats Section */}
                        <div className="p-6 md:p-10 w-full md:w-2/3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8 border-b border-white/10 pb-4">Match Statistics</h3>

                                <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6">
                                    <div className="text-xs font-bold text-gray-500 uppercase">Metric</div>
                                    <div className="grid grid-cols-2 text-xs font-bold text-gray-500 uppercase text-center">
                                        <div>You</div>
                                        <div>Opponent</div>
                                    </div>

                                    {/* Tests Passed Metric */}
                                    <div className="text-white font-medium flex items-center gap-2 text-sm md:text-base">
                                        <CheckCircle2 size={16} className="text-emerald-500" /> Tests Passed
                                    </div>
                                    <div className="grid grid-cols-2 text-center">
                                        <div className="text-lg md:text-xl font-black text-white">
                                            {finalResult.scores[user?._id]?.passed || 0}
                                        </div>
                                        <div className="text-lg md:text-xl font-black text-gray-500">
                                            {Object.entries(finalResult.scores).find(([id]) => id !== user?._id)?.[1]?.passed || 0}
                                        </div>
                                    </div>

                                    {/* Time Taken Metric */}
                                    <div className="text-white font-medium flex items-center gap-2 text-sm md:text-base">
                                        <Timer size={16} className="text-blue-500" /> Time Taken
                                    </div>
                                    <div className="grid grid-cols-2 text-center font-mono">
                                        <div className="text-white text-sm md:text-base">
                                            {finalResult.scores[user?._id]?.timeTaken || 0}s
                                        </div>
                                        <div className="text-gray-500 text-sm md:text-base">
                                            {Object.entries(finalResult.scores).find(([id]) => id !== user?._id)?.[1]?.timeTaken || 0}s
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                    <span className="text-gray-400 text-xs uppercase font-bold">Winning Reason</span>
                                    <div className="text-white font-bold mt-1 uppercase text-sm md:text-base">
                                        {finalResult.resultType === 'firstCorrect' ? "Better Accuracy / Faster Time" :
                                            finalResult.resultType === 'timeout' ? "Time Limit Reached" :
                                                finalResult.resultType === 'abandon' ? (finalResult.winnerId === user?._id ? "Opponent Forfeited" : "You Forfeited") :
                                                    finalResult.resultType === 'disconnect' ? "Opponent Disconnected" : "Score Decision"}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-3 md:py-4 mt-6 bg-white hover:bg-gray-200 text-black font-black rounded-xl uppercase tracking-widest transition-transform hover:scale-[1.02]"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ComplexityDuelMain;
