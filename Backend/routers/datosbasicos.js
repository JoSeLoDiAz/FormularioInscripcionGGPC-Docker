import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";


const router = Router()

import {
   deleteDatosBasicos,
   getDatosBasicos,
   getDatosBasicosId,
   getDatosBasicosNumIdentificacion,
   getDatosBasicosStats,
   postDatosBasicos,
   putDatosBasicos
} from "../controllers/datosbasicos.js";

router.post("/",[
   check("tipodocumento","Tipo Documento Invalido").trim().isMongoId(),
   check("numeroidentificacion","complete el campo Número de Identificación").trim().not().isEmpty().toLowerCase(),
   check("nombres","Complete el campo Nombres").trim().not().isEmpty().toLowerCase(),
   check("primerapellido", "Complete el campo Primer Apellido").trim().not().isEmpty().toLowerCase(),
   check("segundoapellido").optional().trim().toLowerCase(),
   check("empresa", "Empresa inválida").isMongoId(),
   check("celular","Complete el campo Celular").trim().not().isEmpty().toLowerCase(),
   check("correo","Complete el campo Correo Electronico").trim().not().isEmpty().toLowerCase(),
   check("departamento","Departamento Invalido").trim().isMongoId(),
   check("ciudad","Ciudad Invalida").trim().isMongoId(),
   check("modalidad","Por favor seleccione la modalidad").trim().not().isEmpty(), validarCampos
],postDatosBasicos)

router.get('/', getDatosBasicos);

router.get('/id/:id',getDatosBasicosId);

router.get('/stats', getDatosBasicosStats);

router.get('/:numeroidentificacion', getDatosBasicosNumIdentificacion);

router.put('/:id',[
   check("tipodocumento","Tipo Documento Invalido").trim().isMongoId(),
   check("numeroidentificacion","complete el campo Número de Identificación").trim().not().isEmpty().toLowerCase(),
   check("nombres","Complete el campo Nombres").trim().not().isEmpty().toLowerCase(),
   check("primerapellido", "Complete el campo Primer Apellido").trim().not().isEmpty().toLowerCase(),
   check("segundoapellido").optional().trim().toLowerCase(),
   check("empresa", "Empresa inválida").isMongoId(),
   check("celular","Complete el campo Celular").trim().not().isEmpty().toLowerCase(),
   check("correo","Complete el campo Correo Electronico").trim().not().isEmpty().toLowerCase(),
   check("departamento","Departamento Invalido").trim().isMongoId(),
   check("ciudad","Ciudad Invalida").trim().isMongoId(), validarCampos,
   check("modalidad","Por favor seleccione la modalidad").trim().not().isEmpty(), validarCampos
], putDatosBasicos)

router.delete('/:id', deleteDatosBasicos);

export default router;
