import Ciudad from "../models/ciudad.js";
import dotenv from "dotenv";
dotenv.config();

export const postCiudad = async (req, res) => {
  try {
    const payload = req.body;

    //MASIVO (array)
    if (Array.isArray(payload)) {
      // normalizar
      payload.forEach(c => {
        c.codigo = Number(c.codigo);
        c.ciudad = String(c.ciudad).trim().toLowerCase();
      });

      const codigos = payload.map(c => c.codigo);

      // duplicados dentro del array
      if (new Set(codigos).size !== codigos.length) {
        return res.status(400).json({ msg: "Hay códigos duplicados dentro del envío." });
      }

      // duplicados contra BD
      const existentes = await Ciudad.find({ codigo: { $in: codigos } }, { codigo: 1 }).lean();
      if (existentes.length > 0) {
        return res.status(409).json({
          msg: "Algunos códigos ya existen en la base de datos.",
          codigosDuplicados: existentes.map(e => e.codigo)
        });
      }

      const insertados = await Ciudad.insertMany(payload, { ordered: false });

      return res.status(201).json({
        msg: "Ciudades insertadas correctamente",
        total: insertados.length
      });
    }

    // INDIVIDUAL (objeto)
    const codigo = Number(payload.codigo);

    const buscarCodigo = await Ciudad.findOne({ codigo });
    if (buscarCodigo) {
      return res.status(409).json({ msg: "El código ingresado ya se encuentra registrado" });
    }

    payload.codigo = codigo;
    payload.ciudad = String(payload.ciudad).trim().toLowerCase();

    const creado = await Ciudad.create(payload);
    return res.status(201).json(creado);

  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

export const getCiudad = async (req, res) => {
 try {
    const buscar = await Ciudad.find().populate("departamento")
    res.json({buscar});
 } catch (error) {
    res.status(500).json({ msg: "No se puede buscar la persona" });
 }
}

export const getCiudadId = async (req, res) => {
  try {
    const { id } = req.params;
    const CiudadId = await Ciudad.findById(id)
    .populate("departamento")
    if (CiudadId) {
      res.json(CiudadId);
    } else {
      return res.status(404).json({ msg: `Sin coincidencias para ${id}` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const putCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const {
        codigo,
        nombre,
        } = req.body;

    const buscarCodigo = await Ciudad.findOne({
      codigo: codigo,
    });

    if (buscarCodigo && buscarCodigo._id.toString() !== id) {
      return res.status(404).json({
        msg: "Este codigo ya se encuentra registrado.",
      });
    }

    let updatedData = {
        codigo: codigo,
        nombre: nombre,
    }

    const buscarCiudad = await Ciudad.findByIdAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true }
    );
    res.status(201).json(buscarCiudad);

    } catch (error) {
    return res.status(500).json({ error: error.message });
    }
}

export const deleteCiudad = async (req, res) => {
  const { id } = req.params;
  const CiudadEliminado = await Ciudad.findOneAndDelete({ _id: id });

  if (CiudadEliminado) {
    return res.json({
      msg: `Se eliminó la Ciudad: ${id} de la base de datos`,
    });
  } else {
    res
      .status(400)
      .json({ msg: `la Ciudad: ${id} no se encuentra en la base de datos` });
  }
};
