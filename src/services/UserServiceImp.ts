import { inject } from "inversify";
import UserService from "./UserService";
import UserRepository from "../repositories/UserRepository";
import User from "../models/User";
import UserResponseDTO from "../dto/UserResponseDTO";
import UserRequestDTO from "../dto/UserRequestDTO";
import CustomError from "../util/CustomError";

export default class UserServiceImp implements UserService {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
  ) { }

  async updateUser(
    id: number,
    updates: Partial<UserRequestDTO>,
  ): Promise<UserResponseDTO> {
    try {
      if (updates.email) {
        const emailAvailable = await this.userRepository.ensureEmailIsAvailable(
          updates.email,
        );
        if (!emailAvailable) {
          throw new CustomError("Email already in use", 400);
        }
      }

      const updatedUser = await this.userRepository.updateByPK(id, updates);

      return new User(
        updatedUser.id,
        updatedUser.email,
        updatedUser.password,
        new Date(updatedUser.created_at),
        new Date(updatedUser.updated_at),
      ).toUserResponse();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update user", 500);
    }
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteByPK(id);
  }

  async findAllUsers(): Promise<UserResponseDTO[]> {
    const data = await this.userRepository.findAll();

    const users = data.map((user) =>
      new User(
        user.id,
        user.email,
        user.password,
        user.created_at ? new Date(user.created_at) : new Date(),
        user.updated_at ? new Date(user.updated_at) : new Date(),
      ).toUserResponse(),
    );

    return users;
  }

  async findUserById(id: number): Promise<UserResponseDTO> {
    const data = await this.userRepository.findByPK(id);

    const foundUser = new User(
      data.id,
      data.email,
      data.password,
      data.created_at ? new Date(data.created_at) : new Date(),
      data.updated_at ? new Date(data.updated_at) : new Date(),
    ).toUserResponse();

    return foundUser;
  }

  async findUsersByName(name: string): Promise<UserResponseDTO[]> {
    const data = await this.userRepository.findByName(name);

    return data.map((user) =>
      new User(
        user.id,
        user.email,
        user.password,
        user.created_at ? new Date(user.created_at) : new Date(),
        user.updated_at ? new Date(user.updated_at) : new Date(),
      ).toUserResponse(),
    );
  }
}
