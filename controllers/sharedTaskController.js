const { Task, User, SharedTask, Notification } = require('../models');

exports.shareTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already shared
    const existingShare = await SharedTask.findOne({
      where: { taskId: task.id, userId: user.id }
    });

    if (existingShare) {
      return res.status(400).json({ error: 'Task already shared with this user' });
    }

    const sharedTask = await SharedTask.create({
      taskId: task.id,
      userId: user.id,
      permission: req.body.permission || 'view'
    });

    // Create notification for the shared user
    await Notification.create({
      userId: user.id,
      taskId: task.id,
      message: `${req.user.username} shared a task with you: "${task.title}"`
    });

    res.json({
      message: 'Task shared successfully',
      sharedTask
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSharedTasks = async (req, res) => {
  try {
    const sharedTasks = await SharedTask.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Task,
          include: [
            { 
              model: User,
              attributes: ['id', 'username', 'email']
            }
          ]
        }
      ]
    });

    res.json(sharedTasks.map(st => st.Task));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSharedTask = async (req, res) => {
  try {
    const sharedTask = await SharedTask.findByPk(req.params.id);
    if (!sharedTask) {
      return res.status(404).json({ error: 'Shared task not found' });
    }

    // Only the task owner can update sharing permissions
    const task = await Task.findByPk(sharedTask.taskId);
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedSharedTask = await sharedTask.update({
      permission: req.body.permission
    });

    res.json(updatedSharedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeSharedTask = async (req, res) => {
  try {
    const sharedTask = await SharedTask.findByPk(req.params.id);
    if (!sharedTask) {
      return res.status(404).json({ error: 'Shared task not found' });
    }

    // Only the task owner or the shared user can remove
    const task = await Task.findByPk(sharedTask.taskId);
    if (task.userId !== req.user.id && sharedTask.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await sharedTask.destroy();
    res.json({ message: 'Shared task access removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};