const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { proteger } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/rbacMiddleware');

const adminCoord = checkRole('admin', 'coordenacao');

router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

router.get('/perfil', proteger, authController.perfil);
router.put('/perfil', proteger, authController.atualizarPerfil);

router.get('/usuarios', proteger, adminCoord, authController.listarUsuarios);
router.put('/usuarios/:id', proteger, adminCoord, authController.atualizarUsuario);
router.patch('/usuarios/:id/aprovar', proteger, adminCoord, authController.aprovarUsuario);
router.patch('/usuarios/:id/rejeitar', proteger, adminCoord, authController.rejeitarUsuario);
router.delete('/usuarios/:id', proteger, adminCoord, authController.deletarUsuario);

module.exports = router;