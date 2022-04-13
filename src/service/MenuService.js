import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class MenuService {

  async getMenu(rol , modulo) {
    const res = await axios
    .post(baseURL() + "menu", { codeRole: rol, module: modulo }, { headers: authHeader() })
    .catch(err => {
      console.log("token caducado");
      localStorage.clear();
      window.location.href = "./";
    });
    return res.data;
  }

  async getSubMenu(data) {
    const res = await axios
      .post(baseURL() + "subMenu", data, { headers: authHeader() })
      .catch(err => {
        console.log("token caducado sub");
        localStorage.clear();
        window.location.href = "./app";
      });
    return res.data
  }
}
 
export default new MenuService();
