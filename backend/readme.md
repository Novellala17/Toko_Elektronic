# 🛍️ Elektronik API
API backend untuk sistem toko elektronik dengan fitur autentikasi, manajemen produk, kategori, transaksi, dan item transaksi.  
Dibangun menggunakan **Node.js**, **Express**, **PostgreSQL**, **JWT Authentication**, dan didokumentasikan dengan **Swagger (OpenAPI)**.

---

## 📌 Fitur Utama

### 🔐 **1. Authentication (Auth)**
- Register User  
- Login (mengembalikan Access Token + Refresh Token)  
- Get Profile (JWT Protected)  
- Refresh Token  
- Logout  
- Deactivate User (Admin Only)

---

### 📦 **2. Product **
- Get semua produk  
- Get produk berdasarkan ID  
- Tambah produk (Admin Only)  
- Update produk  
- Delete produk (Admin Only)

---

### 🗂️ **3. Category Module**
- Get all categories  
- Update category (Admin Only)  
- Create category (Admin Only)  
- Delete category (Admin Only)

---

### 💳 **4. Transactions**
- Get all transactions (Admin & Cashier)  
- Get transaction by ID  
- Create transaction  
- Update transaction  
- Delete transaction

---

### 🧾 **5. Transaction Items**
- Get semua item transaksi  
- Get item berdasarkan ID transaksi  
- Add item ke transaksi  
- Update item  
- Delete item

---

---

## 🛠️ **Teknologi yang Digunakan**
| Teknologi | Keterangan |
|----------|------------|
| Node.js | Backend runtime |
| Express.js | HTTP Framework |
| PostgreSQL | Database utama |
| bcrypt | Hash password |
| JWT | Autentikasi Token |
| Swagger (OpenAPI) | Dokumentasi API |
| pg (node-postgres) | Client PostgreSQL |

---

## 📁 **Project Structure**

