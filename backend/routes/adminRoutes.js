import express from "express";

import {
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  getAllEmergencies,
  updateEmergencyStatus,
  getAllFIRs,
  updateFIRStatus,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

router.get("/emergencies", getAllEmergencies);
router.patch(
  "/emergencies/:id/status",
  updateEmergencyStatus
);

router.get("/firs", getAllFIRs);
router.patch("/firs/:id/status", updateFIRStatus);

export default router;