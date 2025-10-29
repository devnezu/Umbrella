import api from './api';

class CalendarioService {
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/calendarios?${params}`);
    return response.data;
  }

  async buscarPorId(id) {
    const response = await api.get(`/calendarios/${id}`);
    return response.data;
  }

  async criar(calendarioData) {
    const response = await api.post('/calendarios', calendarioData);
    return response.data;
  }

  async atualizar(id, calendarioData) {
    const response = await api.put(`/calendarios/${id}`, calendarioData);
    return response.data;
  }

  async deletar(id) {
    const response = await api.delete(`/calendarios/${id}`);
    return response.data;
  }

  async enviar(id) {
    const response = await api.patch(`/calendarios/${id}/enviar`);
    return response.data;
  }

  async aprovar(id) {
    const response = await api.patch(`/calendarios/${id}/aprovar`);
    return response.data;
  }

  async solicitarAjuste(id, comentario) {
    const response = await api.patch(`/calendarios/${id}/solicitar-ajuste`, {
      comentarioCoordenacao: comentario,
    });
    return response.data;
  }

  async estatisticas(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/calendarios/estatisticas?${params}`);
    return response.data;
  }

  async calendarioGeral(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/calendarios/calendario-geral?${params}`);
    return response.data;
  }
}

export default new CalendarioService();
