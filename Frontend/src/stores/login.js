import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { direccion } from "../routes/direccion.js";

export const useLoginStore = defineStore("Login", () => {

    const token = ref('');
    let loading = ref(false);

    const inicio = async (email, password) => {
      try {
        loading.value = true;
        let datos = await axios.post(`${direccion}/login/token`, {
          email: email,
          password: password,
        });
        token.value = datos.data.token;
        return datos;
      } catch (error) {
        loading.value = true;
        throw error;
      } finally {
        loading.value = false;
      }
    };

return {
      inicio,
      token,
    };
},
    {
    persist: true,
   }
)
