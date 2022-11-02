import axios from "axios";
import authHeader from './auth-header'
import baseURL from "./baseURL";
import baseURLCol from "./baseURLCollection";

class RequerimientoService {

  async getRequerimientos() {
    const res = await axios
    .get(baseURL() + "requerimientos/all", { headers: authHeader() });
    return res.data;
  }

  async saveRequerimiento(data) {
    console.log(data)
    const res = await axios
    .post(baseURL() + "requerimientos/save", data, { headers: authHeader() });
    return res.data;
  }

  async getRequerimiento(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "requerimientos/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getCreateConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "requerimientos/comprobanteCreate/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getConprovante(requerimientoId) { 
    const res = await axios
    .get(baseURL() + "requerimientos/comprobanteView/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async postSaveEvidence(data) { 
    const res = await axios
    .post(baseURL() + "requerimientos/comprobanteSave", data, { headers: authHeader() });
    return res.data;
  } 

  async getRequerimientosColeccion() {
    const res = await axios
    .get(baseURLCol() + "requerimientos/all", { headers: authHeader() });
    return res.data;
  }

  async saveRequerimientoColeccion(data) {
    console.log(data)
    const res = await axios
    .post(baseURLCol() + "requerimientos/save", data, { headers: authHeader() });
    return res.data;
  }

  async getCreateConprovanteColeccion(requerimientoId) { 
    const res = await axios
    .get(baseURLCol() + "requerimientos/comprobanteCreate/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getRequerimientoColeccion(requerimientoId) { 
    const res = await axios
    .get(baseURLCol() + "requerimientos/findById/" + requerimientoId, { headers: authHeader() });
    return res.data;
  } 

  async getConprovanteColeccion(requerimientoId) { 
    const res = await axios
    .get(baseURLCol() + "requerimientos/comprobanteView/" + requerimientoId, { headers: authHeader() });
    return res.data;
  }

  async postSaveEvidenceColeccion(data) { 
    const res = await axios
    .post(baseURLCol() + "requerimientos/comprobanteSave", data, { headers: authHeader() });
    return res.data;
  } 

  async postSaveColector(data) { 
    const res = await axios
    .post(baseURLCol() + "requerimientos/colectorSave", data, { headers: authHeader() });
    return res.data;
  } 

}

export default new RequerimientoService();
