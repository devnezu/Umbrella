const GradeHoraria = require('../models/GradeHoraria');
const { validationResult } = require('express-validator');

// Obter grade horária do professor logado (ou de um específico se for admin/coord)
exports.getGrade = async (req, res) => {
  try {
    const userId = req.user.role === 'professor' ? req.user.id : (req.query.professorId || req.user.id);
    
    const grade = await GradeHoraria.find({ professor: userId });
    
    // Formatar para facilitar o uso no frontend
    // Agrupar por Turma + Disciplina
    const gradeFormatada = grade.reduce((acc, item) => {
      const key = `${item.turma}-${item.disciplina}`;
      if (!acc[key]) {
        acc[key] = {
          turma: item.turma,
          disciplina: item.disciplina,
          dias: []
        };
      }
      acc[key].dias.push(item.diaSemana);
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(gradeFormatada)
    });
  } catch (error) {
    console.error('Erro ao buscar grade:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar grade horária' });
  }
};

// Atualizar/Definir grade para uma turma/disciplina específica
exports.updateGrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { turma, disciplina, dias } = req.body;
  const professorId = req.user.role === 'professor' ? req.user.id : (req.body.professorId || req.user.id);

  try {
    // 1. Remover entradas existentes para essa combinação
    await GradeHoraria.deleteMany({
      professor: professorId,
      turma,
      disciplina
    });

    // 2. Criar novas entradas
    if (dias && dias.length > 0) {
      const novasEntradas = dias.map(dia => ({
        professor: professorId,
        turma,
        disciplina,
        diaSemana: dia
      }));
      
      await GradeHoraria.insertMany(novasEntradas);
    }

    res.json({
      success: true,
      message: 'Grade atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar grade:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar grade horária' });
  }
};
