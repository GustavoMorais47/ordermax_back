import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose, { Model, Schema } from "mongoose";
import router from "./routes/index.routes";
import migrations from "./migrations";
import OrdemModel from "./models/ordem";
import ConcessionariaModel from "./models/concessionaria";
import ModeloModel from "./models/modelo";
import PessoaModel from "./models/pessoa";
import UsuarioModel from "./models/usuario";
import ServicoModel from "./models/servico";
import { IConcessionaria, IModelo, IOrdem, IPessoa, IServico } from "./types";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/", router);

async function main() {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bmzdp5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      migrations();

      io.on("connection", (socket) => {
        socket.on("ordens", async (role) => {
          if (role === undefined) return socket.disconnect();

          if (role === "ct") {
            const ordens = await OrdemModel.find();
            const concessionarias = await ConcessionariaModel.find();
            const modelos = await ModeloModel.find();
            const usuarios = await UsuarioModel.find();
            const pessoas = await PessoaModel.find();
            const servicos = await ServicoModel.find();

            const ordens_completas = ordens.map((ordem) => {
              const concessionaria = concessionarias.find(
                (concessionaria) =>
                  concessionaria._id.toString() ===
                  ordem.id_concessionaria.toString()
              );
              const modelo = modelos.find(
                (modelo) => modelo._id.toString() === ordem.id_modelo.toString()
              );
              const cliente = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === ordem.id_cliente.toString()
              );
              const usuarioSol = usuarios.find(
                (user) =>
                  user._id.toString() === ordem.id_solicitante.toString()
              );
              const usuarioRes = usuarios.find(
                (user) =>
                  user._id.toString() === ordem.id_responsavel?.toString()
              );
              const solicitante = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === usuarioSol?.id_pessoa.toString()
              );
              const responsavel = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === usuarioRes?.id_pessoa.toString()
              );
              const servicos_solicitados = servicos.filter((servico) =>
                ordem.servicos_solicitados.includes(servico._id)
              );
              const servicos_realizados = servicos.filter((servico) =>
                ordem.servicos_realizados.includes(servico._id)
              );

              return {
                _id: ordem._id,
                concessionaria,
                modelo,
                cliente,
                solicitante: solicitante ? solicitante : null,
                responsavel: responsavel ? responsavel : null,
                placa: ordem.placa,
                ano: ordem.ano,
                cor: ordem.cor,
                ano_fabricacao: ordem.ano_fabricacao,
                servicos_solicitados,
                servicos_realizados,
                status: ordem.status,
              };
            });
            socket.emit("ordens", ordens_completas);
          }

          if (role === "mc") {
            const ordens = await OrdemModel.find({
              status: { $nin: ["Finalizado", "Cancelado"] },
            });
            const concessionarias = await ConcessionariaModel.find();
            const modelos = await ModeloModel.find();
            const usuarios = await UsuarioModel.find();
            const pessoas = await PessoaModel.find();
            const servicos = await ServicoModel.find();

            const ordens_completas = ordens.map((ordem) => {
              const concessionaria = concessionarias.find(
                (concessionaria) =>
                  concessionaria._id.toString() ===
                  ordem.id_concessionaria.toString()
              );
              const modelo = modelos.find(
                (modelo) => modelo._id.toString() === ordem.id_modelo.toString()
              );
              const cliente = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === ordem.id_cliente.toString()
              );
              const usuarioSol = usuarios.find(
                (user) =>
                  user._id.toString() === ordem.id_solicitante.toString()
              );
              const usuarioRes = usuarios.find(
                (user) =>
                  user._id.toString() === ordem.id_responsavel?.toString()
              );
              const solicitante = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === usuarioSol?.id_pessoa.toString()
              );
              const responsavel = pessoas.find(
                (pessoa) =>
                  pessoa._id.toString() === usuarioRes?.id_pessoa.toString()
              );
              const servicos_solicitados = servicos.filter((servico) =>
                ordem.servicos_solicitados.includes(servico._id)
              );
              const servicos_realizados = servicos.filter((servico) =>
                ordem.servicos_realizados.includes(servico._id)
              );

              return {
                _id: ordem._id,
                concessionaria,
                modelo,
                cliente,
                solicitante: solicitante ? solicitante : null,
                responsavel: responsavel ? responsavel : null,
                placa: ordem.placa,
                ano: ordem.ano,
                cor: ordem.cor,
                ano_fabricacao: ordem.ano_fabricacao,
                servicos_solicitados,
                servicos_realizados,
                status: ordem.status,
              };
            });
            socket.emit("ordens", ordens_completas);
          }
        });

        //ts-ignore
        OrdemModel.watch().on("change", async (data: any) => {
          const documento = await OrdemModel.findById(data.documentKey._id);
          const concessionaria = await ConcessionariaModel.findById(
            documento?.id_concessionaria
          );
          const modelo = await ModeloModel.findById(documento?.id_modelo);
          const cliente = await PessoaModel.findById(documento?.id_cliente);
          const usuarioSol = await UsuarioModel.findById(
            documento?.id_solicitante
          );
          const usuarioRes = await UsuarioModel.findById(
            documento?.id_responsavel
          );
          const solicitante = await PessoaModel.findById(usuarioSol?.id_pessoa);
          const responsavel = await PessoaModel.findById(usuarioRes?.id_pessoa);
          const servicos_solicitados = await ServicoModel.find({
            _id: { $in: documento?.servicos_solicitados },
          });
          const servicos_realizados = await ServicoModel.find({
            _id: { $in: documento?.servicos_realizados },
          });
          const ordem_completa: {
            _id: string;
            concessionaria: IConcessionaria;
            modelo: IModelo;
            cliente: IPessoa;
            solicitante: IPessoa;
            responsavel: IPessoa | null;
            placa: string;
            ano: string;
            cor: string;
            ano_fabricacao: string;
            servicos_solicitados: IServico[];
            servicos_realizados: IServico[];
            status: "Aguardando" | "Em andamento" | "Finalizado" | "Cancelado";
          } = {
            _id: documento!._id.toString(),
            concessionaria: concessionaria!,
            modelo: modelo!,
            cliente: cliente!,
            solicitante: solicitante!,
            responsavel: responsavel ? responsavel : null,
            placa: documento!.placa,
            ano: documento!.ano,
            cor: documento!.cor,
            ano_fabricacao: documento!.ano_fabricacao,
            servicos_solicitados,
            servicos_realizados,
            status: documento!.status,
          };

          if (data.operationType === "insert") {
            return socket.emit("ordens_create", ordem_completa);
          }

          if (data.operationType === "update") {
            return socket.emit("ordens_update", ordem_completa);
          }
        });

        socket.on("disconnect", () => {
          console.log("Usuário desconectado: " + socket.id);
        });
      });

      server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}!`);
      });
    })
    .catch((err) => {
      console.log("Não foi possível conectar a base de dados: " + err);
      process.exit();
    });
}

main();
