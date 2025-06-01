import cookieParser from "cookie-parser";
import express, { json, Request, Response } from "express";
import indexRouter from "./routes/indexRouter";
import cors from "cors";

const server = express();

server.use(json());
server.use(cookieParser());

server.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

server.get("/", (_: Request, response: Response) => {
  response.json({
    message: "Bem-vindo à API de Sistema de Votação da Signo Tech!",
    endpoint:
      "/api - Use este endpoint para ver todos os endpoints disponiveis",
  });
});

server.use("/api", indexRouter);

export default server;
