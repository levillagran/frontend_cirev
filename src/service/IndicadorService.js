import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class IndicadorService {

  async postIndicadores(data) {
    const res = await axios
    .post(baseURL() + "indicadores/save", data, { headers: authHeader() });
    return res.data;
  }

  async getIndicadores(id) {
    const res = await axios
    .get(baseURL() + "indicadores/canton/" + id, { headers: authHeader() });
    return res.data;
  }

  async getSemaforizacion(id) {
    const res = await axios
    .get(baseURL() + "indicadores/semaforizacion/" + id, { headers: authHeader() });
    return res.data;
  }

  async getComprobante(id) {
    const res = await axios
    .get(baseURL() + "indicadores/comprobante/" + id, { headers: authHeader() });
    return res.data;
  }

}

export default new IndicadorService();
