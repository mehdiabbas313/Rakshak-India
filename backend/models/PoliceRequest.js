import mongoose from "mongoose";

const policeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestType: {
      type: String,
      enum: [
        "general-assistance",
        "theft",
        "harassment",
        "cyber-crime",
        "missing-person",
        "traffic-incident",
        "suspicious-activity",
        "other",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["standard", "urgent", "critical"],
      default: "standard",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "acknowledged",
        "assigned",
        "in-progress",
        "resolved",
        "cancelled",
      ],
      default: "submitted",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      address: {
        type: String,
        trim: true,
        maxlength: 300,
        default: "",
      },

      mapLink: {
        type: String,
        default: "",
      },
    },

    selectedStation: {
      osmId: {
        type: String,
        trim: true,
        default: "",
      },

      name: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        maxlength: 300,
        default: "",
      },

      distance: {
        type: String,
        trim: true,
        default: "",
      },
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    staffNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

policeRequestSchema.index({
  user: 1,
  createdAt: -1,
});

policeRequestSchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

const PoliceRequest = mongoose.model(
  "PoliceRequest",
  policeRequestSchema
);

export default PoliceRequest;