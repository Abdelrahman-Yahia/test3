const { Sequelize } = require('sequelize');
const config = require('../config/config');

module.exports.createDatabaseIfNotExists = async () => {
  const dbConfig = config.development;
  
  // Connect to the default postgres database
  const tempSequelize = new Sequelize({
    dialect: 'postgres',
    host: dbConfig.host,
    port: 5432,
    username: dbConfig.username,
    password: dbConfig.password,
    logging: false
  });
  
  try {
    // Check if database exists
    const [results] = await tempSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`
    );
    
    if (results.length === 0) {
      // Create database
      await tempSequelize.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`Database ${dbConfig.database} created`);
    }
  } catch (error) {
    console.error('Database creation error:', error.message);
  } finally {
    await tempSequelize.close();
  }
};