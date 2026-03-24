import {
  createManyTipoDocumento,
  createTipoDocumento,
  deleteTipoDocumento as deleteTipoDocumentoRepo,
  findAllTipoDocumento,
  findTipoDocumentoById,
  updateTipoDocumento,
} from "../repositories/tipodocumento.js";

const normalize = (d) => ({
  nombre: String(d.nombre ?? "").trim().toLowerCase(),
  documentoempresa: Number(d.documentoempresa), // 0 persona, 1 empresa
});

export const postTipoDocumento = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const total = await createManyTipoDocumento(normalized);

      return res.status(201).json({
        msg: "Tipos de documento insertados correctamente",
        total,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const id = await createTipoDocumento(data);
    const creado = await findTipoDocumentoById(id);

    return res.status(201).json(creado);
  } catch (error) {
    console.error("postTipoDocumento:", error);

    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getTipoDocumento = async (req, res) => {
  try {
    const { documentoempresa } = req.query;
    const data = await findAllTipoDocumento(documentoempresa);

    return res.json({ data });
  } catch (error) {
    console.error("getTipoDocumento:", error);

    return res.status(500).json({
      msg: "No se puede buscar el Tipo de Documento",
      error: error.message,
    });
  }
};

export const getTipoDocumentoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await findTipoDocumentoById(id);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${id}`,
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("getTipoDocumentoId:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

export const putTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findTipoDocumentoById(id);

    if (!actual) {
      return res.status(404).json({
        msg: "TipoDocumento no encontrado",
      });
    }

    const updated = await updateTipoDocumento(id, data);

    if (!updated) {
      return res.status(404).json({
        msg: "TipoDocumento no encontrado",
      });
    }

    const actualizado = await findTipoDocumentoById(id);

    return res.json(actualizado);
  } catch (error) {
    console.error("putTipoDocumento:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTipoDocumentoRepo(id);

    if (!deleted) {
      return res.status(404).json({
        msg: `No existe el id: ${id}`,
      });
    }

    return res.json({
      msg: `Se eliminó el tipo de documento con id: ${id}`,
    });
  } catch (error) {
    console.error("deleteTipoDocumento:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
