import { inject, injectable } from "inversify";
import { IPoll, IPollWithOptions } from "../models/Poll";
import PollRepository, { CreatePollData } from "../repositories/PollRepository";
import PollService from "./PollService";

@injectable()
export default class PollServiceImp implements PollService {
  constructor(
    @inject("PollRepository") private pollRepository: PollRepository,
  ) {}

  async findPollById(id: number, userId?: number): Promise<IPollWithOptions> {
    return this.pollRepository.findById(id, userId);
  }

  async findAllPolls(): Promise<IPoll[]> {
    return this.pollRepository.findAll();
  }

  async createPoll(pollData: CreatePollData): Promise<IPoll> {
    return this.pollRepository.create(pollData);
  }

  async deletePoll(id: number, userId: number): Promise<void> {
    return this.pollRepository.delete(id, userId);
  }

  async registerVote(
    pollId: number,
    optionId: number,
    userId: number,
  ): Promise<void> {
    return this.pollRepository.registerVote(pollId, optionId, userId);
  }
}
