const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

router.get('/', auth, taskController.getUserTasks);
router.post('/', auth, taskController.createTask);
router.get('/:id', auth, taskController.getTaskDetails);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.put('/:id/status', auth, taskController.updateTaskStatus);

module.exports = router;