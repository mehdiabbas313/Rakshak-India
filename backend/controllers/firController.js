import FIR from "../models/FIR.js";

const generateReferenceNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `RAKSHAK-FIR-${timestamp}-${random}`;
};

const formatFIR = (fir) => ({
  id: fir._id,
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

export const createFIR = async (req, res) => {
  try {
    const {
      complaintType,
      incidentDate,
      incidentTime,
      incidentLocation,
      complaintTitle,
      description,
      suspectDetails,
      witnessDetails,
      evidenceLinks = [],
      status = "submitted",
    } = req.body;

    if (
      !complaintType?.trim() ||
      !incidentDate ||
      !incidentLocation?.trim() ||
      !complaintTitle?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complaint type, incident date, location, title and description are required.",
      });
    }

    const parsedIncidentDate = new Date(incidentDate);

    if (Number.isNaN(parsedIncidentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid incident date.",
      });
    }

    const allowedStatuses = ["draft", "submitted"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FIR status.",
      });
    }

    const cleanedEvidenceLinks = Array.isArray(evidenceLinks)
      ? evidenceLinks
          .map((link) => String(link).trim())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    let referenceNumber;
    let referenceExists = true;

    while (referenceExists) {
      referenceNumber = generateReferenceNumber();

      referenceExists = await FIR.exists({
        referenceNumber,
      });
    }

    const fir = await FIR.create({
      user: req.user._id,
      referenceNumber,
      complaintType: complaintType.trim(),
      incidentDate: parsedIncidentDate,
      incidentTime: incidentTime?.trim() || "",
      incidentLocation: incidentLocation.trim(),
      complaintTitle: complaintTitle.trim(),
      description: description.trim(),
      suspectDetails: suspectDetails?.trim() || "",
      witnessDetails: witnessDetails?.trim() || "",
      evidenceLinks: cleanedEvidenceLinks,
      status,
      officialSubmissionStatus: "demo-only",
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message:
        status === "draft"
          ? "FIR draft saved successfully."
          : "FIR complaint saved successfully.",
      fir: formatFIR(fir),
    });
  } catch (error) {
    console.error("Create FIR error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Unable to generate a unique FIR reference number.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save FIR complaint.",
    });
  }
};

export const getFIRHistory = async (req, res) => {
  try {
    const firs = await FIR.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: firs.length,
      firs: firs.map(formatFIR),
    });
  } catch (error) {
    console.error("Get FIR history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load FIR history.",
    });
  }
};

export const getFIRById = async (req, res) => {
  try {
    const fir = await FIR.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      fir: formatFIR(fir),
    });
  } catch (error) {
    console.error("Get FIR record error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load FIR record.",
    });
  }
};

export const updateFIR = async (req, res) => {
  try {
    const fir = await FIR.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR record not found.",
      });
    }

    if (fir.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed FIR record cannot be updated.",
      });
    }

    const {
      complaintType,
      incidentDate,
      incidentTime,
      incidentLocation,
      complaintTitle,
      description,
      suspectDetails,
      witnessDetails,
      evidenceLinks,
      status,
    } = req.body;

    if (complaintType !== undefined) {
      fir.complaintType = complaintType.trim();
    }

    if (incidentDate !== undefined) {
      const parsedIncidentDate = new Date(incidentDate);

      if (Number.isNaN(parsedIncidentDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid incident date.",
        });
      }

      fir.incidentDate = parsedIncidentDate;
    }

    if (incidentTime !== undefined) {
      fir.incidentTime = incidentTime.trim();
    }

    if (incidentLocation !== undefined) {
      fir.incidentLocation = incidentLocation.trim();
    }

    if (complaintTitle !== undefined) {
      fir.complaintTitle = complaintTitle.trim();
    }

    if (description !== undefined) {
      fir.description = description.trim();
    }

    if (suspectDetails !== undefined) {
      fir.suspectDetails = suspectDetails.trim();
    }

    if (witnessDetails !== undefined) {
      fir.witnessDetails = witnessDetails.trim();
    }

    if (Array.isArray(evidenceLinks)) {
      fir.evidenceLinks = evidenceLinks
        .map((link) => String(link).trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "draft",
        "submitted",
        "under-review",
        "closed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid FIR status.",
        });
      }

      fir.status = status;
    }

    await fir.save();

    return res.status(200).json({
      success: true,
      message: "FIR record updated successfully.",
      fir: formatFIR(fir),
    });
  } catch (error) {
    console.error("Update FIR error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update FIR record.",
    });
  }
};

export const deleteFIR = async (req, res) => {
  try {
    const fir = await FIR.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR record not found.",
      });
    }

    if (fir.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only FIR drafts can be deleted.",
      });
    }

    await fir.deleteOne();

    return res.status(200).json({
      success: true,
      message: "FIR draft deleted successfully.",
    });
  } catch (error) {
    console.error("Delete FIR error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete FIR draft.",
    });
  }
};