import mongoose from "mongoose";

const firSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    complaintType: {
      type: String,
      required: [true, "Complaint type is required"],
      trim: true,
      maxlength: 100,
    },

    incidentDate: {
      type: Date,
      required: [true, "Incident date is required"],
    },

    incidentTime: {
      type: String,
      trim: true,
      default: "",
    },

    incidentLocation: {
      type: String,
      required: [true, "Incident location is required"],
      trim: true,
      maxlength: 250,
    },

    complaintTitle: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
      maxlength: 3000,
    },

    suspectDetails: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    witnessDetails: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    evidenceLinks: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "submitted", "under-review", "closed"],
      default: "submitted",
    },

    policeStation: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Not assigned",
    },

    officialSubmissionStatus: {
      type: String,
      enum: ["not-submitted", "demo-only", "officially-submitted"],
      default: "demo-only",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FIR = mongoose.model("FIR", firSchema);

export default FIR;
