import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class SecuenciacionService {

  async getSecuenciaciones() {
    const res = await axios
    .get(baseURL() + "secuenciaciones/all", { headers: authHeader() });
    return res.data;
  }

  async saveSecuenciacion(data) {
    console.log(data)
    const res = await axios
    .post(baseURL() + "secuenciaciones/save", data, { headers: authHeader() });
    return res.data;
  }

  async getSecuenciacion(secuenciacionId) { 
    const res = await axios
    .get(baseURL() + "secuenciaciones/findById/" + secuenciacionId, { headers: authHeader() });
    return res.data;
  } 

  async getCreateConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "secuenciaciones/comprobanteCreate/" + requerimientoId, { headers: authHeader() });
    return res.data;
  }  

}

export default new SecuenciacionService();
