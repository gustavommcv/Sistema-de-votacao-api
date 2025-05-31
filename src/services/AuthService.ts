import UserResponseDTO from "../dto/UserResponseDTO";

export default interface AuthService {
  login(email: string, password: string): Promise<UserResponseDTO>;
  register(email: string, password: string): Promise<UserResponseDTO>;
}
