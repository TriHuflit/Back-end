const Vouchers = require('../models/Vouchers');


class VoucherController{

        //POST api/voucher/add
        async addVoucher(req,res){
            const {title,name,discount,condition,desciption,dateStart,dateEnd}=req.body;
            const newVoucher =await new Vouchers({
                title,
                name,
                discount,
                condition,
                desciption,
                dateStart,
                dateEnd
            });
            if(!newVoucher){
                res.status(400).json({success:false,message:"Add Voucher failed"});
            }
            newVoucher.save();
            res.status(200).json({success:true,message:"Add Voucher succesfully",newVoucher});
        }
       
        // PUT api/voucher/update/:id
        async UpdateVoucher(req,res){
            const {title,name,discount,condition,desciption,dateStart,dateEnd}=req.body;
            const newVoucher ={
                title,
                name,
                discount,
                condition,
                desciption,
                dateStart,
                dateEnd
            };
            const UpdateVoucher= await Vouchers.findOneAndUpdate({_id:req.params.id},newVoucher,{new:true});
            if(!UpdateVoucher){
                res.status(400).json({success:false,message:"Update Voucher failed"});
            }
            res.status(200).json({success:true,message:"Update Voucher succesfully",UpdateVoucher});
        }

         //DELETE
         async DeleteVoucher(req,res){
            const {name,discount,condition,dateStart,dateEnd}=req.body;
            const newVoucher =await new Vouchers({
                name,
                discount,
                condition,
                dateStart,
                dateEnd
            });
            if(!newVoucher){
                res.status(400).json({success:false,message:"Add Voucher failed"});
            }
            newVoucher.save();
            res.status(200).json({success:true,message:"Add Voucher succesfully"});
        }


}

module.exports=new VoucherController();