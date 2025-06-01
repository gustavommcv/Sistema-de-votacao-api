import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import PollService from "../services/PollService";
import CustomError from "../util/CustomError";
import { matchedData } from "express-validator";
import { verifyToken } from "../util/auth";
import { CreatePollData } from "../repositories/PollRepository";

@injectable()
export default class PollController {
  constructor(@inject("PollService") private pollService: PollService) { }

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
      const token = request.cookies.jwtToken;
      let userId = null;

      if (token) {
        try {
          const decoded = verifyToken(token);
          userId = decoded.id;
        } catch (error) {
          console.warn("Invalid token, returning poll without user vote info");
        }
      }

      const poll = await this.pollService.findPollById(id, userId);

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

  async deletePoll(request: Request, response: Response) {
    try {
      const { id } = matchedData(request);
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Authentication required", 401);
      }

      const { id: userId } = verifyToken(token);

      await this.pollService.deletePoll(Number(id), userId);

      response.status(200).json({
        message: "Poll deleted successfully",
        links: {
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

  async vote(request: Request, response: Response) {
    try {
      const { id: pollId } = matchedData(request, { locations: ["params"] });
      const { option_id } = matchedData(request, { locations: ["body"] });
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Authentication required", 401);
      }

      const { id: userId } = verifyToken(token);

      await this.pollService.registerVote(
        Number(pollId),
        Number(option_id),
        userId,
      );

      response.status(200).json({
        message: "Vote registered successfully",
        links: {
          poll: { method: "GET", href: `/polls/${pollId}` },
          results: { method: "GET", href: `/polls/${pollId}/results` },
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

  async updatePollTitle(request: Request, response: Response) {
    try {
      const { id } = matchedData(request, { locations: ["params"] });
      const { title } = matchedData(request, { locations: ["body"] });
      const token = request.cookies.jwtToken;

      if (!token) {
        throw new CustomError("Autenticação necessária", 401);
      }

      const { id: userId } = verifyToken(token);

      await this.pollService.updatePollTitle(Number(id), title, userId);

      response.status(200).json({
        message: "Título da enquete atualizado com sucesso",
        links: {
          poll: { method: "GET", href: `/polls/${id}` },
          all: { method: "GET", href: "/polls" },
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        response.status(error.status).json({ error: error.message });
      } else {
        console.error("Erro ao atualizar enquete:", error);
        response.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
}
