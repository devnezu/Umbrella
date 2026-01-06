const { z } = require('zod');

const pdfIndividualSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de calendário inválido'),
  }),
});

const pdfConsolidadoTurmaSchema = z.object({
  query: z.object({
    turma: z.string().min(1, 'Turma é obrigatória'),
    bimestre: z.coerce.number().int().min(1).max(4),
    ano: z.coerce.number().int().min(2020),
  }),
});

const pdfTodasTurmasSchema = z.object({
  query: z.object({
    bimestre: z.coerce.number().int().min(1).max(4),
    ano: z.coerce.number().int().min(2020),
  }),
});

module.exports = {
  pdfIndividualSchema,
  pdfConsolidadoTurmaSchema,
  pdfTodasTurmasSchema,
};
