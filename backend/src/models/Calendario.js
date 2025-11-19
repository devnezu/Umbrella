const mongoose = require('mongoose');

const calendarioSchema = new mongoose.Schema({
  turma: {
    type: String,
    required: [true, 'Turma é obrigatória']
  },
  disciplina: {
    type: String,
    required: [true, 'Disciplina é obrigatória']
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Professor é obrigatório']
  },
  bimestre: {
    type: Number,
    required: [true, 'Bimestre é obrigatório'],
    min: 1,
    max: 4
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    default: () => new Date().getFullYear()
  },

  av1: {
    data: {
      type: Date,
      required: [true, 'Data da AV1 é obrigatória']
    },
    instrumento: {
      type: String,
      enum: ['Prova Impressa', 'Atividade', 'Lista de Exercícios', 'Trabalho', 'Apresentação', 'E-Class'],
      required: [true, 'Instrumento da AV1 é obrigatório']
    },
    conteudo: {
      type: String,
      required: [true, 'Conteúdo da AV1 é obrigatório'],
      minlength: 10
    },
    criterios: {
      type: String,
      required: [true, 'Critérios da AV1 são obrigatórios'],
      minlength: 10
    }
  },

  av2: {
    data: {
      type: Date,
      required: [true, 'Data da AV2 é obrigatória']
    },
    instrumento: {
      type: String,
      enum: ['Prova Impressa', 'Atividade', 'Lista de Exercícios', 'Trabalho', 'Apresentação', 'E-Class'],
      required: [true, 'Instrumento da AV2 é obrigatório']
    },
    conteudo: {
      type: String,
      required: [true, 'Conteúdo da AV2 é obrigatório'],
      minlength: 10
    },
    criterios: {
      type: String,
      required: [true, 'Critérios da AV2 são obrigatórios'],
      minlength: 10
    }
  },

  consolidacao: {
    data: {
      type: Date,
      required: [true, 'Data da Consolidação é obrigatória']
    },
    conteudo: {
      type: String,
      required: [true, 'Conteúdo da Consolidação é obrigatório'],
      minlength: 10
    },
    criterios: {
      type: String,
      default: '' // Agora é opcional e padrão vazio
    }
  },

  status: {
    type: String,
    enum: ['rascunho', 'enviado', 'aprovado'],
    default: 'rascunho'
  },

  necessitaImpressao: {
    type: Boolean,
    default: false
  },

  observacoes: {
    type: String,
    default: ''
  },

  comentarioCoordenacao: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Middleware para calcular se necessita impressão
calendarioSchema.pre('save', function(next) {
  const instrumentosQueNecessitamImpressao = ['Prova Impressa', 'Lista de Exercícios'];

  this.necessitaImpressao =
    instrumentosQueNecessitamImpressao.includes(this.av1.instrumento) ||
    instrumentosQueNecessitamImpressao.includes(this.av2.instrumento);

  next();
});

// Índice composto para evitar duplicatas
calendarioSchema.index({ turma: 1, disciplina: 1, bimestre: 1, ano: 1 }, { unique: true });

module.exports = mongoose.model('Calendario', calendarioSchema);