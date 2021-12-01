const Customer = require("../models/Customers");
const Permission = require("../models/Permissons");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
require("dotenv").config();
class CustomerController {


    //[POST] http://localhost:5000/api/auth/register
    //User
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
                    message: "Email already exist"
                })
            const hashedPassword = await argon2.hash(password);
            const Role = await Permission.findOne({ name: "User" });
            const newCustomer = new Customer({ name: username, username, password: hashedPassword, phone, email, idPermission: Role._id });
            await newCustomer.save();

            //Return token
            const accessToken = jwt.sign({
                CustomerId: newCustomer._id
            },
                process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
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
            let customer = await Customer.findOne({ username });
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
            customer = await Customer.findOne({ username });
            const permission=await Permission.findOne({_id:customer.idPermission});
            customer.set('permission',permission.name,{strict: false});
            const accessToken = jwt.sign({ CustomerId: customer._id }, process.env.ACCESS_TOKEN_SECRET);
            res.json({
                success: true,
                message: "Logged in successfully",
                customer,
                accessToken
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error })
        }
    }
    //Manage Account Admin
    //[GET] get all account user
    // api/account/user

    async indexUser(req,res){
        const permission=await Permission.findOne({name:'User'});
        const customers=await Customer.find({idPermission:permission._id});
        res.status(200).json({success: true,customers})
    }
    //Manage Account Admin
    //[GET] get all account staff
    // api/account/staff

    async indexStaff(req,res){
        const permission=await Permission.findOne({name:'User'});
        const Customers=await Customer.find({});
        let customers=[];
        Customers.map((cus)=>{
            if (cus.idPermission != permission._id) {
                customers.push(cus);
            }
       
        })
        console.log(customers); 
        
        res.status(200).json({success: true,customers});
        
    }
     //Manage Account Admin
    //[GET] get detail account
    // api/account/:id

    async detail(req,res){

    }
    //Manage Account Admin
    //[POST] create account for staff
    // api/account/create

    async create(req,res){
        
    }
     //Manage Account Admin
    //[POST] store account for staff
    // api/account/store

    async add(req,res){
        
    }
    //Manage Account Admin
    //[PUT] update account
    // api/account/update/:id

    async update(req,res){
        
    }
    //Manage Account Admin
    //[GET] get all account
    // api/account/delete/:id

    async delete(req,res){
        
    }
}

module.exports = new CustomerController;
