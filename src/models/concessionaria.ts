import { Schema } from "mongoose";
import { IConcessionaria } from "../types";
import database from "../data";

const schema = new Schema<IConcessionaria>({
  nome: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  endereco: {
    rua: {
      type: String,
      required: true,
    },
    numero: {
      type: String,
      required: true,
    },
    bairro: {
      type: String,
      required: true,
    },
    cidade: {
      type: String,
      required: true,
    },
    UF: {
      type: String,
      required: true,
      enum: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
    },
    cep: {
      type: String,
      required: true,
    },
    coordenadas: {
      latitude: {
        type: String,
        required: false,
      },
      longitude: {
        type: String,
        required: false,
      },
    },
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const ConcessionariaModel = database.model("Concessionaria", schema);

export default ConcessionariaModel;
