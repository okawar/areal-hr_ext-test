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
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(
  session({
    secret: 'секрет',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,      
      httpOnly: true,
      sameSite: 'lax',    
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

app.use('/api/users/for-history', userRoutes);

app.use('/api/users', requireRole('admin'), userRoutes);

const PORT = process.env.VITE_APP_PORT_SERVER || 3000;
const HOST = process.env.APP_URL;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`✅ Сервер работает на ${HOST}:${PORT}`);
  });
};

startServer();
