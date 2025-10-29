const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { proteger } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.get('/individual/:id', proteger, pdfController.gerarPDFIndividual);
router.get('/consolidado/turma', proteger, pdfController.gerarPDFConsolidadoTurma);
router.get('/consolidado/todas', proteger, pdfController.gerarPDFTodasTurmas);

module.exports = router;
