const Calendario = require('../models/Calendario');
const { validationResult } = require('express-validator');

// Criar novo calendário
exports.criar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const calendario = await Calendario.create({
      ...req.body,
      professor: req.user.id
    });

    await calendario.populate('professor', 'nome email');

    res.status(201).json(calendario);
  } catch (error) {
    console.error('Erro ao criar calendário:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        mensagem: 'Já existe um calendário para esta turma, disciplina e bimestre'
      });
    }

    res.status(500).json({ mensagem: 'Erro ao criar calendário' });
  }
};

// Listar calendários (com filtros)
exports.listar = async (req, res) => {
  try {
    const { turma, disciplina, bimestre, ano, status, professor } = req.query;

    const filtro = {};

    // Se for professor, mostrar apenas seus calendários
    if (req.user.tipo === 'professor') {
      filtro.professor = req.user.id;
    }

    // Aplicar filtros
    if (turma) filtro.turma = turma;
    if (disciplina) filtro.disciplina = disciplina;
    if (bimestre) filtro.bimestre = parseInt(bimestre);
    if (ano) filtro.ano = parseInt(ano);
    if (status) filtro.status = status;
    if (professor && req.user.tipo === 'coordenacao') {
      filtro.professor = professor;
    }

    const calendarios = await Calendario.find(filtro)
      .populate('professor', 'nome email disciplinas')
      .sort({ turma: 1, disciplina: 1 });

    res.json(calendarios);
  } catch (error) {
    console.error('Erro ao listar calendários:', error);
    res.status(500).json({ mensagem: 'Erro ao listar calendários' });
  }
};

// Buscar calendário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id)
      .populate('professor', 'nome email disciplinas turmas');

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    // Professor só pode ver seus próprios calendários
    if (req.user.tipo === 'professor' && calendario.professor._id.toString() !== req.user.id) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    res.json(calendario);
  } catch (error) {
    console.error('Erro ao buscar calendário:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar calendário' });
  }
};

// Atualizar calendário
exports.atualizar = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id);

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    // Professor só pode editar se for seu calendário e estiver em rascunho
    if (req.user.tipo === 'professor') {
      if (calendario.professor.toString() !== req.user.id) {
        return res.status(403).json({ mensagem: 'Acesso negado' });
      }
      if (calendario.status !== 'rascunho') {
        return res.status(400).json({
          mensagem: 'Não é possível editar calendários já enviados'
        });
      }
    }

    // Atualizar campos
    Object.assign(calendario, req.body);

    await calendario.save();
    await calendario.populate('professor', 'nome email');

    res.json(calendario);
  } catch (error) {
    console.error('Erro ao atualizar calendário:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar calendário' });
  }
};

// Enviar calendário para coordenação (professor)
exports.enviar = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id);

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    if (calendario.professor.toString() !== req.user.id) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    if (calendario.status !== 'rascunho') {
      return res.status(400).json({
        mensagem: 'Este calendário já foi enviado'
      });
    }

    calendario.status = 'enviado';
    await calendario.save();
    await calendario.populate('professor', 'nome email');

    res.json(calendario);
  } catch (error) {
    console.error('Erro ao enviar calendário:', error);
    res.status(500).json({ mensagem: 'Erro ao enviar calendário' });
  }
};

// Aprovar calendário (coordenação)
exports.aprovar = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id);

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    calendario.status = 'aprovado';
    await calendario.save();
    await calendario.populate('professor', 'nome email');

    res.json(calendario);
  } catch (error) {
    console.error('Erro ao aprovar calendário:', error);
    res.status(500).json({ mensagem: 'Erro ao aprovar calendário' });
  }
};

// Solicitar ajuste (coordenação)
exports.solicitarAjuste = async (req, res) => {
  try {
    const { comentarioCoordenacao } = req.body;

    const calendario = await Calendario.findById(req.params.id);

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    calendario.status = 'rascunho';
    calendario.comentarioCoordenacao = comentarioCoordenacao || '';
    await calendario.save();
    await calendario.populate('professor', 'nome email');

    res.json(calendario);
  } catch (error) {
    console.error('Erro ao solicitar ajuste:', error);
    res.status(500).json({ mensagem: 'Erro ao solicitar ajuste' });
  }
};

// Deletar calendário
exports.deletar = async (req, res) => {
  try {
    const calendario = await Calendario.findById(req.params.id);

    if (!calendario) {
      return res.status(404).json({ mensagem: 'Calendário não encontrado' });
    }

    // Professor só pode deletar seus próprios calendários em rascunho
    if (req.user.tipo === 'professor') {
      if (calendario.professor.toString() !== req.user.id) {
        return res.status(403).json({ mensagem: 'Acesso negado' });
      }
      if (calendario.status !== 'rascunho') {
        return res.status(400).json({
          mensagem: 'Não é possível deletar calendários já enviados'
        });
      }
    }

    await Calendario.findByIdAndDelete(req.params.id);

    res.json({ mensagem: 'Calendário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar calendário:', error);
    res.status(500).json({ mensagem: 'Erro ao deletar calendário' });
  }
};

// Estatísticas (coordenação)
exports.estatisticas = async (req, res) => {
  try {
    const { ano, bimestre } = req.query;

    const filtro = {};
    if (ano) filtro.ano = parseInt(ano);
    if (bimestre) filtro.bimestre = parseInt(bimestre);

    const total = await Calendario.countDocuments(filtro);
    const rascunho = await Calendario.countDocuments({ ...filtro, status: 'rascunho' });
    const enviado = await Calendario.countDocuments({ ...filtro, status: 'enviado' });
    const aprovado = await Calendario.countDocuments({ ...filtro, status: 'aprovado' });
    const necessitaImpressao = await Calendario.countDocuments({
      ...filtro,
      necessitaImpressao: true
    });

    res.json({
      total,
      rascunho,
      enviado,
      aprovado,
      necessitaImpressao
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar estatísticas' });
  }
};

// Calendário geral consolidado
exports.calendarioGeral = async (req, res) => {
  try {
    const { ano, bimestre, turma } = req.query;

    const filtro = { status: 'aprovado' };
    if (ano) filtro.ano = parseInt(ano);
    if (bimestre) filtro.bimestre = parseInt(bimestre);
    if (turma) filtro.turma = turma;

    const calendarios = await Calendario.find(filtro)
      .populate('professor', 'nome')
      .sort({ 'av1.data': 1 });

    // Organizar por data
    const eventos = [];

    calendarios.forEach(cal => {
      eventos.push({
        tipo: 'AV1',
        data: cal.av1.data,
        turma: cal.turma,
        disciplina: cal.disciplina,
        professor: cal.professor.nome,
        instrumento: cal.av1.instrumento,
        necessitaImpressao: ['Prova Impressa', 'Lista de Exercícios'].includes(cal.av1.instrumento)
      });

      eventos.push({
        tipo: 'AV2',
        data: cal.av2.data,
        turma: cal.turma,
        disciplina: cal.disciplina,
        professor: cal.professor.nome,
        instrumento: cal.av2.instrumento,
        necessitaImpressao: ['Prova Impressa', 'Lista de Exercícios'].includes(cal.av2.instrumento)
      });

      eventos.push({
        tipo: 'Consolidação',
        data: cal.consolidacao.data,
        turma: cal.turma,
        disciplina: cal.disciplina,
        professor: cal.professor.nome,
        instrumento: 'Recuperação',
        necessitaImpressao: false
      });
    });

    // Ordenar por data
    eventos.sort((a, b) => new Date(a.data) - new Date(b.data));

    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar calendário geral:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar calendário geral' });
  }
};
