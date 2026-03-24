import {
  createManyTamanoEmpresa,
  createTamanoEmpresa,
  deleteTamanoEmpresa as deleteTamanoEmpresaRepo,
  findAllTamanoEmpresa,
  findTamanoEmpresaById,
  updateTamanoEmpresa,
} from "../repositories/tamanoempresa.js";

const normalize = (d) => ({
  nombre: String(d.nombre ?? "").trim().toLowerCase(),
});

export const postTamanoEmpresa = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const total = await createManyTamanoEmpresa(normalized);

      return res.status(201).json({
        msg: "Tamaños de empresa insertados correctamente",
        total,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const id = await createTamanoEmpresa(data);
    const creado = await findTamanoEmpresaById(id);

    return res.status(201).json(creado);
  } catch (error) {
    console.error("postTamanoEmpresa:", error);

    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getTamanoEmpresa = async (req, res) => {
  try {
    const data = await findAllTamanoEmpresa();

    return res.json({ data });
  } catch (error) {
    console.error("getTamanoEmpresa:", error);

    return res.status(500).json({
      msg: "No se puede buscar Tamaño Empresa",
      error: error.message,
    });
  }
};

export const getTamanoEmpresaId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await findTamanoEmpresaById(id);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${id}`,
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("getTamanoEmpresaId:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

export const putTamanoEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findTamanoEmpresaById(id);

    if (!actual) {
      return res.status(404).json({
        msg: "TamanoEmpresa no encontrado",
      });
    }

    const updated = await updateTamanoEmpresa(id, data);

    if (!updated) {
      return res.status(404).json({
        msg: "TamanoEmpresa no encontrado",
      });
    }

    const actualizado = await findTamanoEmpresaById(id);

    return res.json(actualizado);
  } catch (error) {
    console.error("putTamanoEmpresa:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteTamanoEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTamanoEmpresaRepo(id);

    if (!deleted) {
      return res.status(404).json({
        msg: `No existe el id: ${id}`,
      });
    }

    return res.json({
      msg: `Se eliminó el Tamaño Empresa con id: ${id}`,
    });
  } catch (error) {
    console.error("deleteTamanoEmpresa:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
