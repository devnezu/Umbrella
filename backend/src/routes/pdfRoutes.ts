const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const {
  pdfIndividualSchema,
  pdfConsolidadoTurmaSchema,
  pdfTodasTurmasSchema
} = require('../schemas/pdf.schema');

router.use(protect);

router.get('/individual/:id', validate(pdfIndividualSchema), pdfController.gerarPDFIndividual);
router.get('/consolidado-turma', validate(pdfConsolidadoTurmaSchema), pdfController.gerarPDFConsolidadoTurma);
router.get('/todas-turmas', validate(pdfTodasTurmasSchema), pdfController.gerarPDFTodasTurmas);

module.exports = router;
