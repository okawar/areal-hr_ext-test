
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const seedOrganizations = require('./seedOrganizations');
const seedPositions = require('./seedPositions');
const seedDepartments = require('./seedDepartments');
const seedEmployees = require('./seedEmployees');
const seedUsers = require('./seedUsers');

async function seedAll() {
  console.log('🚀 Seeding test data...');
  await seedOrganizations();
  await seedPositions();
  await seedDepartments();
  await seedEmployees();
  await seedUsers();
  console.log('✅ All seeds executed');
}

if (require.main === module) {
  seedAll().then(() => process.exit());
}

console.log('Пароль:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);


module.exports = seedAll;
