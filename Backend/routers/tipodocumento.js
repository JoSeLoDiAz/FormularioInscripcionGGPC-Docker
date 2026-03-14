import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
   deleteTipoDocumento,
   getTipoDocumento,
   getTipoDocumentoId,
   postTipoDocumento,
   putTipoDocumento,
} from "../controllers/tipodocumento.js";

const router = Router();

const reglasObj = [
   body("codigo", "Ingrese el código del TipoDocumento")
      .notEmpty()
      .isNumeric(),

   body("nombre", "Ingrese el nombre del TipoDocumento")
      .trim()
      .notEmpty(),

   body("documentoempresa", "documentoempresa debe ser 0 (persona) o 1 (empresa)")
      .notEmpty()
      .isIn([0, 1, "0", "1"]),
];

const reglasArr = [
   body("*.codigo", "Ingrese el código del TipoDocumento")
      .notEmpty()
      .isNumeric(),

   body("*.nombre", "Ingrese el nombre del TipoDocumento")
      .trim()
      .notEmpty(),

   body("*.documentoempresa", "documentoempresa debe ser 0 (persona) o 1 (empresa)")
      .notEmpty()
      .isIn([0, 1, "0", "1"]),
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
   postTipoDocumento
);

router.get("/", getTipoDocumento);
router.get("/:id", getTipoDocumentoId);

router.put(
   "/:id",
   reglasObj,
   validarCampos,
   putTipoDocumento
);

router.delete("/:id", deleteTipoDocumento);

export default router;
