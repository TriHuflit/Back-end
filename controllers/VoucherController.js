const moment = require("moment");

const Vouchers = require("../models/Vouchers");

class VoucherController {
  //GET api/voucher
  async index(req, res) {
    // const vouchers = await Vouchers.find({});
    const vouchers = await Vouchers.aggregate([
      {
        $project: {
          title: "$title",
          name: "$name",
          condition: "$condition",
          desciption: "$desciption",
          discount: "$discount",
          dateStart: {
            $dateToString: { format: "%Y-%m-%d", date: "$dateStart" },
          },
          dateEnd: {
            $dateToString: { format: "%Y-%m-%d", date: "$dateStart" },
          },
        },
      },
    ]);
    return res.status(200).json({ success: true, vouchers });
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
