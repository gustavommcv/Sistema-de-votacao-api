import { inject, injectable } from "inversify";
import User from "../models/User";
import AuthService from "./AuthService";
import UserRepository from "../repositories/UserRepository";
import CustomError from "../util/CustomError";
import bcrypt from "bcrypt";
import hashPassword from "../util/hashPassword";
import UserRequestDTO from "../dto/UserRequestDTO";
import UserResponseDTO from "../dto/UserResponseDTO";

@injectable()
export default class AuthServiceImp implements AuthService {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  async login(email: string, password: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError("Password does not match", 401);
    }

    return new User(
      user.id,
      user.email,
      user.password,
      user.created_at ? new Date(user.created_at) : new Date(),
      user.updated_at ? new Date(user.updated_at) : new Date()
    ).toUserResponse();
  }

  async register(email: string, password: string): Promise<UserResponseDTO> {
    const isEmailAvailable = await this.userRepository.ensureEmailIsAvailable(email);

    if (!isEmailAvailable) {
      throw new CustomError("Email already registered", 409)
    }

    const hashedPassword = await hashPassword(password);

    const userRequest = new UserRequestDTO(email, hashedPassword);

    const createdUser = await this.userRepository.create(userRequest);

    return new User(
      createdUser.id,
      createdUser.email,
      createdUser.password,
      createdUser.created_at ? new Date(createdUser.created_at) : new Date(),
      createdUser.updated_at ? new Date(createdUser.updated_at) : new Date()
    ).toUserResponse();
  }
}
