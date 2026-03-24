import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useCiudadStore = defineStore("Ciudad", () => {
  const cargando = ref(false);

  const buscarCiudad = async (departamentoid = null) => {
    try {
      cargando.value = true;
      let url = `${direccion}/ciudad`;
      if (departamentoid !== null) {
        url += `?departamentoid=${departamentoid}`;
      }
      const res = await axios.get(url);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("Error buscando ciudades:", error);
      return [];
    } finally {
      cargando.value = false;
    }
  };

  const buscarCiudadId = async (id) => {
    try {
      cargando.value = true;
      const res = await axios.get(`${direccion}/ciudad/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error buscando ciudad por id:", error);
      throw error;
    } finally {
      cargando.value = false;
    }
  };

  return { cargando, buscarCiudad, buscarCiudadId };
}, { persist: true });
