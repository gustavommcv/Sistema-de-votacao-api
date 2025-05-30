import { Request, Response, Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (_: Request, response: Response) => {
  response.json({
    endpoints: [""],
  });
});

export default indexRouter;
