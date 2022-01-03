const Rate = require('../models/Rates');
const OrderDetails = require("../models/OrderDetails");
const Customer = require("../models/Customers");
const Product = require("../models/Products");
const RepRates = require("../models/RepRates");
class RateController {
    //[POST] api/rate/:id
    async rate(req, res) {
        const { idProduct, idOrder, rateNumber, rateContent } = req.body;
        const rate = new Rate({
            idCus: req.params.id,
            idProduct: idProduct,
            star: rateNumber,
            content: rateContent
        })
        await rate.save();
        if (!rate) {
            return res.status(400).json({ success: false, message: "Rated Product Failed !" });
        }
        const orderdetail = await OrderDetails.findOne({ idOrder: idOrder, idProducts: idProduct });
        orderdetail.status = "Đã đánh giá";
        orderdetail.save();
        if (!orderdetail) {
            return res.status(400).json({ success: false, message: "Change status Orderdetail Failed !" });
        }
        return res.status(200).json({ success: true, message: "Rate Product Successfully !" });
    }
    //[POST] api/media/rate/rep/:id
    async repRate(req, res) {
        const rate = await Rate.findOne({ _id: req.params.id });
        if (!rate) {
            return res.status(404).json("Rate Not Found");
        }
        try {
            const { idStaff, content } = req.body;
            const newRep = await new RepRates({
                idStaff,
                idRate: rate._id,
                content
            })
            newRep.save();
            if (!newRep) {
                return res.status(400).json({ success: false, message: "Rep Rate Failed" });
            }
            return res.status(200).json({ success: true, message: "Rep Rate Successfully !!!" });
        } catch (error) {
            return res.status(500).json("Interval Server Error");
        }

    }
    //[GET] api/media/rate
    async index(req, res) {
        const rates = await Rate.find({});
        var newRate = [];
        var len = rates.length;
        var count = 0;
        for (let i = 0; i < rates.length; i++) {
            const customer = await Customer.findOne({ _id: rates[i].idCus });
            const product = await Product.findOne({ _id: rates[i].idProduct });
            const rate = await Rate.aggregate([
                {
                    $project: {
                        customer: customer.name,
                        star: "$star",
                        product: product.name,
                        content: "$content",
                        dateRate: {
                            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                        }
                    }
                }
            ]);
            newRate.push(rate[0]);
            count++;
            if (count == len) {
                return res.status(200).json({ success: true, newRate });
            }
        }
    }
}
module.exports = new RateController();