const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');
const { proteger } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/rbacMiddleware');
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

const adminCoord = checkRole('admin', 'coordenacao');

router.get('/', proteger, calendarioController.listar);
router.get('/estatisticas', proteger, adminCoord, calendarioController.estatisticas);
router.get('/calendario-geral', proteger, adminCoord, calendarioController.calendarioGeral);
router.get('/:id', proteger, calendarioController.buscarPorId);
router.post('/', proteger, validarCalendario, calendarioController.criar);
router.put('/:id', proteger, calendarioController.atualizar);
router.delete('/:id', proteger, calendarioController.deletar);

router.patch('/:id/enviar', proteger, checkRole('professor'), calendarioController.enviar);

router.patch('/:id/aprovar', proteger, adminCoord, calendarioController.aprovar);
router.patch('/:id/solicitar-ajuste', proteger, adminCoord, calendarioController.solicitarAjuste);

module.exports = router;