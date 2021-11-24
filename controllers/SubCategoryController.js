const SubCategory=require('../models/SubCategorys');
const Category =require('../models/Categories');
const Brands = require('../models/Brands');
class SubCategoryController{

    //[GET] api/subcategory
    async index(req,res){
        
        const subCategory=await SubCategory.find({});
        if(!subCategory){
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        return res.status(200).json({success:true,subCategory});
    }
    //[GET] api/subcategory/detail/:id
    async detail(req,res){
        const subCategory =await SubCategory.findOne({slug:req.params.slug});
        if(!subCategory){
           
            return res.status(400).json({success:false,message:"Detail Subcategory not found !"});
        }
        return res.status(200).json({success:true,subCategory});
        
    }
    //[GET] api/subcategory/:id
    async getBrandByIdSub(req,res){
        const subCategory =await SubCategory.findOne({slug:req.params.slug});
        if(!subCategory){
           
            return res.status(400).json({success:false,message:"Subcategory not found !"});
        }
        const brand=await Brands.find({idSub:subCategory._id})
        return res.status(200).json({success:true,brand});
    }



}

module.exports=new SubCategoryController();