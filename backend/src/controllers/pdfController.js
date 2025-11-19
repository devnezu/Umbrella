const Calendario = require('../models/Calendario');
const { gerarPDF, gerarPDFConsolidado } = require('../services/pdfGenerator');
const path = require('path');
const fs = require('fs').promises;

// Ordem sugerida de disciplinas (baseada em currículos comuns)
const ORDEM_DISCIPLINAS = [
  'LÍNGUA PORTUGUESA', 'PORTUGUÊS', 'REDAÇÃO', 'LITERATURA', 'ARGUMENTAÇÃO',
  'MATEMÁTICA', 'INVESTIGAÇÃO MATEMÁTICA',
  'HISTÓRIA', 'GEOGRAFIA',
  'CIÊNCIAS', 'BIOLOGIA', 'FÍSICA', 'QUÍMICA',
  'INGLÊS', 'LÍNGUA INGLESA', 'ESPANHOL',
  'ARTE', 'ARTES',
  'EDUCAÇÃO FÍSICA',
  'ENSINO RELIGIOSO',
  'FILOSOFIA', 'SOCIOLOGIA', 'PROJETO DE VIDA'
];

const sortDisciplinas = (a, b) => {
  const dA = a.disciplina.toUpperCase();
  const dB = b.disciplina.toUpperCase();
  
  const indexA = ORDEM_DISCIPLINAS.findIndex(d => dA.includes(d));
  const indexB = ORDEM_DISCIPLINAS.findIndex(d => dB.includes(d));

  // Se ambos estiverem na lista, ordena pelo índice
  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  // Se só A estiver, A vem primeiro
  if (indexA !== -1) return -1;
  // Se só B estiver, B vem primeiro
  if (indexB !== -1) return 1;
  // Se nenhum estiver, ordem alfabética
  return dA.localeCompare(dB);
};

exports.gerarPDFIndividual = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id)
      .populate('professor', 'nome email');

    if (!calendario) return res.status(404).json({ mensagem: 'Calendário não encontrado' });

    const pdfPath = await gerarPDF(calendario);

    res.download(pdfPath, `calendario_${calendario.turma}_${calendario.disciplina}.pdf`, async (err) => {
      if (err) console.error(err);
      try { await fs.unlink(pdfPath); } catch {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF' });
  }
};

exports.gerarPDFConsolidadoTurma = async (req, res) => {
  try {
    const { turma, bimestre, ano } = req.query;

    if (!turma || !bimestre || !ano) return res.status(400).json({ mensagem: 'Dados incompletos' });

    let calendarios = await Calendario.find({
      turma,
      bimestre: parseInt(bimestre),
      ano: parseInt(ano),
      status: { $in: ['aprovado', 'enviado'] } // Pega enviados também para teste se precisar
    }).populate('professor', 'nome');

    if (calendarios.length === 0) return res.status(404).json({ mensagem: 'Nenhum calendário encontrado.' });

    // Ordenar por disciplina
    calendarios.sort(sortDisciplinas);

    const pdfPath = await gerarPDFConsolidado(calendarios, turma, bimestre, ano);

    res.download(pdfPath, `Calendario_${turma}_${bimestre}Bimestre.pdf`, async (err) => {
      if (err) console.error(err);
      try { await fs.unlink(pdfPath); } catch {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF consolidado' });
  }
};

exports.gerarPDFTodasTurmas = async (req, res) => {
    // Implementar loop para gerar ZIP se necessário
    res.status(501).json({ mensagem: 'Não implementado ainda' });
};