<template>
  <!-- MODAL HABEAS DATA (BLOQUEANTE) -->
  <div>
    <div v-show="showHabeasModal" class="modal-backdrop-hard">
      <div class="modal-hard" role="dialog" aria-modal="true">
        <div class="modal-hard-header">
          <div class="d-flex align-items-center gap-2">
            <img :src="logoSena" alt="SENA" class="img-fluid" width="50" height="50">
            <h5 class="m-0">Términos y Condiciones - Habeas Data</h5>
          </div>
        </div>

        <div class="modal-hard-body">
          <div class="alert alert-light border mb-3">
            De conformidad con lo dispuesto en la Ley 1581 de 2012, su Decreto Reglamentario 1377 de 2013 y el Acuerdo
            No. 009 de 2016, AUTORIZO de manera libre, previa, expresa, voluntaria y debidamente informada, a que el
            Servicio Nacional de Aprendizaje – SENA recolecte, recaude, almacene, use, circule, suprima, procese,
            compile, intercambie, de tratamiento, actualice y disponga de los datos que han sido suministrados y que se
            han incorporado en distintas bases o bancos de datos de todo tipo en el marco de las convocatorias que
            adelanta el Grupo de Gestión para la Productividad y la Competitividad. <br>En este sentido, el SENA queda
            autorizado de manera expresa e inequivoca para mantener y manejar toda mi información personal y
            profesional para los fines que se encuentra legal y reglamentariamente facultado; para darlos a conocer a
            los gremios, empresas, personas naturales, entre otros que suscriban Convenios Especiales de Cooperación en
            el marco de las Convocatorias que adelanta el Grupo de Gestión para la Productividad y la Competitividad.
            <br>Sin perjuicio de lo anterior, los referidos datos no podrán ser distribuidos, comercializados,
            compartidos, suministrados o intercambiados con terceros, y en general, realizar actividades en las cuales
            se vea comprometida la confidencialidad y protección de la información recolectada, y podré en cualquier
            momento solicitar que la información sea modificada, actualizada o retirada de las bases de datos del SENA.
            <br>Así mismo, se me indicó que para mayor información podré consultar en cualquier momento el Acuerdo No.
            009 de 2016, “Por el cual se aprueba la Política de tratamiento de datos personales en el Servicio Nacional
            de Aprendizaje SENA” que se encuentra en la página de la Entidad: <a
              href="https://normograma.sena.edu.co/compilacion/docs/acuerdo_sena_0009_2016.htm" target="_blank">Acuerdo
              009 del 2016 - Tratamiento de Datos Personales - SENA</a>, la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </div>

          <hr class="my-3" />

          <div v-if="habeasDeclined" class="alert alert-danger mb-0">
            <strong>No es posible continuar</strong> con el registro si no acepta el tratamiento de datos.
            <div class="mt-2">
              <button class="btn btn-danger btn-sm" @click="reloadPage">
                Recargar página
              </button>
            </div>
          </div>
        </div>

        <div class="modal-hard-footer">
          <button class="btn btn-outline-secondary" @click="declineHabeas" :disabled="habeasDeclined">
            No acepto
          </button>
          <button class="btn btn-sena-action" @click="acceptHabeas" :disabled="habeasDeclined">
            Acepto
          </button>
        </div>
      </div>
    </div>

    <div v-if="habeasAccepted" class="container py-4 py-lg-5">
      <!-- Header / Hero -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card border-0 shadow-sm overflow-hidden">
            <!-- Imagen responsive (PC vs Mobile) -->
            <picture>
              <!-- Desktop -->
              <source :srcset="menuFormulario" media="(min-width: 768px)" />
              <!-- Mobile fallback -->
              <img :src="menuFormulario" class="w-100" alt="Evento de lanzamiento"
                style="object-fit: cover; max-height: 320px;" loading="lazy" />
            </picture>

            <div class="card-body p-4 p-lg-5">
              <div class="d-flex align-items-start gap-3">
                <div class="flex-grow-1">
                  <div class="hero-title mb-3">
                    <div class="hero-eyebrow">Formulario de confirmación</div>

                    <h1 class="hero-h1">
                      Evento de Lanzamiento · Convocatoria FCE 2026
                    </h1>

                    <div class="hero-sub">
                      Dirección del Sistema Nacional de Formación para el Trabajo
                      <span class="dot">•</span>
                      Formación Continua Especializada
                    </div>
                  </div>

                  <div class="small text-muted mb-4">
                    <div><strong>Fecha:</strong> 12 de marzo 2026</div>
                    <div><strong>Horario:</strong> 2:30 a 4:30 PM</div>
                    <div><strong>Tipo de asistencia:</strong> Presencial Híbrido</div>
                    <div>
                      <strong>Dirección presencial:</strong> Cra 30 #15-53 · SENA - Centro Nacional de Hotelería,
                      Turismo y Alimentos - Regional Distrito Capital
                    </div>
                    <div>
                      <strong>Enlace virtual:</strong>
                      <a :href="virtualLink" target="_blank" class="link-primary text-decoration-none">Microsoft
                        Teams</a>
                    </div>
                  </div>

                  <h6 class="kpi-title">
                    Estado actual de asistencia
                  </h6>
                  <div class="kpi-wrap mb-3">
                    <span class="kpi-badge kpi-presencial">
                      Presencial: <strong>{{ stats.presencialConfirmados }}</strong> de <strong>{{
                        stats.cupoMaxPresencial }}</strong>
                    </span>

                    <span class="kpi-badge kpi-virtual">
                      Virtual: <strong>{{ stats.virtualConfirmados }}</strong>
                    </span>

                    <span class="kpi-badge kpi-total">
                      Total asistentes: <strong>{{ stats.totalConfirmados }}</strong>
                    </span>

                    <span v-if="presencialLleno" class="kpi-badge kpi-alerta">
                      Cupo presencial agotado
                    </span>
                  </div>
                  <div class="kpi-progress">
                    <div class="kpi-progress-bar" :style="{ width: presencialPct + '%' }"></div>
                  </div>
                  <div class="kpi-progress-text">
                    Ocupación presencial: <strong>{{ presencialPct }}%</strong>
                  </div>

                  <!-- Texto solicitado debajo de la imagen -->
                  <div class="callout mb-4" role="note" aria-label="Información del evento">
                    <div class="callout-icon" aria-hidden="true">i</div>

                    <div class="callout-body">
                      <div class="callout-title">Información importante</div>
                      <p class="callout-text mb-0">
                        El Grupo de Gestión para la Productividad y la Competitividad, en el marco de la convocatoria de
                        Formación Continua Especializada, tiene el gusto de invitarle al evento de lanzamiento vigencia
                        2026.
                        En este formulario podrá confirmar su modalidad de asistencia.
                      </p>
                    </div>
                  </div>

                  <!-- Form -->
                  <form class="needs-validation" novalidate @submit.prevent="onSubmit">
                    <div class="row g-3">
                      <!-- Confirmación -->
                      <div class="col-12">
                        <label class="form-label fw-semibold mb-2">
                          Confirmación de asistencia <span class="text-danger">*</span>
                        </label>

                        <div class="asistencia-hint">
                          Recomendación: confirme su modalidad con anticipación. <strong>Agradecemos su
                            asistencia</strong> y puntualidad.
                        </div>

                        <div v-if="presencialLleno" class="alert alert-warning py-2 mt-2 mb-2">
                          Cupo presencial agotado ({{ stats.cupoMaxPresencial }}). Solo disponible modalidad
                          <strong>virtual</strong>.
                        </div>

                        <div class="asistencia-grid">
                          <!-- Presencial -->
                          <label class="asistencia-card" :class="{
                            active: form.asistenciaPresencial === 1,
                            disabled: presencialLleno
                          }">
                            <input class="visually-hidden" type="radio" name="asistencia"
                              v-model.number="form.asistenciaPresencial" :value="1" :disabled="presencialLleno" />
                            <div class="asistencia-title">
                              Presencial
                              <span class="asistencia-pill sena" v-if="!presencialLleno">SENA</span>
                              <span class="asistencia-pill agotado" v-else>AGOTADO</span>
                            </div>
                            <div class="asistencia-sub">
                              SENA - Centro Nacional de Hotelería, Turismo y Alimentos - Regional Distrito Capital
                            </div>
                            <div class="asistencia-meta">
                              Cupos: <strong>{{ stats.presencialConfirmados }}</strong> / <strong>{{
                                stats.cupoMaxPresencial }}</strong>
                            </div>
                          </label>

                          <!-- Virtual -->
                          <label class="asistencia-card" :class="{ active: form.asistenciaPresencial === 2 }">
                            <input class="visually-hidden" type="radio" name="asistencia"
                              v-model.number="form.asistenciaPresencial" :value="2" />
                            <div class="asistencia-title">
                              Virtual
                              <span class="asistencia-pill betowa">Teams</span>
                            </div>
                            <div class="asistencia-sub">
                              Microsoft Teams
                            </div>
                            <div class="asistencia-meta">
                              Confirmados: <strong>{{ stats.virtualConfirmados }}</strong>
                            </div>
                          </label>
                        </div>

                        <div class="invalid-feedback d-block" v-if="submitted && !form.asistenciaPresencial">
                          Seleccione una modalidad.
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-section">
                          <div class="form-section-title">Datos del participante</div>
                          <div class="form-section-sub">Información personal para validación y contacto.</div>
                        </div>
                      </div>

                      <!-- Tipo ID -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Tipo de identificación <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="form.tipoId" required>
                          <option value="" disabled>Seleccione…</option>
                          <option v-for="t in tipoDocPersona" :key="t.TIPODOCUMENTOID" :value="t.TIPODOCUMENTOID">
                            {{ (t.NOMBRE || "").toUpperCase() }}
                          </option>
                        </select>
                        <div class="invalid-feedback">Campo obligatorio.</div>
                      </div>

                      <!-- Número ID -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Número de identificación <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model.trim="form.numeroId" placeholder="Solo números"
                          @input="form.numeroId = onlyDigits(form.numeroId)" @blur="BuscarNumIdentificacion"
                          minlength="10" required />
                        <div class="invalid-feedback">Ingrese un número de identificación válido.</div>
                      </div>

                      <!-- Nombres -->
                      <div class="col-12">
                        <label class="form-label fw-semibold">
                          Nombres <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control capitalize" v-model.trim="form.nombres"
                          placeholder="Ej: Juan Carlos" required />
                        <div class="invalid-feedback">Campo obligatorio.</div>
                      </div>

                      <!-- Apellidos separados -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Primer Apellido <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control capitalize" v-model.trim="form.primerApellido"
                          placeholder="Ej: Perez" required />
                        <div class="invalid-feedback">Campo obligatorio.</div>
                      </div>

                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Segundo apellido <span class="text-muted">(opcional)</span>
                        </label>
                        <input type="text" class="form-control capitalize" v-model.trim="form.segundoApellido"
                          placeholder="Ej: Gomez" />
                      </div>

                      <!-- Celular -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Número de celular <span class="text-danger">*</span>
                        </label>
                        <input type="text" inputmode="numeric" class="form-control" v-model.trim="form.celular"
                          placeholder="Solo números" @input="form.celular = onlyDigits(form.celular)" required />
                        <div class="invalid-feedback">Ingrese un número de celular válido.</div>
                      </div>

                      <!-- Correo -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Correo electrónico <span class="text-danger">*</span>
                        </label>
                        <input type="email" class="form-control" v-model.trim="form.correo"
                          placeholder="nombre@dominio.com" required />
                        <div class="invalid-feedback">Ingrese un correo válido.</div>
                      </div>

                      <div class="col-12">
                        <div class="form-section">
                          <div class="form-section-title">Ubicación</div>
                          <div class="form-section-sub">Departamento y ciudad de domicilio principal.</div>
                        </div>
                      </div>

                      <!-- Departamento -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Departamento <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="form.departamento" required @change="onDepartamentoChange">
                          <option value="" disabled>Seleccione…</option>
                          <option v-for="d in departamentos" :key="d._id" :value="d._id">
                            {{ (d.departamento || d.nombre || "").toUpperCase() }}
                          </option>
                        </select>
                        <div class="invalid-feedback">Campo obligatorio.</div>
                      </div>

                      <!-- Ciudad -->
                      <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">
                          Ciudad <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="form.ciudad" required :disabled="!form.departamento">
                          <option value="" disabled>
                            {{ form.departamento ? "Seleccione…" : "Seleccione un departamento primero" }}
                          </option>
                          <option v-for="c in ciudadesFiltradas" :key="c._id" :value="c._id">
                            {{ (c.ciudad || c.nombre || "").toUpperCase() }}
                          </option>
                        </select>
                        <div class="invalid-feedback">Campo obligatorio.</div>
                      </div>


                      <!-- Empresa / Organización -->
                      <div class="col-12">
                        <div class="form-section mt-2">
                          <div class="form-section-title">
                            Información de la empresa / organización
                            <span class="text-danger">*</span>
                          </div>
                          <div class="form-section-sub">Datos para relacionar el registro con la entidad.</div>
                        </div>

                        <div class="form-text" v-if="empresaBuscando">
                          Consultando empresa...
                        </div>

                        <div class="alert alert-warning py-2 mt-2" v-if="empresaNoExiste">
                          No encontramos la empresa con este NIT. Puede continuar y registrarla.
                        </div>

                        <div class="row g-3">
                          <!-- Tipo ID empresa -->
                          <div class="col-12 col-md-4">
                            <label class="form-label">Tipo identificación empresa <span
                                class="text-danger">*</span></label>
                            <select class="form-select" v-model="form.empresaTipoId" @change="onEmpresaTipoChange"
                              required>
                              <option value="" disabled>Seleccione…</option>
                              <option v-for="t in tipoDocEmpresa" :key="t.TIPODOCUMENTOID" :value="t.TIPODOCUMENTOID">
                                {{ (t.NOMBRE || "").toUpperCase() }}
                              </option>
                            </select>
                            <div class="invalid-feedback">Campo obligatorio.</div>
                          </div>

                          <!-- NIT / número -->
                          <div class="col-12 col-md-4">
                            <label class="form-label">Número identificación <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" v-model.trim="form.empresaNumeroId"
                              placeholder="Solo números"
                              @input="form.empresaNumeroId = onlyDigits(form.empresaNumeroId)"
                              @blur="BuscarEmpresaPorNumero" required />
                            <div class="invalid-feedback">Campo obligatorio.</div>
                          </div>


                          <div class="alert alert-danger py-2 mt-2" v-if="empresaError">
                            {{ empresaError }}
                          </div>

                          <!-- DV -->
                          <div class="col-12 col-md-4">
                            <label class="form-label">DV <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" v-model.trim="form.empresaDv"
                              placeholder="Solo número" maxlength="2"
                              @input="form.empresaDv = onlyDigits(form.empresaDv).slice(0, 1)" required />
                            <div class="invalid-feedback">Campo obligatorio.</div>
                          </div>

                          <!-- Nombre empresa -->
                          <div class="col-12">
                            <label class="form-label">Razón social <span class="text-danger">*</span></label>
                            <input type="text" class="form-control capitalize" v-model.trim="form.empresaNombre"
                              placeholder="Ej: Empresa BIC S.A.S." required />
                            <div class="invalid-feedback">Campo obligatorio.</div>
                          </div>

                          <!-- Tamaño empresa -->
                          <div class="col-12 col-md-6">
                            <label class="form-label">Tamaño empresa <span class="text-danger">*</span></label>
                            <select class="form-select" v-model="form.empresaTamanoId" required>
                              <option value="" disabled>Seleccione…</option>
                              <option v-for="t in tamanosEmpresa" :key="t._id" :value="t._id">
                                {{ (t.nombre || "").toUpperCase() }}
                              </option>
                            </select>
                            <div class="invalid-feedback">Campo obligatorio.</div>
                          </div>
                        </div>
                      </div>

                      <!-- Acciones -->
                      <div class="col-12 d-flex flex-column flex-sm-row gap-2 pt-2 justify-content-sm-end">
                        <button class="btn btn-sena-action" type="submit">
                          {{ evento }}
                        </button>
                        <button class="btn btn-outline-secondary" type="button" @click="onReset">
                          Limpiar
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- TOAST -->
    <ToastBetowa v-model:show="toast.show" :title="toast.title" :message="toast.message" :type="toast.type" />

    <!-- MODAL CONFIRMACIÓN -->
    <div v-if="confirmModal" class="confirm-backdrop" @click.self="confirmModal = false">
      <div class="confirm-modal" role="dialog" aria-modal="true">
        <div class="confirm-header">
          <div class="confirm-title">Confirmación de inscripción</div>
          <button class="confirm-close" type="button" @click="confirmModal = false">×</button>
        </div>

        <div class="confirm-body">
          <div class="confirm-chip" :class="form.asistenciaPresencial === 1 ? 'pres' : 'virt'">
            Modalidad: <strong>{{ form.asistenciaPresencial === 1 ? 'Presencial' : 'Virtual' }}</strong>
          </div>

          <div class="confirm-grid">
            <div class="confirm-card">
              <div class="confirm-label">Participante</div>
              <div class="confirm-value capitalize">
                {{ form.nombres }} {{ form.primerApellido }} {{ form.segundoApellido }}
              </div>

              <div class="confirm-mini">
                {{ form.correo }} · {{ form.celular }}
              </div>
            </div>

            <div class="confirm-card" v-if="form.asistenciaPresencial === 1">
              <div class="confirm-label">Asistencia presencial</div>
              <div class="confirm-value">SENA - Centro Nacional de Hotelería, Turismo y Alimentos - Regional Distrito
                Capital</div>
              <div class="confirm-mini">Cra 30 #15-53</div>
            </div>

            <div class="confirm-card" v-else>
              <div class="confirm-label">Enlace de acceso</div>

              <a class="confirm-link" :href="virtualLink" target="_blank" rel="noopener">
                Abrir Microsoft Teams
              </a>

              <div class="confirm-mini">Escanee el QR o use el enlace.</div>

              <div class="qr-wrap">
                <QrcodeVue :value="virtualLink" :size="140" level="M" />
              </div>
            </div>
          </div>
        </div>

        <div class="confirm-footer">
          <button class="btn btn-outline-secondary" type="button" @click="confirmModal = false">
            Cerrar
          </button>
          <a v-if="form.asistenciaPresencial === 2" class="btn btn-sena-action" :href="virtualLink" target="_blank"
            rel="noopener">
            Ir al enlace
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useAppStore } from "../stores/appStores.js";
import { useCiudadStore } from "../stores/ciudad.js";
import { useDatosBasicosStore } from "../stores/datosbasicos.js";
import { useDepartamentoStore } from "../stores/departamento.js";
import { useEmpresaStore } from "../stores/empresa.js";
import { useTamanoEmpresaStore } from "../stores/tamanoempresa.js";
import { useTipoDocumentoStore } from "../stores/tipodocumento.js";
import ToastBetowa from "./ToastBetowa.vue";

import QrcodeVue from "qrcode.vue";

import menuFormulario from "@/assets/formularioprincipal.jpg";
import logoFce from "@/assets/logo fce 2026-02.png";
import logoSena from "@/assets/sena-logo.svg";
// import heroMobile from "@/assets/evento-mobile.jpg";

let appStore = useAppStore();
let useDepartamentos = useDepartamentoStore();
let useCiudad = useCiudadStore();
let useTipoDocumento = useTipoDocumentoStore();
let useDatosBasicos = useDatosBasicosStore();
let empresaStore = useEmpresaStore();
let tamanoEmpresaStore = useTamanoEmpresaStore();


let submitted = ref(false);
let result = ref("");

let showHabeasModal = ref(false);
let habeasAccepted = ref(false);
let habeasDeclined = ref(false);

let departamentos = ref([]);
let ciudades = ref([]);
let tipoDocPersona = ref([]);
let tipoDocEmpresa = ref([]);
let tamanosEmpresa = ref([]);
let evento = ref("Confirmar asistencia")
let id = ref("")
let lastEmpresaNumero = ref("");
let empresaBuscando = ref(false);
let empresaNoExiste = ref(false);
let empresaError = ref("");

const virtualLink = ref("https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZTExZjkyMDQtMTg3YS00OThlLWIwZTEtMDA1YjUxMWQ1MzUz%40thread.v2/0?context=%7b%22Tid%22%3a%22cbc2c381-2f2e-4d93-91d1-506c9316ace7%22%2c%22Oid%22%3a%22005c3c58-566f-4df7-b350-32d2bd1a8bdc%22%7d"); // pon el real
const confirmModal = ref(false);

const toast = reactive({
  show: false,
  title: "",
  message: "",
  type: "success",
});

function showToast({ title, message, type = "success" }) {
  toast.title = title;
  toast.message = message;
  toast.type = type; // 👈 nuevo
  toast.show = false;
  requestAnimationFrame(() => (toast.show = true));
}

const stats = ref({
  cupoMaxPresencial: 120,
  presencialConfirmados: 0,
  virtualConfirmados: 0,
  totalConfirmados: 0,
  disponiblesPresencial: 120,
  llenoPresencial: false,
});

let statsTimer = null;

async function cargarStats() {
  try {
    stats.value = await useDatosBasicos.buscarStats();
  } catch (e) {
    // Silencioso para no fastidiar UX, pero queda el log
    console.error("Error cargando stats:", e);
  }
}
const presencialPct = computed(() => {
  const max = Number(stats.value.cupoMaxPresencial || 0);
  const cur = Number(stats.value.presencialConfirmados || 0);
  if (!max) return 0;
  return Math.min(100, Math.round((cur / max) * 100));
});

const presencialLleno = computed(() => {
  const max = Number(stats.value.cupoMaxPresencial || 0);
  const cur = Number(stats.value.presencialConfirmados || 0);
  return max > 0 && cur >= max;
});

watch(confirmModal, (open) => {
  if (!open) reloadPage();
});

let form = reactive({
  asistenciaPresencial: null,
  tipoId: "",
  numeroId: "",
  nombres: "",
  primerApellido: "",
  segundoApellido: "",
  celular: "",
  correo: "",
  departamento: "",
  ciudad: "",

  //empresa data:
  empresaId: "",
  empresaTipoId: "",
  empresaNumeroId: "",
  empresaDv: "",
  empresaNombre: "",
  empresaTamanoId: "",
});

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

function acceptHabeas() {
  habeasAccepted.value = true;
  showHabeasModal.value = false;
  habeasDeclined.value = false;

  // si quieres recordar aceptación en la sesión:
  // sessionStorage.setItem("habeasAccepted", "1");
}

function declineHabeas() {
  habeasDeclined.value = true;
  habeasAccepted.value = false;
  showHabeasModal.value = true; // se queda abierto sí o sí
  // sessionStorage.removeItem("habeasAccepted");
}

function reloadPage() {
  window.location.reload();
}

// Evita cerrar con ESC / scroll raro
function hardLockKeys(e) {
  if (!showHabeasModal.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
  }
}

onMounted(async () => {
  window.addEventListener("keydown", hardLockKeys, true);

  appStore.startLoading("Preparando catálogos del formulario...", 600);
  appStore.updateProgress(5);
  await nextTick();

  const timer = setInterval(() => {
    if (appStore.progress < 90) appStore.updateProgress(appStore.progress + 2);
  }, 80);

  try {
    const results = await Promise.allSettled([
      useTipoDocumento.buscarTipoDocumento(0),
      useTipoDocumento.buscarTipoDocumento(1),
      useDepartamentos.buscarDepartamento(),
      useCiudad.buscarCiudad(),
      tamanoEmpresaStore.buscarTamanoEmpresa(),
      preloadImage(logoFce),
    ]);

    const persona = results[0].status === "fulfilled" ? results[0].value : [];
    const empresa = results[1].status === "fulfilled" ? results[1].value : [];
    const deps = results[2].status === "fulfilled" ? results[2].value : [];
    const cids = results[3].status === "fulfilled" ? results[3].value : [];
    const tamanos = results[4].status === "fulfilled" ? results[4].value : [];

    tipoDocPersona.value = persona || [];
    tipoDocEmpresa.value = empresa || [];
    departamentos.value = deps || [];
    ciudades.value = cids || [];
    tamanosEmpresa.value = Array.isArray(tamanos) ? tamanos : [];

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`Carga inicial falló en índice ${i}:`, r.reason);
      }
    });

    tamanosEmpresa.value = Array.isArray(tamanos) ? tamanos : [];
    tipoDocPersona.value = persona || [];
    tipoDocEmpresa.value = empresa || [];
    departamentos.value = deps || [];
    ciudades.value = cids || [];
  } catch (e) {
    console.error("Fallo cargando recursos críticos:", e);
  } finally {
    clearInterval(timer);
    appStore.updateProgress(100);
    await appStore.finishLoading();

    await cargarStats();
    statsTimer = setInterval(cargarStats, 3000);

    await nextTick();
    showHabeasModal.value = true;
    habeasAccepted.value = false;
    habeasDeclined.value = false;
  }
});

let ciudadesFiltradas = computed(() => {
  let depId = form.departamento;
  if (!depId) return [];

  return (ciudades.value || []).filter((c) => {
    if (typeof c.departamento === "string") return c.departamento === depId;
    return c.departamento?._id === depId;
  });
});

function onDepartamentoChange() {
  form.ciudad = "";
}

function onlyDigits(value) {
  return (value || "").toString().replace(/\D+/g, "");
}

function validateFormNative() {
  let formEl = document.querySelector("form.needs-validation");
  if (!formEl) return false;
  formEl.classList.add("was-validated");
  return formEl.checkValidity();
}

async function onSubmit() {
  // doble seguro: si no aceptó, nada pasa
  if (!habeasAccepted.value) {
    showHabeasModal.value = true;
    return;
  }

  submitted.value = true;

  const ok = validateFormNative();

  // ✅ Validación dura de modalidad (solo 1 o 2)
  const modalidad = Number(form.asistenciaPresencial);
  const modalidadOk = modalidad === 1 || modalidad === 2;

  if (!ok || !modalidadOk) {
    result.value = "";
    showToast({
      title: "Validación",
      message: "Debe seleccionar modalidad: Presencial o Virtual.",
      type: "warning",
    });
    return; // ❌ NO deja guardar ni actualizar
  }

  result.value = JSON.stringify(
    {
      ...form,
      nombres: (form.nombres || "").toUpperCase(),
    },
    null,
    2
  );

  // ✅ Ejecuta solo si pasó validación
  if (evento.value === "Actualizar Datos") {
    await editar();
  } else {
    await guardar();
  }
}

function onReset() {
  submitted.value = false;
  result.value = "";
  id.value = "";
  evento.value = "Confirmar asistencia";

  lastEmpresaNumero.value = "";

  Object.assign(form, {
    asistenciaPresencial: null,
    tipoId: "",
    numeroId: "",
    nombres: "",
    primerApellido: "",
    segundoApellido: "",
    celular: "",
    correo: "",
    departamento: "",
    ciudad: "",

    // empresa
    empresaId: "",
    empresaTipoId: "",
    empresaNumeroId: "",
    empresaDv: "",
    empresaNombre: "",
    empresaTamanoId: "",
  });

  const formEl = document.querySelector("form.needs-validation");
  formEl?.classList.remove("was-validated");
}

function onEmpresaTipoChange() {
  lastEmpresaNumero.value = "";
  empresaNoExiste.value = false;
  empresaError.value = "";

  // NO borres el NIT digitado
  Object.assign(form, {
    empresaId: "",
    empresaDv: "",
    empresaNombre: "",
    empresaTamanoId: "",
  });
}

async function BuscarNumIdentificacion() {
  if (form.numeroId.trim() === "") return;

  const res = await useDatosBasicos.buscarDatosBasicosNumIdentificacion(form.numeroId);

  id.value = res._id;
  form.tipoId = res.tipodocumento?.TIPODOCUMENTOID || res.tipodocumento;
  form.numeroId = res.numeroidentificacion;
  form.nombres = res.nombres;
  form.primerApellido = res.primerapellido || "";
  form.segundoApellido = res.segundoapellido || "";
  form.celular = res.celular;
  form.correo = res.correo;
  form.departamento = res.departamento?._id || res.departamento;
  form.ciudad = res.ciudad?._id || res.ciudad;
  form.asistenciaPresencial = Number(res.modalidad);

  // Empresa
  if (res.empresa && typeof res.empresa === "object") {
    setEmpresaFromObj(res.empresa);
  } else if (res.empresa) {
    // viene solo ID -> buscarla
    form.empresaId = res.empresa;
    const emp = await empresaStore.buscarEmpresaId(res.empresa);
    if (emp) setEmpresaFromObj(emp);
  } else {
    clearEmpresa();
  }

  evento.value = "Actualizar Datos";
}

function clearEmpresaDependientes() {
  Object.assign(form, {
    empresaId: "",
    empresaDv: "",
    empresaNombre: "",
    empresaTamanoId: "",
  });
}

function setEmpresaFromObj(e) {
  form.empresaId = e._id || "";
  form.empresaTipoId = e.tipoidentificacion?._id || e.tipoidentificacion || "";
  form.empresaNumeroId = e.numeroidentificacion || "";
  form.empresaDv = String(e.dv ?? "");
  form.empresaNombre = e.empresa || "";
  form.empresaTamanoId = e.tamanoempresa?._id || e.tamanoempresa || "";
}

function clearEmpresa() {
  Object.assign(form, {
    empresaId: "",
    empresaTipoId: "",
    empresaNumeroId: "",
    empresaDv: "",
    empresaNombre: "",
    empresaTamanoId: "",
  });
}

function buildEmpresaPayload() {
  return {
    tipoidentificacion: form.empresaTipoId,
    numeroidentificacion: form.empresaNumeroId,
    dv: form.empresaDv,
    empresa: form.empresaNombre,
    tamanoempresa: form.empresaTamanoId,
  };
}
async function BuscarEmpresaPorNumero() {
  const nit = onlyDigits(form.empresaNumeroId);
  form.empresaNumeroId = nit;

  empresaError.value = "";
  empresaNoExiste.value = false;

  // Evita llamadas basura
  if (!nit || nit.length < 5) return;

  // Evita repetir query si solo tabuló sin cambiar
  if (nit === lastEmpresaNumero.value) return;
  lastEmpresaNumero.value = nit;

  empresaBuscando.value = true;

  try {
    const emp = await empresaStore.buscarEmpresaPorNumero(nit);

    if (!emp) {
      empresaNoExiste.value = true;
      form.empresaId = "";
      return;
    }

    empresaNoExiste.value = false;

    form.empresaId = emp._id || "";
    form.empresaTipoId = emp.tipoidentificacion?._id || emp.tipoidentificacion || form.empresaTipoId;
    form.empresaNumeroId = emp.numeroidentificacion || nit;
    form.empresaDv = String(emp.dv ?? form.empresaDv ?? "");
    form.empresaNombre = emp.empresa || "";
    form.empresaTamanoId = emp.tamanoempresa?._id || emp.tamanoempresa || "";
  } catch (e) {
    empresaError.value = e?.response?.data?.msg || "Error consultando empresa";
    clearEmpresaDependientes();
  } finally {
    empresaBuscando.value = false;
  }
}

function extractApiMsg(err, fallback = "Ocurrió un error. Intente de nuevo.") {
  return err?.response?.data?.msg || err?.response?.data?.error || err?.message || fallback;
}

async function guardar() {
  try {
    let empresaId = form.empresaId;

    if (!empresaId) {
      const empRes = await empresaStore.registrarEmpresa(buildEmpresaPayload());
      empresaId = empRes?._id || empRes?.empresa?._id;
      if (!empresaId) throw new Error("No se pudo obtener el ID de la empresa.");
    }

    await useDatosBasicos.registrarDatosBasicos({
      tipodocumento: form.tipoId,
      numeroidentificacion: form.numeroId,
      nombres: form.nombres,
      primerapellido: form.primerApellido,
      segundoapellido: form.segundoApellido || "",
      empresa: empresaId,
      celular: form.celular,
      correo: form.correo,
      departamento: form.departamento,
      ciudad: form.ciudad,
      modalidad: Number(form.asistenciaPresencial),
    });

    showToast({
      title: "Registro exitoso",
      message: "Su asistencia será enviada al correo electrónico registrado.",
      type: "success",
    });

    confirmModal.value = true;

    if (presencialLleno.value) form.asistenciaPresencial = 2;

  } catch (err) {
    const status = err?.response?.status;

    //regla de negocio: máximo 2 reps por empresa
    if (status === 409) {
      showToast({
        title: "No se pudo registrar",
        message: extractApiMsg(err, "Solo se permiten dos representantes por empresa."),
        type: "error",
      });
      return;
    }

    // otros errores conocidos (ej: cupo presencial)
    if (status === 404 || status === 400) {
      showToast({
        title: "Validación",
        message: extractApiMsg(err),
        type: "warning",
      });
      return;
    }

    // fallback
    showToast({
      title: "Error",
      message: extractApiMsg(err),
      type: "error",
    });

    console.error(err);
  }
}

async function editar() {
  try {
    // 1) Empresa
    if (form.empresaId) {
      await empresaStore.editarEmpresa(form.empresaId, buildEmpresaPayload());
    } else {
      const empRes = await empresaStore.registrarEmpresa(buildEmpresaPayload());
      form.empresaId = empRes?._id || empRes?.empresa?._id;
      if (!form.empresaId) throw new Error("No se pudo obtener el ID de la empresa.");
    }

    // 2) Datos básicos
    await useDatosBasicos.editarDatosBasicos(id.value, {
      tipodocumento: form.tipoId,
      numeroidentificacion: form.numeroId,
      nombres: form.nombres,
      primerapellido: form.primerApellido,
      segundoapellido: form.segundoApellido || "",
      empresa: form.empresaId,
      celular: form.celular,
      correo: form.correo,
      departamento: form.departamento,
      ciudad: form.ciudad,
      modalidad: Number(form.asistenciaPresencial),
    });

    showToast({
      title: "Actualización exitosa",
      message: "Su confirmación fue enviada al correo registrado.",
      type: "success",
    });
    confirmModal.value = true;
    if (presencialLleno.value) form.asistenciaPresencial = 2;

    // onReset();
    console.log("Edición exitosa");
  } catch (err) {
    if (err?.response?.status === 409) {
      showToast({ title: "No se pudo actualizar", message: extractApiMsg(err), type: "error" });
      return;
    }
    showToast({ title: "Error", message: extractApiMsg(err), type: "error" });
  }
}

// function accionEvento() {
//   if (evento.value === 'Actualizar Datos') {
//     editar()
//   } else if (evento.value === 'Confirmar asistencia') {
//     guardar()
//   }
// }
onUnmounted(() => {
  if (statsTimer) clearInterval(statsTimer);
  window.removeEventListener("keydown", hardLockKeys, true);
});
</script>

<style scoped>
.hero-title {
  border-left: 6px solid transparent;
  border-image: var(--betowa-gradient) 1;
  padding-left: 14px;
}

.hero-eyebrow {
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, .55);
  margin-bottom: .25rem;
}

.hero-h1 {
  margin: 0;
  font-weight: 950;
  line-height: 1.15;
  letter-spacing: -.02em;
  font-size: clamp(1.35rem, 2.2vw, 1.9rem);
  color: #0b2239;
}

.hero-sub {
  margin-top: .35rem;
  font-size: .92rem;
  color: rgba(0, 0, 0, .62);
}

.hero-sub .dot {
  margin: 0 .45rem;
  opacity: .7;
}

.kpi-title {
  font-size: .85rem;
  text-transform: uppercase;
  letter-spacing: .6px;
  font-weight: 600;
  color: var(--sena-blue);
  margin-bottom: .4rem;
}

.callout {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, .10);
  background: linear-gradient(135deg,
      rgba(108, 41, 179, .08) 0%,
      rgba(0, 50, 77, .04) 60%,
      rgba(255, 255, 255, .92) 100%);
  box-shadow: 0 12px 28px rgba(0, 0, 0, .08);
  position: relative;
  overflow: hidden;
}

.callout::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: var(--betowa-gradient);
  opacity: .95;
}

.callout-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 950;
  color: #fff;
  background: var(--betowa-gradient);
  box-shadow: 0 10px 22px rgba(108, 41, 179, .22);
  flex: 0 0 auto;
  margin-top: 2px;
}

.callout-title {
  font-size: .82rem;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, .65);
  margin-bottom: 2px;
}

.callout-text {
  color: rgba(0, 0, 0, .72);
  line-height: 1.35;
}

.kpi-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.kpi-badge {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .35rem .65rem;
  border-radius: 999px;
  font-size: .85rem;
  line-height: 1;
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .12);
  border: 1px solid rgba(255, 255, 255, .18);
  user-select: none;
}

.kpi-presencial {
  background: var(--sena-blue);
}

.kpi-virtual {
  background: var(--sena-green);
}

.kpi-total {
  background: var(--betowa-gradient);
}

.kpi-alerta {
  background: #b00020;
  /* rojo serio */
}

.kpi-badge strong {
  font-weight: 800;
}

@media (prefers-reduced-motion: no-preference) {
  .kpi-badge {
    transition: transform .15s ease, filter .15s ease;
  }

  .kpi-badge:hover {
    transform: translateY(-1px);
    filter: brightness(.98);
  }
}

.kpi-progress {
  height: 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, .08);
  overflow: hidden;
  margin: .35rem 0 .25rem;
}

.kpi-progress-bar {
  height: 100%;
  background: var(--betowa-gradient);
  transition: width .25s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18);
}

.kpi-progress-text {
  font-size: .75rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.asistencia-hint {
  font-size: .82rem;
  color: rgba(0, 0, 0, .65);
  margin-top: -.1rem;
  margin-bottom: .6rem;
}

.asistencia-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: .75rem;
}

@media (min-width: 768px) {
  .asistencia-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.asistencia-card {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, .12);
  background: rgba(255, 255, 255, .9);
  padding: .9rem 1rem;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .18s ease, border-color .18s ease;
  box-shadow: 0 10px 26px rgba(0, 0, 0, .08);
  position: relative;
}

.asistencia-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, .12);
}

.asistencia-card.active {
  border-color: rgba(108, 41, 179, .55);
  box-shadow: 0 16px 40px rgba(108, 41, 179, .14);
  background: linear-gradient(135deg,
      rgba(108, 41, 179, 0.10) 0%,
      rgba(0, 50, 77, 0.06) 100%);
}

.asistencia-card.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 14px 0 0 14px;
  background: var(--betowa-gradient);
  opacity: .9;
}

.asistencia-card.active::after {
  content: "Seleccionado";
  position: absolute;
  top: .7rem;
  right: .8rem;
  font-size: .72rem;
  font-weight: 800;
  color: var(--betowa-purple);
}

.asistencia-card.disabled {
  opacity: .55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.asistencia-title {
  font-weight: 900;
  color: var(--sena-blue);
  display: flex;
  align-items: center;
  gap: .5rem;
}

.asistencia-sub {
  margin-top: .25rem;
  font-size: .82rem;
  color: rgba(0, 0, 0, .65);
}

.asistencia-meta {
  margin-top: .55rem;
  font-size: .82rem;
  color: rgba(0, 0, 0, .75);
}

.asistencia-pill {
  font-size: .68rem;
  font-weight: 900;
  padding: .18rem .5rem;
  border-radius: 999px;
  color: #fff;
  letter-spacing: .3px;
}

.asistencia-pill.sena {
  background: var(--sena-blue);
}

.asistencia-pill.betowa {
  background: var(--betowa-gradient);
}

.asistencia-pill.agotado {
  background: #b00020;
}

/* mínimos para que no se vea plano */
.card {
  border-radius: 1rem;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  display: grid;
  place-items: center;
  z-index: 9999;
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

/* base gris */
.logo.base {
  filter: grayscale(1) brightness(1.05);
  opacity: .55;
}

/* capa color que se revela horizontal */
.logo.color {
  position: absolute;
  inset: 0;
}

/* wobble suave */
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
  /* SENA vibes */
  transition: width .15s linear;
}

.progress-text {
  margin-top: 10px;
  font-size: 14px;
}

/* Backdrop duro (no click-through) */
.modal-backdrop-hard {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  display: grid;
  place-items: center;
  z-index: 10000;
  padding: 14px;
}

/* Caja del modal */
.modal-hard {
  width: min(980px, 96vw);
  max-height: 92vh;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0, 0, 0, .25);
  display: flex;
  flex-direction: column;
}

/* Header verde tipo SENA */
.modal-hard-header {
  background: #00324D;
  color: #dce2de;
  padding: 14px 16px;
}

.modal-hard-body {
  padding: 16px;
  overflow: auto;
  flex: 1;
}

.modal-hard-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-section {
  margin-top: .35rem;
  margin-bottom: .35rem;
  padding-top: .75rem;
  border-top: 1px solid rgba(0, 0, 0, .08);
}

.form-section-title {
  font-size: .9rem;
  font-weight: 800;
  letter-spacing: .3px;
  color: var(--sena-blue);
  text-transform: uppercase;
}

.form-section-sub {
  font-size: .78rem;
  color: rgba(0, 0, 0, .6);
  margin-top: .15rem;
}

.btn-sena-action {
  background: var(--sena-blue) !important;
  border-color: var(--sena-blue) !important;
  color: #fff !important;
  font-weight: 700;
  border-radius: 12px;
  padding: .55rem 1rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .14);
  transition: background .18s ease, border-color .18s ease, transform .12s ease, box-shadow .18s ease;
}

.btn-sena-action:hover {
  background: var(--betowa-purple) !important;
  border-color: var(--betowa-purple) !important;
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, .18);
}

.btn-sena-action:active {
  transform: translateY(0px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, .14);
}

.btn-sena-action:disabled {
  opacity: .75;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 576px) {

  .btn-sena-action,
  .btn-outline-secondary {
    width: 100%;
  }
}

/* Se ve “Tipo Título”, pero el valor real NO cambia */
.capitalize {
  text-transform: capitalize;
}

.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  display: grid;
  place-items: center;
  z-index: 15000;
  padding: 14px;
}

.confirm-modal {
  width: min(820px, 96vw);
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 28px 90px rgba(0, 0, 0, .30);
}

.confirm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(0, 50, 77, .95), rgba(108, 41, 179, .65));
  color: #fff;
}

.confirm-title {
  font-weight: 950;
  letter-spacing: .3px;
}

.confirm-close {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, .9);
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
}

.confirm-body {
  padding: 16px;
}

.confirm-chip {
  display: inline-flex;
  gap: 8px;
  padding: .35rem .7rem;
  border-radius: 999px;
  font-size: .86rem;
  border: 1px solid rgba(0, 0, 0, .08);
  margin-bottom: 14px;
}

.confirm-chip.pres {
  background: rgba(0, 50, 77, .06);
  color: rgba(0, 50, 77, .95);
}

.confirm-chip.virt {
  background: rgba(108, 41, 179, .08);
  color: rgba(108, 41, 179, .95);
}

.confirm-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media(min-width:768px) {
  .confirm-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.confirm-card {
  border: 1px solid rgba(0, 0, 0, .10);
  border-radius: 16px;
  padding: 14px 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, .92), rgba(0, 0, 0, .02));
  box-shadow: 0 12px 26px rgba(0, 0, 0, .08);
}

.confirm-label {
  font-size: .78rem;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, .55);
  margin-bottom: 6px;
}

.confirm-value {
  font-weight: 900;
  color: rgba(0, 0, 0, .78);
}

.confirm-mini {
  margin-top: 6px;
  font-size: .86rem;
  color: rgba(0, 0, 0, .62);
}

.confirm-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 900;
  color: rgba(108, 41, 179, .95);
}

.confirm-link:hover {
  text-decoration: underline;
}

.qr-wrap {
  margin-top: 10px;
  width: fit-content;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, .08);
  background: #fff;
}

.confirm-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, .08);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
