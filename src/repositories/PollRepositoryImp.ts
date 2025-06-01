import { query } from "../database/database";
import { IPoll, IPollWithOptions } from "../models/Poll";
import PollRepository, { CreatePollData } from "./PollRepository";
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

  async findById(id: number, userId?: number): Promise<IPollWithOptions> {
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

      let userVote = null;
      if (userId) {
        const voteResult = await query(
          `SELECT option_id FROM votes WHERE poll_id = ? AND user_id = ?`,
          [id, userId],
        );
        if (voteResult.length > 0) {
          userVote = Number(voteResult[0].option_id);
        }
      }

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
        user_vote: userVote,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while fetching poll details", 500);
    }
  }

  async create(pollData: CreatePollData): Promise<IPoll> {
    try {
      await query("START TRANSACTION");

      const mysqlStartDate = new Date(pollData.start_date)
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d{3}Z$/, "");

      const mysqlEndDate = new Date(pollData.end_date)
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d{3}Z$/, "");

      const pollResult = await query(
        `INSERT INTO ${this.tableName} (title, start_date, end_date, user_id) 
       VALUES (?, ?, ?, ?)`,
        [pollData.title, mysqlStartDate, mysqlEndDate, pollData.user_id],
      );

      const pollId = pollResult.insertId;

      for (const optionText of pollData.options) {
        await query(`INSERT INTO options (text, poll_id) VALUES (?, ?)`, [
          optionText,
          pollId,
        ]);
      }

      await query("COMMIT");

      const createdPoll = await query(
        `SELECT p.*, u.email as user_email 
       FROM ${this.tableName} p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
        [pollId],
      );

      return createdPoll[0] as IPoll;
    } catch (error) {
      await query("ROLLBACK");
      throw new CustomError("Error while creating poll", 500);
    }
  }

  async delete(id: number, userId: number): Promise<void> {
    try {
      await query("START TRANSACTION");

      const poll = await query(
        `SELECT user_id FROM ${this.tableName} WHERE id = ?`,
        [id],
      );

      if (poll.length === 0) {
        throw new CustomError("Poll not found", 404);
      }

      if (poll[0].user_id !== userId) {
        throw new CustomError(
          "Unauthorized - You can only delete your own polls",
          403,
        );
      }

      await query(`DELETE FROM votes WHERE poll_id = ?`, [id]);

      await query(`DELETE FROM options WHERE poll_id = ?`, [id]);

      const result = await query(`DELETE FROM ${this.tableName} WHERE id = ?`, [
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new CustomError("No poll was deleted", 500);
      }

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while deleting poll", 500);
    }
  }

  async registerVote(
    pollId: number,
    optionId: number,
    userId: number,
  ): Promise<void> {
    try {
      await query("START TRANSACTION");

      const poll = await query(
        `SELECT start_date, end_date FROM ${this.tableName} WHERE id = ?`,
        [pollId],
      );

      if (poll.length === 0) {
        throw new CustomError("Poll not found", 404);
      }

      const now = new Date();
      const startDate = new Date(poll[0].start_date);
      const endDate = new Date(poll[0].end_date);

      if (now < startDate || now > endDate) {
        throw new CustomError(
          "Voting is not allowed for this poll at this time",
          400,
        );
      }

      const option = await query(
        `SELECT id FROM options WHERE id = ? AND poll_id = ?`,
        [optionId, pollId],
      );

      if (option.length === 0) {
        throw new CustomError("Invalid option for this poll", 400);
      }

      const existingVote = await query(
        `SELECT id FROM votes WHERE poll_id = ? AND user_id = ?`,
        [pollId, userId],
      );

      if (existingVote.length > 0) {
        throw new CustomError("You have already voted in this poll", 400);
      }

      await query(
        `INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)`,
        [pollId, optionId, userId],
      );

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Error while registering vote", 500);
    }
  }

  async updatePollTitle(
    id: number,
    title: string,
    userId: number,
  ): Promise<void> {
    try {
      await query("START TRANSACTION");

      const poll = await query(
        `SELECT id FROM ${this.tableName} WHERE id = ? AND user_id = ?`,
        [id, userId],
      );

      if (poll.length === 0) {
        throw new CustomError(
          "Enquete não encontrada ou você não tem permissão para editá-la",
          404,
        );
      }

      await query(
        `UPDATE ${this.tableName} SET title = ?, updated_at = NOW() WHERE id = ?`,
        [title, id],
      );

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Erro ao atualizar enquete", 500);
    }
  }
}
