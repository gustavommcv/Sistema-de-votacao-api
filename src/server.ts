import cookieParser from "cookie-parser";
import express, { json, Request, Response } from "express";
import indexRouter from "./routes/indexRouter";

const server = express();

server.use(json());
server.use(cookieParser());

server.get("/", (_: Request, response: Response) => {
  response.json({
    message: "Bem-vindo à API de Sistema de Votação da Signo Tech!",
    endpoint:
      "/api - Use este endpoint para ver todos os endpoints disponiveis",
  });
});

server.use("/api", indexRouter);

export default server;
