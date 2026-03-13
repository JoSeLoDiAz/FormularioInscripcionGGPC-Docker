import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useEmpresaStore = defineStore("Empresa", () => {
let cargando=ref(false)

  const buscarEmpresa = async () => {
    try {
      cargando.value = true;
      const res = await axios.get(`${direccion}/empresa`);
      return (res.data?.data || []).slice().reverse();
    } catch (error) {
      return error.response;
    } finally {
      cargando.value = false;
    }
  };

  const buscarEmpresaId = async (id) => {
    try {
      cargando.value = true;
      const response = await axios.get(`${direccion}/empresa/id/${id}`);
      return response.data;
    } finally {
      cargando.value = false;
    }
  };

  const buscarEmpresaPorNumero = async (numeroidentificacion) => {
    try {
      const res = await axios.get(`${direccion}/empresa/nit/${numeroidentificacion}`);
      return res.data;
    } catch (err) {
      // 404 = no existe -> normal
      if (err?.response?.status === 404) return null;
      throw err;
    }
  };

  const registrarEmpresa = async (payload) => {
    try {
      cargando.value = true;
      const res = await axios.post(`${direccion}/empresa`, payload);
      return res.data; // ideal: devuelva {empresa: {...}} o el doc directo
    } finally {
      cargando.value = false;
    }
  };

  const editarEmpresa = async (id, payload) => {
    try {
      cargando.value = true;
      const res = await axios.put(`${direccion}/empresa/${id}`, payload);
      return res.data;
    } finally {
      cargando.value = false;
    }
  };


  return {
    buscarEmpresa,
    buscarEmpresaId,
    registrarEmpresa,
    editarEmpresa,
    buscarEmpresaPorNumero
  };

},

{
persist: true,
}

)
