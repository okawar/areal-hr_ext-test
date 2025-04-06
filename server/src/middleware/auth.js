
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: 'Не авторизован' });
  }
  
  function ensureAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Доступ разрешен только для администраторов' });
  }
  
  module.exports = {
    ensureAuthenticated,
    ensureAdmin
  };
  