const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Formato de email inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
  }),
});

const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Formato de email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['admin', 'coordenacao', 'professor', 'professor_substituto']).optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
    email: z.string().email('Formato de email inválido').optional(),
    disciplinas: z.array(z.string()).optional(),
    turmas: z.array(z.string()).optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      primaryColor: z.string().regex(/^#/, 'Deve ser uma cor Hex válida').optional(),
      sidebarCollapsed: z.boolean().optional(),
    }).optional(),
  }),
});

const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de usuário inválido'),
  }),
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    role: z.enum(['admin', 'coordenacao', 'professor', 'professor_substituto']).optional(),
    status: z.enum(['pendente', 'aprovado', 'rejeitado']).optional(),
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  adminUpdateUserSchema,
};
