import Empresa from "../models/empresa.js";

const normalizeEmpresa = (e) => ({
  ...e,
  numeroidentificacion: String(e.numeroidentificacion ?? "").trim().replace(/\D+/g, ""),
  dv: String(e.dv ?? "").trim().replace(/\D+/g, "").slice(0, 1),
  empresa: String(e.empresa ?? "").trim().toLowerCase(),
});

export const postEmpresa = async (req, res) => {
  try {
    const payload = req.body;

    // masivo
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalizeEmpresa);

      const numeros = normalized.map((x) => x.numeroidentificacion);

      // duplicados dentro del envío
      if (new Set(numeros).size !== numeros.length) {
        return res.status(400).json({ msg: "Hay números de identificación duplicados dentro del envío." });
      }

      // duplicados contra BD
      const existentes = await Empresa.find(
        { numeroidentificacion: { $in: numeros } },
        { numeroidentificacion: 1 }
      ).lean();

      if (existentes.length > 0) {
        return res.status(409).json({
          msg: "Algunos números ya existen en la base de datos.",
          numerosidentificacionDuplicados: existentes.map((a) => a.numeroidentificacion),
        });
      }

      const insertados = await Empresa.insertMany(normalized, { ordered: false });

      return res.status(201).json({
        msg: "Empresas insertadas correctamente",
        total: insertados.length,
      });
    }

  //  indivudual
    const doc = normalizeEmpresa(payload);

    const existe = await Empresa.findOne({ numeroidentificacion: doc.numeroidentificacion }).lean();
    if (existe) {
      return res.status(409).json({ msg: "El número de identificación ya se encuentra registrado." });
    }

    const creado = await Empresa.create(doc);
    return res.status(201).json(creado);
  } catch (error) {
    // Por si pega el índice unique
    if (error?.code === 11000) {
      return res.status(409).json({ msg: "Número de identificación duplicado.", error: error.message });
    }
    return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

export const getEmpresa = async (req, res) => {
  try {
    const lista = await Empresa.find()
      .populate("tipoidentificacion", "nombre codigo sigla")
      .populate("tamanoempresa", "nombre codigo")
      .lean();

    return res.json({ data: lista });
  } catch (error) {
    return res.status(500).json({ msg: "No se puede buscar Empresa", error: error.message });
  }
};

export const getEmpresaId = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresa.findById(id)
      .populate("tipoidentificacion", "nombre codigo sigla")
      .populate("tamanoempresa", "nombre codigo")
      .lean();

    if (!empresa) return res.status(404).json({ msg: `Sin coincidencias para ${id}` });
    return res.json(empresa);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getEmpresaNumIdentificacion = async (req, res) => {
  try {
    const raw = req.params?.numeroidentificacion;

    const nit = String(raw ?? "")
      .trim()
      .replace(/\D+/g, ""); // SOLO dígitos

    if (!nit) {
      return res.status(400).json({ msg: "El número de identificación es obligatorio" });
    }

    const empresa = await Empresa.findOne({ numeroidentificacion: nit })
      .populate("tipoidentificacion")
      .populate("tamanoempresa")
      .lean();

    if (!empresa) {
      return res.status(404).json({ msg: `Sin coincidencias para ${nit}` });
    }

    return res.status(200).json(empresa);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const putEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const body = normalizeEmpresa(req.body);

    // si quieren cambiar el numeroidentificacion, validar duplicado
    const existe = await Empresa.findOne({ numeroidentificacion: body.numeroidentificacion }).lean();
    if (existe && String(existe._id) !== String(id)) {
      return res.status(409).json({ msg: "El número de identificación ya está registrado en otra empresa." });
    }

    const updated = await Empresa.findByIdAndUpdate(
      id,
      {
        $set: {
          tipoidentificacion: body.tipoidentificacion,
          numeroidentificacion: body.numeroidentificacion,
          dv: body.dv,
          empresa: body.empresa,
          tamanoempresa: body.tamanoempresa,
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Empresa no encontrada" });
    return res.status(200).json(updated);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ msg: "Número de identificación duplicado.", error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Empresa.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ msg: `Empresa con id ${id} no existe` });
    }
    return res.json({ msg: `Se eliminó la empresa con id: ${id}` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
