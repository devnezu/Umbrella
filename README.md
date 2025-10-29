# Sistema de Automação de Calendário Avaliativo Escolar

Sistema web completo para automatizar o processo de criação de calendários avaliativos bimestrais do Colégio Adventista de Cotia.

## Sobre o Projeto

Este sistema resolve o problema da criação manual de calendários avaliativos, que anteriormente exigia que a coordenadora pedagógica criasse e formatasse manualmente 21+ documentos Word para cada bimestre. Com este sistema, o processo é totalmente automatizado, padronizado e colaborativo.

### Principais Funcionalidades

- Autenticação de usuários (Professores e Coordenação)
- Dashboard para professores criarem e gerenciarem seus calendários avaliativos
- Dashboard para coordenação revisar, aprovar e gerenciar todos os calendários
- Geração automática de PDFs formatados
- Sistema de aprovação com fluxo de trabalho
- Notificações e comentários entre coordenação e professores
- Controle de calendários que necessitam impressão

### Tecnologias Utilizadas

#### Frontend
- React 18 com Vite
- Tailwind CSS para estilização
- shadcn/ui para componentes
- React Router para navegação
- Axios para requisições HTTP
- date-fns para manipulação de datas
- Sonner para notificações
- Lucide React para ícones

#### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- bcrypt para hash de senhas
- Puppeteer para geração de PDFs
- express-validator para validações

## Estrutura do Projeto

```
projeto-calendario-avaliativo/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── context/        # Context API (Auth)
│   │   └── utils/          # Utilitários
│   └── package.json
│
├── backend/           # API Node.js
│   ├── src/
│   │   ├── models/         # Modelos MongoDB
│   │   ├── controllers/    # Controllers
│   │   ├── routes/         # Rotas da API
│   │   ├── middlewares/    # Middlewares
│   │   ├── services/       # Serviços (PDF)
│   │   └── seeds/          # Seed do banco
│   └── package.json
│
└── README.md
```

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- MongoDB instalado e rodando
- Git

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd Umbrella
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
# Certifique-se de configurar:
# - MONGODB_URI (conexão com MongoDB)
# - JWT_SECRET (chave secreta para JWT)
# - PORT (porta do servidor, padrão: 5000)
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# O padrão é http://localhost:5000/api
# Altere se necessário
```

### 4. Popular o Banco de Dados

```bash
cd ../backend

# Executar seed (cria usuários e dados de exemplo)
npm run seed
```

## Executar o Projeto

### Backend

```bash
cd backend

# Modo desenvolvimento (com nodemon)
npm run dev

# Ou modo produção
npm start
```

O backend estará rodando em `http://localhost:5000`

### Frontend

```bash
cd frontend

# Modo desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## Credenciais de Acesso

Após executar o seed, use estas credenciais para fazer login:

### Coordenação
- **Email:** josiane@colegioadventista.com
- **Senha:** Admin@2025

### Professores (todos com senha: Prof@2025)
- rosana@colegioadventista.com (Português)
- germano@colegioadventista.com (Matemática)
- annie@colegioadventista.com (Inglês)
- carlos@colegioadventista.com (História)
- maria@colegioadventista.com (Geografia)
- joao@colegioadventista.com (Ciências/Biologia)
- ana@colegioadventista.com (Física)
- ricardo@colegioadventista.com (Química)
- fernanda@colegioadventista.com (Artes)
- paulo@colegioadventista.com (Educação Física)

## Fluxo de Uso

### Para Professores

1. Fazer login com credenciais de professor
2. Acessar Dashboard do Professor
3. Clicar em "Novo Calendário"
4. Preencher informações:
   - Turma e Disciplina
   - Bimestre e Ano
   - AV1 (data, instrumento, conteúdo, critérios)
   - AV2 (data, instrumento, conteúdo, critérios)
   - Consolidação da Aprendizagem
5. Salvar como rascunho OU enviar diretamente para coordenação
6. Acompanhar status (rascunho/enviado/aprovado)

### Para Coordenação

1. Fazer login com credenciais de coordenação
2. Visualizar dashboard com estatísticas
3. Ver lista de todos os calendários
4. Filtrar por status (pendentes, aprovados, etc)
5. Revisar calendários pendentes
6. Aprovar OU solicitar ajuste (com comentário)
7. Gerar PDFs individuais ou consolidados
8. Identificar calendários que necessitam impressão

## Geração de PDFs

O sistema gera PDFs automaticamente usando Puppeteer, com layout profissional incluindo:

- Logo da Educação Adventista
- Cabeçalho com informações da turma
- Tabela formatada com as 3 etapas avaliativas
- Instruções importantes
- Assinatura da coordenadora

### Tipos de PDF

1. **Individual:** PDF de um único calendário (turma + disciplina)
2. **Consolidado por Turma:** Todos os calendários de uma turma específica
3. **Consolidado Geral:** Todos os calendários de todas as turmas

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/perfil` - Obter perfil
- `PUT /api/auth/perfil` - Atualizar perfil

### Calendários
- `GET /api/calendarios` - Listar calendários (com filtros)
- `GET /api/calendarios/:id` - Buscar por ID
- `POST /api/calendarios` - Criar calendário
- `PUT /api/calendarios/:id` - Atualizar calendário
- `DELETE /api/calendarios/:id` - Deletar calendário
- `PATCH /api/calendarios/:id/enviar` - Enviar para coordenação
- `PATCH /api/calendarios/:id/aprovar` - Aprovar (coordenação)
- `PATCH /api/calendarios/:id/solicitar-ajuste` - Solicitar ajuste (coordenação)
- `GET /api/calendarios/estatisticas` - Obter estatísticas
- `GET /api/calendarios/calendario-geral` - Calendário consolidado

### PDFs
- `GET /api/pdf/individual/:id` - Gerar PDF individual
- `GET /api/pdf/consolidado/turma?turma=X&bimestre=Y&ano=Z` - PDF por turma
- `GET /api/pdf/consolidado/todas?bimestre=X&ano=Y` - PDF de todas as turmas

## Turmas Suportadas

### Fundamental II
6ºA, 6ºB, 6ºC, 6ºD, 7ºA, 7ºB, 7ºC, 8ºA, 8ºB, 8ºC, 8ºD, 9ºA, 9ºB, 9ºC, 9ºD

### Ensino Médio
1ºEM-A, 1ºEM-B, 2ºEM-A, 2ºEM-B, 3ºEM-A, 3ºEM-B

## Sistema de Avaliação

Cada calendário contém 3 etapas por bimestre:

1. **AV1 - Primeira Etapa** (0-10 pontos)
2. **AV2 - Segunda Etapa** (0-10 pontos)
3. **Consolidação da Aprendizagem** (0-10 pontos, recuperação bimestral)

### Instrumentos Avaliativos Disponíveis
- Prova Impressa
- Atividade
- Lista de Exercícios
- Trabalho
- Apresentação

## Segurança

- Autenticação JWT com tokens expiráveis
- Senhas hashadas com bcrypt
- Proteção de rotas por tipo de usuário
- Rate limiting para prevenir ataques
- Validação de dados no backend
- CORS configurado

## Scripts Disponíveis

### Backend
```bash
npm start       # Iniciar servidor
npm run dev     # Modo desenvolvimento com nodemon
npm run seed    # Popular banco de dados
```

### Frontend
```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build para produção
npm run preview # Preview do build
```

## Solução de Problemas

### MongoDB não conecta
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no .env

### Erro ao gerar PDF
- Puppeteer precisa de dependências do sistema
- No Linux: `apt-get install -y libgbm-dev`

### Porta já em uso
- Altere PORT no backend/.env
- Altere porta no frontend/vite.config.js

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para o Colégio Adventista de Cotia.

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com dedicação para facilitar o trabalho da coordenação pedagógica e professores do Colégio Adventista de Cotia.
