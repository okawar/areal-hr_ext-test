const path = require('path');
const envPath = path.resolve(__dirname, '../.env');

require('dotenv').config({ path: envPath });

console.log('Database URL:', `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);


module.exports = {
    databaseUrl: `postgres://${String(process.env.POSTGRES_USER)}:${String(process.env.POSTGRES_PASSWORD)}@${String(process.env.POSTGRES_HOST)}:${String(process.env.POSTGRES_PORT)}/${String(process.env.POSTGRES_DB)}`,
    migrationsTable: 'pgmigrations',
    dir: 'migrations',
  };
  

  // DATABASE_URL="postgres://postgres:agysaap38@localhost:5432/areal-hr_ext-test" npx node-pg-migrate up
