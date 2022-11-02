import axios from "axios";
import authHeader from '../auth-header'
import baseURL from "./baseURL";

class CuracionService {

  async getCuraciones() {
    const res = await axios
    .get(baseURL() + "curaciones/all", { headers: authHeader() });
    return res.data;
  }

  async saveStored(data) {
    const res = await axios
    .post(baseURL() + "curaciones/saveStored", data, { headers: authHeader() });
    return res.data;
  }

  async saveMount(data) {
    const res = await axios
    .post(baseURL() + "curaciones/saveMount", data, { headers: authHeader() });
    return res.data;
  }
  
  async saveCuracion(data) {
    const res = await axios
    .post(baseURL() + "curaciones/save", data, { headers: authHeader() });
    return res.data;
  }

  async getCuracion(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "curaciones/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getCreateConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "procesamientos/comprobanteCreate/" + requerimientoId, { headers: authHeader() });
    return res.data;
  }  

  async getAlmacenados(id) { 
    const res = await axios
    .get(baseURL() + "curaciones/storedById/" + id, { headers: authHeader() });
    return res.data;
  } 

}

export default new CuracionService();
