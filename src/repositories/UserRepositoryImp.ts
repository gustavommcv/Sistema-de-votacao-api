import { query } from "../database/database";
import { IUser } from "../models/User";
import UserRepository from "./UserRepository";
import CustomError from "../util/CustomError";
import UserRequestDTO from "../dto/UserRequestDTO";

export default class UserRepositoryImp implements UserRepository {
  tableName: string;

  constructor() {
    this.tableName = "users";
  }

  async updateByPK(
    pk: number,
    updates: Partial<UserRequestDTO>,
  ): Promise<IUser> {
    try {
      await this.ensureUserExists(pk);

      const fieldsToUpdate = [];
      const values = [];

      if (updates.email) {
        fieldsToUpdate.push("email = ?");
        values.push(updates.email);
      }

      if (updates.password) {
        fieldsToUpdate.push("password = ?");
        values.push(updates.password);
      }

      if (fieldsToUpdate.length === 0) {
        throw new CustomError("No valid fields to update", 400);
      }

      fieldsToUpdate.push("updated_at = CURRENT_TIMESTAMP");

      values.push(pk);

      const queryString = `
      UPDATE ${this.tableName} 
      SET ${fieldsToUpdate.join(", ")} 
      WHERE id = ?
    `;

      await query(queryString, values);

      return await this.findByPK(pk);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while updating user", 500);
    }
  }

  async deleteByPK(pk: number): Promise<void> {
    try {
      await this.ensureUserExists(pk);

      const result = await query(`DELETE FROM ${this.tableName} WHERE id = ?`, [
        pk,
      ]);

      if (result.affectedRows === 0) {
        throw new CustomError("No user deleted", 500);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while deleting user", 500);
    }
  }

  async ensureEmailIsAvailable(email: string): Promise<boolean> {
    try {
      await this.findByEmail(email);
      return false;
    } catch (error) {
      return true;
    }
  }

  async ensureUserExists(pk: number): Promise<void> {
    const results = await query(
      `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`,
      [pk],
    );

    if (!results[0]) {
      throw new CustomError("User not found", 404);
    }
  }

  async create(user: UserRequestDTO): Promise<IUser> {
    await query(
      `INSERT INTO ${this.tableName} (email, password)
       VALUES (?, ?)`,
      [user.email, user.password],
    );

    const createdUser = await this.findByEmail(user.email);

    return createdUser;
  }

  async findByEmail(email: string): Promise<IUser> {
    const results = await query(
      `SELECT * FROM ${this.tableName}
        WHERE email = ?`,
      [email],
    );

    if (!results[0]) {
      throw new CustomError("User not registered", 404);
    }

    return results[0] as IUser;
  }

  async findAll(): Promise<IUser[]> {
    const results = await query(`SELECT * FROM ${this.tableName}`);

    return results;
  }

  async findByPK(pk: number): Promise<IUser> {
    const results = await query(
      `SELECT * FROM ${this.tableName}
        WHERE id = ?`,
      [pk],
    );

    if (!results[0]) {
      throw new CustomError("User not found", 404);
    }

    return results[0] as IUser;
  }

  async findByName(name: string): Promise<IUser[]> {
    const results = await query(
      `SELECT * FROM ${this.tableName}
     WHERE name LIKE ?`,
      [`%${name}%`],
    );

    if (results.length === 0) {
      throw new CustomError("No users found with that name", 404);
    }

    return results as IUser[];
  }
}
