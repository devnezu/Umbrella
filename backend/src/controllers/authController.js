const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { toUserDTO, toUserProfileDTO } = require('../dtos/user.dto');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  const user = await User.findOne({ email }).select('+senha');

  if (!user) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  if (user.status !== 'aprovado') {
    return res.status(403).json({ mensagem: 'Sua conta está pendente de aprovação.' });
  }

  const senhaCorreta = await user.compararSenha(senha);

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  const token = gerarToken(user._id);

  res.json({
    token,
    user: toUserProfileDTO(user)
  });
};

exports.registrar = async (req, res) => {
  const { nome, email, senha, role } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
  }

  const userExiste = await User.findOne({ email });

  if (userExiste) {
    return res.status(400).json({ mensagem: 'Email já está em uso' });
  }

  await User.create({
    nome,
    email,
    senha,
    role: role || 'professor',
    status: 'pendente'
  });

  res.status(201).json({
    mensagem: 'Solicitação de registro enviada com sucesso. Aguarde a aprovação de um administrador.'
  });
};

exports.perfil = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  res.json(toUserProfileDTO(user));
};

exports.atualizarPerfil = async (req, res) => {
  const { nome, email, disciplinas, turmas, preferences } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  user.nome = nome || user.nome;
  user.email = email || user.email;

  if (user.role === 'professor') {
    user.disciplinas = disciplinas || user.disciplinas;
    user.turmas = turmas || user.turmas;
  }
  
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  const updatedUser = await user.save();

  res.json(toUserProfileDTO(updatedUser));
};

exports.listarUsuarios = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users.map(toUserDTO));
};

exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, role, status } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  user.nome = nome || user.nome;
  user.email = email || user.email;
  user.role = role || user.role;
  user.status = status || user.status;

  const updatedUser = await user.save();
  res.json(toUserDTO(updatedUser));
};

exports.aprovarUsuario = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  user.status = 'aprovado';
  await user.save();
  res.json({ mensagem: 'Usuário aprovado com sucesso.' });
};

exports.rejeitarUsuario = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  user.status = 'rejeitado';
  await user.save();
  res.json({ mensagem: 'Usuário rejeitado com sucesso.' });
};

exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  await User.findByIdAndDelete(id);
  res.json({ mensagem: 'Usuário deletado com sucesso.' });
};