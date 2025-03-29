require('dotenv').config({path: "../../.env"})
const express = require('express')

const app = express()
app.use(express.json())


const orgRoutes = require('./routes/orgRoutes');
const posRoutes = require('./routes/posRoutes');
const deptRoutes = require('./routes/deptRoutes');

app.use('/api/orgs', orgRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api/pos', posRoutes);

const PORT = 3000
const HOST = process.env.POSTGRES_HOST 
app.listen(PORT, () => console.log(`Сервер работает на ${HOST}: ${PORT}`))