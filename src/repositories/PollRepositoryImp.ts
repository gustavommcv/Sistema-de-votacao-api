import { query } from "../database/database";
import { IPoll, IPollWithOptions } from "../models/Poll";
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

  async findById(id: number): Promise<IPollWithOptions> {
    try {
      const pollResults = await query(
        `
      SELECT p.*, u.email as user_email
      FROM ${this.tableName} p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `,
        [id],
      );

      if (pollResults.length === 0) {
        throw new CustomError("Poll not found", 404);
      }

      const poll = pollResults[0] as IPoll;

      const optionsResults = await query(
        `
      SELECT o.id, o.text, COUNT(v.id) as votes_count
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE o.poll_id = ?
      GROUP BY o.id
    `,
        [id],
      );

      const options = optionsResults.map(
        (option: { id: any; text: any; votes_count: any }) => ({
          id: Number(option.id),
          text: option.text,
          votes_count: Number(option.votes_count),
        }),
      );

      return {
        ...poll,
        options,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while fetching poll details", 500);
    }
  }
}
