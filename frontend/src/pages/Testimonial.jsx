import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Testimonial.css';

const Testimonial = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek apakah user login
    const isLogin = localStorage.getItem("isLogin") === "true";
    const userData = localStorage.getItem("user");
    
    if (!isLogin) {
      navigate("/login");
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchTestimonials();
  }, [navigate]);

  const fetchTestimonials = async () => {
    try {
      // Simulasi loading
      setTimeout(() => {
        const dummyData = [
          {
            id: 1,
            name: "Budi Santoso",
            username: "budi_s",
            avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff&size=100",
            rating: 5,
            comment: "Pelayanan sangat baik, barang sampai tepat waktu dan sesuai pesanan. Recommended!",
            date: "2024-01-15",
            product: "Smart TV 43 Inch",
            likes: 24,
            verified: true
          },
          {
            id: 2,
            name: "Siti Rahayu",
            username: "siti_r",
            avatar: "https://ui-avatars.com/api/?name=Siti+Rahayu&background=10b981&color=fff&size=100",
            rating: 5,
            comment: "Kualitas produk bagus, harga terjangkau. Pengiriman cepat. Semoga next belanja dapat diskon lebih besar!",
            date: "2024-01-10",
            product: "Kulkas 2 Pintu",
            likes: 18,
            verified: true
          },
          {
            id: 3,
            name: "Ahmad Hidayat",
            username: "ahmad_h",
            avatar: "https://ui-avatars.com/api/?name=Ahmad+Hidayat&background=f59e0b&color=fff&size=100",
            rating: 5,
            comment: "Toko elektronik terbaik di kota! Sudah belanja 3 kali, selalu puas dengan pelayanannya. Barang original semua!",
            date: "2024-01-05",
            product: "Mesin Cuci Front Loading",
            likes: 32,
            verified: true
          }
        ];
        setTestimonials(dummyData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const handleWriteTestimonial = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menulis testimonial!");
      navigate("/login");
      return;
    }
    alert("Fitur tulis testimonial akan segera hadir! 🚀");
  };

  if (loading) {
    return (
      <div className="testimonial-loading">
        <div className="spinner"></div>
        <p>Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="testimonial-container">
      <div className="testimonial-header">
        <h1>✨ Testimonial Pelanggan</h1>
        <p>Apa kata mereka tentang Toko Elektronik kami?</p>
      </div>

      {/* Stats Section */}
      <div className="testimonial-stats">
        <div className="stat-item">
          <div className="stat-icon">⭐</div>
          <h3>4.8</h3>
          <p>Rating Rata-rata</p>
          <small>Total Votes: 1000+</small>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <h3>500+</h3>
          <p>Pelanggan Puas</p>
          <small>Rating 5/5</small>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <h3>98%</h3>
          <p>Ulasan 5 Bintang</p>
          <small>Rating 3/5</small>
        </div>
      </div>

      {/* Testimonial Grid */}
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header-card">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h3>{testimonial.name}</h3>
                <p className="testimonial-username">@{testimonial.username}</p>
                {testimonial.verified && (
                  <span className="verified-badge">✓ Verified Purchase</span>
                )}
              </div>
            </div>
            
            <div className="testimonial-product">
              <span className="product-tag">{testimonial.product}</span>
            </div>
            
            <div className="testimonial-rating">
              {renderStars(testimonial.rating)}
            </div>
            
            <p className="testimonial-comment">"{testimonial.comment}"</p>
            
            <div className="testimonial-footer">
              <p className="testimonial-date">
                {new Date(testimonial.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <div className="testimonial-likes">
                <span className="like-icon">❤️</span>
                <span>{testimonial.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="testimonial-cta">
        <h2>Punya pengalaman berbelanja?</h2>
        <p>Bagikan cerita kamu dan bantu orang lain memilih produk terbaik!</p>
        <button 
          className="btn-testimonial"
          onClick={handleWriteTestimonial}
        >
          ✍️ Tulis Testimonial
        </button>
      </div>
    </div>
  );
};

export default Testimonial;