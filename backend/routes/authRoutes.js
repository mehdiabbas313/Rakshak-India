import express from "express";

import {
  loginUser,
  registerUser,
} from "../controllers/authController.js";

import {
  loginValidation,
  registerValidation,
} from "../validators/authValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  validationMiddleware,
  loginUser
);

export default router;