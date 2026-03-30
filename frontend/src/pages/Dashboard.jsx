import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import SideMenu from "../Components/SideMenu";


function DashboardPage({ setIsLogin }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  
  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk checkout & pembayaran
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([
    // Virtual Account
    { id: "bca", name: "BCA Virtual Account", icon: "🏦", category: "Virtual Account", processingTime: "Instan", adminFee: 4000 },
    { id: "mandiri", name: "Mandiri Virtual Account", icon: "🏦", category: "Virtual Account", processingTime: "Instan", adminFee: 4000 },
    { id: "bri", name: "BRI Virtual Account", icon: "🏦", category: "Virtual Account", processingTime: "Instan", adminFee: 4000 },
    { id: "bni", name: "BNI Virtual Account", icon: "🏦", category: "Virtual Account", processingTime: "Instan", adminFee: 4000 },
    
    // E-Wallet
    { id: "gopay", name: "GoPay", icon: "📱", category: "E-Wallet", processingTime: "Instan", adminFee: 2000 },
    { id: "ovo", name: "OVO", icon: "📱", category: "E-Wallet", processingTime: "Instan", adminFee: 2000 },
    { id: "dana", name: "DANA", icon: "📱", category: "E-Wallet", processingTime: "Instan", adminFee: 2000 },
    { id: "linkaja", name: "LinkAja", icon: "📱", category: "E-Wallet", processingTime: "Instan", adminFee: 2000 },
    { id: "shopeepay", name: "ShopeePay", icon: "📱", category: "E-Wallet", processingTime: "Instan", adminFee: 2000 },
    
    // Retail
    { id: "alfamart", name: "Alfamart", icon: "🏪", category: "Retail", processingTime: "1x24 Jam", adminFee: 5000 },
    { id: "indomaret", name: "Indomaret", icon: "🏪", category: "Retail", processingTime: "1x24 Jam", adminFee: 5000 },
    
    // Kartu Kredit
    { id: "kartu_kredit", name: "Kartu Kredit", icon: "💳", category: "Kartu Kredit", processingTime: "Instan", adminFee: 6500 },
    
    // Tunai (Hanya untuk Cashier)
    { id: "tunai", name: "Tunai", icon: "💵", category: "Tunai", processingTime: "Instan", adminFee: 0, forRole: "cashier" },
    { id: "debit", name: "Kartu Debit", icon: "💳", category: "Debit", processingTime: "Instan", adminFee: 0, forRole: "cashier" }
  ]);
 
  // State untuk struk
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // State untuk riwayat transaksi
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // State untuk mode cashier (melayani customer)
  const [cashierMode, setCashierMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const API_BASE_URL = "http://localhost:3000";

  // Cek role user
  const isAdmin = user?.role === "admin";
  const isCashier = user?.role === "cashier";
  const isCustomer = !isAdmin && !isCashier;

  // Load transaction history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("transactionHistory");
    if (savedHistory) {
      setTransactionHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save transaction history to localStorage
  useEffect(() => {
    if (transactionHistory.length > 0) {
      localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));
    }
  }, [transactionHistory]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      const productsRes = await axios.get(`${API_BASE_URL}/products`, config);
      const categoriesRes = await axios.get(`${API_BASE_URL}/categories`, config);

      const formattedCategories = categoriesRes.data.map(item => ({
        id: item.id_category,
        name: item.name,
        icon: getCategoryIcon(item.name)
      }));

      setCategories([
        { id: 0, name: "Semua", icon: "📦" },
        ...formattedCategories
      ]);

      const formattedProducts = productsRes.data.map((item) => {
        let categoryName = "Umum";
        if (item.category_id) {
          const foundCategory = categoriesRes.data.find(c => c.id_category === item.category_id);
          if (foundCategory) {
            categoryName = foundCategory.name;
          }
        }

        const imageUrl = item.image_url || 'https://via.placeholder.com/200x200?text=No+Image';

        return {
          id: item.id_product,
          name: item.name,
          price: parseFloat(item.price) || 0,
          category: categoryName,
          category_id: item.category_id,
          rating: 4.5,
          stock: parseInt(item.stock) || 0,
          description: item.description || "",
          image_url: imageUrl
        };
      });

      setProducts(formattedProducts);

    } catch (error) {
      console.error("Error fetching data:", error);
      
      if (error.response) {
        setError(`Error ${error.response.status}: ${error.response.data.message || 'Gagal ambil data'}`);
      } else if (error.request) {
        setError("Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:3000");
      } else {
        setError("Terjadi kesalahan: " + error.message);
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
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
    return iconMap[categoryName] || '📦';
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setIsLogin(false);
    navigate("/login");
  };

  // Fungsi untuk Customer (bisa beli)
  const handleBuy = (productId, productName) => {
    if (isAdmin) {
      alert("⚠️ Admin tidak dapat membeli produk. Gunakan akun customer untuk berbelanja.");
      return;
    }

    if (isCashier && !cashierMode) {
      alert("⚠️ Cashier harus mengaktifkan Mode Kasir terlebih dahulu!");
      return;
    }

    const productToBuy = products.find(p => p.id === productId);
    
    if (productToBuy.stock <= 0) {
      alert(`❌ Maaf, ${productName} sedang habis!`);
      return;
    }

    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock - 1 };
      }
      return product;
    });

    setProducts(updatedProducts);

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { 
        id: productId, 
        name: productName, 
        price: productToBuy.price,
        quantity: 1 
      }]);
    }

    alert(`✅ ${productName} berhasil ditambahkan ke keranjang! Stok tersisa: ${productToBuy.stock - 1}`);
  };

  const handleRemoveFromCart = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock + cartItem.quantity };
      }
      return product;
    });
    setProducts(updatedProducts);

    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    if (isAdmin) {
      alert("⚠️ Admin tidak dapat melakukan checkout.");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja masih kosong!");
      return;
    }
    
    setShowCart(false);
    setShowCheckoutModal(true);
    setSelectedPayment("");
  };

  // Fungsi untuk Cashier (melayani customer)
  const handleCashierCheckout = () => {
    if (!customerName) {
      alert("❌ Harap isi nama customer!");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja masih kosong!");
      return;
    }
    
    setShowCart(false);
    setShowCheckoutModal(true);
    setSelectedPayment("");
  };

  const processPayment = () => {
    if (!selectedPayment) {
      alert("❌ Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }

    const paymentMethod = paymentMethods.find(m => m.id === selectedPayment);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.11; // PPN 11%
    const adminFee = paymentMethod.adminFee || 0;
    const shippingCost = total > 500000 ? 0 : 15000; // Gratis ongkir min belanja 500rb
    const grandTotal = total + tax + shippingCost + adminFee;
    
    // Generate nomor invoice
    const invoiceNumber = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Generate nomor virtual account / payment code
    let paymentCode = "";
    if (paymentMethod.category === "Virtual Account") {
      paymentCode = `880${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    } else if (paymentMethod.category === "E-Wallet") {
      paymentCode = `0812${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    } else if (paymentMethod.category === "Retail") {
      paymentCode = `${paymentMethod.id === 'alfamart' ? 'AL' : 'IM'}${Date.now().toString().slice(-10)}`;
    } else if (paymentMethod.category === "Tunai" || paymentMethod.category === "Debit") {
      paymentCode = "CASH-" + Date.now().toString().slice(-8);
    } else {
      paymentCode = `4111-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
    
    // Data struk
    const receipt = {
      invoiceNumber: invoiceNumber,
      date: new Date().toLocaleString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      customer: isCashier ? customerName : (user ? user.name || user.username : 'Guest'),
      customerPhone: isCashier ? customerPhone : "-",
      membership: user?.membership || 'Regular',
      items: [...cart],
      subtotal: total,
      tax: tax,
      adminFee: adminFee,
      shippingCost: shippingCost,
      total: grandTotal,
      paymentMethod: paymentMethod.name,
      paymentCategory: paymentMethod.category,
      paymentIcon: paymentMethod.icon,
      paymentCode: paymentCode,
      paymentStatus: "LUNAS",
      transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cashier: isCashier ? (user?.name || "Cashier") : "Online System",
      storeAddress: "Jl. Teknologi No. 123, Jakarta",
      storePhone: "(021) 1234-5678",
      processedBy: isCashier ? "Cashier (Offline)" : "Customer (Online)"
    };
    
    setReceiptData(receipt);
    
    // Simpan ke riwayat transaksi
    setTransactionHistory(prev => [receipt, ...prev]);
    
    setShowCheckoutModal(false);
    setShowReceipt(true);
    
    // Kosongkan keranjang setelah checkout berhasil
    setCart([]);
    
    // Reset cashier mode
    if (isCashier) {
      setCustomerName("");
      setCustomerPhone("");
      setCashierMode(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  const printReceipt = () => {
    const printContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pembayaran - Toko Elektronik Digital</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px; 
              max-width: 400px; 
              margin: 0 auto;
              background: #fff;
            }
            .receipt { 
              border: 2px dashed #333; 
              padding: 20px;
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .store-name { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            .invoice-info { 
              margin: 15px 0; 
              padding: 10px 0; 
              border-top: 1px dashed #333; 
              border-bottom: 1px dashed #333;
              font-size: 12px;
            }
            .item { 
              display: flex; 
              justify-content: space-between; 
              margin: 5px 0;
              font-size: 12px;
            }
            .item-detail {
              display: grid;
              grid-template-columns: 2fr 1fr 1fr;
              gap: 5px;
              margin: 3px 0;
            }
            .total-section { 
              margin-top: 15px; 
              padding-top: 10px; 
              border-top: 2px dashed #333; 
              font-weight: bold;
            }
            .payment-info { 
              margin-top: 15px; 
              padding: 10px; 
              background: #f5f5f5;
              border-radius: 5px;
              font-size: 12px;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px; 
              font-size: 11px;
              border-top: 1px dashed #333;
              padding-top: 15px;
            }
            .thankyou { 
              text-align: center; 
              margin-top: 15px; 
              font-size: 14px;
              font-weight: bold;
              color: #2c3e50;
            }
            .code {
              font-size: 16px;
              font-weight: bold;
              letter-spacing: 2px;
              text-align: center;
              background: #fff;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #333;
            }
            .label {
              color: #666;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Fungsi untuk Admin (manajemen produk) - HANYA ADMIN
  const [showProductManagement, setShowProductManagement] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: "",
    description: "",
    image_url: ""
  });

  const handleAddProduct = async () => {
    if (!isAdmin) {
      alert("Akses ditolak. Hanya admin yang dapat menambah produk.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Produk berhasil ditambahkan!");
      setNewProduct({
        name: "",
        price: "",
        category_id: "",
        stock: "",
        description: "",
        image_url: ""
      });
      fetchProductsAndCategories();
    } catch (error) {
      alert("❌ Gagal menambah produk: " + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    if (!isAdmin) {
      alert("Akses ditolak. Hanya admin yang dapat mengupdate produk.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/products/${editingProduct.id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Produk berhasil diupdate!");
      setEditingProduct(null);
      fetchProductsAndCategories();
    } catch (error) {
      alert("❌ Gagal mengupdate produk: " + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!isAdmin) {
      alert("Akses ditolak. Hanya admin yang dapat menghapus produk.");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Produk berhasil dihapus!");
      fetchProductsAndCategories();
    } catch (error) {
      alert("❌ Gagal menghapus produk: " + error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "Semua" || product.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price) => {
    return `Rp ${Math.round(price).toLocaleString('id-ID')}`;
  };

  // Filter metode pembayaran berdasarkan role
  const getAvailablePaymentMethods = () => {
    if (isCashier) {
      // Cashier melihat semua metode + metode tunai
      return paymentMethods;
    } else {
      // Customer hanya melihat metode non-cashier
      return paymentMethods.filter(method => !method.forRole || method.forRole !== "cashier");
    }
  };

  // Group payment methods by category
  const groupedPayments = getAvailablePaymentMethods().reduce((groups, method) => {
    if (!groups[method.category]) {
      groups[method.category] = [];
    }
    groups[method.category].push(method);
    return groups;
  }, {});

  return (
    <div className="dashboard-container">
      <SideMenu />

      {/* HEADER */}
       <div className="dashboard-header" style={{ marginLeft: '60px' }}> 
        <div>
          <h1>
            🛍️ Toko Elektronik Digital
            {isAdmin && (
              <span style={{
                fontSize: '14px',
                background: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                marginLeft: '15px',
                verticalAlign: 'middle'
              }}>
                👑 Administrator
              </span>
            )}
            {isCashier && (
              <span style={{
                fontSize: '14px',
                background: '#f59e0b',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                marginLeft: '15px',
                verticalAlign: 'middle'
              }}>
                🛎️ Cashier
              </span>
            )}
          </h1>
          <p>
            {isAdmin && "Panel Administrasi - Kelola Produk"}
            {isCashier && "Mode Kasir - Melayani Pembelian Customer"}
            {isCustomer && "Jelajahi produk elektronik terbaik"}
          </p>
          {user && (
            <p style={{ fontSize: '14px', color: '#3b82f6', marginTop: '5px' }}>
              👋 Selamat datang, {user.name || user.username}
              {user.role && <span> ({user.role})</span>}
              {user.membership && isCustomer && <span> - {user.membership} Member</span>}
            </p>
          )}
        </div>
        
        {/* SEARCH BAR - Untuk semua user */}
        <div className="search-container" style={{ 
          flex: 1, 
          maxWidth: '400px', 
          margin: '0 20px',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '50px',
            padding: '5px 15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <span style={{ marginRight: '10px', color: '#9ca3af' }}>🔍</span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                padding: '10px 5px',
                border: 'none',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '5px'
                }}
              >
                ✕
              </button>
            )}
          </div>
          
          {searchQuery && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '15px',
              marginTop: '5px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              Menampilkan {filteredProducts.length} hasil
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Tombol Manajemen Produk - HANYA UNTUK ADMIN */}
          {isAdmin && (
            <button 
              onClick={() => setShowProductManagement(!showProductManagement)}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px'
              }}
            >
              ⚙️ Kelola Produk
            </button>
          )}
          
          {/* Tombol Mode Cashier - Hanya untuk Cashier (untuk melayani) */}
          {isCashier && (
            <button 
              onClick={() => setCashierMode(!cashierMode)}
              style={{
                background: cashierMode ? '#10b981' : '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px'
              }}
            >
              {cashierMode ? '✅ Sedang Melayani' : '🛎️ Mulai Melayani'}
            </button>
          )}
          
          {/* Tombol Riwayat Transaksi - UNTUK SEMUA USER (tapi kontennya beda) */}
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px'
            }}
          >
            📋 Riwayat Transaksi
            {isCashier && transactionHistory.filter(t => t.processedBy === "Cashier (Offline)").length > 0 && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                marginLeft: '5px'
              }}>
                {transactionHistory.filter(t => t.processedBy === "Cashier (Offline)").length}
              </span>
            )}
          </button>
          
          {/* Tombol Keranjang - Untuk Customer dan Cashier (saat mode kasir) */}
          {(isCustomer || (isCashier && cashierMode)) && (
            <button 
              onClick={() => setShowCart(!showCart)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                position: 'relative'
              }}
            >
              🛒 Keranjang
              {cartItemCount > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '12px',
                  marginLeft: '5px'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
          
          <button onClick={handleLogout} className="logout-btn">🔓 Logout</button>
        </div>
      </div>

      {/* Cashier Mode Banner */}
      {isCashier && cashierMode && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '15px 20px',
          margin: '10px 20px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>🛎️</span>
            <strong>Mode Kasir Aktif</strong> - Anda sedang melayani customer offline
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nama Customer *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                border: 'none',
                width: '200px'
              }}
              required
            />
            <input
              type="text"
              placeholder="No. Telepon (opsional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                border: 'none',
                width: '150px'
              }}
            />
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '15px',
          borderRadius: '10px',
          margin: '20px',
          textAlign: 'center',
          border: '1px solid #fecaca'
        }}>
          <strong>❌ Error:</strong> {error}
          <br />
          <small>Pastikan backend berjalan di http://localhost:3000</small>
        </div>
      )}

      {/* PRODUCT MANAGEMENT MODAL - HANYA UNTUK ADMIN */}
      {showProductManagement && isAdmin && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e40af', margin: 0 }}>⚙️ Kelola Produk</h2>
            <button 
              onClick={() => setShowProductManagement(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Form Tambah Produk */}
          <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>➕ Tambah Produk Baru</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <input
                type="text"
                placeholder="Nama Produk"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
              />
              <input
                type="number"
                placeholder="Harga"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
              />
              <select
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
              >
                <option value="">Pilih Kategori</option>
                {categories.filter(c => c.id !== 0).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Stok"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
              />
              <textarea
                placeholder="Deskripsi"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb', minHeight: '80px' }}
              />
              <input
                type="text"
                placeholder="URL Gambar"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
              />
              <button
                onClick={handleAddProduct}
                style={{
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Tambah Produk
              </button>
            </div>
          </div>

          {/* Daftar Produk untuk Admin */}
          <h3 style={{ margin: '20px 0 10px 0' }}>📦 Daftar Produk</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {products.map(product => (
              <div key={product.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '5px',
                marginBottom: '5px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Stok: {product.stock}</div>
                </div>
                <div>
                  <button
                    onClick={() => setEditingProduct(product)}
                    style={{
                      padding: '5px 10px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      marginRight: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      padding: '5px 10px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY MODAL - UNTUK SEMUA USER (tapi kontennya beda) */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '700px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e40af', margin: 0 }}>
              {isAdmin ? '📋 Semua Transaksi' : 
               isCashier ? '📋 Riwayat Transaksi (Yang Saya Layani)' : 
               '📋 Riwayat Transaksi Saya'}
            </h2>
            <button 
              onClick={() => setShowHistory(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Filter & Info */}
          <div style={{
            background: '#f3f4f6',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {isCashier && "Menampilkan transaksi yang Anda layani"}
              {isAdmin && `Total Semua Transaksi: ${transactionHistory.length}`}
              {isCustomer && `Total Transaksi Anda: ${transactionHistory.filter(t => t.customer === (user?.name || user?.username)).length}`}
            </span>
            {isCashier && (
              <span style={{ background: '#f59e0b', color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px' }}>
                🛎️ Cashier Mode
              </span>
            )}
          </div>

          {transactionHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <p>Belum ada riwayat transaksi</p>
            </div>
          ) : (
            // Filter transaksi berdasarkan role
            transactionHistory
              .filter(trans => {
                if (isAdmin) return true; // Admin lihat semua
                if (isCashier) return trans.processedBy === "Cashier (Offline)"; // Cashier lihat yang dilayani saja
                return trans.customer === (user?.name || user?.username); // Customer lihat transaksinya sendiri
              })
              .map((trans, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px',
                  background: '#f9fafb',
                  position: 'relative'
                }}>
                  {trans.processedBy === "Cashier (Offline)" && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '10px',
                      background: '#f59e0b',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}>
                      🛎️ Dilayani Kasir
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>{trans.invoiceNumber}</span>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>{trans.paymentStatus}</span>
                  </div>
                  
                  <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '5px' }}>
                    {trans.date}
                  </div>
                  
                  {/* Admin melihat semua detail */}
                  {isAdmin && (
                    <>
                      <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                        👤 Customer: <strong>{trans.customer}</strong>
                      </div>
                      <div style={{ fontSize: '12px', marginBottom: '5px', color: '#f59e0b' }}>
                        🛎️ Dilayani oleh: {trans.cashier}
                      </div>
                    </>
                  )}
                  
                  {/* Cashier melihat customer yang dilayani */}
                  {isCashier && (
                    <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                      👤 Customer: <strong>{trans.customer}</strong>
                      {trans.customerPhone !== "-" && (
                        <span style={{ marginLeft: '10px', color: '#6b7280' }}>
                          📞 {trans.customerPhone}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Customer hanya melihat transaksinya sendiri (tanpa info cashier) */}
                  
                  {/* Daftar item yang dibeli (ringkasan) */}
                  <div style={{
                    background: 'white',
                    padding: '8px',
                    borderRadius: '5px',
                    marginTop: '8px',
                    fontSize: '12px'
                  }}>
                    {trans.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #ccc',
                    fontWeight: 'bold'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#3b82f6' }}>{formatPrice(trans.total)}</span>
                  </div>
                  
                  {/* Metode pembayaran */}
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#6b7280', 
                    marginTop: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>{trans.paymentIcon}</span>
                    <span>{trans.paymentMethod}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* CART MODAL - Untuk Customer dan Cashier (saat mode kasir) */}
      {(isCustomer || (isCashier && cashierMode)) && showCart && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e40af', margin: 0 }}>
              {isCashier ? '🛒 Keranjang Customer' : '🛒 Keranjang Belanja'}
            </h2>
            <button 
              onClick={() => setShowCart(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
              <p>Keranjang belanja masih kosong</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  borderBottom: '1px solid #e5e7eb',
                  gap: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        ({formatPrice(item.price)} x {item.quantity})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕ Hapus
                  </button>
                </div>
              ))}

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f3f4f6',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: '#3b82f6' }}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                  *Belum termasuk pajak & biaya pengiriman
                </div>
              </div>

              <button
                onClick={isCashier ? handleCashierCheckout : handleCheckout}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: '20px',
                  background: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                {isCashier ? '✅ Proses Pembayaran Customer' : '✅ Lanjut ke Pembayaran'}
              </button>
            </>
          )}
        </div>
      )}

      {/* CHECKOUT MODAL - PAYMENT METHODS */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1001,
          maxWidth: '700px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e40af', margin: 0 }}>💳 Pilih Metode Pembayaran</h2>
            <button 
              onClick={() => setShowCheckoutModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Ringkasan Belanja */}
          <div style={{
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🛍️ Ringkasan Belanja</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            
            {/* Estimasi Biaya */}
            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '10px', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', color: '#6b7280' }}>
                <span>PPN 11%:</span>
                <span>{formatPrice(cartTotal * 0.11)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', color: '#6b7280' }}>
                <span>Biaya Kirim:</span>
                <span>{cartTotal > 500000 ? 'Gratis' : formatPrice(15000)}</span>
              </div>
              {selectedPayment && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', color: '#6b7280' }}>
                  <span>Biaya Admin:</span>
                  <span>{formatPrice(paymentMethods.find(m => m.id === selectedPayment)?.adminFee || 0)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginTop: '5px', borderTop: '1px solid #e2e8f0', paddingTop: '5px' }}>
                <span>Estimasi Total:</span>
                <span style={{ color: '#3b82f6' }}>
                  {formatPrice(
                    cartTotal + 
                    (cartTotal * 0.11) + 
                    (cartTotal > 500000 ? 0 : 15000) + 
                    (paymentMethods.find(m => m.id === selectedPayment)?.adminFee || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods by Category */}
          {Object.entries(groupedPayments).map(([category, methods]) => (
            <div key={category} style={{ marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#374151' }}>
                {category === 'Virtual Account' && '🏦'}
                {category === 'E-Wallet' && '📱'}
                {category === 'Retail' && '🏪'}
                {category === 'Kartu Kredit' && '💳'}
                {category === 'Tunai' && '💵'}
                {category === 'Debit' && '💳'}
                {' '}{category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {methods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    style={{
                      border: `2px solid ${selectedPayment === method.id ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      padding: '15px 12px',
                      cursor: 'pointer',
                      background: selectedPayment === method.id ? '#eff6ff' : 'white',
                      transition: 'all 0.2s',
                      position: 'relative',
                      boxShadow: selectedPayment === method.id ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>{method.icon}</div>
                    <div style={{ 
                      fontWeight: selectedPayment === method.id ? 'bold' : 'normal',
                      fontSize: '13px',
                      textAlign: 'center',
                      marginBottom: '4px'
                    }}>
                      {method.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6b7280',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span>⏱️ {method.processingTime}</span>
                      <span>💰 {formatPrice(method.adminFee)}</span>
                    </div>
                    {method.forRole === "cashier" && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-8px',
                        background: '#f59e0b',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '10px'
                      }}>
                        🛎️ Kasir
                      </div>
                    )}
                    {selectedPayment === method.id && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tombol Proses Pembayaran */}
          <button
            onClick={processPayment}
            style={{
              width: '100%',
              padding: '16px',
              background: selectedPayment ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: selectedPayment ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '10px',
              transition: 'all 0.2s'
            }}
            disabled={!selectedPayment}
          >
            {selectedPayment 
              ? `✅ Proses Pembayaran dengan ${paymentMethods.find(m => m.id === selectedPayment)?.name}`
              : '⚠️ Pilih Metode Pembayaran'
            }
          </button>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceipt && receiptData && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1002,
          maxWidth: '500px',
          width: '95%',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}>
          {/* Tombol Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button 
              onClick={closeReceipt}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Konten Struk */}
          <div id="receipt-content">
            <div className="receipt" style={{
              fontFamily: "'Courier New', monospace",
              padding: '20px',
              border: '2px dashed #333',
              borderRadius: '8px',
              background: '#fff'
            }}>
              {/* Header */}
              <div className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🛍️</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  TOKO ELEKTRONIK DIGITAL
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                  {receiptData.storeAddress}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  Telp: {receiptData.storePhone}
                </div>
              </div>

              {/* Info Invoice */}
              <div className="invoice-info" style={{
                borderTop: '1px dashed #333',
                borderBottom: '1px dashed #333',
                padding: '12px 0',
                marginBottom: '15px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="label">No. Invoice:</span>
                  <span style={{ fontWeight: 'bold' }}>{receiptData.invoiceNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="label">Tanggal:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="label">Kasir:</span>
                  <span>{receiptData.cashier}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="label">Pelanggan:</span>
                  <span>{receiptData.customer}</span>
                </div>
                {receiptData.customerPhone !== "-" && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="label">No. Telp:</span>
                    <span>{receiptData.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Daftar Item */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr 1fr',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  padding: '5px 0',
                  borderBottom: '2px solid #333',
                  marginBottom: '5px'
                }}>
                  <span>Item</span>
                  <span style={{ textAlign: 'center' }}>Qty</span>
                  <span style={{ textAlign: 'right' }}>Harga</span>
                </div>
                
                {receiptData.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    fontSize: '11px',
                    padding: '4px 0',
                    borderBottom: '1px dotted #ccc'
                  }}>
                    <span>{item.name}</span>
                    <span style={{ textAlign: 'center' }}>{item.quantity}</span>
                    <span style={{ textAlign: 'right' }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Ringkasan Pembayaran */}
              <div className="total-section" style={{
                borderTop: '2px dashed #333',
                paddingTop: '12px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(receiptData.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>PPN 11%:</span>
                  <span>{formatPrice(receiptData.tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Biaya Admin:</span>
                  <span>{formatPrice(receiptData.adminFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Biaya Kirim:</span>
                  <span>{receiptData.shippingCost === 0 ? 'Gratis' : formatPrice(receiptData.shippingCost)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderTop: '2px solid #333',
                  marginTop: '8px',
                  paddingTop: '8px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ color: '#3b82f6' }}>{formatPrice(receiptData.total)}</span>
                </div>
              </div>

              {/* Kode Pembayaran */}
              <div className="code" style={{
                background: '#f3f4f6',
                padding: '12px',
                marginTop: '15px',
                textAlign: 'center',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {receiptData.paymentCategory === "Virtual Account" && "🏦 Virtual Account:"}
                {receiptData.paymentCategory === "E-Wallet" && "📱 Nomor E-Wallet:"}
                {receiptData.paymentCategory === "Retail" && "🏪 Kode Bayar:"}
                {receiptData.paymentCategory === "Kartu Kredit" && "💳 Kartu Kredit:"}
                {receiptData.paymentCategory === "Tunai" && "💵 Pembayaran Tunai:"}
                {receiptData.paymentCategory === "Debit" && "💳 Kartu Debit:"}
                <br />
                <span style={{ fontSize: '18px', letterSpacing: '2px' }}>
                  {receiptData.paymentCode}
                </span>
              </div>

              {/* Info Pembayaran */}
              <div className="payment-info" style={{
                marginTop: '15px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '5px',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{receiptData.paymentIcon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{receiptData.paymentMethod}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{receiptData.paymentCategory}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <div>
                    <div className="label">Status:</div>
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>{receiptData.paymentStatus}</div>
                  </div>
                  <div>
                    <div className="label">ID Transaksi:</div>
                    <div style={{ fontSize: '10px' }}>{receiptData.transactionId}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="footer" style={{
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '10px',
                borderTop: '1px dashed #333',
                paddingTop: '12px'
              }}>
                <div className="thankyou" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Terima kasih telah berbelanja!
                </div>
                <div>Barang yang sudah dibeli tidak dapat dikembalikan</div>
                <div style={{ marginTop: '8px', color: '#666' }}>
                  *Struk ini merupakan bukti pembayaran yang sah
                </div>
                <div style={{ marginTop: '8px', fontSize: '9px', color: '#999' }}>
                  Diproses oleh: {receiptData.processedBy}
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={printReceipt}
              style={{
                flex: 2,
                padding: '12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              🖨️ Cetak Struk
            </button>
            <button
              onClick={closeReceipt}
              style={{
                flex: 1,
                padding: '12px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER - Untuk semua user */}
      <div className="category-filter">
        <h2>📋 Kategori Produk</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT SECTION */}
      <div className="product-section">
        <div className="section-header">
          <h2>
            {selectedCategory === "Semua" ? "📦 Semua Produk" : `${getCategoryIcon(selectedCategory)} ${selectedCategory}`}
            <span className="product-count"> ({filteredProducts.length} produk)</span>
            {searchQuery && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'normal',
                color: '#6b7280',
                marginLeft: '10px'
              }}>
                (hasil pencarian: "{searchQuery}")
              </span>
            )}
          </h2>
        </div>

        {/* PRODUCT LIST */}
        <div className="product-list">
          {loading ? (
            <div className="loading">
              <div className="spinner">⏳</div>
              <p>Memuat produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>
                {searchQuery 
                  ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                  : "Tidak ada produk dalam kategori ini"
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  style={{
                    marginTop: '10px',
                    padding: '8px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Hapus Pencarian
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                    }}
                  />
                </div>

                <div className="product-info">
                  <h3>
                    {item.name}
                    {searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <span style={{ 
                        fontSize: '11px', 
                        background: '#fef3c7', 
                        color: '#d97706',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        marginLeft: '8px'
                      }}>
                        🔍 Cocok
                      </span>
                    )}
                  </h3>
                  <div className="product-meta">
                    <span className="category-badge">{item.category}</span>
                    <div className="rating">
                      {"★".repeat(Math.floor(item.rating))}
                      {"☆".repeat(5 - Math.floor(item.rating))}
                      <span className="rating-number">({item.rating})</span>
                    </div>
                  </div>
                  <p className="price">{formatPrice(item.price)}</p>
                  
                  <div className={`stock-badge ${item.stock === 0 ? 'habis' : item.stock > 10 ? 'banyak' : 'sedikit'}`}>
                    Stok: {item.stock} {item.stock === 0 && '❌ Habis'}
                  </div>
                  {item.description && (
                    <p className="product-description" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {item.description.length > 50 
                        ? item.description.substring(0, 50) + '...' 
                        : item.description
                      }
                    </p>
                  )}
                </div>

                {/* Tombol Beli - Untuk Customer dan Cashier (saat mode kasir) */}
                {(isCustomer || (isCashier && cashierMode)) && (
                  <button 
                    onClick={() => handleBuy(item.id, item.name)}
                    className="buy-btn"
                    disabled={item.stock === 0}
                  >
                    🛒 {item.stock === 0 ? 'Stok Habis' : 'Beli'}
                  </button>
                )}
                
                {/* Untuk Cashier yang belum aktif mode kasir */}
                {isCashier && !cashierMode && (
                  <div style={{
                    padding: '8px',
                    background: '#fef3c7',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#d97706',
                    marginTop: '10px'
                  }}>
                    🛎️ Aktifkan Mode Kasir untuk melayani
                  </div>
                )}
                
                {/* Untuk Admin - hanya bisa lihat */}
                {isAdmin && (
                  <div style={{
                    padding: '8px',
                    background: '#f3f4f6',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '10px'
                  }}>
                    👑 Mode Admin (Manajemen Produk)
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* EDIT PRODUCT MODAL - HANYA UNTUK ADMIN */}
      {editingProduct && isAdmin && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1100,
          maxWidth: '500px',
          width: '90%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e40af', margin: 0 }}>✏️ Edit Produk</h2>
            <button 
              onClick={() => setEditingProduct(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nama Produk"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
            />
            <input
              type="number"
              placeholder="Harga"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
            />
            <select
              value={editingProduct.category_id}
              onChange={(e) => setEditingProduct({...editingProduct, category_id: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
            >
              <option value="">Pilih Kategori</option>
              {categories.filter(c => c.id !== 0).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stok"
              value={editingProduct.stock}
              onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
            />
            <textarea
              placeholder="Deskripsi"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb', minHeight: '80px' }}
            />
            <input
              type="text"
              placeholder="URL Gambar"
              value={editingProduct.image_url}
              onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
            />
            <button
              onClick={handleUpdateProduct}
              style={{
                padding: '12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Update Produk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;