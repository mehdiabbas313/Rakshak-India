import mongoose from "mongoose";

const lawyerRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    specialization: {
      type: String,
      required: true,
      enum: [
        "Criminal Law",
        "Family Law",
        "Property Law",
        "Cyber Crime",
        "Women Safety",
        "Corporate Law",
        "Other",
      ],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const LawyerRequest = mongoose.model(
  "LawyerRequest",
  lawyerRequestSchema
);

export default LawyerRequest;