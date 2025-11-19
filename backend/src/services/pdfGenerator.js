const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

const formatarData = (data) => {
  if (!data) return 'XX.XX';
  try {
    const dateStr = data instanceof Date ? data.toISOString() : data;
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}.${month}`;
  } catch {
    return 'XX.XX';
  }
};

const LOGO_BASE64 = process.env.BASE_64 || '';

const gerarHTMLConsolidadoTurma = (calendarios, turma, bimestre, ano) => {
  const bimestreNomes = { 1: '1º', 2: '2º', 3: '3º', 4: '4º' };
  const bimestreLabel = bimestreNomes[bimestre] || bimestre;
  
  let segmento = 'ENSINO FUNDAMENTAL II';
  if (turma.toUpperCase().includes('EM') || ['1', '2', '3'].some(v => turma.startsWith(v))) {
     segmento = 'ENSINO MÉDIO';
  }

  let rowsHtml = '';

  calendarios.forEach(cal => {
    const professorNome = cal.professor ? cal.professor.nome.toUpperCase() : 'PROFESSOR';
    const disciplinaNome = cal.disciplina.toUpperCase();
    
    rowsHtml += `
      <tr class="separator-row">
        <td colspan="3" class="subject-header">
          PROF. ${professorNome} – ${disciplinaNome}
        </td>
      </tr>
    `;

    rowsHtml += `
      <tr>
        <td class="col-data">
          <div class="data-valor">${formatarData(cal.av1.data)}</div>
          <div class="peso">(10,0)</div>
        </td>
        <td class="col-instrumento">
          <div class="label-etapa">AV1:</div>
          <div class="texto-conteudo"><strong>Instrumento:</strong> ${cal.av1.instrumento}</div>
          ${cal.av1.conteudo ? `
            <div class="texto-conteudo mt-2">
              <strong>Fonte de Estudo:</strong><br>
              ${cal.av1.conteudo.replace(/\n/g, '<br>')}
            </div>` : ''}
        </td>
        <td class="col-criterios">
          <div class="texto-conteudo">
            ${cal.av1.criterios.replace(/\n/g, '<br>')}
          </div>
        </td>
      </tr>
    `;

    rowsHtml += `
      <tr>
        <td class="col-data">
          <div class="data-valor">${formatarData(cal.av2.data)}</div>
          <div class="peso">(10,0)</div>
        </td>
        <td class="col-instrumento">
          <div class="label-etapa">AV2:</div>
          <div class="texto-conteudo"><strong>Instrumento:</strong> ${cal.av2.instrumento}</div>
          ${cal.av2.conteudo ? `
            <div class="texto-conteudo mt-2">
              <strong>Fonte de Estudo:</strong><br>
              ${cal.av2.conteudo.replace(/\n/g, '<br>')}
            </div>` : ''}
        </td>
        <td class="col-criterios">
          <div class="texto-conteudo">
            ${cal.av2.criterios.replace(/\n/g, '<br>')}
          </div>
        </td>
      </tr>
    `;

    rowsHtml += `
      <tr>
        <td class="col-data">
          <div class="data-valor">${formatarData(cal.consolidacao.data)}</div>
          <div class="peso">(10,0)</div>
        </td>
        <td class="col-instrumento">
          <div class="label-etapa">REC BIMESTRAL:</div>
           ${cal.consolidacao.conteudo ? `
            <div class="texto-conteudo mt-2">
              <strong>Fonte de Estudo:</strong><br>
              ${cal.consolidacao.conteudo.replace(/\n/g, '<br>')}
            </div>` : ''}
        </td>
        <td class="col-criterios rec-warning">
          PLANO DE ESTUDO E CONSOLIDAÇÃO DA APRENDIZAGEM/RECUPERAÇÃO
          <br>
          (disponível no portal educacional – E-Class).
          ${cal.consolidacao.criterios ? `<br><br><span style="color:#000; font-weight:normal;">${cal.consolidacao.criterios}</span>` : ''}
        </td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 1cm; size: A4; }
    
    * { box-sizing: border-box; }
    
    body { 
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 10pt; 
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact; 
    }

    .header {
      position: relative;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 3px solid #003366;
      margin-bottom: 10px;
    }
    
    .logo-container {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    .logo-img {
      height: auto;
      max-height: 120px;
      width: auto;
      max-width: 250px;
    }
    
    .school-info {
      text-align: center;
      color: #003366;
      z-index: 1;
    }
    
    .school-name {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .school-contact {
      font-size: 10pt;
      margin-top: 8px;
      color: #444;
    }

    .banner {
      background-color: #FFCC00;
      color: #003366;
      padding: 8px;
      text-align: center;
      font-weight: 900;
      font-size: 20pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .banner span {
      background-color: #003366;
      color: #fff;
      font-size: 8pt;
      padding: 2px 5px;
      vertical-align: middle;
      margin-right: 10px;
    }

    .title-bar {
      background-color: #00FFFF;
      color: #000;
      font-weight: bold;
      text-align: center;
      padding: 5px;
      font-size: 11pt;
      border: 1px solid #000;
      margin-bottom: 0;
      text-transform: uppercase;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    th, td {
      border: 1px solid #000;
      padding: 5px;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    thead th {
      background-color: #000080;
      color: #fff;
      text-align: center;
      font-size: 9pt;
      text-transform: uppercase;
    }

    .separator-row td {
      background-color: #FFCC00;
      color: #0000FF;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      font-size: 10pt;
      padding: 4px;
    }

    .col-data {
      background-color: #FFCC99;
      text-align: center;
      width: 15%;
      vertical-align: middle;
    }

    .col-instrumento {
      width: 42.5%;
      background-color: #fff;
    }

    .col-criterios {
      width: 42.5%;
      background-color: #fff;
    }

    .data-valor {
      color: #FF0000;
      font-weight: bold;
      font-size: 10pt;
    }

    .peso {
      font-size: 9pt;
      font-weight: bold;
    }

    .label-etapa {
      font-weight: bold;
      font-size: 9pt;
      margin-bottom: 3px;
    }

    .texto-conteudo {
      font-size: 9pt;
      line-height: 1.3;
      white-space: pre-wrap;
    }

    .mt-2 { margin-top: 8px; }

    .rec-warning {
      color: #FF0000;
      font-weight: bold;
      text-align: center;
      font-size: 9pt;
      vertical-align: middle;
    }

    tr { page-break-inside: avoid; }
  </style>
</head>
<body>

  <div class="header">
    <div class="logo-container">
       <img src="${LOGO_BASE64}" class="logo-img" alt="Logo" /> 
    </div>
    <div class="school-info">
      <div class="school-name">Colégio Adventista de Cotia</div>
      <div class="school-contact">
        Rua Rui Barbosa, 63 – Lajeado – Cotia/SP<br>
        Tel.: 11 4573-3000
      </div>
    </div>
  </div>

  <div class="banner">
    <span>ENSINO QUE</span> TRANSFORMA <span style="background:none; color:#003366; font-size:10pt;">O MUNDO</span>
  </div>

  <div class="title-bar">
    Calendário Avaliativo – ${bimestreLabel} Bimestre: ${segmento} – ${turma}
  </div>

  <table>
    <thead>
      <tr>
        <th>DATA<br>REALIZAÇÃO/<br>ENTREGA (PESO)</th>
        <th>INSTRUMENTO AVALIATIVO<br>E FONTE DE ESTUDO</th>
        <th>CRITÉRIOS PARA AVALIAÇÃO<br>E DESCRIÇÃO DA ATIVIDADE</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

</body>
</html>
  `;
};

exports.gerarPDF = async (calendario) => {
  return exports.gerarPDFConsolidado([calendario], calendario.turma, calendario.bimestre, calendario.ano);
};

exports.gerarPDFConsolidado = async (calendarios, turma, bimestre, ano) => {
  let browser;
  try {
    const tempDir = path.join(__dirname, '../../temp');
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    const html = gerarHTMLConsolidadoTurma(calendarios, turma, bimestre, ano);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const fileName = `calendario_${turma.replace(/[^a-z0-9]/gi, '_')}_${bimestre}bim_${Date.now()}.pdf`;
    const pdfPath = path.join(tempDir, fileName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '0.5cm', bottom: '1cm', left: '0.5cm' }
    });

    await browser.close();
    return pdfPath;
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
};