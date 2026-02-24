require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Import semua router
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// Gunakan router di prefix /api
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Root endpoint
app.get('/', (req, res) => res.send('💻 API TOKO ELEKTRONIK READY'));

// Jalankan server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
module.exports = app;
