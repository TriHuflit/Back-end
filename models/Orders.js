const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const Orders = new Schema({
    idCus:{
        type:Schema.Types.ObjectId,
        ref:"Customers",
        require:true,
    },
    idStaff:{
        type:Schema.Types.ObjectId,
        ref:"Customers",
    },
    idVoucher:{
        type:Schema.Types.ObjectId,
        ref:"Vouchers",
    },
    phoneReviecve:{
        type:String,
        required:true,
    },
    addressRecieve:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['Chờ xác nhận',
        'Đã xác nhận',
        'Hủy đơn',
        'Đang giao hàng',
        'Đã giao'],
        default:'Chờ xác nhận',
    },
    payments:{
        type:String,
        enum:['Đã thanh toán','Thanh toán tiền mặt'],
        required:true,
    }
},{
    timestamps:true,
})
module.exports=mongoose.type("Orders",Orders);