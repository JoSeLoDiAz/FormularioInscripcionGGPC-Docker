import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema(
    {
        tipoidentificacion:{type:mongoose.Schema.Types.ObjectId,ref:'TipoDocumento',required:true},
        numeroidentificacion: { type:String, required:true },
        dv: { type:String, required:true },
        empresa: { type:String, required:true },
        tamanoempresa: { type:mongoose.Schema.Types.ObjectId,ref:'TamanoEmpresa', required:true },
        createdat : {type: Date, default: Date.now}
    },
    {collection: 'Empresa',}
)

const Empresa = mongoose.model('Empresa',empresaSchema);
export default Empresa;
