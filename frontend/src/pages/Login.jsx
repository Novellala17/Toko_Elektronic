import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function LoginPage({ setIsLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✨ PERBAIKAN: Ubah dari /api/auth/login ke /auth/login
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username,
        password: password
      });

      console.log("Response dari backend:", response.data);

      // ✅ Simpan data user ke localStorage
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      // Simpan data user (opsional)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      // Simpan status login
      localStorage.setItem("isLogin", "true");
      // Update state
      setIsLogin(true);
      // Redirect ke home
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server merespons dengan error
        setError(error.response.data.message || "Username atau Password salah!");
      } else if (error.request) {
        setError("Tidak dapat terhubung ke server. Pastikan backend menyala!");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const emojis = ["🫧","🐠","🐬","🐳","🌊","🐙","💙"];

  return (
    <div className="login-container">
      {[...Array(15)].map((_, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 1.5 + 0.8}rem`,
            animationDuration: `${Math.random() * 8 + 5}s`,
            opacity: Math.random() * 0.6 + 0.4
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </span>
      ))}

      <form className="login-form" onSubmit={handleLogin}>
        <h2>🔒 Login System</h2>
        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "⏳ Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;