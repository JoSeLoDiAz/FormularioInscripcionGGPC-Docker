import {validarCampos} from "../valichecks/validar-campos.js"
import {check} from "express-validator"
import { Router } from "express"

const router= Router()

import {
    postLogin,
    postLoginToken,
    putLogin,
    patchEstado,
    deleteLogin
} from '../controllers/login.js'

router.post("/",[
    check("email","Complete el Campo Email").trim().not().isEmpty().isEmail(),
    check("password", "Complete el campo Contraseña").trim().not().isEmpty(),
    validarCampos
],postLogin)

router.post("/token",[
    check("email","Falta el Usuario").trim().not().isEmpty(),
    check("password", "Falta la contraseña").trim().not().isEmpty(),
    validarCampos
],postLoginToken)

router.post('/:id',[
    check("email","Complete el Campo Email").trim().not().isEmpty().isEmail(),
    check("password", "Complete el campo Contraseña").trim().not().isEmpty(),
    validarCampos
],putLogin)

router.patch('/:id',patchEstado)

router.delete('/:id', deleteLogin);

export default router;