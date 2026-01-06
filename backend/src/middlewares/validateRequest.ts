const { ZodError } = require('zod');

/**
 * Middleware para validar a requisição com base em um schema Zod.
 * @param {import('zod').ZodSchema} schema - Schema Zod para validação
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Valida body, query e params juntos ou separadamente, dependendo da estrutura do schema
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        mensagem: 'Dados inválidos',
        erros: error.errors.map((err) => ({
          campo: err.path.join('.'), // Ex: "body.email" ou "av1.conteudo"
          mensagem: err.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = validate;
