const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar campos
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await user.compararSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = gerarToken(user._id);

    // Retornar dados do usuário (sem senha)
    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        disciplinas: user.disciplinas,
        turmas: user.turmas
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};

// Registrar novo usuário (somente coordenação pode fazer)
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo, disciplinas, turmas } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o usuário já existe
    const userExiste = await User.findOne({ email });

    if (userExiste) {
      return res.status(400).json({ mensagem: 'Email já está em uso' });
    }

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      senha,
      tipo,
      disciplinas: disciplinas || [],
      turmas: turmas || []
    });

    // Gerar token
    const token = gerarToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        disciplinas: user.disciplinas,
        turmas: user.turmas
      }
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ mensagem: 'Erro ao registrar usuário' });
  }
};

// Obter perfil do usuário logado
exports.perfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      disciplinas: user.disciplinas,
      turmas: user.turmas
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil
exports.atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, disciplinas, turmas } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    user.nome = nome || user.nome;
    user.email = email || user.email;

    if (user.tipo === 'professor') {
      user.disciplinas = disciplinas || user.disciplinas;
      user.turmas = turmas || user.turmas;
    }

    await user.save();

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      disciplinas: user.disciplinas,
      turmas: user.turmas
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar perfil' });
  }
};

// Listar todos os usuários (somente coordenação)
exports.listarUsuarios = async (req, res) => {
  try {
    const users = await User.find({}).select('-senha');
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ mensagem: 'Erro ao listar usuários' });
  }
};
