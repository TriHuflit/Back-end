const Rate = require('../models/Rates');
const OrderDetails = require("../models/OrderDetails");
class RateController {
    //[POST] api/rate/:id
    async rate(req, res) {
        const { idProduct, idOrder, rateNumber, rateContent } = req.body;
        const rate = new Rate({
            idCus: req.params.id,
            idProduct: idProduct,
            start: rateNumber,
            content: rateContent
        })
        await rate.save();
        if (!rate) {
            return res.status(400).json({ success: false, message: "Rated Product Failed !" });
        }
        const orderdetail = await OrderDetails.findOne({ idOrder: idOrder });
        orderdetail.status = "Đã đánh giá";
        orderdetail.save();
        if (!orderdetail) {
            return res.status(400).json({ success: false, message: "Change status Orderdetail Failed !" });
        }
        return res.status(200).json({ success: true, message: "Rate Product Successfully !" });
    }
}
module.exports = new RateController();