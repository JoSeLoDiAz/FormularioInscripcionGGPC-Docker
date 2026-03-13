import TipoDocumento from "../models/tipodocumento.js";

const normalize = (d) => ({
  codigo: Number(d.codigo),
  nombre: String(d.nombre ?? "").trim().toLowerCase(),
  documentoempresa: Number(d.documentoempresa), // 0 persona, 1 empresa
});

export const postTipoDocumento = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO (array)
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const codigos = normalized.map((x) => x.codigo);

      // duplicados dentro del envío
      if (new Set(codigos).size !== codigos.length) {
        return res.status(400).json({ msg: "Hay códigos duplicados dentro del envío." });
      }

      // duplicados contra BD
      const existentes = await TipoDocumento.find(
        { codigo: { $in: codigos } },
        { codigo: 1 }
      ).lean();

      if (existentes.length > 0) {
        return res.status(409).json({
          msg: "Algunos códigos ya existen en la base de datos.",
          codigosDuplicados: existentes.map((a) => a.codigo),
        });
      }

      const insertados = await TipoDocumento.insertMany(normalized, { ordered: false });

      return res.status(201).json({
        msg: "Tipos de documento insertados correctamente",
        total: insertados.length,
      });
    }

    // INDIVIDUAL (objeto)
    const data = normalize(payload);

    const existe = await TipoDocumento.findOne({ codigo: data.codigo }).lean();
    if (existe) {
      return res.status(409).json({ msg: "El código ya se encuentra registrado." });
    }

    const creado = await TipoDocumento.create(data);
    return res.status(201).json(creado);

  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ msg: "Código duplicado.", error: error.message });
    }
    return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

export const getTipoDocumento = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.documentoempresa !== undefined) {
      filtro.documentoempresa = Number(req.query.documentoempresa);
    }
    const data = await TipoDocumento.find(filtro).sort({ codigo: 1 }).lean();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ msg: "No se puede buscar el Tipo de Documento", error: error.message });
  }
};

export const getTipoDocumentoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TipoDocumento.findById(id).lean();
    if (!item) return res.status(404).json({ msg: `Sin coincidencias para ${id}` });
    return res.json(item);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const putTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const existe = await TipoDocumento.findOne({ codigo: data.codigo }).lean();
    if (existe && String(existe._id) !== String(id)) {
      return res.status(409).json({ msg: "Este código ya se encuentra registrado." });
    }

    const actualizado = await TipoDocumento.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ msg: "TipoDocumento no encontrado" });
    return res.json(actualizado);

  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ msg: "Código duplicado.", error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await TipoDocumento.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ msg: `No existe el id: ${id}` });
    return res.json({ msg: `Se eliminó el tipo de documento con id: ${id}` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
