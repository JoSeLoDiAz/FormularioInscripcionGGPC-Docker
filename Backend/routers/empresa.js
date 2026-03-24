import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteEmpresa,
  getEmpresa,
  getEmpresaId,
  getEmpresaNumIdentificacion,
  postEmpresa,
  putEmpresa,
} from "../controllers/empresa.js";

const router = Router();

const reglasObj = [
  body("tipodocumentoid", "Ingrese un TIPODOCUMENTOID válido")
    .notEmpty()
    .isNumeric(),

  body("tamanoempresaid", "Ingrese un TAMANOEMPRESAID válido")
    .notEmpty()
    .isNumeric(),

  body("numeroidentificacion", "Número de identificación debe ser numérico")
    .trim()
    .notEmpty()
    .matches(/^\d+$/),

  body("dv", "El DV debe contener solo dígitos")
    .trim()
    .notEmpty()
    .matches(/^\d+$/),

  body("empresa", "Complete la razón social")
    .trim()
    .notEmpty(),
];

const reglasArr = [
  body("*.tipodocumentoid", "Ingrese un TIPODOCUMENTOID válido")
    .notEmpty()
    .isNumeric(),

  body("*.tamanoempresaid", "Ingrese un TAMANOEMPRESAID válido")
    .notEmpty()
    .isNumeric(),

  body("*.numeroidentificacion", "Número de identificación debe ser numérico")
    .trim()
    .notEmpty()
    .matches(/^\d+$/),

  body("*.dv", "El DV debe contener solo dígitos")
    .trim()
    .notEmpty()
    .matches(/^\d+$/),

  body("*.empresa", "Complete la razón social")
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
  postEmpresa
);

router.get("/", getEmpresa);
router.get("/nit/:numeroidentificacion", getEmpresaNumIdentificacion);
router.get("/:id", getEmpresaId);

router.put(
  "/:id",
  reglasObj,
  validarCampos,
  putEmpresa
);

router.delete("/:id", deleteEmpresa);

export default router;
