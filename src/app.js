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

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL || 'mongodb://root:example@mongodb:27017/auth-service?authSource=admin', {
   
  })
    .then(() => console.log('Connected to MongoDB for Auth Service'))
    .catch((err) => console.error(err));
}
// MongoDB Connection
//mongoose.connect('mongodb://root:example@mongodb:27017/auth-service?authSource=admin', {
  //mongodb://root:example@mongodb:27017/auth-service?authSource=admin
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  //mongodb://localhost:27017/auth-service
//})
//  .then(() => console.log('Connected to MongoDB for Auth Service'))
//  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));

module.exports = app;


