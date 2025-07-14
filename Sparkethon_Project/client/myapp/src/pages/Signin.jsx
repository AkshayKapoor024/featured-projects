import React, { useState } from "react";
import { auth, provider, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const Signin = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createUserFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        cart: [],
        wishlist: [],
        orderHistory: [],
        preferences: { theme: "light", language: "en" },
        role: "customer",
      });
    } else {
      await setDoc(
        userRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      cookies.set("auth-token", result.user.refreshToken);
      await createUserFirestore(result.user);
      setIsAuth(true);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const customProvider = new GoogleAuthProvider();
      customProvider.setCustomParameters({
        prompt: "select_account", // ✅ Force account chooser
      });

      const result = await signInWithPopup(auth, customProvider);
      cookies.set("auth-token", result.user.refreshToken);
      await createUserFirestore(result.user);
      setIsAuth(true);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Welcome to Walmart
        </h2>

        <form onSubmit={signIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-500">or</span>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-green-400 cursor-pointer text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Signin;
