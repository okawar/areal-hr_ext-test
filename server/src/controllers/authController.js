const passport = require('passport');
const { loginSchema } = require('../validation/auth.schema');

const login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Ошибка валидации', details: error.details[0].message });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info.message || 'Ошибка аутентификации' });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Успешный вход', user });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Вы вышли из системы' });
  });
};

const me = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Не аутентифицирован' });
  }
};

module.exports = {
  login,
  logout,
  me,
};
