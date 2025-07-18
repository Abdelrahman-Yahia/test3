const { Task, User, SharedTask, Notification } = require('../models');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    
    // Create due date notification
    if (task.dueDate) {
      await Notification.create({
        userId: req.user.id,
        taskId: task.id,
        message: `Task "${task.title}" is due soon!`
      });
    }
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'sharedWith',
          attributes: ['id', 'username', 'email'],
          through: { attributes: ['permission'] }
        }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskDetails = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'sharedWith',
          attributes: ['id', 'username', 'email'],
          through: { attributes: ['permission'] }
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or sharing
    if (task.userId !== req.user.id && !task.sharedWith.some(u => u.id === req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedTask = await task.update(req.body);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or sharing with edit permission
    const sharedTask = await SharedTask.findOne({
      where: { 
        taskId: task.id,
        userId: req.user.id,
        permission: 'edit'
      }
    });

    if (task.userId !== req.user.id && !sharedTask) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedTask = await task.update({ status: req.body.status });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};