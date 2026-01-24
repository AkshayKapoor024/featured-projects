import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Medal, Crown, Shield, User as UserIcon, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../utils/avatars";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`);
        setPlayers(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" fill="currentColor" />;
    if (index === 1) return <Medal className="text-gray-300 w-5 h-5 md:w-6 md:h-6" />;
    if (index === 2) return <Medal className="text-orange-400 w-5 h-5 md:w-6 md:h-6" />;
    return <span className="font-mono font-bold text-gray-500 text-sm md:text-base">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-3 md:px-4 bg-[#020617] text-white flex flex-col items-center">
      
      {/* Header */}
      <div className="max-w-4xl w-full mb-6 md:mb-10 text-center relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all md:flex hidden"
        >
          <ArrowLeft className="text-gray-400" size={20} />
        </button>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 font-bold mb-4 text-xs md:text-sm">
          <Trophy size={14} className="md:w-4 md:h-4" /> GLOBAL RANKING
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-2">Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Fame</span></h1>
        <p className="text-gray-400 text-sm md:text-base">Top players battling for algorithmic supremacy</p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-gray-400 text-[10px] md:text-xs uppercase tracking-widest border-b border-white/5">
                <th className="p-3 md:p-6 text-center w-16 md:w-24">Rank</th>
                <th className="p-3 md:p-6">Player</th>
                <th className="p-3 md:p-6 text-center">Rating</th>
                <th className="p-3 md:p-6 text-center hidden md:table-cell">Win Rate</th>
                <th className="p-3 md:p-6 text-center hidden sm:table-cell">Matches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map((player, index) => {
                const winRate = player.matchesPlayed > 0 
                  ? Math.round((player.matchesWon / player.matchesPlayed) * 100) 
                  : 0;

                return (
                  <tr 
                    key={player._id} 
                    className="group hover:bg-white/5 transition-colors"
                  >
                    {/* Rank */}
                    <td className="p-3 md:p-6 text-center">
                      <div className="flex justify-center items-center">
                        {getRankIcon(index)}
                      </div>
                    </td>

                    {/* Player Info */}
                    <td className="p-3 md:p-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#020617] border-2 flex items-center justify-center overflow-hidden flex-shrink-0
                          ${index === 0 ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-white/10'}`}>
                          {player.avatarUrl ? (
                            <img src={getAvatarUrl(player.avatarUrl)} alt={player.username} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={16} className="text-gray-500 md:w-5 md:h-5" />
                          )}
                        </div>
                        <div>
                          <div className={`font-bold text-sm md:text-base ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                            {player.username}
                          </div>
                          <div className="text-[10px] md:text-xs text-gray-500 md:hidden">
                            {player.rating} ELO
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="p-3 md:p-6 text-center font-mono font-bold text-cyan-400 text-sm md:text-lg">
                      {player.rating}
                    </td>

                    {/* Win Rate */}
                    <td className="p-3 md:p-6 text-center hidden md:table-cell">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {winRate}%
                        </span>
                        <div className="w-16 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${winRate >= 50 ? 'bg-emerald-500' : 'bg-gray-500'}`} 
                            style={{ width: `${winRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Matches Played */}
                    <td className="p-3 md:p-6 text-center hidden sm:table-cell text-gray-400 font-bold">
                      {player.matchesPlayed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;