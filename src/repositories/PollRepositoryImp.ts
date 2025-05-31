import { query } from "../database/database";
import { IPoll } from "../models/Poll";
import PollRepository from "./PollRepository";
import CustomError from "../util/CustomError";

export default class PollRepositoryImp implements PollRepository {
  tableName: string = "polls";

  async findAll(): Promise<IPoll[]> {
    try {
      const results = await query(`
        SELECT p.*, u.email as user_email 
        FROM ${this.tableName} p
        JOIN users u ON p.user_id = u.id
      `);
      return results as IPoll[];
    } catch (error) {
      throw new CustomError("Error while fetching polls", 500);
    }
  }
}
