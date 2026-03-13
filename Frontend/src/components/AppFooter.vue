<template>
  <footer class="betowa-footer">
    <div class="footer-main py-5">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4">
            <div class="footer-brand d-flex align-items-center gap-2 mb-3">
              <img src="@/assets/sena-logo.svg" alt="SENA" height="45" class="logo-white" />
              <span class="fs-4 fw-bold text-white">Portal FCE - GGPC</span>
            </div>
            <div class="social-links d-flex gap-2">
              <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
              <a href="https://www.youtube.com/@GGPC-SENA" class="social-icon"><i class="bi bi-youtube"></i></a>
            </div>
            <div class="version-tag mt-4">
              <span class="badge rounded-pill bg-dark-opacity">v1.0.4-stable</span>
            </div>
          </div>

          <div class="col-lg-4">
            <h5 class="fw-bold text-white mb-3">Dirección general - Direccion Sistema Nacional de Formación para el Trabajo</h5>
            <address class="text-white-80 small">
              Calle 57 No. 8 - 69 - Piso 7, Bogotá D.C.<br>
              (Cundinamarca), Colombia<br><br>
              <strong>Horario de atención:</strong><br>
              Lunes a viernes: 7:00 a.m. a 7:00 p.m.<br>
              Sábados: 8:00 a.m. a 1:00 p.m.
            </address>
          </div>

          <div class="col-lg-4">
            <h5 class="fw-bold text-white mb-3">Líneas de atención</h5>
            <div class="contact-info d-flex flex-column gap-2 small">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-telephone-fill"></i>
                <span>Bogotá: +57 (601) 736 60 60</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-telephone-inbound-fill"></i>
                <span>Línea gratuita nacional: 018000910270</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-whatsapp"></i>
                <span>WhatsApp: 3112545028</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-gov">
      <div class="container d-flex justify-content-between align-items-center py-2">
        <div class="gov-logo">
          <img src="https://betowa.sena.edu.co/assets/logos/gov-logo-new.svg" alt="gov.co" height="25">
        </div>
        <div class="copy text-white small">
          Copyright © 2026 | Todos los derechos reservados
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.betowa-footer {
  background-color: var(--sena-green);
  /* #39a900 */
  position: relative;
  overflow: hidden;
}
.footer-badge {
  height: 55px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.footer-badge:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
}

.footer-badge-gov {
  height: 28px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* Simulación de la curva del paisaje en el diseño Betowa */
.footer-main {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
  position: relative;
  z-index: 1;
}

/* Para darle ese toque de ilustración, podrías añadir un background-image aquí */

.footer-gov {
  background-color: var(--sena-blue);
  /* #00324d */
}

.logo-white {
  filter: brightness(0) invert(1);
}

.social-icon {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.social-icon:hover {
  background: white;
  color: var(--sena-green);
}

.bg-dark-opacity {
  background-color: rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>
