// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let mensagem = err.message;

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    statusCode = 400;
    mensagem = 'Recurso não encontrado';
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    mensagem = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
  }

  // Erro de duplicata do MongoDB
  if (err.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(err.keyPattern)[0];
    mensagem = `Já existe um registro com este ${campo}`;
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    mensagem = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    mensagem = 'Token expirado';
  }

  res.status(statusCode).json({
    mensagem,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
