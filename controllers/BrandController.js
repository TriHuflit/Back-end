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
    async detail(req,res){
        
        const brand =await Brand.findOne({slug:req.params.slug});
        if(!brand){
            return res.status(400).json({success:false,message:"Brand not found!"});
        }
        return res.status(200).json({success:true,brand});
        
    }

    async create(req,res){
        const {name,subCategory}=req.body;
        const idSub=await Subcategory.findOne({name:subCategory}).select('_id');
        if(!idSub){
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        const newBrand = await new Brand({idSub,name});
        return res.status(200).json({success:true,message:"add Brand successfully"});
    }

}

module.exports=new BrandController();