import { Schema } from "mongoose";
import { IUsuario } from "../types";
import database from "../data";

const schema = new Schema<IUsuario>({
  id_concessionaria: {
    type: Schema.Types.ObjectId,
    ref: "Concessionaria",
    required: true,
  },
  id_pessoa: {
    type: Schema.Types.ObjectId,
    ref: "Pessoa",
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["cl", "ct", "mc"],
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const UsuarioModel = database.model("Usuario", schema);

export default UsuarioModel;
