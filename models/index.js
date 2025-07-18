const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Create associations
const { User, Task, SharedTask, Comment, Notification } = db;

// User associations
User.hasMany(Task, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
User.belongsToMany(Task, {
  through: SharedTask,
  foreignKey: 'userId',
  as: 'sharedTasks'
});

// Task associations
Task.belongsTo(User, { foreignKey: 'userId' });
Task.hasMany(Comment, { foreignKey: 'taskId' });
Task.hasMany(Notification, { foreignKey: 'taskId' });
Task.belongsToMany(User, {
  through: SharedTask,
  foreignKey: 'taskId',
  as: 'sharedWith'
});

// SharedTask associations
SharedTask.belongsTo(Task, { foreignKey: 'taskId' });
SharedTask.belongsTo(User, { foreignKey: 'userId' });

// Comment associations
Comment.belongsTo(Task, { foreignKey: 'taskId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = db;