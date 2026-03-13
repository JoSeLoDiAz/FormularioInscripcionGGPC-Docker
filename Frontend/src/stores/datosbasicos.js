import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useDatosBasicosStore = defineStore("DatosBasicos", () => {
  let cargando = ref(false)
  const registrarDatosBasicos = async (info) => {
    try {
      cargando.value = true
      let datos = await axios.post(`${direccion}/datosbasicos`, info);
      return datos;
    } catch (error) {
      cargando.value = true
      throw error;
    } finally {
      cargando.value = false
    }
  };

  const buscarDatosBasicos = async () => {
    try {
      cargando.value = true
      const datosbasicos = await axios.get(`${direccion}/datosbasicos`)
      return datosbasicos.data.reverse()
    } catch (error) {
      cargando.value = true;
      return error.response
    } finally {
      cargando.value = false
    }
  }

  const buscarDatosBasicosId = async (id) => {
    try {
      cargando.value = true;
      let response = await axios.get(`${direccion}/datosbasicos/id/${id}`);
      return response.data;
    } catch (error) {
      cargando.value = true;
      throw error
    } finally {
      cargando.value = false;
    }
  };

  const buscarStats = async () => {
    try {
      const res = await axios.get(`${direccion}/datosbasicos/stats`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const buscarDatosBasicosNumIdentificacion = async (numeroidentificacion) => {
    try {
      cargando.value = true;
      let response = await axios.get(`${direccion}/datosbasicos/${numeroidentificacion}`);
      return response.data;
    } catch (error) {
      cargando.value = true;
      throw error
    } finally {
      cargando.value = false;
    }
  };

  const editarDatosBasicos = async (id, payload) => {
    try {
      cargando.value = true;
      const response = await axios.put(`${direccion}/datosbasicos/${id}`, payload);
      return response.data;
    } finally {
      cargando.value = false;
    }
  };

  return {
    registrarDatosBasicos,
    buscarDatosBasicos,
    buscarDatosBasicosId,
    buscarDatosBasicosNumIdentificacion,
    editarDatosBasicos,
    buscarStats,
  };

},

  {
    persist: true,
  }

)
