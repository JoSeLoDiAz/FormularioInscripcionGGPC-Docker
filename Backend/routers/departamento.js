import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteDepartamento,
  getDepartamento,
  getDepartamentoId,
  postDepartamento,
  putDepartamento,
} from "../controllers/departamento.js";

const router = Router();

const reglasObj = [
  body("nombre", "Ingrese el nombre del Departamento")
    .trim()
    .notEmpty(),
];

const reglasArr = [
  body("*.nombre", "Ingrese el nombre del Departamento")
    .trim()
    .notEmpty(),
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
  postDepartamento
);

router.get("/", getDepartamento);
router.get("/:id", getDepartamentoId);

router.put(
  "/:id",
  reglasObj,
  validarCampos,
  putDepartamento
);

router.delete("/:id", deleteDepartamento);

export default router;
