const Brand=require('../models/Brands');
class BrandController{

    //[GET] api/brand/
    async index(req,res){
        const brand=await Brand.find({});
        if(!brand){
            return res.status(400).json({success:false,message:"Brand not found !"});
        }
        return res.status(200).json({success:true,brand});
    }
     //[GET] api/brand/:id
    async getBrandbyIdSub(req,res){
        const brand=await Brand.find({idSub:req.params.id});
        if(!brand){
            
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        return res.status(200).json({success:true,brand});
        
    }



}

module.exports=new BrandController();