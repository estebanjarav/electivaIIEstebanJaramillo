const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const app = express();
require('dotenv').config();

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api/auth', userRoutes);

// MongoDB Connection (solo si no está en modo test)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL || 'mongodb://root:example@mongodb:27017/auth-service?authSource=admin', {
    // Ya no es necesario usar estos parámetros con la versión 4.0.0 del driver
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB for Auth Service'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3005;
  app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
}

module.exports = app;


