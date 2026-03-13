import { validarCampos } from "../valichecks/validar-campos.js"
import { check } from "express-validator"
import { Router } from "express"


const router = Router()

import{
    postDepartamento,
    getDepartamento,
    getDepartamentoId,
    putDepartamento,
    deleteDepartamento
} from "../controllers/departamento.js";

router.post("/",
   [
      // si viene array
      check("*.codigo", "Ingrese el codigo del Departamento").optional({ nullable: true }).notEmpty().isNumeric(),
      check("*.nombre", "Ingrese el Nombre del departamento").optional({ nullable: true }).trim().notEmpty().toLowerCase(),

      // si viene objeto
      check("codigo", "Ingrese el codigo del Departamento").optional({ nullable: true }).notEmpty().isNumeric(),
      check("nombre", "Ingrese el Nombre del departamento").optional({ nullable: true }).trim().notEmpty().toLowerCase(),

      validarCampos
   ],
   postDepartamento
);

router.get('/', getDepartamento);

router.get('/id/:id',getDepartamentoId);

router.put("/:id", [
   check("codigo", "Ingrese el codigo del Departamento").notEmpty().isNumeric(),
   check("nombre", "Ingrese el Nombre del departamento").trim().notEmpty().toLowerCase(),
   validarCampos
], putDepartamento);

router.delete('/:id', deleteDepartamento);

export default router;
