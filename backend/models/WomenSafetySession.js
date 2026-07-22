import mongoose from "mongoose";

const womenSafetySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    travellingAlone: {
      type: Boolean,
      default: false,
    },

    trackingActive: {
      type: Boolean,
      default: false,
    },

    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      mapLink: {
        type: String,
        default: "",
      },
    },

    routeMonitoring: {
      active: {
        type: Boolean,
        default: false,
      },

      destination: {
        type: String,
        trim: true,
        maxlength: 250,
        default: "",
      },

      deviationDetected: {
        type: Boolean,
        default: false,
      },
    },

    voiceSOS: {
      enabled: {
        type: Boolean,
        default: false,
      },

      lastDetectedCommand: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
      },
    },

    emergencyContactCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    policeMonitoringStatus: {
      type: String,
      default: "Demo monitoring prepared",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WomenSafetySession = mongoose.model(
  "WomenSafetySession",
  womenSafetySessionSchema
);

export default WomenSafetySession;