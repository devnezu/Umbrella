import api from './api';

const userService = {
  async listar() {
    const { data } = await api.get('/auth/usuarios');
    return data;
  },

  async criar(userData) {
    const { data } = await api.post('/auth/registrar', userData);
    return data;
  },

  async atualizar(id, userData) {
    const { data } = await api.put(`/auth/perfil`, userData);
    return data;
  },

  async deletar(id) {
    const { data } = await api.delete(`/auth/usuarios/${id}`);
    return data;
  }
};

export default userService;
