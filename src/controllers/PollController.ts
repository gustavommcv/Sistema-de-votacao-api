import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import PollService from "../services/PollService";
import CustomError from "../util/CustomError";

@injectable()
export default class PollController {
  constructor(@inject("PollService") private pollService: PollService) {}

  private getPollLinks(pollId: number) {
    return {
      self: { method: "GET", href: `/polls/${pollId}` },
      vote: { method: "POST", href: `/polls/${pollId}/vote` },
      results: { method: "GET", href: `/polls/${pollId}/results` },
    };
  }

  async getAllPolls(_: Request, response: Response) {
    try {
      const polls = await this.pollService.findAllPolls();

      const pollsWithLinks = polls.map((poll) => ({
        ...poll,
        links: this.getPollLinks(poll.id),
      }));

      response.status(200).json({
        data: pollsWithLinks,
        links: {
          self: { method: "GET", href: "/polls" },
          create: { method: "POST", href: "/polls" },
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ error: error.message });
      } else {
        console.error("Internal Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
