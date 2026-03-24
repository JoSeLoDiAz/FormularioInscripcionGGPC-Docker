import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "../helpers/sendEmail.js";
import {
  countDatosBasicosByEmpresaId,
  createDatosBasicos,
  deleteDatosBasicos as deleteDatosBasicosRepo,
  findAllDatosBasicos,
  findDatosBasicosById,
  findDatosBasicosByNumeroIdentificacion,
  getDatosBasicosStats as getDatosBasicosStatsRepo,
  updateDatosBasicos,
} from "../repositories/datosbasicos.js";

const TEAMS_LINK = process.env.TEAMS_LINK;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalize = (d) => ({
  tipodocumentoid: Number(d.tipodocumentoid),
  numeroidentificacion: String(d.numeroidentificacion ?? "").trim(),
  nombres: String(d.nombres ?? "").trim().toLowerCase(),
  primerapellido: String(d.primerapellido ?? "").trim().toLowerCase(),
  segundoapellido: d.segundoapellido ? String(d.segundoapellido).trim().toLowerCase() : null,
  empresaid: Number(d.empresaid),
  celular: String(d.celular ?? "").trim(),
  correo: String(d.correo ?? "").trim().toLowerCase(),
  departamentoid: Number(d.departamentoid),
  ciudadid: Number(d.ciudadid),
  modalidad: Number(d.modalidad),
});

function getBannerAsBase64() {
  const bannerPath = path.join(__dirname, "..", "img", "formularioprincipal.jpg");
  if (!fs.existsSync(bannerPath)) {
    console.warn("BANNER_NOT_FOUND:", bannerPath);
    return null;
  }
  const buffer = fs.readFileSync(bannerPath);
  return buffer.toString("base64");
}

async function getQrAsBase64(text) {
  const buffer = await QRCode.toBuffer(text, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
  });
  return buffer.toString("base64");
}

function capitalizeFullName(text = "") {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getEventMeta(modalidad) {
  const isPresencial = Number(modalidad) === 1;

  const subject = isPresencial
    ? "SENA - Confirmación de registro – Lanzamiento de la convocatoria FCE 2026 - presencial"
    : "SENA - Confirmación de registro – Lanzamiento de la convocatoria FCE 2026 - virtual";

  const evento = isPresencial
    ? "Lanzamiento de la convocatoria FCE 2026 - Presencial"
    : "Lanzamiento de la convocatoria FCE 2026 - Virtual";

  const address = isPresencial
    ? "Cra 30 #15-53 SENA - Centro Nacional de Hotelería, Turismo y Alimentos - Regional Distrito Capital"
    : TEAMS_LINK;

  const recomendaciones = isPresencial
    ? "Te recomendamos llegar con al menos <strong>15 minutos de anticipación</strong> para facilitar el ingreso."
    : "Te sugerimos conectarte unos minutos antes para verificar tu conexión y audio.";

  const nota = isPresencial
    ? "Si tienes alguna duda o inconveniente, no dudes en contactarnos respondiendo a este correo."
    : "Si presentas alguna dificultad para ingresar o tienes preguntas, puedes contactarnos respondiendo a este correo.";

  return { isPresencial, subject, evento, address, recomendaciones, nota };
}

function buildEmailHtml({ nombres, evento, address, recomendaciones, nota, isPresencial }) {
  const qrBlock = !isPresencial
    ? `
      <tr>
        <td style="padding:20px 30px; text-align:center;">
          <p style="margin:0 0 12px; font-weight:700; font-size:15px; color:#00324d;">
            Acceso rápido (QR)
          </p>
          <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding:14px; border:1px solid #e5e5e5; border-radius:14px; background:#ffffff;">
                <img src="cid:qrTeams" width="200" height="200" alt="QR Teams"
                     style="display:block; margin:0 auto;">
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0; font-size:12px; color:#6b7280; line-height:1.4;">
            Si no abre, copia y pega el enlace:<br>
            <a href="${address}" target="_blank" rel="noopener" style="color:#6c29b3; text-decoration:underline;">
              ${address}
            </a>
          </p>
        </td>
      </tr>`
    : "";

  const placeOrLinkRow = isPresencial
    ? `
      <tr>
        <td style="padding:6px 0; width:220px;">📍 <strong style="color:#111;">Lugar:</strong></td>
        <td style="padding:6px 0;">${address}</td>
      </tr>`
    : `
      <tr>
        <td style="padding:6px 0; width:220px;">📍 <strong style="color:#111;">Enlace:</strong></td>
        <td style="padding:6px 0;">
          <a href="${address}" target="_blank" rel="noopener" style="color:#6c29b3; text-decoration:underline;">
            Abrir Microsoft Teams
          </a>
        </td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Confirmación de registro</title></head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.10);">

        <tr><td style="padding:0;">
          <div style="height:6px; background:linear-gradient(90deg,#00324d 0%, #6c29b3 70%, #39a900 100%);"></div>
        </td></tr>

        <tr><td>
          <img src="cid:banner" alt="Evento" width="600" style="display:block; width:100%; height:auto;">
        </td></tr>

        <tr><td style="padding:26px 30px; color:#333; font-size:15px; line-height:1.6;">
          <p style="margin:0 0 10px;">Hola <strong>${nombres}</strong>,</p>
          <p style="margin:0 0 14px;">Gracias por registrarte. Tu inscripción ha sido confirmada exitosamente.</p>

          <div style="margin:14px 0 16px; padding:14px 16px; border:1px solid #eef0f3; border-radius:12px; background:#fafbfc;">
            <p style="margin:0 0 10px; font-weight:700; color:#00324d;">Detalles del evento</p>
            <table cellpadding="0" cellspacing="0" style="width:100%; font-size:14px; color:#374151;">
              <tr>
                <td style="padding:6px 0; width:220px;">📌 <strong style="color:#111;">Tipo de asistencia:</strong></td>
                <td style="padding:6px 0;">${evento}</td>
              </tr>
              ${placeOrLinkRow}
              <tr>
                <td style="padding:6px 0; width:220px;">🗓️ <strong style="color:#111;">Fecha:</strong></td>
                <td style="padding:6px 0;">12 de marzo 2026</td>
              </tr>
              <tr>
                <td style="padding:6px 0; width:220px;">⏰ <strong style="color:#111;">Hora:</strong></td>
                <td style="padding:6px 0;">2:30 a 4:30 PM</td>
              </tr>
            </table>
          </div>

          ${qrBlock}

          <p style="margin:14px 0 8px;">${recomendaciones}</p>
          <p style="margin:0 0 18px;">${nota}</p>

          <hr style="border:none; border-top:1px solid #eaeaea; margin:20px 0;">
          <p style="margin:0 0 8px; text-align:center; font-size:16px; font-weight:800; color:#00324d;">¡Te esperamos!</p>
          <p style="margin:0; text-align:center; color:#6b7280; font-size:12px; line-height:1.5;">
            Este mensaje es una confirmación automática de tu registro.
          </p>

          <div style="margin-top:14px; text-align:center;">
            <p style="margin:0; font-size:14px; color:#111;">Cordialmente,</p>
            <p style="margin:6px 0 0; font-size:14px; font-weight:800; color:#00324d;">
              Grupo de Gestión para la Productividad y la Competitividad (GGPC)
            </p>
            <p style="margin:4px 0 0; font-size:12px; color:#6b7280;">Formación Continua Especializada – SENA</p>
          </div>
        </td></tr>

        <tr><td style="padding:0;">
          <div style="height:4px; background:linear-gradient(90deg,#39a900 0%, #6c29b3 100%);"></div>
          <div style="background:#f7f7f9; padding:14px 18px; text-align:center; font-size:12px; color:#6b7280; line-height:1.4;">
            <strong style="color:#00324d;">SENA – GGPC</strong><br>
            © 2026 · Todos los derechos reservados<br>
            <span style="font-size:11px; color:#9aa0a6;">Este correo fue generado automáticamente. No respondas con información sensible.</span>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendConfirmationEmail({ to, nombres, modalidad }) {
  const { isPresencial, subject, evento, address, recomendaciones, nota } = getEventMeta(modalidad);

  const html = buildEmailHtml({
    nombres: capitalizeFullName(nombres),
    evento,
    address,
    recomendaciones,
    nota,
    isPresencial,
  });

  const attachments = [];

  const bannerB64 = getBannerAsBase64();
  if (bannerB64) {
    attachments.push({
      filename: "formularioprincipal.jpg",
      content: bannerB64,
      type: "image/jpeg",
      disposition: "inline",
      content_id: "banner",
    });
  }

  if (!isPresencial) {
    const qrB64 = await getQrAsBase64(address);
    attachments.push({
      filename: "qr-teams.png",
      content: qrB64,
      type: "image/png",
      disposition: "inline",
      content_id: "qrTeams",
    });
  }

  await sendEmail({ to, subject, html, attachments });
}

export const postDatosBasicos = async (req, res) => {
  try {
    const data = normalize(req.body);

    const existeNit = await findDatosBasicosByNumeroIdentificacion(data.numeroidentificacion);
    if (existeNit) {
      return res.status(409).json({
        msg: `El número de identificación ${data.numeroidentificacion} ya se encuentra registrado.`,
      });
    }

    const repsEmpresa = await countDatosBasicosByEmpresaId(data.empresaid);
    if (repsEmpresa >= 2) {
      return res.status(409).json({ msg: "Solo se permiten dos representantes por empresa" });
    }

    if (data.modalidad === 1) {
      const CUPOMAX = 120;
      const { presencial } = await getDatosBasicosStatsRepo();
      if (presencial >= CUPOMAX) {
        return res.status(409).json({ msg: "Cupo presencial agotado (120)." });
      }
    }

    const id = await createDatosBasicos(data);
    const creado = await findDatosBasicosById(id);

    let mailStatus = "sent";
    let mailError = null;

    try {
      await sendConfirmationEmail({
        to: data.correo,
        nombres: data.nombres,
        modalidad: data.modalidad,
      });
    } catch (e) {
      mailStatus = "failed";
      mailError = e.message;
      console.error("MAIL_FAIL_POST:", e);
    }

    return res.status(201).json({
      msg:
        mailStatus === "sent"
          ? "Registro guardado y correo enviado correctamente"
          : "Registro guardado, pero falló el envío de correo",
      datobasicoCreado: creado,
      mailStatus,
      mailError,
    });
  } catch (error) {
    console.error("POST_DATOSBASICOS_FAIL:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getDatosBasicos = async (req, res) => {
  try {
    const data = await findAllDatosBasicos();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "No se puede buscar los datos básicos", error: error.message });
  }
};

export const getDatosBasicosId = async (req, res) => {
  try {
    const { id } = req.params;

    const datos = await findDatosBasicosById(id);

    if (!datos) return res.status(404).json({ msg: `Sin coincidencias para ${id}` });
    return res.json(datos);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getDatosBasicosNumIdentificacion = async (req, res) => {
  try {
    const { numeroidentificacion } = req.params;

    if (!numeroidentificacion) {
      return res.status(400).json({ msg: "El número de identificación es obligatorio" });
    }

    const datos = await findDatosBasicosByNumeroIdentificacion(numeroidentificacion);

    if (!datos) return res.status(404).json({ msg: `Sin coincidencias para ${numeroidentificacion}` });
    return res.json(datos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDatosBasicosStats = async (req, res) => {
  try {
    const CUPOMAX = 120;

    const { presencial, virtual } = await getDatosBasicosStatsRepo();

    const total = presencial + virtual;

    return res.status(200).json({
      cupoMaxPresencial: CUPOMAX,
      presencialConfirmados: presencial,
      virtualConfirmados: virtual,
      totalConfirmados: total,
      disponiblesPresencial: Math.max(0, CUPOMAX - presencial),
      llenoPresencial: presencial >= CUPOMAX,
      timestamp: Date.now(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const putDatosBasicos = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findDatosBasicosById(id);
    if (!actual) return res.status(404).json({ msg: "No encontrado" });

    const existeNit = await findDatosBasicosByNumeroIdentificacion(data.numeroidentificacion);
    if (existeNit && Number(existeNit.DATOSBASICOSID) !== Number(id)) {
      return res.status(409).json({
        msg: "Ya existe un usuario registrado con ese número de identificación",
      });
    }

    const updated = await updateDatosBasicos(id, data);
    if (!updated) return res.status(404).json({ msg: "No encontrado" });

    const actualizado = await findDatosBasicosById(id);

    let mailStatus = "sent";
    let mailError = null;

    try {
      await sendConfirmationEmail({
        to: data.correo,
        nombres: data.nombres,
        modalidad: data.modalidad,
      });
    } catch (e) {
      mailStatus = "failed";
      mailError = e.message;
      console.error("MAIL_FAIL_PUT:", e);
    }

    return res.status(200).json({
      msg:
        mailStatus === "sent"
          ? "Actualización guardada y correo enviado correctamente"
          : "Actualización guardada, pero falló el envío de correo",
      actualizado,
      mailStatus,
      mailError,
    });
  } catch (error) {
    console.error("PUT_DATOSBASICOS_FAIL:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDatosBasicos = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteDatosBasicosRepo(id);

    if (!deleted) {
      return res.status(400).json({ msg: `El Usuario: ${id} no se encuentra en la base de datos` });
    }

    return res.json({ msg: `Se eliminó el Usuario: ${id} de la base de datos` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
