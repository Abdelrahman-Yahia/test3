const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserProfile);
router.put('/:id', auth, userController.updateUserProfile);

module.exports = router;