import api from './api';

const userService = {
  async listar() {
    const { data } = await api.get('/auth/usuarios');
    return data;
  },

  async atualizar(id, userData) {
    const { data } = await api.put(`/auth/usuarios/${id}`, userData);
    return data;
  },
  
  async atualizarPerfil(userData) {
    const { data } = await api.put(`/auth/perfil`, userData);
    return data;
  },

  async aprovar(id) {
    const { data } = await api.patch(`/auth/usuarios/${id}/aprovar`);
    return data;
  },

  async rejeitar(id) {
    const { data } = await api.patch(`/auth/usuarios/${id}/rejeitar`);
    return data;
  },

  async deletar(id) {
    const { data } = await api.delete(`/auth/usuarios/${id}`);
    return data;
  }
};

export default userService;