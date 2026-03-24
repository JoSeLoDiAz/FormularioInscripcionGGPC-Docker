import {
  createManyCiudad,
  createCiudad,
  deleteCiudad as deleteCiudadRepo,
  findAllCiudad,
  findCiudadById,
  updateCiudad,
} from "../repositories/ciudad.js";

const normalize = (d) => ({
  nombre: String(d.nombre ?? "").trim().toLowerCase(),
  departamentoid: Number(d.departamentoid),
});

export const postCiudad = async (req, res) => {
  try {
    const payload = req.body;

    // MASIVO
    if (Array.isArray(payload)) {
      const normalized = payload.map(normalize);

      const total = await createManyCiudad(normalized);

      return res.status(201).json({
        msg: "Ciudades insertadas correctamente",
        total,
      });
    }

    // INDIVIDUAL
    const data = normalize(payload);

    const id = await createCiudad(data);
    const creada = await findCiudadById(id);

    return res.status(201).json(creada);
  } catch (error) {
    console.error("postCiudad:", error);

    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getCiudad = async (req, res) => {
  try {
    const { departamentoid } = req.query;
    const data = await findAllCiudad(departamentoid);

    return res.json({ data });
  } catch (error) {
    console.error("getCiudad:", error);

    return res.status(500).json({
      msg: "No se puede buscar la Ciudad",
      error: error.message,
    });
  }
};

export const getCiudadId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await findCiudadById(id);

    if (!item) {
      return res.status(404).json({
        msg: `Sin coincidencias para ${id}`,
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("getCiudadId:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

export const putCiudad = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalize(req.body);

    const actual = await findCiudadById(id);

    if (!actual) {
      return res.status(404).json({
        msg: "Ciudad no encontrada",
      });
    }

    const updated = await updateCiudad(id, data);

    if (!updated) {
      return res.status(404).json({
        msg: "Ciudad no encontrada",
      });
    }

    const actualizada = await findCiudadById(id);

    return res.json(actualizada);
  } catch (error) {
    console.error("putCiudad:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteCiudad = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCiudadRepo(id);

    if (!deleted) {
      return res.status(404).json({
        msg: `No existe el id: ${id}`,
      });
    }

    return res.json({
      msg: `Se eliminó la Ciudad con id: ${id}`,
    });
  } catch (error) {
    console.error("deleteCiudad:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
