import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteTamanoEmpresa,
  getTamanoEmpresa,
  getTamanoEmpresaId,
  postTamanoEmpresa,
  putTamanoEmpresa,
} from "../controllers/tamanoempresa.js";

const router = Router();

const reglasObj = [
  body("nombre", "El nombre es obligatorio")
    .trim()
    .notEmpty(),
];

const reglasArr = [
  body("*.nombre", "El nombre es obligatorio")
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
  postTamanoEmpresa
);

router.get("/", getTamanoEmpresa);
router.get("/:id", getTamanoEmpresaId);

router.put(
  "/:id",
  reglasObj,
  validarCampos,
  putTamanoEmpresa
);

router.delete("/:id", deleteTamanoEmpresa);

export default router;
