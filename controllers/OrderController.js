const Order = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");
const WareHouses = require("../models/WareHouses");
const Customers = require("../models/Customers");
const mongoose = require("mongoose");
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
    var newOrder
    if (vouch) {
      newOrder = await new Order({
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
    }
    else {
      newOrder = await new Order({
        idCus: id,
        nameRecieve: name,
        phoneRecieve: phone,
        addressRecieve: address,
        payments,
        totalPrice,
        note
      });
      newOrder.save();
    }
    const listOrder = req.body.listOrder;

    if (!newOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Order Failed" });
    }
    try {

      listOrder.map(async (detail) => {
        let amountRequired = detail.num;
        const idWarehouses = [];
        const product = await Products.findOne({ _id: detail._id });
        const warehouses = await WareHouses.aggregate([
          { $match: { idProducts: product._id, amountStock: { $gte: 1 } } },
        ]);
        if (!warehouses) {
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
    const orders = await Order.find({}).sort({ createdAt: 1 });
    var ods = [];
    let length = orders.length;
    let temp = -1;
    try {
      orders.map(async (order) => {
        const staff = await Customers.findOne({ _id: order.idStaff });
        var nameStaff = ""
        if (staff) {
          nameStaff = staff.name;
        }
        const voucher = await Vouchers.findOne({ _id: order.idVoucher });
        var vouchername = "";
        if (voucher) {
          vouchername = voucher.name;
        }
        const od = await Order.aggregate([
          { $match: { _id: order._id } },
          {
            $project: {
              _id: order._id,
              name: "$nameRecieve",
              Staff: nameStaff,
              address: "$addressRecieve",
              totalPrice: "$totalPrice",
              Voucher: voucher.name,
              status: "$status",
              dateOrder: {
                $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
              },
            },
          },
        ]);
        ods.push(od[0]);
        temp++;
        if (temp == length - 1)
          return res.status(200).json({ success: true, orders: ods });
      })
    } catch {
      return res.status(500).json({ message: "Interval Server Error" });
    }
  }
  // Staff
  //[GET] api/order/staff/
  async OrderWait(req, res) {
    const order = await Order.find({}).sort({ createdAt: 1 }).select("_id ");
    const staff = await Customers.findOne({ _id: order.idStaff });
    const customer = await Customers.findOne({ _id: order.idCus });
    const voucher = await Vouchers.findOne({ _id: order.idVoucher });
    const orders = await Order.aggregate([
      {
        $project: {
          _id: "$_id",
          Customer: customer.name,
          Staff: staff.name,
          totalPrice: "$totalPrice",
          Voucher: voucher.name,
          dateOrder: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
    ]);
    res.status(200).json({ success: true, orders });
  }


  //[POST] api/order/staff/confirm/:id
  async confirm(req, res) {
    const order = await Order.findOne({ _id: req.params.id });
    const staff = await Customers.findOne({ _id: req.body.staff });
    if (!order) {
      res.status(404).json({ success: true, message: "Order Not Found !" });
    }

    order.status = "Đã xác nhận";
    order.idStaff = staff._id;
    order.save();
    res.status(200).json({ success: true, message: "Confirm Order Successfully !" });
  }

}

module.exports = new OrderController();
