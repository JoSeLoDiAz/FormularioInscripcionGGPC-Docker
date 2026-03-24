import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import {
  createLogin,
  deleteLogin as deleteLoginRepo,
  findLoginByEmail,
  findLoginById,
  updateLogin,
  updateLoginEstado,
} from "../repositories/login.js";

const isUniqueConstraintError = (error) => {
  return error?.errorNum === 1 || error?.code === "ORA-00001";
};

export const postLogin = async (req, res) => {
  try {
    const { email, password, estado } = req.body;

    const correo = await findLoginByEmail(email);

    if (correo) {
      return res.status(404).json({
        msg: `Se encontró un Usuario registrado con el correo ${email}`,
      });
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const id = await createLogin({
      email,
      password: hashedPassword,
      estado,
      datosbasicosid: req.body.datosbasicosid ?? null,
    });

    const creado = await findLoginById(id);

    return res.status(201).json(creado);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({ msg: "El correo ya está registrado.", error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const postLoginToken = async (req, res) => {
  const { email, password } = req.body;

  try {
    const buscar = await findLoginByEmail(email);

    if (!buscar) {
      return res.status(400).json({ msg: "Usuario o password incorrectos" });
    }

    if (buscar.ESTADO === 2) {
      return res.status(400).json({ msg: "Usuario Inactivo" });
    }

    const validPassword = bcrypt.compareSync(password, buscar.PASSWORD);
    if (!validPassword) {
      return res.status(404).json({ msg: "Usuario o password incorrectos" });
    }

    const token = jwt.sign(
      {
        id: buscar.LOGINID,
        estado: buscar.ESTADO,
        origen: "senaggpc",
        convocatoria: "DSNFT-0001-FCE-2026",
        by: "EquipoTIC",
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.header("Authorization", token);
    return res.json({
      buscar,
      token,
      msj: "inicio de sesion exitoso ✅",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error", error: error.message });
  }
};

export const putLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const buscarEmail = await findLoginByEmail(email);
    if (buscarEmail && Number(buscarEmail.LOGINID) !== Number(id)) {
      return res.status(404).json({
        msg: "Ya se encuentra un Usuario registrado con ese correo",
      });
    }

    const updated = await updateLogin(id, { email, password });

    if (!updated) {
      return res.status(404).json({ msg: `No existe el id: ${id}` });
    }

    const actualizado = await findLoginById(id);
    return res.status(201).json(actualizado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const patchEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const usuario = await findLoginById(id);

    if (!usuario) {
      return res.status(404).json({ msg: `usuario con id: ${id} no encontrado` });
    }

    const updated = await updateLoginEstado(id, estado);

    if (!updated) {
      return res.status(404).json({ msg: `usuario con id: ${id} no encontrado` });
    }

    const actualizado = await findLoginById(id);
    return res.json(actualizado);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteLogin = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteLoginRepo(id);

    if (!deleted) {
      return res.status(400).json({ msg: `El Usuario: ${id} no se encuentra en la base de datos` });
    }

    return res.json({ msg: `Se eliminó el Usuario: ${id} de la base de datos` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
