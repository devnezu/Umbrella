const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.proteger = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // ✅ Verificação se o token foi extraído
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
    // ✅ Tratamento explícito quando o header não está presente
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }
};