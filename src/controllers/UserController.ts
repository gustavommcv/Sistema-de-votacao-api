import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import UserService from "../services/UserService";
import CustomError from "../util/CustomError";
import { verifyToken } from "../util/auth";
import UserRequestDTO from "../dto/UserRequestDTO";

@injectable()
export default class UserController {
  constructor(@inject("UserService") private userService: UserService) {}

  private getUserLinks(userId: number) {
    return {
      self: { method: "GET", href: `/users/${userId}` },
      update: { method: "PUT", href: `/users/` },
      delete: { method: "DELETE", href: `/users/` },
    };
  }

  getUserCount = async (_: Request, response: Response) => {
    try {
      const count = (await this.userService.findAllUsers()).length;

      response.status(200).json({
        data: { count },
        links: {
          self: { method: "GET", href: "/users/count" },
          list: { method: "GET", href: "/users" },
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ error: error.message });
      } else {
        console.error("Internal Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  getUserById = async (request: Request, response: Response) => {
    try {
      const { id } = matchedData(request);

      const user = await this.userService.findUserById(id);

      response.status(200).json({
        data: user,
        links: this.getUserLinks(user.id),
      });
    } catch (error) {
      if (error instanceof Error)
        if (error instanceof CustomError) {
          response.status(error.status).json({ message: error.message });
        } else {
          console.error("Internal Error:", error);
          response.status(500).json({ error: "Internal Server Error" });
        }
    }
  };

  getUsers = async (_: Request, response: Response) => {
    try {
      const users = await this.userService.findAllUsers();

      const usersWithLinks = users.map((user) => ({
        ...user,
        links: this.getUserLinks(user.id),
      }));

      response.status(200).json({
        data: usersWithLinks,
        links: {
          self: { method: "GET", href: "/users" },
          create: { method: "POST", href: "/users" },
        },
      });
    } catch (error) {
      console.error("Internal Error:", error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteUser = async (request: Request, response: Response) => {
    try {
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Token not found", 401);
      }

      const { id } = verifyToken(token);

      await this.userService.deleteUser(id);

      response.clearCookie("jwtToken");
      response.status(200).json({
        message: "User deletion successful",
      });
    } catch (error) {
      if (error instanceof Error)
        if (error instanceof CustomError) {
          response.status(error.status).json({ message: error.message });
        } else {
          console.error("Internal Error:", error);
          response.status(500).json({ error: "Internal Server Error" });
        }
    }
  };

  editUser = async (request: Request, response: Response) => {
    try {
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Token not found", 401);
      }

      const { id } = verifyToken(token);
      const userData = matchedData(request);

      const updatedUser = await this.userService.updateUser(
        id,
        userData as UserRequestDTO,
      );

      response.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
        links: this.getUserLinks(id),
      });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ message: error.message });
      } else {
        console.error("Internal Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  searchUsersByName = async (request: Request, response: Response) => {
    try {
      const { name } = matchedData(request);
      const users = await this.userService.findUsersByName(name);

      const usersWithLinks = users.map((user) => ({
        ...user,
        links: this.getUserLinks(user.id),
      }));

      response.status(200).json({
        data: usersWithLinks,
        links: {
          self: { method: "GET", href: `/users/name/${name}` },
          all: { method: "GET", href: "/users" },
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ message: error.message });
      } else {
        console.error("Search users error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
