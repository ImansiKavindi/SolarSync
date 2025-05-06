const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  };
  
  const authorizeEmployee = (req, res, next) => {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Forbidden: Employees only' });
    }
    next();
  };
  
  module.exports = { authorizeAdmin, authorizeEmployee };
  