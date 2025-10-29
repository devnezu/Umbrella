import api from './api';

class AuthService {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async registrar(userData) {
    const response = await api.post('/auth/registrar', userData);
    return response.data;
  }

  async perfil() {
    const response = await api.get('/auth/perfil');
    return response.data;
  }

  async atualizarPerfil(userData) {
    const response = await api.put('/auth/perfil', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
