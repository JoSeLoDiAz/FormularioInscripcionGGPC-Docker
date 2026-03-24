<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="usuarios-bg">

    <!-- ══ HEADER ══ -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="fa fa-users"></i>
        </div>
        <div>
          <p class="header-eyebrow">Portal Institucional · SENA</p>
          <h1 class="header-title">Registro Usuarios GGPC 2026</h1>
        </div>
      </div>
      <div class="header-actions">
        <span class="badge-count">
          <i class="fa fa-circle-check"></i>
          {{ registros.length }} registros
        </span>
        <button class="btn-export" @click="exportarExcel">
          <i class="fa fa-file-excel"></i>
          Descargar Excel
        </button>
      </div>
    </div>

    <!-- ══ TARJETA TABLA ══ -->
    <div class="table-card">

      <!-- Barra superior de la tabla -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <i class="fa fa-table-list"></i>
          <span>Listado de participantes</span>
        </div>
        <div class="toolbar-right">
          <div class="search-wrap">
            <i class="fa fa-magnifying-glass"></i>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por nombre, correo..."
            />
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-scroll">
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo ID</th>
              <th>N° Identificación</th>
              <th>Nombres</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Empresa</th>
              <th>Celular</th>
              <th>Correo Electrónico</th>
              <th>Departamento</th>
              <th>Ciudad</th>
              <th>Modalidad</th>
            </tr>
          </thead>
          <tbody v-if="registrosFiltrados.length > 0">
            <tr v-for="(r, index) in registrosFiltrados" :key="r.DATOSBASICOSID || index">
              <td class="td-index">{{ index + 1 }}</td>
              <td><span class="badge-tipo">{{ capitalize(r.TIPODOCUMENTO_NOMBRE) }}</span></td>
              <td class="td-mono">{{ r.NUMEROIDENTIFICACION }}</td>
              <td class="td-nombre">{{ capitalize(r.NOMBRES) }}</td>
              <td class="td-nombre">{{ capitalize(r.PRIMERAPELLIDO) }}</td>
              <td class="td-nombre">{{ capitalize(r.SEGUNDOAPELLIDO || '') }}</td>
              <td>{{ capitalize(r.EMPRESA_NOMBRE) }}</td>
              <td class="td-mono">{{ r.CELULAR }}</td>
              <td class="td-correo">{{ r.CORREO }}</td>
              <td>{{ capitalize(r.DEPARTAMENTO_NOMBRE) }}</td>
              <td>{{ capitalize(r.CIUDAD_NOMBRE) }}</td>
              <td>{{ r.MODALIDAD === 1 ? "Presencial" : r.MODALIDAD === 2 ? "Virtual" : "" }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="td-empty">
                <div class="empty-state">
                  <i class="fa fa-inbox"></i>
                  <p>No se encontraron registros</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer tabla -->
      <div class="table-footer">
        <span>Mostrando <strong>{{ registrosFiltrados.length }}</strong> de <strong>{{ registros.length }}</strong> registros</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useDatosBasicosStore } from "../stores/datosbasicos.js"
import { useAppStore } from "../stores/appStores.js"
import ExcelJS from "exceljs";

const useDatosBasicos = useDatosBasicosStore()
const appStore = useAppStore()

const registros = ref([])
const busqueda  = ref('')

async function buscarDatos() {
  appStore.startLoading("Cargando registros...", 400)
  try {
    const res = await useDatosBasicos.buscarDatosBasicos()
    registros.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error("Error cargando datos:", err)
    registros.value = []
  } finally {
    await appStore.finishLoading()
  }
}

onMounted(buscarDatos)

// Filtro de búsqueda
const registrosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return registros.value
  const q = busqueda.value.toLowerCase()
  return registros.value.filter(r =>
    [r.NOMBRES, r.PRIMERAPELLIDO, r.SEGUNDOAPELLIDO, r.CORREO, r.EMPRESA_NOMBRE, r.NUMEROIDENTIFICACION]
      .some(v => v && String(v).toLowerCase().includes(q))
  )
})

function capitalize(palabra) {
  return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
}

async function exportarExcel() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Registros');

  sheet.columns = [
    { header: 'Tipo Identificación', key: 'tipodocumento' },
    { header: 'Número Identificación', key: 'numeroidentificacion' },
    { header: 'Nombres', key: 'nombres' },
    { header: 'Primer Apellido', key: 'primerapellido' },
    { header: 'Segundo Apellido', key: 'segundoapellido' },
    { header: 'Empresa', key: 'empresa' },
    { header: 'Número Celular', key: 'celular' },
    { header: 'Correo Electrónico', key: 'correo' },
    { header: 'Departamento', key: 'departamento' },
    { header: 'Ciudad', key: 'ciudad' },
    { header: 'Modalidad', key: 'modalidad' }
  ];
  
  registros.value.forEach(u => {
    const modalidadTexto = u.MODALIDAD === 1 ? "Presencial" : u.MODALIDAD === 2 ? "Virtual" : "";
    sheet.addRow({
      tipodocumento: capitalize(u.TIPODOCUMENTO_NOMBRE || ''),
      numeroidentificacion: u.NUMEROIDENTIFICACION,
      nombres: capitalize(u.NOMBRES || ''),
      primerapellido: capitalize(u.PRIMERAPELLIDO || ''),
      segundoapellido: capitalize(u.SEGUNDOAPELLIDO || ''),
      empresa: capitalize(u.EMPRESA_NOMBRE || ''),
      celular: u.CELULAR,
      correo: u.CORREO,
      departamento: capitalize(u.DEPARTAMENTO_NOMBRE || ''),
      ciudad: capitalize(u.CIUDAD_NOMBRE || ''),
      modalidad: modalidadTexto,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Registros.xlsx';
  link.click();
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

/* ── FONDO: usa var(--betowa-gradient) de style.css ── */
.usuarios-bg {
  min-height: 100vh;
  background: var(--betowa-gradient);
  background-attachment: fixed;
  padding: 36px 40px;
}

/* ══ HEADER ══ */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  animation: fadeUp .5s ease both;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-icon {
  width: 56px; height: 56px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.20);
  flex-shrink: 0;
}
.header-icon i {
  font-size: 22px;
  color: var(--sena-blue);
}

.header-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 4px;
}
.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* Badge contador: glass */
.badge-count {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--sena-blue);
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.badge-count i { color: var(--sena-green); }

/* Botón exportar: verde SENA */
.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--sena-green);
  border: none;
  border-radius: 50px;
  padding: 11px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(57,169,0,0.35);
  transition: transform .15s, box-shadow .2s, opacity .2s;
}
.btn-export:hover {
  opacity: 0.88;
  box-shadow: 0 10px 24px rgba(57,169,0,0.45);
  transform: translateY(-1px);
}
.btn-export:active { transform: translateY(0); }

/* ══ TARJETA TABLA: glass-card de style.css ══ */
.table-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
  overflow: hidden;
  animation: fadeUp .5s .1s ease both;
}

/* Toolbar */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding: 20px 28px;
  border-bottom: 1.5px solid var(--glass-border);
  background: rgba(255,255,255,0.5);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--sena-blue);
}
.toolbar-left i { color: var(--betowa-purple); font-size: 16px; }

.search-wrap { position: relative; }
.search-wrap i {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 13px;
  pointer-events: none;
}
.search-wrap input {
  background: #f3f4f8;
  border: 1.5px solid #e0ddef;
  border-radius: 50px;
  padding: 9px 18px 9px 38px;
  font-size: 13px;
  color: #2d3436;
  outline: none;
  width: 260px;
  transition: border-color .2s, box-shadow .2s;
}
.search-wrap input::placeholder { color: #bbb; }
.search-wrap input:focus {
  border-color: var(--betowa-purple);
  box-shadow: 0 0 0 3px rgba(108,41,179,0.10);
  background: #fff;
}

/* Scroll horizontal */
.table-scroll { overflow-x: auto; }

/* Tabla */
.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/* Cabecera: gradiente betowa */
.tabla thead tr {
  background: var(--betowa-gradient);
}
.tabla thead th {
  padding: 15px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.90);
  white-space: nowrap;
  border: none;
}

.tabla tbody tr {
  border-bottom: 1px solid var(--glass-border);
  transition: background .15s;
}
.tabla tbody tr:hover {
  background: rgba(108,41,179,0.04);
}
.tabla tbody tr:last-child { border-bottom: none; }

.tabla tbody td {
  padding: 14px 18px;
  color: #2d3436;
  vertical-align: middle;
  white-space: nowrap;
}

/* Columnas especiales */
.td-index {
  font-weight: 700;
  color: var(--betowa-purple);
  width: 40px;
  text-align: center;
}
.td-mono {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #555;
}
.td-nombre {
  font-weight: 500;
  color: var(--sena-blue);
}
.td-correo {
  color: var(--betowa-purple);
  font-size: 12px;
}

/* Badge tipo identificación */
.badge-tipo {
  display: inline-block;
  background: rgba(108,41,179,0.10);
  color: var(--betowa-purple);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Empty state */
.td-empty { text-align: center; padding: 60px 0 !important; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #bbb;
}
.empty-state i { font-size: 40px; color: rgba(108,41,179,0.20); }
.empty-state p { font-size: 14px; margin: 0; }

/* Footer tabla */
.table-footer {
  padding: 16px 28px;
  border-top: 1.5px solid var(--glass-border);
  background: rgba(255,255,255,0.4);
  font-size: 12px;
  color: #888;
  text-align: right;
}
.table-footer strong { color: var(--betowa-purple); }

/* ── Animación ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .usuarios-bg   { padding: 20px 16px; }
  .page-header   { flex-direction: column; align-items: flex-start; }
  .header-title  { font-size: 18px; }
  .search-wrap input { width: 100%; }
  .table-toolbar { flex-direction: column; align-items: flex-start; }
}
</style>
