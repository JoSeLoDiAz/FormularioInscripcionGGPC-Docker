import {
  createManyDepartamento,
  createDepartamento,
  deleteDepartamento as deleteDepartamentoRepo,
  findAllDepartamento,
  findDepartamentoById,
  updateDepartamento,
} from "../repositories/departamento.js";

const normalize = (d) => ({
  nombre: String(d.nombre ?? "").trim().toLowerCase(),
});

export const postDepartamento = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const total = await createManyDepartamento(normalized);

      return res.status(201).json({
        msg: "Departamentos insertados correctamente",
        total,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const id = await createDepartamento(data);
    const creado = await findDepartamentoById(id);

    return res.status(201).json(creado);
  } catch (error) {
    console.error("postDepartamento:", error);

    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getDepartamento = async (req, res) => {
  try {
    const data = await findAllDepartamento();

    return res.json({ data });
  } catch (error) {
    console.error("getDepartamento:", error);

    return res.status(500).json({
      msg: "No se puede buscar el Departamento",
      error: error.message,
    });
  }
};

export const getDepartamentoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await findDepartamentoById(id);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${id}`,
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("getDepartamentoId:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

export const putDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findDepartamentoById(id);

    if (!actual) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    const updated = await updateDepartamento(id, data);

    if (!updated) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    const actualizado = await findDepartamentoById(id);

    return res.json(actualizado);
  } catch (error) {
    console.error("putDepartamento:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteDepartamento = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteDepartamentoRepo(id);

    if (!deleted) {
      return res.status(404).json({
        msg: `No existe el id: ${id}`,
      });
    }

    return res.json({
      msg: `Se eliminó el departamento con id: ${id}`,
    });
  } catch (error) {
    console.error("deleteDepartamento:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
