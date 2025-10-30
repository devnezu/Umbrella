const { ROLES } = require('../config/constants');

// Middleware para verificar se usuário tem permissão específica
exports.checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role; // ✅ Alterado de req.user.tipo para req.user.role
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

// Middleware para verificar múltiplas permissões (OR - qualquer uma)
exports.checkAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role; // ✅ Alterado
    const roleData = ROLES[userRole];

    if (!roleData) {
      return res.status(403).json({ mensagem: 'Role inválida' });
    }

    const hasAnyPermission = permissions.some(permission =>
      roleData.permissions.includes(permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        mensagem: 'Acesso negado',
        requiredPermissions: permissions
      });
    }

    next();
  };
};

// Middleware para verificar múltiplas permissões (AND - todas)
exports.checkAllPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role; // ✅ Alterado
    const roleData = ROLES[userRole];

    if (!roleData) {
      return res.status(403).json({ mensagem: 'Role inválida' });
    }

    const hasAllPermissions = permissions.every(permission =>
      roleData.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        mensagem: 'Acesso negado',
        requiredPermissions: permissions
      });
    }

    next();
  };
};

// Middleware para verificar role específica
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }

    const userRole = req.user.role; // ✅ Alterado

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        mensagem: 'Acesso restrito',
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};

// Helper para adicionar permissões ao objeto req
exports.attachPermissions = (req, res, next) => {
  if (req.user) {
    const userRole = req.user.role; // ✅ Alterado
    const roleData = ROLES[userRole];

    req.permissions = roleData ? roleData.permissions : [];
    req.userRole = userRole;
  }

  next();
};