import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class CantonService {

  async getRequerimientos() {
    const res = await axios
    .get(baseURL() + "requerimientos/all", { headers: authHeader() });
    return res.data;
  }

}

export default new CantonService();
