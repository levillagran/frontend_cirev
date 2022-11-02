import axios from "axios";
import authHeader from '../auth-header'
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

  async getFilos() { 
    const res = await axios
    .get(baseURL() + "catalogos/filos", { headers: authHeader() });
    return res.data;
  } 

  async getClases(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/clases/" + id, { headers: authHeader() });
    return res.data;
  }

  async getOrdenes(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/ordenes/" + id, { headers: authHeader() });
    return res.data;
  }

  async getFamilias(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/familias/" + id, { headers: authHeader() });
    return res.data;
  }

  async getSubfamilias(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/subfamilias/" + id, { headers: authHeader() });
    return res.data;
  }

  async getGeneros(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/generos/" + id, { headers: authHeader() });
    return res.data;
  }

  async getSubgeneros(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/subgeneros/" + id, { headers: authHeader() });
    return res.data;
  }

  async getEspecies(id) { 
    const res = await axios
    .get(baseURL() + "catalogos/especies/" + id, { headers: authHeader() });
    return res.data;
  }

  async getSexos() { 
    const res = await axios
    .get(baseURL() + "catalogos/sexos", { headers: authHeader() });
    return res.data;
  }

  async getMetodos() { 
    const res = await axios
    .get(baseURL() + "catalogos/metodos", { headers: authHeader() });
    return res.data;
  }

  async getVouchers() { 
    const res = await axios
    .get(baseURL() + "catalogos/vouchers", { headers: authHeader() });
    return res.data;
  }

  async getMetodColectaAdul() {
    const res = await axios
    .get(baseURL() + "catalogos/metodoColectaAdulto", { headers: authHeader() });
    return res.data;
  }

  async getMetodColectaInma() {
    const res = await axios
    .get(baseURL() + "catalogos/metodoColectaInmaduro", { headers: authHeader() });
    return res.data;
  }

  async getHabitats() {
    const res = await axios
    .get(baseURL() + "catalogos/habitats", { headers: authHeader() });
    return res.data;
  }

  async getTaxonomia() {
    const res = await axios
    .get(baseURL() + "catalogos/taxon", { headers: authHeader() });
    return res.data;
  }

  async getColectores(projectId) {
    const res = await axios
    .get(baseURL() + "catalogos/colectores/" + projectId, { headers: authHeader() });
    return res.data;
  }

  async getAnalisis() { 
    const res = await axios
    .get(baseURL() + "catalogos/analisis", { headers: authHeader() });
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

  async getIdentificadores() { 
    const res = await axios
    .get(baseURL() + "catalogos/identificadores", { headers: authHeader() });
    return res.data;
  } 

  async getDigitadores() { 
    const res = await axios
    .get(baseURL() + "catalogos/digitadores", { headers: authHeader() });
    return res.data;
  } 
 
}

export default new CatalogoService();  
