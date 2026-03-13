<template>
  <div v-if="appStore.isLoading" class="loading-overlay">
    <div class="loader-box">
      <div class="logo-wrap wobble">
        <img :src="logoFce" class="logo base" alt="FCE" />
        <img :src="logoFce" class="logo color" :style="{ clipPath: `inset(0 ${100 - appStore.progress}% 0 0)` }"
          alt="FCE" />
      </div>

      <div class="progress-text">
        {{ appStore.message }} <span class="fw-semibold">{{ appStore.progress }}%</span>
      </div>

      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" :style="{ width: appStore.progress + '%' }"></div>
      </div>

      <div class="small text-muted mt-2">
        Cargando recursos del sistema
      </div>
    </div>
  </div>
</template>

<script setup>
import logoFce from "@/assets/logo fce 2026-02.png";
import { useAppStore } from "../stores/appStores";

const appStore = useAppStore();
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  display: grid;
  place-items: center;
  z-index: 99999;
}

.loader-box {
  width: min(420px, 92vw);
  text-align: center;
  padding: 24px;
}

.logo-wrap {
  position: relative;
  width: min(320px, 78vw);
  margin: 0 auto 14px;
}

.logo {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}

.logo.base {
  filter: grayscale(1) brightness(1.05);
  opacity: 0.55;
}

.logo.color {
  position: absolute;
  inset: 0;
}

.wobble {
  animation: wobble 1.4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes wobble {
  0% {
    transform: rotate(-1.2deg) translateY(0);
  }

  50% {
    transform: rotate(1.2deg) translateY(-2px);
  }

  100% {
    transform: rotate(-1.2deg) translateY(0);
  }
}

.progress-bar-wrap {
  height: 10px;
  background: #e9ecef;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar-fill {
  height: 100%;
  width: 0%;
  background: #00324D;
  transition: width 0.15s linear;
}

.progress-text {
  margin-top: 10px;
  font-size: 14px;
}
</style>
