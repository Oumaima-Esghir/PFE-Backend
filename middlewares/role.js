const checkRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      if (!Array.isArray(req.user.roles)) {
        return res.status(500).json({ message: 'Roles is not an array' });
      }
  
      if (!req.user.roles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;