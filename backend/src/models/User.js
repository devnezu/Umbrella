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
  // Campo principal: role (sistema RBAC)
  role: {
    type: String,
    enum: ['admin', 'coordenacao', 'professor', 'professor_substituto'],
    required: [true, 'Role é obrigatória'],
    default: 'professor'
  },
  // Mantido por compatibilidade (deprecado)
  tipo: {
    type: String,
    enum: ['admin', 'coordenacao', 'professor', 'professor_substituto'],
  },
  disciplinas: {
    type: [String],
    default: []
  },
  turmas: {
    type: [String],
    default: []
  },
  ativo: {
    type: Boolean,
    default: true
  },
  // Configurações de tema e personalização
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    primaryColor: {
      type: String,
      default: '#003D7A'
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  // Sincronizar tipo com role para compatibilidade
  if (this.isModified('role')) {
    this.tipo = this.role;
  }

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

// Método para atualizar preferências
userSchema.methods.updatePreferences = function(preferences) {
  this.preferences = { ...this.preferences, ...preferences };
  return this.save();
};

// Não retornar senha nas queries
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
