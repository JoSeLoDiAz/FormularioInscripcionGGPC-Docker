import { Router } from "express";
import { body } from "express-validator";
import { validarCampos } from "../valichecks/validar-campos.js";

import {
  deleteLogin,
  patchEstado,
  postLogin,
  postLoginToken,
  putLogin,
} from "../controllers/login.js";

const router = Router();

router.post(
  "/",
  [
    body("email", "Complete el Campo Email").trim().notEmpty().isEmail(),
    body("password", "Complete el campo Contraseña").trim().notEmpty(),
    validarCampos,
  ],
  postLogin
);

router.post(
  "/token",
  [
    body("email", "Falta el Usuario").trim().notEmpty(),
    body("password", "Falta la contraseña").trim().notEmpty(),
    validarCampos,
  ],
  postLoginToken
);

router.put(
  "/:id",
  [
    body("email", "Complete el Campo Email").trim().notEmpty().isEmail(),
    body("password", "Complete el campo Contraseña").trim().notEmpty(),
    validarCampos,
  ],
  putLogin
);

router.patch("/:id", patchEstado);

router.delete("/:id", deleteLogin);

export default router;
