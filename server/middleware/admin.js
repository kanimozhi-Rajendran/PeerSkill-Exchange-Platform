/**
 * middleware/admin.js
 * 
 * Purpose: Restricts endpoints to authorized administrators only.
 * Must be mounted after the `protect` middleware.
 */

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted: Administrator privilege required.'
    });
  }
  next();
};

module.exports = { requireAdmin };
