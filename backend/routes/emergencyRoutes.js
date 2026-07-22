import express from "express";

import {
  cancelEmergency,
  createEmergency,
  getEmergencyById,
  getEmergencyHistory,
  resolveEmergency,
} from "../controllers/emergencyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getEmergencyHistory)
  .post(createEmergency);

router.get("/:id", getEmergencyById);

router.patch("/:id/cancel", cancelEmergency);

router.patch("/:id/resolve", resolveEmergency);

export default router;