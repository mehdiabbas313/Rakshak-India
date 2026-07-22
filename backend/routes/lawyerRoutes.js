import express from "express";

import {
  createLawyerRequest,
  getAllLawyerRequests,
  getLawyerRequestById,
  updateLawyerRequest,
  deleteLawyerRequest,
} from "../controllers/lawyerController.js";

const router = express.Router();

// Create Legal Help Request
router.post("/request", createLawyerRequest);

// Get All Requests
router.get("/requests", getAllLawyerRequests);

// Get Single Request
router.get("/requests/:id", getLawyerRequestById);

// Update Request
router.put("/requests/:id", updateLawyerRequest);

// Delete Request
router.delete("/requests/:id", deleteLawyerRequest);

export default router;