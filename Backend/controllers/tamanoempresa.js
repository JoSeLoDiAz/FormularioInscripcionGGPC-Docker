import TamanoEmpresa from "../models/tamanoempresa.js";

const normalize = (data) => ({
  codigo: Number(data.codigo),
  nombre: String(data.nombre ?? "").trim().toLowerCase(),
});

export const postTamanoEmpresa = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);
      const codigos = normalized.map((x) => x.codigo);

      // duplicados dentro del envío
      if (new Set(codigos).size !== codigos.length) {
        return res.status(400).json({ msg: "Hay códigos duplicados en el envío." });
      }

      // duplicados en BD
      const existentes = await TamanoEmpresa.find(
        { codigo: { $in: codigos } },
        { codigo: 1 }
      ).lean();

      if (existentes.length > 0) {
        return res.status(409).json({
          msg: "Algunos códigos ya existen en la base de datos.",
          codigosDuplicados: existentes.map((a) => a.codigo),
        });
      }

      const insertados = await TamanoEmpresa.insertMany(normalized, {
        ordered: false,
      });

      return res.status(201).json({
        msg: "Tamaños de empresa insertados correctamente",
        total: insertados.length,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const existe = await TamanoEmpresa.findOne({ codigo: data.codigo });
    if (existe) {
      return res.status(409).json({
        msg: "El código ya se encuentra registrado.",
      });
    }

    const creado = await TamanoEmpresa.create(data);
    return res.status(201).json(creado);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        msg: "Código duplicado.",
        error: error.message,
      });
    }
    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getTamanoEmpresa = async (req, res) => {
  try {
    const lista = await TamanoEmpresa.find().sort({ codigo: 1 }).lean();
    return res.json({ data: lista });
  } catch (error) {
    return res.status(500).json({
      msg: "No se puede buscar Tamaño Empresa",
      error: error.message,
    });
  }
};

export const getTamanoEmpresaId = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await TamanoEmpresa.findById(id).lean();
    if (!item) {
      return res.status(404).json({ msg: "No encontrado" });
    }

    return res.json(item);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const putTamanoEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const existe = await TamanoEmpresa.findOne({ codigo: data.codigo });
    if (existe && String(existe._id) !== String(id)) {
      return res.status(409).json({
        msg: "Este código ya está registrado.",
      });
    }

    const actualizado = await TamanoEmpresa.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ msg: "No encontrado" });
    }

    return res.json(actualizado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTamanoEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await TamanoEmpresa.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({
        msg: "No existe el Tamaño Empresa",
      });
    }

    return res.json({
      msg: `Se eliminó el Tamaño Empresa con id: ${id}`,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
