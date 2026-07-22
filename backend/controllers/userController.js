import User from "../models/User.js";

const allowedBloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Not Added",
];

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  bloodGroup: user.bloodGroup,
  address: user.address,
  medicalConditions: user.medicalConditions,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load user profile.",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      bloodGroup,
      address,
      medicalConditions,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (fullName !== undefined) {
      const cleanName = fullName.trim();

      if (cleanName.length < 2 || cleanName.length > 80) {
        return res.status(400).json({
          success: false,
          message: "Full name must contain between 2 and 80 characters.",
        });
      }

      user.fullName = cleanName;
    }

    if (phone !== undefined) {
      const cleanPhone = phone.replace(/\D/g, "");

      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number.",
        });
      }

      user.phone = cleanPhone;
    }

    if (bloodGroup !== undefined) {
      if (!allowedBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid blood group.",
        });
      }

      user.bloodGroup = bloodGroup;
    }

    if (address !== undefined) {
      const cleanAddress = address.trim();

      if (cleanAddress.length > 250) {
        return res.status(400).json({
          success: false,
          message: "Address cannot exceed 250 characters.",
        });
      }

      user.address = cleanAddress;
    }

    if (medicalConditions !== undefined) {
      const cleanMedicalConditions = medicalConditions.trim();

      if (cleanMedicalConditions.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Medical conditions cannot exceed 500 characters.",
        });
      }

      user.medicalConditions = cleanMedicalConditions;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Update user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user profile.",
    });
  }
};