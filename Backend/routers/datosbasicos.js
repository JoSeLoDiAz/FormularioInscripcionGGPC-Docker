import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteDatosBasicos,
  getDatosBasicos,
  getDatosBasicosId,
  getDatosBasicosNumIdentificacion,
  getDatosBasicosStats,
  postDatosBasicos,
  putDatosBasicos,
} from "../controllers/datosbasicos.js";

const router = Router();

const reglas = [
  body("tipodocumentoid", "Tipo Documento inválido").notEmpty().isNumeric(),

  body("numeroidentificacion", "Complete el campo Número de Identificación")
    .trim()
    .notEmpty(),

  body("nombres", "Complete el campo Nombres")
    .trim()
    .notEmpty(),

  body("primerapellido", "Complete el campo Primer Apellido")
    .trim()
    .notEmpty(),

  body("segundoapellido").optional({ nullable: true }).trim(),

  body("empresaid", "Empresa inválida").notEmpty().isNumeric(),

  body("celular", "Complete el campo Celular")
    .trim()
    .notEmpty(),

  body("correo", "Complete el campo Correo Electrónico")
    .trim()
    .notEmpty()
    .isEmail(),

  body("departamentoid", "Departamento inválido").notEmpty().isNumeric(),

  body("ciudadid", "Ciudad inválida").notEmpty().isNumeric(),

  body("modalidad", "Por favor seleccione la modalidad")
    .notEmpty()
    .isIn([1, 2, "1", "2"]),
];

router.post("/", reglas, validarCampos, postDatosBasicos);

router.get("/", getDatosBasicos);
router.get("/stats", getDatosBasicosStats);
router.get("/nit/:numeroidentificacion", getDatosBasicosNumIdentificacion);
router.get("/:id", getDatosBasicosId);

router.put("/:id", reglas, validarCampos, putDatosBasicos);

router.delete("/:id", deleteDatosBasicos);

export default router;
