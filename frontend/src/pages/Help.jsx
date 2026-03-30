import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../Components/SideMenu";
import "../styles/Help.css";

function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Bagaimana cara berbelanja di Toko Elektronik?",
      answer: "Anda dapat berbelanja dengan masuk ke halaman Dashboard, pilih produk yang diinginkan, klik tombol Beli, lalu lanjut ke keranjang dan checkout."
    },
    {
      id: 2,
      question: "Apa saja metode pembayaran yang tersedia?",
      answer: "Kami menerima pembayaran melalui Virtual Account (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, LinkAja, ShopeePay), dan pembayaran di retail (Alfamart, Indomaret)."
    },
    {
      id: 3,
      question: "Berapa lama pengiriman barang?",
      answer: "Estimasi pengiriman 1-3 hari kerja untuk wilayah Jakarta dan sekitarnya, 3-7 hari kerja untuk luar pulau."
    },
    {
      id: 4,
      question: "Bagaimana jika barang rusak atau tidak sesuai?",
      answer: "Anda dapat mengajukan retur maksimal 7 hari setelah barang diterima. Hubungi customer service kami untuk proses lebih lanjut."
    },
    {
      id: 5,
      question: "Apakah ada biaya pengiriman?",
      answer: "Gratis ongkir untuk pembelian minimal Rp 500.000. Untuk pembelian di bawah itu, dikenakan biaya Rp 15.000."
    }
  ];

  const guides = [
    {
      title: "Cara Registrasi Akun",
      steps: [
        "Buka halaman Login",
        "Klik tab Register",
        "Isi nama lengkap, username, email, dan password",
        "Klik tombol Daftar",
        "Konfirmasi email (jika diperlukan)"
      ],
      icon: "📝"
    },
    {
      title: "Cara Melakukan Pemesanan",
      steps: [
        "Login ke akun Anda",
        "Pilih produk yang diinginkan",
        "Klik tombol Beli",
        "Cek keranjang belanja",
        "Lanjut ke checkout dan pilih metode pembayaran",
        "Selesaikan pembayaran"
      ],
      icon: "🛒"
    },
    {
      title: "Cara Melacak Pesanan",
      steps: [
        "Login ke akun Anda",
        "Klik menu Riwayat Transaksi",
        "Cari invoice pesanan Anda",
        "Lihat status pengiriman",
        "Hubungi customer service jika ada kendala"
      ],
      icon: "📦"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-container">
      <SideMenu />
      
      <div className="help-content">
        <h1>Pusat Bantuan</h1>
        <p className="help-subtitle">Ada yang bisa kami bantu?</p>

        {/* Search */}
        <div className="help-search">
          <input
            type="text"
            placeholder="Cari pertanyaan atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Quick Guides */}
        <div className="quick-guides">
          <h2>📚 Panduan Cepat</h2>
          <div className="guides-grid">
            {guides.map((guide, index) => (
              <div key={index} className="guide-card">
                <div className="guide-icon">{guide.icon}</div>
                <h3>{guide.title}</h3>
                <ol className="guide-steps">
                  {guide.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>❓ Pertanyaan yang Sering Diajukan</h2>
          <div className="faq-list">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${activeFaq === faq.id ? 'active' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {activeFaq === faq.id ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === faq.id && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="help-contact">
          <h2>📞 Butuh Bantuan Lebih Lanjut?</h2>
          <div className="contact-options">
            <div className="contact-option">
              <div className="contact-icon-large">💬</div>
              <h3>Live Chat</h3>
              <p>Senin - Jumat, 08.00 - 20.00</p>
              <button className="contact-btn">Mulai Chat</button>
            </div>
            <div className="contact-option">
              <div className="contact-icon-large">📧</div>
              <h3>Email</h3>
              <p>support@tokoelektronik.com</p>
              <button className="contact-btn">Kirim Email</button>
            </div>
            <div className="contact-option">
              <div className="contact-icon-large">📞</div>
              <h3>Telepon</h3>
              <p>(021) 1234-5678</p>
              <button className="contact-btn">Hubungi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;