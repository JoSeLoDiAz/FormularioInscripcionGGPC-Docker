import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useCiudadStore = defineStore("Ciudad", () => {
let cargando=ref(false)

  const buscarCiudad= async()=> {
    try {
    cargando.value=true
    const Ciudad= await axios.get(`${direccion}/ciudad`)
    Ciudad.data.buscar
     return Ciudad.data.buscar
    }catch (error) {
      cargando.value=true;
      return error.response
    }finally{
      cargando.value=false
    }
    }

    const buscarCiudadId = async (id) => {
      try {
        cargando.value=true;
        let response = await axios.get(`${direccion}/ciudad/${id}`);
        return response.data;
      } catch (error) {
        cargando.value=true;
       throw error
      }finally{
        cargando.value=false;
      }
    };


  return {
      buscarCiudad,
      buscarCiudadId,
    };

},

{
persist: true,
}

)
