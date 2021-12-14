const Order = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
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
    if (!newOrder) {
      return res.status(400).json({ success: false, message: "Order Failed" });
    }
    const { OrderDetail } = req.body;
    OrderDetail.map(async (detail) => {
      const product = await Products.findOne({ name: detail.product });
      const warehouses = await WareHouses.find({
        idProduct: product._id,
      }).where("amountStock>0");
      console.log(warehouses);
      let amountRequired = detail.amountStock;
      var arrayWare = [];
      warehouses.map(async (ware) => {
        const warehouse = await WareHouses.findOne({ _id: ware._id });

        amountRequired = warehouse.amountStock - amountRequired;
        warehouse.amountStock = warehouse.amountStock - amountRequired;
        warehouse.save();
        arrayWare.push(ware._id);
        if (amountRequired >= 0) {
          return;
        }
      });
      const newDetail = await new OrderDetails({
        idOrder: newOrder._id,
        idProducts: product._id,
        idWarehouses: arrayWare,
        Price: detail.price,
        amount: detail.amount,
      });
      newDetail.save();
      if (!newDetail) {
        return res
          .status(400)
          .json({ success: false, message: "OrderDetail Error" });
      }
    });
    return res
      .status(200)
      .json({ success: true, message: "Order Successfully" });
  }
  // Staff
  //[GET] api/order/staff/
  async index(req, res) {}
}

module.exports = new OrderController();
