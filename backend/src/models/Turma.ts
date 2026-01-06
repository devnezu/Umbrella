const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'Código da turma é obrigatório'],
    unique: true
  },
  nivel: {
    type: String,
    enum: ['Fundamental II', 'Ensino Médio'],
    required: [true, 'Nível é obrigatório']
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: 1,
    max: 9
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Turma', turmaSchema);
