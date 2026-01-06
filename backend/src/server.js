require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const calendarioRoutes = require('./routes/calendarioRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const gradeHorariaRoutes = require('./routes/gradeHorariaRoutes');

// Inicializar Express
const app = express();

// Conectar ao banco de dados
connectDatabase();

// ✅ CORS - DEVE VIR PRIMEIRO, ANTES DE QUALQUER OUTRA COISA
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight por 10 minutos
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Helmet - com configurações mais permissivas para desenvolvimento
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// ✅ Rate limiting - MUITO mais permissivo em desenvolvimento
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 em dev, 100 em prod
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular rate limit para localhost em desenvolvimento
    return process.env.NODE_ENV !== 'production' && 
           (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1');
  }
});

app.use('/api/', limiter);

// ✅ Tratamento explícito para OPTIONS (preflight)
app.options('*', cors());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/calendarios', calendarioRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/grade-horaria', gradeHorariaRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
});

// ✅ Tratamento gracioso de encerramento
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  server.close(() => {
    process.exit(1);
  });
});