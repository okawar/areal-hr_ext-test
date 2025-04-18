const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  DATABASE_URL,
} = process.env;

if (!POSTGRES_PASSWORD && !DATABASE_URL) {
  throw new Error('POSTGRES_PASSWORD or DATABASE_URL must be set in .env');
}

const databaseUrl =
  DATABASE_URL ||
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

console.log('Using database URL:', databaseUrl);

module.exports = {
  databaseUrl,
  migrationsTable: 'pgmigrations',
  dir: path.resolve(__dirname, './migrations'),
};
