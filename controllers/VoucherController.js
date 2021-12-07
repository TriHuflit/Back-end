const Vouchers = require("../models/Vouchers");

class VoucherController {
  //GET api/voucher
  async index(req, res) {
    const voucher = await Vouchers.find({});
    return res.status(200).json({ success: true, voucher });
  }
  //POST api/voucher/add
  async addVoucher(req, res) {
    const { title, name, discount, condition, desciption, dateStart, dateEnd } =
      req.body;
    const newVoucher = await new Vouchers({
      title,
      name,
      discount,
      condition,
      desciption,
      dateStart,
      dateEnd,
    });
    if (!newVoucher) {
      res.status(400).json({ success: false, message: "Add Voucher failed" });
    }
    newVoucher.save();
    res
      .status(200)
      .json({ success: true, message: "Add Voucher succesfully", newVoucher });
  }

  // PUT api/voucher/update/:id
  async UpdateVoucher(req, res) {
    const { title, name, discount, condition, desciption, dateStart, dateEnd } =
      req.body;
    const newVoucher = {
      title,
      name,
      discount,
      condition,
      desciption,
      dateStart,
      dateEnd,
    };
    const UpdateVoucher = await Vouchers.findOneAndUpdate(
      { _id: req.params.id },
      newVoucher,
      { new: true }
    );
    if (!UpdateVoucher) {
      res
        .status(400)
        .json({ success: false, message: "Update Voucher failed" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Update Voucher succesfully",
        UpdateVoucher,
      });
  }
}

module.exports = new VoucherController();
