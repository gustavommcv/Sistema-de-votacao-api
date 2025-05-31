import { IPoll, IPollWithOptions } from "../models/Poll";

export default interface PollService {
  findAllPolls(): Promise<IPoll[]>;
  findPollById(id: number): Promise<IPollWithOptions>;
}
