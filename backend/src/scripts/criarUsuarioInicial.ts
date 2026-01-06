require('dotenv').config();

const criarUsuarioInicial = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calendario-avaliativo');
    console.log('Conectado ao MongoDB');

    const usuarioExistente = await User.findOne({ email: 'admin@colegio.com' });

    if (usuarioExistente) {
      console.log('❌ Usuário admin já existe!');
      process.exit(0);
    }

    const admin = await User.create({
      nome: 'Administrador',
      email: 'admin@colegio.com',
      senha: 'admin123',
      role: 'admin',
      status: 'aprovado',
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