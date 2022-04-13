import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class RequerimientoService {

  async getRequerimientos() {
    const res = await axios
    .get(baseURL() + "requerimientos/all", { headers: authHeader() });
    return res.data;
  }

  async saveRequerimiento(data) {
    const res = await axios
    .post(baseURL() + "requerimientos/save", data, { headers: authHeader() });
    return res.data;
  }

  async getRequerimiento(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "requerimientos/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "requerimientos/comprobante/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

}

export default new RequerimientoService();
