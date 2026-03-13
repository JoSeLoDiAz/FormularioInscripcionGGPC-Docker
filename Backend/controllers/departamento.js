import Departamento from "../models/departamento.js";
import dotenv from "dotenv";
dotenv.config();


export const postDepartamento = async (req, res) => {
  try {
    const payload = req.body;

    // Si llega un ARRAY (carga masiva)
    if (Array.isArray(payload)) {

      // Validar códigos duplicados dentro del mismo array
      const codigos = payload.map(d => d.codigo);
      const codigosUnicos = new Set(codigos);

      if (codigos.length !== codigosUnicos.size) {
        return res.status(400).json({
          msg: "Existen códigos duplicados dentro del envío."
        });
      }

      // Validar si ya existen en BD
      const existentes = await Departamento.find({
        codigo: { $in: codigos }
      });

      if (existentes.length > 0) {
        return res.status(409).json({
          msg: "Algunos códigos ya existen en la base de datos.",
          codigosDuplicados: existentes.map(e => e.codigo)
        });
      }

      const departamentosInsertados = await Departamento.insertMany(payload, {
        ordered: false
      });

      return res.status(201).json({
        msg: "Departamentos insertados correctamente",
        total: departamentosInsertados.length
      });
    }

    // Si llega UN solo objeto
    const { codigo } = payload;

    const buscarCodigo = await Departamento.findOne({ codigo });

    if (buscarCodigo) {
      return res.status(409).json({
        msg: "El código ingresado ya se encuentra registrado"
      });
    }

    const departamentoCreado = await Departamento.create(payload);

    return res.status(201).json(departamentoCreado);

  } catch (error) {
    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message
    });
  }
};

export const getDepartamento = async (req, res) => {
  try {
    const buscar = await Departamento.find()
    res.json({ buscar });
  } catch (error) {
    res.status(500).json({ msg: "No se puede buscar el departamento" });
  }
}

export const getDepartamentoId = async (req, res) => {
  try {
    const { id } = req.params;
    const DepartamentoId = await Departamento.findById(id)
      .populate("departamento")
    if (DepartamentoId) {
      res.json(DepartamentoId);
    } else {
      return res.status(404).json({ msg: `Sin coincidencias para ${id}` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const putDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nombre,
    } = req.body;

    const buscarCodigo = await Departamento.findOne({
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

    const buscarDepartamento = await Departamento.findByIdAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true }
    );
    res.status(201).json(buscarDepartamento);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const deleteDepartamento = async (req, res) => {
  const { id } = req.params;
  const DepartamentoEliminado = await Departamento.findOneAndDelete({ _id: id });

  if (DepartamentoEliminado) {
    return res.json({
      msg: `Se eliminó el Departamento: ${id} de la base de datos`,
    });
  } else {
    res
      .status(400)
      .json({ msg: `El Departamento: ${id} no se encuentra en la base de datos` });
  }
};
