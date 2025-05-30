import cookieParser from "cookie-parser";
import express, { json, Request, Response } from "express";

const server = express();

server.use(json());
server.use(cookieParser());

server.get("/", (_: Request, response: Response) => {
  response.json({
    message: "Bem vindo ao sistema de votacoes da Signo Tech!",
    endpoint:
      "/api - Use este endpoint para ver todos os endpoints disponiveis",
  });
});

export default server;
