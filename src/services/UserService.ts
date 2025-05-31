import UserResponseDTO from "../dto/UserResponseDTO";
import UserRequestDTO from "../dto/UserRequestDTO";

export default interface UserService {
  findUserById(id: number): Promise<UserResponseDTO>;
  findAllUsers(): Promise<UserResponseDTO[]>;
  updateUser(id: number, user: UserRequestDTO): Promise<UserResponseDTO>;
  deleteUser(id: number): Promise<void>;
  findUsersByName(name: string): Promise<UserResponseDTO[]>;
}
