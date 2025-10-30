const { toUserDTO } = require('./user.dto');

const toCalendarioDTO = (calendario) => {
  if (!calendario) return null;

  return {
    id: calendario._id,
    turma: calendario.turma,
    disciplina: calendario.disciplina,
    professor: toUserDTO(calendario.professor),
    bimestre: calendario.bimestre,
    ano: calendario.ano,
    av1: calendario.av1,
    av2: calendario.av2,
    consolidacao: calendario.consolidacao,
    status: calendario.status,
    necessitaImpressao: calendario.necessitaImpressao,
    observacoes: calendario.observacoes,
    comentarioCoordenacao: calendario.comentarioCoordenacao,
    createdAt: calendario.createdAt,
    updatedAt: calendario.updatedAt,
  };
};

module.exports = {
  toCalendarioDTO,
};