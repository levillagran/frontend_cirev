import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class EstadoService {

  async changeStatus(data) {
    const res = await axios
    .post(baseURL() + "estados/changeStatus", data, { headers: authHeader() });
    return res.data;
  }
  
}

export default new EstadoService();
