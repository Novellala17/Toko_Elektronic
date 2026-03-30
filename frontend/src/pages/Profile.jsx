import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/SideMenu.css";


function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Novella Alfaromecha",
    username: "novella",
    email: "novella@email.com",
    phone: "0812-3456-7890",
    address: "Jl. Teknologi No. 123, Jakarta",
    memberSince: "Januari 2026",
    membership: "Gold Member",
    totalOrders: 24,
    totalSpent: "Rp 8.450.000"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...userData});

  useEffect(() => {
    // Ambil data user dari localStorage jika ada
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        username: user.username || prev.username,
        email: user.email || prev.email
      }));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({...userData});
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // Simpan ke localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({
      ...user,
      name: editedData.name,
      email: editedData.email
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({...userData});
  };

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-container">
      <SideMenu />
      
      <div className="profile-content">
        <div className="profile-header">
          <h1>Profile Saya</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div className="profile-grid">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {userData.name.charAt(0)}
            </div>
            <h2>{userData.name}</h2>
            <p className="profile-username">@{userData.username}</p>
            <div className="membership-badge">
              {userData.membership}
            </div>
          </div>

          {/* Info Section */}
          <div className="profile-info-section">
            {isEditing ? (
              // Mode Edit
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>No. Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Alamat</label>
                  <textarea
                    name="address"
                    value={editedData.address}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={handleSave}>
                    💾 Simpan
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    ✕ Batal
                  </button>
                </div>
              </div>
            ) : (
              // Mode View
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Nama Lengkap</span>
                  <span className="detail-value">{userData.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">@{userData.username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{userData.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">No. Telepon</span>
                  <span className="detail-value">{userData.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Alamat</span>
                  <span className="detail-value">{userData.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Sejak</span>
                  <span className="detail-value">{userData.memberSince}</span>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <span className="stat-value">{userData.totalOrders}</span>
                  <span className="stat-label">Total Pesanan</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <span className="stat-value">{userData.totalSpent}</span>
                  <span className="stat-label">Total Belanja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;