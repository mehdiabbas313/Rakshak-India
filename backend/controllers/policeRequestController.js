import PoliceRequest from "../models/PoliceRequest.js";

const REQUEST_TYPES = [
  "general-assistance",
  "theft",
  "harassment",
  "cyber-crime",
  "missing-person",
  "traffic-incident",
  "suspicious-activity",
  "other",
];

const PRIORITIES = ["standard", "urgent", "critical"];

const STATUSES = [
  "submitted",
  "acknowledged",
  "assigned",
  "in-progress",
  "resolved",
  "cancelled",
];

const formatRequest = (request) => ({
  id: request._id,
  user: request.user,
  requestType: request.requestType,
  priority: request.priority,
  status: request.status,
  title: request.title,
  description: request.description,
  location: request.location,
  selectedStation: request.selectedStation,
  assignedOfficer: request.assignedOfficer,
  staffNotes: request.staffNotes,
  acknowledgedAt: request.acknowledgedAt,
  resolvedAt: request.resolvedAt,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
});

export const createPoliceRequest = async (req, res) => {
  try {
    const {
      requestType,
      priority = "standard",
      title,
      description,
      latitude,
      longitude,
      address,
      selectedStation,
    } = req.body;

    if (!REQUEST_TYPES.includes(requestType)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid request type.",
      });
    }

    if (!PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid priority.",
      });
    }

    const cleanTitle = title?.trim();
    const cleanDescription = description?.trim();

    if (!cleanTitle || cleanTitle.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Request title must contain at least 5 characters.",
      });
    }

    if (!cleanDescription || cleanDescription.length < 20) {
      return res.status(400).json({
        success: false,
        message:
          "Please describe the situation using at least 20 characters.",
      });
    }

    let parsedLatitude = null;
    let parsedLongitude = null;
    let mapLink = "";

    if (latitude !== undefined || longitude !== undefined) {
      parsedLatitude = Number(latitude);
      parsedLongitude = Number(longitude);

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
          message: "Location coordinates are invalid.",
        });
      }

      mapLink = `https://www.google.com/maps?q=${parsedLatitude},${parsedLongitude}`;
    }

    const request = await PoliceRequest.create({
      user: req.user._id,
      requestType,
      priority,
      status: "submitted",
      title: cleanTitle,
      description: cleanDescription,

      location: {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        address: address?.trim() || "",
        mapLink,
      },

      selectedStation: {
        osmId: selectedStation?.osmId || "",
        name: selectedStation?.name?.trim() || "",
        phone: selectedStation?.phone?.trim() || "",
        address: selectedStation?.address?.trim() || "",
        distance: selectedStation?.distance?.trim() || "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Police assistance request saved successfully.",
      request: formatRequest(request),
    });
  } catch (error) {
    console.error("Create police request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save police assistance request.",
    });
  }
};

export const getMyPoliceRequests = async (req, res) => {
  try {
    const requests = await PoliceRequest.find({
      user: req.user._id,
    })
      .populate(
        "assignedOfficer",
        "fullName email phone role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests: requests.map(formatRequest),
    });
  } catch (error) {
    console.error("Get police requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load police assistance history.",
    });
  }
};

export const cancelMyPoliceRequest = async (req, res) => {
  try {
    const request = await PoliceRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Police assistance request not found.",
      });
    }

    if (
      request.status === "resolved" ||
      request.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This request can no longer be cancelled.",
      });
    }

    request.status = "cancelled";
    request.resolvedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Police assistance request cancelled.",
      request: formatRequest(request),
    });
  } catch (error) {
    console.error("Cancel police request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel police assistance request.",
    });
  }
};

export const getAllPoliceRequests = async (req, res) => {
  try {
    const status = req.query.status?.trim();
    const priority = req.query.priority?.trim();

    const query = {};

    if (status && STATUSES.includes(status)) {
      query.status = status;
    }

    if (priority && PRIORITIES.includes(priority)) {
      query.priority = priority;
    }

    const requests = await PoliceRequest.find(query)
      .populate(
        "user",
        "fullName email phone bloodGroup address role"
      )
      .populate(
        "assignedOfficer",
        "fullName email phone role"
      )
      .sort({
        priority: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests: requests.map(formatRequest),
    });
  } catch (error) {
    console.error("Get all police requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load police assistance requests.",
    });
  }
};

export const updatePoliceRequest = async (req, res) => {
  try {
    const {
      status,
      staffNotes,
      assignToMe = false,
    } = req.body;

    const request = await PoliceRequest.findById(
      req.params.id
    )
      .populate(
        "user",
        "fullName email phone bloodGroup address role"
      )
      .populate(
        "assignedOfficer",
        "fullName email phone role"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Police assistance request not found.",
      });
    }

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid request status.",
        });
      }

      request.status = status;

      if (status === "acknowledged" && !request.acknowledgedAt) {
        request.acknowledgedAt = new Date();
      }

      if (
        status === "resolved" ||
        status === "cancelled"
      ) {
        request.resolvedAt = new Date();
      } else {
        request.resolvedAt = null;
      }
    }

    if (staffNotes !== undefined) {
      request.staffNotes = staffNotes.trim();
    }

    if (assignToMe === true) {
      request.assignedOfficer = req.user._id;

      if (request.status === "submitted") {
        request.status = "assigned";
      }
    }

    await request.save();

    await request.populate(
      "assignedOfficer",
      "fullName email phone role"
    );

    return res.status(200).json({
      success: true,
      message: "Police request updated successfully.",
      request: formatRequest(request),
    });
  } catch (error) {
    console.error("Update police request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update police assistance request.",
    });
  }
};