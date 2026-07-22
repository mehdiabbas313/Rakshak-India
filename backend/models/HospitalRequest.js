import mongoose from "mongoose";

const hospitalRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hospital: {
      name: {
        type: String,
        trim: true,
        default: "Hospital not selected",
      },

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
        default: "",
      },
    },

    assistanceType: {
      type: String,
      enum: [
        "Emergency",
        "Ambulance",
        "General Medical",
        "Women Healthcare",
        "Child Healthcare",
      ],
      default: "General Medical",
    },

    priority: {
      type: String,
      enum: ["standard", "urgent", "critical"],
      default: "standard",
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["submitted", "reviewing", "accepted", "completed", "cancelled"],
      default: "submitted",
      index: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HospitalRequest = mongoose.model(
  "HospitalRequest",
  hospitalRequestSchema
);

export default HospitalRequest;