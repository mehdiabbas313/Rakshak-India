import EmergencyContact from "../models/EmergencyContact.js";

export const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.user._id,
    }).sort({
      isPrimary: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get emergency contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load emergency contacts.",
    });
  }
};

export const createEmergencyContact = async (req, res) => {
  try {
    const { name, phone, relationship, isPrimary = false } = req.body;

    const cleanName = name?.trim();
    const cleanPhone = phone?.replace(/\D/g, "");
    const cleanRelationship =
      relationship?.trim() || "Trusted Contact";

    if (!cleanName || !cleanPhone) {
      return res.status(400).json({
        success: false,
        message: "Contact name and phone number are required.",
      });
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    const contactCount = await EmergencyContact.countDocuments({
      user: req.user._id,
    });

    if (contactCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "You can add a maximum of 5 emergency contacts.",
      });
    }

    const existingContact = await EmergencyContact.findOne({
      user: req.user._id,
      phone: cleanPhone,
    });

    if (existingContact) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already added.",
      });
    }

    if (isPrimary) {
      await EmergencyContact.updateMany(
        { user: req.user._id },
        { isPrimary: false }
      );
    }

    const contact = await EmergencyContact.create({
      user: req.user._id,
      name: cleanName,
      phone: cleanPhone,
      relationship: cleanRelationship,
      isPrimary: Boolean(isPrimary),
    });

    return res.status(201).json({
      success: true,
      message: "Emergency contact added successfully.",
      contact,
    });
  } catch (error) {
    console.error("Create emergency contact error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already added.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to add emergency contact.",
    });
  }
};

export const updateEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    const { name, phone, relationship, isPrimary } = req.body;

    if (name !== undefined) {
      const cleanName = name.trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Contact name cannot be empty.",
        });
      }

      contact.name = cleanName;
    }

    if (phone !== undefined) {
      const cleanPhone = phone.replace(/\D/g, "");

      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number.",
        });
      }

      const duplicateContact = await EmergencyContact.findOne({
        _id: { $ne: contact._id },
        user: req.user._id,
        phone: cleanPhone,
      });

      if (duplicateContact) {
        return res.status(409).json({
          success: false,
          message: "This phone number is already added.",
        });
      }

      contact.phone = cleanPhone;
    }

    if (relationship !== undefined) {
      contact.relationship =
        relationship.trim() || "Trusted Contact";
    }

    if (isPrimary === true) {
      await EmergencyContact.updateMany(
        {
          user: req.user._id,
          _id: { $ne: contact._id },
        },
        {
          isPrimary: false,
        }
      );

      contact.isPrimary = true;
    }

    if (isPrimary === false) {
      contact.isPrimary = false;
    }

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully.",
      contact,
    });
  } catch (error) {
    console.error("Update emergency contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update emergency contact.",
    });
  }
};

export const deleteEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully.",
    });
  } catch (error) {
    console.error("Delete emergency contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete emergency contact.",
    });
  }
};