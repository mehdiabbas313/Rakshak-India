import WomenSafetySession from "../models/WomenSafetySession.js";
import EmergencyContact from "../models/EmergencyContact.js";

const formatSession = (session) => ({
  id: session._id,
  status: session.status,
  travellingAlone: session.travellingAlone,
  trackingActive: session.trackingActive,
  currentLocation: session.currentLocation,
  routeMonitoring: session.routeMonitoring,
  voiceSOS: session.voiceSOS,
  emergencyContactCount: session.emergencyContactCount,
  policeMonitoringStatus: session.policeMonitoringStatus,
  startedAt: session.startedAt,
  endedAt: session.endedAt,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

export const startWomenSafetySession = async (req, res) => {
  try {
    const {
      travellingAlone = false,
      trackingActive = false,
      latitude,
      longitude,
    } = req.body;

    const existingSession = await WomenSafetySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "An active Women Safety session already exists.",
        session: formatSession(existingSession),
      });
    }

    const emergencyContactCount =
      await EmergencyContact.countDocuments({
        user: req.user._id,
      });

    const hasLocation =
      Number.isFinite(Number(latitude)) &&
      Number.isFinite(Number(longitude));

    const parsedLatitude = hasLocation ? Number(latitude) : null;
    const parsedLongitude = hasLocation ? Number(longitude) : null;

    if (
      hasLocation &&
      (parsedLatitude < -90 ||
        parsedLatitude > 90 ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are invalid.",
      });
    }

    const session = await WomenSafetySession.create({
      user: req.user._id,
      status: "active",
      travellingAlone: Boolean(travellingAlone),
      trackingActive: Boolean(trackingActive),

      currentLocation: {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        mapLink: hasLocation
          ? `https://www.google.com/maps?q=${parsedLatitude},${parsedLongitude}`
          : "",
      },

      emergencyContactCount,
      policeMonitoringStatus: "Demo monitoring prepared",
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Women Safety session started successfully.",
      session: formatSession(session),
    });
  } catch (error) {
    console.error("Start Women Safety session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start Women Safety session.",
    });
  }
};

export const getCurrentWomenSafetySession = async (req, res) => {
  try {
    const session = await WomenSafetySession.findOne({
      user: req.user._id,
      status: "active",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      session: session ? formatSession(session) : null,
    });
  } catch (error) {
    console.error("Get current Women Safety session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load current Women Safety session.",
    });
  }
};

export const getWomenSafetyHistory = async (req, res) => {
  try {
    const sessions = await WomenSafetySession.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions: sessions.map(formatSession),
    });
  } catch (error) {
    console.error("Get Women Safety history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Women Safety history.",
    });
  }
};

export const updateWomenSafetySession = async (req, res) => {
  try {
    const session = await WomenSafetySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active Women Safety session not found.",
      });
    }

    const {
      travellingAlone,
      trackingActive,
      latitude,
      longitude,
      routeMonitoring,
      voiceSOS,
    } = req.body;

    if (travellingAlone !== undefined) {
      session.travellingAlone = Boolean(travellingAlone);
    }

    if (trackingActive !== undefined) {
      session.trackingActive = Boolean(trackingActive);
    }

    if (latitude !== undefined || longitude !== undefined) {
      const parsedLatitude = Number(latitude);
      const parsedLongitude = Number(longitude);

      if (
        !Number.isFinite(parsedLatitude) ||
        !Number.isFinite(parsedLongitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90 ||
        parsedLongitude < -180 ||
        parsedLongitude > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid location coordinates are required.",
        });
      }

      session.currentLocation = {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        mapLink: `https://www.google.com/maps?q=${parsedLatitude},${parsedLongitude}`,
      };
    }

    if (routeMonitoring) {
      if (routeMonitoring.active !== undefined) {
        session.routeMonitoring.active = Boolean(
          routeMonitoring.active
        );
      }

      if (routeMonitoring.destination !== undefined) {
        session.routeMonitoring.destination =
          routeMonitoring.destination.trim();
      }

      if (routeMonitoring.deviationDetected !== undefined) {
        session.routeMonitoring.deviationDetected = Boolean(
          routeMonitoring.deviationDetected
        );
      }
    }

    if (voiceSOS) {
      if (voiceSOS.enabled !== undefined) {
        session.voiceSOS.enabled = Boolean(voiceSOS.enabled);
      }

      if (voiceSOS.lastDetectedCommand !== undefined) {
        session.voiceSOS.lastDetectedCommand =
          voiceSOS.lastDetectedCommand.trim();
      }
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Women Safety session updated successfully.",
      session: formatSession(session),
    });
  } catch (error) {
    console.error("Update Women Safety session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update Women Safety session.",
    });
  }
};

export const endWomenSafetySession = async (req, res) => {
  try {
    const session = await WomenSafetySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active Women Safety session not found.",
      });
    }

    session.status = "completed";
    session.trackingActive = false;
    session.routeMonitoring.active = false;
    session.endedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Women Safety session completed successfully.",
      session: formatSession(session),
    });
  } catch (error) {
    console.error("End Women Safety session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to end Women Safety session.",
    });
  }
};

export const cancelWomenSafetySession = async (req, res) => {
  try {
    const session = await WomenSafetySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active Women Safety session not found.",
      });
    }

    session.status = "cancelled";
    session.trackingActive = false;
    session.routeMonitoring.active = false;
    session.endedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Women Safety session cancelled successfully.",
      session: formatSession(session),
    });
  } catch (error) {
    console.error("Cancel Women Safety session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel Women Safety session.",
    });
  }
};