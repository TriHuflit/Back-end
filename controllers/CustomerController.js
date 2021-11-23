const Customer = require("../models/Customers");
const Permission = require("../models/Permissons");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
require("dotenv").config();
class CustomerController {


    //[POST] http://localhost:5000/api/auth/register

    async register(req, res) {
        const { username, password, email, phone } = req.body;
        try {

            var customer = await Customer.findOne({ username });
            //Check for existing user
            if (customer)
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            customer = await Customer.findOne({ email });
            if (customer)
                return res.status(400).json({
                    success: false,
                    message: "Email already taken"
                })
            const hashedPassword = await argon2.hash(password);
            const Role = await Permission.findOne({ name: "Customer" });
            const newCustomer = new Customer({ name: username, username, password: hashedPassword, phone, email, idPermission: Role._id });
            await newCustomer.save();

            //Return token
            const accessToken = jwt.sign({
                CustomerId: newCustomer._id
            },
                process.env.ACCESS_TOKEN_SECRET);
            res.json({
                success: true,
                message: "User created successfully",
                accessToken
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error })
        }
    }
    //POST http://localhost:5000/api/auth/login
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const customer = await Customer.findOne({ username })
            //Check Usernam
            if (!customer)
                return res.status(400).json({
                    success: false,
                    message: "Incorrected username or password",
                    data:req.body
                });
            //Check Password
            const passwordValid = await argon2.verify(customer.password, password);
            if (!passwordValid)
                return res.status(400).json({
                    success: false,
                    message: "Incorrected username or password",
                    data:req.body
                });
            //Correct
            const accessToken = jwt.sign({ CustomerId: customer._id }, process.env.ACCESS_TOKEN_SECRET);
            res.json({
                success: true,
                message: "Logged in successfully",
                name: customer.name,
                accessToken
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error })
        }
    }

}

module.exports = new CustomerController;
