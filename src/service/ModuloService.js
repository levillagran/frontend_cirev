import axios from "axios";
import baseURL from "./baseURL";

class ModuloService {

  getModulos() {
    let url = baseURL();
    return axios
      .get(url + "modulos/list")
      .then(response => {
        return response.data;
      })
      .catch(err => {
        localStorage.clear();
      });
  }

}

export default new ModuloService();
