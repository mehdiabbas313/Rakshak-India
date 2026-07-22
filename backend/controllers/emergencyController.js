import Emergency from "../models/Emergency.js";
import EmergencyContact from "../models/EmergencyContact.js";

const formatEmergency = (emergency) => ({
  id: emergency._id,
  type: emergency.type,
  status: emergency.status,
  location: emergency.location,
  nearestPoliceStation: emergency.nearestPoliceStation,
  emergencyContactCount: emergency.emergencyContactCount,
  message: emergency.message,
  activatedAt: emergency.activatedAt,
  resolvedAt: emergency.resolvedAt,
  createdAt: emergency.createdAt,
  updatedAt: emergency.updatedAt,
});

export const createEmergency = async (req, res) => {
  try {
    const {
      type = "SOS",
      latitude,
      longitude,
      nearestPoliceStation,
      message,
    } = req.body;

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (
      !Number.isFinite(parsedLatitude) ||
      !Number.isFinite(parsedLongitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    if (
      parsedLatitude < -90 ||
      parsedLatitude > 90 ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are invalid.",
      });
    }

    const emergencyContactCount =
      await EmergencyContact.countDocuments({
        user: req.user._id,
      });

    const mapLink = `https://www.google.com/maps?q=${parsedLatitude},${parsedLongitude}`;

    const emergency = await Emergency.create({
      user: req.user._id,
      type,
      status: "activated",

      location: {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        mapLink,
      },

      nearestPoliceStation: {
        name:
          nearestPoliceStation?.name ||
          "Nearest police station",

        status:
          nearestPoliceStation?.status ||
          "Demo alert prepared",
      },

      emergencyContactCount,

      message:
        message?.trim() ||
        "Emergency assistance requested.",

      activatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "SOS event recorded successfully.",
      emergency: formatEmergency(emergency),
    });
  } catch (error) {
    console.error("Create emergency error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record the SOS event.",
    });
  }
};

export const getEmergencyHistory = async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: emergencies.length,
      emergencies: emergencies.map(formatEmergency),
    });
  } catch (error) {
    console.error("Get emergency history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load emergency history.",
    });
  }
};

export const getEmergencyById = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      emergency: formatEmergency(emergency),
    });
  } catch (error) {
    console.error("Get emergency record error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the emergency record.",
    });
  }
};

export const cancelEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency record not found.",
      });
    }

    if (emergency.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Resolved emergency cannot be cancelled.",
      });
    }

    emergency.status = "cancelled";
    emergency.resolvedAt = new Date();

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "SOS event cancelled successfully.",
      emergency: formatEmergency(emergency),
    });
  } catch (error) {
    console.error("Cancel emergency error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel the SOS event.",
    });
  }
};

export const resolveEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency record not found.",
      });
    }

    if (emergency.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled emergency cannot be resolved.",
      });
    }

    emergency.status = "resolved";
    emergency.resolvedAt = new Date();

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Emergency marked as resolved.",
      emergency: formatEmergency(emergency),
    });
  } catch (error) {
    console.error("Resolve emergency error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resolve the emergency.",
    });
  }
};