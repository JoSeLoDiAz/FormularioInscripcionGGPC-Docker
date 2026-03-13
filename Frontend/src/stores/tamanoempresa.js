import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useTamanoEmpresaStore = defineStore("TamanoEmpresa", () => {
  const cargando = ref(false);

  const buscarTamanoEmpresa = async () => {
    try {
      cargando.value = true;
      const res = await axios.get(`${direccion}/tamanoempresa`);
      return res.data?.data ?? [];
    } finally {
      cargando.value = false;
    }
  };

  return { cargando, buscarTamanoEmpresa };
}, { persist: true });
