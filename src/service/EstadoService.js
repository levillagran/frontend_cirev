import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class EstadoService {

  async getEstados() {
    const res = await axios
    .get(baseURL() + "estados/all", { headers: authHeader() });
    return res.data;
  }
}

export default new EstadoService();
