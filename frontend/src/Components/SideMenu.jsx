// SideMenu.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideMenu.css"; 

function SideMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data user dari localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || userData.username || "Andi Pratama";
  const userEmail = userData.email || "novella@email.com";

  // Set active item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("home")) setActiveItem("home");
    else if (path.includes("dashboard")) setActiveItem("dashboard");
    else if (path.includes("profile")) setActiveItem("profile");
    else if (path.includes("settings")) setActiveItem("settings");
    else if (path.includes("about")) setActiveItem("about");
    else if (path.includes("help")) setActiveItem("help");
    else setActiveItem("home");
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.side-menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleNavigation = (path, item) => {
    setActiveItem(item);
    setShowMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="side-menu-container">
      <button 
        className="side-menu-button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Menu"
      >
        ☰
      </button>

      {showMenu && (
        <div className="side-menu-dropdown">
          {/* Profile Section dengan background gradient */}
          <div className="side-menu-profile">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <div className="profile-name">{userName}</div>
              <div className="profile-email">{userEmail}</div>
            </div>
          </div>

          {/* Menu Items dengan icon yang lebih menarik */}
          <div className="side-menu-items">
            <button 
              className={`side-menu-item ${activeItem === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigation('/home', 'home')}
            >
              <span className="menu-icon">🏠</span>
              <span>Home</span>
            </button>

            <button 
              className={`side-menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('/dashboard', 'dashboard')}
            >
              <span className="menu-icon">📊</span>
              <span>Dashboard</span>
            </button>

            <div className="menu-divider"></div>

            <button 
              className={`side-menu-item ${activeItem === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavigation('/profile', 'profile')}
            >
              <span className="menu-icon">👤</span>
              <span>Profile</span>
            </button>

            <button 
              className={`side-menu-item ${activeItem === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavigation('/settings', 'settings')}
            >
              <span className="menu-icon">⚙️</span>
              <span>Stelan</span>
            </button>

            <button 
              className={`side-menu-item ${activeItem === 'about' ? 'active' : ''}`}
              onClick={() => handleNavigation('/about', 'about')}
            >
              <span className="menu-icon">ℹ️</span>
              <span>Tentang Kami</span>
            </button>

            <button 
              className={`side-menu-item ${activeItem === 'help' ? 'active' : ''}`}
              onClick={() => handleNavigation('/help', 'help')}
            >
              <span className="menu-icon">❓</span>
              <span>Bantuan</span>
            </button>

            <div className="menu-divider"></div>

            <button 
              className="side-menu-item logout"
              onClick={handleLogout}
            >
              <span className="menu-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>

          {/* Footer dengan versi */}
          <div className="side-menu-footer">
            <div>✨ Toko Elektronik Digital</div>
            <div>📦 Versi 1.0.0</div>
            <div>© 2026 All Rights Reserved</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideMenu;