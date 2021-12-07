const Permission = require("../models/Permissons");
const Customer = require("../models/Customers");
class PermissionController {
  async index(req, res) {
    const permission = await Permission.find({});
    if (!permission) {
      res.status(404).json({ success: false, message: "Permission Not Found" });
    }
    res.status(200).json({ success: true, permission });
  }

  async store(req, res) {
    const { name } = req.body;
    const permission = await Permission.findOne({ name });
    if (permission) {
      return res
        .status(400)
        .json({ success: false, message: "Permission already exist" });
    }
    try {
      const newRole = new Permission({ name });
      newRole.save();
      if (!newRole) {
        return res.status(401).json({ success: false, message: "Add Failed" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Add Permission Successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server" });
    }
  }
  async update(req, res) {
    const { name } = req.body;
    const permission = await Permission.findOne({ name });
    if (permission) {
      return res
        .status(400)
        .json({ success: false, message: "Permission already exist" });
    }
    try {
      let newRole = { name };
      const updateRole = await Permission.findOneAndUpdate(
        { _id: req.params.id },
        newRole,
        { new: true }
      );
      console.log(updateRole);
      if (!updateRole) {
        return res
          .status(401)
          .json({ success: false, message: "Update Permission Failed" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Update Permission Successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server" });
    }
  }
  async delete(req, res) {
    const permission = await Permission.findOne({ _id: req.params.id });
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, message: "Permission Not Found" });
    }
    try {
      const User = await Customer.findOne({ idPermission: permission._id });
      if (User) {
        return res.status(401).json({
          success: false,
          message: "Delete Failed Error Constraint !",
        });
      }
      await Permission.findOneAndDelete({ _id: permission._id });
      return res
        .status(200)
        .json({ success: true, message: "Delete Permission Successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server" });
    }
  }
}

module.exports = new PermissionController();
