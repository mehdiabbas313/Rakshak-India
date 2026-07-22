import User from "../models/User.js";
import Emergency from "../models/Emergency.js";
import FIR from "../models/FIR.js";
import WomenSafetySession from "../models/WomenSafetySession.js";
import EmergencyContact from "../models/EmergencyContact.js";

const allowedRoles = ["user", "police", "hospital", "admin"];

const allowedEmergencyStatuses = [
  "activated",
  "cancelled",
  "resolved",
];

const allowedFIRStatuses = [
  "draft",
  "submitted",
  "under-review",
  "closed",
];

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  bloodGroup: user.bloodGroup,
  role: user.role,
  address: user.address,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const formatEmergency = (emergency) => ({
  id: emergency._id,
  user: emergency.user,
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

const formatFIR = (fir) => ({
  id: fir._id,
  user: fir.user,
  referenceNumber: fir.referenceNumber,
  complaintType: fir.complaintType,
  incidentDate: fir.incidentDate,
  incidentTime: fir.incidentTime,
  incidentLocation: fir.incidentLocation,
  complaintTitle: fir.complaintTitle,
  description: fir.description,
  suspectDetails: fir.suspectDetails,
  witnessDetails: fir.witnessDetails,
  evidenceLinks: fir.evidenceLinks,
  status: fir.status,
  policeStation: fir.policeStation,
  officialSubmissionStatus: fir.officialSubmissionStatus,
  submittedAt: fir.submittedAt,
  createdAt: fir.createdAt,
  updatedAt: fir.updatedAt,
});

/*
  GET /api/admin/dashboard
  Admin dashboard statistics
*/
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPoliceUsers,
      totalHospitalUsers,
      totalEmergencies,
      activeEmergencies,
      resolvedEmergencies,
      totalFIRs,
      submittedFIRs,
      underReviewFIRs,
      totalWomenSafetySessions,
      activeWomenSafetySessions,
      totalEmergencyContacts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "police" }),
      User.countDocuments({ role: "hospital" }),

      Emergency.countDocuments(),
      Emergency.countDocuments({ status: "activated" }),
      Emergency.countDocuments({ status: "resolved" }),

      FIR.countDocuments(),
      FIR.countDocuments({ status: "submitted" }),
      FIR.countDocuments({ status: "under-review" }),

      WomenSafetySession.countDocuments(),
      WomenSafetySession.countDocuments({ status: "active" }),

      EmergencyContact.countDocuments(),
    ]);

    const recentEmergencies = await Emergency.find()
      .populate("user", "fullName email phone role")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFIRs = await FIR.find()
      .populate("user", "fullName email phone role")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,

      stats: {
        users: {
          total: totalUsers,
          police: totalPoliceUsers,
          hospital: totalHospitalUsers,
        },

        emergencies: {
          total: totalEmergencies,
          active: activeEmergencies,
          resolved: resolvedEmergencies,
        },

        firs: {
          total: totalFIRs,
          submitted: submittedFIRs,
          underReview: underReviewFIRs,
        },

        womenSafety: {
          total: totalWomenSafetySessions,
          active: activeWomenSafetySessions,
        },

        emergencyContacts: totalEmergencyContacts,
      },

      recentEmergencies: recentEmergencies.map(formatEmergency),
      recentFIRs: recentFIRs.map(formatFIR),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
};

/*
  GET /api/admin/users
  Get all users
*/
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const role = req.query.role?.trim() || "";

    const query = {};

    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role && allowedRoles.includes(role)) {
      query.role = role;
    }

    const users = await User.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(formatUser),
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

/*
  PATCH /api/admin/users/:id/role
  Change user role
*/
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid user role.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (
      user._id.toString() === req.user._id.toString() &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin access.",
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role.",
    });
  }
};

/*
  GET /api/admin/emergencies
  Get all SOS and emergency records
*/
export const getAllEmergencies = async (req, res) => {
  try {
    const status = req.query.status?.trim() || "";

    const query = {};

    if (
      status &&
      allowedEmergencyStatuses.includes(status)
    ) {
      query.status = status;
    }

    const emergencies = await Emergency.find(query)
      .populate("user", "fullName email phone role bloodGroup")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: emergencies.length,
      emergencies: emergencies.map(formatEmergency),
    });
  } catch (error) {
    console.error("Get all emergencies error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load emergency records.",
    });
  }
};

/*
  PATCH /api/admin/emergencies/:id/status
  Update emergency status
*/
export const updateEmergencyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedEmergencyStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid emergency status.",
      });
    }

    const emergency = await Emergency.findById(
      req.params.id
    ).populate(
      "user",
      "fullName email phone role bloodGroup"
    );

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency record not found.",
      });
    }

    emergency.status = status;

    if (
      status === "resolved" ||
      status === "cancelled"
    ) {
      emergency.resolvedAt = new Date();
    }

    if (status === "activated") {
      emergency.resolvedAt = null;
    }

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Emergency status updated successfully.",
      emergency: formatEmergency(emergency),
    });
  } catch (error) {
    console.error("Update emergency status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update emergency status.",
    });
  }
};

/*
  GET /api/admin/firs
  Get all FIR complaint records
*/
export const getAllFIRs = async (req, res) => {
  try {
    const status = req.query.status?.trim() || "";
    const search = req.query.search?.trim() || "";

    const query = {};

    if (status && allowedFIRStatuses.includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          referenceNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          complaintTitle: {
            $regex: search,
            $options: "i",
          },
        },
        {
          complaintType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          incidentLocation: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const firs = await FIR.find(query)
      .populate("user", "fullName email phone role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: firs.length,
      firs: firs.map(formatFIR),
    });
  } catch (error) {
    console.error("Get all FIR records error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load FIR records.",
    });
  }
};

/*
  PATCH /api/admin/firs/:id/status
  Update FIR status and assigned police station
*/
export const updateFIRStatus = async (req, res) => {
  try {
    const {
      status,
      policeStation,
      officialSubmissionStatus,
    } = req.body;

    const allowedOfficialStatuses = [
      "not-submitted",
      "demo-only",
      "officially-submitted",
    ];

    const fir = await FIR.findById(
      req.params.id
    ).populate("user", "fullName email phone role");

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR record not found.",
      });
    }

    if (status !== undefined) {
      if (!allowedFIRStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid FIR status.",
        });
      }

      fir.status = status;
    }

    if (policeStation !== undefined) {
      const cleanPoliceStation = policeStation.trim();

      if (cleanPoliceStation.length > 200) {
        return res.status(400).json({
          success: false,
          message:
            "Police station name cannot exceed 200 characters.",
        });
      }

      fir.policeStation =
        cleanPoliceStation || "Not assigned";
    }

    if (officialSubmissionStatus !== undefined) {
      if (
        !allowedOfficialStatuses.includes(
          officialSubmissionStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid official submission status.",
        });
      }

      fir.officialSubmissionStatus =
        officialSubmissionStatus;
    }

    await fir.save();

    return res.status(200).json({
      success: true,
      message: "FIR record updated successfully.",
      fir: formatFIR(fir),
    });
  } catch (error) {
    console.error("Update FIR status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update FIR record.",
    });
  }
};