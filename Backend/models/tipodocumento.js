import mongoose from "mongoose";

const tipodocumentoSchema = new mongoose.Schema(
    {
        codigo: { type: Number, required: true, unique: true },
        nombre: { type: String, required: true, trim: true },
        documentoempresa: { type: Number, required: true, enum: [0, 1], default: 0 }, // 0 persona, 1 empresa
        createdat: { type: Date, default: Date.now },
    },
    { collection: "TipoDocumento" }
);

const TipoDocumento = mongoose.model("TipoDocumento", tipodocumentoSchema);
export default TipoDocumento;
