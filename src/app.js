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

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/auth-service', {
  //mongodb://root:example@mongodb:27017/auth-service?authSource=admin
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB for Auth Service'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));

