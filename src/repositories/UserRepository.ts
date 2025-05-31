import { IUser } from "../models/User";
import UserRequestDTO from "../dto/UserRequestDTO";

export default interface UserRepository {
  findByPK(pk: number): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  findByEmail(email: string): Promise<IUser>;
  create(user: UserRequestDTO): Promise<IUser>;
  ensureEmailIsAvailable(email: string): Promise<boolean>;
  deleteByPK(pk: number): Promise<void>;
  ensureUserExists(pk: number): Promise<void>;
  updateByPK(pk: number, updates: Partial<UserRequestDTO>): Promise<IUser>;
  findByName(name: string): Promise<IUser[]>;
}
