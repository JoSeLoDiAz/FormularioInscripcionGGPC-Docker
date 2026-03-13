import mongoose from 'mongoose';



const datosbasicosSchema = new mongoose.Schema(
    {
        tipodocumento:{type:mongoose.Schema.Types.ObjectId,ref:'TipoDocumento',required:true},
        numeroidentificacion: { type:String, required:true },
        nombres: { type:String, required:true },
        primerapellido: { type: String, required: true },
        segundoapellido: { type: String, default: "" },
        empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true },
        celular: { type:String, required:true },
        correo: { type:String, required:true },
        departamento:{type:mongoose.Schema.Types.ObjectId,ref:'Departamento',required:true},
        ciudad:{type:mongoose.Schema.Types.ObjectId,ref:'Ciudad',required:true},
        modalidad: { type:Number, required:true},
        createdat : {type: Date, default: Date.now}
    },
    {collection: 'DatosBasicos',}
)

const DatosBasicos = mongoose.model('DatosBasicos',datosbasicosSchema);
export default DatosBasicos;
