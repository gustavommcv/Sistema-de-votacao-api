import { IPoll, IPollWithOptions } from "../models/Poll";
import { CreatePollData } from "../repositories/PollRepository";

export default interface PollService {
  findAllPolls(): Promise<IPoll[]>;
  findPollById(id: number): Promise<IPollWithOptions>;
  createPoll(pollData: CreatePollData): Promise<IPoll>;
}
