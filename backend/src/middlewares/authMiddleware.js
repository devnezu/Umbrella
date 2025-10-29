const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
exports.proteger = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrair token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário e adicionar ao req
      req.user = await User.findById(decoded.id).select('-senha');

      if (!req.user) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado' });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }
};

// Middleware para verificar se o usuário é da coordenação
exports.coordenacaoApenas = (req, res, next) => {
  if (req.user && req.user.tipo === 'coordenacao') {
    next();
  } else {
    res.status(403).json({ mensagem: 'Acesso restrito à coordenação' });
  }
};

// Middleware para verificar se o usuário é professor
exports.professorApenas = (req, res, next) => {
  if (req.user && req.user.tipo === 'professor') {
    next();
  } else {
    res.status(403).json({ mensagem: 'Acesso restrito a professores' });
  }
};
