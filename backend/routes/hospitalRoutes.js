import express from "express";

import {
  createHospitalRequest,
  getMyHospitalRequests,
  getHospitalRequestById,
  cancelHospitalRequest,
} from "../controllers/hospitalController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/requests", createHospitalRequest);

router.get("/requests/my", getMyHospitalRequests);

router.get("/requests/:id", getHospitalRequestById);

router.patch(
  "/requests/:id/cancel",
  cancelHospitalRequest
);

export default router;