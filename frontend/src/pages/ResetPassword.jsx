import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (token) {
      console.log("Token dari URL:", token);
      setDebugInfo(`Token: ${token}`);
    } else {
      setError("Token reset password tidak ditemukan");
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token: token,
        newPassword: newPassword
      });

      setSuccess(response.data.message);
      
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      console.error("Reset error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Gagal mereset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-form">
        <h2>🔑 Reset Password</h2>
        
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

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="input-container">
            <span className="input-icon">🔐</span>
            <input
              type="password"
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-container">
            <span className="input-icon">✓</span>
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="auth-button"
          >
            {isLoading ? "⏳ Mereset..." : "Reset Password"}
          </button>

          <div className="auth-link" style={{ marginTop: "20px" }}>
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="link-button"
            >
              ← Kembali ke Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;