import {validarCampos} from "../valichecks/validar-campos.js"
import {check} from "express-validator"
import { Router } from "express"


const router = Router()

import{
    postCiudad,
    getCiudad,
    getCiudadId,
    putCiudad,
    deleteCiudad
} from "../controllers/ciudad.js";

router.post(
   "/",
   [
      // array
      check("*.codigo", "Ingrese el codigo de la Ciudad").optional().notEmpty().isNumeric(),
      check("*.ciudad", "Ingrese el Nombre de la Ciudad").optional().trim().notEmpty().toLowerCase(),
      check("*.departamento", "Departamento inválido").optional().isMongoId(),

      // objeto
      check("codigo", "Ingrese el codigo de la Ciudad").optional().notEmpty().isNumeric(),
      check("ciudad", "Ingrese el Nombre de la Ciudad").optional().trim().notEmpty().toLowerCase(),
      check("departamento", "Departamento inválido").optional().isMongoId(),

      validarCampos
   ],
   postCiudad
);


router.get('/', getCiudad);

router.get('/id/:id',getCiudadId);

router.put('/:id',[
   check("codigo","Ingrese el  codigo de la Ciudad").trim().not().isEmpty().toLowerCase(),
   check("ciudad","Ingrese el Nombre de la Ciudad").trim().not().isEmpty().toLowerCase(),
   check("departamento","Departamento Invalido").trim().isMongoId(),validarCampos
], putCiudad);

router.delete('/:id', deleteCiudad);

export default router;
