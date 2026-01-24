import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
// Footer import removed from here

// Pages
import Home from "./pages/Home";
import RapidDuel from "./pages/RapidDuel";
import BugHuntArena from "./pages/BugHuntArena";
import ComplexityDuel from "./pages/ComplexityDuel";
import AlgorithmDuel from './pages/AlgorithmDuel';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RapidDuelPlay from "./pages/RapidDuelPlay";
import Leaderboard from "./pages/Leaderboard";

// Socket + Utils
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BugHuntPlay from "./pages/BugHuntPlay";
import ComplexityDuelPlay from "./pages/ComplexityDuelPlay";
import ComplexityDuelMain from "./pages/ComplexityDuelMain";
axios.defaults.withCredentials = true;

/* =======================
   SINGLE GLOBAL SOCKET
======================= */
if (!window.socket) {
  window.socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ["polling", "websocket"],
  });
}
export const socket = window.socket;

/* =======================
   PROTECTED ROUTE
======================= */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ session check once
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/isAuthenticated`
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    checkSession();
  }, []);

  // ✅ connect socket only when user exists
  useEffect(() => {
    if (!user) return;

    if (!socket.connected) socket.connect();

    const onConnect = () => console.log("🔌 Socket connected:", socket.id);
    const onDisconnect = () => console.log("🔌 Socket disconnected");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  if (loadingUser) return null;

  return (
    <Router>
      <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 flex flex-col">
        <Navbar user={user} setUser={setUser} />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rapid-duel"
              element={
                <ProtectedRoute user={user}>
                  <RapidDuel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rapid-duel/play/:matchId"
              element={
                <ProtectedRoute user={user}>
                  <RapidDuelPlay user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bug-hunt"
              element={
                <ProtectedRoute user={user}>
                  <BugHuntArena user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bug-hunt/play/:matchId"
              element={
                <ProtectedRoute user={user}>
                  <BugHuntPlay user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/complexity-duel"
              element={
                <ProtectedRoute user={user}>
                  <ComplexityDuel user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complexity-duel/play/:matchId"
              element={
                <ProtectedRoute user={user}>
                  <ComplexityDuelPlay user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/code-duel"
              element={
                <ProtectedRoute user={user}>
                  <ComplexityDuelMain user={user} setUser={setUser}/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      </div>
    </Router>
  );
}

export default App;