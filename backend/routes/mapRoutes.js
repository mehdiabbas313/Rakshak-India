import express from "express";

import {
  getNearbyHospitals,
  getNearbyPolice,
} from "../controllers/mapController.js";

const router = express.Router();

router.get("/police", getNearbyPolice);
router.get("/hospitals", getNearbyHospitals);

export default router;