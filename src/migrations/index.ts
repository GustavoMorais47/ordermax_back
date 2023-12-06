import ConcessionariaModel from "../models/concessionaria";
import ModeloModel from "../models/modelo";
import PessoaModel from "../models/pessoa";
import ServicoModel from "../models/servico";
import UsuarioModel from "../models/usuario";

export default async function migrations() {
  ConcessionariaModel.find().then((data) => {
    if (data.length == 0) {
      ConcessionariaModel.create({
        nome: "Concessionária 1",
        cnpj: "12345678901234",
        telefone: "1234567890",
        email: null,
        endereco: {
          rua: "Rua 1",
          numero: "123",
          bairro: "Bairro 1",
          cidade: "Cidade 1",
          UF: "SP",
          cep: "12345678",
          coordenadas: {
            latitude: "1234567890",
            longitude: "1234567890",
          },
        },
        status: true,
      });
    }
  });

  ModeloModel.find().then((data) => {
    if (data.length == 0) {
      ModeloModel.create({
        descricao: "Modelo 1",
        imagem: null,
        cores: ["Branco", "Preto", "Azul"],
        status: true,
      });
    }
  });

  PessoaModel.find().then((data) => {
    if (data.length == 0) {
      PessoaModel.insertMany([
        {
          nome: "Cliente",
          cpf: "12345678901",
          telefone: "1234567890",
          email: null,
        },
        {
          nome: "Consultor Técnico",
          cpf: "12345678901",
          telefone: "1234567890",
          email: null,
        },
        {
          nome: "Mecânico",
          cpf: "12345678901",
          telefone: "1234567890",
          email: null,
        },
      ]);
    }
  });

  UsuarioModel.find().then((data) => {
    if (data.length == 0) {
      PessoaModel.find().then((pessoas) => {
        ConcessionariaModel.find().then((concessionarias) => {
          UsuarioModel.insertMany(
            pessoas.map((pessoa, i) => {
              return {
                id_concessionaria: concessionarias[0]._id,
                id_pessoa: pessoa._id,
                senha: "123456",
                role: i == 0 ? "cl" : i == 1 ? "ct" : "mc",
                status: true,
              };
            })
          );
        });
      });
    }
  });

  ServicoModel.find().then((data) => {
    if (data.length == 0) {
      ConcessionariaModel.find().then((concessionarias) => {
        ServicoModel.insertMany([
          {
            id_concessionaria: concessionarias[0]._id,
            descricao: "Serviço 1",
            status: true,
          },
          {
            id_concessionaria: concessionarias[0]._id,
            descricao: "Serviço 2",
            status: true,
          },
          {
            id_concessionaria: concessionarias[0]._id,
            descricao: "Serviço 3",
            status: true,
          },
          {
            id_concessionaria: concessionarias[0]._id,
            descricao: "Serviço 4",
            status: true,
          },
          {
            descricao: "Serviço 5",
            status: true,
          },
        ]);
      });
    }
  });
}
