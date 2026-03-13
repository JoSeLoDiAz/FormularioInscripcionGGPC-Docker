import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";

// Importación de fuentes modernas (opcional pero recomendada para el look Betowa)
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./routes/routes";
import "./style.css"; // Aquí residen sus gradientes institucionales

const app = createApp(App);

// Configuración de Pinia con persistencia para no perder el estado al recargar
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Gestión de Errores Global (Modo Jarvis)
app.config.errorHandler = (err, instance, info) => {
  console.error("Hemos detectado una anomalía en los sistemas:", err);
  console.log("Contexto del error:", info);
};

app.use(pinia);
app.use(router);

// El sistema está listo para el despliegue
app.mount("#app");
