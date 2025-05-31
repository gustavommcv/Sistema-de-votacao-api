import { inject, injectable } from "inversify";
import { IPoll, IPollWithOptions } from "../models/Poll";
import PollRepository from "../repositories/PollRepository";
import PollService from "./PollService";

@injectable()
export default class PollServiceImp implements PollService {
  constructor(
    @inject("PollRepository") private pollRepository: PollRepository,
  ) { }

  async findAllPolls(): Promise<IPoll[]> {
    return this.pollRepository.findAll();
  }

  async findPollById(id: number): Promise<IPollWithOptions> {
    return this.pollRepository.findById(id);
  }
}
