const Order = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");
const WareHouses = require("../models/WareHouses");

class OrderController {
  // User
  //[GET] api/order/user/:id
  async getOrder(req, res) {
    const orders = await Order.find({ idCus: req.params.id, status: "Chờ xác nhận" });
    return res.status(200).json({ success, orders });
  }
  // User
  //[GET] api/order/user/:id
  async getOrderDone(req, res) {
    const orders = await Order.find({ idCus: req.params.id, status: "Đã xác nhận" });
    return res.status(200).json({ success, orders });
  }
  // User
  //[GET] api/order/user/:id
  async getOrderCancel(req, res) {
    const orders = await Order.find({ idCus: req.params.id, status: "Hủy đơn" });
    return res.status(200).json({ success, orders });
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
    const { id, voucher, phone, name, address, payments, totalPrice, note } = req.body;
    const vouch = await Vouchers.findOne({ name: voucher });
    const listOrder = req.body.listOrder;
    console.log(req.body);
    const newOrder = await new Order({
      idCus: id,
      idVoucher: vouch._id,
      nameRecieve: name,
      phoneRecieve: phone,
      addressRecieve: address,
      payments,
      totalPrice,
      note
    });
    newOrder.save();
    if (!newOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Order Failed" });
    }
    try {

      listOrder.map(async (detail) => {
        let amountRequired = detail.num;
        const product = await Products.findOne({ _id: detail._id });
        const idWarehouses = [];
        const warehouses = await WareHouses.aggregate([
          { $match: { idProducts: product._id, amountStock: { $gte: 1 } } },
        ]);
        if (!warehouses) {
          return res
            .status(400)
            .json({ success: false, message: "Order Failed" });
        }
        warehouses.map(async (ware) => {
          console.log(ware);
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
          const price = detail.price * detail.num;
          if (amountRequired <= 0) {
            const newDetail = await new OrderDetails({
              idOrder: newOrder._id,
              idProducts: detail._id,
              idWarehouses,
              Price: price,
              amount: detail.num,
            });
            newDetail.save();
            if (!newDetail) {
              return res
                .status(400)
                .json({ success: false, message: "OrderDetail Error" });
            }
            return;
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
