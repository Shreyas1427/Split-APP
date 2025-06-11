const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenseRoutes');
const settlementRoutes = require('./routes/settlementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/settlement', settlementRoutes);
app.use('/api/v1/analytics', analyticsRoutes);  // Make sure this is present

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;
