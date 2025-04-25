require('dotenv').config({ path: '../../.env' });
const express = require('express');

const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./middleware/auth/passport-config');
const { requireRole } = require('./middleware/auth/auth');

initializePassport(passport);
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const orgRoutes = require('./routes/orgRoutes');
const posRoutes = require('./routes/posRoutes');
const deptRoutes = require('./routes/deptRoutes');
const empRoutes = require('./routes/empRoutes');
const hrOpRoutes = require('./routes/hrOpRoutes');
const fileRoutes = require('./routes/fileRoutes');
const changeHistoryRoutes = require('./routes/changeHistoryRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/orgs', orgRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/emp', empRoutes);
app.use('/api/hrOp', hrOpRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/changeHistory', changeHistoryRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/users', requireRole('admin'), userRoutes);

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_URL;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`✅ Сервер работает на ${HOST}:${PORT}`);
  });
};

startServer();
