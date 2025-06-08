# Sistema de Votação - Backend

Backend do sistema de votação desenvolvido em Node.js com TypeScript.

[Link Frontend](https://github.com/gustavommcv/sistema-de-votacao-client)

## Tecnologias Utilizadas

- Node.js
- Express.js
- TypeScript
- MySQL (MariaDB)
- Docker (para banco de dados)
- JWT para autenticação
- WebSockets (para atualizações em tempo real)

 ## Funcionalidades

- CRUD completo de enquetes
- Cadastro dinâmico de opções de resposta (mínimo de 3)
- Datas programadas de início e término da enquete
- Visualização das enquetes com status: Não iniciada / Em andamento / Finalizada
- Sistema de votação apenas durante o período ativo
- Resultados atualizados em tempo real via WebSocket
- Autenticação simples de usuários com JWT

## Rotas da API

### Autenticação
| Método | Endpoint       | Descrição                         | Parâmetros/Campos do Body                                                                 |
|--------|----------------|-----------------------------------|-------------------------------------------------------------------------------------------|
| POST   | `/api/auth/login` | Autentica um usuário existente    | `{ email: string (obrigatório, formato email), password: string (obrigatório, 3-100 caracteres) }` |
| GET    | `/api/auth/logout` | Encerra a sessão do usuário       | -                                                                                         |
| POST   | `/api/auth/signup` | Cria um novo usuário              | `{ email: string (obrigatório, formato email), password: string (obrigatório, 3-100 caracteres) }` |

### Usuários
| Método | Endpoint          | Descrição                                | Parâmetros/Campos do Body                                       |
|--------|-------------------|------------------------------------------|-----------------------------------------------------------------|
| GET    | `/api/users`        | Lista todos os usuários                  | -                                                               |
| GET    | `/api/users/:id`    | Obtém um usuário específico pelo ID      | `params: { id: string (obrigatório) }`                          |
| PUT    | `/api/users`        | Atualiza informações do usuário          | `{ email?: string (opcional, formato email), password?: string (opcional) }` |
| DELETE | `/api/users`        | Remove um usuário                        | -                                                               |

### Enquetes
| Método | Endpoint                  | Descrição                                  | Parâmetros/Campos do Body                                                                 |
|--------|---------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------|
| GET    | `/api/polls`              | Lista todas as enquetes                    | -                                                                                         |
| GET    | `/api/polls/:id`          | Obtém uma enquete específica pelo ID       | `params: { id: string }`                                                                  |
| POST   | `/api/polls`              | Cria uma nova enquete                      | `{ title: string (obrigatório), start_date: string (ISO 8601), end_date: string (ISO 8601), options: string[] (mínimo 3) }` |
| POST   | `/api/polls/:id/vote`     | Vota em uma opção da enquete               | `params: { id: number }`, `body: { option_id: number }`                                   |
| PATCH  | `/api/polls/:id/title`    | Atualiza o título da enquete               | `params: { id: string }`, `body: { title: string }`                                       |
| DELETE | `/api/polls/:id`          | Remove uma enquete                         | `params: { id: string }`                                                                  |

## Estrutura:
```
tree -I node_modules
├── mariadb
│   ├── Dockerfile
│   └── init.sql
├── package.json
├── package-lock.json
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── AuthController.ts
│   │   ├── PollController.ts
│   │   └── UserController.ts
│   ├── database
│   │   └── database.ts
│   ├── di-container.ts
│   ├── dto
│   │   ├── UserRequestDTO.ts
│   │   └── UserResponseDTO.ts
│   ├── middlewares
│   │   └── validationErrors.ts
│   ├── models
│   │   ├── Poll.ts
│   │   └── User.ts
│   ├── repositories
│   │   ├── PollRepositoryImp.ts
│   │   ├── PollRepository.ts
│   │   ├── UserRepositoryImp.ts
│   │   └── UserRepository.ts
│   ├── routes
│   │   ├── authRouter.ts
│   │   ├── indexRouter.ts
│   │   ├── pollRouter.ts
│   │   └── userRouter.ts
│   ├── server.ts
│   ├── services
│   │   ├── AuthServiceImp.ts
│   │   ├── AuthService.ts
│   │   ├── PollServiceImp.ts
│   │   ├── PollService.ts
│   │   ├── UserServiceImp.ts
│   │   └── UserService.ts
│   └── util
│       ├── auth.ts
│       ├── CustomError.ts
│       ├── generateToken.ts
│       └── hashPassword.ts
└── tsconfig.json
```

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/gustavommcv/sistema-de-votacao-api/
cd https://github.com/gustavommcv/sistema-de-votacao-api/
```

### 2. Instalar as dependências

```bash
npm i
```
### 3. Construir e rodar o container do banco de dados

```bash
cd mariadb
docker build -t votacao-db .
```

```bash
docker run -d \
  --name voting-db \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=example \
  voting-db
```

### 4. Configurar variáveis de ambiente
Crie um .env na pasta raiz com os valores do .env.example

### 5. Rodar a aplicação
```bash
npm run dev
```

