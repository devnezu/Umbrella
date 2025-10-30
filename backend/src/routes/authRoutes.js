const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { proteger } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/rbacMiddleware');

router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

router.get('/perfil', proteger, authController.perfil);
router.put('/perfil', proteger, authController.atualizarPerfil);

router.get('/usuarios', proteger, checkPermission('user:read-all'), authController.listarUsuarios);
router.put('/usuarios/:id', proteger, checkPermission('user:update'), authController.atualizarUsuario);
router.patch('/usuarios/:id/aprovar', proteger, checkPermission('user:update'), authController.aprovarUsuario);
router.patch('/usuarios/:id/rejeitar', proteger, checkPermission('user:update'), authController.rejeitarUsuario);
router.delete('/usuarios/:id', proteger, checkPermission('user:delete'), authController.deletarUsuario);

module.exports = router;