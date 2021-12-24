const Order = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const Vouchers = require("../models/Vouchers");
const Products = require("../models/Products");
const WareHouses = require("../models/WareHouses");
const Customers = require("../models/Customers");
const mongoose = require("mongoose");
const Reports = require("../models/Reports");
const ObjectId = mongoose.Types.ObjectId;
class OrderController {
  // User
  //[GET] api/order/user/all/:id
  async getOrders(req, res) {
    const orders = await Order.aggregate([
      { $match: { idCus: ObjectId(req.params.id) } },
      {
        $addFields: {
          dateOrder: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
        }
      }
    ]);
    return res.status(200).json({ success: true, orders });
  }
  //[GET]  detail Order api/order/user/detail/:id
  async getDetailOrder(req, res) {
    const orders = await Order.findOne({ _id: req.params.id }, { _id: 1, nameRecieve: 1, addressRecieve: 1, totalPrice: 1 });
    if (!orders) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }
    try {
      const orderdetails = await OrderDetails.find({ idOrder: orders._id });
      var len = orderdetails.length;
      var curIdx = 0;
      var newdetail = [];
      console.log(orderdetails);
      orderdetails.map(async (orderdetail) => {
        const product = await Products.findOne({ _id: orderdetail.idProducts });
        const detail = await OrderDetails.aggregate([
          { $match: { _id: ObjectId(orderdetail._id) } },
          {
            $project: {
              product: product.name,
              imageProduct: product.imageRepresent[0].url,
              amount: "$amount",
              price: "$Price",
            }
          }
        ])
        newdetail.push(detail);
        ++curIdx;
        if (curIdx == len) { return res.status(200).json({ success: true, orders, orderdetails: newdetail }); }
      })
    } catch (error) {
      return res.status(500).json({ message: "Interval Server Error" });
    }
  }
  // User
  //[GET] api/order/user/:id
  async getOrderDone(req, res) {
    const orders = await Order.find({ idCus: req.params.id, status: "Đã xác nhận" });
    return res.status(200).json({ success: true, orders });
  }
  // User
  //[GET] api/order/user/:id
  async getOrderCancel(req, res) {
    const orders = await Order.find({ idCus: req.params.id, status: "Hủy đơn" });
    return res.status(200).json({ success: true, orders });
  }
  //[GET] api/order/detail/:id
  async detailOrder(req, res) {
    const order = await Order.find({ _id: req.params.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }
    return res.status(200).json({ success: true, order });
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
        for (const ware of warehouses) {
          if (amountRequired <= 0) { return; }
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
        }
        // warehouses.map(async (ware) => {

        // });

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
              Voucher: vouchername,
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
  //[GET] statistical api/order/staff/statistical
  async getStati(req, res) {
    const reports = await Reports.aggregate([
      {
        $project: {
          id: "$_id",
          year: { $year: "$statistical" },
          month: { $month: "$statistical" }
        }
      }
    ]);
    res.status(200).json({ success: true, reports });
  }
  //POST  api/order/staff/statistical/store
  async addStati(req, res) {
    const { monthYear } = req.body;
    const report = new Reposts({
      statistical: monthYear
    })
    await report.save();
    if (report) {
      res.status(200).json({ success: true, message: "Add Repost Successfully !!!" });
    }
    res.status(500).json({ success: false, message: "Interval Server Error" });
  }
  //[GET] statistical api/order/staff/statistical/:id
  async getDetailStati(req, res) {
    const report = await Reports.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $project: {
          year: { $year: "$statistical" },
          month: { $month: "$statistical" }
        }
      }
    ])
    const orders = await Order.find({
      $expr: {
        $eq: [{ $year: "$createdAt" }, report[0].year],
        $eq: [{ $month: "$createdAt" }, report[0].month]
      }
      , status: "Chờ xác nhận"
    }, {
      _id: 1, nameRecieve: 1, totalPrice: 1, dateOrder: {
        $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
      },
    });
    res.status(200).json({ success: true, orders, time: { month: report[0].month, year: report[0].year } });
  }
}

module.exports = new OrderController();
