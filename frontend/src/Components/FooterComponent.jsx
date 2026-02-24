import React, { useState } from "react";
import { Link } from "react-router-dom";

function FooterComponent() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini nanti bisa dikirim ke backend
    console.log("Kesan Pesan:", { name, message });
    
    // Tampilkan pesan sukses
    setIsSubmitted(true);
    
    // Reset form
    setName("");
    setMessage("");
    
    // Hilangkan pesan sukses setelah 3 detik
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <footer style={{
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "white",
      padding: "2.5rem 2rem 1rem 2rem",
      marginTop: "auto",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem"
      }}>
        
        {/* Column 1: Logo & Sosial Media */}
        <div>
          <h3 style={{ 
            fontSize: "1.5rem", 
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #93c5fd 0%, #dbeafe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            TokoElektronic
          </h3>
          <p style={{ color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            Toko elektronik terpercaya sejak 2024. Menyediakan produk berkualitas dengan harga terjangkau.
          </p>
          
          {/* SOCIAL MEDIA ICON KECIL */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(45deg, #f09433, #d62976, #962fbf, #4f5bd5)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              📷
            </a>
            
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: "#000000",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              🎵
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: "#1DA1F2",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              🐦
            </a>
            
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: "#1877F2",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              📘
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#93c5fd" }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "0.8rem" }}>
              <Link to="/home" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                🏠 Home
              </Link>
            </li>
            <li style={{ marginBottom: "0.8rem" }}>
              <Link to="/dashboard" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                📊 Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: "0.8rem" }}>
              <Link to="/products" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                🛒 Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#93c5fd" }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "0.8rem", color: "#cbd5e1" }}>
              📍 Jakarta, Indonesia
            </li>
            <li style={{ marginBottom: "0.8rem", color: "#cbd5e1" }}>
              📞 +62 831 4164 4142
            </li>
            <li style={{ marginBottom: "0.8rem", color: "#cbd5e1" }}>
              ✉️ lala@tokoelektronic.com
            </li>
          </ul>
        </div>

        {/* Column 4: KESAN PESAN FORM */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#93c5fd" }}>
            💬 Kesan & Pesan
          </h4>
          
          {isSubmitted && (
            <div style={{
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              color: "#d1fae5",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>
              ✅ Terima kasih! Kesan pesan Anda telah dikirim.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
            
            <textarea
              placeholder="Tulis kesan dan pesan Anda di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="3"
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "0.9rem",
                resize: "vertical",
                outline: "none"
              }}
            />
            
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.8rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Kirim Kesan & Pesan
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM BAR - Copyright */}
      <div style={{
        maxWidth: "1200px",
        margin: "2rem auto 0",
        paddingTop: "1.5rem",
        borderTop: "1px solid #4b5563",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          © 2024 Toko Elektronik Digital. All rights reserved.
        </p>
        
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            📷 lala@tokoelektronic
          </span>
          <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            🎵 lala@tokoelektronic
          </span>
          <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            🐦 lala@tokoelektronic
          </span>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;