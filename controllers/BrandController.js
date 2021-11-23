const Brand=require('../models/Brands');
const Subcategory=require('../models/SubCategorys');
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
        
        const subcategory=await Subcategory.findOne({slug:req.params.slug});
        console.log(subcategory);
        if(!subcategory){
            
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        const brand =await Brand.find({idSub:subcategory._id});
        return res.status(200).json({success:true,brand});
        
    }



}

module.exports=new BrandController();