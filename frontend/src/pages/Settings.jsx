import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../Components/SideMenu";
import "../styles/Settings.css";

function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "pastel",
    language: "id",
    notifications: {
      all: true,
      email: false,
      push: true,
      sms: false
    },
    security: {
      twoFA: false,
      biometric: false
    },
    autoSave: true,
    privacy: {
      shareData: false,
      analytics: true
    }
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleNotificationChange = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type]
      }
    });
  };

  const handleSecurityChange = (type) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [type]: !settings.security[type]
      }
    });
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `user-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setIsExporting(false);
      alert('✅ Data berhasil diekspor!');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
      alert('Akun Anda akan dihapus dalam 30 hari. Cek email untuk konfirmasi.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="settings-container">
      <SideMenu />
      
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>
            <span className="header-icon">⚙️</span>
            Stelan / Pengaturan
          </h1>
          <p className="header-subtitle">Sesuaikan pengalaman Anda dengan preferensi pribadi</p>
        </div>
        <div className="header-actions">
          <button className="save-btn">
            <span>💾</span> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="settings-grid">
        {/* Tema Settings */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">🎨</span>
            <h2>Tema</h2>
          </div>
          <div className="card-content">
            <div className="theme-options">
              <button
                className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-preview light">
                  <div className="preview-bar"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Terang</span>
                {settings.theme === 'light' && <span className="checkmark">✓</span>}
              </button>
              
              <button
                className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-preview dark">
                  <div className="preview-bar"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Gelap</span>
                {settings.theme === 'dark' && <span className="checkmark">✓</span>}
              </button>
              
              <button
                className={`theme-option ${settings.theme === 'pastel' ? 'active' : ''}`}
                onClick={() => handleThemeChange('pastel')}
              >
                <div className="theme-preview pastel">
                  <div className="preview-bar"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Pastel</span>
                {settings.theme === 'pastel' && <span className="checkmark">✓</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Bahasa Settings */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">🌐</span>
            <h2>Bahasa</h2>
          </div>
          <div className="card-content">
            <div className="language-selector">
              <select 
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="language-select"
              >
                <option value="id">🇮🇩 Indonesia</option>
                <option value="en">🇬🇧 English</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>
            <p className="setting-note">*Perubahan bahasa akan diterapkan setelah refresh</p>
          </div>
        </div>

        {/* Notifikasi Settings */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">🔔</span>
            <h2>Notifikasi</h2>
          </div>
          <div className="card-content">
            <div className="toggle-list">
              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Aktifkan semua notifikasi</span>
                  <span className="toggle-desc">Terima semua notifikasi dari sistem</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.all}
                    onChange={() => handleNotificationChange('all')}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>

              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Notifikasi via Email</span>
                  <span className="toggle-desc">Dapatkan update melalui email</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    disabled={!settings.notifications.all}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>

              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Push Notifikasi</span>
                  <span className="toggle-desc">Notifikasi real-time di browser</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    disabled={!settings.notifications.all}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>

              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Notifikasi SMS</span>
                  <span className="toggle-desc">Peringatan penting via SMS</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                    disabled={!settings.notifications.all}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Keamanan Settings */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">🔒</span>
            <h2>Keamanan</h2>
          </div>
          <div className="card-content">
            <div className="toggle-list">
              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Two-Factor Authentication (2FA)</span>
                  <span className="toggle-desc">Lapisan keamanan tambahan untuk akun Anda</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.security.twoFA}
                    onChange={() => handleSecurityChange('twoFA')}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>

              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Biometric Login</span>
                  <span className="toggle-desc">Gunakan sidik jari atau face ID</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.security.biometric}
                    onChange={() => handleSecurityChange('biometric')}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
            
            {settings.security.twoFA && (
              <div className="setup-2fa">
                <button className="setup-btn">
                  <span>🔐</span> Setup 2FA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auto-save Settings */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">💾</span>
            <h2>Lainnya</h2>
          </div>
          <div className="card-content">
            <label className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Auto-save perubahan</span>
                <span className="toggle-desc">Simpan perubahan secara otomatis</span>
              </div>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.autoSave}
                  onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        </div>

        {/* Data & Privasi */}
        <div className="settings-card">
          <div className="card-header">
            <span className="card-icon">📊</span>
            <h2>Data & Privasi</h2>
          </div>
          <div className="card-content">
            <div className="data-actions">
              <button 
                className="data-btn export"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="spinner"></span>
                    Mengekspor...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Ekspor Data Saya
                  </>
                )}
              </button>
              
              <button 
                className="data-btn delete"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span>🗑️</span>
                Hapus Akun
              </button>
            </div>

            <div className="privacy-options">
              <label className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-title">Bagikan data penggunaan</span>
                  <span className="toggle-desc">Bantu kami meningkatkan layanan</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.shareData}
                    onChange={(e) => setSettings({
                      ...settings, 
                      privacy: {...settings.privacy, shareData: e.target.checked}
                    })}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">⚠️</span>
              <h3>Hapus Akun</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                Tindakan ini akan menghapus semua data Anda termasuk:
              </p>
              <ul className="delete-list">
                <li>📁 Semua file dan dokumen</li>
                <li>📊 Riwayat transaksi</li>
                <li>⚙️ Pengaturan pribadi</li>
                <li>👤 Profil dan data akun</li>
              </ul>
              <p className="confirm-text">
                Ketik <strong>HAPUS</strong> untuk konfirmasi:
              </p>
              <input 
                type="text" 
                className="confirm-input"
                placeholder="HAPUS"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Batal
              </button>
              <button className="delete-btn" onClick={handleDeleteAccount}>
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;