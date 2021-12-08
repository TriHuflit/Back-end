const moment = require("moment");
const Vouchers = require("../models/Vouchers");

class VoucherController {
  //GET api/voucher
  async index(req, res) {
    const vouchers = await Vouchers.find({});
    let lenght = vouchers.length;
    let count = 0;
    vouchers.map((voucher) => {
      const dateStart = moment(voucher.dateStart).format("MM-DD-YYYY");
      const dateEnd = moment(voucher.dateEnd).format("MM-DD-YYYY");
      voucher.set("DateStart", dateStart, { strict: false });
      voucher.set("DateEnd", dateEnd, { strict: false });

      count++;
      if (lenght == count) {
        return res.status(200).json({ success: true, vouchers });
      }
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Add Voucher failed" });
    }
    newVoucher.save();
    return res
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
    res.status(200).json({
      success: true,
      message: "Update Voucher succesfully",
      UpdateVoucher,
    });
  }
}

module.exports = new VoucherController();
