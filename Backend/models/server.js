import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import ciudad from "../routers/ciudad.js";
import datosbasicos from "../routers/datosbasicos.js";
import departamento from "../routers/departamento.js";
import empresa from "../routers/empresa.js";
import login from "../routers/login.js";
import tamanoempresa from "../routers/tamanoempresa.js";
import tipodocumento from "../routers/tipodocumento.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
    constructor() {
        this.app = express();
        this.conectarDB();
        this.middlewares();
        this.routes();
        this.frontend();
    }

    conectarDB() {
        mongoose
            .connect(process.env.bdMongo)
            .then(() => console.log("conectado a la base de datos"))
            .catch(console.error);
    }

    middlewares() {
        this.app.use(express.json({ limit: "5mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "5mb" }));
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, "..", "public")));
    }

    routes() {
        this.app.get("/health", (req, res) => {
            res.status(200).json({
                status: "ok",
                uptime: process.uptime(),
                timestamp: Date.now()
            });
        });
        this.app.use("/datosbasicos", datosbasicos);
        this.app.use("/departamento", departamento);
        this.app.use("/ciudad", ciudad);
        this.app.use("/tipodocumento", tipodocumento);
        this.app.use("/empresa", empresa);
        this.app.use("/tamanoempresa", tamanoempresa);
        this.app.use("/login", login);
    }

    frontend() {
        this.app.use((req, res) => {
            res.sendFile(
                path.join(__dirname, '..', 'public', 'index.html')
            );
        });
    }

    escuchar() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
        });
    }
}

export default Server;
