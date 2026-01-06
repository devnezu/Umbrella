import api from './api';

const gradeHorariaService = {
  async getGrade() {
    const { data } = await api.get('/grade-horaria');
    return data;
  },

  async updateGrade(gradeData) {
    // gradeData: { turma, disciplina, dias: [1, 3] }
    const { data } = await api.post('/grade-horaria', gradeData);
    return data;
  }
};

export default gradeHorariaService;