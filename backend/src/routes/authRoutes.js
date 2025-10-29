const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { proteger, coordenacaoApenas } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/login', authController.login);

// Rotas protegidas
router.get('/perfil', proteger, authController.perfil);
router.put('/perfil', proteger, authController.atualizarPerfil);

// Rotas de coordenação
router.post('/registrar', proteger, coordenacaoApenas, authController.registrar);
router.get('/usuarios', proteger, coordenacaoApenas, authController.listarUsuarios);

module.exports = router;
