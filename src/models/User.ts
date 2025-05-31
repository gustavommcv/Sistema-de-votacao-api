import UserResponseDTO from "../dto/UserResponseDTO";

export interface IUser {
  id: number;
  email: string;
  password: string;
  created_at: Date | string;
  updated_at: Date | string;

  toUserResponse(): UserResponseDTO;
}

export default class User implements IUser {
  constructor(
    public id: number,
    public email: string,
    public password: string,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
  ) {}
  toUserResponse(): UserResponseDTO {
    return new UserResponseDTO(
      this.id,
      this.email,
      this.created_at,
      this.updated_at,
    );
  }
}
