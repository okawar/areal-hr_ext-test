function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: 'Требуется аутентификация' });
  }
  
  function requireRole(role) {
    return function (req, res, next) {
      if (req.user?.role === role) return next();
      return res.status(403).json({ error: 'Доступ запрещен' });
    };
  }
  
  module.exports = { ensureAuthenticated, requireRole };
  