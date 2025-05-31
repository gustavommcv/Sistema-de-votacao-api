import { IPoll } from "../models/Poll";
 
export default interface PollService {
  findAllPolls(): Promise<IPoll[]>;
}
