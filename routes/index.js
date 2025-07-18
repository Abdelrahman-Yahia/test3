const express = require('express');
const router = express.Router();

// Import all route files
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const sharedTaskRoutes = require('./sharedTaskRoutes');
const commentRoutes = require('./commentRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/tasks', sharedTaskRoutes);
router.use('/tasks', commentRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;