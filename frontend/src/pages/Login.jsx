import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; 
function LoginPage({ setIsLogin }) {
  // State untuk login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk register
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // State untuk lupa password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  
  // State untuk debug
  const [debugInfo, setDebugInfo] = useState("");
  
  // State untuk tampilan
  const [activeTab, setActiveTab] = useState("login");
  const [bubbles, setBubbles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const navigate = useNavigate();
 const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// TAMBAHKAN untuk debug:
console.log('🔥 API URL:', import.meta.env.VITE_API_URL);
console.log('🔥 Mode:', import.meta.env.MODE);

  // Generate bubbles
  useEffect(() => {
    const emojis = ["🫧","🐠","🐬","🐳","🌊","🐙","💙"];
    const newBubbles = [];
    
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        fontSize: `${Math.random() * 1.5 + 0.8}rem`,
        animationDuration: `${Math.random() * 8 + 5}s`,
        opacity: Math.random() * 0.6 + 0.4,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    
    setBubbles(newBubbles);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  // ========== HANDLE LOGIN ==========
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username,
        password: password
      });

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      localStorage.setItem("isLogin", "true");
      setIsLogin(true);
      
      alert(`🎉 Selamat datang, ${username}!`);
      navigate("/home");
      
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Username atau Password salah!");
      setIsLoading(false);
    }
  };

  // ========== HANDLE REGISTER ==========
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    setValidationErrors({
      ...validationErrors,
      [e.target.name]: null
    });
    setDebugInfo("");
  };

  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerData.name || registerData.name.trim() === "") {
      errors.name = "Nama lengkap tidak boleh kosong";
    } else if (registerData.name.length < 3) {
      errors.name = "Nama minimal 3 karakter";
    }
    
    if (!registerData.username || registerData.username.trim() === "") {
      errors.username = "Username tidak boleh kosong";
    } else if (registerData.username.length < 3) {
      errors.username = "Username minimal 3 karakter";
    }
    
    if (!registerData.email || registerData.email.trim() === "") {
      errors.email = "Email tidak boleh kosong";
    } else if (!registerData.email.includes('@') || !registerData.email.includes('.')) {
      errors.email = "Email tidak valid (contoh: nama@email.com)";
    }
    
    if (!registerData.password) {
      errors.password = "Password tidak boleh kosong";
    } else if (registerData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setDebugInfo("");

    if (!validateRegisterForm()) {
      return;
    }

    setIsRegisterLoading(true);

    try {
      const dataToSend = {
        name: registerData.name.trim(),
        username: registerData.username.trim(),
        email: registerData.email.trim().toLowerCase(),
        password: registerData.password,
        role: "customer",
        membership: "Silver"
      };

      console.log("Mengirim data register:", dataToSend);
      setDebugInfo(`Mengirim: ${JSON.stringify(dataToSend)}`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, dataToSend);

      console.log("Register success:", response.data);
      setDebugInfo(`Sukses: ${JSON.stringify(response.data)}`);

      setRegisterSuccess("Registrasi berhasil! Silakan login.");
      
      setRegisterData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setActiveTab("login");
        showToast("Akun berhasil dibuat! Silakan login.", "success");
      }, 2000);

    } catch (error) {
      console.error("Register error FULL:", error);
      console.error("Register error response:", error.response);
      
      let errorMessage = "Registrasi gagal!";
      
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        setDebugInfo(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Data yang dikirim tidak valid";
        } else if (error.response.status === 409) {
          errorMessage = "Username atau Email sudah terdaftar!";
        } else {
          errorMessage = error.response.data.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        setDebugInfo("Tidak ada response dari server");
        errorMessage = "Tidak dapat terhubung ke server!";
      } else {
        setDebugInfo(`Error: ${error.message}`);
        errorMessage = "Terjadi kesalahan: " + error.message;
      }
      
      setRegisterError(errorMessage);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // ========== HANDLE FORGOT PASSWORD ==========
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setDebugInfo("");
    setIsForgotLoading(true);

    try {
      if (!forgotEmail || !forgotEmail.includes('@')) {
        setForgotError("Email tidak valid");
        setIsForgotLoading(false);
        return;
      }

      console.log("Mengirim request reset password untuk email:", forgotEmail);
      setDebugInfo(`Mengirim email: ${forgotEmail}`);

      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: forgotEmail.trim().toLowerCase()
      });

      console.log("Forgot password response:", response.data);
      setDebugInfo(`Sukses: ${JSON.stringify(response.data)}`);
      
      // Tampilkan pesan sukses
      setForgotSuccess("Link reset password telah dikirim ke email Anda! Cek console terminal untuk link reset.");
      
      // Reset form
      setForgotEmail("");
      
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error.message);
      
      let errorMessage = "Gagal mengirim reset password!";
      
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        setDebugInfo(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        
        if (error.response.status === 404) {
          errorMessage = "Email tidak ditemukan!";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        setDebugInfo("Tidak ada response dari server");
        errorMessage = "Tidak dapat terhubung ke server!";
      } else {
        setDebugInfo(`Error: ${error.message}`);
        errorMessage = error.message;
      }
      
      setForgotError(errorMessage);
    } finally {
      setIsForgotLoading(false);
    }
  };

  // ========== RENDER TABS ==========
  const renderLogin = () => (
    <form onSubmit={handleLogin}>
      <h2>🔐 Login</h2>
      <p className="subtitle">Silakan login untuk melanjutkan</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-container">
        <span className="input-icon">👤</span>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="input-container">
        <span className="input-icon">🔐</span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="forgot-password">
        <button 
          type="button"
          onClick={() => setActiveTab("forgot")}
          className="link-button"
        >
          Lupa Password?
        </button>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="auth-button"
      >
        {isLoading ? "⏳ Loading..." : "Login"}
      </button>

      <div className="register-link">
        Belum punya akun?{" "}
        <button 
          type="button"
          onClick={() => setActiveTab("register")}
          className="link-button"
        >
          Daftar Sekarang
        </button>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegister}>
      <h2>📝 Daftar Akun Baru</h2>
      <p className="subtitle">Isi data dengan benar untuk mendaftar</p>
      
      {registerError && <div className="error-message">{registerError}</div>}
      {registerSuccess && <div className="success-message">{registerSuccess}</div>}
      
      {debugInfo && (
        <div style={{
          background: '#f3f4f6',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          marginBottom: '15px',
          color: '#1e40af',
          wordBreak: 'break-all'
        }}>
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}
      
      <div className="input-container">
        <span className="input-icon">👤</span>
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={registerData.name}
          onChange={handleRegisterChange}
          required
          disabled={isRegisterLoading}
          style={validationErrors.name ? { borderColor: '#ef4444' } : {}}
        />
        {validationErrors.name && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
            {validationErrors.name}
          </small>
        )}
      </div>

      <div className="input-container">
        <span className="input-icon">👤</span>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={registerData.username}
          onChange={handleRegisterChange}
          required
          disabled={isRegisterLoading}
          style={validationErrors.username ? { borderColor: '#ef4444' } : {}}
        />
        {validationErrors.username && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
            {validationErrors.username}
          </small>
        )}
      </div>

      <div className="input-container">
        <span className="input-icon">📧</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleRegisterChange}
          required
          disabled={isRegisterLoading}
          style={validationErrors.email ? { borderColor: '#ef4444' } : {}}
        />
        {validationErrors.email && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
            {validationErrors.email}
          </small>
        )}
      </div>

      <div className="input-container">
        <span className="input-icon">🔐</span>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={handleRegisterChange}
          required
          disabled={isRegisterLoading}
          style={validationErrors.password ? { borderColor: '#ef4444' } : {}}
        />
        {validationErrors.password && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
            {validationErrors.password}
          </small>
        )}
      </div>

      <div className="input-container">
        <span className="input-icon">✓</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          value={registerData.confirmPassword}
          onChange={handleRegisterChange}
          required
          disabled={isRegisterLoading}
          style={validationErrors.confirmPassword ? { borderColor: '#ef4444' } : {}}
        />
        {validationErrors.confirmPassword && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
            {validationErrors.confirmPassword}
          </small>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isRegisterLoading}
        className="auth-button"
      >
        {isRegisterLoading ? "⏳ Mendaftarkan..." : "Daftar"}
      </button>

      <div className="auth-link">
        Sudah punya akun?{" "}
        <button 
          type="button"
          onClick={() => setActiveTab("login")}
          className="link-button"
        >
          Login
        </button>
      </div>
    </form>
  );

  const renderForgot = () => (
    <>
      <h2>🔑 Lupa Password</h2>
      
      <form onSubmit={handleRequestReset}>
        <p className="subtitle">Masukkan email Anda untuk mereset password</p>
        
        {forgotError && <div className="error-message">{forgotError}</div>}
        {forgotSuccess && <div className="success-message">{forgotSuccess}</div>}
        
        {debugInfo && (
          <div style={{
            background: '#f3f4f6',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            marginBottom: '15px',
            color: '#1e40af',
            wordBreak: 'break-all'
          }}>
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}
        
        <div className="input-container">
          <span className="input-icon">📧</span>
          <input
            type="email"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            disabled={isForgotLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isForgotLoading}
          className="auth-button"
        >
          {isForgotLoading ? "⏳ Mengirim..." : "Kirim Reset Link"}
        </button>

        <div className="auth-link" style={{ marginTop: "20px" }}>
          <button 
            type="button"
            onClick={() => {
              setActiveTab("login");
              setForgotError("");
              setForgotSuccess("");
              setDebugInfo("");
              setForgotEmail("");
            }}
            className="link-button"
          >
            ← Kembali ke Login
          </button>
        </div>
      </form>
    </>
  );
    
  return (
    <div className="login-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === "success" ? "✅" : "ℹ️"}
            </div>
            <div className="toast-message">
              {toast.message}
            </div>
            <button className="toast-close" onClick={handleCloseToast}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="bubble"
          style={{
            left: bubble.left,
            fontSize: bubble.fontSize,
            animationDuration: bubble.animationDuration,
            opacity: bubble.opacity
          }}
        >
          {bubble.emoji}
        </span>
      ))}
      
      <div className="auth-form">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
          <button
            className={`tab-button ${activeTab === "forgot" ? "active" : ""}`}
            onClick={() => setActiveTab("forgot")}
          >
            Lupa Password
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="tab-content">
          {activeTab === "login" && renderLogin()}
          {activeTab === "register" && renderRegister()}
          {activeTab === "forgot" && renderForgot()}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;