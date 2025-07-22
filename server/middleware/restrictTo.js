const restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Only ${role}s allowed.` });
    }
    next();
  };
};

module.exports = restrictTo;
