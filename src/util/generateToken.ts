import jwt from "jsonwebtoken";
import UserResponseDTO from "../dto/UserResponseDTO";

export default function generateToken(user: UserResponseDTO): string {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secretKey) {
    throw new Error("JWT_SECRET not defined");
  }

  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN not defined");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const options: jwt.SignOptions = {
    expiresIn: Number(expiresIn),
  };

  return jwt.sign(payload, secretKey, options);
}
