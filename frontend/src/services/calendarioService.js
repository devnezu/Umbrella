import api from './api';

const calendarioService = {
  async listar(filtros = {}) {
    const { data } = await api.get('/calendarios', { params: filtros });
    return data;
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/calendarios/${id}`);
    return data;
  },

  async criar(calendarioData) {
    const { data } = await api.post('/calendarios', calendarioData);
    return data;
  },

  async atualizar(id, calendarioData) {
    const { data } = await api.put(`/calendarios/${id}`, calendarioData);
    return data;
  },

  async deletar(id) {
    const { data } = await api.delete(`/calendarios/${id}`);
    return data;
  },

  async enviar(id) {
    const { data } = await api.patch(`/calendarios/${id}/enviar`);
    return data;
  },

  async aprovar(id) {
    const { data } = await api.patch(`/calendarios/${id}/aprovar`);
    return data;
  },

  async solicitarAjuste(id, comentario) {
    const { data } = await api.patch(`/calendarios/${id}/solicitar-ajuste`, { comentarioCoordenacao: comentario });
    return data;
  },

  async estatisticas(filtros = {}) {
    const { data } = await api.get('/calendarios/estatisticas', { params: filtros });
    return data;
  },

  async gerarPDF(id) {
    const response = await api.get(`/pdf/individual/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default calendarioService;
