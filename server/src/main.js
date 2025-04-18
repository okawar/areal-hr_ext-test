require('dotenv').config({ path: '../../.env' });
const express = require('express');
const pool = require('./database/database');
const pgmigrate = require('node-pg-migrate');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const orgRoutes = require('./routes/orgRoutes');
const posRoutes = require('./routes/posRoutes');
const deptRoutes = require('./routes/deptRoutes');
const empRoutes = require('./routes/empRoutes');
const hrOpRoutes = require('./routes/hrOpRoutes');
const fileRoutes = require('./routes/fileRoutes');
const changeHistoryRoutes = require('./routes/changeHistoryRoutes');

app.use('/api/orgs', orgRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/emp', empRoutes);
app.use('/api/hrOp', hrOpRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/changeHistory', changeHistoryRoutes);

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_URL;

const startServer = async () => {
  try {
    if (process.env.RUN_MIGRATIONS === 'true') {
      await pgmigrate.default({
        databaseUrl: require('../pg-migrate-config').databaseUrl,
        dir: require('../pg-migrate-config').dir,
        migrationsTable: 'pgmigrations',
        direction: 'up',
        log: console.log,
        noLock: true,
      });
      console.log('✅ Миграции выполнены');
    } else {
      console.log('⚠️ Пропуск выполнения миграций');
    }

    app.listen(PORT, () => {
      console.log(`✅ Сервер работает на ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Ошибка при запуске миграций:', err);
    process.exit(1);
  }
};

startServer();
