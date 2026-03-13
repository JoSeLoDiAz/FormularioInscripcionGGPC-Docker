import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY no está definida");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * attachments: [{ filename, content (base64), type, disposition, content_id }]
 * Para inline: disposition="inline" y content_id debe coincidir con el cid del HTML (sin "cid:")
 */
export async function sendEmail({ to, subject, html, attachments = [] }) {
  const from = process.env.MAIL_FROM; // Ej: "GGPC <no-reply@ggpcsena.com>"
  if (!from) throw new Error("MAIL_FROM no está definida");

  return sgMail.send({
    to,
    from,
    subject,
    html,
    attachments,
  });
}
