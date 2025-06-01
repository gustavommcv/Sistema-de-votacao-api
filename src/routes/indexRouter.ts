import { Request, Response, Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import pollRouter from "./pollRouter";

const indexRouter = Router();

indexRouter.get("/", (_: Request, res: Response) => {
  res.json({
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
      polls: {
        getAll: {
          method: "GET",
          path: "/polls",
          description: "Lista todas as enquetes",
        },
        getById: {
          method: "GET",
          path: "/polls/:id",
          description: "Obtém uma enquete específica pelo ID",
        },
        create: {
          method: "POST",
          path: "/polls",
          description: "Cria uma nova enquete",
          body: {
            title: "string (obrigatório)",
            start_date: "string (data ISO 8601, obrigatória)",
            end_date: "string (data ISO 8601, obrigatória)",
            options: "array de strings (mínimo 3 opções, obrigatórias)",
          },
        },
        vote: {
          method: "POST",
          path: "/polls/:id/vote",
          description: "Vota em uma opção da enquete",
          params: {
            id: "number (ID da enquete)",
          },
          body: {
            option_id: "number (ID da opção)",
          },
        },
        updateTitle: {
          method: "PATCH",
          path: "/polls/:id/title",
          description: "Atualiza o título da enquete",
          body: {
            title: "string (novo título)",
          },
        },
        delete: {
          method: "DELETE",
          path: "/polls/:id",
          description: "Remove uma enquete",
        },
      },
    },
    version: "1.0.0",
  });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/polls", pollRouter);

export default indexRouter;
