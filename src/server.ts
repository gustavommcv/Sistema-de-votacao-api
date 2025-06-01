import cookieParser from "cookie-parser";
import express, { json, Request, Response } from "express";
import indexRouter from "./routes/indexRouter";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (_: Request, response: Response) => {
  response.json({
    message: "Bem-vindo à API de Sistema de Votação da Signo Tech!",
    endpoint:
      "/api - Use este endpoint para ver todos os endpoints disponiveis",
  });
});

app.use("/api", indexRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  socket.on("joinPollRoom", (pollId: string) => {
    socket.join(`poll_${pollId}`);
    console.log(`Cliente ${socket.id} entrou na sala poll_${pollId}`);
  });

  socket.on("leavePollRoom", (pollId: string) => {
    socket.leave(`poll_${pollId}`);
    console.log(`Cliente ${socket.id} saiu da sala poll_${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

export { app, io, httpServer };
