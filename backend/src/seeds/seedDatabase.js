require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Turma = require('../models/Turma');
const Calendario = require('../models/Calendario');
const { TODAS_TURMAS } = require('../config/constants');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Limpar banco de dados
    console.log('Limpando banco de dados...');
    await User.deleteMany({});
    await Turma.deleteMany({});
    await Calendario.deleteMany({});

    // Criar coordenação
    console.log('Criando usuário da coordenação...');
    const coordenacao = await User.create({
      nome: 'Josiane Mendonça',
      email: 'josiane@colegioadventista.com',
      senha: 'Admin@2025',
      tipo: 'coordenacao'
    });

    console.log('Coordenação criada:', coordenacao.email);

    // Criar professores
    console.log('Criando professores...');
    const professores = await User.insertMany([
      {
        nome: 'Prof. Rosana Silva',
        email: 'rosana@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Português'],
        turmas: ['6ºA', '7ºB', '9ºC']
      },
      {
        nome: 'Prof. Germano Santos',
        email: 'germano@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Matemática'],
        turmas: ['6ºB', '6ºC', '8ºA']
      },
      {
        nome: 'Prof. Annie Oliveira',
        email: 'annie@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Inglês'],
        turmas: ['7ºA', '8ºB', '9ºA', '1ºEM-A']
      },
      {
        nome: 'Prof. Carlos Mendes',
        email: 'carlos@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['História'],
        turmas: ['6ºA', '7ºA', '8ºC', '9ºB']
      },
      {
        nome: 'Prof. Maria Costa',
        email: 'maria@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Geografia'],
        turmas: ['6ºD', '7ºC', '8ºD', '9ºD']
      },
      {
        nome: 'Prof. João Pereira',
        email: 'joao@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Ciências', 'Biologia'],
        turmas: ['6ºA', '7ºB', '1ºEM-A', '2ºEM-A']
      },
      {
        nome: 'Prof. Ana Paula',
        email: 'ana@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Física'],
        turmas: ['1ºEM-B', '2ºEM-B', '3ºEM-A']
      },
      {
        nome: 'Prof. Ricardo Lima',
        email: 'ricardo@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Química'],
        turmas: ['1ºEM-A', '2ºEM-A', '3ºEM-B']
      },
      {
        nome: 'Prof. Fernanda Souza',
        email: 'fernanda@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Artes'],
        turmas: ['6ºB', '7ºA', '8ºB', '9ºA']
      },
      {
        nome: 'Prof. Paulo Rodrigues',
        email: 'paulo@colegioadventista.com',
        senha: 'Prof@2025',
        tipo: 'professor',
        disciplinas: ['Educação Física'],
        turmas: ['6ºC', '7ºB', '8ºA', '9ºC']
      }
    ]);

    console.log(`${professores.length} professores criados`);

    // Criar turmas
    console.log('Criando turmas...');
    const turmas = [];

    // Fundamental II
    for (let ano = 6; ano <= 9; ano++) {
      const turmasAno = TODAS_TURMAS.filter(t => t.startsWith(`${ano}º`));
      turmasAno.forEach(codigo => {
        turmas.push({
          codigo,
          nivel: 'Fundamental II',
          ano
        });
      });
    }

    // Ensino Médio
    ['1ºEM-A', '1ºEM-B', '2ºEM-A', '2ºEM-B', '3ºEM-A', '3ºEM-B'].forEach((codigo, idx) => {
      turmas.push({
        codigo,
        nivel: 'Ensino Médio',
        ano: Math.floor(idx / 2) + 1
      });
    });

    await Turma.insertMany(turmas);
    console.log(`${turmas.length} turmas criadas`);

    // Criar calendários de exemplo
    console.log('Criando calendários de exemplo...');

    const anoAtual = new Date().getFullYear();
    const calendarios = [];

    // Exemplo 1: Português - 6ºA (Rosana) - Rascunho
    calendarios.push({
      turma: '6ºA',
      disciplina: 'Português',
      professor: professores[0]._id,
      bimestre: 1,
      ano: anoAtual,
      av1: {
        data: new Date('2025-03-15'),
        instrumento: 'Prova Impressa',
        conteudo: 'Substantivos, adjetivos e verbos. Leitura e interpretação de textos narrativos.',
        criterios: 'Compreensão dos conceitos gramaticais (40%), interpretação de texto (40%), ortografia e coesão (20%)'
      },
      av2: {
        data: new Date('2025-04-20'),
        instrumento: 'Trabalho',
        conteudo: 'Produção de texto narrativo com elementos estudados. Revisão de pontuação.',
        criterios: 'Criatividade e originalidade (30%), uso correto da gramática (40%), organização do texto (30%)'
      },
      consolidacao: {
        data: new Date('2025-05-05'),
        conteudo: 'Todo o conteúdo do bimestre: substantivos, adjetivos, verbos, interpretação e produção textual.',
        criterios: 'Avaliação escrita abrangendo todos os conteúdos trabalhados no bimestre'
      },
      status: 'rascunho',
      observacoes: 'Primeira versão, ainda preciso ajustar as datas'
    });

    // Exemplo 2: Matemática - 6ºB (Germano) - Enviado
    calendarios.push({
      turma: '6ºB',
      disciplina: 'Matemática',
      professor: professores[1]._id,
      bimestre: 1,
      ano: anoAtual,
      av1: {
        data: new Date('2025-03-18'),
        instrumento: 'Prova Impressa',
        conteudo: 'Operações com números naturais: adição, subtração, multiplicação e divisão. Expressões numéricas.',
        criterios: 'Resolução correta dos exercícios (80%), raciocínio lógico demonstrado (20%)'
      },
      av2: {
        data: new Date('2025-04-22'),
        instrumento: 'Lista de Exercícios',
        conteudo: 'Potenciação e radiciação. Problemas envolvendo as quatro operações.',
        criterios: 'Acurácia nos cálculos (60%), organização do desenvolvimento (20%), entrega no prazo (20%)'
      },
      consolidacao: {
        data: new Date('2025-05-08'),
        conteudo: 'Todo o conteúdo do bimestre: operações, expressões numéricas, potenciação e radiciação.',
        criterios: 'Avaliação escrita com questões de diferentes níveis de dificuldade'
      },
      status: 'enviado'
    });

    // Exemplo 3: Inglês - 7ºA (Annie) - Aprovado
    calendarios.push({
      turma: '7ºA',
      disciplina: 'Inglês',
      professor: professores[2]._id,
      bimestre: 1,
      ano: anoAtual,
      av1: {
        data: new Date('2025-03-20'),
        instrumento: 'Prova Impressa',
        conteudo: 'Simple Present, vocabulário sobre rotina diária, reading comprehension.',
        criterios: 'Gramática (40%), vocabulário (30%), interpretação de texto (30%)'
      },
      av2: {
        data: new Date('2025-04-25'),
        instrumento: 'Apresentação',
        conteudo: 'Apresentação oral sobre "My Daily Routine" usando Simple Present.',
        criterios: 'Pronúncia e fluência (40%), uso correto da gramática (30%), conteúdo e criatividade (30%)'
      },
      consolidacao: {
        data: new Date('2025-05-10'),
        conteudo: 'Simple Present, vocabulário da unidade, compreensão oral e escrita.',
        criterios: 'Avaliação escrita e oral cobrindo todos os aspectos trabalhados'
      },
      status: 'aprovado'
    });

    // Exemplo 4: História - 6ºA (Carlos) - Aprovado
    calendarios.push({
      turma: '6ºA',
      disciplina: 'História',
      professor: professores[3]._id,
      bimestre: 1,
      ano: anoAtual,
      av1: {
        data: new Date('2025-03-22'),
        instrumento: 'Atividade',
        conteudo: 'Pré-História: Paleolítico e Neolítico. Primeiras civilizações.',
        criterios: 'Compreensão dos conceitos históricos (50%), capacidade de análise (30%), organização (20%)'
      },
      av2: {
        data: new Date('2025-04-28'),
        instrumento: 'Trabalho',
        conteudo: 'Pesquisa sobre uma das primeiras civilizações (Egito, Mesopotâmia, Grécia ou Roma).',
        criterios: 'Pesquisa e referências (30%), conteúdo e profundidade (40%), apresentação (30%)'
      },
      consolidacao: {
        data: new Date('2025-05-12'),
        conteudo: 'Pré-História e primeiras civilizações estudadas no bimestre.',
        criterios: 'Avaliação escrita com questões objetivas e dissertativas'
      },
      status: 'aprovado'
    });

    // Exemplo 5: Ciências - 6ºA (João) - Rascunho
    calendarios.push({
      turma: '6ºA',
      disciplina: 'Ciências',
      professor: professores[5]._id,
      bimestre: 1,
      ano: anoAtual,
      av1: {
        data: new Date('2025-03-25'),
        instrumento: 'Prova Impressa',
        conteudo: 'Método científico, características dos seres vivos, célula animal e vegetal.',
        criterios: 'Conhecimento teórico (60%), aplicação prática (30%), interpretação de gráficos (10%)'
      },
      av2: {
        data: new Date('2025-04-30'),
        instrumento: 'Atividade',
        conteudo: 'Relatório de experimento sobre observação de células ao microscópio.',
        criterios: 'Metodologia aplicada (30%), observações registradas (40%), conclusões (30%)'
      },
      consolidacao: {
        data: new Date('2025-05-15'),
        conteudo: 'Método científico, seres vivos e estrutura celular.',
        criterios: 'Avaliação teórica e prática cobrindo todo o conteúdo do bimestre'
      },
      status: 'rascunho',
      observacoes: 'Aguardando confirmação da disponibilidade do laboratório para AV2'
    });

    await Calendario.insertMany(calendarios);
    console.log(`${calendarios.length} calendários de exemplo criados`);

    console.log('\nSeed concluído com sucesso!');
    console.log('\n=== CREDENCIAIS DE ACESSO ===');
    console.log('\nCoordenação:');
    console.log('Email: josiane@colegioadventista.com');
    console.log('Senha: Admin@2025');
    console.log('\nProfessores (todos com senha: Prof@2025):');
    professores.forEach(prof => {
      console.log(`- ${prof.nome}: ${prof.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedDatabase();
