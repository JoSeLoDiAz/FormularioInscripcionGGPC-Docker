import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useTipoDocumentoStore = defineStore(
  "TipoDocumento",
  () => {
    const cargando = ref(false);

    const buscarTipoDocumento = async (documentoempresa = null) => {
      cargando.value = true;
      try {
        let url = `${direccion}/tipodocumento`;

        if (documentoempresa !== null) {
          url += `?documentoempresa=${documentoempresa}`;
        }

        const { data } = await axios.get(url);
        const lista = data.data ?? [];
        return [...lista];
      } catch (error) {
        console.error("Error buscando tipos documento:", error);
        return [];
      } finally {
        cargando.value = false;
      }
    };

    const buscarTipoDocumentoId = async (id) => {
      cargando.value = true;
      try {
        const { data } = await axios.get(`${direccion}/tipodocumento/${id}`);
        return data;
      } finally {
        cargando.value = false;
      }
    };

    return { cargando, buscarTipoDocumento, buscarTipoDocumentoId };
  },
  { persist: true }
);
