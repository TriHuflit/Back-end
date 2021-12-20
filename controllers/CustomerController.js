const Customer = require("../models/Customers");
const Permission = require("../models/Permissons");
const Order = require("../models/Orders.js");
const argon2 = require("argon2");
const cloudinary = require("../ultis/cloudinary");
require("dotenv").config();

class CustomerController {
  //Manage Account Admin
  //[GET] get all account user
  // api/account/user

  async indexUser(req, res) {
    const permission = await Permission.findOne({ name: "User" });
    const customers = await Customer.find({ idPermission: permission._id });
    var len = customers.length;
    var curIdx = 0;
    if (customers.length > 0) {
      customers.forEach(function (cus) {
        cus.set("Role", permission.name, { strict: false });
        ++curIdx;
        if (curIdx == len) {
          res.status(200).json({ success: true, customers });
        }
      });
    } else {
      res.status(200).json({ success: true, customers });
    }
  }
  //Manage Account Admin
  //[GET] get all account staff
  // api/account/staff

  async indexStaff(req, res) {
    const permission = await Permission.findOne({ name: "User" });
    const customers = await Customer.find({});
    var len = customers.length;
    var curIdx = 0;
    var customer = [];
    customers.forEach(function (cus) {
      Permission.findOne({ _id: cus.idPermission }, function (err, role) {
        if (err) console.log(err);
        else {
          if (!cus.idPermission.equals(permission._id)) {
            cus.set("Role", role.name, { strict: false });
            customer.push(cus);
          }
        }
        ++curIdx;
        if (curIdx == len) {
          res.status(200).json({ success: true, user: customer });
        }
      });
    });
  }
  //Manage Account Admin
  //[GET] get detail account
  // api/account/:id
  async detail(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id }).select(
      "-password"
    );
    const permission = await Permission.findOne({ _id: customer.idPermission });
    customer.set("role", permission.name, { strict: false });
    if (!customer) {
      res.status(404).json({ success: false, message: "User Not Found !!!" });
    }
    res.status(200).json({ success: true, customer });
  }
  //Manage Account Admin
  //[POST] create account for staff
  // api/account/create

  async create(req, res) {
    const permission = await Permission.find({});
    return res.status(200).json({ success: true, permission });
  }
  //Manage Account Admin
  //[POST] store account for staff
  // api/account/store

  async store(req, res) {
    const permission = await Permission.findOne({ name: req.body.Role });
    const { name, username, phone, gender, email, address } = req.body;
    //check username and password
    var checkUser = await Customer.findOne({ username });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken !",
      });
    }
    checkUser = await Customer.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }
    const hashedPassword = await argon2.hash(process.env.PASSWORD_DEFAULT);
    const newCustomer = await new Customer({
      name,
      username,
      password: hashedPassword,
      phone,
      gender,
      email,
      address,
      idPermission: permission._id,
      emailComfirm: true,
    });
    newCustomer.save();
    if (!newCustomer) {
      return res.status(400).json({
        success: false,
        message: "Add New Account Failed !",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Add New User Successfully!" });
  }
  //Manage Account Admin
  //[GET] show info for update account
  // api/account/edit/:id
  async edit(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id }).select(
      "-password"
    );
    const permission = await Permission.find({});
    customer.set("listrole", permission, { strict: false });
    if (!customer) {
      res.status(404).json({ success: false, message: "User Not Found !!!" });
    }
    res.status(200).json({ success: true, customer });
  }
  //Manage Account Admin
  //[PUT] update account
  // api/account/update/:id

  async update(req, res) {
    const { Role } = req.body;
    const customer = await Customer.findOne({ _id: req.params.id });
    const idPermission = await Permission.findOne({
      name: Role,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }
    let newCus = {
      idPermission: idPermission._id,
    };
    const UpdateCus = await Customer.findOneAndUpdate(
      { _id: customer._id },
      newCus,
      { new: true }
    );
    if (!UpdateCus) {
      return res
        .status(401)
        .json({ success: false, message: "Update Failed !!!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Update Permission Successfully" });
  }
  //Manage Account Admin
  //[GET] get all account
  // api/account/delete/:id

  async delete(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id });
    var order = await Order.findOne({ idCus: customer._id });
    if (order) {
      return res.status(400).json({
        success: false,
        message: "Delete Failed Error Constraint !",
      });
    }
    order = await Order.findOne({ idStaff: customer._id });
    if (order) {
      return res.status(400).json({
        success: false,
        message: "Delete Failed Error Constraint !",
      });
    }
    const deteleUser = await Customer.findOneAndDelete({ _id: customer._id });
    if (!deteleUser) {
      return res
        .status(401)
        .json({ success: false, message: "Delete Failed !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Detele Successfully !" });
  }
  //Manager Accout User
  //[GET] infouser api/user/account/:id
  async infouser(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }
    return res.status(200).json({ success: true, customer });
  }
  //[POST] editouser api/user/account/update/:id
  async updateinfo(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }
    try {
      const { name, emil, phone, gender, birth, address } = req.body;
      var avatar;
      if (Object.keys(customer.avatar).length === 0) {
        avatar = await cloudinary.uploader.upload(req.body.avatar);
      }
      else {
        await cloudinary.uploader.destroy(customer.avatar.cloud_id);
        avatar = await cloudinary.uploader.upload(req.body.avatar);
      }

      let newcustomer = ({
        name,
        email,
        phone,
        gender,
        birth,
        address,
        avatar: {
          url: avatar.secure_url,
          cloud_id: avatar.public_id,
        }
      })
      const updateCus = await Customer.findOneAndUpdate({ _id: req.params.id }, newcustomer, { new: true });
      if (updateCus) {
        return res
          .status(200)
          .json({ success: true, message: "Update Infomation Successfully !!!" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Update Infomation Failed !!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Interval Server error" });
    }
  }
}

module.exports = new CustomerController();
