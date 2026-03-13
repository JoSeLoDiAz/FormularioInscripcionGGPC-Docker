import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isLoading: false,
    progress: 0,
    message: "Preparando protocolos de carga...",
    _startedAt: 0,
    _minMs: 500, // <- mínimo visible
  }),
  actions: {
    startLoading(msg = "Cargando...", minMs = 500) {
      this.isLoading = true;
      this.message = msg;
      this.progress = 0;
      this._startedAt = Date.now();
      this._minMs = minMs;
    },
    updateProgress(val) {
      this.progress = Math.max(0, Math.min(100, Number(val) || 0));
    },
    async finishLoading() {
      this.progress = 100;

      const elapsed = Date.now() - (this._startedAt || Date.now());
      const remaining = Math.max(0, (this._minMs || 0) - elapsed);

      // Espera lo que falte para que se vea (si ya duró suficiente, 0ms)
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }

      // margen visual
      setTimeout(() => {
        this.isLoading = false;
      }, 150);
    },
  },
});
