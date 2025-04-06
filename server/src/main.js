require('dotenv').config({path: "../../.env"})
const express = require('express')
const session = require('express-session');
const passport = require('./auth/passportConfig');
const pool = require("./database/database");

const app = express()
app.use(express.json())

const cors = require('cors');
app.use(cors());

app.use(session({
    secret: 'supersecretkey', 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


const orgRoutes = require('./routes/orgRoutes');
const posRoutes = require('./routes/posRoutes');
const deptRoutes = require('./routes/deptRoutes');
const empRoutes = require('./routes/empRoutes');
const hrOpRoutes = require('./routes/hrOpRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use('/api/orgs', orgRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/emp', empRoutes);
app.use('/api/hrOp', hrOpRoutes);
app.use('/api/file', fileRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = 3000
const HOST = process.env.POSTGRES_HOST 
app.listen(PORT, () => console.log(`Сервер работает на ${HOST}: ${PORT}`))