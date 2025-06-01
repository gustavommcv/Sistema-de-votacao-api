import { IPoll, IPollWithOptions } from "../models/Poll";
import { CreatePollData } from "../repositories/PollRepository";

export default interface PollService {
  findAllPolls(): Promise<IPoll[]>;
  findPollById(id: number, userId?: number): Promise<IPollWithOptions>;
  createPoll(pollData: CreatePollData): Promise<IPoll>;
  deletePoll(id: number, userId: number): Promise<void>;
  registerVote(pollId: number, optionId: number, userId: number): Promise<void>;
  updatePollTitle(id: number, title: string, userId: number): Promise<void>;
}
