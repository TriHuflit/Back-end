const Permission = require("../models/Permissons");

class PermissionController {
  async index(req, res) {
    const permission = await Permission.find({});
    if (!permission) {
      res.status(404).json({ success: false, message: "Permission Not Found" });
    }
    res.status(200).json({ success: true, permission });
  }

  async detail(req, res) {}

  async store(req, res) {
      const 
  }
  async edit(req, res) {}
  async update(req, res) {}
  async delete(req, res) {}
}

module.exports = new PermissionController();
