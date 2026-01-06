const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const {
  createCalendarioSchema,
  updateCalendarioSchema,
  listCalendarioSchema,
  actionCalendarioSchema,
  solicitarAjusteSchema
} = require('../schemas/calendario.schema');

router.use(protect);

router.post('/', validate(createCalendarioSchema), calendarioController.criar);
router.get('/', validate(listCalendarioSchema), calendarioController.listar);
router.get('/estatisticas', calendarioController.estatisticas); // Já valida query params internamente ou cria schema se quiser ser rigoroso
router.get('/geral', calendarioController.calendarioGeral); 
router.get('/:id', validate(actionCalendarioSchema), calendarioController.buscarPorId);
router.put('/:id', validate(updateCalendarioSchema), calendarioController.atualizar);
router.patch('/:id/enviar', validate(actionCalendarioSchema), calendarioController.enviar);
router.patch('/:id/aprovar', authorize('coordenacao', 'admin'), validate(actionCalendarioSchema), calendarioController.aprovar);
router.patch('/:id/solicitar-ajuste', authorize('coordenacao', 'admin'), validate(solicitarAjusteSchema), calendarioController.solicitarAjuste);
router.delete('/:id', validate(actionCalendarioSchema), calendarioController.deletar);

module.exports = router;