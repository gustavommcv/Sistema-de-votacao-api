import { Request, Response, Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";

const indexRouter = Router();

indexRouter.get("/", (_: Request, response: Response) => {
  response.json({
    message: "Bem-vindo à API de Sistema de Votação da Signo Tech!",
    endpoints: {
      auth: {
        login: {
          method: "POST",
          path: "/auth/login",
          description: "Autentica um usuário existente",
          body: {
            email: "string (obrigatório, formato email)",
            password: "string (obrigatório, 3-100 caracteres)",
          },
        },
        logout: {
          method: "GET",
          path: "/auth/logout",
          description: "Encerra a sessão do usuário",
        },
        signup: {
          method: "POST",
          path: "/auth/signup",
          description: "Cria um novo usuário",
          body: {
            email: "string (obrigatório, formato email)",
            password: "string (obrigatório, 3-100 caracteres)",
          },
        },
      },
      users: {
        getAll: {
          method: "GET",
          path: "/users",
          description: "Lista todos os usuários",
        },
        getById: {
          method: "GET",
          path: "/users/:id",
          description: "Obtém um usuário específico pelo ID",
          params: {
            id: "string (obrigatório)",
          },
        },
        update: {
          method: "PUT",
          path: "/users",
          description: "Atualiza informações do usuário",
          body: {
            email: "string (opcional, formato email)",
            password: "string (opcional)",
          },
        },
        delete: {
          method: "DELETE",
          path: "/users",
          description: "Remove um usuário",
        },
      },
    },
    version: "1.0.0",
  });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);

export default indexRouter;
