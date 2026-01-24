import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Share2, 
  ChevronRight, 
  Trophy, 
  Cpu, 
  Database, 
  Layers, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  User, 
  Sword, 
  Search,
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- GAME DATA: QUESTIONS ---
const QUESTIONS = [
  {
    id: 1,
    title: "Find the Duplicate Number",
    description: "Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number.",
    constraint: "Solve without modifying the array and use only constant extra space.",
    options: [
      { id: 'A', title: "Brute Force", desc: "Nested loops comparing every element.", complexity: "O(n²)", correct: false, verdict: "Too Slow!" },
      { id: 'B', title: "Sorting", desc: "Sort array, check adjacent elements.", complexity: "O(n log n)", correct: false, verdict: "Modifies array (Forbidden)" },
      { id: 'C', title: "Hash Set", desc: "Store seen elements in a Set.", complexity: "O(n) Space", correct: false, verdict: "Uses O(n) space (Forbidden)" },
      { id: 'D', title: "Floyd's Cycle Finding", desc: "Use slow/fast pointers (Linked List cycle detection logic).", complexity: "O(n)", correct: true, verdict: "Optimal! O(1) Space & O(n) Time." }
    ]
  },
  {
    id: 2,
    title: "Maximum Subarray Sum",
    description: "Find the contiguous subarray (containing at least one number) which has the largest sum.",
    constraint: "Look for an O(n) solution.",
    options: [
      { id: 'A', title: "Kadane's Algorithm", desc: "Iterate once, keeping local and global max.", complexity: "O(n)", correct: true, verdict: "Optimal! Single pass solution." },
      { id: 'B', title: "Divide & Conquer", desc: "Recursively find max in left/right halves.", complexity: "O(n log n)", correct: false, verdict: "Good, but slower than O(n)" },
      { id: 'C', title: "Cubic Brute Force", desc: "Three nested loops checking every subarray.", complexity: "O(n³)", correct: false, verdict: "Time Limit Exceeded" },
      { id: 'D', title: "Prefix Sums", desc: "Precompute sums, iterate with two loops.", complexity: "O(n²)", correct: false, verdict: "Better than cubic, but not optimal" }
    ]
  },
  {
    id: 3,
    title: "N-th Fibonacci Number",
    description: "Calculate F(n) for very large N (e.g., N = 10^9). Modulo 10^9 + 7.",
    constraint: "Must be faster than O(n).",
    options: [
      { id: 'A', title: "Recursion", desc: "F(n) = F(n-1) + F(n-2)", complexity: "O(2ⁿ)", correct: false, verdict: "Exponential Time (Crash)" },
      { id: 'B', title: "Memoization (DP)", desc: "Store previous results in an array.", complexity: "O(n)", correct: false, verdict: "O(n) is too slow for N=10^9" },
      { id: 'C', title: "Matrix Exponentiation", desc: "Use [[1,1],[1,0]]^n matrix multiplication.", complexity: "O(log n)", correct: true, verdict: "Optimal! Logarithmic time." },
      { id: 'D', title: "Binet's Formula", desc: "Use floating point approximation.", complexity: "O(1)", correct: false, verdict: "Precision errors for large N" }
    ]
  },
  {
    id: 4,
    title: "Lowest Common Ancestor (BST)",
    description: "Find LCA of two nodes in a Binary Search Tree (BST).",
    constraint: "Utilize BST properties (Left < Root < Right).",
    options: [
      { id: 'A', title: "Search Paths", desc: "Find path to both nodes, compare lists.", complexity: "O(n)", correct: false, verdict: "Uses O(n) extra space" },
      { id: 'B', title: "Recursive Traversal", desc: "Move left if both < root, right if both > root.", complexity: "O(h)", correct: true, verdict: "Optimal! No extra space." },
      { id: 'C', title: "Parent Pointers", desc: "Add parent link to nodes, trace back.", complexity: "O(h)", correct: false, verdict: "Modifies data structure" },
      { id: 'D', title: "Brute Force", desc: "Check every node as potential ancestor.", complexity: "O(n²)", correct: false, verdict: "Very inefficient" }
    ]
  }
];

// --- MOCK OPPONENTS ---
const OPPONENTS = [
    { name: "DevSlayer99", rating: 1750, color: "text-red-400" },
    { name: "NullPointer", rating: 1620, color: "text-blue-400" },
    { name: "AlgoQueen", rating: 1890, color: "text-purple-400" },
    { name: "RustAce", rating: 1710, color: "text-orange-400" }
];

const AlgorithmDuel = ({ user }) => {
  const navigate = useNavigate();
  
  // Game States: 'SEARCHING' -> 'FOUND' -> 'BATTLE' -> 'RESULTS'
  const [gameState, setGameState] = useState('SEARCHING');
  const [opponent, setOpponent] = useState(OPPONENTS[0]);
  
  // Battle State
  const [qIndex, setQIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Leave Modal State
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Searching Animation Logs
  const [logs, setLogs] = useState([]);
  
  // --- PHASE 1: SEARCHING LOGIC ---
  useEffect(() => {
    if (gameState !== 'SEARCHING') return;

    const messages = [
        "Connecting to Algorithm Arena...",
        "Verifying ELO integrity...",
        "Scanning active players...",
        "Found candidate with ±50 rating...",
        "Handshaking...",
    ];
    
    let delay = 0;
    messages.forEach((msg, i) => {
        delay += 800;
        setTimeout(() => setLogs(p => [...p.slice(-4), `> ${msg}`]), delay);
    });

    // Found match after 4.5s
    const timer = setTimeout(() => {
        setOpponent(OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
        setGameState('FOUND');
    }, 4500);

    return () => clearTimeout(timer);
  }, [gameState]);

  // --- PHASE 2: FOUND LOGIC ---
  useEffect(() => {
    if (gameState !== 'FOUND') return;
    // Transition to Battle after 3s
    const timer = setTimeout(() => {
        setGameState('BATTLE');
    }, 3000);
    return () => clearTimeout(timer);
  }, [gameState]);

  // --- PHASE 3: BATTLE LOGIC (Timer & Opponent AI) ---
  useEffect(() => {
    if (gameState !== 'BATTLE') return;
    
    // Timer
    const interval = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                handleRoundEnd(false); // Time ran out
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    // Mock Opponent Logic: Randomly answer correctly after 5-15 seconds
    const opponentReactionTime = Math.random() * 10000 + 5000; 
    const opponentTimeout = setTimeout(() => {
        if (!isRoundOver) {
             // 70% chance opponent gets it right
             if (Math.random() > 0.3) {
                 setOpponentScore(prev => prev + 100);
             }
        }
    }, opponentReactionTime);

    return () => {
        clearInterval(interval);
        clearTimeout(opponentTimeout);
    };
  }, [gameState, qIndex, isRoundOver]); // Re-run on new question

  const handleSelect = (option) => {
    if (isRoundOver) return;
    setSelectedOption(option);
    handleRoundEnd(option.correct);
  };

  const handleRoundEnd = (isCorrect) => {
    setIsRoundOver(true);
    if (isCorrect) {
        // Calculate score based on time left
        const points = 100 + (timeLeft * 2);
        setPlayerScore(prev => prev + points);
    }
  };

  const nextQuestion = () => {
    if (qIndex < QUESTIONS.length - 1) {
        setQIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsRoundOver(false);
        setTimeLeft(30);
    } else {
        setGameState('RESULTS');
    }
  };

  // --- LEAVE LOGIC ---
  const confirmLeave = () => {
    setShowLeaveModal(false);
    navigate('/');
  };

  // --- VIEW: SEARCHING ---
  if (gameState === 'SEARCHING') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent animate-pulse"></div>
        
        <div className="z-10 text-center max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-8 animate-pulse text-xs md:text-sm">
                <Search size={16} /> LOOKING FOR OPPONENT
            </div>
            
            <div className="relative w-48 h-48 mx-auto mb-12">
                 <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Network size={64} className="text-emerald-500" />
                 </div>
            </div>

            <div className="bg-black/60 border border-emerald-500/20 rounded-xl p-6 font-mono text-left h-48 flex flex-col justify-end shadow-2xl w-full">
                 {logs.map((log, i) => (
                    <p key={i} className="text-emerald-400/80 text-xs md:text-sm animate-fade-in">{log}</p>
                 ))}
            </div>
            <button onClick={() => navigate('/')} className="mt-8 text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-xs">Cancel Search</button>
        </div>
      </div>
    );
  }

  // --- VIEW: FOUND MATCH ---
  if (gameState === 'FOUND') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 animate-scale-in">
             {/* You */}
             <div className="text-center order-2 md:order-1">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-cyan-500/20 border-4 border-cyan-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(6,182,212,0.5)] mx-auto">
                    <User size={48} className="text-cyan-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{user?.username || "Player"}</h2>
                 <p className="text-cyan-400 font-mono text-sm md:text-base">1500 ELO</p>
             </div>

             <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-500 animate-bounce order-1 md:order-2 my-4 md:my-0">VS</div>

             {/* Opponent */}
             <div className="text-center order-3">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(239,68,68,0.5)] mx-auto">
                    <Cpu size={48} className="text-red-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{opponent.name}</h2>
                 <p className="text-red-400 font-mono text-sm md:text-base">{opponent.rating} ELO</p>
             </div>
         </div>
         <p className="mt-12 text-gray-400 animate-pulse text-sm md:text-base">Battle starting in 3...</p>
      </div>
    );
  }

  // --- VIEW: RESULTS ---
  if (gameState === 'RESULTS') {
    const isWin = playerScore > opponentScore;
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center">
            <div className={`p-8 md:p-12 rounded-3xl border-2 ${isWin ? 'border-emerald-500 bg-emerald-950/30' : 'border-red-500 bg-red-950/30'} text-center max-w-2xl w-full`}>
                {isWin ? <Trophy size={60} className="text-yellow-400 mx-auto mb-6 md:w-20 md:h-20" /> : <XCircle size={60} className="text-red-400 mx-auto mb-6 md:w-20 md:h-20" />}
                
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{isWin ? "VICTORY!" : "DEFEAT"}</h1>
                <p className="text-gray-400 mb-8 text-sm md:text-base">{isWin ? "You optimized the code perfectly." : "The opponent's algorithms were more efficient."}</p>

                <div className="flex justify-center gap-8 md:gap-12 mb-8 md:mb-12">
                    <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-500 uppercase font-bold">Your Score</p>
                        <p className="text-3xl md:text-4xl font-black text-white">{playerScore}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-500 uppercase font-bold">Opponent</p>
                        <p className="text-3xl md:text-4xl font-black text-white opacity-70">{opponentScore}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto">
                        Play Again
                    </button>
                    <button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto">
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // --- VIEW: BATTLE (Active Game) ---
  const question = QUESTIONS[qIndex];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#020617] text-white flex flex-col items-center relative">
      
      {/* --- LEAVE MODAL --- */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-red-500/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Abandon Match?</h3>
             <p className="text-gray-400 mb-8 text-sm">You will forfeit this match and lose ELO points.</p>

             <div className="flex gap-3">
               <button
                 onClick={() => setShowLeaveModal(false)}
                 className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={confirmLeave}
                 className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
               >
                 Yes, Leave
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 1. Scoreboard Header - Responsive */}
      <div className="w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-8 shadow-lg">
         
         {/* Row Wrapper for Mobile: Player & Opponent */}
         <div className="flex w-full md:w-auto justify-between items-center md:gap-8 order-2 md:order-1">
             {/* Player Score */}
             <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
                    <User size={16} className="text-cyan-400 md:w-5 md:h-5" />
                </div>
                <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">You</p>
                    <p className="text-lg md:text-xl font-black text-white leading-none">{playerScore}</p>
                </div>
             </div>

             {/* Opponent Score (Mobile only right side) */}
             <div className="flex items-center gap-3 md:gap-4 text-right md:hidden">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{opponent.name}</p>
                    <p className="text-lg font-black text-white leading-none">{opponentScore}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                    <Cpu size={16} className="text-red-400" />
                </div>
             </div>
         </div>

         {/* Timer & Round (Center) */}
         <div className="text-center order-1 md:order-2 w-full md:w-auto border-b md:border-b-0 border-white/5 pb-2 md:pb-0">
            <div className={`text-2xl font-black font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                {timeLeft}s
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase">Round {qIndex + 1}/{QUESTIONS.length}</p>
         </div>

         {/* Opponent & Leave (Desktop Right) */}
         <div className="flex items-center gap-4 md:gap-6 order-3 md:order-3 w-full md:w-auto justify-between md:justify-end">
             {/* Opponent Score (Desktop Hidden on mobile view to avoid dupe, handled above) */}
            <div className="hidden md:flex items-center gap-4 text-right">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">{opponent.name}</p>
                    <p className="text-xl font-black text-white">{opponentScore}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                    <Cpu size={20} className="text-red-400" />
                </div>
            </div>

            <button
                onClick={() => setShowLeaveModal(true)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 ml-auto md:ml-0"
                title="Leave Match"
            >
                <LogOut size={20} />
            </button>
         </div>
      </div>

      {/* 2. Main Game Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Question Panel */}
         <div className="lg:col-span-1 bg-[#0f172a] border border-white/10 p-5 md:p-6 rounded-3xl h-fit">
            <h2 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6">{question.title}</h2>
            <div className="space-y-4 md:space-y-6">
                <div>
                    <h4 className="text-emerald-400 font-bold text-xs md:text-sm uppercase mb-2 flex items-center gap-2">
                        <Database size={16} /> Problem
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {question.description}
                    </p>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <h4 className="text-yellow-400 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                        <AlertTriangle size={14} /> Constraint
                    </h4>
                    <p className="text-gray-300 text-xs italic">
                        {question.constraint}
                    </p>
                </div>
            </div>
         </div>

         {/* Options Panel */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="text-cyan-400" size={20} /> Select Optimal Approach
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
                {question.options.map((option) => {
                    let style = "bg-[#0f172a] border-white/10 hover:border-cyan-500/50";
                    
                    if (isRoundOver) {
                        if (option.correct) style = "bg-emerald-500/10 border-emerald-500";
                        else if (selectedOption?.id === option.id) style = "bg-red-500/10 border-red-500";
                        else style = "bg-[#0f172a] border-white/5 opacity-50";
                    }

                    return (
                        <div 
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={`p-4 md:p-5 rounded-2xl border-2 ${style} transition-all cursor-pointer relative group`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <h4 className="font-bold text-base md:text-lg text-white mb-1 flex items-center gap-3">
                                        <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs text-gray-300 flex-shrink-0">
                                            {option.id}
                                        </span>
                                        {option.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs md:text-sm">{option.desc}</p>
                                </div>
                                {isRoundOver && (
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${option.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {option.complexity}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Verdict Message */}
                            {isRoundOver && selectedOption?.id === option.id && (
                                <div className={`mt-3 pt-3 border-t border-white/10 text-sm font-bold ${option.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                    Verdict: {option.verdict}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Next Button */}
            {isRoundOver && (
                <div className="flex justify-end pt-4 animate-fade-in">
                    <button 
                        onClick={nextQuestion}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 hover:scale-105 w-full sm:w-auto justify-center"
                    >
                        {qIndex < QUESTIONS.length - 1 ? 'Next Challenge' : 'Finish Duel'} <ChevronRight size={18} />
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AlgorithmDuel;