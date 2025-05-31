import { Router } from "express";
import container from "../di-container";
import PollController from "../controllers/PollController";
import { param } from "express-validator";
import validationErrors from "../middlewares/validationErrors";

const pollRouter = Router();
const pollController = container.get(PollController);

pollRouter.get("/", pollController.getAllPolls.bind(pollController));

pollRouter.get(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  validationErrors,
  pollController.getPollById.bind(pollController),
);

export default pollRouter;
