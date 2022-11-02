import axios from "axios";
import authHeader from '../auth-header'
import baseURL from "./baseURL";

class ResultadoService {

  async getRequerimientos() {
    const res = await axios
    .get(baseURL() + "resultados/all", { headers: authHeader() });
    return res.data;
  }

  async saveRequerimiento(data) {
    const res = await axios
    .post(baseURL() + "resultados/save", data, { headers: authHeader() });
    return res.data;
  }

  async getRequerimiento(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "resultados/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getCreateConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "resultados/comprobanteCreate/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "resultados/comprobanteView/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async postSaveEvidence(data) { 
    const res = await axios
    .post(baseURL() + "resultados/comprobanteSave", data, { headers: authHeader() });
    return res.data;
  } 

}

export default new ResultadoService();
