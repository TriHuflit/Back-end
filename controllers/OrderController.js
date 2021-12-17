const Order = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");
const WareHouses = require("../models/WareHouses");

class OrderController {
  // User
  //[GET] api/order/user/:id
  async getOrder(req, res) {

  }
  // User
  //[GET] api/order/user/:id
  async getOrder(req, res) {

  }
  //[POST] api/order/user/cancel/:id
  async cancel(req, res) {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      res.status(404).json({ success: true, message: "Order Not Found !" });
    }
    order.status = "Hủy đơn";
    order.save();
    res.status(200).json({ success: true, message: "Cancel Order Successfully !" });
  }
  //[POST] api/order/user/store
  async store(req, res) {
    const { Cus, Voucher, phoneReviecve, addressRecieve, payments, totalPrice } = req.body;
    const voucher = await Vouchers.findOne({ name: Voucher });
    const { OrderDetail } = req.body;
    try {
      const newOrder = await new Order({
        idCus: Cus,
        idVoucher: voucher._id,
        phoneReviecve,
        addressRecieve,
        payments,
      });
      newOrder.save();
      if (!newOrder) {
        return res
          .status(400)
          .json({ success: false, message: "Order Failed" });
      }
      OrderDetail.map(async (detail) => {
        const product = await Products.findOne({ name: detail.product });
        let amountRequired = detail.amount;
        const idWarehouses = [];
        const warehouses = await WareHouses.aggregate([
          { $match: { idProducts: product._id, amountStock: { $gte: 1 } } },
        ]);
        if (!idWarehouses) {
          return res
            .status(400)
            .json({ success: false, message: "Order Failed" });
        }
        warehouses.map(async (ware) => {
          const warehouse = await WareHouses.findOne({ _id: ware._id });
          if (amountRequired - warehouse.amountStock > 0) {
            amountRequired = amountRequired - warehouse.amountStock;
            warehouse.amountStock = 0;
          } else {
            warehouse.amountStock = warehouse.amountStock - amountRequired;
            amountRequired = 0;
          }
          warehouse.save();
          idWarehouses.push(ware);
          if (amountRequired <= 0) {
            const newDetail = await new OrderDetails({
              idOrder: newOrder._id,
              idProducts: product._id,
              idWarehouses,
              Price: detail.price,
              amount: detail.amount,
            });
            newDetail.save();
            if (!newDetail) {
              return res
                .status(400)
                .json({ success: false, message: "OrderDetail Error" });
            }
          }
        });
      });
      return res
        .status(200)
        .json({ success: true, message: "Order Successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
  // Staff
  //[GET] api/order/staff/
  async index(req, res) {
    const order = await Order.find({}).sort({ createdAt: 1 });
    res.status(200).json({ success: true, order });
  }
  // Staff
  //[GET] api/order/staff/
  async OrderWait(req, res) {
    const order = await Order.find({ status: "Chờ xác nhận" }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, order });
  }


  //[POST] api/order/staff/comfirm/:id
  async comfirm(req, res) {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      res.status(404).json({ success: true, message: "Order Not Found !" });
    }
    order.status = "Đã xác nhận";
    order.save();
    res.status(200).json({ success: true, message: "Comfirm Order Successfully !" });
  }

}

module.exports = new OrderController();
