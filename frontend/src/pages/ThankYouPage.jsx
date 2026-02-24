import { Link } from "react-router-dom";
import "./ThankYouPage.css";

function ThankYouPage() {
  return (
    <div className="thankyou-container">
      {/* Animasi Checkout Sukses */}
      <div className="success-animation">
        <div className="checkmark-circle">
          <div className="checkmark-stem"></div>
          <div className="checkmark-kick"></div>
        </div>
      </div>

      {/* Pesan Terima Kasih */}
      <div className="thankyou-header">
        <h1>Terima Kasih!</h1>
        <h2>Pesanan Anda Berhasil Diproses</h2>
        <p className="thankyou-message">
          Kami telah menerima pesanan Anda dan akan segera memprosesnya. 
          Email konfirmasi telah dikirim ke alamat email Anda.
        </p>
      </div>

      {/* Info Pesanan */}
      <div className="order-info">
        <div className="info-row">
          <span className="info-label">Nomor Pesanan:</span>
          <span className="info-value">#INV-2024-001234</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tanggal Pesanan:</span>
          <span className="info-value">{new Date().toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total Pembayaran:</span>
          <span className="info-value total">Rp 2.549.000</span>
        </div>
      </div>

      {/* Ringkasan Pesanan (Contoh) */}
      <div className="order-summary">
        <h3>Ringkasan Pesanan</h3>
        
        <div className="order-item">
          <img src="https://via.placeholder.com/60" alt="Produk" className="item-image" />
          <div className="item-details">
            <h4>Smart TV LED 43 Inch</h4>
            <p>1 x Rp 2.499.000</p>
          </div>
        </div>

        <div className="order-total">
          <div className="total-row">
            <span>Subtotal</span>
            <span>Rp 2.499.000</span>
          </div>
          <div className="total-row">
            <span>Ongkos Kirim</span>
            <span>Rp 50.000</span>
          </div>
          <div className="total-row grand-total">
            <span>Total</span>
            <span>Rp 2.549.000</span>
          </div>
        </div>
      </div>

      {/* Informasi Pengiriman */}
      <div className="shipping-info">
        <h3>Informasi Pengiriman</h3>
        <div className="info-card">
          <p><strong>Nama Penerima:</strong> Budi Santoso</p>
          <p><strong>Alamat:</strong> Jl. Merdeka No. 123, Jakarta Selatan</p>
          <p><strong>No. Telepon:</strong> 0812-3456-7890</p>
          <p><strong>Metode Pengiriman:</strong> JNE Regular (3-4 hari)</p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="thankyou-actions">
        <Link to="/">
          <button className="btn-home">
            ← Kembali ke Beranda
          </button>
        </Link>
        <Link to="/produk">
          <button className="btn-shop">
            Belanja Lagi 🛒
          </button>
        </Link>
      </div>

      {/* Footer Notes */}
      <div className="thankyou-footer">
        <p>Butuh bantuan? Hubungi customer service kami di <strong>cs@tokoelektronik.com</strong> atau <strong>0812-3456-7890</strong></p>
      </div>
    </div>
  );
}

export default ThankYouPage;