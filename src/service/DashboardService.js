import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class DashboardService {

  async getEjes(id) {
    const res = await axios
    .get(baseURL() + "dashboard/ejes/" + id, { headers: authHeader() });
    return res.data;
  }

  async getComponentes() {
    const res = await axios
    .get(baseURL() + "dashboard/componentes/", { headers: authHeader() });
    return res.data;
  }

  async getComponente(id) {
    const res = await axios
    .get(baseURL() + "dashboard/componente/" + id, { headers: authHeader() });
    return res.data;
  }

  async getNumMuni() {
    const res = await axios
    .get(baseURL() + "dashboard/numMuniAdheridos/", { headers: authHeader() });
    return res.data;
  }

  async getPocentages() {
    const res = await axios
    .get(baseURL() + "dashboard/porcentajes/", { headers: authHeader() });
    return res.data;
  }

}

export default new DashboardService();
