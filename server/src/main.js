require('dotenv').config({path: "../../.env"})
const express = require('express')
const pool = require("./database/database");

const app = express()
app.use(express.json())

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

const PORT = 3000
const HOST = process.env.APP_URL 
app.listen(PORT, () => console.log(`Сервер работает на ${HOST}`))