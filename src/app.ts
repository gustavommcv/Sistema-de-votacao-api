import "reflect-metadata";
import "dotenv/config";
import { httpServer } from "./server";

const port = process.env.API_PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} com WebSocket`);
  console.log(`Acesse: http://localhost:${port}`);
});
