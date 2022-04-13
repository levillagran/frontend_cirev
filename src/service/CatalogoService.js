import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";

class CatalogoService {

  async getProyectos() {
    const res = await axios
    .get(baseURL() + "catalogos/proyectos", { headers: authHeader() });
    return res.data;
  }

  async getUsuarios(isInternal) {
    const res = await axios
    .get(baseURL() + "catalogos/usuarios/" + isInternal, { headers: authHeader() });
    return res.data;
  } 

  async getAnalisis(projectId) { 
    const res = await axios
    .get(baseURL() + "catalogos/analisis/" + projectId, { headers: authHeader() });
    return res.data;
  } 

  async getEspecificaciones(analisisId) { 
    const res = await axios
    .get(baseURL() + "catalogos/especificaciones/" + analisisId, { headers: authHeader() });
    return res.data;
  } 

  async getTipoMuestra() {
    const res = await axios
    .get(baseURL() + "catalogos/tipoMuestra", { headers: authHeader() });
    return res.data;
  }

  async getTaxonomia() {
    const res = await axios
    .get(baseURL() + "catalogos/taxonomia", { headers: authHeader() });
    return res.data;
  }

  async getGenero() {
    const res = await axios
    .get(baseURL() + "catalogos/genero", { headers: authHeader() });
    return res.data;
  }

  async getAlmacen(proyectoId) {
    const res = await axios
    .get(baseURL() + "catalogos/almacen/" + proyectoId, { headers: authHeader() });
    return res.data;
  }

  async getProvincias() {
    const res = await axios
    .get(baseURL() + "catalogos/provincias", { headers: authHeader() });
    return res.data;
  }

  async getCantones(provinciaId) {
    const res = await axios
    .get(baseURL() + "catalogos/cantones/" + provinciaId, { headers: authHeader() });
    return res.data;
  }

  async getParroquias(cantonId) {
    const res = await axios
    .get(baseURL() + "catalogos/parroquias/" + cantonId, { headers: authHeader() });
    return res.data;
  }

}

export default new CatalogoService();  
