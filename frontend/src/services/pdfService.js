import api from './api';

class PdfService {
  async gerarPDFIndividual(calendarioId) {
    const response = await api.get(`/pdf/individual/${calendarioId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async gerarPDFConsolidadoTurma(turma, bimestre, ano) {
    const response = await api.get('/pdf/consolidado/turma', {
      params: { turma, bimestre, ano },
      responseType: 'blob',
    });
    return response.data;
  }

  async gerarPDFTodasTurmas(bimestre, ano) {
    const response = await api.get('/pdf/consolidado/todas', {
      params: { bimestre, ano },
      responseType: 'blob',
    });
    return response.data;
  }

  downloadPDF(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new PdfService();
