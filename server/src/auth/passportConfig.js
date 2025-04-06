const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const argon2 = require('argon2');
const pool = require('../database/database');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE login = $1 AND is_deleted = false',
        [username]
      );
      const user = result.rows[0];
      
      if (!user) {
        return done(null, false, { message: 'Пользователь не найден' });
      }

      const valid = await argon2.verify(user.password_hash, password);
      if (!valid) {
        return done(null, false, { message: 'Неверный пароль' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
