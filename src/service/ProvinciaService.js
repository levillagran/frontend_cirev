import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class ProvinciaService {

  async getProvincias() {
    const res = await axios
    .get(baseURL() + "provincias/all", { headers: authHeader() });
    return res.data;
  }
}

export default new ProvinciaService();
