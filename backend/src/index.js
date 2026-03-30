require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// ✅ Ambil URL dari environment
const BASE_URL = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${port}`;

app.use(express.json());

// ✅ CORS dengan URL Vercel yang BENAR
app.use(cors({
  origin: [
    'https://toko-elektronic.vercel.app',     // ✅ URL Vercel kamu yang asli
    'https://toko-elektronic-git-main-novellala17s-projects.vercel.app',
    'https://toko-elektronic-rgkwv0z43-novellala17s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Toko Elektronik API',
    version: '1.0.0',
    description: 'API untuk tugas akhir Rekayasa Perangkat Lunak - Toko Elektronik',
  },
  servers: [
    { 
      url: BASE_URL,
      description: 'Production server' 
    },
    { 
      url: `http://localhost:${port}`, 
      description: 'Local server (development)' 
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  apis: [__dirname + '/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/transactions', require('./routes/transactions'));
app.use('/transaction-items', require('./routes/transaction_items'));
app.use('/categories', require('./routes/categories'));
app.use('/users', require('./routes/users'));
app.use('/customer', require('./routes/customer'));

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di Toko Elektronik Kami!!!',
    backend: BASE_URL,
    docs: `${BASE_URL}/docs`,
    health: `${BASE_URL}/health`,
    endpoints: {
      auth: '/auth',
      products: '/products',
      transactions: '/transactions',
      categories: '/categories'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Jalankan server
app.listen(port, '0.0.0.0', () => {
  console.log(`💻 Server berjalan di: ${BASE_URL}`);
  console.log(`✅ Swagger: ${BASE_URL}/docs`);
  console.log(`✅ Health check: ${BASE_URL}/health`);
  console.log('🛒⚡Selamat datang di Toko Elektronik Kami!!! 🛒⚡');
});