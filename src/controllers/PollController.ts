import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import PollService from "../services/PollService";
import CustomError from "../util/CustomError";
import { matchedData } from "express-validator";
import { verifyToken } from "../util/auth";
import { CreatePollData } from "../repositories/PollRepository";

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

  async getPollById(request: Request, response: Response) {
    try {
      const { id } = matchedData(request);
      const poll = await this.pollService.findPollById(id);

      response.status(200).json({
        data: {
          ...poll,
          links: this.getPollLinks(poll.id),
        },
        links: {
          self: { method: "GET", href: `/polls/${id}` },
          all: { method: "GET", href: "/polls" },
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

  async createPoll(request: Request, response: Response) {
    try {
      const { title, start_date, end_date, options } = matchedData(request);
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Authentication required", 401);
      }

      const { id: user_id } = verifyToken(token);

      if (!options || options.length < 3) {
        throw new CustomError("At least 3 options are required", 400);
      }

      const pollData: CreatePollData = {
        title,
        start_date,
        end_date,
        user_id,
        options,
      };

      const createdPoll = await this.pollService.createPoll(pollData);

      response.status(201).json({
        data: {
          ...createdPoll,
          links: this.getPollLinks(createdPoll.id),
        },
        links: {
          self: { method: "GET", href: `/polls/${createdPoll.id}` },
          all: { method: "GET", href: "/polls" },
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
