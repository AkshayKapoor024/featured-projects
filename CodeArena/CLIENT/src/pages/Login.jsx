import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sword,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     SIMPLE VALIDATIONS
  ========================== */
  const validate = (field, value) => {
    if (!value.trim()) return `${field} is required`;

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email address';
    }

    if (field === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return '';
  };

  /* =========================
     SUBMIT HANDLER
  ========================== */
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    let newErrors = {};

    if (!isLogin) {
      const userErr = validate('username', formData.username);
      if (userErr) newErrors.username = userErr;
    }

    const emailErr = validate('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validate('password', formData.password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/login`
        : `${import.meta.env.VITE_BACKEND_URL}/signup`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(url, payload);

      toast.success(
        isLogin
          ? 'Logged in successfully!'
          : 'Account created successfully!'
      );

      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong';

      setGeneralError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Sword className="text-cyan-400 w-10 h-10 md:w-12 md:h-12 rotate-45 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Arena'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin
              ? 'Enter your credentials to continue.'
              : 'Create your challenger profile.'}
          </p>
        </div>

        {generalError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-xs md:text-sm font-bold">
            <AlertCircle size={16} className="flex-shrink-0" />
            {generalError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  className={`w-full bg-[#1e293b] border ${
                    errors.username
                      ? 'border-red-500'
                      : 'border-white/5 focus:border-cyan-500'
                  } rounded-lg py-3 pl-10 pr-4 text-white text-sm md:text-base outline-none transition-all placeholder:text-gray-500`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 ml-1 font-bold">
                  {errors.username}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                className={`w-full bg-[#1e293b] border ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-white/5 focus:border-cyan-500'
                } rounded-lg py-3 pl-10 pr-4 text-white text-sm md:text-base outline-none transition-all placeholder:text-gray-500`}
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1 font-bold">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="password"
                className={`w-full bg-[#1e293b] border ${
                  errors.password
                    ? 'border-red-500'
                    : 'border-white/5 focus:border-cyan-500'
                } rounded-lg py-3 pl-10 pr-4 text-white text-sm md:text-base outline-none transition-all placeholder:text-gray-500`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1 font-bold">
                {errors.password}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className={`w-full ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
            } bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#020617] font-black py-3 md:py-3.5 rounded-lg mt-6 shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm`}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Enter Arena'
              : 'Initialize User'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-gray-400 text-sm">
            {isLogin ? 'New Challenger?' : 'Already Registered?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setGeneralError('');
              }}
              className="ml-2 text-cyan-400 font-bold hover:text-white transition-colors underline decoration-cyan-400/30 underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
