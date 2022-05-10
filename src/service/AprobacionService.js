import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class AprobacionService {

  async getAprobaciones(userId) {
    const res = await axios
    .get(baseURL() + "aprobaciones/all/" + userId, { headers: authHeader() });
    return res.data;
  }
 
  async saveAprobacion(data) {
    const res = await axios
    .post(baseURL() + "aprobaciones/save", data, { headers: authHeader() });
    return res.data;
  }

  async getAprobacion(aprobacionId) { 
    const res = await axios
    .get(baseURL() + "aprobaciones/findById/" + aprobacionId, { headers: authHeader() });
    return res.data;
  } 

  async getCreateConprovante(aprobacionId) { 
    const res = await axios
    .get(baseURL() + "aprobaciones/comprobanteCreate/" + aprobacionId, { headers: authHeader() });
    return res.data;
  }  

}

export default new AprobacionService();
