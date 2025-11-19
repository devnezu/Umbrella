import React from 'react';
import { formatarData } from '../../utils/dateHelpers';
import { useAuth } from '../../context/AuthContext';

const PDFPreview = ({ calendario }) => {
  const { user } = useAuth();
  
  const bimestreNomes = { 1: '1º', 2: '2º', 3: '3º', 4: '4º' };
  const bimestreLabel = bimestreNomes[calendario.bimestre] || calendario.bimestre;
  
  let segmento = 'ENSINO FUNDAMENTAL II';
  if (calendario.turma?.includes('EM') || ['1', '2', '3'].includes(calendario.turma?.charAt(0))) {
     segmento = 'ENSINO MÉDIO';
  }

  const nomeProfessor = calendario.professor?.nome || user?.nome || 'PROFESSOR';

  const styles = {
    headerBorder: { borderBottom: '3px solid #003366' },
    textBlue: { color: '#003366' },
    banner: { backgroundColor: '#FFCC00', color: '#003366' },
    titleBar: { backgroundColor: '#00FFFF', border: '1px solid #000' },
    tableHeader: { backgroundColor: '#000080', color: '#fff', border: '1px solid #000' },
    separator: { backgroundColor: '#FFCC00', color: '#0000FF', border: '1px solid #000' },
    dataCell: { backgroundColor: '#FFCC99', color: '#FF0000', border: '1px solid #000' },
    contentCell: { border: '1px solid #000', backgroundColor: '#fff' },
    recWarning: { color: '#FF0000', fontWeight: 'bold' }
  };

  return (
    <div className="w-full bg-white text-black p-6 shadow-lg text-[10px] leading-tight font-sans select-none pointer-events-none">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-2 mb-2" style={styles.headerBorder}>
        <div className="w-40">
          {/* Logo carregada da pasta public */}
          <img 
            src="/educacaoAdventista.webp" 
            alt="Logo Educação Adventista" 
            className="w-full h-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }} // Esconde se falhar
          />
        </div>
        <div className="text-center flex-1 pl-4" style={styles.textBlue}>
          <div className="text-lg font-bold uppercase">Colégio Adventista de Cotia</div>
          <div className="text-[9px] text-gray-600 mt-1">
            Rua Rui Barbosa, 63 – Lajeado – Cotia/SP | Tel.: 11 4573 - 3000
          </div>
        </div>
      </div>

      {/* Banner Transforma */}
      <div className="py-2 text-center font-black text-xl uppercase tracking-widest mb-2 flex items-center justify-center gap-2" style={styles.banner}>
        <span className="bg-[#003366] text-white text-[8px] px-1 py-0.5 align-middle font-normal">ENSINO QUE</span>
        TRANSFORMA
        <span className="text-[#003366] text-[8px] font-normal">O MUNDO</span>
      </div>

      {/* Faixa Título */}
      <div className="py-1 text-center font-bold uppercase mb-0 border border-black" style={styles.titleBar}>
        Calendário Avaliativo – {bimestreLabel} Bimestre: {segmento} – {calendario.turma || 'TURMA'}
      </div>

      {/* Tabela */}
      <div className="w-full border-l border-t border-black">
        {/* Cabeçalhos das Colunas */}
        <div className="grid grid-cols-12">
          <div className="col-span-2 p-1 text-center font-bold flex items-center justify-center border-r border-b border-black" style={styles.tableHeader}>
            DATA<br/>REALIZAÇÃO/<br/>ENTREGA (PESO)
          </div>
          <div className="col-span-5 p-1 text-center font-bold flex items-center justify-center border-r border-b border-black" style={styles.tableHeader}>
            INSTRUMENTO AVALIATIVO<br/>E FONTE DE ESTUDO
          </div>
          <div className="col-span-5 p-1 text-center font-bold flex items-center justify-center border-r border-b border-black" style={styles.tableHeader}>
            CRITÉRIOS PARA AVALIAÇÃO<br/>E DESCRIÇÃO DA ATIVIDADE
          </div>
        </div>

        {/* Separador Matéria */}
        <div className="p-1 text-center font-bold border-r border-b border-black uppercase" style={styles.separator}>
          PROF. {nomeProfessor} – {calendario.disciplina || 'DISCIPLINA'}
        </div>

        {/* Linha AV1 */}
        <div className="grid grid-cols-12 min-h-[60px]">
          <div className="col-span-2 p-1 text-center flex flex-col justify-center items-center font-bold border-r border-b border-black" style={styles.dataCell}>
            <div className="text-sm">{calendario.av1.data ? formatarData(calendario.av1.data).replace('/', '.') : 'XX.XX'}</div>
            <div className="text-black text-[9px] mt-1">(10,0)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black" style={styles.contentCell}>
            <div className="font-bold mb-1">AV1:</div>
            <div className="mb-2"><span className="font-bold">Instrumento:</span> {calendario.av1.instrumento}</div>
            {calendario.av1.conteudo && (
              <div className="text-[9px]">
                <span className="font-bold">Fonte de Estudo:</span><br/>
                <span className="whitespace-pre-wrap">{calendario.av1.conteudo}</span>
              </div>
            )}
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black whitespace-pre-wrap" style={styles.contentCell}>
            {calendario.av1.criterios}
          </div>
        </div>

        {/* Linha AV2 */}
        <div className="grid grid-cols-12 min-h-[60px]">
          <div className="col-span-2 p-1 text-center flex flex-col justify-center items-center font-bold border-r border-b border-black" style={styles.dataCell}>
            <div className="text-sm">{calendario.av2.data ? formatarData(calendario.av2.data).replace('/', '.') : 'XX.XX'}</div>
            <div className="text-black text-[9px] mt-1">(10,0)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black" style={styles.contentCell}>
            <div className="font-bold mb-1">AV2:</div>
            <div className="mb-2"><span className="font-bold">Instrumento:</span> {calendario.av2.instrumento}</div>
            {calendario.av2.conteudo && (
              <div className="text-[9px]">
                <span className="font-bold">Fonte de Estudo:</span><br/>
                <span className="whitespace-pre-wrap">{calendario.av2.conteudo}</span>
              </div>
            )}
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black whitespace-pre-wrap" style={styles.contentCell}>
            {calendario.av2.criterios}
          </div>
        </div>

        {/* Linha REC */}
        <div className="grid grid-cols-12 min-h-[60px]">
          <div className="col-span-2 p-1 text-center flex flex-col justify-center items-center font-bold border-r border-b border-black" style={styles.dataCell}>
            <div className="text-sm">{calendario.consolidacao.data ? formatarData(calendario.consolidacao.data).replace('/', '.') : 'XX.XX'}</div>
            <div className="text-black text-[9px] mt-1">(10,0)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black" style={styles.contentCell}>
            <div className="font-bold mb-1">REC BIMESTRAL:</div>
            {calendario.consolidacao.conteudo && (
              <div className="text-[9px]">
                 <span className="font-bold">Fonte de Estudo:</span><br/>
                 <span className="whitespace-pre-wrap">{calendario.consolidacao.conteudo}</span>
              </div>
            )}
          </div>
          <div className="col-span-5 p-2 border-r border-b border-black text-center flex flex-col justify-center" style={styles.contentCell}>
            <div style={styles.recWarning}>
              PLANO DE ESTUDO E CONSOLIDAÇÃO DA APRENDIZAGEM/RECUPERAÇÃO<br/>
              (disponível no portal educacional – E-Class).
            </div>
            {calendario.consolidacao.criterios && (
               <div className="mt-2 text-left text-black font-normal whitespace-pre-wrap">
                  {calendario.consolidacao.criterios}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;