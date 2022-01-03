const Rate = require('../models/Rates');
const OrderDetails = require("../models/OrderDetails");
const Customer = require("../models/Customers");
const Product = require("../models/Products");
const RepRates = require("../models/RepRates");
class RateController {
    //[POST] api/rate/:id
    async rate(req, res) {
        const { idProduct, idOrder, rateNumber, rateContent, avatar } = req.body;
        const customer = await Customer.findOne({ _id: req.params.id });
        if (!customer) {
            return res.status(404).json("Customer Not Found");
        }
        const rate = new Rate({
            idCus: customer._id,
            idProduct: idProduct,
            star: rateNumber,
            content: rateContent,
            avatar: customer.avatar,
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
    //[PUT] api/media/rate/update/:id
    async updateRepRate(req, res) {
        const rate = await Rate.findOne({ _id: req.params.id });
        if (!rate) {
            return res.status(404).json("Rate Not Found");
        }
        try {
            const { idStaff, content } = req.body;
            const newRep = ({
                idRate: rate._id,
                idStaff,
                content
            })
            console.log(req.body.idRep);
            const updateRep = await RepRates.findOneAndUpdate({ _id: req.body.idRep }, newRep, { new: true })
            if (!updateRep) {
                return res.status(400).json({ success: false, message: "Update RepRate Failed" });
            }
            return res.status(200).json({ success: true, message: "Update RepRate Successfully !!!" });
        } catch (error) {
            return res.status(500).json("Interval Server Error");
        }

    }
    //[POST] api/media/rate/delete/:id
    async delete(req, res) {
        const Reprate = await RepRates.findOne({ _id: req.params.id });
        if (!rate) {
            return res.status(404).json("Rate Not Found");
        }
        try {
            const updateRep = await RepRates.findOneAndUpdate({ _id: req.body.idRep }, newRep, { new: true })
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
            const repRates = await RepRates.find({ idRate: rates[i]._id });
            var newRep = [];
            for (let j = 0; j < repRates.length; j++) {
                const staff = await Customer.findOne({ _id: repRates[j].idStaff });
                const repRate = await RepRates.aggregate([
                    { $match: { _id: repRates[j]._id } },
                    {
                        $project: {
                            staff: staff.name,
                            content: "$content",
                            dateRep: {
                                $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                            },
                        }
                    }
                ]);
                newRep.push(repRate[0]);
            }
            const customer = await Customer.findOne({ _id: rates[i].idCus });
            const product = await Product.findOne({ _id: rates[i].idProduct });
            const rate = await Rate.aggregate([
                {
                    $project: {
                        customer: customer.name,
                        star: "$star",
                        product: product.name,
                        avatar: "$avatar.url",
                        content: "$content",
                        dateRate: {
                            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                        },
                        repRate: newRep
                    }
                }
            ]);
            newRate.push(rate[0]);
            count++;
            if (count == len) {
                return res.status(200).json({ success: true, rate: newRate });
            }
        }
    }

}
module.exports = new RateController();