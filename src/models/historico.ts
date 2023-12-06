import { Schema } from "mongoose";
import { IHistorico } from "../types";
import database from "../data";

const schema = new Schema<IHistorico>({
  id_ordem: {
    type: Schema.Types.ObjectId,
    ref: "Ordem",
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
});

const HistoricoModel = database.model("Historico", schema);

export default HistoricoModel;
