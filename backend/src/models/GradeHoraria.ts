const mongoose = require('mongoose');
const { TURMAS, DISCIPLINAS } = require('../config/constants');

const gradeHorariaSchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turma: {
    type: String,
    enum: TURMAS.TODAS_TURMAS || [...TURMAS.FUNDAMENTAL_II, ...TURMAS.ENSINO_MEDIO],
    required: true
  },
  disciplina: {
    type: String,
    enum: DISCIPLINAS,
    required: true
  },
  diaSemana: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  }
}, {
  timestamps: true
});

// Índice composto para garantir unicidade e otimizar buscas
gradeHorariaSchema.index({ professor: 1, turma: 1, disciplina: 1, diaSemana: 1 }, { unique: true });

module.exports = mongoose.model('GradeHoraria', gradeHorariaSchema);
