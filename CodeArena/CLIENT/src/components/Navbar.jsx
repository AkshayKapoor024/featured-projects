import { useState } from 'react';
import { Sword, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAvatarUrl } from '../utils/avatars';

axios.defaults.withCredentials = true;

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for menus
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (id) => {
    setIsMobileMenuOpen(false); // Close mobile menu on click
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      if (setUser) setUser(null);
      setShowLogoutModal(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12">
        <div className="flex justify-between items-center">
          
          {/* LEFT: LOGO & NAVIGATION */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              <Sword className="text-cyan-400 w-8 h-8 rotate-45 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-black text-white">
                CODE<span className="text-cyan-400">ARENA</span>
              </span>
            </Link>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-6 h-8">
              <button 
                onClick={() => navigate(-1)} 
                className="p-1.5 rounded-full text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all hover:scale-110"
                title="Go Back"
              >
                <Sword size={22} className="rotate-[225deg]" />
              </button>
              <button 
                onClick={() => navigate(1)} 
                className="p-1.5 rounded-full text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all hover:scale-110"
                title="Go Forward"
              >
                <Sword size={22} className="rotate-[45deg]" />
              </button>
            </div>
          </div>

          {/* CENTER NAV (Desktop) */}
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 uppercase">
            <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition-colors">
              Home
            </button>
            <button onClick={() => handleScroll('modes')} className="hover:text-cyan-400 transition-colors">
              Game Modes
            </button>
            {/* --- ADDED LEADERBOARD LINK --- */}
            <button onClick={() => navigate('/leaderboard')} className="hover:text-cyan-400 transition-colors">
              Leaderboard
            </button>
            <button onClick={() => handleScroll('how')} className="hover:text-cyan-400 transition-colors">
              How It Works
            </button>
            <button onClick={() => handleScroll('features')} className="hover:text-cyan-400 transition-colors">
              Features
            </button>
          </div>

          {/* RIGHT SECTION (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-sm font-bold text-gray-300">
                  Welcome <span className="text-cyan-400">{user.username}</span> !!
                </span>
                <div
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer border border-white/10 hover:border-cyan-400 transition-all overflow-hidden"
                  title="Go to Profile"
                >
                  {user.avatarUrl ? (
                    <img 
                      src={getAvatarUrl(user.avatarUrl)} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="text-cyan-400" size={20} />
                  )}
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login">
                  <button className="text-sm font-bold text-gray-300 hover:text-white uppercase">
                    Sign In
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-cyan-400 hover:bg-cyan-300 text-[#020617] px-8 py-2.5 rounded font-black text-sm uppercase shadow transition-all">
                    Play Now
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="md:hidden flex items-center">
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="text-white p-2"
             >
               {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a] border-b border-white/10 flex flex-col p-6 gap-4 shadow-2xl animate-fade-in">
             <button onClick={() => handleScroll('modes')} className="text-gray-300 font-bold hover:text-cyan-400 text-left py-2 border-b border-white/5">
                Game Modes
             </button>
             {/* --- ADDED LEADERBOARD MOBILE LINK --- */}
             <button onClick={() => { navigate('/leaderboard'); setIsMobileMenuOpen(false); }} className="text-gray-300 font-bold hover:text-cyan-400 text-left py-2 border-b border-white/5">
                Leaderboard
             </button>
             <button onClick={() => handleScroll('how')} className="text-gray-300 font-bold hover:text-cyan-400 text-left py-2 border-b border-white/5">
                How It Works
             </button>
             <button onClick={() => handleScroll('features')} className="text-gray-300 font-bold hover:text-cyan-400 text-left py-2 border-b border-white/5">
                Features
             </button>

             {user ? (
               <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                     <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/30">
                        {user.avatarUrl ? (
                          <img src={getAvatarUrl(user.avatarUrl)} alt="Profile" className="w-full h-full object-cover"/>
                        ) : (
                          <UserIcon className="text-cyan-400 m-2" size={20} />
                        )}
                     </div>
                     <div>
                        <p className="text-white font-bold">{user.username}</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                     </div>
                  </div>
                  <button onClick={handleLogoutClick} className="flex items-center gap-2 text-red-400 font-bold py-2 hover:bg-white/5 rounded px-2">
                     <LogOut size={18} /> Sign Out
                  </button>
               </div>
             ) : (
               <div className="mt-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-lg border border-white/10 text-white font-bold hover:bg-white/5">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-lg bg-cyan-400 text-[#020617] font-black uppercase">
                      Play Now
                    </button>
                  </Link>
               </div>
             )}
          </div>
        )}
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sign Out</h3>
            <p className="text-gray-400 mb-8">Are you sure you want to log out?</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;