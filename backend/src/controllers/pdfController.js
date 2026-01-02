const Calendario = require('../models/Calendario');
const { gerarPDF, gerarPDFConsolidado } = require('../services/pdfGenerator');
const path = require('path');
const fs = require('fs').promises;

// Gerar PDF individual
exports.gerarPDFIndividual = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id)
      .populate('professor', 'nome email');

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    // Gerar PDF
    const pdfPath = await gerarPDF(calendario);

    // Enviar arquivo
    res.download(pdfPath, `calendario_${calendario.turma}_${calendario.disciplina}.pdf`, async (err) => {
      if (err) {
        console.error('Erro ao enviar PDF:', err);
      }

      // Deletar arquivo temporário após envio
      try {
        await fs.unlink(pdfPath);
      } catch (unlinkErr) {
        console.error('Erro ao deletar arquivo temporário:', unlinkErr);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF' });
  }
};

// Gerar PDF consolidado (todos os calendários de uma turma)
exports.gerarPDFConsolidadoTurma = async (req, res) => {
  try {
    const { turma, bimestre, ano } = req.query;

    const calendarios = await Calendario.find({
      turma,
      bimestre, // Já é number via Zod
      ano,      // Já é number via Zod
      status: 'aprovado'
    }).populate('professor', 'nome');

    if (calendarios.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhum calendário aprovado encontrado para esta turma'
      });
    }

    // Gerar PDF consolidado
    const pdfPath = await gerarPDFConsolidado(calendarios, turma, bimestre, ano);

    // Enviar arquivo
    res.download(pdfPath, `calendario_consolidado_${turma}_${bimestre}bim.pdf`, async (err) => {
      if (err) {
        console.error('Erro ao enviar PDF:', err);
      }

      // Deletar arquivo temporário após envio
      try {
        await fs.unlink(pdfPath);
      } catch (unlinkErr) {
        console.error('Erro ao deletar arquivo temporário:', unlinkErr);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar PDF consolidado:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF consolidado' });
  }
};

// Gerar PDF de todas as turmas
exports.gerarPDFTodasTurmas = async (req, res) => {
  try {
    const { bimestre, ano } = req.query;

    const calendarios = await Calendario.find({
      bimestre,
      ano,
      status: 'aprovado'
    }).populate('professor', 'nome')
      .sort({ turma: 1, disciplina: 1 });

    if (calendarios.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhum calendário aprovado encontrado'
      });
    }

    // Agrupar por turma
    const calendariosPorTurma = calendarios.reduce((acc, cal) => {
      if (!acc[cal.turma]) {
        acc[cal.turma] = [];
      }
      acc[cal.turma].push(cal);
      return acc;
    }, {});

    // Gerar PDFs para cada turma (simplificado - gerar um PDF com todas)
    const pdfPath = await gerarPDFConsolidado(calendarios, 'Todas', bimestre, ano);

    // Enviar arquivo
    res.download(pdfPath, `calendario_todas_turmas_${bimestre}bim.pdf`, async (err) => {
      if (err) {
        console.error('Erro ao enviar PDF:', err);
      }

      // Deletar arquivo temporário após envio
      try {
        await fs.unlink(pdfPath);
      } catch (unlinkErr) {
        console.error('Erro ao deletar arquivo temporário:', unlinkErr);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar PDF de todas as turmas:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF de todas as turmas' });
  }
};
