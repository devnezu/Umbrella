const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeHorariaController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

// Todas as rotas são protegidas
router.use(protect);

// GET /api/grade-horaria
router.get('/', gradeController.getGrade);

// POST /api/grade-horaria
// Body: { turma: '6ºA', disciplina: 'Matemática', dias: [1, 3] }
router.post(
  '/',
  [
    check('turma', 'Turma é obrigatória').not().isEmpty(),
    check('disciplina', 'Disciplina é obrigatória').not().isEmpty(),
    check('dias', 'Dias deve ser um array de números (0-6)').isArray(),
  ],
  gradeController.updateGrade
);

module.exports = router;
