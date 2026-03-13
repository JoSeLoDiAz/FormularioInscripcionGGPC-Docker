import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
   postEmpresa,
   getEmpresa,
   getEmpresaNumIdentificacion,
   getEmpresaId,
   putEmpresa,
   deleteEmpresa,
} from "../controllers/empresa.js";

const router = Router();

const reglasObj = [
   body("tipoidentificacion", "Tipo de documento inválido").isMongoId(),
   body("tamanoempresa", "Tamaño de empresa inválido").isMongoId(),

   body("numeroidentificacion", "Número de identificación debe ser numérico")
      .trim()
      .notEmpty()
      .matches(/^\d+$/),

   body("dv", "El DV debe ser un solo dígito (0-9)")
      .trim()
      .matches(/^\d{1}$/),

   body("empresa", "Complete la razón social")
      .trim()
      .notEmpty(),
];

const reglasArr = [
   body("*.tipoidentificacion", "Tipo de documento inválido").isMongoId(),
   body("*.tamanoempresa", "Tamaño de empresa inválido").isMongoId(),

   body("*.numeroidentificacion", "Número de identificación debe ser numérico")
      .trim()
      .notEmpty()
      .matches(/^\d+$/),

   body("*.dv", "El DV debe ser un solo dígito (0-9)")
      .trim()
      .matches(/^\d{1}$/),

   body("*.empresa", "Complete la razón social")
      .trim()
      .notEmpty(),
];

router.post(
   "/",
   (req, res, next) => {
      const rules = Array.isArray(req.body) ? reglasArr : reglasObj;
      Promise.all(rules.map((r) => r.run(req))).then(() => next()).catch(next);
   },
   validarCampos,
   postEmpresa
);

router.get("/", getEmpresa);

router.get("/id/:id", getEmpresaId);
router.get("/nit/:numeroidentificacion", getEmpresaNumIdentificacion);
router.put("/:id", [...reglasObj, validarCampos], putEmpresa);
router.delete("/:id", deleteEmpresa);

export default router;
