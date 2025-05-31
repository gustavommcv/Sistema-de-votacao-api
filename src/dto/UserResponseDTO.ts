export default class UserResponseDTO {
  constructor(
    public id: number,
    public email: string,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
  ) {}
}
