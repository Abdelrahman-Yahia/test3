const { Comment, Task } = require('../models');

exports.addComment = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or sharing
    const sharedTask = await SharedTask.findOne({
      where: { 
        taskId: task.id,
        userId: req.user.id
      }
    });

    if (task.userId !== req.user.id && !sharedTask) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      taskId: task.id,
      userId: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaskComments = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or sharing
    const sharedTask = await SharedTask.findOne({
      where: { 
        taskId: task.id,
        userId: req.user.id
      }
    });

    if (task.userId !== req.user.id && !sharedTask) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const comments = await Comment.findAll({
      where: { taskId: task.id },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};