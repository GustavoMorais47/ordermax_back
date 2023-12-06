import { Schema } from "mongoose";
import { IServico } from "../types";
import database from "../data";

const schema = new Schema<IServico>({
  id_concessionaria: {
    type: Schema.Types.ObjectId,
    ref: "Concessionaria",
    required: false,
  },
  descricao: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const ServicoModel = database.model("Servico", schema);

export default ServicoModel;
