const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6
  },
  tipo: {
    type: String,
    enum: ['professor', 'coordenacao'],
    required: [true, 'Tipo de usuário é obrigatório']
  },
  disciplinas: {
    type: [String],
    default: []
  },
  turmas: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

// Não retornar senha nas queries
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
