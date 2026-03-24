import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteCiudad,
  getCiudad,
  getCiudadId,
  postCiudad,
  putCiudad,
} from "../controllers/ciudad.js";

const router = Router();

const reglasObj = [
  body("nombre", "Ingrese el nombre de la Ciudad")
    .trim()
    .notEmpty(),

  body("departamentoid", "Ingrese un DEPARTAMENTOID válido")
    .notEmpty()
    .isNumeric(),
];

const reglasArr = [
  body("*.nombre", "Ingrese el nombre de la Ciudad")
    .trim()
    .notEmpty(),

  body("*.departamentoid", "Ingrese un DEPARTAMENTOID válido")
    .notEmpty()
    .isNumeric(),
];

router.post(
  "/",
  async (req, res, next) => {
    try {
      const rules = Array.isArray(req.body) ? reglasArr : reglasObj;
      await Promise.all(rules.map((r) => r.run(req)));
      next();
    } catch (error) {
      next(error);
    }
  },
  validarCampos,
  postCiudad
);

router.get("/", getCiudad);
router.get("/:id", getCiudadId);

router.put(
  "/:id",
  reglasObj,
  validarCampos,
  putCiudad
);

router.delete("/:id", deleteCiudad);

export default router;
