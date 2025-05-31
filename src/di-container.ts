import { Container } from "inversify";
import AuthService from "./services/AuthService";
import AuthServiceImp from "./services/AuthServiceImp";
import AuthController from "./controllers/AuthController";
import UserService from "./services/UserService";
import UserServiceImp from "./services/UserServiceImp";
import UserController from "./controllers/UserController";
import UserRepository from "./repositories/UserRepository";
import UserRepositoryImp from "./repositories/UserRepositoryImp";
import PollController from "./controllers/PollController";
import PollRepository from "./repositories/PollRepository";
import PollRepositoryImp from "./repositories/PollRepositoryImp";
import PollServiceImp from "./services/PollServiceImp";
import PollService from "./services/PollService";
const container = new Container();

container.bind<PollService>("PollService").to(PollServiceImp);
container.bind<AuthService>("AuthService").to(AuthServiceImp);
container.bind<UserService>("UserService").to(UserServiceImp);

container.bind<UserRepository>("UserRepository").to(UserRepositoryImp);
container.bind<PollRepository>("PollRepository").to(PollRepositoryImp);

container.bind(AuthController).toSelf();
container.bind(UserController).toSelf();
container.bind(PollController).toSelf();

export default container;
