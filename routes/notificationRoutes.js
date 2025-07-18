const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.get('/', auth, notificationController.getNotifications);
router.post('/mark-read', auth, notificationController.markNotificationsAsRead);

module.exports = router;