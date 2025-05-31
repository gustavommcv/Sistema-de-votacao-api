import { Router } from "express";
import { body } from "express-validator";
import validationErrors from "../middlewares/validationErrors";
import container from "../di-container";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

const authController = container.get(AuthController);

authRouter.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid format for email"),
  body("password")
    .isLength({ min: 3, max: 100 })
    .withMessage("Password must be between 3 and 100"),
  validationErrors,
  authController.login.bind(authController),
);

authRouter.get("/logout", authController.logout.bind(authController));

authRouter.post(
  "/signup",
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid format for email"),
  body("password")
    .isLength({ min: 3, max: 100 })
    .withMessage("Password must be between 3 and 100"),
  validationErrors,
  authController.signup.bind(authController),
);

export default authRouter;
