import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, LogOut, Camera, Home, Calendar, Clock, Award, Swords, Sword } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AVATARS, getAvatarUrl } from '../utils/avatars';

axios.defaults.withCredentials = true;

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(AVATARS[0].url);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync state with user prop
  useEffect(() => {
    if (user) {
      const url = getAvatarUrl(user.avatarUrl);
      setCurrentAvatarUrl(url);
    }
  }, [user]);

  // Mock Data
  const recentMatches = [
    { id: 1, opponent: "DevSlayer99", result: "WIN", mode: "Rapid Duel", date: "2 hrs ago", lang: "Python", elo: "+24" },
    { id: 2, opponent: "BugHunter_X", result: "LOSS", mode: "Bug Hunt", date: "5 hrs ago", lang: "JS", elo: "-12" },
    { id: 3, opponent: "AlgoQueen", result: "WIN", mode: "Complexity Duel", date: "1 day ago", lang: "C++", elo: "+31" },
  ];

  const badges = [
    { name: "First Blood", icon: "⚔️", desc: "Won your first duel" },
    { name: "Speedster", icon: "⚡", desc: "Solved in < 1 min" },
    { name: "Bug Hunter", icon: "🐞", desc: "Fixed 50 bugs" },
    { name: "Sharpshooter", icon: "🎯", desc: "100% Accuracy" },
  ];

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      if (setUser) setUser(null);
      navigate('/');
      toast.info("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleAvatarSelect = async (id) => {
    const selected = AVATARS.find(a => a.id === id);
    if (!selected) return;

    // 1. Optimistic UI Update
    setCurrentAvatarUrl(selected.url);
    setIsEditing(false);

    try {
      // 2. Persist to Backend (UNCHANGED)
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/update-avatar`, {
        avatarUrl: selected.url
      });

      // 3. Update Global State
      if (res.data.status === 'updated' && setUser) {
         setUser(res.data.user);
         toast.success("Avatar updated!");
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
      
      if (err.response && err.response.status === 404) {
         toast.warning("Avatar changed locally (Backend route missing)");
         if (setUser) setUser({ ...user, avatarUrl: selected.url });
      } else {
         toast.error("Failed to save avatar.");
         setCurrentAvatarUrl(getAvatarUrl(user.avatarUrl)); 
      }
    }
  };

  // Function to cycle through avatars
  const cycleAvatar = (direction) => {
    const currentIndex = AVATARS.findIndex(a => a.url === currentAvatarUrl);
    let nextIndex = 0;
    
    if (currentIndex !== -1) {
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % AVATARS.length;
        } else {
            nextIndex = (currentIndex - 1 + AVATARS.length) % AVATARS.length;
        }
    }
    
    handleAvatarSelect(AVATARS[nextIndex].id);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-[#020617]">
      <div className="max-w-6xl mx-auto"> 
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-2xl mb-8">
          
          {/* Avatar Area with Sword Arrows */}
          <div className="flex items-center gap-4 md:gap-6 mt-6 md:mt-0">
            
            {/* Left Sword (Previous) */}
            <button 
                onClick={() => cycleAvatar('prev')}
                className="hidden md:flex text-gray-500 hover:text-cyan-400 hover:scale-110 transition-all p-2"
                title="Previous Avatar"
            >
                <Sword size={32} className="rotate-[225deg]" /> 
            </button>

            <div className="relative group">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-[#020617]">
                <img 
                    src={currentAvatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                />
                </div>
                <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-2 right-2 bg-cyan-500 text-[#020617] p-2 md:p-2.5 rounded-full shadow-lg hover:bg-cyan-400 transition-colors z-10"
                title="Open Avatar Grid"
                >
                <Camera size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
            </div>

            {/* Right Sword (Next) */}
            <button 
                onClick={() => cycleAvatar('next')}
                className="hidden md:flex text-gray-500 hover:text-cyan-400 hover:scale-110 transition-all p-2"
                title="Next Avatar"
            >
                <Sword size={32} className="rotate-[45deg]" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left z-10 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 truncate">{user.username}</h1>
            <p className="text-gray-400 font-mono mb-4 md:mb-6 text-sm md:text-base truncate">{user.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              <span className="bg-[#1e293b] border border-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-emerald-400 font-bold text-xs md:text-sm flex items-center gap-2">
                <Trophy size={14} className="md:w-4 md:h-4" /> Rank: {user.rating || 1200}
              </span>
              <span className="bg-[#1e293b] border border-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-cyan-400 font-bold text-xs md:text-sm flex items-center gap-2">
                <Swords size={14} className="md:w-4 md:h-4" /> Battles: {user.matchesPlayed || 0}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 md:gap-3">
             <button onClick={() => navigate('/')} className="bg-[#1e293b] hover:bg-white/10 text-gray-300 hover:text-white p-2 md:p-2.5 rounded-xl transition-all border border-white/5 shadow-lg">
                <Home size={18} className="md:w-5 md:h-5" />
             </button>
             <button onClick={handleLogoutClick} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 md:p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg">
                <LogOut size={18} className="md:w-5 md:h-5" />
             </button>
          </div>
        </div>

        {/* --- AVATAR EDITOR (Grid View) --- */}
        {isEditing && (
          <div className="mb-8 bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-white/10 animate-fade-in">
            <h3 className="text-white font-bold mb-6 text-center text-lg md:text-xl">Select Your Identity</h3>
            
            {/* Mobile Navigation Arrows */}
            <div className="flex md:hidden justify-center gap-8 mb-6">
                <button onClick={() => cycleAvatar('prev')} className="p-3 bg-black/20 rounded-full text-cyan-400 active:bg-black/40">
                    <Sword size={24} className="rotate-[225deg]" />
                </button>
                <button onClick={() => cycleAvatar('next')} className="p-3 bg-black/20 rounded-full text-cyan-400 active:bg-black/40">
                    <Sword size={24} className="rotate-[45deg]" />
                </button>
            </div>

            <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleAvatarSelect(av.id)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden hover:scale-110 transition-transform border-4 bg-[#020617] ${currentAvatarUrl === av.url ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'border-transparent grayscale hover:grayscale-0'}`}
                >
                  <img src={av.url} alt="Avatar Option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- DASHBOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#0f172a] p-4 md:p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Win Rate</div>
                        <div className="text-xl md:text-2xl font-black text-white">42%</div>
                        <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full w-[42%]"></div>
                        </div>
                    </div>
                    <div className="bg-[#0f172a] p-4 md:p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Favorite</div>
                        <div className="text-xl md:text-2xl font-black text-white truncate">Rapid Duel</div>
                    </div>
                    <div className="bg-[#0f172a] p-4 md:p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Streak</div>
                        <div className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                            2 <span className="text-orange-500 text-sm">🔥</span>
                        </div>
                    </div>
                </div>

                {/* Recent Matches */}
                <div>
                     <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Calendar className="text-cyan-400" size={20} /> Recent Battles
                    </h3>
                    <div className="space-y-3">
                        {recentMatches.map((match) => (
                            <div key={match.id} className="bg-[#0f172a] border border-white/5 p-3 md:p-4 rounded-xl flex items-center justify-between hover:bg-[#1e293b] transition-colors group">
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs flex-shrink-0 ${match.result === 'WIN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {match.result}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-white text-sm md:text-sm group-hover:text-cyan-400 transition-colors truncate">vs {match.opponent}</h4>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-mono truncate">{match.mode} • {match.lang}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <span className={`font-bold text-sm ${match.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {match.elo} ELO
                                    </span>
                                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 mt-1">
                                        <Clock size={10} /> {match.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 <div>
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Award className="text-yellow-400" size={20} /> Achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {badges.map((badge, i) => (
                            <div key={i} className="bg-[#0f172a] border border-white/5 p-3 md:p-4 rounded-xl flex flex-col items-center text-center hover:bg-[#1e293b] hover:border-yellow-500/20 transition-all cursor-default">
                                <div className="text-2xl md:text-3xl mb-2 filter drop-shadow-md">{badge.icon}</div>
                                <div className="font-bold text-white text-xs mb-1">{badge.name}</div>
                                <div className="text-[10px] text-gray-500 leading-tight">{badge.desc}</div>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/20 p-5 md:p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h4 className="text-sm font-bold text-white mb-1">Next Milestone</h4>
                    <p className="text-xs text-gray-400 mb-4">Win 5 more matches to reach <span className="text-cyan-400 font-bold">Apprentice</span></p>
                    
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                        <span>1200 XP</span>
                        <span>1500 XP</span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[65%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Sign Out</h3>
            <p className="text-gray-400 mb-8 text-sm md:text-base">Are you sure you want to log out? You'll need to sign in again to play.</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all text-sm"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;