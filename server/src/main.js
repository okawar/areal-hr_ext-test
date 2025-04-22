require('dotenv').config({ path: '../../.env' });
const express = require('express');
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
const userRoutes = require('./routes/userRoutes');

app.use('/api/orgs', orgRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/emp', empRoutes);
app.use('/api/hrOp', hrOpRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/changeHistory', changeHistoryRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_URL;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`✅ Сервер работает на ${HOST}:${PORT}`);
  });
};

startServer();
