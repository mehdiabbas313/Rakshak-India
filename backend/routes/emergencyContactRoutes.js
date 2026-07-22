import express from "express";

import {
  createEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
} from "../controllers/emergencyContactController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getEmergencyContacts)
  .post(createEmergencyContact);

router
  .route("/:id")
  .put(updateEmergencyContact)
  .delete(deleteEmergencyContact);

export default router;