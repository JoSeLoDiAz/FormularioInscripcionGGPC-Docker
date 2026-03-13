import mongoose from "mongoose";

const ciudadSchema = new mongoose.Schema(
    {
        codigo: { type: Number, required: true, unique: true },
        nombre: { type: String, required: true, trim: true, lowercase: true },
        departamento: { type: mongoose.Schema.Types.ObjectId, ref: "Departamento", required: true },
        createdat: { type: Date, default: Date.now }
    },
    { collection: "Ciudad" }
);

export default mongoose.model("Ciudad", ciudadSchema);
