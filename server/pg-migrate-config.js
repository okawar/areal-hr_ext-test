const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  DATABASE_URL // если вдруг используешь
} = process.env;

const databaseUrl = DATABASE_URL || `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

console.log('Using database:', databaseUrl);

module.exports = {
  databaseUrl,
  migrationsTable: 'pgmigrations',
  dir: path.resolve(__dirname, '../migrations'), // абсолютный путь
};
