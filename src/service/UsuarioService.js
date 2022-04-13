import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class UsuarioService {

  async getUsuarios() {
    const res = await axios
    .get(baseURL() + "usuarios/all", { headers: authHeader() });
    return res.data;
  }

  async postUsuarios(data) {
    const res = await axios
    .post(baseURL() + "usuarios/save", data, { headers: authHeader() });
    return res.data;
  }

}

export default new UsuarioService();
