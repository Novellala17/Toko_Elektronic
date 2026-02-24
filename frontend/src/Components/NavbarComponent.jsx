import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // IMPORT DARI FOLDER SAMA


function NavbarComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear semua data login
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect ke login
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🛒 Toko Elektronik</h2>

      <div className="nav-menu">
        <button onClick={() => navigate("/home")}>🏠 Home</button>
        <button onClick={() => navigate("/dashboard")}>📦 Dashboard</button>
        <button 
          onClick={handleLogout}
          style={{ background: "#ff6b6b", color: "white" }}
        >
          🚪 Logout
        </button>
      </div>
      
      {/* Tampilkan user info jika ada */}
      {localStorage.getItem("user") && (
        <div className="user-info">
          <span>👤 {JSON.parse(localStorage.getItem("user")).name}</span>
        </div>
      )}
    </nav>
  );
}

export default NavbarComponent;   