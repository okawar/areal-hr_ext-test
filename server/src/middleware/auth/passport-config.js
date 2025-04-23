const LocalStrategy = require('passport-local').Strategy;
const pool = require('../../database/database');
const argon2 = require('argon2');

function initialize(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1 AND deleted_at IS NULL', [username]);
        if (result.rows.length === 0) {
          return done(null, false, { message: 'Неверный логин' });
        }

        const user = result.rows[0];
        const passwordValid = await argon2.verify(user.password_hash, password);

        if (!passwordValid) {
          return done(null, false, { message: 'Неверный пароль' });
        }

        delete user.password_hash;
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
      const user = result.rows[0];
      if (user) {
        delete user.password_hash;
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  });
}

module.exports = initialize;
