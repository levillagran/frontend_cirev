import axios from 'axios';
import authHeader from './auth-header';
import baseURL from './baseURL';

class UserService {
  getPublicContent() {
    return axios.get(baseURL() + 'roles');
  }

  getUserBoard() {
    return axios.get(baseURL() + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(baseURL() + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(baseURL() + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
