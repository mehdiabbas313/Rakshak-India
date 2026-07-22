import express from "express";

import {
  cancelMyPoliceRequest,
  createPoliceRequest,
  getAllPoliceRequests,
  getMyPoliceRequests,
  updatePoliceRequest,
} from "../controllers/policeRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getMyPoliceRequests)
  .post(createPoliceRequest);

router.patch("/:id/cancel", cancelMyPoliceRequest);

router.get(
  "/staff/all",
  authorizeRoles("police", "admin"),
  getAllPoliceRequests
);

router.patch(
  "/staff/:id",
  authorizeRoles("police", "admin"),
  updatePoliceRequest
);

export default router;