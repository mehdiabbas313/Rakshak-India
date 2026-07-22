import HospitalRequest from "../models/HospitalRequest.js";

export const createHospitalRequest = async (req, res, next) => {
  try {
    const {
      hospital,
      assistanceType,
      priority,
      patientName,
      description,
      location,
    } = req.body;

    if (!patientName || !description) {
      res.status(400);
      throw new Error("Patient name and description are required");
    }

    if (
      typeof location?.latitude !== "number" ||
      typeof location?.longitude !== "number"
    ) {
      res.status(400);
      throw new Error("Valid current location is required");
    }

    const request = await HospitalRequest.create({
      user: req.user._id,
      hospital,
      assistanceType,
      priority,
      patientName,
      description,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Medical assistance request created successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyHospitalRequests = async (req, res, next) => {
  try {
    const requests = await HospitalRequest.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getHospitalRequestById = async (req, res, next) => {
  try {
    const request = await HospitalRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      res.status(404);
      throw new Error("Hospital request not found");
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelHospitalRequest = async (req, res, next) => {
  try {
    const request = await HospitalRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      res.status(404);
      throw new Error("Hospital request not found");
    }

    if (request.status === "completed") {
      res.status(400);
      throw new Error("Completed request cannot be cancelled");
    }

    request.status = "cancelled";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Hospital request cancelled",
      request,
    });
  } catch (error) {
    next(error);
  }
};