import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Cookies from "universal-cookie";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase-config";

import HomePromos from "./pages/Home";
import CategoryPage from "./pages/Category";
import PlaceOrder from "./pages/PlaceOrder";
import ViewCart from "./pages/View-cart";
import Art from "./pages/Art";
import Sports from "./pages/Sports";
import Baby from "./pages/Baby";
import Clothing from "./pages/Clothing";
import Kitchen from "./pages/Kitchen";
import Signin from "./pages/Signin";
import Navbar from "./pages/navbar";

const cookies = new Cookies();

const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/signin" />;
};

function LayoutWrapper({ isAuth, setIsAuth }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/signin";

  return (
    <>
      <Toaster />
      {!hideNavbar && <Navbar setIsAuth={setIsAuth} />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <HomePromos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-cart"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <ViewCart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/art"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Art />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sports"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Sports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/baby"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Baby />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clothing"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Clothing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Kitchen />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<Signin setIsAuth={setIsAuth} />} />
      </Routes>
    </>
  );
}

function App() {
  const [isAuth, setIsAuth] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Loading...</div>;
  }

  return (
    <Router>
      <LayoutWrapper isAuth={isAuth} setIsAuth={setIsAuth} />
    </Router>
  );
}

export default App;
