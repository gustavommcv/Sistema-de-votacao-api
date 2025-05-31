import jwt from "jsonwebtoken";
import UserResponseDTO from "../dto/UserResponseDTO";

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as UserResponseDTO;
};
