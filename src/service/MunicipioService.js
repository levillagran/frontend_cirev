import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class MunicipioService {

  async getMunicipios() {
    const res = await axios
    .get(baseURL() + "municipios/add", { headers: authHeader() });
    return res.data;
  }

  async postMunicipios(data) {
    const res = await axios
    .post(baseURL() + "municipios/save", data, { headers: authHeader() });
    return res.data;
  }

  async getComprobante(id) {
    const res = await axios
    .get(baseURL() + "municipios/comprobante/" + id, { headers: authHeader() });
    return res.data.documento;
  }

}

export default new MunicipioService();
