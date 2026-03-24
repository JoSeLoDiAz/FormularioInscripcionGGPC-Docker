import {
  createManyEmpresa,
  createEmpresa,
  deleteEmpresa as deleteEmpresaRepo,
  findAllEmpresa,
  findEmpresaById,
  findEmpresaByNumeroIdentificacion,
  updateEmpresa,
} from "../repositories/empresa.js";

const normalize = (e) => ({
  tipodocumentoid: Number(e.tipodocumentoid),
  numeroidentificacion: String(e.numeroidentificacion ?? "").trim().replace(/\D+/g, ""),
  dv: String(e.dv ?? "").trim().replace(/\D+/g, "").slice(0, 5),
  empresa: String(e.empresa ?? "").trim().toLowerCase(),
  tamanoempresaid: Number(e.tamanoempresaid),
});

const isUniqueConstraintError = (error) => {
  return error?.errorNum === 1 || error?.code === "ORA-00001";
};

export const postEmpresa = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const numeros = normalized.map((x) => x.numeroidentificacion);

      if (new Set(numeros).size !== numeros.length) {
        return res.status(400).json({
          msg: "Hay números de identificación duplicados dentro del envío.",
        });
      }

      const total = await createManyEmpresa(normalized);

      return res.status(201).json({
        msg: "Empresas insertadas correctamente",
        total,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const existe = await findEmpresaByNumeroIdentificacion(data.numeroidentificacion);

    if (existe) {
      return res.status(409).json({
        msg: "El número de identificación ya se encuentra registrado.",
      });
    }

    const id = await createEmpresa(data);
    const creada = await findEmpresaById(id);

    return res.status(201).json(creada);
  } catch (error) {
    console.error("postEmpresa:", error);

    if (isUniqueConstraintError(error)) {
      return res.status(409).json({
        msg: "Número de identificación duplicado.",
        error: error.message,
      });
    }

    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getEmpresa = async (req, res) => {
  try {
    const data = await findAllEmpresa();

    return res.json({ data });
  } catch (error) {
    console.error("getEmpresa:", error);

    return res.status(500).json({
      msg: "No se puede buscar Empresa",
      error: error.message,
    });
  }
};

export const getEmpresaId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await findEmpresaById(id);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${id}`,
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("getEmpresaId:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

export const getEmpresaNumIdentificacion = async (req, res) => {
  try {
    const raw = req.params?.numeroidentificacion;

    const nit = String(raw ?? "").trim().replace(/\D+/g, "");

    if (!nit) {
      return res.status(400).json({
        msg: "El número de identificación es obligatorio",
      });
    }

    const item = await findEmpresaByNumeroIdentificacion(nit);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${nit}`,
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("getEmpresaNumIdentificacion:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const putEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findEmpresaById(id);

    if (!actual) {
      return res.status(404).json({
        msg: "Empresa no encontrada",
      });
    }

    const existe = await findEmpresaByNumeroIdentificacion(data.numeroidentificacion);

    if (existe && Number(existe.EMPRESAID) !== Number(id)) {
      return res.status(409).json({
        msg: "El número de identificación ya está registrado en otra empresa.",
      });
    }

    const updated = await updateEmpresa(id, data);

    if (!updated) {
      return res.status(404).json({
        msg: "Empresa no encontrada",
      });
    }

    const actualizada = await findEmpresaById(id);

    return res.json(actualizada);
  } catch (error) {
    console.error("putEmpresa:", error);

    if (isUniqueConstraintError(error)) {
      return res.status(409).json({
        msg: "Número de identificación duplicado.",
        error: error.message,
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteEmpresaRepo(id);

    if (!deleted) {
      return res.status(404).json({
        msg: `No existe el id: ${id}`,
      });
    }

    return res.json({
      msg: `Se eliminó la empresa con id: ${id}`,
    });
  } catch (error) {
    console.error("deleteEmpresa:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
