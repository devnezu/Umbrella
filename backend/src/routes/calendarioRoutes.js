const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');
const { proteger } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/rbacMiddleware');
const { body } = require('express-validator');

const validarCalendario = [
  body('turma').notEmpty().withMessage('Turma é obrigatória'),
  body('disciplina').notEmpty().withMessage('Disciplina é obrigatória'),
  body('bimestre').isInt({ min: 1, max: 4 }).withMessage('Bimestre deve ser entre 1 e 4'),
  body('ano').isInt({ min: 2020 }).withMessage('Ano inválido'),
  body('av1.data').isISO8601().withMessage('Data da AV1 inválida'),
  body('av1.instrumento').notEmpty().withMessage('Instrumento da AV1 é obrigatório'),
  body('av1.conteudo').isLength({ min: 10 }).withMessage('Conteúdo da AV1 deve ter pelo menos 10 caracteres'),
  body('av1.criterios').isLength({ min: 10 }).withMessage('Critérios da AV1 devem ter pelo menos 10 caracteres'),
  body('av2.data').isISO8601().withMessage('Data da AV2 inválida'),
  body('av2.instrumento').notEmpty().withMessage('Instrumento da AV2 é obrigatório'),
  body('av2.conteudo').isLength({ min: 10 }).withMessage('Conteúdo da AV2 deve ter pelo menos 10 caracteres'),
  body('av2.criterios').isLength({ min: 10 }).withMessage('Critérios da AV2 devem ter pelo menos 10 caracteres'),
  body('consolidacao.data').isISO8601().withMessage('Data da Consolidação inválida'),
  body('consolidacao.conteudo').isLength({ min: 10 }).withMessage('Conteúdo da Consolidação deve ter pelo menos 10 caracteres'),
  body('consolidacao.criterios').isLength({ min: 10 }).withMessage('Critérios da Consolidação devem ter pelo menos 10 caracteres')
];

router.get('/', proteger, checkPermission('calendario:read-all'), calendarioController.listar);
router.get('/estatisticas', proteger, checkPermission('stats:view'), calendarioController.estatisticas);
router.get('/calendario-geral', proteger, checkPermission('reports:view'), calendarioController.calendarioGeral);
router.get('/:id', proteger, calendarioController.buscarPorId);
router.post('/', proteger, checkPermission('calendario:create'), validarCalendario, calendarioController.criar);
router.put('/:id', proteger, checkPermission('calendario:update'), calendarioController.atualizar);
router.delete('/:id', proteger, checkPermission('calendario:delete'), calendarioController.deletar);

router.patch('/:id/enviar', proteger, checkPermission('calendario:send'), calendarioController.enviar);
router.patch('/:id/aprovar', proteger, checkPermission('calendario:approve'), calendarioController.aprovar);
router.patch('/:id/solicitar-ajuste', proteger, checkPermission('calendario:reject'), calendarioController.solicitarAjuste);

module.exports = router;