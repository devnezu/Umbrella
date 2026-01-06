const { z } = require('zod');

// Schema reutilizável para Avaliações (AV1, AV2)
const avaliacaoSchema = z.object({
  data: z.coerce.date({ invalid_type_error: 'Data inválida' }), // Aceita string ISO e converte
  instrumento: z.enum(
    ['Prova Impressa', 'Atividade', 'Lista de Exercícios', 'Trabalho', 'Apresentação'],
    { errorMap: () => ({ message: 'Instrumento avaliativo inválido' }) }
  ),
  conteudo: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  criterios: z.string().min(10, 'Critérios devem ter no mínimo 10 caracteres'),
});

// Schema para Consolidação (Recuperação)
const consolidacaoSchema = z.object({
  data: z.coerce.date({ invalid_type_error: 'Data inválida' }),
  conteudo: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  criterios: z.string().min(10, 'Critérios devem ter no mínimo 10 caracteres'),
  // Instrumento é fixo na regra de negócio, não precisa vir do front, mas se vier validamos
  instrumento: z.string().optional(),
});

const createCalendarioSchema = z.object({
  body: z.object({
    turma: z.string().min(1, 'Turma é obrigatória'),
    disciplina: z.string().min(1, 'Disciplina é obrigatória'),
    bimestre: z.number().int().min(1).max(4),
    ano: z.number().int().min(2020),
    observacoes: z.string().optional(),
    av1: avaliacaoSchema,
    av2: avaliacaoSchema,
    consolidacao: consolidacaoSchema,
  }),
});

const updateCalendarioSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de calendário inválido'),
  }),
  body: createCalendarioSchema.shape.body.partial(), // Permite envio parcial na atualização
});

const listCalendarioSchema = z.object({
  query: z.object({
    turma: z.string().optional(),
    disciplina: z.string().optional(),
    bimestre: z.coerce.number().int().min(1).max(4).optional(), // Converte "1" string para 1 number
    ano: z.coerce.number().int().optional(),
    status: z.enum(['rascunho', 'enviado', 'aprovado']).optional(),
    professor: z.string().optional(),
  }),
});

const actionCalendarioSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de calendário inválido'),
  }),
});

const solicitarAjusteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de calendário inválido'),
  }),
  body: z.object({
    comentarioCoordenacao: z.string().min(1, 'Comentário é obrigatório para solicitar ajuste'),
  }),
});

module.exports = {
  createCalendarioSchema,
  updateCalendarioSchema,
  listCalendarioSchema,
  actionCalendarioSchema,
  solicitarAjusteSchema,
};
