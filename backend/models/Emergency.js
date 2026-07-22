import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["SOS", "Women Safety", "Medical", "Police", "Fire"],
      default: "SOS",
    },

    status: {
      type: String,
      enum: ["activated", "cancelled", "resolved"],
      default: "activated",
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

      mapLink: {
        type: String,
        default: "",
      },
    },

    nearestPoliceStation: {
      name: {
        type: String,
        default: "Nearest police station",
      },

      status: {
        type: String,
        default: "Demo alert prepared",
      },
    },

    emergencyContactCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "Emergency assistance requested.",
    },

    activatedAt: {
      type: Date,
      default: Date.now,
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

const Emergency = mongoose.model("Emergency", emergencySchema);

export default Emergency;