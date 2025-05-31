import { Router } from "express";
import { body, param } from "express-validator";
import validationErrors from "../middlewares/validationErrors";
import container from "../di-container";
import UserController from "../controllers/UserController";

const userRouter = Router();

const userController = container.get(UserController);

userRouter.get("/", userController.getUsers.bind(userController));

userRouter.get(
  "/:id",
  param("id")
    .isInt()
    .withMessage("Id must be a integer")
    .notEmpty()
    .withMessage("Id cannot be empty"),
  validationErrors,
  userController.getUserById.bind(userController),
);

userRouter.delete("/", userController.deleteUser.bind(userController));

userRouter.put(
  "/",
  [
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password").optional(),
  ],
  validationErrors,
  userController.editUser.bind(userController),
);

export default userRouter;
