<template>
  <transition name="toast-fade">
    <div v-if="show" class="toast-betowa" :class="`toast-${normalizedType}`" role="status" aria-live="polite">
      <div class="toast-icon">
        <span v-if="normalizedType === 'success'">✓</span>
        <span v-else-if="normalizedType === 'warning'">!</span>
        <span v-else>×</span>
      </div>

      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-text">{{ message }}</div>
      </div>

      <button class="toast-close" type="button" aria-label="Cerrar" @click="close">×</button>

      <div class="toast-progress">
        <div class="toast-progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  duration: { type: Number, default: 4200 },
  // success | warning | error
  type: { type: String, default: "success" },
  title: { type: String, default: "Registro exitoso" },
  message: { type: String, default: "" },
});

const emit = defineEmits(["update:show", "closed"]);

const normalizedType = computed(() => {
  const t = (props.type || "").toLowerCase();
  if (t === "success" || t === "warning" || t === "error") return t;
  return "success";
});

const progress = ref(100);
let timer = null;
let tick = null;

function close() {
  clearTimeout(timer);
  clearInterval(tick);
  progress.value = 0;
  emit("update:show", false);
  emit("closed");
}

watch(
  () => props.show,
  (v) => {
    if (!v) return;

    clearTimeout(timer);
    clearInterval(tick);

    progress.value = 100;

    const start = Date.now();
    const total = props.duration;

    tick = setInterval(() => {
      const elapsed = Date.now() - start;
      progress.value = Math.max(0, 100 - Math.round((elapsed / total) * 100));
    }, 60);

    timer = setTimeout(close, props.duration);
  }
);

onUnmounted(() => {
  clearTimeout(timer);
  clearInterval(tick);
});
</script>

<style scoped>
/* ===== Base ===== */
.toast-betowa {
  position: fixed;
  top: 18px;
  right: 18px;
  width: min(520px, calc(100vw - 36px));
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 18px;
  padding: 16px 16px 12px;
  box-shadow: 0 22px 70px rgba(0, 0, 0, .18);
  display: grid;
  grid-template-columns: 40px 1fr 34px;
  gap: 12px;
  z-index: 20000;
  overflow: hidden;
}

/* icono */
.toast-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 950;
  color: #fff;
  box-shadow: 0 12px 26px rgba(0, 0, 0, .18);
}

.toast-title {
  font-weight: 900;
  font-size: 1.05rem;
  line-height: 1.1;
}

.toast-text {
  margin-top: 4px;
  font-size: .92rem;
  line-height: 1.25;
}

.toast-close {
  border: none;
  background: transparent;
  font-size: 30px;
  line-height: 1;
  color: rgba(0, 0, 0, .45);
  cursor: pointer;
  padding: 0;
  margin-top: -2px;
}

.toast-close:hover {
  color: rgba(0, 0, 0, .70);
}

.toast-progress {
  grid-column: 1 / -1;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, .10);
  overflow: hidden;
  margin-top: 10px;
}

.toast-progress-bar {
  height: 100%;
  transition: width .08s linear;
}

/* ===== Variantes por tipo ===== */

/* SUCCESS */
/* SUCCESS */
.toast-success {
  background: #eefaf0;
}

.toast-success .toast-icon {
  /* ANTES: background: var(--betowa-gradient); */
  background: var(--betowa-gradient);
  box-shadow: 0 12px 26px rgba(108, 41, 179, .20);
  /* opcional: si quieres el mismo glow morado */
}

.toast-success .toast-title {
  color: #0f5132;
}

.toast-success .toast-text {
  color: rgba(15, 81, 50, .78);
}

.toast-success .toast-progress-bar {
  background: var(--betowa-gradient);
}
/* WARNING */
.toast-warning {
  background: #fff7e6;
}

.toast-warning .toast-icon {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}

.toast-warning .toast-title {
  color: #7a4a00;
}

.toast-warning .toast-text {
  color: rgba(122, 74, 0, .82);
}

.toast-warning .toast-progress-bar {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}

/* ERROR */
.toast-error {
  background: #fdecec;
}

.toast-error .toast-icon {
  background: linear-gradient(135deg, #b00020, #e11d48);
}

.toast-error .toast-title {
  color: #7f1d1d;
}

.toast-error .toast-text {
  color: rgba(127, 29, 29, .82);
}

.toast-error .toast-progress-bar {
  background: linear-gradient(135deg, #b00020, #e11d48);
}

/* ===== Animación ===== */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: transform .18s ease, opacity .18s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
