import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Navbar = ({ setIsAuth }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart count
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    // Check token
    const token = cookies.get("auth-token");
    setIsLoggedIn(!!token);

    // Listen to auth user
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0];
        const photo = user.photoURL;

        setUserName(name);
        if (photo) {
          setUserPhoto(photo);
        } else {
          // Try Firestore fallback
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserPhoto(data.photo || "");
          }
        }
      } else {
        setUserName("");
        setUserPhoto("");
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      unsubscribe();
    };
  }, []);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth-token");
      setIsAuth(false);
      setIsLoggedIn(false);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  // Final fallback using ui-avatars if photo is missing
  const profileImage = userPhoto
    ? userPhoto
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userName || "User"
      )}&background=0053E2&color=fff&bold=true`;

  return (
    <nav className="bg-[#0053E2] shadow-md px-8 py-4 flex items-center justify-between">
      {/* Logo + Location */}
      <div className="flex items-center space-x-4">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src="Logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center text-gray-100 text-sm">
          <FaMapMarkerAlt className="mr-1 text-white" />
          <span>
            Deliver to <strong className="ml-1">Your Location</strong>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 mx-6">
        <div className="flex w-full h-14 border border-gray-300 bg-white rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search everything at Walmart online and in store"
            className="px-4 py-2 w-full focus:outline-none"
          />
          <button className="bg-blue-600 px-4 text-white">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6 text-sm">
        {/* Reorder */}
        <div className="flex flex-col items-center hover:text-blue-300 cursor-pointer">
          <div className="flex items-center space-x-1">
            <FaHeart className="text-lg text-white" />
            <span className="text-white text-lg font-medium">Reorder</span>
          </div>
          <span className="text-white text-xs">My Items</span>
        </div>

        {/* Auth Info */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-3">
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <span className="text-white font-medium">{userName}</span>
            <button
              onClick={signUserOut}
              className="hover:text-blue-300 text-white text-lg"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="flex items-center space-x-1 hover:text-blue-300 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            <FaUser className="text-lg text-white" />
            <span className="text-white text-lg">Sign In</span>
          </button>
        )}

        {/* Cart */}
        <button
          className="relative cursor-pointer flex items-center space-x-1 hover:text-blue-300"
          onClick={() => navigate("/view-cart")}
        >
          <FaShoppingCart className="text-lg text-white" />
          <span className="text-lg text-white">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
