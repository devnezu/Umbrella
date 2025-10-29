const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Formatar data para DD/MM/YYYY
const formatarData = (data) => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Gerar HTML para um calendário
const gerarHTML = (calendario) => {
  const bimestreNomes = { 1: 'Primeiro', 2: 'Segundo', 3: 'Terceiro', 4: 'Quarto' };
  const bimestreNome = bimestreNomes[calendario.bimestre];

  // Determinar segmento e ano
  let segmento, anoTurma;
  if (calendario.turma.includes('EM')) {
    segmento = 'Ensino Médio';
    anoTurma = calendario.turma.charAt(0);
  } else {
    segmento = 'Fundamental II';
    anoTurma = calendario.turma.charAt(0);
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendário Avaliativo - ${calendario.turma}</title>
  <style>
    @page {
      size: A4;
      margin: 1cm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #003D7A;
    }

    .logo {
      width: 120px;
      height: auto;
    }

    .titulo-principal {
      text-align: center;
      background-color: #003D7A;
      color: white;
      padding: 12px;
      margin-bottom: 15px;
      font-size: 14pt;
      font-weight: bold;
    }

    .info-turma {
      background-color: #FFA500;
      color: white;
      padding: 8px;
      margin-bottom: 15px;
      font-weight: bold;
      text-align: center;
      font-size: 12pt;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }

    th {
      background-color: #003D7A;
      color: white;
      padding: 10px;
      text-align: left;
      font-size: 10pt;
      font-weight: bold;
      border: 1px solid #000;
    }

    td {
      padding: 10px;
      border: 1px solid #000;
      vertical-align: top;
      font-size: 10pt;
    }

    .etapa-titulo {
      background-color: #FFA500;
      color: white;
      font-weight: bold;
      text-align: center;
      padding: 8px;
      font-size: 11pt;
    }

    .data-peso {
      font-weight: bold;
      color: #003D7A;
    }

    .instrucoes {
      background-color: #FFF3CD;
      border: 2px solid #FFA500;
      padding: 10px;
      margin-top: 15px;
      font-size: 9pt;
      color: #856404;
    }

    .instrucoes strong {
      color: #dc3545;
      display: block;
      margin-bottom: 5px;
    }

    .rodape {
      margin-top: 20px;
      text-align: right;
      font-size: 10pt;
    }

    .assinatura {
      margin-top: 30px;
      text-align: center;
      font-size: 10pt;
    }

    .linha-assinatura {
      border-top: 1px solid #000;
      width: 300px;
      margin: 0 auto;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="text-align: left;">
      <strong>Educação Adventista</strong><br>
      <small>Colégio Adventista de Cotia</small>
    </div>
    <div style="text-align: right;">
      <strong>Ano Letivo: ${calendario.ano}</strong>
    </div>
  </div>

  <div class="titulo-principal">
    CALENDÁRIO AVALIATIVO - ${bimestreNome} Bimestre
  </div>

  <div class="info-turma">
    ${segmento} - ${anoTurma}º Ano ${calendario.turma} | Disciplina: ${calendario.disciplina}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">DATA REALIZAÇÃO/ENTREGA (PESO)</th>
        <th style="width: 40%;">INSTRUMENTO AVALIATIVO E FONTE DE ESTUDO</th>
        <th style="width: 40%;">CRITÉRIOS PARA AVALIAÇÃO E DESCRIÇÃO DA ATIVIDADE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="3" class="etapa-titulo">AV1 - PRIMEIRA ETAPA (0-10 pontos)</td>
      </tr>
      <tr>
        <td class="data-peso">${formatarData(calendario.av1.data)}<br>(Peso: 10)</td>
        <td>
          <strong>Instrumento:</strong> ${calendario.av1.instrumento}<br><br>
          <strong>Conteúdo/Habilidades:</strong><br>
          ${calendario.av1.conteudo}
        </td>
        <td>${calendario.av1.criterios}</td>
      </tr>

      <tr>
        <td colspan="3" class="etapa-titulo">AV2 - SEGUNDA ETAPA (0-10 pontos)</td>
      </tr>
      <tr>
        <td class="data-peso">${formatarData(calendario.av2.data)}<br>(Peso: 10)</td>
        <td>
          <strong>Instrumento:</strong> ${calendario.av2.instrumento}<br><br>
          <strong>Conteúdo/Habilidades:</strong><br>
          ${calendario.av2.conteudo}
        </td>
        <td>${calendario.av2.criterios}</td>
      </tr>

      <tr>
        <td colspan="3" class="etapa-titulo">CONSOLIDAÇÃO DA APRENDIZAGEM - RECUPERAÇÃO BIMESTRAL (0-10 pontos)</td>
      </tr>
      <tr>
        <td class="data-peso">${formatarData(calendario.consolidacao.data)}<br>(Peso: 10)</td>
        <td>
          <strong>Conteúdo/Habilidades:</strong><br>
          ${calendario.consolidacao.conteudo}
        </td>
        <td>${calendario.consolidacao.criterios}</td>
      </tr>
    </tbody>
  </table>

  ${calendario.observacoes ? `
  <div style="margin-top: 10px; padding: 8px; background-color: #f8f9fa; border-left: 4px solid #003D7A;">
    <strong>Observações:</strong><br>
    ${calendario.observacoes}
  </div>
  ` : ''}

  <div class="instrucoes">
    <strong>INSTRUÇÕES IMPORTANTES:</strong>
    • A média bimestral será calculada pela média aritmética simples entre AV1 e AV2.<br>
    • A Consolidação da Aprendizagem (Recuperação) substitui a média bimestral caso o aluno obtenha nota superior.<br>
    • Todas as atividades devem ser entregues nas datas estipuladas.<br>
    • Em caso de ausência justificada, o aluno deverá procurar a coordenação pedagógica.
  </div>

  <div class="assinatura">
    <div class="linha-assinatura"></div>
    <strong>Josiane Mendonça</strong><br>
    Coordenadora Pedagógica - Fundamental II e Ensino Médio<br>
    Colégio Adventista de Cotia
  </div>

  <div class="rodape">
    <small>Gerado em: ${formatarData(new Date())}</small>
  </div>
</body>
</html>
  `;
};

// Gerar PDF individual
exports.gerarPDF = async (calendario) => {
  let browser;

  try {
    // Criar diretório temp se não existir
    const tempDir = path.join(__dirname, '../../temp');
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    // Gerar HTML
    const html = gerarHTML(calendario);

    // Iniciar Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Gerar PDF
    const timestamp = Date.now();
    const fileName = `calendario_${calendario.turma}_${calendario.disciplina}_${timestamp}.pdf`;
    const pdfPath = path.join(tempDir, fileName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    await browser.close();

    return pdfPath;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};

// Gerar PDF consolidado
exports.gerarPDFConsolidado = async (calendarios, turma, bimestre, ano) => {
  let browser;

  try {
    const tempDir = path.join(__dirname, '../../temp');
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    // Gerar HTML consolidado (combinar vários calendários)
    let htmlCompleto = '';

    calendarios.forEach((calendario, index) => {
      htmlCompleto += gerarHTML(calendario);

      // Adicionar quebra de página entre calendários
      if (index < calendarios.length - 1) {
        htmlCompleto += '<div style="page-break-after: always;"></div>';
      }
    });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlCompleto, { waitUntil: 'networkidle0' });

    const timestamp = Date.now();
    const fileName = `calendario_consolidado_${turma}_${bimestre}bim_${timestamp}.pdf`;
    const pdfPath = path.join(tempDir, fileName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    await browser.close();

    return pdfPath;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};
