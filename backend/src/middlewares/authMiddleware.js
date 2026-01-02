const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado' });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
  } else {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        mensagem: `Permissão negada. Requer função: ${roles.join(' ou ')}`
      });
    }
    next();
  };
};