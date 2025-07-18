const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

router.post('/:id/comments', auth, commentController.addComment);
router.get('/:id/comments', auth, commentController.getTaskComments);

module.exports = router;