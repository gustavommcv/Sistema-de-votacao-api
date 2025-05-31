import { IPoll, IPollWithOptions } from "../models/Poll";

export interface CreatePollData {
  title: string;
  start_date: string;
  end_date: string;
  user_id: number;
  options: string[];
}

export default interface PollRepository {
  findAll(): Promise<IPoll[]>;
  findById(id: number, userId?: number): Promise<IPollWithOptions>;
  create(pollData: CreatePollData): Promise<IPoll>;
  delete(id: number, userId: number): Promise<void>;
  registerVote(pollId: number, optionId: number, userId: number): Promise<void>;
}
