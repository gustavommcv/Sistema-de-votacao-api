import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { inject, injectable } from "inversify";
import generateToken from "../util/generateToken";
import AuthService from "../services/AuthService";
import CustomError from "../util/CustomError";
import { verifyToken } from "../util/auth";

@injectable()
export default class AuthController {
  constructor(@inject("AuthService") private authService: AuthService) { }

  async login(request: Request, response: Response) {
    const cookies = request.cookies;

    if (cookies.jwtToken) {
      response.status(400).json({ message: "Already logged in" });
      return;
    }

    const { email, password } = matchedData(request);

    try {
      const user = await this.authService.login(email, password);

      const token = generateToken(user);

      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000, // 1 hour
      });

      response.json({
        message: "Login was successful",
        loggedIn: user,
      });
      return;
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ message: error.message });
      } else {
        console.error("Internal Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  public async logout(request: Request, response: Response) {
    const cookies = request.cookies;

    if (!cookies.jwtToken) {
      response.status(400).json({ message: "There is no user logged in" });
      return;
    }

    response.clearCookie("jwtToken");

    response.json({ message: "Logout was successful" });
  }

  public async signup(request: Request, response: Response) {
    const cookies = request.cookies;

    if (cookies.jwtToken) {
      response.status(400).json({ message: "Cannot signup while logged in" });
      return;
    }

    const { email, password } = matchedData(request);

    try {
      const user = await this.authService.register(email, password);

      response.json({ message: "User has been created", user });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ message: error.message });
        return;
      } else {
        console.error("Internal Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

}
