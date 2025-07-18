const express = require('express');
const router = express.Router();
const sharedTaskController = require('../controllers/sharedTaskController');
const auth = require('../middlewares/auth');

router.post('/:id/share', auth, sharedTaskController.shareTask);
router.get('/shared', auth, sharedTaskController.getSharedTasks);
router.put('/shared/:id', auth, sharedTaskController.updateSharedTask);
router.delete('/shared/:id', auth, sharedTaskController.removeSharedTask);

module.exports = router;