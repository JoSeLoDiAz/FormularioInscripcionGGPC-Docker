import mongoose from "mongoose";

const departamentoSchema = new mongoose.Schema(
    {
        codigo: { type: Number, required: true, unique: true },
        nombre: { type: String, required: true, trim: true, lowercase: true },
        createdat: { type: Date, default: Date.now }
    },
    { collection: "Departamento" }
);

export default mongoose.model("Departamento", departamentoSchema);
