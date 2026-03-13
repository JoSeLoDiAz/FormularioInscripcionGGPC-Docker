import Login from "../models/login.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const postLogin = async (req, res) => {
    try {
        const {
            email,
            password,
            estado
        } = req.body

        const correo = await Login.findOne({ email: email });

        if (correo) {
      return res.status(404).json({
        msg: `Se encontro un Usuario registrado con el correo ${email}`,
      });
    } else {
        const nuevo = new Login({
          email: email,
          password: password,  
          estado: estado,
        })

        const salt = bcrypt.genSaltSync();
        nuevo.password = bcrypt.hashSync(req.body.password, salt);
        const Creado = await nuevo.save();
        res.status(201).json(Creado);
    }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const postLoginToken = async (req, res) => {
  const { email, password } = req.body;
  try {
    const buscar = await Login.findOne({ email });
    
    if (!buscar) {
      return res.status(400).json({
        msg: "Usuario o password incorrectos",
      });
    }
    if (buscar.estado === 2) {
      return res.status(400).json({
        msg: "Usuario Inactivo",
      });
    }
    const validPassword = bcrypt.compareSync(password, buscar.password);
    if (!validPassword) {
      return res.status(404).json({
        msg: "Usuario o password incorrectos",
      });
    }
    const token = jwt.sign(
      { 
        id: buscar.id,
        estado: buscar.estado,
        origen: "senaggpc",
        convocatoria: "DSNFT-0001-FCE-2026",
        by: "EquipoTIC",
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.header("Authorization", token);
    res.json({
      buscar,
      token,
      msj: "inicio de sesion exitoso ✅",
    });
  } catch (error) {
    console.log
    return res.status(500).json({
     
      msg: "Ocurrio un error",error: error.message
    });
  }
};

export const putLogin = async (req, res) => {
    try {
        const { id } = req.params;
    const {
      email,
      password,
      estado,
    } = req.body;

    const buscarEmail = await Login.findOne({
      email: email,
    });
    if (buscarEmail && buscarEmail._id.toString() !== id) {
      return res.status(404).json({
        msg: "Ya se encuentra un Usuario registrado con ese correo",
      });
    }

    let updatedData = {
      email: email,
      password: password,
    };

    const buscar = await Login.findByIdAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true }
    );
    res.status(201).json(buscar);

    } catch (error) {
       return res.status(500).json({ error: error.message }); 
    }
}

export const patchEstado = async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;
  try {
    const usuario = await Login.findById(id);
    if (usuario) {
      usuario.estado = estado;
      await usuario.save();
      res.json(usuario);
    } else {
      res.status(404).json({ msg: `usuario con id: ${id} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteLogin = async (req, res) => {
  const { id } = req.params;
  const Eliminado = await Login.findOneAndDelete({ _id: id });

  if (Eliminado) {
    return res.json({
      msg: `Se eliminó el Usuario: ${id} de la base de datos`,
    });
  } else {
    res
      .status(400)
      .json({ msg: `El Usuario: ${id} no se encuentra en la base de datos` });
  }
};