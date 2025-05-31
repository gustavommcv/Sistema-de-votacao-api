import { IPoll, IPollWithOptions } from "../models/Poll";

export default interface PollRepository {
  findAll(): Promise<IPoll[]>;
  findById(id: number): Promise<IPollWithOptions>;
}
