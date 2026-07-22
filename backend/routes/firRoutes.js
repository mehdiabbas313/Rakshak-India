import express from "express";

import {
  createFIR,
  deleteFIR,
  getFIRById,
  getFIRHistory,
  updateFIR,
} from "../controllers/firController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getFIRHistory)
  .post(createFIR);

router
  .route("/:id")
  .get(getFIRById)
  .put(updateFIR)
  .delete(deleteFIR);

export default router;