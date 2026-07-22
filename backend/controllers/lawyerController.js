import LawyerRequest from "../models/LawyerRequest.js";

// Create Legal Help Request
export const createLawyerRequest = async (req, res) => {
  try {
    const { fullName, phone, email, specialization, message } = req.body;

    if (!fullName || !phone || !specialization || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const request = await LawyerRequest.create({
      fullName,
      phone,
      email,
      specialization,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Legal Help Request Submitted Successfully",
      data: request,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Requests
export const getAllLawyerRequests = async (req, res) => {
  try {
    const requests = await LawyerRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Request
export const getLawyerRequestById = async (req, res) => {
  try {
    const request = await LawyerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Status
export const updateLawyerRequest = async (req, res) => {
  try {
    const request = await LawyerRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request Updated Successfully",
      data: request,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Request
export const deleteLawyerRequest = async (req, res) => {
  try {
    const request = await LawyerRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};