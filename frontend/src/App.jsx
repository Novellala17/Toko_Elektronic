import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FooterComponent from "./Components/FooterComponent";
import NavbarComponent from "./Components/NavbarComponent"
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/Product";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem("isLogin") === "true";
  });

  // Debug: cek status login
  useEffect(() => {
    console.log("Current isLogin state:", isLogin);
    console.log("localStorage isLogin:", localStorage.getItem("isLogin"));
  }, [isLogin]);

  // Fungsi untuk logout
  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    console.log("localStorage after remove:", localStorage.getItem("isLogin"));
    setIsLogin(false);
  };

  return (
    <div className="App">
      {/* Navbar dengan props yang diperlukan */}
      <NavbarComponent 
        isLogin={isLogin} 
        setIsLogin={setIsLogin}
        onLogout={handleLogout}
      />
      
      <div className="content">
        <Routes>
          {/* Route default - LANGSUNG KE LOGIN */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Route Login - Halaman login */}
          <Route
            path="/login"
            element={
              isLogin ? (
                <Navigate to="/Home" replace />
              ) : (
                <LoginPage setIsLogin={setIsLogin} />
              )
            }
          />
          
          {/* Route Homepage */}
          <Route
            path="/home"
            element={
              isLogin ? (
                <HomePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* Route Products */}
          <Route
            path="/products"
            element={
              isLogin ? (
                <ProductPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Route Dashboard - LANGSUNG setelah login */}
          <Route
            path="/dashboard"
            element={
              isLogin ? (
                <DashboardPage setIsLogin={setIsLogin} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
            
          {/* Route 404 - Redirect ke login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      
      <FooterComponent />
    </div>
  );
}

export default App;