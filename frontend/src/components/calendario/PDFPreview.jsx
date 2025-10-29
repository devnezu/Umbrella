// frontend/src/components/calendario/PDFPreview.jsx

import React from 'react';
import { formatarData } from '../../utils/dateHelpers';

const PDFPreview = ({ calendario }) => {
  const bimestreNomes = { 1: 'Primeiro', 2: 'Segundo', 3: 'Terceiro', 4: 'Quarto' };
  const bimestreNome = bimestreNomes[calendario.bimestre];

  let segmento, anoTurma;
  if (calendario.turma.includes('EM')) {
    segmento = 'Ensino Médio';
    anoTurma = calendario.turma.charAt(0);
  } else {
    segmento = 'Fundamental II';
    anoTurma = calendario.turma.charAt(0);
  }

  return (
    <div className="w-full bg-white text-black p-8 rounded-lg shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-[#003D7A]">
        <div className="text-left">
          <div className="font-bold text-sm">Educação Adventista</div>
          <div className="text-xs">Colégio Adventista de Cotia</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-sm">Ano Letivo: {calendario.ano}</div>
        </div>
      </div>

      {/* Título Principal */}
      <div className="bg-[#003D7A] text-white text-center py-3 mb-4 font-bold text-lg">
        CALENDÁRIO AVALIATIVO - {bimestreNome} Bimestre
      </div>

      {/* Info Turma */}
      <div className="bg-[#FFA500] text-white text-center py-2 mb-4 font-bold">
        {segmento} - {anoTurma}º Ano {calendario.turma} | Disciplina: {calendario.disciplina}
      </div>

      {/* Tabela */}
      <div className="border border-black mb-4">
        {/* Header da Tabela */}
        <div className="grid grid-cols-12 bg-[#003D7A] text-white text-xs">
          <div className="col-span-3 p-2 border-r border-black font-bold">
            DATA REALIZAÇÃO/ENTREGA (PESO)
          </div>
          <div className="col-span-5 p-2 border-r border-black font-bold">
            INSTRUMENTO AVALIATIVO E FONTE DE ESTUDO
          </div>
          <div className="col-span-4 p-2 font-bold">
            CRITÉRIOS PARA AVALIAÇÃO E DESCRIÇÃO DA ATIVIDADE
          </div>
        </div>

        {/* AV1 */}
        <div className="bg-[#FFA500] text-white text-center py-2 font-bold text-sm border-t border-black">
          AV1 - PRIMEIRA ETAPA (0-10 pontos)
        </div>
        <div className="grid grid-cols-12 border-t border-black">
          <div className="col-span-3 p-2 border-r border-black text-xs">
            <div className="font-bold text-[#003D7A]">{formatarData(calendario.av1.data)}</div>
            <div className="font-bold text-[#003D7A]">(Peso: 10)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-black text-xs">
            <div><span className="font-bold">Instrumento:</span> {calendario.av1.instrumento}</div>
            <div className="mt-2">
              <span className="font-bold">Conteúdo/Habilidades:</span>
              <div className="mt-1">{calendario.av1.conteudo}</div>
            </div>
          </div>
          <div className="col-span-4 p-2 text-xs">
            {calendario.av1.criterios}
          </div>
        </div>

        {/* AV2 */}
        <div className="bg-[#FFA500] text-white text-center py-2 font-bold text-sm border-t border-black">
          AV2 - SEGUNDA ETAPA (0-10 pontos)
        </div>
        <div className="grid grid-cols-12 border-t border-black">
          <div className="col-span-3 p-2 border-r border-black text-xs">
            <div className="font-bold text-[#003D7A]">{formatarData(calendario.av2.data)}</div>
            <div className="font-bold text-[#003D7A]">(Peso: 10)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-black text-xs">
            <div><span className="font-bold">Instrumento:</span> {calendario.av2.instrumento}</div>
            <div className="mt-2">
              <span className="font-bold">Conteúdo/Habilidades:</span>
              <div className="mt-1">{calendario.av2.conteudo}</div>
            </div>
          </div>
          <div className="col-span-4 p-2 text-xs">
            {calendario.av2.criterios}
          </div>
        </div>

        {/* Consolidação */}
        <div className="bg-[#FFA500] text-white text-center py-2 font-bold text-sm border-t border-black">
          CONSOLIDAÇÃO DA APRENDIZAGEM - RECUPERAÇÃO BIMESTRAL (0-10 pontos)
        </div>
        <div className="grid grid-cols-12 border-t border-black">
          <div className="col-span-3 p-2 border-r border-black text-xs">
            <div className="font-bold text-[#003D7A]">{formatarData(calendario.consolidacao.data)}</div>
            <div className="font-bold text-[#003D7A]">(Peso: 10)</div>
          </div>
          <div className="col-span-5 p-2 border-r border-black text-xs">
            <span className="font-bold">Conteúdo/Habilidades:</span>
            <div className="mt-1">{calendario.consolidacao.conteudo}</div>
          </div>
          <div className="col-span-4 p-2 text-xs">
            {calendario.consolidacao.criterios}
          </div>
        </div>
      </div>

      {/* Observações */}
      {calendario.observacoes && (
        <div className="mt-3 p-2 bg-gray-100 border-l-4 border-[#003D7A] text-xs">
          <span className="font-bold">Observações:</span>
          <div className="mt-1">{calendario.observacoes}</div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-[#FFF3CD] border-2 border-[#FFA500] p-3 mt-4 text-xs text-[#856404]">
        <div className="font-bold text-red-600 mb-2">INSTRUÇÕES IMPORTANTES:</div>
        <div>• A média bimestral será calculada pela média aritmética simples entre AV1 e AV2.</div>
        <div>• A Consolidação da Aprendizagem (Recuperação) substitui a média bimestral caso o aluno obtenha nota superior.</div>
        <div>• Todas as atividades devem ser entregues nas datas estipuladas.</div>
        <div>• Em caso de ausência justificada, o aluno deverá procurar a coordenação pedagógica.</div>
      </div>

      {/* Assinatura */}
      <div className="mt-8 text-center text-xs">
        <div className="border-t border-black w-3/4 mx-auto mb-2"></div>
        <div className="font-bold">Josiane Mendonça</div>
        <div>Coordenadora Pedagógica - Fundamental II e Ensino Médio</div>
        <div>Colégio Adventista de Cotia</div>
      </div>

      {/* Rodapé */}
      <div className="mt-4 text-right text-xs text-gray-600">
        <small>Gerado em: {formatarData(new Date())}</small>
      </div>
    </div>
  );
};

export default PDFPreview;