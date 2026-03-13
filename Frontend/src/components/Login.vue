<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-bg">

    <div class="login-card">

      <!-- ══ PANEL IZQUIERDO – Ilustración ══ -->
      <div class="panel-illus">
        <!-- Figuras flotantes -->
        <span class="shape shape-circle  s1"></span>
        <span class="shape shape-triangle s2"></span>
        <span class="shape shape-square  s3"></span>
        <span class="shape shape-square  s4"></span>
        <span class="shape shape-play    s5"></span>

        <!-- Círculo con logo -->
        <div class="illus-circle">
          <div class="illus-icon-box">
            <img
              src="@/assets/sena-logo.svg"
              alt="SENA"
              class="sena-logo"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
            />
            <!-- Fallback si no carga el SVG -->
            <div class="logo-fallback" style="display:none">
              <i class="fa fa-user-graduate"></i>
              <span>SENA</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ PANEL DERECHO – Formulario ══ -->
      <div class="panel-form">

        <div class="form-brand">
          <div class="brand-dot"></div>
          <span class="brand-text">Portal Institucional</span>
        </div>

        <h2 class="form-title">Iniciar Sesión</h2>

        <!-- Mensaje de error -->
        <div v-if="errorMsg" class="alert-error">
          <i class="fa fa-circle-exclamation"></i>
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" novalidate>

          <!-- Email -->
          <div class="field-wrap">
            <i class="fa fa-envelope f-icon"></i>
            <input
              v-model="form.email"
              type="email"
              placeholder="Correo electrónico"
              autocomplete="email"
            />
          </div>

          <!-- Contraseña -->
          <div class="field-wrap">
            <i class="fa fa-lock f-icon"></i>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              autocomplete="current-password"
            />
            <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </button>
          </div>

          <!-- Olvidé contraseña -->
          <div class="forgot-row">
            <a href="#">¿Olvidaste tu <strong>contraseña?</strong></a>
          </div>

          <!-- Botón -->
          <button type="submit" class="btn-login" :disabled="useLogin.loading">
            <span v-if="!useLogin.loading">Login</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Ingresando...
            </span>
          </button>

        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '../stores/login.js'

const useLogin = useLoginStore()
const router   = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const errorMsg     = ref('')

async function handleLogin() {
  errorMsg.value = ''

  if (!form.email || !form.password) {
    errorMsg.value = 'Por favor completa todos los campos.'
    return
  }

  await useLogin.inicio(form.email, form.password)
    .then(() => {
      router.push('/usuario')
    })
    .catch((error) => {
      if (error.response?.data?.errors) {
        errorMsg.value = error.response.data.errors[0].msg
      } else if (error.response?.data?.msg) {
        errorMsg.value = error.response.data.msg
      } else {
        errorMsg.value = 'No se pudo conectar con el servidor.'
      }
    })
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

/* ── FONDO ── */
.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--betowa-gradient);
  background-attachment: fixed;
  padding: 24px;
}

/* ── TARJETA glass-card ── */
.login-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  width: 100%;
  max-width: 1100px;
  min-height: 580px;
  display: flex;
  flex-direction: row;
  animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
}

/* ══ PANEL IZQUIERDO ══ */
.panel-illus {
  background: var(--betowa-gradient);
  flex: 0 0 42%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 60px 30px;
  overflow: hidden;
}

.illus-circle {
  width: 270px;
  height: 270px;
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: float 5s ease-in-out infinite;
  backdrop-filter: blur(4px);
}

.illus-icon-box {
  width: 160px;
  height: 120px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  padding: 14px;
  backdrop-filter: blur(8px);
}

.sena-logo {
  width: 115px;
  height: auto;
  object-fit: contain;
}

.logo-fallback {
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--sena-blue);
}
.logo-fallback i    { font-size: 30px; }
.logo-fallback span { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; color: var(--sena-green); }

/* ── Figuras flotantes ── */
.shape { position: absolute; z-index: 0; }

.shape-circle {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2.5px solid;
}
.shape-triangle {
  width: 0; height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 16px solid;
}
.shape-square {
  width: 14px; height: 14px;
  border: 2.5px solid;
}
.shape-play {
  width: 0; height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 14px solid;
}

.s1 { top: 20%; left: 10%; border-color: var(--sena-green);             animation: float 3.2s ease-in-out infinite; }
.s2 { bottom: 20%; left: 16%; border-bottom-color: var(--glass-border); animation: float 4.0s ease-in-out infinite 0.5s; }
.s3 { top: 16%; right: 12%; border-color: var(--glass-border);          animation: float 3.6s ease-in-out infinite 1.0s; }
.s4 { bottom: 26%; right: 8%; border-color: var(--sena-green);          animation: float 4.4s ease-in-out infinite 0.3s; }
.s5 { top: 48%; left: 4%; border-left-color: var(--glass-border);       animation: float 3.8s ease-in-out infinite 0.8s; }

/* ══ PANEL DERECHO ══ */
.panel-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 60px;
}

.form-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.brand-dot {
  width: 9px; height: 9px;
  background: var(--betowa-gradient);
  border-radius: 50%;
}
.brand-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--betowa-purple);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--sena-blue);
  margin-bottom: 32px;
}

/* Error */
.alert-error {
  background: #fff2f2;
  border: 1px solid #ffcdd2;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 12px;
  color: #c62828;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Inputs */
.field-wrap {
  position: relative;
  margin-bottom: 18px;
}
.f-icon {
  position: absolute;
  left: 18px; top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 13px;
  pointer-events: none;
  z-index: 2;
}
.field-wrap input {
  width: 100%;
  background: #f3f3f3;
  border: 2px solid transparent;
  border-radius: 50px;
  padding: 16px 52px 16px 50px;
  font-size: 14px;
  color: #2d3436;
  outline: none;
  transition: border-color .25s, background .25s, box-shadow .25s;
}
.field-wrap input::placeholder { color: #bbb; }
.field-wrap input:focus {
  background: #fff;
  border-color: var(--betowa-purple);
  box-shadow: 0 0 0 4px rgba(108,41,179,0.10);
}

.toggle-pass {
  position: absolute;
  right: 18px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: #bbb; cursor: pointer;
  font-size: 13px; z-index: 2;
  transition: color .2s;
  padding: 0;
}
.toggle-pass:hover { color: var(--betowa-purple); }

.forgot-row {
  text-align: right;
  margin-bottom: 24px;
  margin-top: -6px;
}
.forgot-row a {
  font-size: 12px;
  color: #aaa;
  text-decoration: none;
  transition: color .2s;
}
.forgot-row a strong { color: var(--betowa-purple); font-weight: 500; }
.forgot-row a:hover  { color: var(--betowa-purple); }

/* ── Botón LOGIN ── */
.btn-login {
  width: 100%;
  padding: 17px;
  border-radius: 50px;
  background: var(--betowa-gradient);
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: opacity .25s, box-shadow .25s, transform .15s;
}
.btn-login:hover:not(:disabled) {
  opacity: 0.88;
  box-shadow: 0 10px 32px rgba(108,41,179,0.40);
  transform: translateY(-1px);
}
.btn-login:active   { transform: translateY(0); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-login::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform .5s;
}
.btn-login:hover::after { transform: translateX(100%); }

/* ── Animaciones ── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-9px); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .login-card     { flex-direction: column; }
  .panel-illus    { flex: none; padding: 40px 20px; }
  .illus-circle   { width: 170px; height: 170px; }
  .illus-icon-box { width: 108px; height: 82px; }
  .sena-logo      { width: 78px; }
  .panel-form     { padding: 40px 32px; }
}
</style>