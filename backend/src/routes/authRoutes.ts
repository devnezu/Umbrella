const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  adminUpdateUserSchema
} = require('../schemas/auth.schema');

router.post('/login', validate(loginSchema), authController.login);
router.post('/registrar', validate(registerSchema), authController.registrar);

router.use(protect);

router.get('/perfil', authController.perfil);
router.patch('/perfil', validate(updateProfileSchema), authController.atualizarPerfil);

// Rotas administrativas
router.get('/users', authorize('admin'), authController.listarUsuarios);
router.put('/users/:id', authorize('admin'), validate(adminUpdateUserSchema), authController.atualizarUsuario);
router.patch('/users/:id/aprovar', authorize('admin'), authController.aprovarUsuario);
router.patch('/users/:id/rejeitar', authorize('admin'), authController.rejeitarUsuario);
router.delete('/users/:id', authorize('admin'), authController.deletarUsuario);

module.exports = router;