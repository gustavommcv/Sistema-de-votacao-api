import { Router } from "express";
import container from "../di-container";
import PollController from "../controllers/PollController";

const pollRouter = Router();
const pollController = container.get(PollController);

pollRouter.get("/", pollController.getAllPolls.bind(pollController));

export default pollRouter;
