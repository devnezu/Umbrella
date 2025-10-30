const Calendario = require('../models/Calendario');
const { validationResult } = require('express-validator');
const { toCalendarioDTO } = require('../dtos/calendario.dto');

exports.criar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const calendario = await Calendario.create({
    ...req.body,
    professor: req.user.id
  });

  await calendario.populate('professor');

  res.status(201).json(toCalendarioDTO(calendario));
};

exports.listar = async (req, res) => {
  const { turma, disciplina, bimestre, ano, status, professor } = req.query;

  const filtro = {};

  if (req.user.role === 'professor') {
    filtro.professor = req.user.id;
  }

  if (turma) filtro.turma = turma;
  if (disciplina) filtro.disciplina = disciplina;
  if (bimestre) filtro.bimestre = parseInt(bimestre);
  if (ano) filtro.ano = parseInt(ano);
  if (status) filtro.status = status;
  if (professor && ['admin', 'coordenacao'].includes(req.user.role)) {
    filtro.professor = professor;
  }

  const calendarios = await Calendario.find(filtro)
    .populate('professor')
    .sort({ turma: 1, disciplina: 1 });

  res.json(calendarios.map(toCalendarioDTO));
};

exports.buscarPorId = async (req, res) => {
  const calendario = await Calendario.findById(req.params.id)
    .populate('professor');

  if (!calendario) {
    return res.status(404).json({ mensagem: 'Calendário não encontrado' });
  }

  if (req.user.role === 'professor' && calendario.professor._id.toString() !== req.user.id) {
    return res.status(403).json({ mensagem: 'Acesso negado' });
  }

  res.json(toCalendarioDTO(calendario));
};

exports.atualizar = async (req, res) => {
  const calendario = await Calendario.findById(req.params.id);

  if (!calendario) {
    return res.status(404).json({ mensagem: 'Calendário não encontrado' });
  }

  if (req.user.role === 'professor') {
    if (calendario.professor.toString() !== req.user.id) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    if (calendario.status !== 'rascunho') {
      return res.status(400).json({
        mensagem: 'Não é possível editar calendários já enviados'
      });
    }
  }

  Object.assign(calendario, req.body);

  await calendario.save();
  await calendario.populate('professor');

  res.json(toCalendarioDTO(calendario));
};

exports.enviar = async (req, res) => {
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
  await calendario.populate('professor');

  res.json(toCalendarioDTO(calendario));
};

exports.aprovar = async (req, res) => {
  const calendario = await Calendario.findById(req.params.id);

  if (!calendario) {
    return res.status(404).json({ mensagem: 'Calendário não encontrado' });
  }

  calendario.status = 'aprovado';
  await calendario.save();
  await calendario.populate('professor');

  res.json(toCalendarioDTO(calendario));
};

exports.solicitarAjuste = async (req, res) => {
  const { comentarioCoordenacao } = req.body;

  const calendario = await Calendario.findById(req.params.id);

  if (!calendario) {
    return res.status(404).json({ mensagem: 'Calendário não encontrado' });
  }

  calendario.status = 'rascunho';
  calendario.comentarioCoordenacao = comentarioCoordenacao || '';
  await calendario.save();
  await calendario.populate('professor');

  res.json(toCalendarioDTO(calendario));
};

exports.deletar = async (req, res) => {
  const calendario = await Calendario.findById(req.params.id);

  if (!calendario) {
    return res.status(404).json({ mensagem: 'Calendário não encontrado' });
  }

  if (req.user.role === 'professor') {
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
};

exports.estatisticas = async (req, res) => {
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
};

exports.calendarioGeral = async (req, res) => {
  const { ano, bimestre, turma } = req.query;

  const filtro = { status: 'aprovado' };
  if (ano) filtro.ano = parseInt(ano);
  if (bimestre) filtro.bimestre = parseInt(bimestre);
  if (turma) filtro.turma = turma;

  const calendarios = await Calendario.find(filtro)
    .populate('professor', 'nome')
    .sort({ 'av1.data': 1 });

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

  eventos.sort((a, b) => new Date(a.data) - new Date(b.data));

  res.json(eventos);
};