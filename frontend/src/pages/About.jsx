import { useNavigate } from "react-router-dom";
import SideMenu from "../Components/SideMenu";
import "../styles/About.css";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <SideMenu />
      
      <div className="about-content">
        <h1>Tentang Kami</h1>
        
        <div className="about-hero">
          <div className="about-icon">🛍️</div>
          <h2>Toko Elektronik Digital</h2>
          <p className="about-tagline">
            Solusi Elektronik Terpercaya untuk Kebutuhan Anda
          </p>
        </div>

        <div className="about-grid">
          {/* Sejarah */}
          <div className="about-card">
            <h3>📜 Sejarah Perusahaan</h3>
            <p>
              Toko Elektronik Digital didirikan pada tahun 2020 dengan visi 
              menjadi platform belanja elektronik terdepan di Indonesia. 
              Berawal dari toko kecil di Jakarta, kini kami telah melayani 
              ribuan pelanggan di seluruh Indonesia.
            </p>
          </div>

          {/* Visi */}
          <div className="about-card">
            <h3>🎯 Visi</h3>
            <p>
              Menjadi toko elektronik terpercaya dan terdepan di Indonesia 
              dengan menyediakan produk berkualitas, harga kompetitif, dan 
              layanan terbaik.
            </p>
          </div>

          {/* Misi */}
          <div className="about-card">
            <h3>🚀 Misi</h3>
            <ul>
              <li>Menyediakan produk elektronik original dengan garansi resmi</li>
              <li>Memberikan harga terbaik dan promo menarik</li>
              <li>Pelayanan customer service 24/7</li>
              <li>Pengiriman cepat ke seluruh Indonesia</li>
              <li>Kemudahan transaksi dengan berbagai metode pembayaran</li>
            </ul>
          </div>

          {/* Nilai-nilai */}
          <div className="about-card">
            <h3>💎 Nilai-nilai Kami</h3>
            <div className="values-grid">
              <div className="value-item">
                <span className="value-icon">🤝</span>
                <span>Integritas</span>
              </div>
              <div className="value-item">
                <span className="value-icon">⭐</span>
                <span>Kualitas</span>
              </div>
              <div className="value-item">
                <span className="value-icon">❤️</span>
                <span>Kepercayaan</span>
              </div>
              <div className="value-item">
                <span className="value-icon">🚀</span>
                <span>Inovasi</span>
              </div>
            </div>
          </div>
          {/* Tim */}
<div className="about-card team-card">
  <h3>👥 Tim Kami</h3>
    
    {/* Admin Team - Based on data */}
    <div className="team-member admin-member">
      <div className="member-avatar">👩‍💻</div>
      <h4>Novella Alfaromecha</h4>
      <p className="member-username">@lala</p>
      <p className="member-role">Admin</p>
      <span className="member-badge platinum">Platinum</span>
    </div>
    <div className="team-member admin-member">
      <div className="member-avatar">👨‍💻</div>
      <h4>Alexander Hendra</h4>
      <p className="member-username">@alex</p>
      <p className="member-role">Admin</p>
      <span className="member-badge gold">Gold</span>
    </div>
  </div>


          {/* Kontak */}
          <div className="about-card contact-card">
            <h3>📞 Kontak Kami</h3>
            <div className="contact-info">
              <p>
                <span className="contact-icon">📍</span>
                Jl. Teknologi No. 123, Jakarta
              </p>
              <p>
                <span className="contact-icon">📧</span>
                support@tokoelektronik.com
              </p>
              <p>
                <span className="contact-icon">📞</span>
                (021) 1234-5678
              </p>
              <p>
                <span className="contact-icon">💬</span>
                0812-3456-7890 (WhatsApp)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="about-footer">
          <p>© 2026 Toko Elektronik Digital. All rights reserved.</p>
          <p className="version">Versi 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;