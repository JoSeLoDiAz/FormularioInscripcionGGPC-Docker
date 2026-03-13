import mongoose from "mongoose";

const tamanoempresaSchema = new mongoose.Schema(
  {
    codigo: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true, trim: true },
    createdat: { type: Date, default: Date.now },
  },
  { collection: "TamanoEmpresa" }
);

const TamanoEmpresa = mongoose.model("TamanoEmpresa", tamanoempresaSchema);
export default TamanoEmpresa;
