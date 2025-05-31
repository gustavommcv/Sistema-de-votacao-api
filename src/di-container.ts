import { Container } from "inversify";
import AuthService from "./services/AuthService";
import AuthServiceImp from "./services/AuthServiceImp";
import AuthController from "./controllers/AuthController";
import UserService from "./services/UserService";
import UserServiceImp from "./services/UserServiceImp";
import UserController from "./controllers/UserController";
import UserRepository from "./repositories/UserRepository";
import UserRepositoryImp from "./repositories/UserRepositoryImp";
const container = new Container();

container.bind<AuthService>("AuthService").to(AuthServiceImp);
container.bind<UserService>("UserService").to(UserServiceImp);

container.bind<UserRepository>("UserRepository").to(UserRepositoryImp);

container.bind(AuthController).toSelf();
container.bind(UserController).toSelf();

export default container;
