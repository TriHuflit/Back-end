const Customer = require("../models/Customers");
const Permission = require("../models/Permissons");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendMail = require("../config/sendmail");
class AuthController {
  //[POST] http://localhost:5000/api/auth/user/register
  //User
  async register(req, res) {
    const { username, password, email, phone } = req.body;
    try {
      var customer = await Customer.findOne({ username });
      //Check for existing user
      if (customer)
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      customer = await Customer.findOne({ email });
      if (customer)
        return res.status(400).json({
          success: false,
          message: "Email already exist",
        });
      const hashedPassword = await argon2.hash(password);
      const Role = await Permission.findOne({ name: "User" });

      const newCustomer = new Customer({
        name: username,
        username,
        password: hashedPassword,
        address: "",
        gender: "Nam",
        birth: "1999/01/01",
        phone,
        email,
        idPermission: Role._id,
      });
      await newCustomer.save();
      sendMail(email, newCustomer._id);
      res.status(200).json({
        success: true,
        message: "Register successfully please comfirm your email before Login !!!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  }
  //POST http://localhost:5000/api/auth/user/login
  async userLogin(req, res) {
    const { username, password } = req.body;

    try {
      const customer = await Customer.findOne({ username });
      //Check Usernam
      if (!customer)
        return res.status(400).json({
          success: false,
          message: "Incorrected username or password",
          data: req.body,
        });
      //Check Password
      const passwordValid = await argon2.verify(customer.password, password);

      if (!passwordValid)
        return res.status(400).json({
          success: false,
          message: "Incorrected username or password",
          data: req.body,
        });
      if (!customer.emailComfirm) {
        return res.status(401).json({
          success: false,
          message: "Verify email before login !!!",
          data: req.body,
        });
      }
      //Correct
      const permission = await Permission.findOne({
        _id: customer.idPermission,
      });
      const accessToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );
      const refreshToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      customer.refreshToken = refreshToken;

      customer.save();
      res.json({
        success: true,
        message: "Logged in successfully",
        customer,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  }
  //POST http://localhost:5000/api/auth/login
  async login(req, res) {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username });
    //Check Usernam
    if (!customer)
      return res.status(400).json({
        success: false,
        message: "Incorrected username or password",
        data: req.body,
      });
    //Check Password
    const passwordValid = await argon2.verify(customer.password, password);

    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Incorrected username or password",
        data: req.body,
      });
    try {
      const permission = await Permission.findOne({
        _id: customer.idPermission,
      });
      // Check Permission
      if (permission.name == "User") {
        return res.status(403).json({
          success: false,
          message: "Authorized",
        });
      }

      //Correct

      const accessToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );
      const refreshToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      customer.refreshToken = refreshToken;
      customer.save();

      res.json({
        success: true,
        message: "Logged in successfully",
        customer,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  }



  async token(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401);

    const customer = await Customer.findOne({ refreshToken });

    if (!customer) {
      return res.status(403);
    }
    const permission = await Permission.findOne({
      _id: customer.idPermission,
    });
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const accessToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );
      const newrefreshToken = jwt.sign(
        { CustomerId: customer._id, Role: permission.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      customer.refreshToken = refreshToken;
      customer.save();
      return res.json({ accessToken, refreshToken: newrefreshToken });
    } catch (error) {
      console.log(error);
    }
  }
  async verifyEmail(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer) {
      return res.status(404).json("User Not Found !");
    }
    customer.emailComfirm = true;
    customer.save();
    return res.status(200).json("Email Comfirm Successfully!!!");
  }
  async logout(req, res) {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer) {
      return res.status(404).json("User Not Found !");
    }
    customer.refreshToken = "";
    customer.save();
    return res.status(200).json("LogOut Successfully");
  }
}

module.exports = new AuthController();
