const Order = require("../models/Orders");
const OrderDetail = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");

class OrderController {
  // User
  //[GET] api/order/user/:id
  async getallOrder(req, res) {}
  //[POST] api/order/user/store
  async store(req, res) {
    const { Cus, Voucher, phoneReviecve, addressRecieve, payments } = req.body;
    const voucher = await Vouchers.findOne({ name: Voucher });

    const newOrder = await new Order({
      idCus: Cus,
      idVoucher: voucher._id,
      phoneReviecve,
      addressRecieve,
      payments,
    });
    newOrder.save();
    const { OrderDetail } = req.body;
    OrderDetail.map((detail) => {
      const products = await Products.find({});
      const newDetail = await new OrderDetail({
        idOrder: newOrder._id,
        idWarehouses,
        Price,
        amount,
      });
    });
    if (!newOrder) {
    }
    const { OrderDetail } = req.body;
    OrderDetail;

    const {} = req.body;
  }
  // Staff
  //[GET] api/order/staff/
  async index(req, res) {}
}

module.exports = new OrderController();
