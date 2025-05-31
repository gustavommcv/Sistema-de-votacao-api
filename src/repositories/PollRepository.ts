import { IPoll } from "../models/Poll";

export default interface PollRepository {
  findAll(): Promise<IPoll[]>;
}
