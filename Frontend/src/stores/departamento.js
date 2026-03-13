import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useDepartamentoStore = defineStore("Departamento", () => {
let cargando=ref(false)
  const buscarDepartamento= async()=> {
    try {
    cargando.value=true
    const Departamento= await axios.get(`${direccion}/departamento`)
    Departamento.data.buscar
     return Departamento.data.buscar
    }catch (error) {
      cargando.value=true;
      return error.response
    }finally{
      cargando.value=false
    }
    }

    const buscarDepartamentoId = async (id) => {
      try {
        cargando.value=true;
        let response = await axios.get(`${direccion}/departamento/${id}`);
        return response.data;
      } catch (error) {
        cargando.value=true;
       throw error
      }finally{
        cargando.value=false;
      }
    };


  return {
      buscarDepartamento,
      buscarDepartamentoId,
    };

},

{
persist: true,
}

)
