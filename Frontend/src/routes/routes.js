import { createRouter, createWebHistory } from 'vue-router';
import Login from "../components/Login.vue";
import RegistroAsistencia from "../components/RegistroAsistencia.vue";
import Usuario from "../components/usuario.vue";

import { useLoginStore } from "../stores/login.js";

const checkAuth = () => {
  const loginStore = useLoginStore();

  if (!loginStore.token) {
    return { name: "login" };
  }

  return true;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/registrolanzamiento2026'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: "Iniciar Sesión - SENA"
      }
    },
    {
      path: '/registrolanzamiento2026',
      name: 'Registro',
      component: RegistroAsistencia,
      meta: {
        title: "Registro - Evento FCE 2026"
      }
    },
    {
    path: '/usuario',
    name: 'Usuario',
    component: Usuario,
    meta: {
      title: "Usuario"
    },
    beforeEnter: checkAuth
    }
  ]
})

router.afterEach((to) => {
  const defaultTitle = "Evento FCE 2026";
  document.title = to.meta.title || defaultTitle;
});

export default router
