const { ROLES } = require('../config/constants');

exports.checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role;
    const roleData = ROLES[userRole];

    if (!roleData) {
      return res.status(403).json({ mensagem: 'Role inválida' });
    }

    const hasPermission = roleData.permissions.includes(requiredPermission);

    if (!hasPermission) {
      return res.status(403).json({
        mensagem: 'Acesso negado',
        permission: requiredPermission
      });
    }

    next();
  };
};

exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        mensagem: 'Acesso restrito',
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};