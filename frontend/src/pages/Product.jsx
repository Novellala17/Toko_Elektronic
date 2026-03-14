// src/pages/Product.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";

function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Logika tambah ke keranjang
    alert(`✅ ${product.name} ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">⏳</div>
        <p>Memuat produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Produk tidak ditemukan</h2>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Kembali
      </button>
      
      <div className="product-detail">
        <div className="product-image">
          <div className="product-icon-large">
            {getCategoryIcon(product.category)}
          </div>
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-meta">
            <span className="category-badge">{product.category}</span>
            <div className="rating">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
              <span className="rating-number">({product.rating})</span>
            </div>
          </div>
          
          <p className="product-price">Rp {product.price.toLocaleString()}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="stock-info">
            Stok: <span className={product.stock > 0 ? "in-stock" : "out-stock"}>
              {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
            </span>
          </div>
          
          <div className="quantity-selector">
            <label>Jumlah:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >-</button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >+</button>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={product.stock === 0}
            >
              🛒 Tambah ke Keranjang
            </button>
            <button 
              onClick={handleBuyNow}
              className="buy-now-btn"
              disabled={product.stock === 0}
            >
              ⚡ Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fungsi helper untuk icon kategori
const getCategoryIcon = (category) => {
  const icons = {
    'Laptop': '💻',
    'Smartphone': '📱',
    'Wearable': '⌚',
    'Aksesoris': '⌨️',
    'Televisi': '📺',
    'Peralatan Rumah': '🏠',
    'Kamera': '📷',
    'Drone': '🚁',
    'Audio': '🎧'
  };
  return icons[category] || '📦';
};

export default ProductPage;