const { sequelize } = require('../models');
const { createDatabaseIfNotExists } = require('./utils');

module.exports = async () => {
  try {
    // Create database if not exists
    await createDatabaseIfNotExists();
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Add initial data if needed
    await seedInitialData();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

async function seedInitialData() {
  // Add admin user if not exists
  const { User } = sequelize.models;
  const adminEmail = 'admin@taskmanager.com';
  
  const adminExists = await User.findOne({ where: { email: adminEmail } });
  if (!adminExists) {
    const bcrypt = require('bcrypt');
    await User.create({
      username: 'admin',
      email: adminEmail,
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin'
    });
    console.log('Admin user created');
  }
}