import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class ProcesamientoService {

  async getProcesamientos() {
    const res = await axios
    .get(baseURL() + "procesamientos/all", { headers: authHeader() });
    return res.data;
  }

  async saveProcesamiento(data) {
    const res = await axios
    .post(baseURL() + "procesamientos/save", data, { headers: authHeader() });
    return res.data;
  }

  async getProcesamiento(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "procesamientos/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

}

export default new ProcesamientoService();
