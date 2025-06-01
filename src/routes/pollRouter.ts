import { Router } from "express";
import container from "../di-container";
import PollController from "../controllers/PollController";
import { body, param } from "express-validator";
import validationErrors from "../middlewares/validationErrors";

const pollRouter = Router();
const pollController = container.get(PollController);

pollRouter.get("/", pollController.getAllPolls.bind(pollController));

pollRouter.post(
  "/:id/vote",
  [
    param("id").isInt().withMessage("Poll ID must be an integer"),
    body("option_id").isInt().withMessage("Option ID must be an integer"),
    validationErrors,
  ],
  pollController.vote.bind(pollController),
);

pollRouter.patch(
  "/:id/title",
  [
    param("id").isInt().withMessage("ID deve ser um número inteiro"),
    body("title").isString().notEmpty().withMessage("Título é obrigatório"),
    validationErrors,
  ],
  pollController.updatePollTitle.bind(pollController),
);

pollRouter.get(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  validationErrors,
  pollController.getPollById.bind(pollController),
);

pollRouter.post(
  "/",
  [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("start_date").isISO8601().withMessage("Invalid start date"),
    body("end_date").isISO8601().withMessage("Invalid end date"),
    body("options")
      .isArray({ min: 3 })
      .withMessage("At least 3 options are required"),
    body("options.*")
      .isString()
      .notEmpty()
      .withMessage("Option text cannot be empty"),
    validationErrors,
  ],
  pollController.createPoll.bind(pollController),
);

pollRouter.delete(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  validationErrors,
  pollController.deletePoll.bind(pollController),
);

export default pollRouter;
