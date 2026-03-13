import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
   postTipoDocumento,
   getTipoDocumento,
   getTipoDocumentoId,
   putTipoDocumento,
   deleteTipoDocumento,
} from "../controllers/tipodocumento.js";

const router = Router();

const reglasObj = [
   body("codigo", "Ingrese el código del TipoDocumento").notEmpty().isNumeric(),
   body("nombre", "Ingrese el nombre del TipoDocumento").trim().notEmpty(),
   body("documentoempresa", "documentoempresa debe ser 0 (persona) o 1 (empresa)")
      .notEmpty()
      .isIn([0, 1, "0", "1"]),
];

const reglasArr = [
   body("*.codigo", "Ingrese el código del TipoDocumento").notEmpty().isNumeric(),
   body("*.nombre", "Ingrese el nombre del TipoDocumento").trim().notEmpty(),
   body("*.documentoempresa", "documentoempresa debe ser 0 (persona) o 1 (empresa)")
      .notEmpty()
      .isIn([0, 1, "0", "1"]),
];

// POST: detecta si viene array u objeto
router.post(
   "/",
   (req, res, next) => {
      const rules = Array.isArray(req.body) ? reglasArr : reglasObj;
      Promise.all(rules.map((r) => r.run(req))).then(() => next()).catch(next);
   },
   validarCampos,
   postTipoDocumento
);

router.get("/", getTipoDocumento);
router.get("/id/:id", getTipoDocumentoId);

router.put("/:id", [...reglasObj, validarCampos], putTipoDocumento);
router.delete("/:id", deleteTipoDocumento);

export default router;
