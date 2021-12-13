const Order = require("../models/Orders");
const OrderDetail = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");
const WareHouses = require("../models/WareHouses");

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
      const product = await Products.findOne({ name: detail.product });
      const warehouses = await WareHouses.find({
        idProduct: product._id,
      }).where("amountStock>0");
      let min = warehouses[0];
      warehouses.map((ware) => {
        if (ware.amountStock < min.amountStock) {
          if (detail.amount - ware.amountStock >= 0) {
            min = ware;
          }
        }
      });
      const newDetail = await new OrderDetail({
        idOrder: newOrder._id,
        idWarehouses: min._id,
        Price: detail.price,
        amount: detail.amount,
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
