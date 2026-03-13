<template>
  <header class="main-header shadow-sm">
    <nav class="container d-flex align-items-center justify-content-between py-2">
      <div class="brand-zone d-flex align-items-center gap-3">
        <img src="@/assets/sena-logo.svg" alt="SENA" height="50" class="logo-sena" />
        <div class="divider"></div>
        <span class="app-title">Portal FCE - GGPC</span>
      </div>

      <div class="nav-links d-none d-md-flex gap-4">
        <router-link to="/login" class="nav-item">Acceso Administrativo</router-link>
        <!-- <router-link to="/registro" class="nav-item">Registro</router-link> -->
      </div>
    </nav>
  </header>
</template>

<style scoped>
.main-header {
  background: var(--betowa-gradient);
  color: white;
  border-bottom: 3px solid var(--sena-green);
}

.divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
}

.app-title {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: var(--sena-green);
}

.logo-sena {
  filter: brightness(0) invert(1);
}

/* Para que se vea blanco sobre el fondo oscuro */
</style>
