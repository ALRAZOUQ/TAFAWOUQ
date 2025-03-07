export const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  export const checkAdmin = (req, res, next) => {
   // console.log(req.user);
    if (req.user?.isadmin !== true) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };