import express from "express";

import {
  cancelWomenSafetySession,
  endWomenSafetySession,
  getCurrentWomenSafetySession,
  getWomenSafetyHistory,
  startWomenSafetySession,
  updateWomenSafetySession,
} from "../controllers/womenSafetyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(startWomenSafetySession);

router.get("/current", getCurrentWomenSafetySession);

router.get("/history", getWomenSafetyHistory);

router.patch("/:id", updateWomenSafetySession);

router.patch("/:id/end", endWomenSafetySession);

router.patch("/:id/cancel", cancelWomenSafetySession);

export default router;