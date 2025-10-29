const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const criarUsuarioInicial = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calendario-avaliativo');
    console.log('Conectado ao MongoDB');

    // Verificar se já existe algum usuário
    const usuarioExistente = await User.findOne({ email: 'admin@colegio.com' });

    if (usuarioExistente) {
      console.log('❌ Usuário admin já existe!');
      process.exit(0);
    }

    // Criar usuário admin inicial
    const senhaHash = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      nome: 'Administrador',
      email: 'admin@colegio.com',
      senha: senhaHash,
      role: 'admin',
      ativo: true
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('');
    console.log('Credenciais de acesso:');
    console.log('Email: admin@colegio.com');
    console.log('Senha: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  }
};

criarUsuarioInicial();
