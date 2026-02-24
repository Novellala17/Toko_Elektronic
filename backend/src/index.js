require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
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
    { url: `http://localhost:${port}`, description: 'Local server' }
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
  apis: [__dirname + '/routes/*.js'] // ✅ gunakan path absolut
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


app.get('/', (req, res) => {
  res.send("💻 <h2>Selamat datang di <b>Toko Elektronik Kami!!!</b></h2>");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Jalankan server
app.listen(port, () => {
  console.log(`💻 Server berjalan di: http://localhost:${port}`);
  console.log(`✅ Swagger telah berjalan di: http://localhost:${port}/docs`);
  console.log('🛒⚡Selamat datang di Toko Elektronik Kami!!! 🛒⚡');
});
