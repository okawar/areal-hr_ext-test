const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { execSync } = require('child_process');


const args = process.argv.slice(2);
const command = args.join(' ') || 'up'; 

const requiredEnvVars = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Отсутствуют необходимые переменные среды:', missingVars.join(', '));
  console.error('Проверьте ваш файл .env');
  process.exit(1);
}

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

try {
  execSync(`node-pg-migrate ${command}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: connectionString,
    },
  });
} catch (error) {
  console.error('Миграция не удалась:', error);
  process.exit(1);
}
