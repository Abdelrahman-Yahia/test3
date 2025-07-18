const express = require('express');
const app = express();
const routes = require('./routes');

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(require('./middlewares/errorHandler'));

module.exports = app;