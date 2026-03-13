import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";
import {
  postTamanoEmpresa,
  getTamanoEmpresa,
  getTamanoEmpresaId,
  putTamanoEmpresa,
  deleteTamanoEmpresa,
} from "../controllers/tamanoempresa.js";

const router = Router();

const reglasObj = [
  body("codigo", "El código es obligatorio y debe ser numérico").notEmpty().isNumeric(),
  body("nombre", "El nombre es obligatorio").trim().notEmpty(),
];

const reglasArr = [
  body("*.codigo", "El código es obligatorio y debe ser numérico").notEmpty().isNumeric(),
  body("*.nombre", "El nombre es obligatorio").trim().notEmpty(),
];

router.post(
  "/",
  (req, res, next) => {
    const rules = Array.isArray(req.body) ? reglasArr : reglasObj;
    Promise.all(rules.map((r) => r.run(req))).then(() => next()).catch(next);
  },
  validarCampos,
  postTamanoEmpresa
);

router.get("/", getTamanoEmpresa);
router.get("/id/:id", getTamanoEmpresaId);

router.put("/:id", [...reglasObj, validarCampos], putTamanoEmpresa);
router.delete("/:id", deleteTamanoEmpresa);

export default router;
