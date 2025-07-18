require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const initDatabase = require('./database/init');

const PORT = process.env.PORT || 3000;

// Initialize and sync database
initDatabase().then(() => {
  // Start server after DB sync
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});