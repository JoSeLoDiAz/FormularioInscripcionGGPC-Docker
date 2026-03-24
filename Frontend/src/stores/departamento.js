import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useDepartamentoStore = defineStore("Departamento", () => {
  const cargando = ref(false);

  const buscarDepartamento = async () => {
    try {
      cargando.value = true;
      const res = await axios.get(`${direccion}/departamento`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("Error buscando departamentos:", error);
      return [];
    } finally {
      cargando.value = false;
    }
  };

  const buscarDepartamentoId = async (id) => {
    try {
      cargando.value = true;
      const res = await axios.get(`${direccion}/departamento/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error buscando departamento por id:", error);
      throw error;
    } finally {
      cargando.value = false;
    }
  };

  return { cargando, buscarDepartamento, buscarDepartamentoId };
}, { persist: true });
