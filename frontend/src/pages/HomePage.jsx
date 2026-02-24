import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="home-header">
        <h1>Selamat Datang di Toko Elektronik</h1>
        <p>Temukan produk elektronik terbaru dengan kualitas terbaik dan harga terjangkau untuk kebutuhan sehari-hari Anda</p>
      </div>

      {/* Call to Action */}
      <div className="home-cta">
        <Link to="/dashboard">
          <button>
            Lihat Produk Sekarang
          </button>
        </Link>
      </div>

      {/* Info Cards Section */}
      <div className="home-info">
        <div className="info-card">
          <h3>Kualitas Premium</h3>
          <p>Produk dengan standar kualitas tinggi dan garansi resmi</p>
        </div>
        
        <div className="info-card">
          <h3>Harga Terjangkau</h3>
          <p>Harga kompetitif dengan promo menarik setiap minggu</p>
        </div>
        
        <div className="info-card">
          <h3>Layanan Profesional</h3>
          <p>Tim customer service siap membantu 24/7</p>
        </div>
        
        <div className="info-card">
          <h3>Pengiriman Cepat</h3>
          <p>Gratis ongkir untuk pembelian di atas Rp 500.000</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;