const PERMISSIONS = {
  'calendario:create': 'Criar calendários',
  'calendario:read': 'Visualizar próprios calendários',
  'calendario:update': 'Atualizar próprios calendários',
  'calendario:delete': 'Deletar próprios calendários',
  'calendario:send': 'Enviar calendários para aprovação',
  'calendario:approve': 'Aprovar calendários',
  'calendario:reject': 'Rejeitar/solicitar ajustes em calendários',
  'calendario:read-all': 'Visualizar todos os calendários',

  'pdf:generate': 'Gerar PDFs',
  'pdf:generate-all': 'Gerar PDFs consolidados',

  'user:create': 'Criar usuários',
  'user:read': 'Visualizar próprios dados',
  'user:update': 'Atualizar usuários',
  'user:delete': 'Deletar usuários',
  'user:read-all': 'Visualizar todos os usuários',

  'reports:view': 'Visualizar relatórios',
  'stats:view': 'Visualizar estatísticas',

  'settings:manage': 'Gerenciar configurações do sistema',
};

const ROLES = {
  admin: {
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: Object.keys(PERMISSIONS)
  },

  coordenacao: {
    name: 'Coordenação Pedagógica',
    description: 'Gerencia calendários e aprova submissões',
    permissions: [
      'calendario:read-all',
      'calendario:approve',
      'calendario:reject',
      'calendario:update',
      'calendario:delete',
      'pdf:generate',
      'pdf:generate-all',
      'user:read-all',
      'user:update',
      'user:delete',
      'reports:view',
      'stats:view'
    ]
  },

  professor: {
    name: 'Professor',
    description: 'Cria e gerencia seus próprios calendários',
    permissions: [
      'calendario:create',
      'calendario:read',
      'calendario:update',
      'calendario:delete',
      'calendario:send',
      'pdf:generate',
      'user:read'
    ]
  },

  professor_substituto: {
    name: 'Professor Substituto',
    description: 'Acesso limitado para visualização',
    permissions: [
      'calendario:read',
      'user:read'
    ]
  }
};

module.exports = {
  TURMAS: {
    FUNDAMENTAL_II: ['6ºA', '6ºB', '6ºC', '6ºD', '7ºA', '7ºB', '7ºC', '8ºA', '8ºB', '8ºC', '8ºD', '9ºA', '9ºB', '9ºC', '9ºD'],
    ENSINO_MEDIO: ['1ºEM-A', '1ºEM-B', '2ºEM-A', '2ºEM-B', '3ºEM-A', '3ºEM-B']
  },

  TODAS_TURMAS: [
    '6ºA', '6ºB', '6ºC', '6ºD',
    '7ºA', '7ºB', '7ºC',
    '8ºA', '8ºB', '8ºC', '8ºD',
    '9ºA', '9ºB', '9ºC', '9ºD',
    '1ºEM-A', '1ºEM-B',
    '2ºEM-A', '2ºEM-B',
    '3ºEM-A', '3ºEM-B'
  ],

  DISCIPLINAS: [
    'Português',
    'Matemática',
    'História',
    'Geografia',
    'Ciências',
    'Biologia',
    'Física',
    'Química',
    'Inglês',
    'Artes',
    'Educação Física',
    'Filosofia',
    'Sociologia',
    'Literatura',
    'Redação'
  ],

  INSTRUMENTOS_AVALIATIVOS: [
    'Prova Impressa',
    'Atividade',
    'Lista de Exercícios',
    'Trabalho',
    'Apresentação'
  ],

  STATUS_CALENDARIO: {
    RASCUNHO: 'rascunho',
    ENVIADO: 'enviado',
    APROVADO: 'aprovado'
  },

  TIPOS_USUARIO: {
    ADMIN: 'admin',
    COORDENACAO: 'coordenacao',
    PROFESSOR: 'professor',
    PROFESSOR_SUBSTITUTO: 'professor_substituto'
  },

  BIMESTRES: [1, 2, 3, 4],

  PERMISSIONS,
  ROLES,
};